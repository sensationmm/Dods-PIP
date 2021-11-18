import {TaxonomiesParameters, HttpBadRequestError, TaxonomyItem } from '../../../src/domain';
import { TaxonomyRepository } from '../../../src/repositories/TaxonomyRepository';
import elasticsearch from "../../../src/elasticsearch"

jest.mock('../../../src/elasticsearch');

const FUNCTION_NAME = "TaxonomyRepository";

afterEach(() => {
    jest.clearAllMocks();
});

const MOCK_ES_RESPONSE = {"took":0, "timed_out": false, "_shards": {"total" : 1, "successful" : 1, "skipped" : 0, "failed" : 0},
    "hits": {"total": {"value": 1, "relation" : "eq"}, "max_score" : 1.0, "hits" : [{
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
            "broader": ["http://www.dods.co.uk/taxonomy/instance/concept/b8d6257a-8796-4cec-a2db-cbb610d56d6c"],
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
            "revisionNo": 2.0, "modified": "2021-08-13T15:54:47.701Z", "label": "unemployment"
        }
    }]}
}


describe(`${FUNCTION_NAME} handler`, () => {

    test('getTaxonomies Valid input', async () => {

        const data: TaxonomiesParameters = { id: 'str-uuid' };

        const response = await TaxonomyRepository.defaultInstance.getTaxonomies(data)

        expect(response).toEqual([data]);
    });

    test('searchTaxonomies valid output on query', async () => {
        const data: TaxonomiesParameters = { tags: 'winter' };
        const mock_es_response = {
            body: {hits: {hits: [{
                        _id: '1',
                        _score: "1",
                        _source: {
                            id: '1',
                            exactMatch: false,
                            identifier: '864d1fe5-23f7-44cd-b015-8c24fac28ca1',
                            label: 'winter health problems',
                            inScheme: [ 'http://www.dods.co.uk/taxonomy/instance/Topics' ],
                            isXlPrefLabelOf: 'http://www.dods.co.uk/taxonomy/instance/concept/45765206-082c-430a-8e00-b8aeef09808e',
                            type: 'Label'
                        }
                    }]}}
        }
        const expectedTags: TaxonomyItem = { id: "1", tag: "winter health problems", score: "1", inScheme: [ 'http://www.dods.co.uk/taxonomy/instance/Topics' ]};

        elasticsearch.search.mockResolvedValue(mock_es_response)

        const response = await TaxonomyRepository.defaultInstance.searchTaxonomies(data)

        expect(response).toEqual([expectedTags]);

    })

    test('searchTaxonomies no tags throws HTTP error', async () => {
        const data: TaxonomiesParameters = { id: 'winter' };

        await expect(TaxonomyRepository.defaultInstance.searchTaxonomies(data)).rejects.toThrow(HttpBadRequestError);

    });

    test('searchTaxonomies valid query sent to ES', async () => {
        const data: TaxonomiesParameters = { tags: 'winter' };
        const correct_es_query = {index: 'taxonomy', body: {query: {"term": {"label": data.tags}}},size: 500}

        const mock_es_response = {
            body: {hits: {hits: [{
                        _index: 'taxonomy',
                        _type: '_doc',
                        _id: 'http://www.dods.co.uk/taxonomy/instance/term/864d1fe5-23f7-44cd-b015-8c24fac28ca1',
                        _score: 1,
                        _source: {
                            id: 'http://www.dods.co.uk/taxonomy/instance/term/864d1fe5-23f7-44cd-b015-8c24fac28ca1',
                            language: { id: 'http://psi.oasis-open.org/iso/639/#eng' },
                            typeOfClue: { id: 'http://taxo.dods.co.uk/onto#ClueTypeStandard' },
                            exactMatch: false,
                            identifier: '864d1fe5-23f7-44cd-b015-8c24fac28ca1',
                            label: 'winter health problems',
                            inScheme: [ 'http://www.dods.co.uk/taxonomy/instance/Topics' ],
                            isXlPrefLabelOf: 'http://www.dods.co.uk/taxonomy/instance/concept/45765206-082c-430a-8e00-b8aeef09808e',
                            type: 'Label'
                        }
                    }]}}
        }

        elasticsearch.search.mockResolvedValue(mock_es_response)

        await TaxonomyRepository.defaultInstance.searchTaxonomies(data)

        expect(elasticsearch.search.mock.calls.length).toBe(1);

        expect(elasticsearch.search).toHaveBeenCalledWith(correct_es_query);

    });

    test('searchTaxonomiesRepository creates the correct query object', async () => {
        const data: TaxonomiesParameters = { tags: 'winter' };
        const correct_es_query = {index: 'taxonomy', body: {query: {"term": {"label": data.tags}}},size: 500}


        const taxonomy_query = await TaxonomyRepository.createSearchQuery(data)

        expect(taxonomy_query).toEqual(correct_es_query);
    });

    test('searchTaxonomiesRepository with a limit creates the correct query object', async () => {
        const data: TaxonomiesParameters = { tags: 'winter', limit: 1 };
        const correct_es_query = {index: 'taxonomy', body: {query: {"term": {"label": data.tags}}},size: data.limit}


        const taxonomy_query = await TaxonomyRepository.createSearchQuery(data)

        expect(taxonomy_query).toEqual(correct_es_query);
    });

});

describe(`get taxonomyTree from repository`, () => {
    test('test elastic search is called', async () =>{

        await TaxonomyRepository.defaultInstance.buildTree('Topics')
        expect(elasticsearch.search).toHaveBeenCalled();
    });

    test('test gets narrower topics', async () =>{
        // @ts-ignore
        const spy = jest.spyOn(TaxonomyRepository.prototype as any, 'getNarrowerTopics');
        elasticsearch.search.mockResolvedValueOnce({body: MOCK_ES_RESPONSE})
        await TaxonomyRepository.defaultInstance.buildTree('Topics')

        expect(spy).toHaveBeenCalled();

        spy.mockRestore();
    })

});

