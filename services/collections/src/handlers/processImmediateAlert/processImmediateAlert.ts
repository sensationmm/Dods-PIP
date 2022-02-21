import { Article, ProcessImmediateAlertParameters, config } from '../../domain';
import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { CollectionAlertRecipientRepository, CollectionAlertsRepository, DocumentRepository } from '@dodsgroup/dods-repositories';

import { singleEmailBodyHandler } from '../../templates/singleFullAlert';

const { dods: { downstreamEndpoints: { apiGatewayBaseURL, frontEndURL, clientURL } } } = config;

export const processImmediateAlert: AsyncLambdaHandler<ProcessImmediateAlertParameters> = async (
    parameters
) => {
    const { alertId, docId } = parameters;

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

            const documentResponse: any = await DocumentRepository.defaultInstance.getDocumentById(docId, apiGatewayBaseURL);

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
                    url: `${clientURL}/library/document/${documentData.documentId}`,
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

                try {
                    await CollectionAlertsRepository.defaultInstance.createAlertDocumentRecord({ documentId: documentData.documentId, alertId: alertResponse.alert.id });
                } catch (error) {
                    return new HttpResponse(HttpStatusCode.OK, {
                        success: false,
                        message: 'This document has already been sent to the same recipients.'
                    });

                }

                await DocumentRepository.defaultInstance.sendEmail(emailParameters, apiGatewayBaseURL);

                return new HttpResponse(HttpStatusCode.OK, {
                    success: true,
                    message: 'Inmetiadte Alert ' + parameters.alertId + ' with document  ' + parameters.docId + ' triggered'
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

