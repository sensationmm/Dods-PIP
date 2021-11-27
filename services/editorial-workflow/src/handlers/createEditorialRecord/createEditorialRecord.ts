import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { CreateEditorialRecordParameters, config } from '../../domain';

import { EditorialRecordRepository } from '../../repositories/EditorialRecordRepository';

export const createEditorialRecord: AsyncLambdaHandler<CreateEditorialRecordParameters> = async (
    params
) => {
    const { statusId, assignedEditorId } = params;

    if (assignedEditorId) {
        const validUserId = await EditorialRecordRepository.defaultInstance.checkUserId(
            assignedEditorId
        );
        if (!validUserId) {
            return new HttpResponse(HttpStatusCode.BAD_REQUEST, {
                success: false,
                message: `Error: can not find user with id: ${assignedEditorId}`,
            });
        }
    }

    if (statusId) {
        const validStatus = Object.values(config.dods.recordStatuses).includes(statusId);
        if (!validStatus) {
            return new HttpResponse(HttpStatusCode.BAD_REQUEST, {
                success: false,
                message: `Error: invalid statusId: ${statusId}`,
            });
        }
        if (statusId === config.dods.recordStatuses.inProgress && !assignedEditorId) {
            return new HttpResponse(HttpStatusCode.BAD_REQUEST, {
                success: false,
                message: 'Error: In-progress status requires a record with an Assigned Editor',
            });
        }
    }

    const newRecord = await EditorialRecordRepository.defaultInstance.createEditorialRecord(params);
    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: 'New Editorial Record created.',
        data: newRecord,
    });
};
