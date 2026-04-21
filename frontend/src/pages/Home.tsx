import { useState } from "react";
import "../css/home.css";

export default function Home() {
    const [kategoriAktif, setKategoriAktif] = useState("Semua");
    const images = import.meta.glob(
        "../assets/McDonalds/**/*.{png,jpg,jpeg}",
        { eager: true }
    );
    // 🛒 cart sekarang object { nama: jumlah }
    const [cart, setCart] = useState<{ [key: string]: number }>({});

    const kategoriList = [
        "Semua",
        "Sarapan Pagi",
        "Ayam",
        "Daging Sapi",
        "Ikan",
        "Happy Meal",
        "Makanan Penutup",
    ];

    const menu = [
        { nama: "Big Mac", kategori: "Daging Sapi" },
        { nama: "Big Max", kategori: "Daging Sapi" },
        { nama: "McChicken", kategori: "Ayam" },
        { nama: "Filet-O-Fish", kategori: "Ikan" },
        { nama: "Hotcakes", kategori: "Sarapan Pagi" },
        { nama: "Happy Meal Burger", kategori: "Happy Meal" },
        { nama: "McFlurry Oreo", kategori: "Makanan Penutup" },
    ];

    const filteredMenu =
        kategoriAktif === "Semua"
            ? menu
            : menu.filter((item) => item.kategori === kategoriAktif);

    const tambah = (nama: string) => {
        setCart((prev) => ({
            ...prev,
            [nama]: (prev[nama] || 0) + 1,
        }));
    };

    const getImage = (nama: string) => {
        const key = Object.keys(images).find((path) =>
            path.toLowerCase().includes(nama.toLowerCase().replace(/\s/g, ""))
        );

        return key ? (images[key] as any).default : "";
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
            <h1 className="title">Menu McDonald's 🍔</h1>

            {/* 🔥 KATEGORI */}
            <div className="kategori-container">
                {kategoriList.map((kat, index) => (
                    <button
                        key={index}
                        className={`kategori-btn ${kategoriAktif === kat ? "active" : ""
                            }`}
                        onClick={() => setKategoriAktif(kat)}
                    >
                        {kat}
                    </button>
                ))}
            </div>

            {/* 🔥 MENU */}
            <div className="menu-grid">
                {filteredMenu.map((item, index) => {
                    const jumlah = cart[item.nama] || 0;

                    return (
                        <div key={index} className="menu-card">
                            <img
  src={getImage(item.nama)}
  className="menu-img"
/>
                            <h3>{item.nama}</h3>
                            <p>{item.kategori}</p>

                            {jumlah === 0 ? (
                                <button onClick={() => tambah(item.nama)}>Beli</button>
                            ) : (
                                <div className="qty-control">
                                    <button onClick={() => kurang(item.nama)}>-</button>
                                    <span>{jumlah}</span>
                                    <button onClick={() => tambah(item.nama)}>+</button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* 🔥 KERANJANG */}
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