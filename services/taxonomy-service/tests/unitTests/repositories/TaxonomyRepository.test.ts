import { TaxonomiesParameters } from '../../../src/domain/interfaces';
import { TaxonomyRepository } from '../../../src/repositories/TaxonomyRepository';
import { requestHandler } from '../../../src/utility/requestHandler'

jest.mock('../../../src/utility/requestHandler');

const requestHandlerMock = (requestHandler as jest.Mock);

const FUNCTION_NAME = "TaxonomyRepository";

afterEach(() => {
    requestHandlerMock.mockReset();
});

describe(`${FUNCTION_NAME} handler`, () => {

    test('getTaxonomies Valid input', async () => {

        const data: TaxonomiesParameters = { id: 'str-uuid' };

        const requestHandlerResponse = 'str-uuid';

        requestHandlerMock.mockImplementation(() => requestHandlerResponse);

        const response = await TaxonomyRepository.defaultInstance.getTaxonomies(data)

        expect(response).toEqual(requestHandlerResponse);
    });
});

