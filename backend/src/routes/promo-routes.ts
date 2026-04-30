import { Router } from 'express';
import { tambahPromo, getSemuaPromo, updatePromo, hapusPromo } from '../controllers/promo-controller';
import { verifyToken } from '../middleware/authMiddleware'; 

const router = Router();

router.post('/', verifyToken, tambahPromo);
router.get('/', verifyToken, getSemuaPromo);
router.put('/:id', verifyToken, updatePromo);
router.delete('/:id', verifyToken, hapusPromo);

export default router;