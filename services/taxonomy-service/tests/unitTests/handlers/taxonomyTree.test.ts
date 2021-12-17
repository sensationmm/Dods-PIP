import { taxonomyTree as taxonomyTopicsTree } from '../../../src/handlers/taxonomyTopicsTree/taxonomyTree';
import { taxonomyTree as taxonomyOrganisationsTree } from '../../../src/handlers/taxonomyOrganisationsTree/taxonomyTree';
import { taxonomyTree as taxonomyPeopleTree } from '../../../src/handlers/taxonomyPeopleTree/taxonomyTree';
import { taxonomyTree as taxonomyGeographyTree } from '../../../src/handlers/taxonomyGeographyTree/taxonomyTree';
import { taxonomyTree as multiTaxonomyTree } from '../../../src/handlers/taxonomyTree/taxonomyTree';
import { HttpSuccessResponse} from "../../../src/domain";
import * as AWSUtils from "../../../src/utility/aws";


jest.mock('../../../src/elasticsearch');
jest.mock('../../../src/repositories/TaxonomyRepository');
jest.mock('../../../src/utility/aws');

describe(`taxonomy tree handlers`, () => {
    test(`Topics Taxonomy Tree`, async () => {
        const mock = jest.spyOn(AWSUtils, 'getFromS3');
        mock.mockImplementation(
            (): Promise<any> => Promise.resolve({ Body: "{}" })
        );
        const response = await taxonomyTopicsTree();
        expect(response).toBeInstanceOf(HttpSuccessResponse);

    });

    test(`Organisations Taxonomy Tree`, async () => {
        const mock = jest.spyOn(AWSUtils, 'getFromS3');
        mock.mockImplementation(
            (): Promise<any> => Promise.resolve({ Body: "{}" })
        );
        const response = await taxonomyOrganisationsTree();
        expect(response).toBeInstanceOf(HttpSuccessResponse);
    });

    test(`Organisations People Tree`, async () => {
        const mock = jest.spyOn(AWSUtils, 'getFromS3');
        mock.mockImplementation(
            (): Promise<any> => Promise.resolve({ Body: "{}" })
        );
        const response = await taxonomyPeopleTree();
        expect(response).toBeInstanceOf(HttpSuccessResponse);
    });

    test(`Organisations Geography Tree`, async () => {
        const mock = jest.spyOn(AWSUtils, 'getFromS3');
        mock.mockImplementation(
            (): Promise<any> => Promise.resolve({ Body: "{}" })
        );
        const response = await taxonomyGeographyTree();
        expect(response).toBeInstanceOf(HttpSuccessResponse);
    });

    test('Multi Taxonomy Tree', async () => {
        const mock = jest.spyOn(AWSUtils, 'getFromS3');
        mock.mockImplementation(
            (): Promise<any> => Promise.resolve({ Body: "{}" })
        );

        const response = await multiTaxonomyTree();
        expect(response).toBeInstanceOf(HttpSuccessResponse);

    });
});
