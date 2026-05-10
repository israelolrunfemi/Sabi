import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.config';

export type UserType = 'TRADER' | 'SEEKER' | 'BUYER';
export type UserStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED';

interface UserAttributes {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  userType: UserType;
  status: UserStatus;
  trustScore: number;
  profileImage: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes
  extends Optional<UserAttributes, 'id' | 'status' | 'trustScore' | 'profileImage'> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: string;
  declare fullName: string;
  declare email: string;
  declare phone: string;
  declare password: string;
  declare userType: UserType;
  declare status: UserStatus;
  declare trustScore: number;
  declare profileImage: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userType: {
      type: DataTypes.ENUM('TRADER', 'SEEKER', 'BUYER'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'ACTIVE', 'SUSPENDED'),
      defaultValue: 'PENDING',
    },
    trustScore: {
      type: DataTypes.INTEGER,
      defaultValue: 40,
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    underscored: true,
  }
);

export default User;