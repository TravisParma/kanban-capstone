import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deleteUser } from '../../businessLogic/userLogic'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Process event: ', event)

    const userId = event.headers.userId

    await deleteUser(userId);

    return {
        statusCode: 204,
        headers: {'Access-Control-Allow-Origin': '*'},
        body:'delete success'
    }
}