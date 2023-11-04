import { createContext } from 'react';
import { ISong } from '../interfaces/ISong';
import { Images } from './Images';
import { Audio } from 'expo-av';

interface IProps {
	song: ISong;
	setSong: any;
	room: string;
	setRoom: any;
	startBgMusic: () => void;
	stopBgMusic: () => void;
	name: string;
	setName: any;
	avatar: string;
	setAvatar: any;
}

export const AppContext = createContext<IProps>({
	song: {
		name: 'Dance The Night',
		artist: 'Dua Lipa',
		img: Images.duaLipa,
		track: 'pathtotrack',
	},
	setSong: (a: ISong) => {},
	room: '',
	setRoom: (a: string) => {},
	startBgMusic: () => {},
	stopBgMusic: () => {},
	name: '',
	setName: (a: string) => {},
	avatar: '',
	setAvatar: (a: string) => {},
});
