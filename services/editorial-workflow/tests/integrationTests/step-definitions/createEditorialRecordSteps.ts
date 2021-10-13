import { BeforeAll, setDefaultTimeout } from "@cucumber/cucumber";
import { When, Then, Given } from "@cucumber/cucumber";
// @ts-ignore
import expect from 'expect'
import axios from "axios";

import { setupMockServers } from '../helpers/setupMockServers';
import { config } from '../../../src/domain';
import dynamodb from "'../../../src/dynamodb";


setDefaultTimeout(60 * 1000);

BeforeAll(async function () {
    await setupMockServers();
});

Given('there is an api gateway endpoint {string}', function (gatewayEndpoint) {
    this.lambdaFunction = gatewayEndpoint;
});

Given('I create a HTTP {string} request', function (method) {
    this.requestMethod = method;
    this.url = new URL(`${config.test.endpoint}/${this.lambdaFunction}`);
});

Given('the request has the body {string}', function (requestBody) {
    this.requestBody = JSON.parse(requestBody);
});

Given('the request headers {string}', function (requestHeaders) {
    this.requestHeaders = JSON.parse(requestHeaders);
});

When('I send the request', async function () {
    try {
        this.response = (await axios({ url: this.url.href, method: this.requestMethod, headers: this.requestHeaders, data: this.requestBody }))
    } catch (error) {
        console.log(error)
        this.error = error;
    }
})

Then('I should receive a {int} status code', function (statusCode) {
    expect(this.response.status).toEqual(statusCode);
});

Then('I should receive an Editorial Record response', function () {
    expect(JSON.stringify(this.response.data)).toContain("document_name")
    expect(JSON.stringify(this.response.data)).toContain("s3_location")
    expect(JSON.stringify(this.response.data)).toContain("id")
});

Then('the record should be saved to DynamoDB', function () {
    expect(dynamodb.put.mock.calls.length).toBe(1);
});

Then('the Editorial Record should have an ID', function () {
    expect(JSON.stringify(this.response.data)).toContain("id")
});

Then('I should receive a message with the error', function () {
    expect(JSON.stringify(this.response.data)).toContain("message")
});
