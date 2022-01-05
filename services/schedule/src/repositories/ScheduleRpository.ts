const { Client } = require('@elastic/elasticsearch')

import {
    createScheduleParameters, 
    deleteScheduleParameters,
    updateScheduleParameters,
} from "../domain";
import { Schedule } from "./Schedule"
import elasticsearch from "../elasticsearch"
import { Logger } from "@dodsgroup/dods-lambda";

export class ScheduleRepository implements Schedule {

    constructor(private elasticsearch: typeof Client) {}

    static defaultInstance: Schedule = new ScheduleRepository(elasticsearch);

    static createSearchQuery(data: createScheduleParameters|updateScheduleParameters): any{
        return{
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

    async deleteSchedule(data: deleteScheduleParameters): Promise<any> {
        return this.elasticsearch.watcher.deleteWatch(data);
    }

    async updateSchedule(data: updateScheduleParameters): Promise<any> {
        const schedule =  this.elasticsearch.watcher.getWatch(data);
        if (schedule.statusCode == 200) {
            const scheduleType = (schedule.body.watch.actions.webhook.webhook.path.split('/'))[3]
            data.scheduleType = scheduleType
            const query = ScheduleRepository.createSearchQuery(data);
            return this.elasticsearch.watcher.putWatch(query);
        }
    }
}   