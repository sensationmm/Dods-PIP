import { getTaxonomies } from '../../../src/handlers/taxonomies/getTaxonomies';
import {HttpBadRequestError, HttpSuccessResponse, TaxonomiesParameters} from "../../../src/domain";

const FUNCTION_NAME = "getTaxonomies";

describe(`${FUNCTION_NAME} handler`, () => {
    test(`${FUNCTION_NAME}`, async () => {
        const data: TaxonomiesParameters = { tags: 'str-uuid' };

        const response = await getTaxonomies(data);
        expect(response).toBeInstanceOf(HttpSuccessResponse);

    });
    test(`${FUNCTION_NAME} with explicit taxonomy`, async () => {
        const data: TaxonomiesParameters = { tags: 'str-uuid', taxonomy: 'Topics' };

        const response = await getTaxonomies(data);
        expect(response).toBeInstanceOf(HttpSuccessResponse);

    });

    test('getTaxonomies with no tags throws HTTP error', async () => {
        const data: TaxonomiesParameters = { id: 'winter' };

        await expect(getTaxonomies(data)).rejects.toThrow(HttpBadRequestError);

    });
});
