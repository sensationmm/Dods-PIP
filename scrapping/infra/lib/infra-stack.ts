import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3nots from '@aws-cdk/aws-s3-notifications';
import { ContentWriter } from 'istanbul-lib-report';

export class InfraStackDev extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    var stage = process.env.stage ? process.env.stage : 'dev';
    const bucketName = 'Dods-content-extraction-' + stage;

    const bucket = new s3.Bucket(this, bucketName, {
      bucketName: cdk.PhysicalName.GENERATE_IF_NEEDED,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      cors: [
        {
          allowedMethods: [
            s3.HttpMethods.GET,
            s3.HttpMethods.POST,
            s3.HttpMethods.PUT,
          ],
          allowedOrigins: ["*"],
          allowedHeaders: ["*"],
        },
      ],
    });

    const gotContent = new lambda.Function(this, 'contentHandler', {
      runtime: lambda.Runtime.PYTHON_3_8,
      code: lambda.Code.fromAsset('handlers'),
      handler: 'content.handler'
    })

    bucket.addObjectCreatedNotification(new s3nots.LambdaDestination(gotContent));
  }
}
