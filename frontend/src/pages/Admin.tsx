import { useEffect, useState } from "react";
import "../css/admin.css";

export default function Admin() {
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

  // GET MENU
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

  // HANDLE INPUT
  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ADD / UPDATE
  const handleSubmit = async (e: any) => {
  e.preventDefault();

  const payload: any = {
    nama_menu: form.nama_menu,
    harga: Number(form.harga),
    kategori_id: form.kategori_id,
    gambar: form.gambar,
    stok: Number(form.stok),
  };

  if (form.ukuran && form.ukuran.trim() !== "") {
    payload.ukuran = form.ukuran;
  }

  try {
    if (editId) {
      await fetch(`${API}/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin mau hapus?")) return;

    try {
      await fetch(`${API}/${id}`, {
        method: "DELETE",
      });
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
  };

  return (
    <div className="admin-container">
      <h1>Admin Menu</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="admin-form">
        <input
          name="nama_menu"
          placeholder="Nama Menu"
          value={form.nama_menu}
          onChange={handleChange}
          required
        />

        <input
          name="harga"
          placeholder="Harga"
          value={form.harga}
          onChange={handleChange}
          required
        />

        <input
          name="kategori_id"
          placeholder="Kategori ID"
          value={form.kategori_id}
          onChange={handleChange}
          required
        />

        <input
          name="gambar"
          placeholder="Link Gambar"
          value={form.gambar}
          onChange={handleChange}
          required
        />

        <input
          name="stok"
          placeholder="Stok"
          value={form.stok}
          onChange={handleChange}
        />

        {/* ✅ OPTIONAL */}
        <input
          name="ukuran"
          placeholder="Ukuran (S/M/L)"
          value={form.ukuran}
          onChange={handleChange}
        />

        <button type="submit">
          {editId ? "Update Menu" : "Tambah Menu"}
        </button>
      </form>

      {/* LIST MENU */}
      <div className="menu-list">
        {menu.map((item) => (
          <div key={item.menu_id} className="menu-item">
            <img src={item.gambar} alt={item.nama_menu} width="80" />
            <h3>{item.nama_menu}</h3>
            <p>Rp {item.harga}</p>
            <p>Stok: {item.stok}</p>
            {item.ukuran && <p>Ukuran: {item.ukuran}</p>}

            <button onClick={() => handleEdit(item)}>Edit</button>
            <button onClick={() => handleDelete(item.menu_id)}>
              Hapus
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}