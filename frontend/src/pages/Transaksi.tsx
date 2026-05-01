import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/transaksi.css";

export default function Transaksi() {
    const location = useLocation();
    const navigate = useNavigate();

    const data = location.state;
    const [menuList, setMenuList] = useState<any[]>([]);
    const [promoList, setPromoList] = useState<any[]>([]);
    const [selectedPromo, setSelectedPromo] = useState<string>("");
    const [diskon, setDiskon] = useState(0);
    const [loading, setLoading] = useState(true);

    const API_MENU = "http://localhost:5000/api/menu";
    const API_PROMO = "http://localhost:5000/api/promo";
    const API_CHECKOUT = "http://localhost:5000/api/transaksi/checkout";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");

                const [resMenu, resPromo] = await Promise.all([
                    fetch(API_MENU),
                    fetch(API_PROMO, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                const menuResult = await resMenu.json();
                const promoResult = await resPromo.json();

                setMenuList(menuResult.data || []);
                setPromoList(promoResult.data || []);
            } catch (err) {
                console.error("Gagal mengambil data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (!data) {
        return (
            <div className="transaksi-container">
                <h2>Tidak ada data transaksi</h2>
                <button className="back-btn" onClick={() => navigate("/home")}>Kembali</button>
            </div>
        );
    }

    const { items, tipe_pesanan, nomor_meja, nama_pelanggan } = data;

    const getMenu = (id: any) => {
        return menuList.find((m) => String(m.menu_id) === String(id));
    };

    const totalItem = items.reduce((acc: number, item: any) => acc + item.kuantitas, 0);

    const totalHarga = items.reduce((acc: number, item: any) => {
        const menu = getMenu(item.menu_id);
        return acc + (menu?.harga || 0) * item.kuantitas;
    }, 0);

    useEffect(() => {
        const promo = promoList.find(p => p.kode_promo === selectedPromo);

        if (!promo || totalHarga < promo.minimal_belanja) {
            setDiskon(0);
            return;
        }

        let potongan = promo.nilai_promo;

        if (promo.maksimal_diskon && potongan > promo.maksimal_diskon) {
            potongan = promo.maksimal_diskon;
        }

        setDiskon(potongan);
    }, [selectedPromo, totalHarga, promoList]);

    const totalBayar = totalHarga - diskon;

    const handleBayar = async () => {
        if (!window.confirm(`Konfirmasi pembayaran Rp ${totalBayar.toLocaleString("id-ID")}?`)) return;

        try {
            const response = await fetch(API_CHECKOUT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nama_pelanggan: nama_pelanggan || "Guest",
                    tipe_pesanan: tipe_pesanan || "dine-in",
                    nomor_meja: nomor_meja,
                    kode_promo: selectedPromo || null,
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
    };


    if (loading) return <div className="transaksi-container"><h1>Memuat Data...</h1></div>;

    return (
        <div className="transaksi-container">
            <div className="nav-buttons">
                <img src="/images/logo_mcd.jpg" className="logo-mcd" alt="Logo" />
                <button className="admin-btn" onClick={() => navigate("/home")}>Home</button>
                
            </div>

            <h1>Detail Transaksi</h1>

            <div className="transaksi-box">
                <p><b>Pelanggan:</b> {nama_pelanggan || "Guest"}</p>
                <p><b>Tipe:</b> {tipe_pesanan}</p>
                {nomor_meja && <p><b>Meja:</b> {nomor_meja}</p>}
            </div>

            <div className="transaksi-list">
                {items.map((item: any, index: number) => {
                    const menu = getMenu(item.menu_id);
                    return (
                        <div key={index} className="transaksi-item">
                            <img
                                src={menu?.gambar || "https://via.placeholder.com/150"}
                                alt={menu?.nama_menu}
                                className="item-img"
                            />
                            <div className="item-name">
                                <p><b>{menu ? menu.nama_menu : "Menu tidak ditemukan"}</b></p>
                            </div>
                            <div className="item-details">
                                <span>Qty: {item.kuantitas}</span>
                                <span>
                                    Rp {((menu?.harga || 0) * item.kuantitas).toLocaleString("id-ID")}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="promo-section">
                <h3>Pilih Promo</h3>
                <select value={selectedPromo} onChange={(e) => setSelectedPromo(e.target.value)}>
                    <option value="">-- Tanpa Promo --</option>
                    {promoList
                        .filter(p => p.is_active && p.stok > 0)
                        .map((promo) => (
                            <option key={promo.promo_id} value={promo.kode_promo}>
                                {promo.kode_promo} (Potongan Rp {promo.nilai_promo.toLocaleString()})
                            </option>
                        ))}
                </select>
            </div>

            <div className="transaksi-summary">
                <div className="summary-row">
                    <span>Total Item</span>
                    <span>{totalItem}</span>
                </div>
                <div className="summary-row">
                    <span>Total Harga</span>
                    <span>Rp {totalHarga.toLocaleString("id-ID")}</span>
                </div>
                <div className="summary-row" style={{ color: "#d32f2f", fontWeight: "bold" }}>
                    <span>Diskon</span>
                    <span>- Rp {diskon.toLocaleString("id-ID")}</span>
                </div>
                <div className="summary-row total-price-row">
                    <span>Total Bayar</span>
                    <span>Rp {totalBayar.toLocaleString("id-ID")}</span>
                </div>
            </div>

            <div className="action-buttons">
                <button className="pay-btn" onClick={handleBayar}>Bayar Sekarang</button>
                <button className="back-btn" onClick={() => navigate("/home")}>Kembali</button>
            </div>
        </div>
    );
}