import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome to SAQR ERP System!';
  }

  getStatus() {
    return {
      status: 'running',
      service: 'SAQR ERP Backend',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }
}