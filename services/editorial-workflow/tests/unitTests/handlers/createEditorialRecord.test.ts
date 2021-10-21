import { createEditorialRecord } from '../../../src/handlers/createEditorialRecord/createEditorialRecord';
import { HttpResponse, createContext } from '@dodsgroup/dods-lambda';
// @ts-ignore
import expect from "expect";

import { CreateEditorialRecordParameters } from "../../../src/domain";

jest.mock('../../../src/dynamodb');

const FUNCTION_NAME = "createEditorialRecord";

const defaultContext = createContext();

describe(`${FUNCTION_NAME} handler`, () => {
    test(`${FUNCTION_NAME}`, async () => {
        const data: CreateEditorialRecordParameters = { document_name: 'Some Questions', s3_location: 'Some location' };

        const response = await createEditorialRecord(data, defaultContext);
        expect(response).toBeInstanceOf(HttpResponse);
        expect(JSON.stringify(response)).toContain("document_name")
        expect(JSON.stringify(response)).toContain("s3_location")
        expect(JSON.stringify(response)).toContain("id")

    });
});
