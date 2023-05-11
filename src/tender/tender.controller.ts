import { Controller, Get } from '@nestjs/common';
import { TenderService } from './tender.service';

@Controller('tenders')
export class TenderController {
  constructor(private readonly appService: TenderService) {}

  //   Get all open tenders filtered by provided keywords
  @Get()
  async getTenders(): Promise<string> {
    return await this.appService.getTenders();
  }

  @Get('new')
  async getNewTenders() {
    return await this.appService.getNewTenders();
  }
}
