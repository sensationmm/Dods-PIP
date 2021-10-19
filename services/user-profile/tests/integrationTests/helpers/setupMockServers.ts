import fs from 'fs';
import path from "path";
import * as OpenAPIType from "openapi-types"
import { mockServerClient } from "mockserver-client";
import SwaggerParser from "@apidevtools/swagger-parser";
import { MockServerClient } from "mockserver-client/mockServerClient";
interface ServerData {
    parsedSpec: string;
    hostname: string;
    port: number;
}

const downstreamDefinitionsPath = `${process.cwd()}/tests/integrationTests/downstreamDefinitions`;
const filenames: string[] = fs.readdirSync(downstreamDefinitionsPath);

export const setupMockServers = async () => {

    await Promise.all(filenames.map(async (filename) => {
        try {
            const { hostname, port, parsedSpec } = await extractServerData(filename);
            const client = mockServerClient(hostname, port);
            await setupOpenAPIExpectations(client, parsedSpec);
        } catch (error) {
            console.error(`Error on mock server setup: [${filename}]`, error);
            process.exit(1);
        }
    }));
}

const extractServerData = async (filename: string): Promise<ServerData> => {
    try {
        const filepath = path.normalize(`${downstreamDefinitionsPath}/${filename}`);
        const swaggerParser = new SwaggerParser();
        const spec = await swaggerParser.bundle(filepath) as OpenAPIType.OpenAPIV3_1.Document;
        const url = spec.servers![0]!.url;
        const [hostname, port] = url.split(":");
        return {
            parsedSpec: JSON.stringify(spec),
            hostname,
            port: Number(port)
        }
    } catch (error) {
        console.error(`Error extracting server data: [${filename}]`, error);
        throw error;
    }
}

const setupOpenAPIExpectations = async (client: MockServerClient, parsedSpec: string) => {
    try {
        await client.reset();
        await client.openAPIExpectation({ specUrlOrPayload: parsedSpec });
    } catch (error) {
        console.error(`Error creating expectations from openAPI: ${error}`);
        throw error;
    }
}