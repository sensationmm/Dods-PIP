import { Logger } from "@dodsgroup/dods-lambda";
import { CustomMessageTriggerEvent } from "aws-lambda";
import { AsyncLambdaMiddleware } from "nut-pipe";
import { config } from '../../../domain';

export const customMessage: AsyncLambdaMiddleware<CustomMessageTriggerEvent, CustomMessageTriggerEvent> = async (event) => {

    Logger.info('customMessage Entry', { source: event.triggerSource, request: JSON.stringify(event.request) });

    if (event.userPoolId === config.aws.resources.cognito.userPoolId) {
        if (event.triggerSource === "CustomMessage_ForgotPassword" || event.triggerSource === 'CustomMessage_AdminCreateUser') {
            const codeEncoded = event.request.codeParameter;
            const emailEncoded = encodeURIComponent(Buffer.from(event.request.userAttributes['email']).toString('base64'));
            const resetPasswordPageUrl = `${config.dods.downstreamEndpoints.resetPasswordUrl}?code=${codeEncoded}&uid=${emailEncoded}`;

            event.response.emailMessage = `Please click link to reset your password. ${resetPasswordPageUrl}`;
        } else if (event.triggerSource === 'CustomMessage_SignUp') {
            event.response.emailSubject = 'Your verification code';
            event.response.emailMessage = 'Your verification code is {####}.';
        }
    }

    return event;
};