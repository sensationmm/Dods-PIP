const { Client } = require('@elastic/elasticsearch')

import {createScheduleParameters} from "../domain";
import { Schedule } from "./Schedule"
import elasticsearch from "../elasticsearch"

export class ScheduleRepository implements Schedule {

    constructor(private elasticsearch: typeof Client) {}

    static defaultInstance: Schedule = new ScheduleRepository(elasticsearch);

    static createSearchQuery(data: createScheduleParameters): any{
        return {
            id: data.id,
            active: true,
            body: {
                trigger: {
                    schedule: { "cron" : data.cron }
                },
                actions: {
                    webhook: {
                        webhook: {
                            method: "GET",
                            url: "https://wariugozq8.execute-api.eu-west-1.amazonaws.com/document/" + data.id + "/" + data.scheduleType,
                        }
                    }
                }
            }
        }
    }

    async createSchedule(data: createScheduleParameters): Promise<any> {
        const query = ScheduleRepository.createSearchQuery(data);
        return this.elasticsearch.watcher.putWatch(query);
    }
}