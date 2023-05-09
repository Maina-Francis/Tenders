import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('tenders')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getTenders() {
    return this.appService.getTenders();
  }
}
