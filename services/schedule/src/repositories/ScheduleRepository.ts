const { Client } = require('@elastic/elasticsearch')

import {
    activateScheduleParameters,
    createPercolatorParameters,
    createScheduleParameters,
    deactivateScheduleParameters,
    deleteScheduleParameters,
    getScheduleParameters,
    updateScheduleParameters,
} from "../domain";
import {Schedule} from "./Schedule"
import elasticsearch from "../elasticsearch"

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

        return await this.elasticsearch.watcher.putWatch(query);
    }

    async deleteSchedule(data: deleteScheduleParameters): Promise<void> {
        await this.elasticsearch.watcher.deleteWatch(data);
    }

    async updateSchedule(data: updateScheduleParameters): Promise<void> {
        const schedule =  await this.elasticsearch.watcher.getWatch({id: data.id});
        if (schedule.statusCode == 200) {
            data.scheduleType = (schedule.body.watch.actions.webhook.webhook.path.split('/'))[3]
            const query = ScheduleRepository.createSearchQuery(data);
            await this.elasticsearch.watcher.putWatch(query);
        }
    }

    async activateSchedule(data: activateScheduleParameters): Promise<void> {
        await this.elasticsearch.watcher.activateWatch({watch_id: data.id});
    }

    async deactivateSchedule(data: deactivateScheduleParameters): Promise<void> {
        await this.elasticsearch.watcher.deactivateWatch({watch_id: data.id});
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

    async createPercolator(data: createPercolatorParameters): Promise<any> {
         const response = await this.elasticsearch.search(data)

        return response['body']
    }
}