import { IPlayer } from './IPlayer';
import { IRoom } from './IRoom';

export interface ISession extends IRoom {
	host: IPlayer;
	contestants: IPlayer[];
	players: IPlayer[];
}

