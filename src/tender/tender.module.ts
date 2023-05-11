import { Module } from '@nestjs/common';
import { TenderController } from './tender.controller';
import { HttpModule } from '@nestjs/axios';
import { TenderService } from './tender.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Tender, TenderSchema } from './schemas/tender.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      {
        name: Tender.name,
        schema: TenderSchema,
      },
      {
        name: 'newTenders',
        schema: TenderSchema,
      },
    ]),
  ],
  controllers: [TenderController],
  providers: [TenderService],
})
export class TenderModule {}
