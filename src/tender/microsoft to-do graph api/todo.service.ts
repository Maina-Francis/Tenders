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
    // return accessToken;
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

    const listEndpoint = `https://graph.microsoft.com/v1.0/users/${process.env.user_id}/todo/lists`;

    const tasksEndpoint = `https://graph.microsoft.com/v1.0/users/${process.env.user_id}/todo/lists/${process.env.taskListId}/tasks`;

    try {
      console.log('Creating list...');
      const list = await this.graphClient.api(listEndpoint).post({
        displayName: 'Tenders to Watchout For',
        ...options,
      });
      console.log('List created:', list);

      console.log('Creating tasks...');
      const createdTodos = await Promise.all(
        todos.map(async (todo) => {
          const task = await this.graphClient.api(tasksEndpoint).post({
            title: todo.title,
            body: {
              content: `Procuring Entity: ${todo.pename}
              Procurement Method: ${todo.procurementmethod}
              Submission Method: ${todo.submissionmethod}
              Closing Date: ${todo.closedate}
              Financial Year: ${todo.financialyr}
              Addendum Added: ${todo.addendumadded}
              Link To Tender: https://tenders.go.ke/OneTender/${todo.id_tenderdetails}`,
              contentType: 'text',
            },
            ...options,
          });
          console.log('Task created:', task);
          return task;
        }),
      );

      console.log('End of the todo service');
      return { list, todos: createdTodos };
    } catch (error) {
      console.error('An error occurred:', error);
      throw error;
    }
  }
}
