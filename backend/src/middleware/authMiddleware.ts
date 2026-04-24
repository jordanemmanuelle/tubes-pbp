import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Gunakan kunci yang sama dengan yang ada di AdminController kamu
const JWT_SECRET = "RAHASIA_MCD_TUBES_PBP_2026"; 

// Interface kustom agar TypeScript tidak error saat kita menyimpan data admin di Request
export interface AuthRequest extends Request {
  admin?: any;
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  // 1. Ambil token dari Header "Authorization"
  const authHeader = req.headers['authorization'];
  
  // Format token biasanya: "Bearer <token_panjang_sekali>"
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    res.status(401).json({ 
      sukses: false, 
      pesan: "Akses ditolak! Kamu harus login sebagai Admin/Kasir untuk mengakses ini." 
    });
    return;
  }

  try {
    // 2. Verifikasi apakah token asli atau palsu
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // 3. Jika asli, simpan data admin ke dalam request agar bisa dipakai di Controller
    req.admin = decoded; 
    
    // 4. Perintahkan Express untuk lanjut ke fungsi berikutnya (Controller)
    next(); 
  } catch (error) {
    res.status(403).json({ 
      sukses: false, 
      pesan: "Token tidak valid atau sudah kadaluwarsa. Silakan login ulang." 
    });
  }
};