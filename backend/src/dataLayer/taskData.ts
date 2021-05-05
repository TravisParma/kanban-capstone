import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { TaskEntry } from '../models/TaskEntry';
import { UpdateTaskEntry } from '../models/UpdateTaskEntry';

export class TaskData {

    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly tasksTable = process.env.MYKANBAN_TABLE,
        ) {}

        async getTasks(userId: string): Promise<TaskEntry[]>{

        const queryParams = {
            TableName: this.tasksTable,
            KeyConditionExpression: "#a = :a",
            ExpressionAttributeNames: {
                "#a": "userId"
            },
            ExpressionAttributeValues: {
                ":a": userId
            }
          }
        
          const result = await this.docClient.query(queryParams).promise();
        
          const tasks = result.Items

          return tasks as TaskEntry[];
        }

        async createTask(item: TaskEntry): Promise<TaskEntry>{

            await this.docClient.put({
                TableName: this.tasksTable,
                Item: item
              }).promise()

            return item;
        }

        async deleteTask(taskId: string, userId: string){

            const params = {
                TableName: this.tasksTable,
                Key: {
                  userId: userId,
                  taskId: taskId
                },
                ReturnValues: 'NONE',
              };
            
              await this.docClient.delete(params).promise();
        }

        async updateTask(taskId: string, userId: string, taskEntry: UpdateTaskEntry){

            const params = {
                TableName: this.tasksTable,
                Key: {
                  userId: userId,
                  taskId: taskId
                },
                ExpressionAttributeNames: {
                  '#task_name': 'name',
                  '#task_status': 'status',
                },
                ExpressionAttributeValues: {
                  ':name': taskEntry.name,
                  ':description': taskEntry.description,
                  ':status': taskEntry.status,
                },
                UpdateExpression: 'SET #task_name = :name, description = :description, #task_status = :status',
                ReturnValues: 'ALL_NEW',
              };
            
              const result = await this.docClient.update(params).promise();

              return result.Attributes as TaskEntry;
        }
}