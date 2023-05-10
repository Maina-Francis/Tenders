import { Controller, Get } from '@nestjs/common';
import { TenderService } from './tender.service';

@Controller('tenders')
export class TenderController {
  constructor(private readonly appService: TenderService) {}

  //   Get all open tenders
  @Get()
  getTenders(): Promise<any> {
    return this.appService.getTenders();
  }
}
