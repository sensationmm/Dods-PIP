//@ts-ignore
import {TaxonomiesParameters, HttpBadRequestError, TaxonomyItem, TaxonomySearchResponse} from '../../../src/domain';
import { TaxonomyRepository } from '../../../src/repositories/TaxonomyRepository';
import elasticsearch from "../../../src/elasticsearch"

jest.mock('../../../src/elasticsearch');

const FUNCTION_NAME = "TaxonomyRepository";

afterEach(() => {
    // jest.clearAllMocks();
});

//@ts-ignore
const MOCK_ES_RESPONSE = {body: {"hits": {"total": {"value": 1, "relation" : "eq"}, "max_score" : 1.0, "hits" : [{
            "_index" : "taxonomy",
            "_type" : "_doc",
            "_id" : "http://eurovoc.europa.eu/5974",
            "_score" : 1.0,
            "_source" : {
                "id" : "http://eurovoc.europa.eu/5974",
                "inScheme": ["http://www.dods.co.uk/taxonomy/instance/Topics"],
                "type" : "Concept",
                "identifier" : "5974",
                "legacyID" : "\"5974\"",
                "xlPrefLabel": ["http://eurovoc.europa.eu/231836","http://eurovoc.europa.eu/173862","http://eurovoc.europa.eu/217102"],
                "broader": [],
                "xlAltLabel": ["http://eurovoc.europa.eu/231839","http://eurovoc.europa.eu/173863",
                    "http://eurovoc.europa.eu/217104","http://eurovoc.europa.eu/231838",
                    "http://eurovoc.europa.eu/173864","http://eurovoc.europa.eu/217103",
                    "http://eurovoc.europa.eu/231837"],
                "narrower": ["http://eurovoc.europa.eu/3515","http://eurovoc.europa.eu/5978",
                    "http://eurovoc.europa.eu/1648","http://www.dods.co.uk/taxonomy/instance/concept/81de5cd4-36e1-41ee-932a-6acdb709d63f",
                    "http://eurovoc.europa.eu/6236","http://eurovoc.europa.eu/5976",
                    "http://www.dods.co.uk/taxonomy/instance/Topics/85ec7f4b-e93c-4958-959d-08a2300602b4",
                    "http://eurovoc.europa.eu/3626","http://eurovoc.europa.eu/5979",
                    "http://www.dods.co.uk/taxonomy/instance/concept/3623",
                    "http://www.dods.co.uk/taxonomy/instance/concept/1646","http://eurovoc.europa.eu/4332"
                ],
                "label": "unemployment"
            }
        }]}
}}
//@ts-ignore
const MOCK_ES_RESPONSE_SHORT = {body: {"hits": {"total": {"value": 1, "relation" : "eq"}, "max_score" : 1.0, "hits" : [{
            "_index" : "taxonomy",
            "_type" : "_doc",
            "_id" : "http://eurovoc.europa.eu/5974",
            "_score" : 1.0,
            "_source" : {
                "id" : "http://eurovoc.europa.eu/5974",
                "inScheme": ["http://www.dods.co.uk/taxonomy/instance/Topics"],
                "type" : "Concept",
                "identifier" : "5974",
                "legacyID" : "\"5974\"",
                "xlPrefLabel": ["http://eurovoc.europa.eu/231836","http://eurovoc.europa.eu/173862","http://eurovoc.europa.eu/217102"],
                "broader": [],
                "xlAltLabel": ["http://eurovoc.europa.eu/231839","http://eurovoc.europa.eu/173863",
                    "http://eurovoc.europa.eu/217104","http://eurovoc.europa.eu/231838",
                    "http://eurovoc.europa.eu/173864","http://eurovoc.europa.eu/217103",
                    "http://eurovoc.europa.eu/231837"],
                "narrower": [],
                "label": "unemployment"
            }
        }]}
}}

//@ts-ignore
const TAXONOMY_PARAMETERS: TaxonomiesParameters = { tags: 'unemployment', taxonomy: 'Topics' };


describe(`${FUNCTION_NAME} handler`, () => {

    beforeEach(() => {
        jest.mock('../../../src/elasticsearch');
    })

    test('getTaxonomies Valid input', async () => {
        elasticsearch.search.mockResolvedValue(MOCK_ES_RESPONSE)

        const data: TaxonomiesParameters = { id: 'str-uuid' };

        const response = await TaxonomyRepository.defaultInstance.getTaxonomies(data)

        expect(response).toEqual([data]);
    });

    test('searchTaxonomies valid output on query', async () => {
        const expectedTags: TaxonomySearchResponse = {"hitCount": 1, "results": [{"id": "http://eurovoc.europa.eu/5974", "inScheme": ["http://www.dods.co.uk/taxonomy/instance/Topics"], "score": 1, "tag": "unemployment", "alternative_labels": undefined, "hierarchy": undefined}], "taxonomy": "Topics"};

        elasticsearch.search.mockResolvedValue(MOCK_ES_RESPONSE)

        const response = await TaxonomyRepository.defaultInstance.searchTaxonomies(TAXONOMY_PARAMETERS)

        expect(response).toEqual(expectedTags);

    })

    test('searchTaxonomies no tags throws HTTP error', async () => {
        const data: TaxonomiesParameters = { id: 'winter' };

        await expect(TaxonomyRepository.defaultInstance.searchTaxonomies(data)).rejects.toThrow(HttpBadRequestError);

    });

    test('searchTaxonomies valid query sent to ES', async () => {
        elasticsearch.search.mockResolvedValue(MOCK_ES_RESPONSE)

        await TaxonomyRepository.defaultInstance.searchTaxonomies(TAXONOMY_PARAMETERS)

        expect(elasticsearch.search.mock.calls.length).toBeGreaterThanOrEqual(1);

    });

    test('searchTaxonomiesRepository creates the correct query object', async () => {
        const correct_es_query = {index: 'taxonomy', body: {query: {"bool": {"must": [{"match": {"inScheme": TAXONOMY_PARAMETERS.taxonomy}}, {"bool": {"should": [ {"match": {"label": TAXONOMY_PARAMETERS.tags}}, {"match": {"altLabels": TAXONOMY_PARAMETERS.tags}}]}}]}}}, "size": 500}

        const taxonomy_query = await TaxonomyRepository.createSearchQuery(TAXONOMY_PARAMETERS)

        expect(taxonomy_query).toEqual(correct_es_query);
    });

    test('searchTaxonomiesRepository with a limit creates the correct query object', async () => {
        const data: TaxonomiesParameters = { tags: 'unemployment', taxonomy: 'Topics', limit: 1 };
        const correct_es_query = {index: 'taxonomy', body: {query: {"bool": {"must": [{"match": {"inScheme": TAXONOMY_PARAMETERS.taxonomy}}, {"bool": {"should": [ {"match": {"label": TAXONOMY_PARAMETERS.tags}}, {"match": {"altLabels": TAXONOMY_PARAMETERS.tags}}]}}]}}}, "size": data.limit}

            const taxonomy_query = await TaxonomyRepository.createSearchQuery(data)

        expect(taxonomy_query).toEqual(correct_es_query);
    });

});

describe(`get taxonomyTree from repository`, () => {
    beforeEach(() => {
        jest.mock('../../../src/elasticsearch');
    })
    test('test elastic search is called', async () =>{
        elasticsearch.search.mockResolvedValue(MOCK_ES_RESPONSE_SHORT)
        await TaxonomyRepository.defaultInstance.buildTree('Topics')
        expect(elasticsearch.search).toHaveBeenCalled();
    });

    test('test gets narrower topics', async () =>{
        // @ts-ignore
        const spy = jest.spyOn(TaxonomyRepository.prototype as any, 'getNarrowerTopics');
        elasticsearch.search.mockResolvedValueOnce(MOCK_ES_RESPONSE)
        await TaxonomyRepository.defaultInstance.buildTree('Topics')

        expect(spy).toHaveBeenCalled();

        spy.mockRestore();
    })

});
