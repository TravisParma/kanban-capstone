import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTaskFunction } from '../../models/CreateTaskFunction'
import { createTask } from '../../businessLogic/taskLogic'
import { getUser } from '../../businessLogic/userLogic'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Process event: ', {event: event})

  const userId = event.headers.userid

  if ((await getUser(userId)).Count < 1) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }, body: "User does not exist"
    }
  }

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