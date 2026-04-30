import "reflect-metadata";
import express, { Request, Response } from 'express';
import cors from 'cors';

import sequelize from './config/database'; 
import kategoriRoutes from './routes/kategori-routes'; 
import menuRoutes from './routes/menu-routes';
import adminRoutes from './routes/admin-routes';
import transaksiRoutes from './routes/transaksi-routes';
import promoRoutes from './routes/promo-routes';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json()); // Agar backend bisa menerima data JSON dari frontend

app.use('/api/kategori', kategoriRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/transaksi', transaksiRoutes);
app.use('/api/promo', promoRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Server McDonald\'s Backend Berjalan Lancar! 🍔');
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Berhasil terkoneksi ke database PostgreSQL dengan Sequelize-TypeScript!');

    // --- TAMBAHKAN BARIS INI ---
    // Perintah ini akan menyuruh Sequelize mengecek tabel dan menambahkan kolom yang kurang
    await sequelize.sync({ alter: true }); 
    console.log('✅ Struktur tabel database otomatis disinkronkan!');
    // ---------------------------

    app.listen(PORT, () => {
      console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Gagal terkoneksi ke database:', error);
  }
};

startServer();