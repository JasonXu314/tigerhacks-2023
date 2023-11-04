import React, { PropsWithChildren, useContext, useState } from 'react';
import { IPlayer } from '../interfaces/IPlayer';

interface GameDataCtx {
	players: IPlayer[] | null;
	contestants: IPlayer[] | null;
	host: IPlayer | null;

	setPlayers: React.Dispatch<React.SetStateAction<IPlayer[] | null>>;
	setContestants: React.Dispatch<React.SetStateAction<IPlayer[] | null>>;
	setHost: React.Dispatch<React.SetStateAction<IPlayer | null>>;
}

const GameContext = React.createContext<GameDataCtx>({
	contestants: null,
	host: null,
	players: null,
	setPlayers: () => {},
	setContestants: () => {},
	setHost: () => {}
});

export const GameProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [players, setPlayers] = useState<IPlayer[] | null>(null);
	const [contestants, setContestants] = useState<IPlayer[] | null>(null);
	const [host, setHost] = useState<IPlayer | null>(null);

	return <GameContext.Provider value={{ players, contestants, host, setPlayers, setContestants, setHost }}>{children}</GameContext.Provider>;
};

interface GameData {
	players: IPlayer[];
	contestants: IPlayer[];
	host: IPlayer;
}

interface GameOperations {
	init(players: IPlayer[], contestants: IPlayer[], host: IPlayer): void;
	addContestant(id: number): void;
	removeContestant(id: number): void;
	addPlayer(player: IPlayer): void;
}

export function useGame(): GameOperations & { data: GameData | null } {
	const { contestants, host, players, setContestants, setHost, setPlayers } = useContext(GameContext);

	return {
		data: contestants && host && players ? { contestants, host, players } : null,
		init: (players, contestants, host) => {
			setContestants(contestants);
			setHost(host);
			setPlayers(players);
		},
		addContestant: (id) => {
			if (contestants && players) {
				setContestants([...contestants, players.find((p) => p.id === id)!]);
			} else {
				console.warn('Adding contestant before init');
			}
		},
		removeContestant: (id) => {
			if (contestants) {
				setContestants(contestants.filter((p) => p.id !== id));
			} else {
				console.warn('Removing contestant before init');
			}
		},
		addPlayer: (player) => {
			if (players) {
				setPlayers([...players, player]);
			} else {
				console.warn('Adding player before init');
			}
		}
	};
}

