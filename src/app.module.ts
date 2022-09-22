import { connect } from './config/connections';
import { configurateDB } from './config/configurate-db';
import { DatabaseModule } from './database/database.module';
import { RentModule } from './modules/rent/rent.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    DatabaseModule,
    RentModule,
    ConfigModule.forRoot({
      load: [configurateDB, connect],
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
