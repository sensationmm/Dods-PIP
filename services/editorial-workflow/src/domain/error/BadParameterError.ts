import { EditorialRecordOutput } from '..';

export class BadParameterError extends Error {
    constructor(message: string, record?: EditorialRecordOutput) {
        super(message);
        this.name = 'BadParameterError';
        this.editorialRecord = record;
    }

    editorialRecord?: EditorialRecordOutput;
}
