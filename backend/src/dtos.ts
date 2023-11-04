import { IsIn, IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { fi } from './utils/utils';

export class JoinRoomDTO {
	@IsString()
	@Length(1, 12)
	name: string = fi();
}

export class ClaimCodeDTO {
	@IsString()
	otp: string = fi();
}

export class AddContestantDTO {
	@IsNumber()
	id: number = fi();

	@IsIn(['LEFT', 'RIGHT'])
	@IsOptional()
	position?: 'LEFT' | 'RIGHT';
}

export class RemoveContestantDTO {
	@IsNumber()
	id: number = fi();
}

export class SetSongDTO {
	@IsString()
	name: string = fi();
}

export interface ClaimAcknowledgeDTO {
	type: 'CLAIM_ACK';
}

export interface ClientErrorDTO {
	type: 'CLIENT_ERROR';
}

