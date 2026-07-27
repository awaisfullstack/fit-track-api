import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { SequelizeModule } from '@nestjs/sequelize';
import { databaseConfig } from './config/database.config';
import { UsersModule } from './modules/users/users.module';
import { IntakeModule } from './modules/intake/intake.module';
import { GoalsModule } from './modules/goals/goals.module';
import { PlanEngineModule } from './modules/plan-engine/plan-engine.module';


@Module({
 imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env',
    }),

    SequelizeModule.forRoot(databaseConfig()),

    UsersModule,

    IntakeModule,

    GoalsModule,

    PlanEngineModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
