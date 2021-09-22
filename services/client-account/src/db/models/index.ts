import ClientAccountModel from './ClientAccount';
import UserProfileModel from './UserProfile';
import SubscriptionTypeModel from './SubscriptionType';


ClientAccountModel.belongsTo(SubscriptionTypeModel, {
    foreignKey: 'subscription',
});



ClientAccountModel.belongsToMany(UserProfileModel, { through: 'dods_client_account_teams', foreignKey: 'client_account_id' });
UserProfileModel.belongsToMany(ClientAccountModel, { through: 'dods_client_account_teams',foreignKey: 'user_id'  });





export { ClientAccountModel, SubscriptionTypeModel,UserProfileModel };
