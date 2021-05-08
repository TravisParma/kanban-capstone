# Kanban App - Udacity Capstone

Serverless App created for the Cloud Developer Udacity nanprogram capstone

# Functionality

This is the backend of an application that uses Kanban principles for tasks with the added feature of creating and joining a public task so effort cna be shared.

# Serverless architecture used
* APIs for Users and Tasks
* Individual permissions for each call
* Monitoring setup for each call using AWS X-Ray
* DynamoDB for User information, dsigned in a way that it could be replaced by a outsid service
* DynamoDB for Task information


# Fields in USERS dynamodb database

* `userId` (string) - a generated unique id
* `userName` (string) - Custom name for a user
* `wipLimit` (number) - Limit of tasks a user can have 'in progress'
* `active` (string) - Either 'y' or 'n' identifying if user is active
* `createdAt` (string) - date and time when an item was created

# User Functions
* `getUsers` - 
* `createUser` - 
* `updateUser` - 
* `deleteUser` - 

# User APIs
* `GetUsers: GET /users` - 
* `CreateUser: POST /users` - 
* `UpdateUser: PATCH /users{userid}` - 
* `DeleteUser: DELETE /users{userId}` -

# Fields in TASKS dynamodb database

* `taskId` (string) - a unique id
* `name` (string) - short name for a task
* `description` (string) - describes the task
* `createdAt` (string) - date and time when an item was created
* `state` (string) - tells if a task is public or private
* `column` (string) - tells which column the task is in (backlog, in progress, completed)
* `userId` (string) - user that created the task

# Task APIs
* `GetTasks: GET /tasks` - 
* `CreateTask: POST /tasks` - 
* `UpdateTask: PATCH /tasks{taskid}` - 
* `DeleteTask: DELETE /tasks{taskid}` -

# Task Functions

* `getTasks` - Returns all Tasks for a current user. A user id can be extracted from userid header
* `createTask` - Creates a new task using the user id and returns the new task details. Utilizes model `CreateTaskFunction.ts` file
* `updateTask` - Updates a single task
* `deleteTask` - Deletes a single task
* `getPublictasks` - Returns all Tasks that have a 'state' of public

JSON format of the request:

```json
{
  "column": "backlog",
  "name": "Workout Wednesday",
  "description": "Lets workout!",
  "state": "public"
}
```

JSON format of the response:

```json
{
    "item": {
      "taskId": "1234",
      "userId": "user1234",
      "createdAt": "1620238676541",
      "column": "backlog",
      "name": "Workout Wednesday",
      "description": "Lets workout!",
      "state": "public"
    }
}
```

* `UpdateTodo` - should update a TODO item created by a current user. A shape of data send by a client application to this function can be found in the `UpdateTodoRequest.ts` file

It receives an object that contains three fields that can be updated in a TODO item:

```json
{
  "name": "Buy bread",
  "dueDate": "2019-07-29T20:01:45.424Z",
  "done": true
}
```

The id of an item that should be updated is passed as a URL parameter.

It should return an empty body.

* `DeleteTodo` - should delete a TODO item created by a current user. Expects an id of a TODO item to remove.

It should return an empty body.

* `GenerateUploadUrl` - returns a pre-signed URL that can be used to upload an attachment file for a TODO item.

It should return a JSON object that looks like this:

```json
{
  "uploadUrl": "https://s3-bucket-name.s3.eu-west-2.amazonaws.com/image.png"
}
```

All functions are already connected to appropriate events from API Gateway.

An id of a user can be extracted from a JWT token passed by a client.

You also need to add any necessary resources to the `resources` section of the `serverless.yml` file such as DynamoDB table and S3 bucket.


# Frontend

The `client` folder contains a web application that can use the API that should be developed in the project.

This frontend should work with your serverless application once it is developed, you don't need to make any changes to the code. The only file that you need to edit is the `config.ts` file in the `client` folder. This file configures your client application just as it was done in the course and contains an API endpoint and Auth0 configuration:

```ts
const apiId = '...' API Gateway id
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: '...',    // Domain from Auth0
  clientId: '...',  // Client id from an Auth0 application
  callbackUrl: 'http://localhost:3000/callback'
}
```

## Authentication

To implement authentication in your application, you would have to create an Auth0 application and copy "domain" and "client id" to the `config.ts` file in the `client` folder. We recommend using asymmetrically encrypted JWT tokens.

# Best practices

To complete this exercise, please follow the best practices from the 6th lesson of this course.

## Logging

The starter code comes with a configured [Winston](https://github.com/winstonjs/winston) logger that creates [JSON formatted](https://stackify.com/what-is-structured-logging-and-why-developers-need-it/) log statements. You can use it to write log messages like this:

```ts
import { createLogger } from '../../utils/logger'
const logger = createLogger('auth')

// You can provide additional information with every log statement
// This information can then be used to search for log statements in a log storage system
logger.info('User was authorized', {
  // Additional information stored with a log statement
  key: 'value'
})
```


# Grading the submission

Once you have finished developing your application, please set `apiId` and Auth0 parameters in the `config.ts` file in the `client` folder. A reviewer would start the React development server to run the frontend that should be configured to interact with your serverless application.

**IMPORTANT**

*Please leave your application running until a submission is reviewed. If implemented correctly it will cost almost nothing when your application is idle.*

# Suggestions

To store TODO items, you might want to use a DynamoDB table with local secondary index(es). A create a local secondary index you need to create a DynamoDB resource like this:

```yml

TodosTable:
  Type: AWS::DynamoDB::Table
  Properties:
    AttributeDefinitions:
      - AttributeName: partitionKey
        AttributeType: S
      - AttributeName: sortKey
        AttributeType: S
      - AttributeName: indexKey
        AttributeType: S
    KeySchema:
      - AttributeName: partitionKey
        KeyType: HASH
      - AttributeName: sortKey
        KeyType: RANGE
    BillingMode: PAY_PER_REQUEST
    TableName: ${self:provider.environment.TODOS_TABLE}
    LocalSecondaryIndexes:
      - IndexName: ${self:provider.environment.INDEX_NAME}
        KeySchema:
          - AttributeName: partitionKey
            KeyType: HASH
          - AttributeName: indexKey
            KeyType: RANGE
        Projection:
          ProjectionType: ALL # What attributes will be copied to an index

```

To query an index you need to use the `query()` method like:

```ts
await this.dynamoDBClient
  .query({
    TableName: 'table-name',
    IndexName: 'index-name',
    KeyConditionExpression: 'paritionKey = :paritionKey',
    ExpressionAttributeValues: {
      ':paritionKey': partitionKeyValue
    }
  })
  .promise()
```

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless TODO application.

# Postman collection

An alternative way to test your API, you can use the Postman collection that contains sample requests. You can find a Postman collection in this project. To import this collection, do the following.

Click on the import button:

![Alt text](images/import-collection-1.png?raw=true "Image 1")


Click on the "Choose Files":

![Alt text](images/import-collection-2.png?raw=true "Image 2")


Select a file to import:

![Alt text](images/import-collection-3.png?raw=true "Image 3")


Right click on the imported collection to set variables for the collection:

![Alt text](images/import-collection-4.png?raw=true "Image 4")

Provide variables for the collection (similarly to how this was done in the course):

![Alt text](images/import-collection-5.png?raw=true "Image 5")
