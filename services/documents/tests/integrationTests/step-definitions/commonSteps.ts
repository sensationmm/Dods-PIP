import { BeforeAll, setDefaultTimeout } from "@cucumber/cucumber";
import { setupMockServers } from '../helpers/setupMockServers';

setDefaultTimeout(60 * 1000);

BeforeAll(async function () {
    await setupMockServers();
});