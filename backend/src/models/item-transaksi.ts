import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Transaksi } from "./transaksi";
import { Menu } from "./menu";

@Table({
  tableName: "item_transaksi",
  timestamps: true,
})
export class ItemTransaksi extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare item_transaksi_id: string;

  // Memberi tahu bahwa ini adalah Foreign Key ke tabel Transaksi
  @ForeignKey(() => Transaksi)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare transaksi_id: string;

  // Memberi tahu bahwa ini adalah Foreign Key ke tabel Menu
  @ForeignKey(() => Menu)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare menu_id: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
  })
  declare kuantitas: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare harga_saat_transaksi: number;

  @Column({ type: DataType.DATE })
  declare createdAt: Date;

  @Column({ type: DataType.DATE })
  declare updatedAt: Date;

  // Jembatan untuk mengambil data Menu & Transaksi secara utuh nanti
  @BelongsTo(() => Transaksi)
  declare transaksi: Transaksi;

  @BelongsTo(() => Menu)
  declare menu: Menu;
}