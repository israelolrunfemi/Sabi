import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.config';

interface RatingAttributes {
  id: string;
  raterId: string;
  rateeId: string;
  transactionId: string | null;
  score: number;
  comment: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface RatingCreationAttributes
  extends Optional<RatingAttributes, 'id' | 'transactionId' | 'comment'> {}

class Rating
  extends Model<RatingAttributes, RatingCreationAttributes>
  implements RatingAttributes
{
  declare id: string;
  declare raterId: string;
  declare rateeId: string;
  declare transactionId: string | null;
  declare score: number;
  declare comment: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Rating.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    raterId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
    rateeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
    transactionId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'transactions', key: 'id' },
      onDelete: 'SET NULL',
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Rating',
    tableName: 'ratings',
    underscored: true,
  }
);

export default Rating;