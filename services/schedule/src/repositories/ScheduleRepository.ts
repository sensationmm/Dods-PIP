const { Client } = require('@elastic/elasticsearch')

import {
    activateScheduleParameters,
    config, createAlertScheduleParameters,
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

    alertApiKey = config.dods.downstreamKeys.alertApiKey

    constructor(private elasticsearch: typeof Client, private baseURL: string = apiGatewayBaseURL) { }

    static defaultInstance: Schedule = new ScheduleRepository(elasticsearch);


    static createSearchQuery(data: createScheduleParameters | updateScheduleParameters): any {
        return {
            id: data.scheduleId,
            active: true,
            body: {
                trigger: {schedule: { "cron": data.cron }},
                actions: {
                    webhook: {
                        webhook: {
                            method: "POST",
                            url: `${data.baseURL}/editorial-record/${data.scheduleId}/${data.scheduleType}`
                        }
                    }
                }
            }
        }

    }
    static createAlertSearchQuery(data: createAlertScheduleParameters): any {
        return {
            id: data.scheduleId,
            active: true,
            body: {
                trigger: {schedule: { "cron": data.cron }},
                actions: {
                    webhook: {
                        webhook: {
                            method: "PUT",
                            url: `${data.baseURL}/collections/${data.collectionId}/alerts/${data.scheduleId}/process/`,
                            headers : {
                                "schedule-api-key" : data.apiKey
                            },
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

    async createAlertSchedule(data: createAlertScheduleParameters): Promise<any> {
        data.baseURL = this.baseURL;
        data.apiKey = this.alertApiKey
        const query = ScheduleRepository.createAlertSearchQuery(data);

        return this.elasticsearch.watcher.putWatch(query);
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