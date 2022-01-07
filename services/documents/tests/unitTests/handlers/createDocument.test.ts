import { createContext, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { config, CreateDocumentParameters, CreateDocumentParametersV2, CreateNewDocument } from '../../../src/domain';
import { createDocument } from '../../../src/handlers/createDocument/createDocument';
import { putInS3 } from '../../../src/utility/aws';

const FUNCTION_NAME = createDocument.name;

const { aws: { buckets: { content: contentBucket } } } = config;

const defaultContext = createContext();

const defaultDocumentV1: CreateNewDocument = {
    jurisdiction: 'UK',
    documentTitle: 'Professional Qualifications Bill [Lords]',
    organisationName: '',
    sourceReferenceFormat: 'text/html',
    sourceReferenceUri: 'example.com',
    createdBy: '',
    internallyCreated: false,
    schemaType: '',
    contentSource: 'House of Commons',
    informationType: 'Debates',
    contentDateTime: '2021-12-15T00:00:00',
    createdDateTime: '2021-12-16T01:30:46.299913',
    ingestedDateTime: '',
    version: '1.0',
    countryOfOrigin: 'GBR',
    feedFormat: 'text/plain',
    language: 'en',
    taxonomyTerms: [],
    originalContent: '',
    documentContent: '',
};

const defaultDocumentV2: CreateDocumentParametersV2 = {
    documentId: "008f811e5ccf44d3a0df5b7f70a8e85d",
    jurisdiction: "UK",
    documentTitle: "New Which? research reveals the most sustainable savings providers",
    organisationName: "Which?",
    sourceReferenceFormat: "text/html",
    sourceReferenceUri: "https://press.which.co.uk/whichpressreleases/new-which-research-reveals-the-most-sustainable-savings-providers/",
    createdBy: "taerekim@gmail.com",
    internallyCreated: true,
    schemaType: "External",
    contentSource: "UK Stakeholder",
    contentLocation: "", // new to support ingestion (added 17 dec)
    originator: "", // new to support ingestion (added 17 dec)
    informationType: "Press Releases",
    contentDateTime: new Date(),
    createdDateTime: new Date(),
    ingestedDateTime: new Date(),
    version: "1.0",
    countryOfOrigin: "GBR",
    feedFormat: "text/plain",
    language: "en",
    aggs_fields: {
        topics: [
            "indoor air quality",
            "building industry"
        ],
        people: [
            "Kieran Mullan"
        ],
        organizations: [
            "International Assemblies"
        ],
        geography: [
            "Eastern Asia"
        ]
    },
    taxonomyTerms: [
        {
            tagId: "sdfsdfsdf",
            facetType: "Topics",
            inScheme: ["http://www.dods.co.uk/taxonomy/instance/Topics"],
            termLabel: "Term 4",
            ancestorTerms: [
                {
                    tagId: "sdfsdfsdf",
                    termLabel: "Term 2",
                    rank: 1
                },
                {
                    tagId: "sdfsdfsdf",
                    termLabel: "Term 1",
                    rank: 0
                }
            ],
            alternative_labels: ["Term B", "Term C"]
        },
        {
            tagId: "sdfsdfsdf",
            facetType: "Topics",
            inScheme: ["http://www.dods.co.uk/taxonomy/instance/Topics"],
            termLabel: "Term 4",
            ancestorTerms: [
                {
                    tagId: "sdfsdfsdf",
                    termLabel: "Term 2",
                    rank: 1
                },
                {
                    tagId: "sdfsdfsdf",
                    termLabel: "Term 1",
                    rank: 0
                }
            ],
            alternative_labels: ["Term B", "Term C"]
        }
    ],
    originalContent: "",
    documentContent: ""
};

// jest.mock('uuid', () => ({ v4: () => '00000000-0000-0000-0000-000000000000' }));

jest.mock('uuid');

const mockedUuidv4 = uuidv4 as jest.Mock;

mockedUuidv4.mockReturnValue('00000000-0000-0000-0000-000000000000');

const mockedAjvValidate = jest.fn().mockReturnValue(true);

jest.mock('ajv', () => {
    return jest.fn(() => ({
        compile: () => () => mockedAjvValidate()
    }))
});

jest.mock('../../../src/utility/aws');

const mockedPutInS3 = putInS3 as jest.Mock;

jest.mock('moment', () => () => ({ format: () => '30-12-2021' }));

afterEach(() => {
    mockedAjvValidate.mockClear();
    mockedPutInS3.mockClear();
})

describe(`${FUNCTION_NAME} handler`, () => {
    test('Valid case - request for payload v1', async () => {

        const documentId = uuidv4();

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'New Document created.',
            data: {
                documentId,
                documentContent: defaultDocumentV1
            }
        });

        const event: CreateDocumentParameters = { document: JSON.stringify(defaultDocumentV1) };

        const response = await createDocument(event, defaultContext);

        expect(response).toEqual(expectedResponse);

        expect(mockedPutInS3).toHaveBeenCalledTimes(1);

        expect(mockedAjvValidate).toHaveBeenCalledTimes(1);
    });

    test('Invalid case - request for payload v1', async () => {
        mockedAjvValidate.mockReturnValue(false);

        const event: CreateDocumentParameters = { document: JSON.stringify(defaultDocumentV1) };

        try {
            await createDocument(event, defaultContext);

            throw new Error('Code never should come in this point');
        } catch (error: any) {
            expect(error).toBeUndefined();
        }
    });

    test('Valid case - request for payload v2', async () => {

        const documentId = uuidv4();

        const { documentTitle, contentSource, informationType } = defaultDocumentV2;

        const fileKey = `${contentSource}/${informationType}/${moment(new Date()).format('DD-MM-YYYY')}/${documentTitle}.json`;

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'New Document created.',
            data: {
                s3Location: `arn:aws:s3:::${contentBucket}/${fileKey}`,
                documentId,
                documentContent: defaultDocumentV2
            }
        });

        const event: CreateDocumentParametersV2 = defaultDocumentV2;

        const response = await createDocument(event, defaultContext);

        expect(response).toMatchObject(expectedResponse);

        expect(mockedPutInS3).toHaveBeenCalledTimes(1);

    });
});