import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
} from "sequelize-typescript";

@Table({
  tableName: "admin",
  timestamps: true, // Otomatis mengurus createdAt dan updatedAt
})
export class Admin extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare admin_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare nama: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true, // Email tidak boleh ada yang sama
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.ENUM("staff", "kasir"),
    defaultValue: "staff",
    allowNull: false,
  })
  declare role: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare reset_token: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare reset_token_expires: Date | null;

  @Column({
    type: DataType.DATE,
  })
  declare createdAt: Date;

  @Column({
    type: DataType.DATE,
  })
  declare updatedAt: Date;
}