import { isLocalOrTestStage } from "./stage";

type SimpleType = string | number | boolean;

export type LogData = Record<string, SimpleType | SimpleType[] | undefined>;

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface LogObject {
    level: LogLevel;
    message: string | unknown;
    data?: LogData;
}

export class Logger {

    private static log(logObject: LogObject): LogObject {
        const { level, message, data = '' } = logObject;

        if (isLocalOrTestStage()) {
            const time = new Date().toISOString();
            const log = [time, level, message, data];

            switch (level) {
                case 'DEBUG':
                    console.debug(...log);
                    break;
                case 'INFO':
                    console.info(...log);
                    break;
                case 'WARN':
                    console.warn(...log);
                    break;
                case 'ERROR':
                    console.error(...log);
                    break;
            }
        } else {
            if (level === 'INFO') {
                console.log(message, data);
            } else {
                console.log(level, message, data);
            }
        }

        return logObject;
    }

    static debug(message: string | unknown, data?: LogData): LogObject {
        return Logger.log({ level: 'DEBUG', message, data });
    }

    static info(message: string | unknown, data?: LogData): LogObject {
        return Logger.log({ level: 'INFO', message, data });
    }

    static warn(message: string | unknown, data?: LogData): LogObject {
        return Logger.log({ level: 'WARN', message, data });
    }

    static error(message: string | unknown, data?: unknown): LogObject {
        if (data instanceof Error) {
            data = { ...data, message: data.message, stack: data.stack, name: data.name };
        }

        return Logger.log({ level: 'ERROR', message, data: data as LogData });
    }
}