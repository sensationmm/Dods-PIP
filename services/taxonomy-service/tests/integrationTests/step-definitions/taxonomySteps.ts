import { When, Then, Given } from "@cucumber/cucumber";
// @ts-ignore
import expect from 'expect';
import axios from "axios";

import { config } from '../../../src/domain'


Given('I create a HTTP {string} request', function (method) {
    this.requestMethod = method;
    this.url = new URL(`${config.test.endpoint}/${this.lambdaFunction}`);
});

Given('I have the URL parameter {string} with the value {string}', function (parameter, value) {
    this.url.searchParams.append(parameter, value);
});

When('I send the request', async function () {
    try {
        this.response = (await axios({ url: this.url.href, method: this.requestMethod, headers: this.data }))
    } catch (error) {
        this.error = error;
    }
});

Then('I should receive a {int} status code', function (statusCode) {

    expect(this.response.status).toEqual(statusCode);
});

Then('I receive multiple taxonomies', function () {
    expect(this.response.data.length).toBeGreaterThan(1);
});

Then('I receive a single taxonomy', function () {
    expect(this.response.data.length).toEqual(1);
});

