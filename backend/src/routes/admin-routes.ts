import { Router } from 'express';
import { registerAdmin, loginAdmin, forgotPassword, resetPassword } from '../controllers/admin-controller';

const router = Router();

router.post('/register', registerAdmin); 
router.post('/login', loginAdmin);       
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;