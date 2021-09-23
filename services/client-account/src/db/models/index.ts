import ClientAccountModel from './ClientAccount';
import SubscriptionTypeModel from './SubscriptionType';
import ClientAccountTeamModel from './ClientAccountTeam';

// SubscriptionTypeModel.hasMany(ClientAccountModel, {
//     foreignKey: 'id'
// });
ClientAccountModel.belongsTo(SubscriptionTypeModel, {
    foreignKey: 'subscription',
});

// ClientAccountTeamModel.hasMany(ClientAccountModel, {
//     foreignKey: 'clientAccountId',
//     sourceKey: 'id'
// });
ClientAccountModel.belongsTo(ClientAccountTeamModel, {
    foreignKey: 'id',
    targetKey: 'clientAccountId'
});

export { ClientAccountModel, SubscriptionTypeModel, ClientAccountTeamModel };
