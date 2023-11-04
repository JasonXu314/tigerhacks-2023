interface ILine {
    startTimeMs: string;
    words: string;
    syllables: string[];
    endTimeMs: string;
}

export interface ILyrics {
	error: boolean;
    syncType: string;
    lines: ILine[];
}

