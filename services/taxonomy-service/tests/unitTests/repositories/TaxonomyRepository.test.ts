import {TaxonomiesParameters, HttpBadRequestError, TaxonomyItem } from '../../../src/domain';
import { TaxonomyRepository } from '../../../src/repositories/TaxonomyRepository';
import elasticsearch from "../../../src/elasticsearch"

jest.mock('../../../src/elasticsearch');

const FUNCTION_NAME = "TaxonomyRepository";

afterEach(() => {
    jest.clearAllMocks();
});


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
                            literalForm: { en: 'winter health problems' },
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
        const correct_es_query = {index: 'taxonomy', body: {query: {"term": {"literalForm.en": data.tags}}},size: 500}

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
                            literalForm: { en: 'winter health problems' },
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
        const correct_es_query = {index: 'taxonomy', body: {query: {"term": {"literalForm.en": data.tags}}},size: 500}


        const taxonomy_query = await TaxonomyRepository.createSearchQuery(data)

        expect(taxonomy_query).toEqual(correct_es_query);
    });

    test('searchTaxonomiesRepository with a limit creates the correct query object', async () => {
        const data: TaxonomiesParameters = { tags: 'winter', limit: 1 };
        const correct_es_query = {index: 'taxonomy', body: {query: {"term": {"literalForm.en": data.tags}}},size: data.limit}


        const taxonomy_query = await TaxonomyRepository.createSearchQuery(data)

        expect(taxonomy_query).toEqual(correct_es_query);
    });

});

