import "reflect-metadata";
import express, { Request, Response } from 'express';
import cors from 'cors';

// 1. Import koneksi database dan routes yang baru dibuat
import sequelize from './config/database'; 
import kategoriRoutes from './routes/kategori-routes'; 
import menuRoutes from './routes/menu-routes';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Agar backend bisa menerima data JSON dari frontend

// 2. Daftarkan Routes (Pintu masuk API)
app.use('/api/kategori', kategoriRoutes);
app.use('/api/menu', menuRoutes);

// Endpoint Testing Bawaan
app.get('/', (req: Request, res: Response) => {
  res.send('Server McDonald\'s Backend Berjalan Lancar! 🍔');
});

// 3. Fungsi untuk menjalankan Server & Database secara bersamaan
const startServer = async () => {
  try {
    // Mengecek koneksi database terlebih dahulu
    await sequelize.authenticate();
    console.log('✅ Berhasil terkoneksi ke database PostgreSQL dengan Sequelize-TypeScript!');

    // Menyalakan server Express jika database aman
    app.listen(PORT, () => {
      console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Gagal terkoneksi ke database:', error);
  }
};

// Panggil fungsinya untuk mulai
startServer();