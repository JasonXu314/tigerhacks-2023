import { Body, Controller, Get, NotFoundException, Param, Post, StreamableFile } from '@nestjs/common';
import { Room } from '@prisma/client';
import { createReadStream } from 'fs';
import { AppGateway } from './app.gateway';
import { AppService } from './app.service';
import { JoinRoomDTO } from './dtos';
import { Song } from './models';

@Controller()
export class AppController {
	constructor(private readonly service: AppService, private readonly gateway: AppGateway) {}

	@Post('/rooms')
	public async createRoom(): Promise<Room> {
		return this.service.createRoom();
	}

	@Post('/rooms/:id/join')
	public async joinRoom(@Param('id') id: string, @Body() { name }: JoinRoomDTO): Promise<{ otp: string }> {
		const player = await this.service.createPlayer(id, name);
		const otp = this.gateway.allocateOTP(id, player);

		return { otp };
	}

	@Get('/songs')
	public getSongs(): Song[] {
		return this.service.getSongs();
	}

	@Get('/songs/:id/full')
	public getFullSong(@Param('id') id: number): StreamableFile {
		if (this.getSongs().find((song) => song.id === id)) {
			return new StreamableFile(createReadStream(`assets/${id}/full.mp3`));
		} else {
			throw new NotFoundException('Invalid song ID');
		}
	}
}

