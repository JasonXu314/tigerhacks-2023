import { BadRequestException, ConsoleLogger, Inject, NotFoundException, forwardRef } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Player, Room } from '@prisma/client';
import { randomBytes, randomInt } from 'crypto';
import { WebSocket } from 'ws';
import { AppService } from './app.service';
import { AddContestantDTO, ClaimAcknowledgeDTO, ClaimCodeDTO, ClientErrorDTO, RemoveContestantDTO, SetSongDTO, SubmitVoteDTO } from './dtos';
import { AVATARS } from './utils/utils';

interface PlayerData extends Player {
	socket: WebSocket;
	avatar: string;
}

interface Session extends Room {
	host: PlayerData | null;
	contestants: [Player | null, Player | null];
	claims: Map<string, (client: WebSocket) => PlayerData>;
	players: PlayerData[];
	recordings: [Buffer | null, Buffer | null];
	votes: number[];
}

@WebSocketGateway({ path: '/gateway' })
export class AppGateway implements OnGatewayConnection<WebSocket>, OnGatewayDisconnect<WebSocket> {
	private readonly logger = new ConsoleLogger('Gateway');
	private readonly rooms: Session[] = [];
	private readonly sockTimeouts: Map<WebSocket, NodeJS.Timeout> = new Map();

	public constructor(@Inject(forwardRef(() => AppService)) private readonly service: AppService) {}

	public allocateRoom(room: Room): void {
		this.rooms.push({ ...room, host: null, contestants: [null, null], recordings: [null, null], votes: [], claims: new Map(), players: [] });
	}

	public allocateOTP(roomId: string, player: Player): string {
		const room = this.rooms.find((session) => session.id === roomId);

		if (!room) {
			throw new NotFoundException('Invalid room code!');
		}

		const numPlayers = room.players.length + room.claims.size;

		// TODO: edit this for 1v1 and 2v2 rooms
		if (numPlayers >= 10) {
			throw new BadRequestException('Room is full');
		}

		const otp = randomBytes(64).toString('hex');

		const timeout = setTimeout(() => {
			room.claims.delete(otp);
		}, 2500);

		room.claims.set(otp, (client: WebSocket) => {
			clearTimeout(timeout);

			room.claims.delete(otp);

			const availableAvatars = AVATARS.filter((avatar) => !room.players.some((player) => player.avatar === avatar));
			const avatar = availableAvatars[randomInt(availableAvatars.length)];
			const playerData: PlayerData = { ...player, socket: client, avatar };
			room.players.push(playerData);
			if (room.players.length === 1) {
				room.host = playerData;
			}

			return playerData;
		});

		return otp;
	}

	// note: this does not have complete authentication mechanism for userId
	public submitRecording(roomId: string, userId: number, data: Buffer): void {
		for (const room of this.rooms) {
			if (room.id === roomId) {
				if (room.contestants[0]?.id === userId) {
					room.recordings[0] = data;
					if (room.recordings[1] !== null) {
						room.players.forEach((p) => {
							p.socket.send(JSON.stringify({ type: 'PLAY_RECORDINGS', ids: room.contestants.map((p) => p!.id) }));
						});
					}

					return;
				} else if (room.contestants[1]?.id === userId) {
					room.recordings[1] = data;
					if (room.recordings[0] !== null) {
						room.players.forEach((p) => {
							p.socket.send(JSON.stringify({ type: 'PLAY_RECORDINGS', ids: room.contestants.map((p) => p!.id) }));
						});
					}

					return;
				} else {
					throw new BadRequestException('User is not a contestant');
				}
			}
		}

		throw new NotFoundException('Invalid room id');
	}

	public getRecording(roomId: string, playerId: number): Buffer {
		for (const room of this.rooms) {
			if (room.id === roomId) {
				if (room.contestants[0]?.id === playerId) {
					return room.recordings[0]!;
				} else if (room.contestants[1]?.id === playerId) {
					return room.recordings[1]!;
				} else {
					throw new BadRequestException('Invalid player id (not contestant)');
				}
			}
		}

		throw new NotFoundException('Invalid room id');
	}

	public handleConnection(client: WebSocket) {
		const timeout = setTimeout(() => {
			client.close();
			this.sockTimeouts.delete(client);
		}, 2500);

		this.sockTimeouts.set(client, timeout);
	}

	public handleDisconnect(client: WebSocket) {
		for (const room of this.rooms) {
			for (const player of room.players) {
				if (client === player.socket) {
					room.players = room.players.filter((p) => p !== player);
					return;
				}
			}
		}

		this.logger.warn('Client disconnect did not find socket');
	}

	@SubscribeMessage('CLAIM')
	public async claimCode(@MessageBody() { otp }: ClaimCodeDTO, @ConnectedSocket() client: WebSocket): Promise<ClaimAcknowledgeDTO | ClientErrorDTO> {
		this.logger.log(`claiming ${otp}`);
		for (const room of this.rooms) {
			if (room.claims.has(otp)) {
				const claim = room.claims.get(otp)!;

				const player = claim(client);
				const { id, host, contestants, players } = room;
				this.logger.log(`claimed ${otp}`);
				setImmediate(() => {
					this.logger.log('sent init room');
					client.send(
						JSON.stringify({
							type: 'INIT_ROOM',
							room: {
								id,
								host: this._pruneSocket(host!),
								contestants: contestants.flatMap((p) => (p ? [this._pruneSocket(p)] : [])),
								players: players.map(this._pruneSocket)
							}
						})
					);
				});
				room.players.forEach((p) => {
					if (p !== player) {
						p.socket.send(JSON.stringify({ type: 'JOIN', player: this._pruneSocket(player) }));
					}
				});
				return { type: 'CLAIM_ACK' };
			}
		}

		setImmediate(() => client.close());
		return { type: 'CLIENT_ERROR' };
	}

	@SubscribeMessage('ADD_CONTESTANT')
	public async addContestant(@MessageBody() { id, position }: AddContestantDTO, @ConnectedSocket() client: WebSocket): Promise<ClientErrorDTO | void> {
		this.logger.log(`adding contestant ${id}`);
		const data = this._resolve(client);

		if (!data) {
			this.logger.log('no data, closing socket');
			client.close();
			return { type: 'CLIENT_ERROR' };
		}

		const { player, room } = data;

		if (player !== room.host) {
			return { type: 'CLIENT_ERROR' };
		}

		const contestant = room.players.find((p) => p.id === id);
		this.logger.log('found contestant');

		if (contestant) {
			if (position === 'LEFT') {
				// TODO: revisit this if we do implement stage part
				room.contestants[0] = contestant;
				room.players.forEach(({ socket }) => socket.send(JSON.stringify({ type: 'ADD_CONTESTANT', id, position })));
				return;
			} else if (position === 'RIGHT') {
				room.contestants[1] = contestant;
				room.players.forEach(({ socket }) => socket.send(JSON.stringify({ type: 'ADD_CONTESTANT', id, position })));
				return;
			} else {
				if (!room.contestants[0]) {
					this.logger.log('assigning to place 1');
					room.contestants[0] = contestant;
					room.players.forEach(({ socket }) => socket.send(JSON.stringify({ type: 'ADD_CONTESTANT', id })));
					return;
				} else if (!room.contestants[1]) {
					this.logger.log('assigning to place 1');
					room.contestants[1] = contestant;
					room.players.forEach(({ socket }) => socket.send(JSON.stringify({ type: 'ADD_CONTESTANT', id })));
					return;
				} else {
					return { type: 'CLIENT_ERROR' };
				}
			}
		} else {
			return { type: 'CLIENT_ERROR' };
		}
	}

	@SubscribeMessage('REMOVE_CONTESTANT')
	public async removeContestant(@MessageBody() { id }: RemoveContestantDTO, @ConnectedSocket() client: WebSocket): Promise<ClientErrorDTO | void> {
		this.logger.log(`removing contestant ${id}`);
		const data = this._resolve(client);

		if (!data) {
			client.close();
			return { type: 'CLIENT_ERROR' };
		}

		const { player, room } = data;

		if (player !== room.host) {
			return { type: 'CLIENT_ERROR' };
		}

		if (room.contestants[0]?.id === id) {
			room.contestants[0] = null;
			room.players.forEach((player) => player.socket.send(JSON.stringify({ type: 'REMOVE_CONTESTANT', id })));
		} else if (room.contestants[1]?.id === id) {
			room.contestants[1] = null;
			room.players.forEach((player) => player.socket.send(JSON.stringify({ type: 'REMOVE_CONTESTANT', id })));
		} else {
			return { type: 'CLIENT_ERROR' };
		}
	}

	@SubscribeMessage('SET_SONG')
	public async setSong(@MessageBody() { name }: SetSongDTO, @ConnectedSocket() client: WebSocket): Promise<ClientErrorDTO | void> {
		const data = this._resolve(client);

		if (!data) {
			client.close();
			return { type: 'CLIENT_ERROR' };
		}

		const { player, room } = data;

		if (player !== room.host) {
			return { type: 'CLIENT_ERROR' };
		}

		room.players.forEach((player) => player.socket.send(JSON.stringify({ type: 'SET_SONG', name })));
	}

	@SubscribeMessage('START_GAME')
	public async startGame(@MessageBody() { name }: SetSongDTO, @ConnectedSocket() client: WebSocket): Promise<ClientErrorDTO | void> {
		const data = this._resolve(client);

		if (!data) {
			client.close();
			return { type: 'CLIENT_ERROR' };
		}

		const { player, room } = data;

		if (player !== room.host) {
			return { type: 'CLIENT_ERROR' };
		}

		room.players.forEach((player) => player.socket.send(JSON.stringify({ type: 'START_GAME', name })));
	}

	@SubscribeMessage('SUBMIT_VOTE')
	public async submitVote(@MessageBody() { id }: SubmitVoteDTO, @ConnectedSocket() client: WebSocket): Promise<ClientErrorDTO | void> {
		const data = this._resolve(client);

		if (!data) {
			client.close();
			return { type: 'CLIENT_ERROR' };
		}

		const { player, room } = data;

		if (player === room.contestants[0] || player === room.contestants[1] || (room.contestants[0]?.id !== id && room.contestants[1]?.id !== id)) {
			return;
		}

		const playerIdx = room.players.indexOf(player);
		room.votes[playerIdx] = id;

		const numPlayers = room.players.length; // don't count claims because they can't vote anyway
		if (room.votes.reduce((count, id) => (id === undefined ? count : count + 1), 0) === numPlayers - 2) {
			const p1Votes = room.votes.reduce((count, id) => (id === room.contestants[0]?.id ? count + 1 : count), 0),
				p2Votes = room.votes.reduce((count, id) => (id === room.contestants[1]?.id ? count + 1 : count), 0);

			if (p1Votes === p2Votes) {
				room.players.forEach((player) => player.socket.send(JSON.stringify({ type: 'VOTING_END', result: 'TIED' })));
			} else {
				const winner = p1Votes > p2Votes ? room.contestants[0]!.id : room.contestants[1]!.id;
				await this.service.incrementScore(room.id, winner);
				room.players.find((p) => p.id === winner)!.score++;

				room.players.forEach((player) =>
					player.socket.send(JSON.stringify({ type: 'VOTING_END', result: { winner, votes: Math.max(p1Votes, p2Votes) } }))
				);
			}
		}
	}

	@SubscribeMessage('CLOSE_ROUND')
	public closeRound(@ConnectedSocket() client: WebSocket): ClientErrorDTO | void {
		const data = this._resolve(client);

		if (!data) {
			client.close();
			return { type: 'CLIENT_ERROR' };
		}

		const { player, room } = data;

		if (player !== room.host) {
			return { type: 'CLIENT_ERROR' };
		}

		room.contestants = [null, null];
		room.recordings = [null, null];
		room.votes = [];
	}

	private _pruneSocket<T extends Record<string, any>>(obj: T): { [K in keyof T]: T[K] extends WebSocket ? never : T[K] } {
		return Object.fromEntries(Object.entries(obj).filter(([, val]) => !(val instanceof WebSocket))) as any;
	}

	private _resolve(client: WebSocket): { player: PlayerData; room: Session } | null {
		for (const room of this.rooms) {
			for (const player of room.players) {
				if (client === player.socket) {
					return { player, room };
				}
			}
		}

		return null;
	}
}

