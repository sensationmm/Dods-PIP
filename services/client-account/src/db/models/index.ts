import ClientAccountModel from './ClientAccount';
import ClientAccountTeamModel from './ClientAccountTeamModel';
import SubscriptionTypeModel from './SubscriptionType';
import UserProfileModel from './UserProfile';

// SubscriptionTypeModel.hasMany(ClientAccountModel, {
//     foreignKey: 'id'
// });
ClientAccountModel.belongsTo(SubscriptionTypeModel, {
    foreignKey: 'subscription',
    as: 'subscriptionType',
});

// ClientAccountTeamModel.hasMany(ClientAccountModel, {
//     foreignKey: 'clientAccountId',
//     sourceKey: 'id'
// });

ClientAccountTeamModel.hasMany(UserProfileModel, {
    foreignKey: 'id',
    sourceKey: 'userId',
});
// UserProfileModel.belongsTo(ClientAccountTeamModel, {
//     foreignKey: 'id',
//     targetKey: 'userId'
// });

ClientAccountModel.belongsToMany(UserProfileModel, {
    through: ClientAccountTeamModel,
    foreignKey: 'client_account_id',
    as: 'team',
});
UserProfileModel.belongsToMany(ClientAccountModel, {
    through: ClientAccountTeamModel,
    foreignKey: 'user_id',
    as: 'account',
});

export { ClientAccountModel, SubscriptionTypeModel, UserProfileModel, ClientAccountTeamModel };
