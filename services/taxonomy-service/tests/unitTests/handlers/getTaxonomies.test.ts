import { TaxonomiesParameters } from '../../../src/domain/interfaces';
import { getTaxonomies } from '../../../src/handlers/taxonomies/getTaxonomies';

const FUNCTION_NAME = "getTaxonomies";

describe(`${FUNCTION_NAME} handler`, () => {
    test(`${FUNCTION_NAME}`, async () => {
        const data: TaxonomiesParameters = { id: 'str-uuid' };

        const response = await getTaxonomies(data);

        expect(response).toEqual({ body: 'Hello World', statusCode: 200 });

    
    });
});
