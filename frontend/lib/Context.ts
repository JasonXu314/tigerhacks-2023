import { createContext } from 'react';
import { ISong } from '../interfaces/ISong';
import { Images } from './Images';

interface IProps {
	song: string;
	setSong: any;
	room: string;
	setRoom: any;
    bgMusic: boolean;
	startBgMusic: () => void;
	stopBgMusic: () => void;
	name: string;
	setName: any;
	avatar: string;
	setAvatar: any;
}

export const AppContext = createContext<IProps>({
	song: 'Dance The Night',
	setSong: (a: ISong) => {},
	room: '',
	setRoom: (a: string) => {},
    bgMusic: true,
	startBgMusic: () => {},
	stopBgMusic: () => {},
	name: '',
	setName: (a: string) => {},
	avatar: '',
	setAvatar: (a: string) => {}
});

