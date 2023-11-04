import { ISong } from '../interfaces/ISong';
import { Images } from '../lib/Images';

export const SongList: ISong[] = [
	{
		name: 'Dance The Night',
		artist: 'Dua Lipa',
		img: Images.DuaLipa,
        track: require('../assets/musicMinus/dancethenight.mp3'),
	},
	{
		name: 'Oops!... I Did It Agin',
		artist: 'Britney Spears',
		img: Images.Britney,
		track: require('../assets/musicMinus/oopsididitagain.mp3'),
	},
	{
		name: 'My Heart Will Go on',
		artist: 'Celine Dion',
		img: Images.CelineDion,
		track: require('../assets/musicMinus/myheartwillgoon.mp3'),
	},
	{
		name: 'Zombie',
		artist: 'The Cranberries',
		img: Images.Cranberries,
		track: require('../assets/musicMinus/cranberries.mp3'),
	},
	{
		name: 'Save Your Tears',
		artist: 'The Weeknd',
		img: Images.Weeknd,
		track: require('../assets/musicMinus/saveyourtears.mp3'),
	},
];
