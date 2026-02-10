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
    } catch {
      setMsg("Erro de conexão.");
      setLoading(false);
    }
  }

  return (
    <div style={ui.page}>
      {/* overlay + blur */}
      <div style={ui.overlay} />

      {/* modal */}
      <div style={ui.modal}>
        <button
          style={ui.close}
          onClick={() => router.push("/")}
          aria-label="Fechar"
          title="Fechar"
        >
          ×
        </button>

        <div style={ui.modalInner}>
          {/* "painel azul escuro" central, igual a referência */}
          <div style={ui.panel}>
            <form onSubmit={doLogin} style={ui.form}>
              <InputRow
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="Usuário"
                icon="user"
                autoComplete="username"
              />
              <InputRow
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="Senha"
                type="password"
                icon="lock"
                autoComplete="current-password"
              />

              {msg ? <div style={ui.err}>{msg}</div> : <div style={ui.spacer} />}

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...ui.btn,
                  opacity: loading ? 0.75 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
                onMouseEnter={(e) => {
                  if (loading) return;
                  e.currentTarget.style.filter = "brightness(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = "none";
                }}
              >
                {loading ? "authorizing..." : "authorize"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputRow({ icon, ...props }) {
  return (
    <div style={ui.inputWrap}>
      <input
        {...props}
        style={ui.input}
        onFocus={(e) => {
          e.currentTarget.parentElement.style.borderColor =
            "rgba(120, 170, 255, 0.45)";
          e.currentTarget.parentElement.style.boxShadow =
            "0 0 0 4px rgba(120, 170, 255, 0.12)";
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          e.currentTarget.parentElement.style.borderColor =
            "rgba(255,255,255,0.08)";
          e.currentTarget.parentElement.style.boxShadow = "none";
          props.onBlur?.(e);
        }}
      />
      <span style={ui.icon}>
        {icon === "user" ? <UserIcon /> : <LockIcon />}
      </span>
    </div>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Zm0 2c-4.2 0-7.5 2.1-7.5 4.7V20h15v-1.3c0-2.6-3.3-4.7-7.5-4.7Z"
        fill="rgba(255,255,255,0.65)"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M17 10V8a5 5 0 0 0-10 0v2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-1Zm-8 0V8a3 3 0 0 1 6 0v2H9Z"
        fill="rgba(255,255,255,0.65)"
      />
    </svg>
  );
}

const ui = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(900px 520px at 15% 10%, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.95) 60%), linear-gradient(180deg, #0b0c0f 0%, #08090c 100%)",
    display: "grid",
    placeItems: "center",
    padding: 18,
    fontFamily: "Arial, sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(700px 380px at 50% 45%, rgba(90,120,170,0.10) 0%, rgba(0,0,0,0) 55%), rgba(0,0,0,0.55)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
  },
  modal: {
    width: "min(720px, 95vw)",
    height: "min(520px, 85vh)",
    borderRadius: 14,
    background: "rgba(16,16,18,0.72)",
    border: "1px solid rgba(255,255,255,0.10)",
    boxShadow: "0 30px 90px rgba(0,0,0,0.65)",
    position: "relative",
    zIndex: 2,
    display: "grid",
    placeItems: "center",
  },
  close: {
    position: "absolute",
    right: 14,
    top: 10,
    width: 34,
    height: 34,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.03)",
    color: "rgba(255,255,255,0.65)",
    fontSize: 22,
    lineHeight: "34px",
    cursor: "pointer",
  },
  modalInner: {
    width: "100%",
    height: "100%",
    display: "grid",
    placeItems: "center",
    padding: 18,
  },
  panel: {
    width: "min(420px, 90%)",
    height: "min(320px, 80%)",
    borderRadius: 6,
    background: "rgba(10, 24, 40, 0.55)",
    border: "1px solid rgba(120,170,255,0.08)",
    boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.25)",
    display: "grid",
    placeItems: "center",
    padding: 18,
  },
  form: {
    width: "min(320px, 90%)",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  inputWrap: {
    display: "flex",
    alignItems: "center",
    borderRadius: 6,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(0,0,0,0.35)",
    padding: "0 10px",
    height: 40,
    transition: "box-shadow 120ms ease, border-color 120ms ease",
  },
  input: {
    flex: 1,
    height: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    color: "rgba(255,255,255,0.85)",
    fontSize: 16,
    padding: "0 8px 0 6px",
  },
  icon: { width: 22, display: "grid", placeItems: "center", opacity: 0.9 },
  btn: {
    marginTop: 10,
    height: 46,
    borderRadius: 2,
    border: "1px solid rgba(150,190,255,0.35)",
    background: "rgba(130, 175, 240, 0.85)",
    color: "rgba(255,255,255,0.92)",
    fontSize: 18,
    fontWeight: 500,
    letterSpacing: 0.2,
  },
  err: {
    marginTop: 2,
    fontSize: 12,
    color: "rgba(255,160,160,0.92)",
    background: "rgba(255,80,80,0.08)",
    border: "1px solid rgba(255,80,80,0.18)",
    borderRadius: 6,
    padding: "8px 10px",
  },
  spacer: { height: 34 },
};
