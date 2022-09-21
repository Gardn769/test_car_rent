import { DatabaseModule } from './../../database/database.module';
import { RentService } from './rent.service';
import { RentController } from './rent.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule],
  controllers: [RentController],
  providers: [RentService],
})
export class RentModule {}
