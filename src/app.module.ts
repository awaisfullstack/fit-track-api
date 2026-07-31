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
import { TrackingModule } from './modules/tracking/tracking.module';
import { CoachModule } from './modules/coach/coach.module';
import { AuditModule } from './modules/audit/audit.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './modules/mail/mail.module';

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

    TrackingModule,

    CoachModule,

    AuditModule,

    NotificationsModule,

    AuthModule,

    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
