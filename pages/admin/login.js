import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function AdminLogin() {
  const router = useRouter();

  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // se já estiver logado, manda pro /admin
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/admin/me");
        const j = await r.json();
        if (j?.ok) router.replace("/admin");
      } catch {}
    })();
  }, [router]);

  async function doLogin(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const r = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, pass }),
      });

      const j = await r.json().catch(() => null);

      if (!r.ok || !j?.ok) {
        setMsg(j?.message || "Falha no login.");
        setLoading(false);
        return;
      }

      router.replace("/admin");
    } catch (err) {
      setMsg("Erro de conexão.");
      setLoading(false);
    }
  }

  return (
    <div style={styles.bg}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.title}>🔐 Login Admin</div>
          <div style={styles.sub}>Entre para gerenciar licenças</div>
        </div>

        <form onSubmit={doLogin} style={styles.form}>
          <label style={styles.label}>Usuário</label>
          <input
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="ex: mafás"
            style={styles.input}
            autoComplete="username"
          />

          <label style={{ ...styles.label, marginTop: 12 }}>Senha</label>
          <input
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="••••••••"
            type="password"
            style={styles.input}
            autoComplete="current-password"
          />

          {msg ? <div style={styles.error}>{msg}</div> : null}

          <button disabled={loading} style={styles.btn}>
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <div style={styles.hint}>
            Dica: se der “senha incorreta”, confere o hash no banco e o usuário.
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  bg: {
    minHeight: "100vh",
    background:
      "radial-gradient(1200px 600px at 50% 40%, #111 0%, #070707 45%, #050505 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    fontFamily: "Arial",
  },
  card: {
    width: 420,
    background: "rgba(20,20,20,0.92)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 14,
    boxShadow: "0 12px 40px rgba(0,0,0,0.55)",
    padding: 18,
  },
  header: { marginBottom: 14 },
  title: { color: "#fff", fontSize: 20, fontWeight: 700 },
  sub: { color: "rgba(255,255,255,0.65)", fontSize: 12, marginTop: 4 },
  form: { display: "flex", flexDirection: "column", gap: 6 },
  label: { color: "rgba(255,255,255,0.75)", fontSize: 12 },
  input: {
    background: "rgba(0,0,0,0.35)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10,
    padding: "10px 12px",
    outline: "none",
    color: "#fff",
  },
  btn: {
    marginTop: 14,
    background: "linear-gradient(90deg, #12ff9a, #00d97a)",
    border: "none",
    borderRadius: 10,
    padding: "11px 12px",
    fontWeight: 800,
    cursor: "pointer",
    color: "#07110b",
  },
  error: {
    marginTop: 10,
    background: "rgba(255,0,0,0.10)",
    border: "1px solid rgba(255,0,0,0.25)",
    color: "#ffb3b3",
    padding: "10px 12px",
    borderRadius: 10,
    fontSize: 12,
  },
  hint: {
    marginTop: 12,
    color: "rgba(255,255,255,0.35)",
    fontSize: 11,
    lineHeight: 1.4,
  },
};
