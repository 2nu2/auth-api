import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function AdminLogin() {
  const router = useRouter();

  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

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
    <div style={ui.bg}>
      <div style={ui.backGlow} />
      <div style={ui.gridGlow} />

      <div style={ui.shell}>
        <div style={ui.brandRow}>
          <div style={ui.logoDot} />
          <div>
            <div style={ui.brand}>ADMIN</div>
            <div style={ui.brandSub}>Supabase • Vercel</div>
          </div>
        </div>

        <div style={ui.card}>
          <div style={ui.header}>
            <div style={ui.title}>Login</div>
            <div style={ui.sub}>Entre para gerenciar licenças</div>
          </div>

          <form onSubmit={doLogin} style={ui.form}>
            <Field label="Usuário">
              <Input
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="ex: mafas"
                autoComplete="username"
              />
            </Field>

            <Field label="Senha">
              <Input
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="••••••••"
                type="password"
                autoComplete="current-password"
              />
            </Field>

            {msg ? (
              <div style={ui.alertErr}>
                <div style={ui.alertTitle}>Não foi possível entrar</div>
                <div style={ui.alertText}>{msg}</div>
              </div>
            ) : (
              <div style={ui.helper}>
                Dica: se der “senha incorreta”, confere o hash no banco e o usuário.
              </div>
            )}

            <Button disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>

            <div style={ui.footerLine}>
              <span style={{ opacity: 0.6 }}>🔒</span>
              <span style={{ opacity: 0.55 }}>
                Sessão protegida • /api/admin/me
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={ui.label}>{label}</div>
      {children}
    </div>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      style={{ ...ui.input, ...(props.style || {}) }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "rgba(0, 255, 153, 0.45)";
        e.currentTarget.style.boxShadow = "0 0 0 4px rgba(0,255,153,0.10)";
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)";
        e.currentTarget.style.boxShadow = "none";
        props.onBlur?.(e);
      }}
    />
  );
}

function Button({ disabled, children }) {
  return (
    <button
      disabled={disabled}
      style={{
        ...ui.btn,
        opacity: disabled ? 0.7 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow =
          "0 14px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(0,255,153,0.25)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0px)";
        e.currentTarget.style.boxShadow =
          "0 12px 32px rgba(0,0,0,0.45)";
      }}
      type="submit"
    >
      {children}
    </button>
  );
}

const ui = {
  bg: {
    minHeight: "100vh",
    background:
      "radial-gradient(900px 500px at 15% 10%, rgba(0,255,153,0.10) 0%, rgba(0,0,0,0) 55%), radial-gradient(900px 500px at 85% 20%, rgba(120,80,255,0.08) 0%, rgba(0,0,0,0) 60%), linear-gradient(180deg, #070708 0%, #050505 100%)",
    display: "grid",
    placeItems: "center",
    padding: 18,
    fontFamily: "Arial, sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  backGlow: {
    position: "absolute",
    inset: -2,
    background:
      "radial-gradient(600px 300px at 50% 20%, rgba(0,255,153,0.10), transparent 60%)",
    filter: "blur(10px)",
    pointerEvents: "none",
  },
  gridGlow: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
    backgroundSize: "48px 48px",
    maskImage:
      "radial-gradient(350px 250px at 50% 30%, black 0%, transparent 70%)",
    opacity: 0.8,
    pointerEvents: "none",
  },
  shell: {
    width: "min(440px, 92vw)",
    position: "relative",
    zIndex: 2,
  },
  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
    paddingLeft: 6,
  },
  logoDot: {
    width: 14,
    height: 14,
    borderRadius: 999,
    background: "linear-gradient(180deg, #00ff99, #00c977)",
    boxShadow: "0 0 0 4px rgba(0,255,153,0.12), 0 10px 30px rgba(0,255,153,0.12)",
  },
  brand: { color: "#f2f2f2", fontWeight: 900, letterSpacing: 1.2, fontSize: 13 },
  brandSub: { color: "rgba(255,255,255,0.55)", fontSize: 12, marginTop: 2 },
  card: {
    background: "rgba(14,14,16,0.78)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 18,
    boxShadow: "0 18px 55px rgba(0,0,0,0.55)",
    padding: 18,
    backdropFilter: "blur(10px)",
  },
  header: { marginBottom: 14 },
  title: { color: "#fff", fontSize: 20, fontWeight: 900, letterSpacing: 0.2 },
  sub: { color: "rgba(255,255,255,0.62)", fontSize: 12, marginTop: 4 },
  form: { display: "flex", flexDirection: "column", gap: 14, marginTop: 10 },
  label: { color: "rgba(255,255,255,0.70)", fontSize: 12 },
  input: {
    width: "100%",
    background: "rgba(0,0,0,0.28)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 14,
    padding: "12px 12px",
    outline: "none",
    color: "#fff",
  },
  btn: {
    marginTop: 4,
    border: "1px solid rgba(0,255,153,0.25)",
    background:
      "linear-gradient(180deg, rgba(0,255,153,0.18), rgba(0,255,153,0.08))",
    borderRadius: 14,
    padding: "12px 12px",
    fontWeight: 900,
    color: "#6bffb8",
    boxShadow: "0 12px 32px rgba(0,0,0,0.45)",
    transition: "transform 120ms ease, box-shadow 120ms ease",
  },
  helper: {
    color: "rgba(255,255,255,0.38)",
    fontSize: 11,
    lineHeight: 1.5,
    paddingTop: 2,
  },
  alertErr: {
    background: "rgba(255,77,77,0.10)",
    border: "1px solid rgba(255,77,77,0.25)",
    borderRadius: 14,
    padding: "10px 12px",
  },
  alertTitle: { color: "#ffd0d0", fontWeight: 900, fontSize: 12 },
  alertText: { color: "rgba(255,255,255,0.75)", fontSize: 12, marginTop: 4 },
  footerLine: {
    marginTop: 2,
    display: "flex",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    color: "rgba(255,255,255,0.55)",
    fontSize: 11,
  },
};
