import { Prisma } from '@prisma/client';

export const withPlayers = Prisma.validator<Prisma.RoomDefaultArgs>()({
	include: {
		players: true
	}
});

export type RoomWithPlayers = Prisma.RoomGetPayload<typeof withPlayers>;

