import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/login.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      const response = await fetch("http://localhost:5000/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.sukses) {
        alert("Success! Please check the Backend terminal for your reset link.");
        navigate("/login"); // Send them back to login after success
      } else {
        alert("Failed: " + data.pesan);
      }
    } catch (err: any) {
      alert("An error occurred while connecting to the server!");
      console.error(err);
    }
  };

  return (
    <div className="container">
      <div className="login-box">
        <img src="/images/logo_mcd.jpg" alt="McD Logo" className="logo-mcd" />
        
        <h3 style={{ textAlign: "center", marginBottom: "15px", color: "#333" }}>Lupa Password</h3>
        <p style={{ textAlign: "center", marginBottom: "20px", fontSize: "14px", color: "#666" }}>
          Masukkan email yang terdaftar. Kami akan mengirimkan link untuk mereset password Anda.
        </p>

        <form onSubmit={handleReset}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Kirim Link Reset</button>
        </form>

        <p 
          onClick={() => navigate("/login")} 
          style={{ 
            textAlign: "center", 
            marginTop: "15px", 
            cursor: "pointer", 
            color: "#444", 
            fontSize: "14px",
            textDecoration: "underline"
          }}
          onMouseOver={(e) => e.currentTarget.style.color = "#d32f2f"}
          onMouseOut={(e) => e.currentTarget.style.color = "#444"}
        >
          Kembali ke Login
        </p>
      </div>
    </div>
  );
}