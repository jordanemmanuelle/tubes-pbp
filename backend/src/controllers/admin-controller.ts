// CARA INPUT DI POSTMAN
// BUAT REGISTER
// { 
//    "nama": "Kasir Satu",
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

// Stempel Rahasia kita (Sebaiknya dipindah ke file .env saat production)
const JWT_SECRET = "RAHASIA_MCD_TUBES_PBP_2026";

// Fungsi 1: Membuat Akun Admin Baru
export const registerAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nama, email, password, role } = req.body;

    const adminAda = await Admin.findOne({ where: { email } });
    if (adminAda) {
      res.status(400).json({ sukses: false, pesan: "Email sudah digunakan" });
      return;
    }

    // Mengacak Password (Hashing)
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

// Fungsi 2: Login dan Mendapatkan Tiket (Token)
export const loginAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      res.status(404).json({ sukses: false, pesan: "Email tidak ditemukan" });
      return;
    }

    // Cocokkan Password yang diketik dengan yang diacak di database
    const passwordCocok = await bcrypt.compare(password, admin.password);
    if (!passwordCocok) {
      res.status(401).json({ sukses: false, pesan: "Password salah" });
      return;
    }

    // Buat Tiket Akses (Token)
    const token = jwt.sign(
      { admin_id: admin.admin_id, role: admin.role },
      JWT_SECRET,
      { expiresIn: "1d" } // Token berlaku 1 hari
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