import { Router } from 'express';
import { getMenu, tambahMenu, updateMenu, deleteMenu } from '../controllers/menu-controller';

const router = Router();

router.get('/', getMenu);             
router.post('/', tambahMenu);           

router.put('/:id', updateMenu);       
router.delete('/:id', deleteMenu);  

export default router;