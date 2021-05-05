import 'source-map-support/register'
//import { getUserId } from '../utils'
import { deleteTask } from '../../businessLogic/taskLogic'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Process event: ', event)

  const taskId = event.pathParameters.taskId
  const userId = event.headers.userid

  await deleteTask(taskId, userId);

  return {
    statusCode: 204,
    headers: {'Access-Control-Allow-Origin': '*'},
    body: ''
    }
  }
