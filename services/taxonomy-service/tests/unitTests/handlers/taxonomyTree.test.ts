import { taxonomyTree } from '../../../src/handlers/taxonomyTree/taxonomyTree';
import { HttpSuccessResponse} from "../../../src/domain";

const FUNCTION_NAME = "taxonomyTree";

jest.mock('../../../src/elasticsearch');
jest.mock('../../../src/repositories/TaxonomyRepository');

describe(`${FUNCTION_NAME} handler`, () => {
    test(`${FUNCTION_NAME}`, async () => {
        const response = await taxonomyTree();
        expect(response).toBeInstanceOf(HttpSuccessResponse);

    });
});
