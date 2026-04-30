import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/home.css";

export default function Home() {
  const navigate = useNavigate();

  const [kategoriAktif, setKategoriAktif] = useState("Semua");
  const [menu, setMenu] = useState<any[]>([]);
  const [cart, setCart] = useState<{ [key: string]: number }>({});

  const [showCheckout, setShowCheckout] = useState(false);
  const [step, setStep] = useState<"pilih" | "meja">("pilih");
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

  // checkout
  const handleCheckout = async (tipe: string) => {
    if (tipe === "meja" && !nomorMeja) {
      alert("Masukkan nomor meja!");
      return;
    }

    try {
      const data = {
        metode: tipe,
        nomor_meja: tipe === "meja" ? parseInt(nomorMeja) : null,
        items: Object.entries(cart).map(([nama, jumlah]) => ({
          nama,
          jumlah,
        })),
      };

      const res = await fetch("http://localhost:5000/api/transaksi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        alert("Transaksi berhasil!");
        setCart({});
        setShowCheckout(false);
        setStep("pilih");
        setNomorMeja("");
        navigate("/transaksi");
      } else {
        alert(result.pesan || "Gagal transaksi");
      }
    } catch (err) {
      console.error(err);
      alert("Error server");
    }
  };

  return (
    <div className="home-container">

      {/* ADMIN */}
      <button className="admin-btn" onClick={() => navigate("/login")}>
        Admin
      </button>

      <img src="/images/logo_mcd.jpg" className="logo-mcd" />

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
          <>
            {Object.entries(cart).map(([nama, jumlah], index) => (
              <p key={index}>
                {nama} x{jumlah}
              </p>
            ))}

            <button
              className="checkout-btn"
              onClick={() => {
                setShowCheckout(true);
                setStep("pilih");
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

            {/* PILIH METODE */}
            {step === "pilih" && (
              <>
                <div className="metode-container">

                  <div
                    className="metode-card"
                    onClick={() => setStep("meja")}
                  >
                    <img src="/images/AntarKeMeja.png" />
                    <p>Diantar ke Meja</p>
                  </div>

                  <div
                    className="metode-card"
                    onClick={() => handleCheckout("counter")}
                  >
                    <img src="/images/Counter.png" />
                    <p>Ambil di Counter</p>
                  </div>
                </div>

                <button
                  className="cancel-btn"
                  onClick={() => setShowCheckout(false)}
                >
                  Batal
                </button>
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
                  onClick={() => handleCheckout("meja")}
                >
                  Konfirmasi
                </button>

                <button
                  className="back-btn"
                  onClick={() => setStep("pilih")}
                >
                  Kembali
                </button>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
}