import { createScheduleParameters } from "../../../src/domain";
import { ScheduleRepository } from "../../../src/repositories/ScheduleRepository";

const mockPutWatch = jest.fn();

jest.mock('../../../src/elasticsearch', () => ({
    watcher: {
        putWatch: () => mockPutWatch()
    }
}));

const CREATE_SCHEDULE_INPUT: createScheduleParameters = {
    "id": "123",
    "scheduleType": "publishing",
    "cron": "0 0 13 24 DEC ? 2021"
}

describe(`Schedule repository tests`, () => {

    test(`createSearchQuery returns correct query`, async () => {
        const expectedQuery = {
            id: CREATE_SCHEDULE_INPUT.id,
            active: true,
            body: {
                trigger: { schedule: { "cron": CREATE_SCHEDULE_INPUT.cron } },
                actions: {
                    webhook: {
                        webhook: {
                            method: "GET",
                            url: "https://wariugozq8.execute-api.eu-west-1.amazonaws.com/document/" + CREATE_SCHEDULE_INPUT.id + "/" + CREATE_SCHEDULE_INPUT.scheduleType,
                        }
                    }
                }
            }
        }


        const searchQuery = ScheduleRepository.createSearchQuery(CREATE_SCHEDULE_INPUT)

        expect(searchQuery).toEqual(expectedQuery)
    });

    test(`createSchedule calls createSearchQuery`, async () => {
        const spy = jest.spyOn(ScheduleRepository, 'createSearchQuery');
        await ScheduleRepository.defaultInstance.createSchedule(CREATE_SCHEDULE_INPUT)

        expect(mockPutWatch).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalled();
    });
});