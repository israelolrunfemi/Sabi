import User from './user.model';
import EconomicProfile from './economic-profile.model';
import SquadAccount from './squad-account.model';
import Transaction from './transaction.model';
import Opportunity from './opportunity.model';
import Match from './match.model';
import Rating from './rating.model';
import Vouch from './vouch.model';
import BuyerRequest from './buyer-request.model';
import GigApplication from './gig-application.model';
import EscrowPayment from './escrow-payment.model';

// ── Associations ────────────────────────────────────────────────────────────
User.hasOne(EconomicProfile, { foreignKey: 'userId', as: 'economicProfile' });
User.hasOne(SquadAccount, { foreignKey: 'userId', as: 'squadAccount' });
User.hasMany(Transaction, { foreignKey: 'userId', as: 'transactions' });
User.hasMany(Opportunity, { foreignKey: 'posterId', as: 'opportunities' });
User.hasMany(Match, { foreignKey: 'seekerId', as: 'matches' });
User.hasMany(Rating, { foreignKey: 'rateeId', as: 'ratingsReceived' });
User.hasMany(Rating, { foreignKey: 'raterId', as: 'ratingsGiven' });
User.hasMany(Vouch, { foreignKey: 'voucheeId', as: 'vouchesReceived' });
User.hasMany(Vouch, { foreignKey: 'voucherId', as: 'vouchesGiven' });
User.hasMany(BuyerRequest, { foreignKey: 'buyerId', as: 'buyerRequests' });
User.hasMany(GigApplication, { foreignKey: 'seekerId', as: 'applications' });
User.hasMany(EscrowPayment, { foreignKey: 'buyerId', as: 'buyerEscrowPayments' });
User.hasMany(EscrowPayment, { foreignKey: 'traderId', as: 'traderEscrowPayments' });
Opportunity.hasMany(GigApplication, { foreignKey: 'opportunityId', as: 'applications' });

EconomicProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });
SquadAccount.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Transaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Opportunity.belongsTo(User, { foreignKey: 'posterId', as: 'poster' });
Match.belongsTo(User, { foreignKey: 'seekerId', as: 'seeker' });
Match.belongsTo(Opportunity, { foreignKey: 'opportunityId', as: 'opportunity' });
Rating.belongsTo(User, { foreignKey: 'raterId', as: 'rater' });
Rating.belongsTo(User, { foreignKey: 'rateeId', as: 'ratee' });
Rating.belongsTo(Transaction, { foreignKey: 'transactionId', as: 'transaction' });
Vouch.belongsTo(User, { foreignKey: 'voucherId', as: 'voucher' });
Vouch.belongsTo(User, { foreignKey: 'voucheeId', as: 'vouchee' });
BuyerRequest.belongsTo(User, { foreignKey: 'buyerId', as: 'buyer' });
GigApplication.belongsTo(Opportunity, { foreignKey: 'opportunityId', as: 'opportunity' });
GigApplication.belongsTo(User, { foreignKey: 'seekerId', as: 'seeker' });
EscrowPayment.belongsTo(User, { foreignKey: 'buyerId', as: 'buyer' });
EscrowPayment.belongsTo(User, { foreignKey: 'traderId', as: 'trader' });

export {
  User,
  EconomicProfile,
  SquadAccount,
  Transaction,
  Opportunity,
  Match,
  Rating,
  Vouch,
  BuyerRequest,
  GigApplication,
  EscrowPayment,
};

