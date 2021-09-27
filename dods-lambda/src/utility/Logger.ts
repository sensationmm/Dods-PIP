import { isLocalOrTestStage } from "./stage";

type SimpleType = string | number | boolean;

export type LogData = Record<string, SimpleType | SimpleType[] | undefined>;

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface LogObject {
    level: LogLevel;
    msg: string | unknown;
    data?: LogData;
}

export class Logger {

    private static log(o: LogObject): LogObject {
        const time = new Date().toISOString();
        const msg = typeof o.msg === 'string' ? o.msg : JSON.stringify(o.msg)

        if (isLocalOrTestStage()) {
            switch (o.level) {
                case 'DEBUG':
                    console.debug(time, msg, o.data);
                    break;
                case 'INFO':
                    console.info(time, msg, o.data);
                    break;
                case 'WARN':
                    console.warn(time, msg, o.data);
                    break;
                case 'ERROR':
                    console.error(time, msg, o.data);
                    break;
            }
        } else {
            console.log(time, o.level, msg, o.data);
        }
        return o;
    }

    static debug(msg: string | unknown, data?: LogData): LogObject {
        return Logger.log({ level: 'DEBUG', msg, data });
    }

    static info(msg: string | unknown, data?: LogData): LogObject {
        return Logger.log({ level: 'INFO', msg, data });
    }

    static warn(msg: string | unknown, data?: LogData): LogObject {
        return Logger.log({ level: 'WARN', msg, data });
    }

    static error(msg: string | unknown, data?: unknown): LogObject {
        if (data instanceof Error) {
            data = { ...data, message: data.message, stack: data.stack, name: data.name };
        }

        return Logger.log({ level: 'ERROR', msg, data: data as LogData });
    }
}