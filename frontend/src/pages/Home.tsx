import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/home.css";

export default function Home() {
  const navigate = useNavigate();

  const [kategoriAktif, setKategoriAktif] = useState("Semua");
  const [menu, setMenu] = useState<any[]>([]);

  const [cart, setCart] = useState<{
    [key: string]: { nama: string; kuantitas: number }
  }>({});

  const [showCheckout, setShowCheckout] = useState(false);
  const [step, setStep] = useState<"pilihTipe" | "dineIn" | "meja">("pilihTipe");
  const [nomorMeja, setNomorMeja] = useState("");

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
      : menu.filter((item) => item.kategori?.nama_kategori === kategoriAktif);

  const tambah = (item: any) => {
    setCart((prev) => ({
      ...prev,
      [item.menu_id]: {
        nama: item.nama_menu,
        kuantitas: (prev[item.menu_id]?.kuantitas || 0) + 1,
      },
    }));
  };

  const kurang = (id: string) => {
    setCart((prev) => {
      const jumlah = (prev[id]?.kuantitas || 0) - 1;
      if (jumlah <= 0) {
        const newCart = { ...prev };
        delete newCart[id];
        return newCart;
      }
      return {
        ...prev,
        [id]: { ...prev[id], kuantitas: jumlah },
      };
    });
  };

  const goTransaksi = (tipe: string, meja: number | null = null) => {
    const data = {
      tipe_pesanan: tipe,
      nomor_meja: meja,
      items: Object.entries(cart).map(([id, item]) => ({
        menu_id: id,
        kuantitas: item.kuantitas,
      })),
    };

    navigate("/transaksi", { state: data });

    setCart({});
    setShowCheckout(false);
    setStep("pilihTipe");
    setNomorMeja("");
  };

  return (
    <div className="home-container">
      <button className="admin-btn" onClick={() => navigate("/login")}>
        Admin
      </button>

      <img src="/images/logo_mcd.jpg" className="logo-mcd" alt="Logo" />

      {/* KATEGORI */}
      <div className="kategori-container">
        {kategoriList.map((kat, index) => (
          <button
            key={index}
            className={`kategori-btn ${kategoriAktif === kat ? "active" : ""}`}
            onClick={() => setKategoriAktif(kat)}
          >
            {kat}
          </button>
        ))}
      </div>

      {/* MENU GRID */}
      <div className="menu-grid">
        {filteredMenu.map((item, index) => {
          const jumlah = cart[item.menu_id]?.kuantitas || 0;
          return (
            <div key={index} className="menu-card">
              <div className="menu-content">
                <img src={item.gambar} className="menu-img" alt={item.nama_menu} />
                <h3>{item.nama_menu}</h3>
                <p>Rp {item.harga}</p>
              </div>

              {jumlah === 0 ? (
                <button onClick={() => tambah(item)}>Beli</button>
              ) : (
                <div className="qty-control">
                  <button onClick={() => kurang(item.menu_id)}>-</button>
                  <span>{jumlah}</span>
                  <button onClick={() => tambah(item)}>+</button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* KERANJANG */}
      <div className="cart">
        <h2>Keranjang 🛒</h2>
        {Object.keys(cart).length === 0 ? (
          <p>Kosong</p>
        ) : (
          <>
            {Object.entries(cart).map(([id, item], index) => (
              <p key={index}>
                {item.nama} x{item.kuantitas}
              </p>
            ))}
            <button
              className="checkout-btn"
              onClick={() => {
                setShowCheckout(true);
                setStep("pilihTipe");
              }}
            >
              Checkout
            </button>
          </>
        )}
      </div>

      {showCheckout && (
        <div className="modal">
          <div className="modal-content">
            <h3>Checkout</h3>

            {/* PILIH TIPE */}
            {step === "pilihTipe" && (
              <>
                <div className="metode-container">
                  <div className="metode-card" onClick={() => setStep("dineIn")}>
                    <img src="/images/AntarKeMeja.png" alt="Dine In" />
                    <p>Dine In</p>
                  </div>
                  <div className="metode-card" onClick={() => goTransaksi("takeaway", null)}>
                    <img src="/images/Counter.png" alt="Take Away" />
                    <p>Take Away</p>
                  </div>
                </div>
                <button className="cancel-btn" onClick={() => setShowCheckout(false)}>Batal</button>
              </>
            )}

            {/* DINE IN */}
            {step === "dineIn" && (
              <>
                <div className="metode-container">
                  <div className="metode-card" onClick={() => setStep("meja")}>
                    <img src="/images/AntarKeMeja.png" alt="Antar Meja" />
                    <p>Antar ke Meja</p>
                  </div>

                  <div className="metode-card" onClick={() => goTransaksi("dine-in", null)}>
                    <img src="/images/Counter.png" alt="Counter" />
                    <p>Ambil di Counter</p>
                  </div>
                </div>
                <button className="back-btn" onClick={() => setStep("pilihTipe")}>Kembali</button>
              </>
            )}

            {/* INPUT MEJA */}
            {step === "meja" && (
              <>
                <input
                  type="number"
                  placeholder="Nomor Meja"
                  value={nomorMeja}
                  onChange={(e) => setNomorMeja(e.target.value)}
                />
                <button
                  className="confirm-btn"
                  onClick={() => {
                    if (!nomorMeja) {
                      alert("Isi nomor meja!");
                      return;
                    }
                    goTransaksi("dine-in", parseInt(nomorMeja));
                  }}
                >
                  Konfirmasi
                </button>
                <button className="back-btn" onClick={() => setStep("dineIn")}>Kembali</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}