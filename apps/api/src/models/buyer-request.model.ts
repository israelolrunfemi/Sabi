import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.config';

export type BuyerRequestStatus = 'OPEN' | 'MATCHED' | 'CLOSED';

interface BuyerRequestAttributes {
  id: string;
  buyerId: string;
  imageUrl: string | null;
  rawDescription: string | null;
  extractedNeed: object;
  category: string;
  estimatedBudget: number | null;
  status: BuyerRequestStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

interface BuyerRequestCreationAttributes
  extends Optional<BuyerRequestAttributes, 'id' | 'imageUrl' | 'rawDescription' | 'estimatedBudget' | 'status'> {}

class BuyerRequest
  extends Model<BuyerRequestAttributes, BuyerRequestCreationAttributes>
  implements BuyerRequestAttributes
{
  declare id: string;
  declare buyerId: string;
  declare imageUrl: string | null;
  declare rawDescription: string | null;
  declare extractedNeed: object;
  declare category: string;
  declare estimatedBudget: number | null;
  declare status: BuyerRequestStatus;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

BuyerRequest.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    buyerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rawDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    extractedNeed: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estimatedBudget: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('OPEN', 'MATCHED', 'CLOSED'),
      defaultValue: 'OPEN',
    },
  },
  {
    sequelize,
    modelName: 'BuyerRequest',
    tableName: 'buyer_requests',
    underscored: true,
  }
);

export default BuyerRequest;
