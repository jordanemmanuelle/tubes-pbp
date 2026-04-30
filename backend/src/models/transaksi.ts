
import { Table, Column, Model, DataType, PrimaryKey, HasMany } from "sequelize-typescript";
import { ItemTransaksi } from "./item-transaksi";

@Table({ tableName: "transaksi", timestamps: true })
export class Transaksi extends Model {
  @PrimaryKey
  @Column({ 
    type: DataType.UUID, 
    defaultValue: DataType.UUIDV4 
  })
  declare transaksi_id: string;

  @Column({ 
    type: DataType.STRING, 
    allowNull: false 
  })
  declare nama_pelanggan: string;

  @Column({ 
    type: DataType.INTEGER, 
    allowNull: false 
  })
  declare total_harga: number; // Before promo

  @Column({ 
    type: DataType.INTEGER, 
    allowNull: false,
    defaultValue: 0
  })
  declare total_bayar: number; // After promo

  @Column({ 
    type: DataType.INTEGER, 
    defaultValue: 0 
  })
  declare diskon: number;

  @Column({ 
    type: DataType.STRING, 
    allowNull: true 
  })
  declare kode_promo: string;

  @Column({ 
    type: DataType.ENUM("pending", "diproses", "selesai"), 
    defaultValue: "pending" 
  })
  declare status: string;

  @Column({ 
    type: DataType.ENUM("dine-in", "takeaway"), 
    allowNull: false 
  })
  declare tipe_pesanan: string;

  @Column({ 
    type: DataType.INTEGER, 
    allowNull: true 
  })
  declare nomor_meja: number;

  @HasMany(() => ItemTransaksi)
  declare items: ItemTransaksi[];
}