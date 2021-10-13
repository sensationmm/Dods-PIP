import { createEditorialRecord } from '../../../src/handlers/createEditorialRecord/createEditorialRecord';
import { CreateEditorialRecordParameters } from "../../../src/domain";
import { HttpResponse } from '@dodsgroup/dods-lambda';
// @ts-ignore
import expect from "expect";

const FUNCTION_NAME = "createEditorialRecord";

describe(`${FUNCTION_NAME} handler`, () => {
    test(`${FUNCTION_NAME}`, async () => {
        const data: CreateEditorialRecordParameters = { document_name: 'Some Questions', s3_location: 'Some location' };

        const response = await createEditorialRecord(data);
        expect(response).toBeInstanceOf(HttpResponse);
        expect(JSON.stringify(response)).toContain("document_name")
        expect(JSON.stringify(response)).toContain("s3_location")
        expect(JSON.stringify(response)).toContain("id")

    });
});
