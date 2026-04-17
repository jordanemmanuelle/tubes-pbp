import { Table, Column, Model, DataType, PrimaryKey } from "sequelize-typescript";

@Table({
  tableName: "promo",
  timestamps: true,
})
export class Promo extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare promo_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare kode_promo: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare nilai_promo: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  declare minimal_belanja: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare maksimal_diskon: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare stok: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare tanggal_mulai: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare tanggal_berakhir: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare deskripsi: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare is_active: boolean;

  @Column({ type: DataType.DATE })
  declare createdAt: Date;

  @Column({ type: DataType.DATE })
  declare updatedAt: Date;
}