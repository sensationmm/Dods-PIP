import ClientAccountModel from './ClientAccount';
import UserProfileModel from './UserProfile';
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

ClientAccountModel.belongsToMany(UserProfileModel, { through: 'dods_client_account_teams', foreignKey: 'client_account_id' });
UserProfileModel.belongsToMany(ClientAccountModel, { through: 'dods_client_account_teams',foreignKey: 'user_id'  });

export { ClientAccountModel, SubscriptionTypeModel, UserProfileModel, ClientAccountTeamModel };
