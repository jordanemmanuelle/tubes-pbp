import { Request, Response } from 'express';
import { Promo } from '../models/promo';

// CREATE: Tambah Promo Baru
export const tambahPromo = async (req: Request, res: Response): Promise<void> => {
  try {
    const promoBaru = await Promo.create(req.body);
    res.status(201).json({ sukses: true, pesan: "Promo berhasil dibuat!", data: promoBaru });
  } catch (error: any) {
    res.status(400).json({ sukses: false, pesan: error.message || "Gagal membuat promo" });
  }
};

// READ: Ambil Semua Promo
export const getSemuaPromo = async (req: Request, res: Response): Promise<void> => {
  try {
    const daftarPromo = await Promo.findAll();
    res.status(200).json({ sukses: true, data: daftarPromo });
  } catch (error) {
    res.status(500).json({ sukses: false, pesan: "Terjadi kesalahan saat mengambil data promo" });
  }
};

// UPDATE: Edit Promo (Misal mengubah stok atau menonaktifkan promo)
export const updatePromo = async (req: Request, res: Response): Promise<void> => {
  try {
    const promo_id = req.params.id as string;
    const promo = await Promo.findByPk(promo_id);

    if (!promo) {
      res.status(404).json({ sukses: false, pesan: "Promo tidak ditemukan" });
      return;
    }

    await promo.update(req.body);
    res.status(200).json({ sukses: true, pesan: "Promo berhasil diperbarui", data: promo });
  } catch (error: any) {
    res.status(400).json({ sukses: false, pesan: error.message || "Gagal memperbarui promo" });
  }
};

// DELETE: Hapus Promo
export const hapusPromo = async (req: Request, res: Response): Promise<void> => {
  try {
    const promo_id = req.params.id as string;
    const promo = await Promo.findByPk(promo_id);

    if (!promo) {
      res.status(404).json({ sukses: false, pesan: "Promo tidak ditemukan" });
      return;
    }

    await promo.destroy();
    res.status(200).json({ sukses: true, pesan: "Promo berhasil dihapus permanen" });
  } catch (error) {
    res.status(500).json({ sukses: false, pesan: "Gagal menghapus promo" });
  }
};