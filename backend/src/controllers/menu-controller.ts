import { Request, Response } from 'express';
import { Menu } from '../models/menu';
import { Kategori } from '../models/kategori';

// 1. Mengambil semua menu beserta nama kategorinya
export const getMenu = async (req: Request, res: Response) => {
  try {
    const menus = await Menu.findAll({
      include: [
        {
          model: Kategori,
          attributes: ['nama_kategori'] // Kita hanya mengambil nama kategorinya saja biar rapi
        }
      ]
    });
    res.status(200).json({ sukses: true, data: menus });
  } catch (error) {
    console.error("Error getMenu:", error);
    res.status(500).json({ sukses: false, pesan: "Terjadi kesalahan pada server" });
  }
};

// 2. Menambah menu baru (Admin Only nantinya)
export const tambahMenu = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nama_menu, ukuran, harga, kategori_id, gambar, stok } = req.body;

    // Validasi sederhana
    if (!nama_menu || !harga || !kategori_id || !gambar) {
      res.status(400).json({ sukses: false, pesan: "Nama menu, harga, kategori, dan gambar wajib diisi" });
      return;
    }

    const menuBaru = await Menu.create({
      nama_menu,
      ukuran: ukuran || null, // Jika tidak ada ukuran (misal burger), isi dengan null
      harga,
      kategori_id,
      gambar,
      stok: stok || 0 // Default stok 0 jika tidak diisi
    });

    res.status(201).json({ sukses: true, pesan: "Menu berhasil ditambahkan", data: menuBaru });
  } catch (error) {
    console.error("Error tambahMenu:", error);
    res.status(500).json({ sukses: false, pesan: "Terjadi kesalahan pada server" });
  }
};

export const updateMenu = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { nama_menu, ukuran, harga, kategori_id, gambar, stok } = req.body;

    const menu = await Menu.findByPk(id);
    if (!menu) {
      res.status(404).json({ sukses: false, pesan: "Menu tidak ditemukan" });
      return;
    }

    // 2. Update datanya (hanya update field yang dikirim di body)
    await menu.update({
      nama_menu: nama_menu || menu.nama_menu,
      ukuran: ukuran !== undefined ? ukuran : menu.ukuran,
      harga: harga || menu.harga,
      kategori_id: kategori_id || menu.kategori_id,
      gambar: gambar || menu.gambar,
      stok: stok !== undefined ? stok : menu.stok
    });

    res.status(200).json({ sukses: true, pesan: "Menu berhasil diperbarui", data: menu });
  } catch (error) {
    console.error("Error updateMenu:", error);
    res.status(500).json({ sukses: false, pesan: "Terjadi kesalahan pada server" });
  }
};

// Menghapus data menu (Delete)
export const deleteMenu = async (req: Request, res: Response): Promise<void> => {
  try {
    const id  = req.params.id as string;

    // 1. Cari menu yang mau dihapus
    const menu = await Menu.findByPk(id);
    if (!menu) {
      res.status(404).json({ sukses: false, pesan: "Menu tidak ditemukan" });
      return;
    }

    // 2. Hapus secara permanen dari database
    await menu.destroy();
    res.status(200).json({ sukses: true, pesan: "Menu berhasil dihapus" });
  } catch (error) {
    console.error("Error deleteMenu:", error);
    res.status(500).json({ 
      sukses: false, 
      pesan: "Gagal menghapus menu. Pastikan menu ini belum pernah dibeli di tabel transaksi." 
    });
  }
};