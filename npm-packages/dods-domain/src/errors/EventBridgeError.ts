export class EventBridgeError extends Error {
    constructor(errors: string | unknown) {
        super(typeof errors === 'string' ? errors : JSON.stringify(errors));
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = EventBridgeError.name;
    }
}