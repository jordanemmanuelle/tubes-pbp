import { Table, Column, Model, DataType, PrimaryKey, HasMany } from "sequelize-typescript";
import { Menu } from "./menu";

@Table({
  tableName: "kategori",
  timestamps: true,
})
export class Kategori extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare kategori_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare nama_kategori: string;

  @Column({ type: DataType.DATE })
  declare createdAt: Date;

  @Column({ type: DataType.DATE })
  declare updatedAt: Date;

  // 1 Kategori punya banyak Menu
  @HasMany(() => Menu)
  declare menus: Menu[];
}