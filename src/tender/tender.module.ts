import { Module } from '@nestjs/common';
import { TenderController } from './tender.controller';
import { HttpModule } from '@nestjs/axios';
import { TenderService } from './tender.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Tender, TenderSchema } from './schemas/tender.schema';
import { TodoService } from './microsoft to-do graph api/todo.service';

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
  providers: [TenderService, TodoService],
})
export class TenderModule {}
