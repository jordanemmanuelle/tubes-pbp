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

  @ForeignKey(() => Transaksi)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare transaksi_id: string;

  @ForeignKey(() => Menu)
  @Column({
    type: DataType.UUID,
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

  @BelongsTo(() => Transaksi, 'transaksi_id')
  declare transaksi: Transaksi;

  @BelongsTo(() => Menu, 'menu_id')
  declare menu: Menu;
}