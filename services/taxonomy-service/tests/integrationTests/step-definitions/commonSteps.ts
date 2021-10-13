import { BeforeAll, setDefaultTimeout, When, Then, Given } from "@cucumber/cucumber";
// @ts-ignore
import expect from 'expect'
import axios from "axios";

import { setupMockServers } from '../helpers/setupMockServers';
import { config } from '../../../src/domain'

setDefaultTimeout(60 * 1000);

BeforeAll(async function () {
    await setupMockServers();
});


Given('there is a lambda {string}', function (lambdaFunction) {
    this.lambdaFunction = lambdaFunction;
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