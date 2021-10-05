import { Given, Then, When } from '@cucumber/cucumber';

import axios from 'axios';
import { config } from '../../../src/domain';
import expect from 'expect';

Given('lambda function name is {string}', function (lambdaFunction) {
    this.lambdaFunction = lambdaFunction;
});

Given(
    'lambda function name is {string} and i set language as {string}',
    function (lambdaFunction, language) {
        this.lambdaFunction = lambdaFunction;
        this.data = {
            language,
            title: 'Mr',
            firstName: 'Kenan',
            lastName: 'Hancer',
        };
    }
);

When('I send HTTP {string} request', async function (method) {
    const url = `${config.test.endpoint}/${this.lambdaFunction}`;

    try {
        this.response = (await axios({ url, method, headers: this.data })).data;
    } catch (error) {
        this.error = error;
    }
});

// Test for updating client

When(
    'I send HTTP {string} request with clientAccount {string}',
    async function (method, clientAccountId) {
        const url = `http://localhost:3000/test/clientaccount/${clientAccountId}`;

        const clientAccount = {
            clientAccount: {
                subscription: 'abc',
                subscription_seats: 24,
                consultant_hours: 13,
                contract_start_date: '2021-01-01T01:01:01.001Z',
                contract_rollover: false,
                contract_end_date: '2022-02-01T01:01:01.001Z',
            },
        };

        try {
            this.response = (
                await axios({
                    method,
                    url: url,
                    data: clientAccount,
                })
            ).data.message;
        } catch (error) {
            this.error = error;
        }
    }
);

When(
    'I send HTTP {string} request with clientAccount {string} contract rollover {string}, start date {string} and end date {string}',
    async function (
        method,
        clientAccountId,
        contract_rollover,
        start_date,
        end_date
    ) {
        const contract_rollover_bool = contract_rollover === 'true';
        let current_date = '2021-01-01T01:01:01.001Z';

        if (start_date === 'today') {
            const today = new Date();
            current_date = `${today.getFullYear()}-${
                today.getMonth() + 1
            }-${today.getDate()}`;
        }

        if (end_date !== '') {
            const today = new Date();
            end_date = `${today.getFullYear() - 1}-${
                today.getMonth() + 1
            }-${today.getDate()}`;
        }

        const url = `http://localhost:3000/test/clientaccount/${clientAccountId}`;

        const clientAccount = {
            clientAccount: {
                subscription: 'abc',
                subscription_seats: 24,
                consultant_hours: 13,
                contract_start_date: current_date,
                contract_rollover: contract_rollover_bool,
                contract_end_date: end_date,
            },
        };

        try {
            this.response = (
                await axios({
                    method,
                    url: url,
                    data: clientAccount,
                })
            ).data.message;
        } catch (error) {
            this.error = error;
        }
    }
);

Then('I should receive {string}', function (expectedAnswer) {
    console.log(expectedAnswer);
    expect(this.response).toEqual(expectedAnswer);
});

Then('I should receive {string} in update', function (expectedAnswer) {
    expect(this.response).toMatch(expectedAnswer);
});

Then('I should receive error - {string}', function (errorMessage) {
    expect(this.error.response.data.message).toEqual(errorMessage);
});
