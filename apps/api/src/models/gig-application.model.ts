import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.config';

export type ApplicationStatus =
  | 'APPLIED'
  | 'SHORTLISTED'
  | 'HIRED'
  | 'COMPLETED'
  | 'REJECTED'
  | 'CANCELLED';

interface GigApplicationAttributes {
  id: string;
  opportunityId: string;
  seekerId: string;
  coverNote: string | null;
  status: ApplicationStatus;
  squadEscrowRef: string | null;
  completedAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface GigApplicationCreationAttributes
  extends Optional<
    GigApplicationAttributes,
    'id' | 'status' | 'coverNote' | 'squadEscrowRef' | 'completedAt'
  > {}

class GigApplication
  extends Model<GigApplicationAttributes, GigApplicationCreationAttributes>
  implements GigApplicationAttributes
{
  declare id: string;
  declare opportunityId: string;
  declare seekerId: string;
  declare coverNote: string | null;
  declare status: ApplicationStatus;
  declare squadEscrowRef: string | null;
  declare completedAt: Date | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

GigApplication.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    opportunityId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'opportunities', key: 'id' },
      onDelete: 'CASCADE',
    },
    seekerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
    coverNote: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('APPLIED', 'SHORTLISTED', 'HIRED', 'COMPLETED', 'REJECTED', 'CANCELLED'),
      defaultValue: 'APPLIED',
    },
    squadEscrowRef: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'GigApplication',
    tableName: 'gig_applications',
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['opportunity_id', 'seeker_id'],
      },
    ],
  }
);

export default GigApplication;
