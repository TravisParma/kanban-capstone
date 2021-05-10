import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTaskEntry } from '../../models/UpdateTaskEntry'
import { updateTask } from '../../businessLogic/taskLogic'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Process event: ', event)

  const taskId = event.pathParameters.taskId
  const userId = event.headers.userid

  const updatedTask: UpdateTaskEntry = JSON.parse(event.body)

  await updateTask(taskId, userId, updatedTask)

  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      updatedTask
    })
  }

}
