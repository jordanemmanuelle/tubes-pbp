import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = "RAHASIA_MCD_TUBES_PBP_2026"; 

export interface AuthRequest extends Request {
  admin?: any;
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    res.status(401).json({ 
      sukses: false, 
      pesan: "Akses ditolak! Kamu harus login sebagai Admin/Kasir untuk mengakses ini." 
    });
    return;
  }

  try {
    // Verifikasi apakah token asli atau palsu
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // If real, simpan data admin
    req.admin = decoded; 
    
    next(); 
  } catch (error) {
    res.status(403).json({ 
      sukses: false, 
      pesan: "Token tidak valid atau sudah kadaluwarsa. Silakan login ulang." 
    });
  }
};