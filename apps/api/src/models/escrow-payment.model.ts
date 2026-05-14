import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.config';

export type EscrowPaymentStatus =
  | 'FUNDED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'DISPUTED'
  | 'REFUNDED'
  | 'CANCELLED';

interface EscrowPaymentAttributes {
  id: string;
  reference: string;
  buyerId: string;
  traderId: string;
  amount: number;
  status: EscrowPaymentStatus;
  description: string | null;
  metadata: object | null;
  fundedAt: Date;
  releasedAt: Date | null;
  refundedAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface EscrowPaymentCreationAttributes
  extends Optional<
    EscrowPaymentAttributes,
    'id' | 'status' | 'description' | 'metadata' | 'fundedAt' | 'releasedAt' | 'refundedAt'
  > {}

class EscrowPayment
  extends Model<EscrowPaymentAttributes, EscrowPaymentCreationAttributes>
  implements EscrowPaymentAttributes
{
  declare id: string;
  declare reference: string;
  declare buyerId: string;
  declare traderId: string;
  declare amount: number;
  declare status: EscrowPaymentStatus;
  declare description: string | null;
  declare metadata: object | null;
  declare fundedAt: Date;
  declare releasedAt: Date | null;
  declare refundedAt: Date | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

EscrowPayment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    buyerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
    traderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('FUNDED', 'IN_PROGRESS', 'COMPLETED', 'DISPUTED', 'REFUNDED', 'CANCELLED'),
      defaultValue: 'FUNDED',
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    fundedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    releasedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    refundedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'EscrowPayment',
    tableName: 'escrow_payments',
    underscored: true,
  }
);

export default EscrowPayment;
