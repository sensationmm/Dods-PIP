import { Article, MultipleEmailTemplateInput, ProcessAlertParameters, config } from '../../domain';
import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { CollectionAlertRecipientRepository, CollectionAlertsRepository, DocumentRepository } from '@dodsgroup/dods-repositories';
import { getMultipleSnippetEmailBody, groupByFunction } from '../../templates/multipleSnippetAlert';

import moment from "moment";

const { dods: { downstreamEndpoints: { apiGatewayBaseURL, frontEndURL } } } = config;

export const processAlert: AsyncLambdaHandler<ProcessAlertParameters> = async (
    data
) => {

    const { alertId } = data;

    const alertResponse: any = await CollectionAlertsRepository.defaultInstance.getAlert(data);

    const alertRecipients = await CollectionAlertRecipientRepository.defaultInstance.listAlertRecipients(alertId)
    const elasticQuery = alertResponse.alert.elasticQuery;

    const mapElasticQuery = JSON.parse(elasticQuery)

    const today = new Date()

    let lastExecuteDate = alertResponse.alert.lastExecutedAt

    if (!lastExecuteDate) {
        lastExecuteDate = moment().subtract(7, 'd').format('YYYY-MM-DD');
    }

    mapElasticQuery.query.bool.must = [{
        bool: {
            filter: {
                range: {
                    contentDateTime: {
                        gte: lastExecuteDate,
                        lte: moment(today).format('YYYY-MM-DD')
                    }
                }
            }
        }
    }]

    const searchContentParameters = {
        query: mapElasticQuery,
        baseURL: apiGatewayBaseURL
    }

    const documentsResponse: any = await DocumentRepository.defaultInstance.searchContent(searchContentParameters)

    const foundHits: Array<any> = documentsResponse.response.data.es_response.hits.hits;

    let articles: Array<Article> = foundHits.map((hit) => {
        const article = hit._source

        const documentDate = new Date(Date.parse(article.contentDateTime)).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

        return {
            id: article.documentId,
            title: article.documentTitle,
            date: documentDate,
            url: `${frontEndURL}/library/document/${article.documentId}`,
            content: article.documentContent,
            informationType: {
                name: article.informationType,
                icon: `${frontEndURL}/email/icon-sm-document.png`
            },
            contentSource: {
                name: article.contentSource,
                icon: `${frontEndURL}/email/image-placeholder-2.png`
            },
            source: article.contentSource

        }
    })

    if (!articles.length) {
        return new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Not Documents for this period of time'
        });
    }

    const uniqueArticles = Array.from(new Set(articles.map(a => a.id)))
        .map(id => {
            return articles.find(a => a.id === id)
        })

    const groupedArticles = groupByFunction(uniqueArticles, 'source')

    const sectionsTitles = Object.keys(groupedArticles)

    const emailSections = sectionsTitles.map((section) => {

        return {
            title: section,
            icon: `${frontEndURL}/email/image-placeholder.png`,
            articles: groupedArticles[section]
        }
    })

    const emailRecipients = alertRecipients.map((recipient) => { return recipient.emailAddress })

    const currentDate = new Date().toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    const emailBodyHandler: MultipleEmailTemplateInput = {
        date: currentDate,
        url: frontEndURL,
        headline: alertResponse.alert.title,
        sections: emailSections
    };

    const emailContent = await getMultipleSnippetEmailBody(emailBodyHandler);

    const emailParameters = {
        to: emailRecipients,
        from: "test@somoglobal.com",
        subject: alertResponse.alert.title,
        mimeType: "text/html",
        content: emailContent
    }

    const emailResponse: any = await DocumentRepository.defaultInstance.sendEmail(emailParameters, apiGatewayBaseURL);

    //const emailResponse = { success: true }

    if (emailResponse.success) {

        await CollectionAlertsRepository.defaultInstance.updateLastExecute(alertId)

        await Promise.all(uniqueArticles.map((article: any) => CollectionAlertsRepository.defaultInstance.createAlertDocumentRecord({
            alertId: alertResponse.alert.id,
            documentId: article.id
        })))


        return new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'alert schedule with ID ' + data.alertId + ' from collection ' + data.collectionId + ' triggered'
        });
    }
    else {

        return new HttpResponse(HttpStatusCode.BAD_REQUEST, {
            success: false,
            message: 'Problem Sending email'
        });

    }

};
