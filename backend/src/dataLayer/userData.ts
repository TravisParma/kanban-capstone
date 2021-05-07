import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { UpdateUser } from '../models/UpdateUser';
import { Users } from '../models/Users';

export class UserData {

    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly usersTable = process.env.MYKANBANUSERS_TABLE,
        ) {}

        async getUsers(active: string): Promise<Users[]>{
            const queryParams = {
                TableName: this.usersTable,
                IndexName: "ActiveIndexes",
                KeyConditionExpression: "#a = :value",
                ExpressionAttributeNames: {
                    "#a": "active"
                },
                ExpressionAttributeValues: {
                    ":value": active
                }
            }
            
              const result = await this.docClient.query(queryParams).promise();
            
              const users = result.Items
    
              return users as Users[];
            }

        async createUser(user: Users):Promise<Users>{
            await this.docClient.put({
                TableName: this.usersTable,
                Item: user
            }).promise()

            return user;
        }

        async updateUser(userId: string, userInfo: UpdateUser){

            const params = {
                TableName: this.usersTable,
                Key: {
                  userId: userId,
                },
                ExpressionAttributeNames: {
                  'userName': 'userName',
                  'wipLimit': 'wipLimit',
                  'active': 'active',
                },
                ExpressionAttributeValues: {
                  ':userName': userInfo.userName,
                  ':wipLimit': userInfo.wipLimit,
                  ':active': userInfo.active,
                },
                UpdateExpression: 'SET userName = :userName, wipLimit = :wipLimit, active = :active',
                ReturnValues: 'ALL_NEW',
              };

              const result = await this.docClient.update(params).promise();

              return result.Attributes as Users;
        }

        async deleteUser(userId: string){

            const params = {
                TableName: this.usersTable,
                Key: {
                    userId: userId
                  },
                  ReturnValues: 'NONE',
            };

            await this.docClient.delete(params).promise();
        }
    }
