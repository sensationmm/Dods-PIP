import { EditorialRecordError, EditorialRecordStatusError, UserProfileError } from '@dodsgroup/dods-domain';
import { EditorialRecord, EditorialRecordStatus, Op, Sequelize, User, WhereOptions, } from '@dodsgroup/dods-model';

import {
    ArchiveEditorialRecordParameters,
    CreateEditorialRecordParameters,
    EditorialRecordListOutput,
    EditorialRecordOutput,
    EditorialRecordPersister,
    LockEditorialRecordParameters,
    RecordStatuses,
    SearchEditorialRecordParameters,
    UpdateEditorialRecordParameters,
    ScheduleEditorialRecordParamateres,
} from './domain';

export * from './domain';

export class EditorialRecordRepository implements EditorialRecordPersister {
    static defaultInstance: EditorialRecordPersister = new EditorialRecordRepository(EditorialRecord, EditorialRecordStatus, User);

    constructor(
        private editorialRecordModel: typeof EditorialRecord,
        private editorialRecordStatusModel: typeof EditorialRecordStatus,
        private userModel: typeof User,
        private recordStatuses = RecordStatuses
    ) { }


    private mapRecordOutput(model: EditorialRecord): EditorialRecordOutput {
        const {
            uuid,
            documentName,
            s3Location,
            informationType,
            contentSource,
            status,
            isPublished,
            isArchived,
            assignedEditor,
            createdAt,
            updatedAt,
        } = model;

        return {
            uuid,
            documentName,
            s3Location,
            informationType,
            contentSource,
            status: status
                ? {
                    uuid: status.uuid,
                    status: status.status,
                }
                : undefined,
            assignedEditor: assignedEditor
                ? {
                    uuid: assignedEditor.uuid,
                    fullName: assignedEditor.fullName,
                }
                : undefined,
            isPublished: isPublished ? true : false,
            isArchived: isArchived ? true : false,
            createdAt,
            updatedAt,
        };
    }

    private async setStatusToRecord(record: EditorialRecord, statusId: string): Promise<void> {
        const status = await this.editorialRecordStatusModel.findOne({
            where: {
                uuid: statusId,
            },
        });

        if (!status) {
            throw new EditorialRecordStatusError(`Unable to retrieve Editorial Record Status with uuid: ${statusId}`);
        }
        await record.setStatus(status);
    }

    private async setAssignedEditorToRecord(record: EditorialRecord, assignedEditorId: string): Promise<void> {
        const editor = await this.userModel.findOne({
            where: {
                uuid: assignedEditorId,
            },
        });

        if (!editor) {
            throw new UserProfileError(`Unable to retrieve User with uuid: ${assignedEditorId}`);
        }
        await record.setAssignedEditor(editor);
    }

    async checkUserId(userId: string): Promise<boolean> {
        const user = await this.userModel.findOne({
            where: {
                uuid: userId,
            },
        });
        return !!user;
    }

    async createEditorialRecord(parameters: CreateEditorialRecordParameters): Promise<EditorialRecordOutput> {
        const {
            documentName,
            s3Location,
            informationType,
            contentSource,
            assignedEditorId,
            statusId,
        } = parameters;

        const newRecord = await this.editorialRecordModel.create(
            {
                documentName,
                s3Location,
                informationType,
                contentSource,
            },
            {
                include: ['status', 'assignedEditor'],
            }
        );

        if (assignedEditorId) {
            await this.setAssignedEditorToRecord(newRecord, assignedEditorId);
        }

        if (statusId) {
            await this.setStatusToRecord(newRecord, statusId);
        }

        await newRecord.reload({
            include: ['status', 'assignedEditor'],
        });

        return this.mapRecordOutput(newRecord);
    }

    async updateEditorialRecord(parameters: UpdateEditorialRecordParameters): Promise<EditorialRecordOutput> {
        const {
            recordId,
            documentName,
            s3Location,
            contentSource,
            informationType,
            statusId,
            assignedEditorId,
            isPublished
        } = parameters;

        const record = await this.editorialRecordModel.findOne({
            where: {
                uuid: recordId,
            },
            include: ['status', 'assignedEditor'],
        });

        if (!record) {
            throw new EditorialRecordError(`Error: could not retrieve Editorial Record with uuid: ${recordId}`);
        }

        await record.update({
            documentName,
            s3Location,
            contentSource,
            informationType,
            isPublished
        });

        if (assignedEditorId) {
            await this.setAssignedEditorToRecord(record, assignedEditorId);
        }

        if (statusId) {
            if (
                !record.assignedEditor &&
                !assignedEditorId &&
                statusId === this.recordStatuses.inProgress
            ) {
                throw new EditorialRecordStatusError('Can not set state In-progress to a record without Assigned Editor.');
            }
            await this.setStatusToRecord(record, statusId);
        }

        await record.reload({
            include: ['status', 'assignedEditor'],
        });

        return this.mapRecordOutput(record);
    }

    async scheduleEditorialRecord(parameters: ScheduleEditorialRecordParamateres): Promise<EditorialRecordOutput> {
        const { recordId } = parameters;

        const record = await this.editorialRecordModel.findOne({
            where: {
                uuid: recordId,
            },
            include: ['status'],
        });

        if (!record) {
            throw new EditorialRecordError(
                `Error: could not retrieve Editorial Record with uuid: ${recordId}`
            );
        }

        if (this.recordStatuses.scheduled == record.status?.uuid) {
            throw new EditorialRecordError(
                `Error: Editorial Record with uuid: ${recordId} is already scheduled`
            );
        }

        await this.setStatusToRecord(record, this.recordStatuses.scheduled)

        await record.reload({
            include: ['status', 'assignedEditor'],
        });

        return this.mapRecordOutput(record);

    }

    async lockEditorialRecord(parameters: LockEditorialRecordParameters): Promise<EditorialRecordOutput> {
        const { recordId, assignedEditorId } = parameters;

        const record = await this.editorialRecordModel.findOne({
            where: {
                uuid: recordId,
            },
            include: ['status', 'assignedEditor'],
        });

        if (!record) {
            throw new EditorialRecordError(`Error: could not retrieve Editorial Record with uuid: ${recordId}`);
        }

        if (record.assignedEditor) {
            throw new EditorialRecordError(
                `Error: Editorial Record is already locked by ${record.assignedEditor.fullName} with uuid: ${record.assignedEditor.uuid}`,
                this.mapRecordOutput(record)
            );
        }

        if (record.status && record.status.uuid === this.recordStatuses.inProgress) {
            throw new EditorialRecordError(
                'Error: Editorial Record is already In Progress',
                this.mapRecordOutput(record)
            );
        }

        await this.setAssignedEditorToRecord(record, assignedEditorId);

        await this.setStatusToRecord(record, this.recordStatuses.inProgress);

        await record.reload({
            include: ['status', 'assignedEditor'],
        });

        return this.mapRecordOutput(record);
    }

    async getEditorialRecord(recordId: string): Promise<EditorialRecordOutput> {
        const record = await this.editorialRecordModel.findOne({
            where: {
                uuid: recordId,
                isArchived: false
            },
            include: ['status', 'assignedEditor'],
        });

        if (!record) {
            throw new EditorialRecordError(`Unable to retrieve Editorial Record with uuid: ${recordId}`);
        }

        return this.mapRecordOutput(record);
    }

    async unassignEditorToRecord(recordId: string): Promise<void> {

        const record = await this.editorialRecordModel.findOne({
            where: {
                uuid: recordId,
            }
        });

        await record?.update({ 'assignedEditorId': null })

    }

    async listEditorialRecords(parameters: SearchEditorialRecordParameters): Promise<EditorialRecordListOutput> {
        const {
            searchTerm,
            informationType,
            contentSource,
            status,
            startDate,
            endDate,
            limit,
            offset,
            sortBy,
            sortDirection,
        } = parameters;

        const whereRecord: WhereOptions = { isArchived: false };

        // Search by document name case insensitive coincidences
        if (searchTerm) {
            const lowerCaseName = searchTerm.trim().toLocaleLowerCase();
            whereRecord['documentName'] = Sequelize.where(
                Sequelize.fn('LOWER', Sequelize.col('document_name')),
                'LIKE',
                `%${lowerCaseName}%`
            );
        }

        // Filter by information type
        if (informationType) {
            whereRecord['informationType'] = informationType;
        }

        // Filter by content source
        if (contentSource) {
            whereRecord['contentSource'] = contentSource;
        }

        // Filter by status
        if (status) {
            whereRecord['$status.uuid$'] = status;
        }

        //Filter by range or limits
        let dateArray = [];

        if (startDate) {
            dateArray.push({
                [Op.gte]: new Date(startDate),
            });
        }
        if (endDate) {
            dateArray.push({
                [Op.lte]: new Date(endDate),
            });
        }
        if (dateArray.length) {
            whereRecord['createdAt'] = {
                [Op.and]: dateArray,
            };
        }
        let orderBy: any = [sortBy, sortDirection];

        if (sortBy === 'statusId') {
            orderBy = ['status', 'status', sortDirection];
        }

        const totalRecords = await this.editorialRecordModel.count();

        const { count: filteredRecords, rows } = await this.editorialRecordModel.findAndCountAll({
            where: whereRecord,
            include: ['status', 'assignedEditor'],
            order: [orderBy],
            offset: parseInt(offset!),
            limit: parseInt(limit!),
        });

        return {
            totalRecords,
            filteredRecords,
            results: rows.map(this.mapRecordOutput),
        };
    }

    async archiveEditorialRecord(parameters: ArchiveEditorialRecordParameters): Promise<void> {
        const editorialRecord = await EditorialRecord.findOne({ where: { uuid: parameters.recordId } });

        if (!editorialRecord) {
            throw new EditorialRecordError('Editorial Record not found');
        }

        await editorialRecord.update({ isArchived: true });

        await editorialRecord.destroy();
    }
}
