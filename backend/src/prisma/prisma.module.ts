import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
	imports: [],
	controllers: [],
	providers: [PrismaService]
})
export class PrismaModule {}

