import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  root() {
    return {
      name: 'Vivah Verse API',
      status: 'ok',
      docs: '/api',
      graphql: '/graphql',
      health: '/health',
    };
  }
}
