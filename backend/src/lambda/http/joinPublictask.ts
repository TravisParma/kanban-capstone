import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { getUser } from "../../businessLogic/userLogic"
import { createTask, getTask } from '../../businessLogic/taskLogic'
import { CreateTaskFunction } from '../../models/CreateTaskFunction'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Process event: ', {event: event})

    const taskId = event.pathParameters.taskId
    const userId = event.headers.userid

// Validate User and task exist
    if ((await getUser(userId)).Count < 1) {
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*'
          }, body: "User dose not exist"
        }
      }
    
    const taskBody = await getTask(taskId)

    if (taskBody.Count < 1) {
       return {
         statusCode: 400,
         headers: {
           'Access-Control-Allow-Origin': '*'
         }, body: "Task dose not exist"
        }
      }

    const newTask: CreateTaskFunction = {
        "name": taskBody.Items[0].name,
        "description": taskBody.Items[0].description,
        "state": "private"
    }
    
    const item = await createTask(newTask, userId)

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        item
      })
    }
}