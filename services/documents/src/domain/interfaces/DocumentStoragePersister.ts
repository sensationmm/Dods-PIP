export interface DocumentPayloadResponse {
    success: boolean | undefined;
    payload: string | undefined;
}


export interface DocumentStoragePersister {
    getDocumentByArn(documentARN: string): Promise<DocumentPayloadResponse>;
}
