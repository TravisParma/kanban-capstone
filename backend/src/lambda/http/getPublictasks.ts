import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getPublictasks } from '../../businessLogic/taskLogic'


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  console.log('Process event: ', event)

try {
  const state = "public";
  const tasks = await getPublictasks(state);

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
    body: JSON.stringify({ "error": 'Error - ' + e })
  }
}
  
}