import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/login.css";

export default function ResetPassword() {
  const { token } = useParams(); 
  const navigate = useNavigate();
  
  const [passwordBaru, setPasswordBaru] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");

  const handleReset = async (e: any) => {
    e.preventDefault();

    if (passwordBaru !== konfirmasiPassword) {
      alert("Password dan Konfirmasi Password tidak cocok!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/admin/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ passwordBaru }),
      });

      const data = await response.json();

      if (data.sukses) {
        alert("Berhasil! " + data.pesan);
        navigate("/login"); 
      } else {
        alert("Gagal: " + data.pesan);
      }
    } catch (err: any) {
      alert("Terjadi error saat menghubungi server!");
      console.error(err);
    }
  };

  return (
    <div className="container">
      <div className="login-box">
        <img src="/images/logo_mcd.jpg" alt="McD Logo" className="logo-mcd" />

        <h3 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>Buat Password Baru</h3>

        <form onSubmit={handleReset}>
          <input
            type="password"
            placeholder="Masukkan Password Baru"
            value={passwordBaru}
            onChange={(e) => setPasswordBaru(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Konfirmasi Password Baru"
            value={konfirmasiPassword}
            onChange={(e) => setKonfirmasiPassword(e.target.value)}
            required
          />

          <button type="submit">Simpan Password</button>
        </form>
      </div>
    </div>
  );
}