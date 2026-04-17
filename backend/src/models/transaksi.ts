import { Table, Column, Model, DataType, PrimaryKey, HasMany } from "sequelize-typescript";
import { ItemTransaksi } from "./item-transaksi"; // Nanti kita buat filenya di bawah

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
    allowNull: false,
  })
  declare nomor_meja: string;

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

  // Relasi: 1 Transaksi punya BANYAK Item Transaksi
  @HasMany(() => ItemTransaksi)
  declare items: ItemTransaksi[];
}