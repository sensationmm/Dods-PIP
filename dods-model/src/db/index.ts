import { ClientAccount, ClientAccountTag, ClientAccountTeam, ClientAccountUser, SubscriptionType, User, Task, ProjectUser, Role, Project, ProjectDate } from './models';
import sequelizeConnection from './config/sequelizeConnection';

User.belongsTo(Role, { as: 'role', foreignKey: 'roleId', targetKey: 'id' });

ClientAccount.belongsTo(SubscriptionType, { as: 'subscriptionType', foreignKey: 'subscription', targetKey: 'id' });
ClientAccount.belongsTo(User, { as: 'salesContactUser', foreignKey: 'salesContact', targetKey: 'id' });

ClientAccountTeam.belongsTo(ClientAccount, { as: 'clientAccounts', foreignKey: 'userId', targetKey: 'id' });
ClientAccountTeam.belongsTo(User, { as: 'users', foreignKey: 'clientAccountId', targetKey: 'id' })

ClientAccountUser.belongsTo(ClientAccount, { as: 'clientAccounts', foreignKey: 'clientAccountId', targetKey: 'id' });
ClientAccountUser.belongsTo(User, { as: 'users', foreignKey: 'userId', targetKey: 'id' });

ClientAccountTag.belongsTo(ClientAccount, { as: 'clientAccount', foreignKey: 'clientAccountId', targetKey: 'id' });

Task.belongsTo(User, { as: 'assignedToUser', foreignKey: 'assignedTo', targetKey: 'id' });
Task.belongsTo(User, { as: 'createdByUser', foreignKey: 'createdBy', targetKey: 'id' });

ProjectUser.belongsTo(User, { as: 'users', foreignKey: 'userId', targetKey: 'id' });
ProjectUser.belongsTo(Project, { as: 'projects', foreignKey: 'projectId', targetKey: 'id' });

ProjectDate.belongsTo(Project, { as: 'project', foreignKey: 'projectId', targetKey: "id" });

export * from './models';

export { sequelizeConnection };
