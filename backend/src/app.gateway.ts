import { ConsoleLogger, Inject, NotFoundException, forwardRef } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Player, Room } from '@prisma/client';
import { randomBytes } from 'crypto';
import { WebSocket } from 'ws';
import { AppService } from './app.service';
import { AddContestantDTO, ClaimAcknowledgeDTO, ClaimCodeDTO, ClientErrorDTO, RemoveContestantDTO } from './dtos';

interface PlayerData extends Player {
	socket: WebSocket;
}

interface Session extends Room {
	host: Player | null;
	contestants: [Player | null, Player | null];
	claims: Map<string, (client: WebSocket) => void>;
	players: PlayerData[];
}

@WebSocketGateway({ path: '/gateway' })
export class AppGateway implements OnGatewayConnection<WebSocket>, OnGatewayDisconnect<WebSocket> {
	private readonly logger = new ConsoleLogger('Gateway');
	private readonly rooms: Session[] = [];
	private readonly sockTimeouts: Map<WebSocket, NodeJS.Timeout> = new Map();

	public constructor(@Inject(forwardRef(() => AppService)) private readonly service: AppService) {}

	public allocateRoom(room: Room): void {
		this.rooms.push({ ...room, host: null, contestants: [null, null], claims: new Map(), players: [] });
	}

	public allocateOTP(roomId: string, player: Player): string {
		const room = this.rooms.find((session) => session.id === roomId);

		if (!room) {
			throw new NotFoundException('Invalid room code!');
		}

		const otp = randomBytes(64).toString('hex');

		const timeout = setTimeout(() => {
			room.claims.delete(otp);
		}, 2500);

		room.claims.set(otp, (client: WebSocket) => {
			clearTimeout(timeout);

			room.claims.delete(otp);
			room.players.push({ ...player, socket: client });
			if (room.players.length === 1) {
				room.host = player;
			}
		});

		return otp;
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
		for (const room of this.rooms) {
			if (room.claims.has(otp)) {
				const claim = room.claims.get(otp)!;

				claim(client);
				setImmediate(() => client.send(JSON.stringify({ type: 'INIT_ROSTER', players: room.players.map(this._pruneSocket) })));
				return { type: 'CLAIM_ACK' };
			}
		}

		setImmediate(() => client.close());
		return { type: 'CLIENT_ERROR' };
	}

	@SubscribeMessage('ADD_CONTESTANT')
	public async addContestant(@MessageBody() { id, position }: AddContestantDTO, @ConnectedSocket() client: WebSocket): Promise<ClientErrorDTO | void> {
		const data = this._resolve(client);

		if (!data) {
			client.close();
			return { type: 'CLIENT_ERROR' };
		}

		const { player, room } = data;

		if (player !== room.host) {
			return { type: 'CLIENT_ERROR' };
		}

		const contestant = room.players.find((p) => p.id === id);

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
					room.contestants[0] = contestant;
					room.players.forEach(({ socket }) => socket.send(JSON.stringify({ type: 'ADD_CONTESTANT', id })));
					return;
				} else if (!room.contestants[1]) {
					room.contestants[1] = contestant;
					room.players.forEach(({ socket }) => socket.send(JSON.stringify({ type: 'ADD_CONTESTANT', id })));
					return;
				} else {
					return { type: 'CLIENT_ERROR' };
				}
			}
		}
	}

	@SubscribeMessage('REMOVE_CONTESTANT')
	public async removeContestant(@MessageBody() { id }: RemoveContestantDTO, @ConnectedSocket() client: WebSocket): Promise<ClientErrorDTO | void> {
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
		} else if (room.contestants[1]?.id === id) {
			room.contestants[1] = null;
		} else {
			return { type: 'CLIENT_ERROR' };
		}
	}

	private _pruneSocket<T extends Record<string, any>>(obj: T): { [K in keyof T]: T[K] extends WebSocket ? never : T[K] } {
		return Object.fromEntries(Object.entries(obj).filter(([, val]) => !(val instanceof WebSocket))) as any;
	}

	private _resolve(client: WebSocket): { player: Player; room: Session } | null {
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

