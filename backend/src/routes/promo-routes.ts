import { Router } from 'express';
import { tambahPromo, getSemuaPromo, updatePromo, hapusPromo } from '../controllers/promo-controller';
import { verifyToken } from '../middleware/authMiddleware'; 

const router = Router();

// Semua operasi CRUD promo bersifat rahasia, wajib pakai Token Admin
router.post('/', verifyToken, tambahPromo);
router.get('/', verifyToken, getSemuaPromo);
router.put('/:id', verifyToken, updatePromo);
router.delete('/:id', verifyToken, hapusPromo);

export default router;