import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.config';

interface SquadAccountAttributes {
  id: string;
  userId: string;
  accountNumber: string;
  accountName: string;
  bankName: string;
  balance: number;
  squadCustomerId: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface SquadAccountCreationAttributes
  extends Optional<SquadAccountAttributes, 'id' | 'balance' | 'squadCustomerId'> {}

class SquadAccount
  extends Model<SquadAccountAttributes, SquadAccountCreationAttributes>
  implements SquadAccountAttributes
{
  declare id: string;
  declare userId: string;
  declare accountNumber: string;
  declare accountName: string;
  declare bankName: string;
  declare balance: number;
  declare squadCustomerId: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

SquadAccount.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
    accountNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    accountName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bankName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    balance: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.0,
    },
    squadCustomerId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'SquadAccount',
    tableName: 'squad_accounts',
    underscored: true,
  }
);

export default SquadAccount;