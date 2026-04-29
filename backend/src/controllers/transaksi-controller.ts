import { Request, Response } from 'express';
import { Menu } from '../models/menu';
import { Transaksi } from '../models/transaksi';
import { ItemTransaksi } from '../models/item-transaksi';
import sequelize from '../config/database'; 

export const buatTransaksi = async (req: Request, res: Response): Promise<void> => {
  // 1. Mulai pelindung transaksi (Transaction)
  const transaksi = await sequelize.transaction();

  try {
    const { nama_pelanggan, items, tipe_pesanan } = req.body;

    if (!items || items.length === 0) {
      res.status(400).json({ sukses: false, pesan: "Keranjang belanja kosong!" });
      return;
    }

    let total_harga_semua = 0;
    const arrayItemTransaksi = [];

    // 2. Loop setiap pesanan untuk divalidasi dan dipotong stoknya
    for (const pesanan of items) {
      const menu = await Menu.findByPk(pesanan.menu_id, { transaction: transaksi });

      if (!menu) {
        throw new Error(`Menu dengan ID ${pesanan.menu_id} tidak ditemukan.`);
      }

      if (menu.stok < pesanan.kuantitas) {
        throw new Error(`Stok menu ${menu.nama_menu} tidak mencukupi. Sisa stok: ${menu.stok}`);
      }

      // Hitung harga
      const subtotal = menu.harga * pesanan.kuantitas;
      total_harga_semua += subtotal;

      // Kurangi stok menu di database
      await menu.update({ stok: menu.stok - pesanan.kuantitas }, { transaction: transaksi });

      // Simpan data mentah untuk dimasukkan ke tabel ItemTransaksi nanti
      arrayItemTransaksi.push({
        menu_id: pesanan.menu_id, // <--- Sudah dijamin aman dari typo
        kuantitas: pesanan.kuantitas,
        harga_satuan: menu.harga
      });
    }

    // Generator Nomor Meja Sederhana untuk Dine-in
    let nomorMejaFix = null;
    if (!tipe_pesanan || tipe_pesanan === 'dine-in') {
        nomorMejaFix = Math.floor(Math.random() * 50) + 1; // Acak nomor 1-50
    }

    // 3. Buat Data Induk di Tabel Transaksi
    const transaksiBaru = await Transaksi.create({
      nama_pelanggan: nama_pelanggan || "Guest",
      total_harga: total_harga_semua,
      status: "selesai", // <--- Sudah disesuaikan dengan ENUM database
      tipe_pesanan: tipe_pesanan || "dine-in",
      nomor_meja: nomorMejaFix
    }, { transaction: transaksi });

    // 4. Sisipkan ID Transaksi Induk ke anak-anaknya (ItemTransaksi)
    const dataItemFinal = arrayItemTransaksi.map(item => ({
      ...item,
      transaksi_id: transaksiBaru.transaksi_id // <--- Pakai transaksi_id yang benar
    }));

    // Simpan semua anak sekaligus (Bulk Create)
    await ItemTransaksi.bulkCreate(dataItemFinal, { transaction: transaksi });

    // 5. JIKA SEMUA AMAN, TEKAN TOMBOL SAVE PERMANEN!
    await transaksi.commit();

    res.status(201).json({
      sukses: true,
      pesan: "Transaksi berhasil dicatat!",
      data: {
        id_transaksi: transaksiBaru.transaksi_id, // <--- Pakai transaksi_id yang benar
        pelanggan: transaksiBaru.nama_pelanggan,
        nomor_meja: transaksiBaru.nomor_meja,
        total_bayar: total_harga_semua
      }
    });

  } catch (error: any) {
    await transaksi.rollback();
    console.error("Error buatTransaksi:", error);
    res.status(400).json({ 
      sukses: false, 
      pesan: error.message || "Gagal memproses transaksi" 
    });
  }
};

// Fungsi untuk Dapur/Kasir mengubah status pesanan
export const updateStatusTransaksi = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // Mengambil ID transaksi dari URL
    const { status } = req.body; // Status baru yang dikirim dari Postman

    // Validasi agar tidak diisi status ngawur
    const statusDiizinkan = ['pending', 'diproses', 'selesai'];
    if (!statusDiizinkan.includes(status)) {
      res.status(400).json({ sukses: false, pesan: "Status tidak valid! Pilih: pending, diproses, atau selesai." });
      return;
    }

    const transaksi = await Transaksi.findByPk(id as string);

    if (!transaksi) {
      res.status(404).json({ sukses: false, pesan: "Transaksi tidak ditemukan." });
      return;
    }

    // Update status dan simpan ke database
    transaksi.status = status;
    await transaksi.save();

    res.status(200).json({
      sukses: true,
      pesan: `Status pesanan berhasil diubah menjadi: ${status}`,
      data: {
        id_transaksi: transaksi.transaksi_id,
        nama_pelanggan: transaksi.nama_pelanggan,
        status_baru: transaksi.status
      }
    });

  } catch (error: any) {
    console.error("Error update status:", error);
    res.status(500).json({ sukses: false, pesan: "Terjadi kesalahan pada server." });
  }
};

// Fungsi untuk melihat riwayat pesanan (Khusus Kasir/Admin)
export const getSemuaTransaksi = async (req: Request, res: Response): Promise<void> => {
  try {
    const riwayat = await Transaksi.findAll({
      order: [['createdAt', 'DESC']], // Tampilkan pesanan paling baru di atas
      include: [
        {
          model: ItemTransaksi,
          // Mengambil detail menu agar kasir tahu nama makanannya, bukan cuma ID-nya
          include: [
            {
              model: Menu,
              attributes: ['nama_menu', 'gambar'] 
            }
          ]
        }
      ]
    });

    res.status(200).json({ sukses: true, data: riwayat });
  } catch (error) {
    console.error("Error getTransaksi:", error);
    res.status(500).json({ sukses: false, pesan: "Terjadi kesalahan server" });
  }
};