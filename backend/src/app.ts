// BUAT NYALAIN SERVER

import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Agar backend bisa menerima data JSON dari frontend

// Endpoint Testing
app.get('/', (req: Request, res: Response) => {
  res.send('Server McDonald\'s Backend Berjalan Lancar! 🍔');
});

// Jalankan Server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});