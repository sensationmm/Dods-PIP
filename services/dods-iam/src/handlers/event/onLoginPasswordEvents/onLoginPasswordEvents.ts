import { EventBridgeEvent } from "aws-lambda";
import { PasswordUpdated } from "../../../domain";
import { LoginRepository } from '../../../repositories';
import { Logger } from '../../../utility';

export const onLoginPasswordEvents = async (event: EventBridgeEvent<string, PasswordUpdated>): Promise<void> => {

    // {
    //     "version": "0",
    //     "id": "62224083-04d5-b394-9058-f81ab207c9bc",
    //     "detail-type": "NewUserCreated",
    //     "source": "Login",
    //     "account": "390773179818",
    //     "time": "2021-09-14T01:00:57Z",
    //     "region": "eu-west-1",
    //     "resources": [],
    //     "detail": {
    //         "userName": "kenanhancer@hotmail.com",
    //         "lastPassword": "DZn9tDX3pE_s"
    //     }
    // }

    // {
    //     "callbackWaitsForEmptyEventLoop": true,
    //     "functionVersion": "$LATEST",
    //     "functionName": "dods-iam-dev-kenan-onLoginPasswordEvents",
    //     "memoryLimitInMB": "1024",
    //     "logGroupName": "/aws/lambda/dods-iam-dev-kenan-onLoginPasswordEvents",
    //     "logStreamName": "2021/09/14/[$LATEST]c473fea4110f4d40ae5451b9444de741",
    //     "invokedFunctionArn": "arn:aws:lambda:eu-west-1:390773179818:function:dods-iam-dev-kenan-onLoginPasswordEvents",
    //     "awsRequestId": "ab615371-0557-4f0b-86cc-a3e07b3565a4"
    // }

    await LoginRepository.defaultInstance.saveLastPassword(event.detail.userName, event.detail.lastPassword);

};