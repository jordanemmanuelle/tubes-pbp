import { Router } from 'express';
import { getMenu, tambahMenu, updateMenu, deleteMenu } from '../controllers/menu-controller';

const router = Router();

router.get('/', getMenu);               // GET: Mengambil semua menu
router.post('/', tambahMenu);           // POST: Menambah menu baru

// Endpoint baru menggunakan parameter :id
router.put('/:id', updateMenu);         // PUT: Mengubah data menu secara spesifik
router.delete('/:id', deleteMenu);      // DELETE: Menghapus menu secara spesifik

export default router;