import {
    activateScheduleParameters, createAlertScheduleParameters,
    createScheduleParameters,
    deactivateScheduleParameters,
    deleteScheduleParameters,
    getScheduleParameters,
    updateScheduleParameters
} from "../../../src/domain";

import { ScheduleRepository } from "../../../src/repositories";

const mockPutWatch = jest.fn();
const mockGetWatch = jest.fn();
const mockDeleteWatch = jest.fn();
const mockActivateWatch = jest.fn();
const mockDeactivateWatch = jest.fn();
const mockSearch = jest.fn().mockReturnValue({ body: '' });

mockGetWatch.mockImplementation(() => Promise.resolve({
    body: {
        watch: {
            actions: { webhook: { webhook: { path: "123" } } },
            trigger: { schedule: { cron: "123" } }
        },
        status: { state: { active: true } },
    },
    statusCode: 200
}))

jest.mock('../../../src/elasticsearch', () => ({
    watcher: {
        putWatch: () => mockPutWatch(),
        getWatch: () => mockGetWatch(),
        deleteWatch: () => mockDeleteWatch(),
        activateWatch: () => mockActivateWatch(),
        deactivateWatch: () => mockDeactivateWatch(),
    },
    search: () => mockSearch(),
}));

const CREATE_SCHEDULE_INPUT: createScheduleParameters = {
    "scheduleId": "123",
    "scheduleType": "publish",
    "cron": "0 0 13 24 DEC ? 2021",
    "baseURL": "https://wariugozq8.execute-api.eu-west-1.amazonaws.com/document"
}

const CREATE_ALERT_SCHEDULE_INPUT: createAlertScheduleParameters = {
    "scheduleId": "123",
    "collectionId": "publish",
    "cron": "0 0 13 24 DEC ? 2021",
    "baseURL": "https://wariugozq8.execute-api.eu-west-1.amazonaws.com/document"
}

describe(`Schedule repository tests`, () => {

    test(`createSearchQuery returns correct query`, async () => {
        const expectedQuery = {
            id: CREATE_SCHEDULE_INPUT.scheduleId,
            active: true,
            body: {
                trigger: { schedule: { "cron": CREATE_SCHEDULE_INPUT.cron } },
                actions: {
                    webhook: {
                        webhook: {
                            method: "POST",
                            url: "https://wariugozq8.execute-api.eu-west-1.amazonaws.com/document/editorial-record/" + CREATE_SCHEDULE_INPUT.scheduleId + "/" + CREATE_SCHEDULE_INPUT.scheduleType,
                        }
                    }
                }
            }
        }


        const searchQuery = ScheduleRepository.createSearchQuery(CREATE_SCHEDULE_INPUT)

        expect(searchQuery).toEqual(expectedQuery)
    });

    test(`createAlertSearchQuery returns correct query`, async () => {
        const expectedQuery = {
            id: CREATE_ALERT_SCHEDULE_INPUT.scheduleId,
            active: true,
            body: {
                trigger: { schedule: { "cron": CREATE_ALERT_SCHEDULE_INPUT.cron } },
                actions: {
                    webhook: {
                        webhook: {
                            method: "PUT",
                            url: `${CREATE_ALERT_SCHEDULE_INPUT.baseURL}/collections/${CREATE_ALERT_SCHEDULE_INPUT.collectionId}/alerts/${CREATE_ALERT_SCHEDULE_INPUT.scheduleId}/process/`,
                            headers : {
                                "schedule-api-key" : CREATE_ALERT_SCHEDULE_INPUT.apiKey
                            },
                        }
                    }
                }
            }
        }


        const searchQuery = ScheduleRepository.createAlertSearchQuery(CREATE_ALERT_SCHEDULE_INPUT)

        expect(searchQuery).toEqual(expectedQuery)
    });

    test(`createSchedule calls createSearchQuery`, async () => {
        const spy = jest.spyOn(ScheduleRepository, 'createSearchQuery');
        await ScheduleRepository.defaultInstance.createSchedule(CREATE_SCHEDULE_INPUT)

        expect(mockPutWatch).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
    });

    test(`createAlertSchedule calls createAlertSearchQuery`, async () => {
        const spy = jest.spyOn(ScheduleRepository, 'createAlertSearchQuery');
        await ScheduleRepository.defaultInstance.createAlertSchedule(CREATE_ALERT_SCHEDULE_INPUT)

        expect(mockPutWatch).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
    });

    test(`getSchedule calls getWatch`, async () => {
        const getScheduleParameters: getScheduleParameters = {
            scheduleId: "123"
        }
        await ScheduleRepository.defaultInstance.getSchedule(getScheduleParameters)

        expect(mockPutWatch).toHaveBeenCalled();
    });

    test(`deleteSchedule calls deleteWatch`, async () => {
        const deleteScheduleParameters: deleteScheduleParameters = {
            scheduleId: "123"
        }
        await ScheduleRepository.defaultInstance.deleteSchedule(deleteScheduleParameters)

        expect(mockDeleteWatch).toHaveBeenCalled();
    });

    test(`updateSchedule updates the schedule`, async () => {
        const updateScheduleParameters: updateScheduleParameters = {
            scheduleId: "123",
            cron: "123"
        }
        await ScheduleRepository.defaultInstance.updateSchedule(updateScheduleParameters)

        expect(mockGetWatch).toHaveBeenCalled();
        expect(mockPutWatch).toHaveBeenCalled();
    });

    test(`activateSchedule activates the schedule`, async () => {
        const activateScheduleParameters: activateScheduleParameters = {
            scheduleId: "123",
        }
        await ScheduleRepository.defaultInstance.activateSchedule(activateScheduleParameters)

        expect(mockActivateWatch).toHaveBeenCalled();
    });

    test(`deactivateSchedule deactivates the schedule`, async () => {
        const deactivateScheduleParameters: deactivateScheduleParameters = {
            scheduleId: "123",
        }
        await ScheduleRepository.defaultInstance.deactivateSchedule(deactivateScheduleParameters)

        expect(mockDeactivateWatch).toHaveBeenCalled();
    });

});