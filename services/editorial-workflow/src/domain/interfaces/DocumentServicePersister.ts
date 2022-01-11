
export interface DocumentServicePersister {
    updateDocument(parameters: any): Promise<Object>;
    getDocument(documentARN: string): Promise<Object>;
}
