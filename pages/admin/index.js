// pages/admin/index.js
import { useState } from "react";

export default function AdminLogin() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState("");

  async function onLogin(e) {
    e.preventDefault();
    setMsg("...");

    const r = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, pass }),
    });

    const j = await r.json().catch(() => null);
    if (!r.ok || !j?.ok) {
      setMsg(j?.message || "Falha no login");
      return;
    }

    // depois do login, manda pro painel (você vai criar)
    window.location.href = "/admin/panel";
  }

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <form onSubmit={onLogin} style={{ width: 360, padding: 20, border: "1px solid #333", borderRadius: 12 }}>
        <h2>Admin Login</h2>
        <input placeholder="user" value={user} onChange={(e) => setUser(e.target.value)} style={{ width: "100%", marginTop: 10 }} />
        <input placeholder="pass" type="password" value={pass} onChange={(e) => setPass(e.target.value)} style={{ width: "100%", marginTop: 10 }} />
        <button style={{ width: "100%", marginTop: 12 }}>Entrar</button>
        <div style={{ marginTop: 10, opacity: 0.8 }}>{msg}</div>
      </form>
    </div>
  );
}
