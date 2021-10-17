// require('dotenv').config();
// import { User } from './models';

// const isDev = process.env.NODE_ENV === 'development';
// const isTest = process.env.NODE_ENV === 'test';

// const dbInit = async () => {
//     await User.sync({ alter: isDev || isTest })
// }

// export default dbInit;

import { ClientAccount, ClientAccountTag, ClientAccountTeam, ClientAccountTeamUser, SubscriptionType, User, Task, ProjectUser, Role, Project, ProjectDate } from './models';

User.belongsTo(Role, { as: 'UserRole', foreignKey: 'roleId', targetKey: 'id' });

ClientAccount.belongsTo(SubscriptionType, { as: 'ClientAccountSubscriptionType', foreignKey: 'subscription', targetKey: 'id' });
ClientAccount.belongsTo(User, { as: 'ClientAccountSalesContactUser', foreignKey: 'salesContact', targetKey: 'id' });

ClientAccountTeam.belongsTo(User, { as: 'ClientAccountTeamUser', foreignKey: 'userId', targetKey: 'id' });
ClientAccountTeam.belongsTo(ClientAccount, { as: 'ClientAccountTeamClientAccount', foreignKey: 'clientAccountId', targetKey: 'id' })

ClientAccountTag.belongsTo(ClientAccount, { as: 'ClientAccountTagClinetAccount', foreignKey: 'clientAccountId', targetKey: 'id' });

ClientAccountTeamUser.belongsTo(ClientAccount, { as: 'ClientAccountTeamUserClientAccount', foreignKey: 'clientAccountId', targetKey: 'id' });
ClientAccountTeamUser.belongsTo(User, { as: 'ClientAccountTeamUser', foreignKey: 'userId', targetKey: 'id' });

Task.belongsTo(User, { as: 'TaskAssignedToUser', foreignKey: 'assignedTo', targetKey: 'id' });
Task.belongsTo(User, { as: 'TaskCreatedByUser', foreignKey: 'createdBy', targetKey: 'id' });

ProjectUser.belongsTo(User, { as: 'ProjectUser', foreignKey: 'userId', targetKey: 'id' });
ProjectUser.belongsTo(Project, { as: 'ProjectUserProject', foreignKey: 'projectId', targetKey: 'id' });

ProjectDate.belongsTo(Project, { as: 'ProjectDateProject', foreignKey: 'projectId', targetKey: "id" });

export * from './models';