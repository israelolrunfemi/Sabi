import User from './user.model';
import EconomicProfile from './economic-profile.model';
import SquadAccount from './squad-account.model';
import Transaction from './transaction.model';
import Opportunity from './opportunity.model';
import Match from './match.model';
import Rating from './rating.model';
import Vouch from './vouch.model';

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

export {
  User,
  EconomicProfile,
  SquadAccount,
  Transaction,
  Opportunity,
  Match,
  Rating,
  Vouch,
};

