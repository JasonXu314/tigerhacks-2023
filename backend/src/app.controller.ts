import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Param, Post, StreamableFile, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Room } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { memoryStorage } from 'multer';
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
		try {
			const player = await this.service.createPlayer(id, name);
			try {
				const otp = this.gateway.allocateOTP(id, player);

				return { otp };
			} catch (err) {
				await this.service.deletePlayer(id, player.id);
				throw err;
			}
		} catch (err) {
			if (err instanceof PrismaClientKnownRequestError) {
				throw new BadRequestException('Invalid username');
			} else {
				throw err;
			}
		}
	}

	@Post('/rooms/:id/submit')
	@HttpCode(HttpStatus.OK)
	@UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
	public submitRecording(@Param('id') id: string, @UploadedFile() file: Express.Multer.File, @Body('id') userId: string): void {
		this.gateway.submitRecording(id, Number(userId), file.buffer);
	}

	@Get('/rooms/:id/recordings/:playerId')
	public getRecording(@Param('id') roomId: string, @Param('playerId') playerId: number): StreamableFile {
		const recording = this.gateway.getRecording(roomId, playerId);

		return new StreamableFile(recording, { type: 'audio/mp3', disposition: 'attachment; filename="recording.mp3"' });
	}
}

