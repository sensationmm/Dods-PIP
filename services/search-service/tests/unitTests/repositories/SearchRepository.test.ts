import {
    createPercolatorParameters,
    deletePercolatorParameters,
    GetContentParameters,
    updatePercolatorParameters
} from '../../../src/domain';
import { SearchRepository } from '../../../src/repositories/SearchRepository';

const mockIndex = jest.fn().mockReturnValue({body: ''});
const MOCK_SEARCH_RESPONSE = {
    body: {
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
            }]}}}
const mockSearch = jest.fn().mockReturnValue(MOCK_SEARCH_RESPONSE);
const mockUpdate = jest.fn().mockReturnValue(true);
const mockDelete = jest.fn().mockReturnValue(true);

jest.mock('../../../src/elasticsearch', () => ({
    index: () => mockIndex(),
    search: () => mockSearch(),
    update: () => mockUpdate(),
    delete: () => mockDelete(),
}));

afterEach(() => {
    jest.clearAllMocks();
});

describe(`SearchRepository Requests`, () => {

    test('getContent valid output on query', async () => {
        const data: GetContentParameters = { contentId: 'str-uuid' };

        const response = await SearchRepository.defaultInstance.getContent(data)

        expect(response).toEqual(MOCK_SEARCH_RESPONSE);

    });

    test('rawQuery calls elastic search', async () => {
        const response = await SearchRepository.defaultInstance.rawQuery({});

        expect(response).toEqual(MOCK_SEARCH_RESPONSE['body'])
    });

});

describe(`Schedule repository percolator tests`, () => {
    test(`createPercolator creates a percolator`, async () => {
        const createPercolatorParameters: createPercolatorParameters = {
            alertId: "123",
            query: "123",
        }
        await SearchRepository.defaultInstance.createPercolator(createPercolatorParameters)

        expect(mockIndex).toHaveBeenCalled();
    });

    test(`createPercolator updates a percolator`, async () => {
        const data: updatePercolatorParameters = {
            "alertId": "123",
            "query": "1"
        }
        await SearchRepository.defaultInstance.updatePercolator(data)

        expect(mockDelete).toHaveBeenCalled();
        expect(mockIndex).toHaveBeenCalled();
    });

    test(`deletePercolator deletes a percolator`, async () => {
        const data: deletePercolatorParameters = {
            "alertId": "123",
        }
        await SearchRepository.defaultInstance.deletePercolator(data)

        expect(mockDelete).toHaveBeenCalled();
    });
});

