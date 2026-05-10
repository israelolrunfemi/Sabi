import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.config';

interface EconomicProfileAttributes {
  id: string;
  userId: string;
  tradeCategory: string;
  skills: string[];
  description: string | null;
  yearsExperience: number;
  location: string | null;
  language: string;
  createdAt?: Date;
  updatedAt?: Date;
}


interface EconomicProfileCreationAttributes
  extends Optional<EconomicProfileAttributes, 'id' | 'description' | 'location' | 'yearsExperience'> {}

class EconomicProfile
  extends Model<EconomicProfileAttributes, EconomicProfileCreationAttributes>
  implements EconomicProfileAttributes
{
  declare id: string;
  declare userId: string;
  declare tradeCategory: string;
  declare skills: string[];
  declare description: string | null;
  declare yearsExperience: number;
  declare location: string | null;
  declare language: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

EconomicProfile.init(
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
    tradeCategory: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    skills: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    yearsExperience: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    language: {
      type: DataTypes.STRING,
      defaultValue: 'English',
    },
  },
  {
    sequelize,
    modelName: 'EconomicProfile',
    tableName: 'economic_profiles',
    underscored: true,
  }
);

export default EconomicProfile;