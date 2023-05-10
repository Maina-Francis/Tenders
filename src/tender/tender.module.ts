import { Module } from '@nestjs/common';
import { TenderController } from './tender.controller';
import { HttpModule } from '@nestjs/axios';
import { TenderService } from './tender.service';

@Module({
  imports: [HttpModule],
  controllers: [TenderController],
  providers: [TenderService],
})
export class TenderModule {}
