import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { Player, Room } from '@prisma/client';
import { randomInt } from 'crypto';
import { AppGateway } from './app.gateway';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
	public constructor(private readonly prisma: PrismaService, @Inject(forwardRef(() => AppGateway)) private readonly gateway: AppGateway) {}

	public async createRoom(): Promise<Room> {
		const id = await this.generateNewRoomId();
		const room = await this.prisma.room.create({ data: { id } });
		this.gateway.allocateRoom(room);

		return room;
	}

	public async createPlayer(roomId: string, name: string): Promise<Player> {
		const room = await this.prisma.room.findUnique({ where: { id: roomId } });

		if (room === null) {
			throw new NotFoundException('Invalid room code!');
		}

		return this.prisma.player.create({ data: { name, score: 0, roomId } });
	}

	public async deletePlayer(roomId: string, id: number): Promise<Player> {
		return this.prisma.player.delete({ where: { roomId, id } });
	}

	public async incrementScore(roomId: string, id: number): Promise<Player> {
		return this.prisma.player.update({ where: { roomId, id }, data: { score: { increment: 1 } } });
	}

	private async generateNewRoomId(): Promise<string> {
		let id: string;

		do {
			id = new Array(4)
				.fill(null)
				.map(() => String.fromCharCode(65 + randomInt(26)))
				.join('');
		} while ((await this.prisma.room.findUnique({ where: { id } })) !== null);

		return id;
	}
}

