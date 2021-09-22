import ClientAccountModel from './ClientAccount';
import SubscriptionTypeModel from './SubscriptionType';

SubscriptionTypeModel.hasMany(ClientAccountModel, {
    foreignKey: 'id'
});
ClientAccountModel.belongsTo(SubscriptionTypeModel, {
    foreignKey: 'subscription',
});

export { ClientAccountModel, SubscriptionTypeModel };
