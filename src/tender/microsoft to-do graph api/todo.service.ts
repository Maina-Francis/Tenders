import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Client } from '@microsoft/microsoft-graph-client';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tender } from '../schemas/tender.schema';
import { AxiosRequestConfig } from 'axios';
import { AuthProviderCallback } from '@microsoft/microsoft-graph-client';

@Injectable()
export class TodoService {
  private graphClient: Client;
  private taskListId: string; // Added taskListId property

  constructor(
    private readonly httpService: HttpService,
    @InjectModel('newTenders') private readonly todoModel: Model<Tender>,
  ) {
    this.graphClient = Client.init({
      authProvider: (done: AuthProviderCallback) => {
        this.getAccessToken()
          .then((token) => done(null, token))
          .catch((error) => done(error, null));
      },
    });
    //Create the task list when the service is initialized
    this.createTaskList();
  }

  // Retrieve access token using client credentials
  private async getAccessToken(): Promise<string> {
    const requestBody = `client_id=${encodeURIComponent(
      process.env.client_id,
    )}&scope=https%3A%2F%2Fgraph.microsoft.com%2F.default&client_secret=${encodeURIComponent(
      process.env.TenderSecret,
    )}&grant_type=client_credentials`;

    try {
      const response = await this.httpService
        .post(
          `https://login.microsoftonline.com/${process.env.tenant_id}/oauth2/v2.0/token`,
          requestBody,
          {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          },
        )
        .toPromise();

      const accessToken = response.data.access_token;

      // console.log('Access Token ', accessToken);

      return accessToken;
    } catch (error) {
      console.error('Error fetching access token:', error);
      throw error;
    }
  }

  private async createTaskList() {
    const accessToken = await this.getAccessToken();
    const options: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const listEndpoint = `https://graph.microsoft.com/v1.0/users/${process.env.user_id}/todo/lists`;

    try {
      // Check if the task list already exists
      const existingLists = await this.graphClient.api(listEndpoint).get();
      const tenderList = existingLists.value.find(
        (list) => list.displayName === 'New Tenders',
      );

      if (tenderList) {
        this.taskListId = tenderList.id;
        return;
      }

      // Create the task list if it doesn't exist
      const list = await this.graphClient.api(listEndpoint).post({
        displayName: 'New Tenders',
        ...options,
      });

      this.taskListId = list.id;
    } catch (error) {
      console.error('Error creating task list:', error);
      throw error;
    }
  }

  async createTodoListFromCollection() {
    const todos = await this.todoModel.find({}).exec();
    const accessToken = await this.getAccessToken();
    const options: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const tasksEndpoint = `https://graph.microsoft.com/v1.0/users/${process.env.user_id}/todo/lists/${this.taskListId}/tasks`;

    try {
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

          return task;
        }),
      );

      return { todos: createdTodos };
    } catch (error) {
      console.error('An error occurred:', error);
      throw error;
    }
  }
}
