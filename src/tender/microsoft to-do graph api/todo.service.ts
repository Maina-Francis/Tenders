import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Client } from '@microsoft/microsoft-graph-client';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tender } from '../schemas/tender.schema';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TodoService {
  private graphClient: Client;

  constructor(
    private readonly httpService: HttpService,
    @InjectModel('newTenders') private readonly todoModel: Model<Tender>,
  ) {
    this.graphClient = Client.init({
      authProvider: (done) => done(null, this.getAccessToken()),
    });
  }

  private getAccessToken(): string {
    // TODO: Implement code to obtain access token from .env file
    return process.env.accessToken;
  }

  @Cron('0 0 7 * * 1-6') // Schedule to update To-Do list with all new open tenders monday - saturday @7am
  async createTodoListFromCollection() {
    const todos = await this.todoModel.find({}).exec();
    // console.log(todos);

    const list = await this.graphClient
      .api('/me/todo/lists')
      .post({ displayName: `Tenders to Watchout For` });

    const createdTodos = await Promise.all(
      todos.map((todo) =>
        this.graphClient
          .api(`/me/todo/lists/${process.env.taskListId}/tasks`)
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
            },
          }),
      ),
    );

    console.log('end of the todo service');
    return { list, todos: createdTodos };
  }
}
