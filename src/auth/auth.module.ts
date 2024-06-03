import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt/dist';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmployeeModule } from 'src/employee/employee.module';
import { EmailerModule } from 'src/emailer/emailer.module';

@Module({
  imports: [
    EmployeeModule,
    EmailerModule,
    ConfigModule,
    JwtModule.register({
      global: true,
      secret: new ConfigService().get("JWT_SECRET")
  })],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
