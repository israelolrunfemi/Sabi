import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.config';

interface VouchAttributes {
  id: string;
  voucherId: string;
  voucheeId: string;
  message: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface VouchCreationAttributes
  extends Optional<VouchAttributes, 'id' | 'message'> {}

class Vouch
  extends Model<VouchAttributes, VouchCreationAttributes>
  implements VouchAttributes
{
  declare id: string;
  declare voucherId: string;
  declare voucheeId: string;
  declare message: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Vouch.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    voucherId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
    voucheeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Vouch',
    tableName: 'vouches',
    underscored: true,
  }
);

export default Vouch;