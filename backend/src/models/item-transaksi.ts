import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Transaksi } from "./transaksi"; // Pastikan huruf besar/kecil sesuai nama file kamu
import { Menu } from "./menu";

@Table({
  tableName: "item_transaksi", // Pastikan nama tabel ini sesuai dengan di PostgreSQL kamu
  timestamps: true,
})
export class ItemTransaksi extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  // 1. Foreign Key ke tabel Transaksi
  @ForeignKey(() => Transaksi)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare transaksi_id: string;

  // 2. Foreign Key ke tabel Menu
  @ForeignKey(() => Menu)
  @Column({
    type: DataType.UUID, // ATAU INTEGER, sesuaikan dengan tipe Primary Key di tabel Menu kamu!
    allowNull: false,
  })
  declare menu_id: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare kuantitas: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare harga_satuan: number;

  // --- RELASI BALIK ---

  // Relasi balik ke Transaksi (Anak melapor ke Bapak)
  @BelongsTo(() => Transaksi, 'transaksi_id')
  declare transaksi: Transaksi;

  // Relasi ke Menu (Agar kita bisa tahu pesanan ini makanan apa)
  @BelongsTo(() => Menu, 'menu_id')
  declare menu: Menu;
}