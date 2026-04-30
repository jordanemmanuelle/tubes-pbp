import { ForeignKey, BelongsTo } from "sequelize-typescript";
import { Kategori } from "./kategori";

import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
} from "sequelize-typescript";

@Table({
  tableName: "menu",
  timestamps: true, 
})
export class Menu extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    field: "menu_id",
  })
  declare menu_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: "nama_menu",
  })
  declare nama_menu: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare ukuran: string | null;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare harga: number;

  @ForeignKey(() => Kategori)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare kategori_id: string;

  @BelongsTo(() => Kategori)
  declare kategori: Kategori;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare gambar: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare stok: number;

  @Column({
    type: DataType.DATE,
    field: "createdAt",
  })
  declare createdAt: Date;

  @Column({
    type: DataType.DATE,
    field: "updatedAt",
  })
  declare updatedAt: Date;
}
