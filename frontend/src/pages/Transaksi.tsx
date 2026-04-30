import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/transaksi.css";

export default function Transaksi() {
  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state;
  const [menuList, setMenuList] = useState<any[]>([]);

  const API_MENU = "http://localhost:5000/api/menu";
  const API_CHECKOUT = "http://localhost:5000/api/transaksi/checkout";

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(API_MENU);
        const result = await res.json();
        setMenuList(result.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMenu();
  }, []);

  if (!data) {
    return (
      <div className="transaksi-container">
        <h2>Tidak ada data transaksi</h2>
        <button className="back-btn" onClick={() => navigate("/home")}>
          Kembali
        </button>
      </div>
    );
  }

  const { items, tipe_pesanan, nomor_meja, nama_pelanggan } = data;

  const getMenu = (id: string) => {
    return menuList.find((m) => m.menu_id === id);
  };

  const totalItem = items.reduce((acc: number, item: any) => acc + item.kuantitas, 0);
  
  const totalHarga = items.reduce((acc: number, item: any) => {
    const menu = getMenu(item.menu_id);
    return acc + (menu?.harga || 0) * item.kuantitas;
  }, 0);

  const handleBayar = async () => {
    const confirmPay = window.confirm("Konfirmasi pembayaran?");
    if (confirmPay) {
      try {
        const response = await fetch(API_CHECKOUT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nama_pelanggan: nama_pelanggan || "Guest",
            tipe_pesanan: tipe_pesanan || "dine-in",
            nomor_meja: nomor_meja, 
            items: items.map((item: any) => ({
              menu_id: item.menu_id,
              kuantitas: item.kuantitas
            }))
          }),
        });

        const result = await response.json();

        if (response.ok) {
          alert("Transaksi Berhasil!");
          navigate("/home");
        } else {
          alert("Gagal: " + result.pesan);
        }
      } catch (err) {
        alert("Terjadi kesalahan koneksi");
      }
    }
  };

  return (
    <div className="transaksi-container">
      <h1>Detail Transaksi</h1>

      <div className="transaksi-box">
        <p><b>Pelanggan:</b> {nama_pelanggan || "Guest"}</p>
        <p><b>Tipe:</b> {tipe_pesanan}</p>
        {nomor_meja !== null && nomor_meja !== undefined && (
          <p><b>Meja:</b> {nomor_meja}</p>
        )}
      </div>

      <div className="transaksi-list">
        {items.map((item: any, index: number) => {
          const menu = getMenu(item.menu_id);
          return (
            <div key={index} className="transaksi-item">
              <img src={menu?.gambar} alt={menu?.nama_menu} className="item-img" />
              <div className="item-name">
                <p><b>{menu?.nama_menu || "Loading..."}</b></p>
              </div>
              <div className="item-details">
                <span className="detail-id">#{item.menu_id.slice(0, 5)}</span>
                <span className="detail-qty">Qty: {item.kuantitas}</span>
                <span className="detail-price">
                  Rp {((menu?.harga || 0) * item.kuantitas).toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="transaksi-summary">
        <div className="summary-row">
          <span>Total Item</span>
          <span>{totalItem}</span>
        </div>
        <div className="summary-row total-price-row">
          <span>Total Bayar</span>
          <span>Rp {totalHarga.toLocaleString("id-ID")}</span>
        </div>
      </div>

      <div className="action-buttons">
        <button className="pay-btn" onClick={handleBayar}>
          Bayar Sekarang
        </button>
        <button className="back-btn" onClick={() => navigate("/home")}>
          Kembali
        </button>
      </div>
    </div>
  );
}