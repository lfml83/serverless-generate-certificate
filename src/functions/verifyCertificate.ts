import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient"


export const handle: APIGatewayProxyHandler = async (event) => {
  // http:url?nome

  const { id } = event.pathParameters;

  const response = await document.query({
    TableName: "users_certificates",
    KeyConditionExpression: "id = :id",
    ExpressionAttributeValues: {
      ":id":id
    }
  }).promise();

  const userCertificate = response.Items[0]// pegar a primeira posiçao 

  if(userCertificate){
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Certificado valido",
        name: userCertificate.name,
        url: `https://serverlesscertificateignitegenerator.s3.amazonaws.com/${id}.pdf`
      })
    }
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: "Certificado inválido!"
    })
  }
} ;