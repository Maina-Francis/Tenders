import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Client } from '@microsoft/microsoft-graph-client';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tender } from '../schemas/tender.schema';
import { Cron } from '@nestjs/schedule';
import { AxiosRequestConfig } from 'axios';

@Injectable()
export class TodoService {
  private graphClient: Client;

  constructor(
    private readonly httpService: HttpService,
    @InjectModel('newTenders') private readonly todoModel: Model<Tender>,
  ) {
    this.graphClient = Client.init({
      authProvider: async (done) => {
        const token = await this.getAccessToken();
        done(null, token);
      },
    });
  }

  private async getAccessToken(): Promise<string> {
    // TODO: Implement code to obtain access token from .env file
    console.log('Breakpoint 1');
    return process.env.accessToken;
  }

  @Cron('0 0 7 * * 1-6') // Schedule to update To-Do list with all new open tenders monday - saturday @7am
  async createTodoListFromCollection() {
    const todos = await this.todoModel.find({}).exec();
    const accessToken = await this.getAccessToken();
    // console.log(todos);
    console.log('Breakpoint 2');

    const options: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    console.log('Breakpoint 3');

    const list = await this.graphClient
      .api(`/users/{process.env.user_id}/todo/lists`)
      .post({ displayName: `Tenders to Watchout For`, ...options });

    console.log('Breakpoint 4');

    const createdTodos = await Promise.all(
      todos.map((todo) =>
        this.graphClient
          .api(
            `/users/{process.env.user_id}/todo/lists/${process.env.taskListId}/tasks`,
          )
          .post({
            title: todo.title,
            body: {
              content: `Procuring Entity : ${todo.pename},
              Procurement Method : ${todo.procurementmethod},
              Submission Method : ${todo.submissionmethod},
              Closing Date : ${todo.closedate},
              Financial Year : ${todo.financialyr},
              Addendum Added : ${todo.addendumadded},
              Link To Tender : https://tenders.go.ke/OneTender/${todo.id_tenderdetails} `,
              contentType: 'text',
              ...options,
            },
          }),
      ),
    );

    console.log('end of the todo service');
    return { list, todos: createdTodos };
  }
}
