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
ClientAccountModel.belongsTo(ClientAccountTeamModel, {
    foreignKey: 'id',
    targetKey: 'clientAccountId',
});
ClientAccountTeamModel.hasMany(UserProfileModel, {
    foreignKey: 'id',
    sourceKey: 'userId',
});
// UserProfileModel.belongsTo(ClientAccountTeamModel, {
//     foreignKey: 'id',
//     targetKey: 'userId'
// });

ClientAccountModel.belongsToMany(UserProfileModel, {
    through: 'dods_client_account_teams',
    foreignKey: 'client_account_id',
});
UserProfileModel.belongsToMany(ClientAccountModel, {
    through: 'dods_client_account_teams',
    foreignKey: 'user_id',
});

export {
    ClientAccountModel,
    SubscriptionTypeModel,
    UserProfileModel,
    ClientAccountTeamModel,
};
