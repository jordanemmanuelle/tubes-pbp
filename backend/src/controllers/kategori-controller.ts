import { Request, Response } from 'express';
import { Kategori } from '../models/kategori';

// Mengambil semua data kategori
export const getKategori = async (req: Request, res: Response) => {
  try {
    const kategori = await Kategori.findAll();
    res.status(200).json({ sukses: true, data: kategori });
  } catch (error) {
    console.error("Error getKategori:", error);
    res.status(500).json({ sukses: false, pesan: "Terjadi kesalahan pada server" });
  }
};

// Membuat kategori baru (Admin Only nantinya)
export const tambahKategori = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nama_kategori } = req.body;

    if (!nama_kategori) {
      res.status(400).json({ sukses: false, pesan: "Nama kategori wajib diisi" });
      return;
    }

    const kategoriBaru = await Kategori.create({ nama_kategori });
    res.status(201).json({ sukses: true, pesan: "Kategori berhasil ditambahkan", data: kategoriBaru });
  } catch (error: any) {
    // Menangani error jika nama kategori sudah ada (unique constraint)
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ sukses: false, pesan: "Kategori sudah ada" });
      return;
    }
    console.error("Error tambahKategori:", error);
    res.status(500).json({ sukses: false, pesan: "Terjadi kesalahan pada server" });
  }
};

// Mengubah Nama Kategori (Update)
export const updateKategori = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { nama_kategori } = req.body;

    const kategori = await Kategori.findByPk(id);
    if (!kategori) {
      res.status(404).json({ sukses: false, pesan: "Kategori tidak ditemukan" });
      return;
    }

    await kategori.update({ nama_kategori });
    res.status(200).json({ sukses: true, pesan: "Kategori berhasil diperbarui", data: kategori });
  } catch (error: any) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ sukses: false, pesan: "Nama kategori sudah ada" });
      return;
    }
    console.error("Error updateKategori:", error);
    res.status(500).json({ sukses: false, pesan: "Terjadi kesalahan server" });
  }
};

// Menghapus Kategori (Delete)
export const deleteKategori = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const kategori = await Kategori.findByPk(id);
    if (!kategori) {
      res.status(404).json({ sukses: false, pesan: "Kategori tidak ditemukan" });
      return;
    }

    // Catatan: Karena kita pakai onDelete: RESTRICT di migration, 
    // jika kategori masih punya menu, ini akan otomatis error.
    await kategori.destroy();
    res.status(200).json({ sukses: true, pesan: "Kategori berhasil dihapus" });
  } catch (error) {
    console.error("Error deleteKategori:", error);
    res.status(500).json({ 
      sukses: false, 
      pesan: "Gagal menghapus kategori. Pastikan tidak ada menu yang menggunakan kategori ini." 
    });
  }
};