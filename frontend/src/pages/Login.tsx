import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: any) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (data.sukses) {
        alert(data.pesan);

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.data));

        console.log(data);

        navigate("/admin");
      } else {
        alert(data.pesan);
      }
    } catch (err: any) {
      alert("Terjadi error saat login!");
      console.error(err);
    }
  };

  return (
    <div className="container">
      <div className="login-box">
        <img src="/images/logo_mcd.jpg" alt="McD Logo" className="logo-mcd" />

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}