import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTaskFunction } from '../../models/CreateTaskFunction'
//import { getUserId } from '../utils'
import { createTask } from '../../businessLogic/taskLogic'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Process event: ', {event: event})

  const userId = event.headers.userid

  const newTask: CreateTaskFunction = JSON.parse(event.body)

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