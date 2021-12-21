

export interface DocumentPublishPersister {
    publishDocument(lambdaName: string, payload: string): Promise<boolean>;
}
