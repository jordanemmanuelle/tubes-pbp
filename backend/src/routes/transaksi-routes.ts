import { Router } from 'express';
import { buatTransaksi, getSemuaTransaksi, updateStatusTransaksi } from '../controllers/transaksi-controller';
import { verifyToken } from '../middleware/authMiddleware'; 

const router = Router();

router.post('/checkout', buatTransaksi);

router.get('/', verifyToken, getSemuaTransaksi); 
router.put('/:id/status', verifyToken, updateStatusTransaksi);

export default router;