import { Router } from 'express';
import { buatTransaksi, getSemuaTransaksi, updateStatusTransaksi } from '../controllers/transaksi-controller';
import { verifyToken } from '../middleware/authMiddleware'; // <--- IMPORT SATPAM

const router = Router();

// PINTU TERBUKA: Pembeli bebas memesan
router.post('/checkout', buatTransaksi);

// PINTU TERKUNCI: Harus bawa kartu akses (Token)
router.get('/', verifyToken, getSemuaTransaksi); 
router.put('/:id/status', verifyToken, updateStatusTransaksi);

export default router;