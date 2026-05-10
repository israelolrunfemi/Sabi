import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.config';

export type OpportunityStatus = 'OPEN' | 'CLOSED' | 'FILLED';
export type OpportunityType = 'JOB' | 'TRADE';

interface OpportunityAttributes {
  id: string;
  posterId: string;
  title: string;
  description: string;
  type: OpportunityType;
  category: string;
  location: string | null;
  budget: number | null;
  status: OpportunityStatus;
  expiresAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface OpportunityCreationAttributes
  extends Optional<OpportunityAttributes, 'id' | 'status' | 'location' | 'budget' | 'expiresAt'> {}

class Opportunity
  extends Model<OpportunityAttributes, OpportunityCreationAttributes>
  implements OpportunityAttributes
{
  declare id: string;
  declare posterId: string;
  declare title: string;
  declare description: string;
  declare type: OpportunityType;
  declare category: string;
  declare location: string | null;
  declare budget: number | null;
  declare status: OpportunityStatus;
  declare expiresAt: Date | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Opportunity.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    posterId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('JOB', 'TRADE'),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    budget: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('OPEN', 'CLOSED', 'FILLED'),
      defaultValue: 'OPEN',
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Opportunity',
    tableName: 'opportunities',
    underscored: true,
  }
);

export default Opportunity;