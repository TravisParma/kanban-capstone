import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUsers } from '../../businessLogic/userLogic';


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  console.log('Process event: ', event)

try {
  const active = event.headers.active
  const users = await getUsers(active);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items: users
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