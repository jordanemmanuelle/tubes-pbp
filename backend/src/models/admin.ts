import { Table, Column, Model, DataType, PrimaryKey } from "sequelize-typescript";

@Table({
  tableName: "admin",
  timestamps: true,
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
    unique: true, // Email tidak boleh sama
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

  // Persiapan untuk fitur Forget Password nanti
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
}