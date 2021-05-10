# Kanban App - Udacity Capstone

Serverless App created for the Cloud Developer Udacity nanprogram capstone

# Functionality

This is the backend of an application that uses Kanban principles for tasks with the added feature of creating and joining a public task so effort cna be shared.

# Serverless Architecture
* APIs for Users and Tasks
* Individual permissions for each call
* Monitoring setup for each call using AWS X-Ray
* DynamoDB for User information, dsigned in a way that it could be replaced by a outsid service
* DynamoDB for Task information

# User Details
## Fields in USERS dynamodb database

* `id` (string) - a generated unique id for user
* `userName` (string) - Custom name for a user
* `wipLimit` (number) - Limit of tasks a user can have 'in progress'
* `active` (string) - Either 'y' or 'n' identifying if user is active
* `createdAt` (string) - date and time when an item was created

## User APIs
* `GetUsers: GET /users` - Returns all the users by the provided 'active' header, either 'y' or 'n'.
* `CreateUser: POST /users` - Creates a user and validates username is not duplicated.
* `UpdateUser: PATCH /users{userid}` - Updates the user and validates the userid exisits int the Users DB.
* `DeleteUser: DELETE /users{userId}` - Deletes the user in the Users DB using the userId.

## User Functions
* `getUsers` - Returns all the users by the provided 'active' is either 'y' or 'n'.
JSON Return:
```json
{
    "items": [
        {
            "userName": "testuser2",
            "createdAt": "1620343112428",
            "active": "y",
            "wipLimit": 6,
            "id": "14eefe62-8c3c-482e-af83-0cadcf2de044"
        },
        {
            "userName": "testuser4",
            "createdAt": "1620343140604",
            "active": "y",
            "wipLimit": 2,
            "id": "8fc41164-9978-45f4-9e54-619884ede80a"
        }
    ]
}
```

* `createUser` - Creates a user in the Users DB. Utilizes model `Users.ts` file

JSON input:
```json
{
    "userName": "Smith1234",
    "wipLimit": 4
}
```
JSON return:
```json
{
    "item": {
        "id": "cfa87929-26d4-485a-9bf6-4d1bd858e52b",
        "createdAt": "1620503779188",
        "active": "y",
        "userName": "Smith1234",
        "wipLimit": 4
    }
}
```
* `updateUser` - Updates the user in the Users DB.
JSON input:
```json
{
    "userName": "Smith1234",
    "wipLimit": 5,
    "active": "y"
}
```
* `deleteUser` - Deletes the user in the Users DB.
* `getUser` - Returns the details of a single user from the userid

# Tasks Details
## Fields in TASKS dynamodb database

* `taskId` (string) - a unique id
* `name` (string) - short name for a task
* `description` (string) - describes the task
* `createdAt` (string) - date and time when an item was created
* `state` (string) - tells if a task is public or private
* `column` (string) - tells which column the task is in (backlog, in progress, completed)
* `userId` (string) - user that created the task

## Task APIs
* `GetTasks: GET /tasks` - Get all tasks for user
* `CreateTask: POST /tasks` - Create a new task
* `UpdateTask: PATCH /tasks/{taskid}` - Update a task
* `DeleteTask: DELETE /tasks/{taskid}` - Delete a task
* `GetPublicTasks: GET /public/tasks` - Get all Public tasks
* `JoinPublicTask: POST /public/tasks/{taskid}` - Join a public task by having the task created in your tasks

## Task Functions

* `getTasks` - Returns all Tasks for a current user. A user id can be extracted from userid header

JSON Return:
```json
{
    "items": [
        {
            "column": "backlog",
            "taskId": "874dbf9d-7684-412c-9e0c-f350c203905d",
            "userId": "abc123",
            "createdAt": "1620087821184",
            "description": "test task2",
            "name": "test123",
            "state": "public"
        },
        {
            "column": "backlog",
            "taskId": "711cc67a-7175-400e-b8f1-e2ce907f26b0",
            "userId": "abc123",
            "createdAt": "1620179089218",
            "description": "this is a test",
            "name": "test public task4",
            "state": "private"
        }
    ]
}
```

* `createTask` - Creates a new task using the user id and returns the new task details. The 'column' field is automatically set to 'backlog' on creation. Utilizes model `CreateTaskFunction.ts` file

JSON Input:
```json
{
  "name": "Workout Wednesday",
  "description": "Lets workout!",
  "state": "public"
}
```

JSON Return:
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


* `updateTask` - Updates a single task of provided taskId
JSON Input:
```json
{
  "name": "Workout Wednesday",
  "description": "Lets workout!",
  "state": "public",
  "column": "in progress"
}
```

* `deleteTask` - Deletes a single task of provided taskId
* `getPublictasks` - Returns all Tasks that have a 'state' of public

JSON Return:
```json
{
    "items": [
        {
            "column": "backlog",
            "taskId": "874dbf9d-7684-412c-9e0c-f350c203905d",
            "userId": "abc123",
            "createdAt": "1620087821184",
            "description": "test task2",
            "name": "test123",
            "state": "public"
        },
        {
            "column": "backlog",
            "taskId": "711cc67a-7175-400e-b8f1-e2ce907f26b0",
            "userId": "123alk",
            "createdAt": "1620179089218",
            "description": "this is a test",
            "name": "test public task4",
            "state": "public"
        }
    ]
}
```

* `JoinPublicTask` - Takes the UserId and the ID of the task to join and returns the details of the new private task.

JSON Input:
```json
{ "items": [
    {
        "column": "backlog",
        "taskId": "874dbf9d-7684-412c-9e0c-f350c203905d",
        "userId": "abc123",
        "createdAt": "1620087821184",
        "description": "test task2",
        "name": "test123",
        "state": "public"
    }
`]
}
```

# Postman Tests and Requests

## Tests Collection

## Requests Collection

# X-Ray Screenshots

![Alt text](screenshots/AWSX-Ray1.png?raw=true "Image 1")

![Alt text](screenshots/AWSX-Ray2.png?raw=true "Image 2")

# API Gateway Screenshot

# DynamoDb Screenshot

