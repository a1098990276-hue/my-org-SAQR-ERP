import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('api/status')
  getStatus() {
    return this.appService.getStatus();
  }

  @Get('api/health')
  healthCheck() {
    return {
      status: 'healthy',
      uptime: process.uptime(),
    };
  }
}