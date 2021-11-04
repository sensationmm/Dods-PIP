import { JSONSchemaType } from "ajv"
import { CreateNewDocument } from '../domain/interfaces'

export const documentSchema : JSONSchemaType<CreateNewDocument> = {
    type: "object",
    properties: {
        jurisdiction: { type: "string", nullable: true },
        documentTitle: { type: "string" },
        organisationName: { type: "string", nullable: true },
        sourceReferenceFormat: { type: "string", nullable: true },
        sourceReferenceUri: { type: "string", nullable: true },
        createdBy: { type: "string", nullable: true },
        internallyCreated: { type: "boolean", nullable: true },
        schemaType: { type: "string", nullable: true },
        contentSource: { type: "string" },
        informationType: { type: "string" },
        contentDateTime: { type: "string", nullable: true },
        createdDateTime: { type: "string" },
        ingestedDateTime: { type: "string", nullable: true },
        version: { type: "string", nullable: true },
        countryOfOrigin: { type: "string", nullable: true },
        feedFormat: { type: "string", nullable: true },
        language: { type: "string", nullable: true },
        taxonomyTerms: { type: "array", nullable: true, items: { type: "object" } },
        originalContent: { type: "string", nullable: true },
        documentContent: { type: "string", nullable: true }
    },
    required: ["documentTitle", "contentSource", "informationType", "createdDateTime"],
    additionalProperties: false
}