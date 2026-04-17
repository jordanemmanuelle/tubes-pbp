import { Router } from 'express';
import { getKategori, tambahKategori, updateKategori, deleteKategori } from '../controllers/kategori-controller';

const router = Router();

router.get('/', getKategori);
router.post('/', tambahKategori);
router.put('/:id', updateKategori);    
router.delete('/:id', deleteKategori); 

export default router;