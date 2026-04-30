import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/admin.css";

export default function Admin() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"menu" | "promo" | "transaksi">("menu");
  const [kategoriAktif, setKategoriAktif] = useState("Semua");

  const [menu, setMenu] = useState<any[]>([]);
  const [form, setForm] = useState({
    nama_menu: "",
    harga: "",
    kategori_id: "",
    gambar: "",
    stok: "",
    ukuran: "",
  });

  const [editId, setEditId] = useState<string | null>(null);

  const API = "http://localhost:5000/api/menu";

  const [promo, setPromo] = useState<any[]>([]);
  const [editPromoId, setEditPromoId] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  const [transaksiList, setTransaksiList] = useState<any[]>([]);
  const API_TRANSAKSI = "http://localhost:5000/api/transaksi";

  const [formPromo, setFormPromo] = useState({
    kode_promo: "",
    nilai_promo: "",
    minimal_belanja: "",
    maksimal_diskon: "",
    stok: "",
    tanggal_mulai: "",
    tanggal_berakhir: "",
    deskripsi: "",
    is_active: true,
  });

  const API_PROMO = "http://localhost:5000/api/promo";

  const fetchMenu = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setMenu(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPromo = async () => {
    try {
      const res = await fetch(API_PROMO, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setPromo(data?.data || []);
    } catch (err) {
      console.error(err);
      setPromo([]);
    }
  };

  const fetchTransaksi = async () => {
    try {
      const res = await fetch(API_TRANSAKSI, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();

      if (result.sukses || result.data) {
        setTransaksiList(result.data || []);
      }
    } catch (err) {
      console.error("Gagal fetch transaksi:", err);
    }
  };

  useEffect(() => {
    fetchMenu();
    fetchPromo();
    fetchTransaksi();
  }, []);

  const handleUpdateStatus = async (id: string, statusBaru: string) => {
    try {
      const res = await fetch(`${API_TRANSAKSI}/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: statusBaru }),
      });

      if (res.ok) {
        alert(`Status berhasil diubah ke ${statusBaru}`);
        fetchTransaksi();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const payload: any = {
      nama_menu: form.nama_menu,
      harga: Number(form.harga),
      kategori_id: form.kategori_id,
      gambar: form.gambar,
      stok: Number(form.stok),
    };

    if (form.ukuran) payload.ukuran = form.ukuran;

    try {
      if (editId) {
        await fetch(`${API}/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch(API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      setForm({
        nama_menu: "",
        harga: "",
        kategori_id: "",
        gambar: "",
        stok: "",
        ukuran: "",
      });

      setEditId(null);
      fetchMenu();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (item: any) => {
    setForm({
      nama_menu: item.nama_menu,
      harga: item.harga,
      kategori_id: item.kategori_id,
      gambar: item.gambar,
      stok: item.stok,
      ukuran: item.ukuran || "",
    });

    setEditId(item.menu_id);
    setTab("menu");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin mau hapus?")) return;
    await fetch(`${API}/${id}`, { method: "DELETE" });
    fetchMenu();
  };

  const handleChangePromo = (e: any) => {
    setFormPromo({ ...formPromo, [e.target.name]: e.target.value });
  };

  const handleSubmitPromo = async (e: any) => {
    e.preventDefault();

    const payload = {
      kode_promo: formPromo.kode_promo,
      nilai_promo: Number(formPromo.nilai_promo),
      minimal_belanja: Number(formPromo.minimal_belanja),
      maksimal_diskon: formPromo.maksimal_diskon
        ? Number(formPromo.maksimal_diskon)
        : null,
      stok: formPromo.stok ? Number(formPromo.stok) : null,
      tanggal_mulai: formPromo.tanggal_mulai,
      tanggal_berakhir: formPromo.tanggal_berakhir,
      deskripsi: formPromo.deskripsi,
      is_active: formPromo.is_active,
    };

    try {
      if (editPromoId) {
        await fetch(`${API_PROMO}/${editPromoId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch(API_PROMO, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      setFormPromo({
        kode_promo: "",
        nilai_promo: "",
        minimal_belanja: "",
        maksimal_diskon: "",
        stok: "",
        tanggal_mulai: "",
        tanggal_berakhir: "",
        deskripsi: "",
        is_active: true,
      });

      setEditPromoId(null);
      fetchPromo();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditPromo = (item: any) => {
    setFormPromo({
      kode_promo: item.kode_promo,
      nilai_promo: item.nilai_promo,
      minimal_belanja: item.minimal_belanja,
      maksimal_diskon: item.maksimal_diskon,
      stok: item.stok,
      tanggal_mulai: item.tanggal_mulai,
      tanggal_berakhir: item.tanggal_berakhir,
      deskripsi: item.deskripsi,
      is_active: item.is_active,
    });

    setEditPromoId(item.promo_id);
    setTab("promo");
  };

  const handleDeletePromo = async (id: string) => {
    if (!confirm("Yakin mau hapus promo?")) return;
    await fetch(`${API_PROMO}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchPromo();
  };

  const kategoriList = [
    "Semua",
    ...new Set(menu.map((m) => m.kategori?.nama_kategori)),
  ];

  const filteredMenu =
    kategoriAktif === "Semua"
      ? menu
      : menu.filter((item) => item.kategori?.nama_kategori === kategoriAktif);

  return (
    <div className="admin-container">
      <button className="admin-btn" onClick={() => navigate("/home")}>
        Home
      </button>

      <button className="logout-btn" onClick={() => {
        const confirmLogout = window.confirm("Apakah Anda yakin ingin logout?");
        if (confirmLogout) {


          navigate("/login");
        }
      }}>
        Logout
      </button>

      <img src="/images/logo_mcd.jpg" className="logo-mcd" alt="logo" />

      <div className="admin-tabs">
        <button className={tab === "menu" ? "active" : ""} onClick={() => setTab("menu")}>Menu</button>
        <button className={tab === "promo" ? "active" : ""} onClick={() => setTab("promo")}>Promo</button>
        <button className={tab === "transaksi" ? "active" : ""} onClick={() => setTab("transaksi")}>Transaksi</button>
      </div>

      {tab === "menu" && (
        <>
          <h2>Add & Edit Menu</h2>
          <form onSubmit={handleSubmit} className="admin-form">
            <input name="nama_menu" placeholder="Nama Menu" value={form.nama_menu} onChange={handleChange} />
            <input name="harga" placeholder="Harga" value={form.harga} onChange={handleChange} />
            <input name="kategori_id" placeholder="Kategori ID" value={form.kategori_id} onChange={handleChange} />
            <input name="gambar" placeholder="Link Gambar" value={form.gambar} onChange={handleChange} />
            <input name="stok" placeholder="Stok" value={form.stok} onChange={handleChange} />
            <input name="ukuran" placeholder="Ukuran (optional)" value={form.ukuran} onChange={handleChange} />
            <button type="submit">{editId ? "Update" : "Tambah"}</button>
          </form>
          <br />
          <div className="admin-tabs">
            {kategoriList.map((kat, i) => (
              <button key={i} className={kategoriAktif === kat ? "active" : ""} onClick={() => setKategoriAktif(kat)}>{kat}</button>
            ))}
          </div>
          <div className="menu-list">
            {filteredMenu.map((item) => (
              <div key={item.menu_id} className="menu-item">
                <img src={item.gambar} width="80" alt={item.nama_menu} />
                <h3>{item.nama_menu}</h3>
                <p>Rp {item.harga}</p>
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item.menu_id)}>Hapus</button>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "promo" && (
        <>
          <h2>Promo</h2>
          <form onSubmit={handleSubmitPromo} className="admin-form">
            <input name="kode_promo" placeholder="Kode Promo" value={formPromo.kode_promo} onChange={handleChangePromo} />
            <input name="nilai_promo" placeholder="Nilai Promo" value={formPromo.nilai_promo} onChange={handleChangePromo} />
            <input name="minimal_belanja" placeholder="Minimal Belanja" value={formPromo.minimal_belanja} onChange={handleChangePromo} />
            <input name="maksimal_diskon" placeholder="Maks Diskon" value={formPromo.maksimal_diskon} onChange={handleChangePromo} />
            <input name="stok" placeholder="Stok" value={formPromo.stok} onChange={handleChangePromo} />
            <input name="tanggal_mulai" type="date" value={formPromo.tanggal_mulai} onChange={handleChangePromo} />
            <input name="tanggal_berakhir" type="date" value={formPromo.tanggal_berakhir} onChange={handleChangePromo} />
            <input name="deskripsi" placeholder="Deskripsi" value={formPromo.deskripsi} onChange={handleChangePromo} />
            <button type="submit">{editPromoId ? "Update" : "Tambah"}</button>
          </form>
          <div className="menu-list">
            {(promo || []).map((item) => (
              <div key={item.promo_id} className="menu-item">
                <h3>{item.kode_promo}</h3>
                <p>{item.nilai_promo}</p>
                <button onClick={() => handleEditPromo(item)}>Edit</button>
                <button onClick={() => handleDeletePromo(item.promo_id)}>Hapus</button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* --- BAGIAN TRANSAKSI --- */}
      {tab === "transaksi" && (
        <div className="transaksi-admin-section">
          <h2>Riwayat Transaksi</h2>
          <div className="transaksi-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Waktu</th>
                  <th>Pelanggan</th>
                  <th>Meja</th>
                  <th>Tipe</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {transaksiList.length > 0 ? (
                  transaksiList.map((tr) => (
                    <tr key={tr.transaksi_id}>
                      <td>{new Date(tr.createdAt).toLocaleString("id-ID")}</td>
                      <td>{tr.nama_pelanggan}</td>
                      <td>{tr.nomor_meja || "-"}</td>
                      <td>{tr.tipe_pesanan}</td>
                      <td className="items-cell">
                        {tr.items?.map((it: any, idx: number) => (
                          <div key={idx}>
                            • {it.menu?.nama_menu} (x{it.kuantitas})
                          </div>
                        ))}
                      </td>
                      <td><b>Rp {tr.total_harga.toLocaleString("id-ID")}</b></td>
                      <td>
                        <span className={`status-badge ${tr.status}`}>
                          {tr.status}
                        </span>
                      </td>
                      <td>
                        <select
                          value={tr.status}
                          onChange={(e) => handleUpdateStatus(tr.transaksi_id, e.target.value)}
                          className="status-select"
                        >
                          <option value="pending">Pending</option>
                          <option value="diproses">Diproses</option>
                          <option value="selesai">Selesai</option>
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '20px' }}>
                      Tidak ada data transaksi ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}