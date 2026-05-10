import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.config';

export type MatchStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

interface MatchAttributes {
  id: string;
  seekerId: string;
  opportunityId: string;
  score: number;
  reasoning: string | null;
  keyStrengths: string[];
  potentialGaps: string[];
  status: MatchStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

interface MatchCreationAttributes
  extends Optional<MatchAttributes, 'id' | 'status' | 'reasoning' | 'keyStrengths' | 'potentialGaps'> {}

class Match
  extends Model<MatchAttributes, MatchCreationAttributes>
  implements MatchAttributes
{
  declare id: string;
  declare seekerId: string;
  declare opportunityId: string;
  declare score: number;
  declare reasoning: string | null;
  declare keyStrengths: string[];
  declare potentialGaps: string[];
  declare status: MatchStatus;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Match.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    seekerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
    opportunityId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'opportunities', key: 'id' },
      onDelete: 'CASCADE',
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reasoning: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    keyStrengths: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    potentialGaps: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'ACCEPTED', 'REJECTED'),
      defaultValue: 'PENDING',
    },
  },
  {
    sequelize,
    modelName: 'Match',
    tableName: 'matches',
    underscored: true,
  }
);

export default Match;