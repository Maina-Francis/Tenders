import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { keywords } from './filters/filter.keywords';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Tender } from './schemas/tender.schema';

@Injectable()
export class TenderService {
  constructor(
    @InjectModel(Tender.name) private tenderModel: mongoose.Model<Tender>,
    private httpService: HttpService,
  ) {}

  //   Get all open tenders filtered by keywords
  async getTenders(): Promise<string> {
    const url = 'https://tenders.go.ke/api/TenderDisplay/OpenTenders/Open/';
    const { data } = await firstValueFrom(this.httpService.get(url));

    const newData = [];

    // Filter data by keywords
    let filteredData: Tender[] = [];
    for (let i = 0; i < keywords.length; i++) {
      filteredData = data.filter((tender) =>
        tender.title.toLowerCase().includes(keywords[i]),
      );
      newData.push(filteredData);
    }

    // Check if the data already exists, then add it to the db if it doesn't
    for (let i = 0; i < filteredData.length; i++) {
      const checkFromDb = await this.tenderModel.find({
        id_tenderdetails: filteredData[i].id_tenderdetails,
      });

      if (checkFromDb.length == 0)
        await this.tenderModel.create(filteredData[i]);
    }

    return 'Successfully updated the tender data';
  }
}
