import {
    CreateEditorialRecordParameters,
    EditorialRecordListOutput,
    EditorialRecordOutput,
    EditorialRecordPersister,
    SearchEditorialRecordParameters,
} from '../domain';
import {
    EditorialRecord,
    EditorialRecordStatus,
    Op,
    Sequelize,
    User,
    WhereOptions,
} from '@dodsgroup/dods-model';

export class EditorialRecordRepository implements EditorialRecordPersister {
    constructor(
        private editorialRecordModel: typeof EditorialRecord,
        private editorialRecordStatusModel: typeof EditorialRecordStatus,
        private userModel: typeof User
    ) {}

    static defaultInstance = new EditorialRecordRepository(
        EditorialRecord,
        EditorialRecordStatus,
        User
    );

    private static mapModelToOutput = (model: EditorialRecord): EditorialRecordOutput => {
        const {
            uuid,
            documentName,
            s3Location,
            informationType,
            contentSource,
            status,
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
            createdAt,
            updatedAt,
        };
    };

    async createEditorialRecord(
        params: CreateEditorialRecordParameters
    ): Promise<EditorialRecordOutput> {
        const { documentName, s3Location, informationType, contentSource } = params;

        const newRecord = await this.editorialRecordModel.create({
            documentName,
            s3Location,
            informationType,
            contentSource,
        });

        // Search and assign a status if statusId is given
        if (params.statusId) {
            const recordStatus = await this.editorialRecordStatusModel.findOne({
                where: {
                    uuid: params.statusId,
                },
            });
            if (recordStatus) {
                await newRecord.setStatus(recordStatus);
                newRecord.status = recordStatus;
            }
        }

        // Search and assign an editor if assignEditorId is given
        if (params.assignedEditorId) {
            const recordEditor = await this.userModel.findOne({
                where: {
                    uuid: params.assignedEditorId,
                },
            });
            if (recordEditor) {
                await newRecord.setAssignedEditor(recordEditor);
                newRecord.assignedEditor = recordEditor;
            }
        }

        return EditorialRecordRepository.mapModelToOutput(newRecord);
    }

    async listEditorialRecords(
        params: SearchEditorialRecordParameters
    ): Promise<EditorialRecordListOutput> {
        const {
            searchTerm,
            informationType,
            contentSource,
            status,
            startDate,
            endDate,
            limit,
            offset,
        } = params;

        const whereRecord: WhereOptions = {};

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

        const totalRecords = await this.editorialRecordModel.count();

        const { count: filteredRecords, rows } = await this.editorialRecordModel.findAndCountAll({
            where: whereRecord,
            include: ['status', 'assignedEditor'],
            offset: parseInt(offset),
            limit: parseInt(limit),
        });

        return {
            totalRecords,
            filteredRecords,
            results: rows.map(EditorialRecordRepository.mapModelToOutput),
        };
    }
}
