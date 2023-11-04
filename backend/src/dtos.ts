import { Player } from '@prisma/client';
import { IsIn, IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { fi } from './utils/utils';

export class JoinRoomDTO {
	@IsString()
	@Length(1, 16)
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

export interface InitRosterDTO {
	type: 'INIT_ROSTER';
	players: Player[];
}

export interface ClientErrorDTO {
	type: 'CLIENT_ERROR';
}

