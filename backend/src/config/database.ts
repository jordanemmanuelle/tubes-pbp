import { Sequelize } from 'sequelize-typescript';

// 1. Import semua model secara manual (Eksplisit)
import { Admin } from '../models/admin';
import { Kategori } from '../models/kategori';
import { Menu } from '../models/menu'
import { Transaksi } from '../models/transaksi';
import { ItemTransaksi } from '../models/item-transaksi';
import { Promo } from '../models/promo';

const sequelize = new Sequelize({
  database: 'db-tubes-pbp', // Pastikan namanya sama dengan yang di-generate migration tadi
  dialect: 'postgres',
  username: 'postgres',
  password: 'jordan123', // Sesuaikan dengan password PostgreSQL kamu
  host: '127.0.0.1',
  port: 5432,
  
  // 2. Masukkan model-model tersebut ke dalam array ini
  models: [Admin, Kategori, Menu, Transaksi, ItemTransaksi, Promo], 
  
  logging: false, 
});

export default sequelize;