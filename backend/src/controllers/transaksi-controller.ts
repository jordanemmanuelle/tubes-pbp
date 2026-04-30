import { Request, Response } from 'express';
import { Menu } from '../models/menu';
import { Transaksi } from '../models/transaksi';
import { ItemTransaksi } from '../models/item-transaksi';
import { Promo } from '../models/promo'; 
import sequelize from '../config/database'; 

export const buatTransaksi = async (req: Request, res: Response): Promise<void> => {
  const transaksi = await sequelize.transaction();

  try {
    const { nama_pelanggan, items, tipe_pesanan, nomor_meja, kode_promo } = req.body;

    if (!items || items.length === 0) {
      res.status(400).json({ sukses: false, pesan: "Keranjang belanja kosong!" });
      return;
    }

    let total_harga_semua = 0;
    const arrayItemTransaksi = [];

    // hitung total + kurangi stok menu
    for (const pesanan of items) {
      const menu = await Menu.findByPk(pesanan.menu_id, { transaction: transaksi });

      if (!menu) {
        throw new Error(`Menu dengan ID ${pesanan.menu_id} tidak ditemukan.`);
      }

      if (menu.stok < pesanan.kuantitas) {
        throw new Error(`Stok menu ${menu.nama_menu} tidak mencukupi. Sisa stok: ${menu.stok}`);
      }

      const subtotal = menu.harga * pesanan.kuantitas;
      total_harga_semua += subtotal;

      await menu.update(
        { stok: menu.stok - pesanan.kuantitas },
        { transaction: transaksi }
      );

      arrayItemTransaksi.push({
        menu_id: pesanan.menu_id,
        kuantitas: pesanan.kuantitas,
        harga_satuan: menu.harga
      });
    }

    let diskon = 0;
    let promoDigunakan = null;

    if (kode_promo) {
      const promo = await Promo.findOne({
        where: { kode_promo },
        transaction: transaksi
      });

      if (!promo) throw new Error("Promo tidak ditemukan");

      const now = new Date();

      if (!promo.is_active) throw new Error("Promo tidak aktif");
      if (promo.stok <= 0) throw new Error("Promo habis");
      if (now < promo.tanggal_mulai || now > promo.tanggal_berakhir)
        throw new Error("Promo tidak berlaku");
      if (total_harga_semua < promo.minimal_belanja)
        throw new Error("Minimal belanja belum terpenuhi");

      diskon = (promo.nilai_promo / 100) * total_harga_semua;

      if (promo.maksimal_diskon) {
        diskon = Math.min(diskon, promo.maksimal_diskon);
      }

      await promo.update(
        { stok: promo.stok - 1 },
        { transaction: transaksi }
      );

      promoDigunakan = promo.kode_promo;
    }

    const total_bayar = total_harga_semua - diskon;

    let nomorMejaFix = null;
    if (tipe_pesanan === 'dine-in') {
      nomorMejaFix = (nomor_meja !== undefined && nomor_meja !== null && nomor_meja !== "")
        ? nomor_meja
        : null;
    }

    const transaksiBaru = await Transaksi.create({
      nama_pelanggan: nama_pelanggan || "Guest",
      total_harga: total_harga_semua,
      total_bayar: total_bayar,   
      diskon: diskon,
      kode_promo: promoDigunakan,
      status: "pending",
      tipe_pesanan: tipe_pesanan || "dine-in",
      nomor_meja: nomorMejaFix
    }, { transaction: transaksi });

    const dataItemFinal = arrayItemTransaksi.map(item => ({
      ...item,
      transaksi_id: transaksiBaru.transaksi_id 
    }));

    await ItemTransaksi.bulkCreate(dataItemFinal, { transaction: transaksi });

    await transaksi.commit();

    res.status(201).json({
      sukses: true,
      pesan: "Transaksi berhasil dicatat!",
      data: {
        id_transaksi: transaksiBaru.transaksi_id,
        pelanggan: transaksiBaru.nama_pelanggan,
        nomor_meja: transaksiBaru.nomor_meja,
        total_harga: total_harga_semua,
        diskon: diskon,
        total_bayar: total_bayar,
        promo: promoDigunakan
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

export const updateStatusTransaksi = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; 
    const { status } = req.body; 

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

export const getSemuaTransaksi = async (req: Request, res: Response): Promise<void> => {
  try {
    const riwayat = await Transaksi.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: ItemTransaksi,
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