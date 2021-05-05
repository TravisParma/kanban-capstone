import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

//import { getUserId } from '../utils'
import { getTasks } from '../../businessLogic/taskLogic'


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  console.log('Process event: ', event)

try {
  //const userId = getUserId(event)
  const userId = "abc123"
  const tasks = await getTasks(userId);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items: tasks
    })
  }
} catch (e) {
  return {
    statusCode: 400,
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3000",
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({ "error": 'Error' })
  }
}
  
}