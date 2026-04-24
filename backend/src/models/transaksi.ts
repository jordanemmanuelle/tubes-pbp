import { Table, Column, Model, DataType, PrimaryKey, HasMany } from "sequelize-typescript";
import { ItemTransaksi } from "./item-transaksi"; // Pastikan nama filenya benar

@Table({
  tableName: "transaksi",
  timestamps: true,
})
export class Transaksi extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare transaksi_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: "Guest"
  })
  declare nama_pelanggan: string;

  @Column({
    type: DataType.INTEGER, 
    allowNull: true,
  })
  declare nomor_meja: number;

  @Column({
    type: DataType.ENUM("dine-in", "takeaway"),
    defaultValue: "dine-in",
    allowNull: false,
  })
  declare tipe_pesanan: string;

  @Column({
    type: DataType.ENUM("pending", "diproses", "selesai"),
    defaultValue: "pending",
    allowNull: false,
  })
  declare status: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare total_harga: number;

  @Column({ type: DataType.DATE })
  declare createdAt: Date;

  @Column({ type: DataType.DATE })
  declare updatedAt: Date;

  @HasMany(() => ItemTransaksi, 'transaksi_id')
  declare items: ItemTransaksi[];
}