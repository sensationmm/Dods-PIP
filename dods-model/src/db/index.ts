import {
    ClientAccount,
    ClientAccountTag,
    ClientAccountTeam,
    ClientAccountUser,
    Collection,
    EditorialRecord,
    EditorialRecordStatus,
    Project,
    ProjectDate,
    ProjectUser,
    Role,
    SubscriptionType,
    Task,
    User,
    CollectionAlert,
    CollectionSavedQuery,
    CollectionDocument,
} from './models';

import sequelizeConnection from './config/sequelizeConnection';

if (process.env.NODE_ENV !== 'test') {
    User.belongsTo(Role, { as: 'role', foreignKey: 'roleId', targetKey: 'id' });

    ClientAccount.belongsTo(SubscriptionType, {
        as: 'subscriptionType',
        foreignKey: 'subscription',
        targetKey: 'id',
    });
    ClientAccount.belongsTo(User, {
        as: 'salesContactUser',
        foreignKey: 'salesContact',
        targetKey: 'id',
    });
    ClientAccount.hasMany(Collection, {
        as: 'collections',
        foreignKey: 'clientAccountId',
    });

    ClientAccountTeam.belongsTo(ClientAccount, {
        as: 'clientAccounts',
        foreignKey: 'userId',
        targetKey: 'id',
    });
    ClientAccountTeam.belongsTo(User, {
        as: 'users',
        foreignKey: 'clientAccountId',
        targetKey: 'id',
    });

    ClientAccount.belongsToMany(User, {
        through: ClientAccountTeam,
        foreignKey: 'client_account_id',
        as: 'team',
    });
    User.belongsToMany(ClientAccount, {
        through: ClientAccountTeam,
        foreignKey: 'user_id',
        as: 'accounts',
    });

    ClientAccountUser.belongsTo(ClientAccount, {
        as: 'clientAccounts',
        foreignKey: 'clientAccountId',
        targetKey: 'id',
    });
    ClientAccountUser.belongsTo(User, { as: 'users', foreignKey: 'userId', targetKey: 'id' });

    ClientAccountTag.belongsTo(ClientAccount, {
        as: 'clientAccount',
        foreignKey: 'clientAccountId',
        targetKey: 'id',
    });

    Task.belongsTo(User, { as: 'assignedToUser', foreignKey: 'assignedTo', targetKey: 'id' });
    Task.belongsTo(User, { as: 'createdByUser', foreignKey: 'createdBy', targetKey: 'id' });

    ProjectUser.belongsTo(User, { as: 'users', foreignKey: 'userId', targetKey: 'id' });
    ProjectUser.belongsTo(Project, { as: 'projects', foreignKey: 'projectId', targetKey: 'id' });

    ProjectDate.belongsTo(Project, { as: 'project', foreignKey: 'projectId', targetKey: 'id' });

    EditorialRecord.belongsTo(EditorialRecordStatus, {
        foreignKey: 'statusId',
        targetKey: 'id',
        as: 'status',
    });
    EditorialRecord.belongsTo(User, {
        foreignKey: 'assignedEditorId',
        targetKey: 'id',
        as: 'assignedEditor',
    });

    Collection.belongsTo(ClientAccount, {
        as: 'clientAccount',
        foreignKey: 'clientAccountId',
        targetKey: 'id',
    });
    Collection.belongsTo(User, {
        as: 'createdBy',
        foreignKey: 'createdById',
        targetKey: 'id',
    });
    Collection.hasMany(CollectionAlert, { as: 'alerts' });
    Collection.hasMany(CollectionSavedQuery, { as: 'savedQueries' });
    Collection.hasMany(CollectionDocument, { as: 'documents' });
}

export * from './models';

export { sequelizeConnection };
