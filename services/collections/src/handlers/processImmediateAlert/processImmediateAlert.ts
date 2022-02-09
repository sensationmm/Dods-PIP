import { Article, ProcessImmediateAlertParameters, config } from '../../domain';
import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { CollectionAlertRecipientRepository, CollectionAlertsRepository, DocumentRepository } from '@dodsgroup/dods-repositories';

import { singleEmailBodyHandler } from '../../templates/singleFullAlert';

const { dods: { downstreamEndpoints: { apiGatewayBaseURL, frontEndURL } } } = config;

export const processImmediateAlert: AsyncLambdaHandler<ProcessImmediateAlertParameters> = async (
    parameters
) => {
    const { alertId, documentId } = parameters;

    try {

        const alertResponse = await CollectionAlertsRepository.defaultInstance.getAlertById({ alertId: alertId });

        if (!alertResponse.alert.title) {
            return new HttpResponse(HttpStatusCode.BAD_REQUEST, {
                success: false,
                message: 'Alert must have title'
            });
        }

        const recipients = await CollectionAlertRecipientRepository.defaultInstance.listAlertRecipients(alertId);

        if (recipients.length > 0) {

            const emailRecipients = recipients.map((recipient) => { return recipient.emailAddress })

            const documentResponse: any = await DocumentRepository.defaultInstance.getDocumentById(documentId, apiGatewayBaseURL);

            if (documentResponse.success) {

                const documentData = documentResponse.data;

                const documentDate = new Date(Date.parse(documentData.contentDateTime)).toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                });


                const documentContent: Article = {
                    id: documentData.documentId,
                    title: documentData.documentTitle,
                    informationType: {
                        icon: `${frontEndURL}/email/icon-sm-document.png`,
                        name: documentData.informationType,
                    },
                    contentSource: {
                        icon: `${frontEndURL}/email/image-placeholder-2.png`,
                        name: documentData.contentSource,
                    },
                    date: documentDate,
                    url: `${frontEndURL}/library/document/${documentData.documentId}`,
                    content: documentData.documentContent,
                }


                const emailBodyHandler = {
                    date: documentDate,
                    headline: alertResponse.alert.title,
                    url: frontEndURL,
                    section:
                    {
                        title: documentData.contentSource,
                        icon: `${frontEndURL}/email/image-placeholder.png`,
                        article: documentContent
                    }
                };

                const emailContent = await singleEmailBodyHandler(emailBodyHandler);

                const emailParameters = {
                    to: emailRecipients,
                    from: "test@somoglobal.com",
                    subject: alertResponse.alert.title,
                    mimeType: "text/html",
                    content: emailContent
                }

                await DocumentRepository.defaultInstance.sendEmail(emailParameters, apiGatewayBaseURL);

                await CollectionAlertsRepository.defaultInstance.createAlertDocumentRecord({ documentId: documentData.documentId, alertId: alertResponse.alert.id });

                return new HttpResponse(HttpStatusCode.OK, {
                    success: true,
                    message: 'Inmetiadte Alert ' + parameters.alertId + ' with document  ' + parameters.documentId + ' triggered'
                });
            }
        }

        else {
            return new HttpResponse(HttpStatusCode.BAD_REQUEST, {
                success: false,
                message: 'There are not recipients for these alert'
            });
        }

    } catch (error: any) {
        return new HttpResponse(HttpStatusCode.BAD_REQUEST, {
            success: false,
            message: error.message
        });
    }
}

