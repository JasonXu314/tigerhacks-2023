import React, { PropsWithChildren, useContext, useEffect, useRef, useState } from 'react';
import { IPlayer } from '../interfaces/IPlayer';
import { ISession } from '../interfaces/ISession';

interface WSCtx {
	socket: WS | null;
	setSocket: React.Dispatch<React.SetStateAction<WS | null>>;
}

export class WS extends WebSocket {
	private cleanups: Record<keyof WebSocketEventMap, (() => void)[]> = {
		close: [],
		error: [],
		message: [],
		open: []
	};

	public on<T extends keyof WebSocketEventMap>(evt: T, listener: (evt: WebSocketEventMap[T]) => void, once: boolean = false): () => void {
		if (once) {
			const off = this.on(evt, (evt: WebSocketEventMap[T]) => {
				listener(evt);
				off();
			});

			return off;
		} else {
			this.addEventListener(evt, listener);

			const off = () => {
				this.removeEventListener(evt, listener);
				this.cleanups[evt] = this.cleanups[evt].filter((cb) => cb !== off);
			};

			this.cleanups[evt].push(off);
			return off;
		}
	}

	public once<T extends keyof WebSocketEventMap>(evt: T, listener: (evt: WebSocketEventMap[T]) => void): () => void {
		return this.on(evt, listener, true);
	}

	public off<T extends keyof WebSocketEventMap>(evt?: T): void {
		if (evt === undefined) {
			(['close', 'error', 'message', 'open'] as const).forEach((evt) => this.off(evt));
		} else {
			this.cleanups[evt].forEach((off) => off());
		}
	}
}

const WSContext = React.createContext<WSCtx>({ socket: null, setSocket: () => {} });

export const WSProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [socket, setSocket] = useState<WS | null>(null);

	return <WSContext.Provider value={{ socket, setSocket }}>{children}</WSContext.Provider>;
};

interface WSOperations {
	connect(otp: string): void;
	disconnect(): void;
	send(msg: any): void;
}

interface WSMetadata {
	cleanup: (() => void) | null;
}

export interface ClaimAcknowledgeDTO {
	type: 'CLAIM_ACK';
}

export interface InitRoomDTO {
	type: 'INIT_ROOM';
	room: ISession;
}

export interface AddContestantDTO {
	type: 'ADD_CONTESTANT';
	id: number;
}

export interface RemoveContestantDTO {
	type: 'REMOVE_CONTESTANT';
	id: number;
}

export interface SetSongDTO {
	type: 'SET_SONG';
	name: string;
}

export interface ClientErrorDTO {
	type: 'CLIENT_ERROR';
}

export interface StartGameDTO {
	type: 'START_GAME';
}

export interface JoinDTO {
	type: 'JOIN';
	player: IPlayer;
}

export interface VotingEndDTO {
	type: 'VOTING_END';
	result: 'TIED' | { winner: number; votes: number };
}

export function useWS(): WSOperations {
	const { socket, setSocket } = useContext(WSContext);
	const meta = useRef<WSMetadata>({ cleanup: null });

	return {
		connect: (otp: string) => {
			if (!socket) {
				const sock = new WS('wss://hktn.jasonxu.dev/gateway');
				console.log('created socket');

				meta.current.cleanup = sock.once('open', () => {
					console.log('socket opened');
					sock.send(JSON.stringify({ type: 'CLAIM', data: { otp } }));
					console.log('sent claim');

					meta.current.cleanup = sock.once('message', (evt) => {
						console.log('got message');
						try {
							const msg = JSON.parse(evt.data) as ClaimAcknowledgeDTO | ClientErrorDTO;
							console.log('parsed json');

							if (msg.type === 'CLAIM_ACK') {
								console.log('claim ack');
								setSocket(sock);
							}
						} catch (err) {
							console.error(err);
						}
					});
				});
			} else {
				console.warn('Duplicate socket connect detected');
			}
		},
		disconnect: () => {
			meta.current.cleanup?.();
			socket?.close();
			socket?.off();
			setSocket(null);
		},
		send: (msg: any) => {
			if (socket) {
				if (typeof msg === 'string') {
					socket.send(msg);
				} else {
					socket.send(JSON.stringify(msg));
				}
			} else {
				console.warn('Socket send while disconnected');
			}
		}
	};
}

export function useWSSubscribe<T extends keyof WebSocketEventMap>(evt: T, listener: (evt: WebSocketEventMap[T]) => void): void {
	const { socket } = useContext(WSContext);

	useEffect(() => {
		if (socket) {
			return socket.on(evt, listener);
		}
	}, [socket, evt, listener]);
}

export function useWSMessage<T extends { type: string }>(type: T['type'], listener: (msg: T) => void): void {
	useWSSubscribe('message', (evt) => {
		try {
			const msg = JSON.parse(evt.data) as T; // typescript hack lul

			if ('type' in msg && msg.type === type) {
				listener(msg);
			}
		} catch (err) {
			console.error(err);
		}
	});
}

