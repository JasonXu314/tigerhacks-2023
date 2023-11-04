import { Body, Controller, Param, Post } from '@nestjs/common';
import { Room } from '@prisma/client';
import { AppGateway } from './app.gateway';
import { AppService } from './app.service';
import { JoinRoomDTO } from './dtos';

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
}

