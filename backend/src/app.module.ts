import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
	imports: [PrismaModule],
	controllers: [AppController],
	providers: [AppService, AppGateway]
})
export class AppModule {}

