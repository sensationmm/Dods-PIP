import ClientAccountModel from './ClientAccount';
import SubscriptionTypeModel from './SubscriptionType';

ClientAccountModel.belongsTo(SubscriptionTypeModel);
SubscriptionTypeModel.hasMany(ClientAccountModel, {
    foreignKey: 'subscriptionTypeId',
});

export { ClientAccountModel, SubscriptionTypeModel };
