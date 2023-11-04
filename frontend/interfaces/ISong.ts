import { AVPlaybackSource } from "expo-av";

export interface ISong {
	name: string;
	artist: string;
	img: any;
	track: AVPlaybackSource;
}
