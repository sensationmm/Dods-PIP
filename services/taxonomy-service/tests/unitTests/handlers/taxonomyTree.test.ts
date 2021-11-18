import { taxonomyTree as taxonomyTopicsTree } from '../../../src/handlers/taxonomyTopicsTree/taxonomyTree';
import { taxonomyTree as taxonomyOrganisationsTree } from '../../../src/handlers/taxonomyOrganisationsTree/taxonomyTree';
import { HttpSuccessResponse} from "../../../src/domain";

const FUNCTION_NAME = "taxonomyTree";

jest.mock('../../../src/elasticsearch');
jest.mock('../../../src/repositories/TaxonomyRepository');

describe(`taxonomy tree handlers`, () => {
    test(`Topics Taxonomy Tree`, async () => {
        const response = await taxonomyTopicsTree();
        expect(response).toBeInstanceOf(HttpSuccessResponse);

    });

    test(`Organisations Taxonomy Tree`, async () => {
        const response = await taxonomyOrganisationsTree();
        expect(response).toBeInstanceOf(HttpSuccessResponse);

    });
});
