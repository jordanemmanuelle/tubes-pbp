// CARA INPUT DI POSTMAN
// BUAT REGISTER
// { 
//    "nama": "Kasir 1",
//    "email": "kasir@gmail.com",
//    "password": "123",
//    "role": "kasir"
// }
// BUAT LOGIN
// { 
//    "email": "kasir@gmail.com",
//    "password": "123"
// }

import { Request, Response } from 'express';
import { Admin } from '../models/admin';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'; // <-- TAMBAHAN BARU: Untuk membuat token acak

const JWT_SECRET = "RAHASIA_MCD_TUBES_PBP_2026";

export const registerAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nama, email, password, role } = req.body;
    

    const adminAda = await Admin.findOne({ where: { email } });
    if (adminAda) {
      res.status(400).json({ sukses: false, pesan: "Email sudah digunakan" });
      return;
    }

    // hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await Admin.create({
      nama,
      email,
      password: hashedPassword,
      role: role || "staff"
    });

    res.status(201).json({ sukses: true, pesan: "Admin berhasil didaftarkan!" });
  } catch (error) {
    console.error("Error register:", error);
    res.status(500).json({ sukses: false, pesan: "Terjadi kesalahan server" });
  }
};

export const loginAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      res.status(404).json({ sukses: false, pesan: "Email tidak ditemukan" });
      return;
    }

    const passwordCocok = await bcrypt.compare(password, admin.password);
    if (!passwordCocok) {
      res.status(401).json({ sukses: false, pesan: "Password salah" });
      return;
    }

    const token = jwt.sign(
      { admin_id: admin.admin_id, role: admin.role },
      JWT_SECRET,
      { expiresIn: "1d" } 
    );

    res.status(200).json({
      sukses: true,
      pesan: "Login berhasil",
      token: token,
      data: {
        nama: admin.nama,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error("Error login:", error);
    res.status(500).json({ sukses: false, pesan: "Terjadi kesalahan server" });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ where: { email } });

    if (!admin) {
      res.status(404).json({ sukses: false, pesan: "Email tidak terdaftar!" });
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    
    const expireTime = new Date(Date.now() + 60 * 60 * 1000); 

    admin.reset_token = resetToken;
    admin.reset_token_expires = expireTime; 
    await admin.save();

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    console.log(`\n======================================`);
    console.log(`🚨 KLIK LINK INI UNTUK RESET PASSWORD:`);
    console.log(`Email: ${email}`);
    console.log(`Link : ${resetLink}`);
    console.log(`======================================\n`);

    res.status(200).json({ 
      sukses: true, 
      pesan: "Link reset password berhasil dibuat! Cek terminal backend." 
    });

  } catch (error) {
    console.error("Error forgot password:", error);
    res.status(500).json({ sukses: false, pesan: "Terjadi kesalahan server saat memproses forgot password" });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;
    const { passwordBaru } = req.body;

    const admin = await Admin.findOne({ where: { reset_token: token } });

    if (!admin) {
      res.status(400).json({ sukses: false, pesan: "Token tidak valid atau salah!" });
      return;
    }

    if (admin.reset_token_expires && admin.reset_token_expires < new Date()) {
      res.status(400).json({ sukses: false, pesan: "Token sudah kadaluarsa! Silakan minta link baru." });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(passwordBaru, salt);

    admin.password = hashedPassword;
    admin.reset_token = null;
    admin.reset_token_expires = null;
    
    await admin.save();

    res.status(200).json({ sukses: true, pesan: "Password berhasil diubah! Silakan login kembali." });

  } catch (error) {
    console.error("Error reset password:", error);
    res.status(500).json({ sukses: false, pesan: "Terjadi kesalahan server saat mereset password" });
  }
};