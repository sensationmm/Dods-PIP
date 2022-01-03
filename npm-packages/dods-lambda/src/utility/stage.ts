export function isLocalOrTestStage() {
    return isLocalStage() || isTesting();
}

export function isLocalStage() {
    return process.env.IS_OFFLINE || process.env.stage === 'local';
}

export function isTesting() {
    return Boolean(process.env.JEST_WORKER_ID);
}