// pages/admin/index.js
import { useEffect, useState } from "react";

export default function AdminPanel() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState("");

  async function checkSession() {
    setLoading(true);
    setMsg("");
    try {
      const r = await fetch("/api/admin/me");
      const j = await r.json();
      if (j.ok) setSession(j.admin);
      else setSession(null);
    } catch {
      setSession(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkSession();
  }, []);

  async function doLogin(e) {
    e.preventDefault();
    setMsg("");
    try {
      const r = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, pass }),
      });
      const j = await r.json();
      if (!j.ok) {
        setMsg(j.message || "Falha no login");
        return;
      }
      setUser("");
      setPass("");
      await checkSession();
    } catch {
      setMsg("Erro de rede");
    }
  }

  async function doLogout() {
    setMsg("");
    await fetch("/api/admin/logout");
    setSession(null);
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>Carregando...</div>
      </div>
    );
  }

  // ===== LOGADO =====
  if (session) {
    return (
      <div style={styles.page}>
        <div style={styles.cardWide}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
            <div>
              <h1 style={styles.h1}>🔐 Painel Admin</h1>
              <div style={styles.sub}>
                Logado como <b>{session.user}</b> • role <b>{session.role}</b>
              </div>
            </div>

            <button onClick={doLogout} style={styles.btnDanger}>
              Sair
            </button>
          </div>

          <hr style={styles.hr} />

          {/* Aqui você coloca as telas do painel */}
          <div style={styles.grid}>
            <div style={styles.box}>
              <div style={styles.boxTitle}>Gerar Key</div>
              <div style={styles.boxText}>Em seguida a gente cria a rota /api/admin/create-key</div>
              <button style={styles.btn}>Adicionar</button>
            </div>

            <div style={styles.box}>
              <div style={styles.boxTitle}>Licenças</div>
              <div style={styles.boxText}>Listar keys, expiração, HWID, ativar/desativar</div>
              <button style={styles.btn}>Abrir</button>
            </div>

            <div style={styles.box}>
              <div style={styles.boxTitle}>Reset HWID</div>
              <div style={styles.boxText}>Botão pra limpar HWID de uma key</div>
              <button style={styles.btn}>Abrir</button>
            </div>
          </div>

          {msg ? <div style={styles.msg}>{msg}</div> : null}
        </div>
      </div>
    );
  }

  // ===== NÃO LOGADO =====
  return (
    <div style={styles.page}>
      <form onSubmit={doLogin} style={styles.card}>
        <h1 style={styles.h1}>🔐 Admin Login</h1>
        <div style={styles.sub}>Entre pra gerenciar licenças</div>

        <input
          value={user}
          onChange={(e) => setUser(e.target.value)}
          placeholder="Usuário"
          style={styles.input}
          autoComplete="username"
        />

        <input
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          placeholder="Senha"
          type="password"
          style={styles.input}
          autoComplete="current-password"
        />

        <button type="submit" style={styles.btn}>
          Entrar
        </button>

        {msg ? <div style={styles.msg}>{msg}</div> : null}

        <a href="/api/verify" style={styles.link}>
          Testar API (/api/verify)
        </a>
      </form>
    </div>
  );
}

const styles = {
  page: {
    background: "#0b0b0b",
    color: "#fff",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Arial",
    padding: 24,
  },
  card: {
    width: 380,
    background: "#121212",
    border: "1px solid #222",
    borderRadius: 14,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  cardWide: {
    width: "min(900px, 100%)",
    background: "#121212",
    border: "1px solid #222",
    borderRadius: 14,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  h1: { margin: 0, fontSize: 22 },
  sub: { opacity: 0.8, fontSize: 13 },
  input: {
    background: "#0f0f0f",
    border: "1px solid #222",
    color: "#fff",
    borderRadius: 10,
    padding: "10px 12px",
    outline: "none",
  },
  btn: {
    background: "#00ff99",
    border: "none",
    color: "#000",
    borderRadius: 10,
    padding: "10px 12px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  btnDanger: {
    background: "#ff3b3b",
    border: "none",
    color: "#000",
    borderRadius: 10,
    padding: "10px 12px",
    cursor: "pointer",
    fontWeight: "bold",
    height: 40,
  },
  link: { marginTop: 6, color: "#00ff99", fontSize: 13, textAlign: "center" },
  msg: {
    marginTop: 6,
    background: "#1b1b1b",
    border: "1px solid #2a2a2a",
    padding: 10,
    borderRadius: 10,
    color: "#fff",
    fontSize: 13,
    opacity: 0.9,
  },
  hr: { border: "none", borderTop: "1px solid #222", width: "100%" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
    marginTop: 6,
  },
  box: {
    border: "1px solid #222",
    borderRadius: 12,
    padding: 12,
    background: "#0f0f0f",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  boxTitle: { fontWeight: "bold" },
  boxText: { opacity: 0.8, fontSize: 13 },
};
