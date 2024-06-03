import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import {scheduleJob} from "node-schedule";

import { EmployeeService } from './employee/employee.service';
import { PrismaService } from './prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix("api");
  app.enableCors({
    methods: "GET,PUT,POST,DELETE",
    origin: "http://localhost:3000",
    credentials: true
  });
  await app.listen(3001);
}

(async () => {
  await bootstrap();

  const empService = new EmployeeService(new PrismaService(new ConfigService()));
  //this function here runs it's callback every month
  //I'm using this function to increment employees' paid leaves by 1.75 each month
  scheduleJob('0 0 0 1 */1 *', async function(){
    await empService.incrementPaidLeaves();
  });
})()
