import { Module } from '@nestjs/common';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';
import { UsersModule } from 'src/users/users.module';
import { ConsultantModule } from 'src/consultant/consultant.module';

@Module({
  imports: [UsersModule, ConsultantModule],
  controllers: [ApplicationController],
  providers: [ApplicationService],
  exports: [ApplicationService],
})
export class ApplicationModule {}
