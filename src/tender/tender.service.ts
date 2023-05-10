import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { keywords } from './filter.keywords';

@Injectable()
export class TenderService {
  constructor(private httpService: HttpService) {}

  //   Get all open tenders filtered by keywords
  async getTenders(): Promise<any> {
    const url = 'https://tenders.go.ke/api/TenderDisplay/OpenTenders/Open/';
    const { data } = await firstValueFrom(this.httpService.get(url));
    // console.log(data);

    const newData = [];

    for (let i = 0; i < keywords.length; i++) {
      const filteredData = data.filter((tender) =>
        tender.title.toLowerCase().includes(keywords[i]),
      );
      //   console.log(filteredData);
      newData.push(filteredData);
    }

    return newData;
  }
}
