import { ISong } from '../interfaces/ISong';
import { Images } from '../lib/Images';

export const SongList: ISong[] = [
	{
		name: 'Dance The Night',
		artist: 'Dua Lipa',
		img: Images.DuaLipa,
		track: '../assets/musicMinus/Dua Lipa - Dance The Night (minus).mp3',
	},
	{
		name: 'Oops!... I Did It Agin',
		artist: 'Britney Spears',
		img: Images.Britney,
		track: '../assets/musicMinus/Britney Spears - Oops!… I Did It Again (minus).mp3',
	},
	{
		name: 'My Heart Will Go on',
		artist: 'Celine Dion',
		img: Images.CelineDion,
		track: '../assets/musicMinus/Céline Dion - My Heart Will Go on (minus).mp3',
	},
	{
		name: 'Zombie',
		artist: 'The Cranberries',
		img: Images.Cranberries,
		track: '../assets/musicMinus/Cranberries, The - Zombie (minus 9).mp3',
	},
	{
		name: 'Save Your Tears',
		artist: 'The Weeknd',
		img: Images.Weeknd,
		track: '../assets/musicMinus/The Weeknd - Save Your Tears (minus).mp3',
	},
];
