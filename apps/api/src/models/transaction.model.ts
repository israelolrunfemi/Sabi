import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.config';

export type TransactionType = 'CREDIT' | 'DEBIT';
export type TransactionStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

interface TransactionAttributes {
  id: string;
  userId: string;
  squadReference: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  counterpartyId: string | null;
  description: string | null;
  metadata: object | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TransactionCreationAttributes
  extends Optional<TransactionAttributes, 'id' | 'counterpartyId' | 'description' | 'metadata'> {}

class Transaction
  extends Model<TransactionAttributes, TransactionCreationAttributes>
  implements TransactionAttributes
{
  declare id: string;
  declare userId: string;
  declare squadReference: string;
  declare amount: number;
  declare type: TransactionType;
  declare status: TransactionStatus;
  declare counterpartyId: string | null;
  declare description: string | null;
  declare metadata: object | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Transaction.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
    squadReference: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('CREDIT', 'DEBIT'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'SUCCESS', 'FAILED'),
      defaultValue: 'PENDING',
    },
    counterpartyId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Transaction',
    tableName: 'transactions',
    underscored: true,
  }
);

export default Transaction;