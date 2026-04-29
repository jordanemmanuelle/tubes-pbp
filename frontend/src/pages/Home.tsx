import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/home.css";

export default function Home() {
  const navigate = useNavigate();

  const [kategoriAktif, setKategoriAktif] = useState("Semua");
  const [menu, setMenu] = useState<any[]>([]);
  const [cart, setCart] = useState<{ [key: string]: number }>({});

  const API = "http://localhost:5000/api/menu";

  const fetchMenu = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setMenu(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const kategoriList = [
    "Semua",
    ...new Set(menu.map((m) => m.kategori?.nama_kategori)),
  ];

  const filteredMenu =
    kategoriAktif === "Semua"
      ? menu
      : menu.filter(
          (item) => item.kategori?.nama_kategori === kategoriAktif
        );

  const tambah = (nama: string) => {
    setCart((prev) => ({
      ...prev,
      [nama]: (prev[nama] || 0) + 1,
    }));
  };

  const kurang = (nama: string) => {
    setCart((prev) => {
      const jumlah = (prev[nama] || 0) - 1;

      if (jumlah <= 0) {
        const newCart = { ...prev };
        delete newCart[nama];
        return newCart;
      }

      return {
        ...prev,
        [nama]: jumlah,
      };
    });
  };

  return (
    <div className="home-container">

      {/* BUTTON ADMIN */}
      <button 
        className="admin-btn"
        onClick={() => navigate("/login")}
      >
        Admin
      </button>

      <img src="/images/logo_mcd.jpg" alt="McD Logo" className="logo-mcd" />

      {/* KATEGORI */}
      <div className="kategori-container">
        {kategoriList.map((kat, index) => (
          <button
            key={index}
            className={`kategori-btn ${
              kategoriAktif === kat ? "active" : ""
            }`}
            onClick={() => setKategoriAktif(kat)}
          >
            {kat}
          </button>
        ))}
      </div>

      {/* MENU */}
      <div className="menu-grid">
        {filteredMenu.map((item, index) => {
          const jumlah = cart[item.nama_menu] || 0;

          return (
            <div key={index} className="menu-card">
              <div className="menu-content">
                <img src={item.gambar} className="menu-img" />
                <h3>{item.nama_menu}</h3>
                <p>Rp {item.harga}</p>
              </div>

              {jumlah === 0 ? (
                <button onClick={() => tambah(item.nama_menu)}>
                  Beli
                </button>
              ) : (
                <div className="qty-control">
                  <button onClick={() => kurang(item.nama_menu)}>-</button>
                  <span>{jumlah}</span>
                  <button onClick={() => tambah(item.nama_menu)}>+</button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CART */}
      <div className="cart">
        <h2>Keranjang 🛒</h2>
        {Object.keys(cart).length === 0 ? (
          <p>Kosong</p>
        ) : (
          Object.entries(cart).map(([nama, jumlah], index) => (
            <p key={index}>
              {nama} x{jumlah}
            </p>
          ))
        )}
      </div>
    </div>
  );
}