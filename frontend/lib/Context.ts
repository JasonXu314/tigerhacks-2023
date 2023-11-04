import React, { createContext } from 'react';
import { ISong } from '../interfaces/ISong';
import Images from './Images';

interface IProps {
	song: ISong;
	setSong: any;
	room: string;
	setRoom: any;
	socket: WebSocket | null;
	startBgMusic: () => void;
	stopBgMusic: () => void;
	setSocket: React.Dispatch<React.SetStateAction<WebSocket | null>>;
}

export const AppContext = createContext<IProps>({
	song: {
		name: 'Dance The Night',
		artist: 'Dua Lipa',
		img: Images.duaLipa,
		track: 'pathtotrack'
	},
	socket: null,
	setSong: (a: ISong) => {},
	room: '',
	setRoom: (a: string) => {},
	startBgMusic: () => {},
	stopBgMusic: () => {},
	setSocket: () => {}
});

