import { ClientAccountDAO, ClientAccountPersister, config } from "../domain";

export class ClientAccountMariaDb implements ClientAccountPersister {

    static defaultInstance: ClientAccountPersister = new ClientAccountMariaDb(config.aws.mariaDb.connectionString, config.aws.mariaDb.clientAccountTableName);

    constructor(private tableName: string, private mariaDbConnectionString: string) { }

    async getClientAccount(clientAccountId: string): Promise<ClientAccountDAO[]> {
        // MariaDB DAL business logic here

        if (!clientAccountId) {
            throw new Error('Error: clientAccountId cannot be empty');
        }

        console.log(this.tableName, this.mariaDbConnectionString);

        return [{ clientAccountId }];
    }
}