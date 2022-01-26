const { Client } = require('@elastic/elasticsearch')

import {
    activateScheduleParameters,
    config,
    createScheduleParameters,
    deactivateScheduleParameters,
    deleteScheduleParameters,
    getScheduleParameters,
    updateScheduleParameters
} from "../domain";

import { Schedule } from "./Schedule"
import elasticsearch from "../elasticsearch"

const { dods: { downstreamEndpoints: { apiGatewayBaseURL } } } = config;
export class ScheduleRepository implements Schedule {

    constructor(private elasticsearch: typeof Client, private baseURL: string = apiGatewayBaseURL) { }

    static defaultInstance: Schedule = new ScheduleRepository(elasticsearch);


    static createSearchQuery(data: createScheduleParameters | updateScheduleParameters): any {

        if (data.scheduleType === 'publish') {
            return {
                id: data.scheduleId,
                active: true,
                body: {
                    trigger: {
                        schedule: { "cron": data.cron }
                    },
                    actions: {
                        webhook: {
                            webhook: {
                                method: "POST",
                                //url: "https://wariugozq8.execute-api.eu-west-1.amazonaws.com/document/" + data.scheduleId + "/" + data.scheduleType,
                                url: `${data.baseURL}/editorial-record/${data.scheduleId}/${data.scheduleType}`
                            }
                        }
                    }
                }
            }
        }

    }

    async createSchedule(data: createScheduleParameters): Promise<any> {
        data.baseURL = this.baseURL;
        const query = ScheduleRepository.createSearchQuery(data);

        return await this.elasticsearch.watcher.putWatch(query);
    }

    async deleteSchedule(data: deleteScheduleParameters): Promise<void> {
        await this.elasticsearch.watcher.deleteWatch({ id: data.scheduleId });
    }

    async updateSchedule(data: updateScheduleParameters): Promise<void> {
        const schedule = await this.elasticsearch.watcher.getWatch({ id: data.scheduleId });
        if (schedule.statusCode == 200) {
            data.scheduleType = (schedule.body.watch.actions.webhook.webhook.path.split('/'))[3]
            const query = ScheduleRepository.createSearchQuery(data);
            await this.elasticsearch.watcher.putWatch(query);
        }
    }

    async activateSchedule(data: activateScheduleParameters): Promise<void> {
        await this.elasticsearch.watcher.activateWatch({ watch_id: data.scheduleId });
    }

    async deactivateSchedule(data: deactivateScheduleParameters): Promise<void> {
        await this.elasticsearch.watcher.deactivateWatch({ watch_id: data.scheduleId });
    }

    async getSchedule(data: getScheduleParameters): Promise<any> {
        const response = await this.elasticsearch.watcher.getWatch({
            id: data.scheduleId
        })
        const hookURL = response.body.watch.actions.webhook.webhook.path.split('/')
        const scheduleType = hookURL[hookURL.length - 1]

        return {
            "id": response.body._id,
            "type": scheduleType,
            "schedule": response.body.watch.trigger.schedule.cron,
            "active": response.body.status.state.active,
        }
    }
}