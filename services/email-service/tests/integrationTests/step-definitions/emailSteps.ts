import axios from "axios";
import expect from 'expect'
import { When, Then, Given } from "@cucumber/cucumber";
import { config } from '../../../src/domain';

Given('a lambda function named {string}', function (lambdaFunction) {
    this.lambdaFunction = lambdaFunction;
});

Given('I provide the following information for the request payload', function (table) {
    this.requestPayload = table.rowsHash();
    if (this.requestPayload.to.includes(",")) {
        this.requestPayload.to = table.rowsHash().to.split(",").map((item: string) => item.trim())
    } else {
        this.requestPayload.to = [this.requestPayload.to]
    }
});

When('I send the HTTP {string} request', async function (method) {
    const url = `${config.test.endpoint}/${this.lambdaFunction}`;
    try {
        this.response = (await axios({ url, method, data: this.requestPayload }));
    } catch (error: any) {
        this.response = error.response;
    }
});

Then('I should receive a {int} status code', function (statusCode) {
    expect(this.response.status).toEqual(statusCode);
});

Then('I should receive a {int} status error code', function (statusCode) {
    expect(this.response.data.error.status).toEqual(statusCode);
});

Then('I should receive an {string} message', function (messageExpected) {
    expect(this.response.data.message).toMatch(messageExpected);
});

Then('I should receive a {string} success status', function (successExpected) {
    expect(this.response.data.success).toEqual(successExpected === 'true');
});
