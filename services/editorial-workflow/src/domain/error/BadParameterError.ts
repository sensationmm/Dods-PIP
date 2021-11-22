export class BadParameterError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'BadParameterError';
    }
}
