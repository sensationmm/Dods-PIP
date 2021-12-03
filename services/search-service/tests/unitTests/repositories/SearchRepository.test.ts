import {GetContentParameters } from '../../../src/domain';
import { SearchRepository } from '../../../src/repositories/SearchRepository';
import elasticsearch from "../../../src/elasticsearch"

jest.mock('../../../src/elasticsearch');

const FUNCTION_NAME = SearchRepository.defaultInstance.getContent.name

afterEach(() => {
    jest.clearAllMocks();
});

describe(`${FUNCTION_NAME} handler`, () => {

    test('getContent valid output on query', async () => {
        const data: GetContentParameters = { contentId: 'str-uuid' };
        const mock_es_response = {
            hits: {hits: [{
                        _id: "1",
                        _score: "1",
                        _source: {
                    documentId: "653e380ee1bd435c8d1b47c6b0d1b685",
                    jurisdiction: "UK",
                    documentTitle: "To ask the Chancellor of the Exchequer, what estimate he has made of the number of people who were not receiving tax...",
                    organisationName: "HM Treasury",
                    sourceReferenceFormat: "application/xhtml+xml",
                    sourceReferenceUri: "https://www.parliament.uk/business/publications/written-questions-answers-statements/written-question/Commons/2021-08-18/41055/",
                    createdBy: "",
                    internallyCreated: true,
                    schemaType: "QADocument",
                    contentSource: "House of Commons",
                    informationType: "Written Questions Tabled",
                    contentDateTime: "2021-08-18T18:31:37",
                    createdDateTime: "2021-08-18T18:31:37",
                    ingestedDateTime: "2021-08-18T18:31:37",
                    version: "1.0",
                    countryOfOrigin: "GBR",
                    feedFormat: "",
                    language: "eng",
                    taxonomyTerms: [
                    {
                    tagId: "314",
                    facetType: "http://www.dods.co.uk/taxonomy/instance/Organisations",
                    taxonomyType: "http://xmlns.com/foaf/0.1/Organization"
                    },
                    {
                    tagId: "41beb8fc4c434ef2b94a006dc237057c",
                    facetType: "",
                    taxonomyType: ""
                    },
                    {
                    tagId: "66b1581ab6218842be1986c3df8e6a2f",
                    facetType: "",
                    taxonomyType: ""
                    },
                    {
                    tagId: "05668d365a14443b993b75b07f33ccf1",
                    facetType: "",
                    taxonomyType: ""
                    },
                    {
                    tagId: "f96e0cdaf97c644cba9259a343009b1e",
                    facetType: "",
                    taxonomyType: ""
                    }
                    ],
                    originalContent: "",
                    documentContent: ""
                    }
                    }]}}

        elasticsearch.search.mockResolvedValue(mock_es_response)

        const response = await SearchRepository.defaultInstance.getContent(data)

        expect(response).toEqual(mock_es_response);

    })

});

