import axios from "axios";
import expect from 'expect'
import { When, Then, Given } from "@cucumber/cucumber";
import { config } from '../../../src/domain/config'
import HttpStatusCode from '../../../src/domain/http/HttpStatusCode'

Given('lambda function name is {string}', function (lambdaFunction) {
    this.lambdaFunction = lambdaFunction;
});

Given('lambda function name is {string} and i set language as {string}', function (lambdaFunction, language) {
    this.lambdaFunction = lambdaFunction;
    this.data = { language, title: 'Mr', firstName: 'Kenan', lastName: 'Hancer' };
});

When('I send HTTP {string} request', async function (method) {
    const url = `${config.test.endpoint}/${this.lambdaFunction}`;

    try {
        this.response = (await axios({ url, method, headers: this.data })).data;
    } catch (error) {
        this.error = error;
    }
});

Then('I should receive {string}', function (expectedAnswer) {
    expect(this.response).toMatch(expectedAnswer);
});

Then('I should receive error - {string}', function (httpStatusCode) {
    expect(this.error.response.status).toEqual(HttpStatusCode[httpStatusCode]);
});