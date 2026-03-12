import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from '@prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { ApplicationModule } from './application/application.module';
import { ConsultantModule } from './consultant/consultant.module';
import { OfferModule } from './offer/offer.module';
import { CompanyModule } from './company/company.module';
import { auth } from './auth/auth';
import { ProfileSetupModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule.forRoot({ auth }),
    PrismaModule,
    ApplicationModule,
    UsersModule,
    ConsultantModule,
    OfferModule,
    CompanyModule,
    ProfileSetupModule,
  ],
})
export class AppModule {}
