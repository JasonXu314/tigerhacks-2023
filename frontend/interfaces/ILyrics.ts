import { ILine } from "./ILine";

export interface ILyrics {
	error: boolean;
    syncType: string;
    lines: ILine[];
}

