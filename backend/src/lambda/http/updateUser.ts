import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateUser } from '../../models/UpdateUser'
import { updateUser } from '../../businessLogic/userLogic'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Process event: ', event)

    const userId = event.pathParameters.userId
    const updatedUser: UpdateUser = JSON.parse(event.body)

    await updateUser(userId, updatedUser)

    return {
        statusCode: 204,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            updatedUser
          })
    }
}