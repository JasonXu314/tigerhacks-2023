import React, { PropsWithChildren, useContext, useState } from 'react';
import { IPlayer } from '../interfaces/IPlayer';

interface GameDataCtx {
	players: IPlayer[] | null;
	contestants: IPlayer[] | null;
	host: IPlayer | null;
	results: 'TIED' | { winner: number; votes: number } | null;

	setPlayers: React.Dispatch<React.SetStateAction<IPlayer[] | null>>;
	setContestants: React.Dispatch<React.SetStateAction<IPlayer[] | null>>;
	setHost: React.Dispatch<React.SetStateAction<IPlayer | null>>;
	setResults: React.Dispatch<React.SetStateAction<'TIED' | { winner: number; votes: number } | null>>;
}

const GameContext = React.createContext<GameDataCtx>({
	contestants: null,
	host: null,
	players: null,
	results: null,
	setPlayers: () => {},
	setContestants: () => {},
	setHost: () => {},
	setResults: () => {}
});

export const GameProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [players, setPlayers] = useState<IPlayer[] | null>(null);
	const [contestants, setContestants] = useState<IPlayer[] | null>(null);
	const [host, setHost] = useState<IPlayer | null>(null);
	const [results, setResults] = useState<'TIED' | { winner: number; votes: number } | null>(null);

	return (
		<GameContext.Provider value={{ players, contestants, host, results, setPlayers, setContestants, setHost, setResults }}>
			{children}
		</GameContext.Provider>
	);
};

interface GameData {
	players: IPlayer[];
	contestants: IPlayer[];
	host: IPlayer;
	results: 'TIED' | { winner: number; votes: number } | null;
}

interface GameOperations {
	init(players: IPlayer[], contestants: IPlayer[], host: IPlayer): void;
	addContestant(id: number): void;
	removeContestant(id: number): void;
	addPlayer(player: IPlayer): void;
	setResults(results: 'TIED' | { winner: number; votes: number }): void;
	incrementScore(id: number): void;
	reset(): void;
}

export function useGame(): GameOperations & { data: GameData | null } {
	const { contestants, host, players, results, setContestants, setHost, setPlayers, setResults } = useContext(GameContext);

	return {
		data: contestants && host && players ? { contestants, host, players, results } : null,
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
		},
		setResults: (results) => {
			setResults(results); // no warning here, but probably should check maybe
		},
		incrementScore: (id) => {
			if (players) {
				setPlayers(players.map((p) => (p.id === id ? { ...p, score: p.score + 1 } : p)));
			} else {
				console.warn('Incrementing score before init');
			}
		},
		reset: () => {
			setResults(null);
		}
	};
}

