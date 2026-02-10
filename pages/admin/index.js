// pages/admin/index.js
import { useEffect, useMemo, useState } from "react";

const ui = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(900px 500px at 15% 10%, rgba(0,255,153,0.08) 0%, transparent 55%), radial-gradient(900px 500px at 85% 20%, rgba(120,80,255,0.06) 0%, transparent 60%), linear-gradient(180deg, #070708 0%, #050505 100%)",
    color: "#fff",
    fontFamily: "Arial, sans-serif",
    padding: 22,
    position: "relative",
    overflowX: "hidden",
  },
  gridGlow: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
    backgroundSize: "56px 56px",
    maskImage:
      "radial-gradient(520px 280px at 30% 10%, black 0%, transparent 70%)",
    opacity: 0.75,
    pointerEvents: "none",
  },
  container: { position: "relative", zIndex: 2, maxWidth: 1280, margin: "0 auto" },

  topbar: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    backdropFilter: "blur(10px)",
    background: "rgba(8,8,10,0.55)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 18,
    padding: "14px 14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 14,
    marginBottom: 14,
    boxShadow: "0 14px 45px rgba(0,0,0,0.35)",
  },
  title: { fontSize: 18, fontWeight: 900, letterSpacing: 0.2 },
  sub: { marginTop: 4, color: "rgba(255,255,255,0.60)", fontSize: 12 },

  actions: { display: "flex", gap: 10, alignItems: "center" },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(12, 1fr)",
    gap: 14,
  },

  card: {
    background: "rgba(14,14,16,0.72)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 18,
    padding: 16,
    boxShadow: "0 14px 45px rgba(0,0,0,0.35)",
    backdropFilter: "blur(10px)",
  },
  cardTitle: { fontSize: 14, fontWeight: 900, marginBottom: 6, letterSpacing: 0.2 },
  cardDesc: { color: "rgba(255,255,255,0.60)", fontSize: 12, marginBottom: 12 },

  row: { display: "flex", gap: 10, alignItems: "center", marginTop: 10 },
  label: { width: 70, color: "rgba(255,255,255,0.72)", fontSize: 12 },

  input: {
    flex: 1,
    padding: "11px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    outline: "none",
    background: "rgba(0,0,0,0.25)",
    color: "#fff",
  },
  select: {
    padding: "9px 10px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.25)",
    color: "#fff",
    outline: "none",
  },

  btnPrimary: {
    width: "100%",
    padding: "12px 12px",
    borderRadius: 14,
    border: "1px solid rgba(0,255,153,0.25)",
    background:
      "linear-gradient(180deg, rgba(0,255,153,0.18), rgba(0,255,153,0.08))",
    color: "#6bffb8",
    fontWeight: 900,
    cursor: "pointer",
    boxShadow: "0 12px 32px rgba(0,0,0,0.35)",
    transition: "transform 120ms ease, box-shadow 120ms ease",
  },
  btnGhost: {
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    color: "#e6e6e6",
    cursor: "pointer",
  },
  btnDangerLink: {
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,77,77,0.25)",
    background:
      "linear-gradient(180deg, rgba(255,77,77,0.18), rgba(255,77,77,0.08))",
    color: "#ffb0b0",
    fontWeight: 900,
    textDecoration: "none",
    display: "inline-block",
  },
  badgeBtn: {
    padding: "5px 9px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    color: "#d8d8d8",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 800,
  },
  btnSmall: {
    padding: "9px 10px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    color: "#e6e6e6",
    cursor: "pointer",
    fontWeight: 800,
  },
  btnSmallDanger: {
    padding: "9px 10px",
    borderRadius: 14,
    border: "1px solid rgba(255,77,77,0.25)",
    background: "rgba(255,77,77,0.08)",
    color: "#ffb0b0",
    cursor: "pointer",
    fontWeight: 900,
  },

  toast: {
    position: "fixed",
    right: 18,
    top: 18,
    padding: "12px 14px",
    borderRadius: 14,
    border: "1px solid",
    boxShadow: "0 14px 45px rgba(0,0,0,0.55)",
    zIndex: 9999,
    maxWidth: 520,
    backdropFilter: "blur(10px)",
  },

  tableWrap: {
    marginTop: 10,
    overflow: "auto",
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(0,0,0,0.18)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: 860,
  },
  th: {
    position: "sticky",
    top: 0,
    textAlign: "left",
    fontSize: 12,
    color: "rgba(255,255,255,0.68)",
    padding: "12px 12px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(12,12,14,0.85)",
    backdropFilter: "blur(10px)",
    zIndex: 2,
  },
  thRight: {
    position: "sticky",
    top: 0,
    textAlign: "right",
    fontSize: 12,
    color: "rgba(255,255,255,0.68)",
    padding: "12px 12px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(12,12,14,0.85)",
    backdropFilter: "blur(10px)",
    zIndex: 2,
  },
  tr: { borderBottom: "1px solid rgba(255,255,255,0.06)" },
  td: { padding: "12px 12px", fontSize: 13, color: "rgba(255,255,255,0.82)", verticalAlign: "middle" },
  tdMono: {
    padding: "12px 12px",
    fontSize: 13,
    color: "rgba(255,255,255,0.86)",
    fontFamily: "Consolas, monospace",
    verticalAlign: "middle",
  },
  tdRight: { padding: "12px 12px", fontSize: 13, color: "rgba(255,255,255,0.82)", textAlign: "right" },
  empty: { padding: 18, textAlign: "center", color: "rgba(255,255,255,0.55)" },

  pill: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 0.2,
  },

  footer: { marginTop: 14, color: "rgba(255,255,255,0.55)", fontSize: 12, textAlign: "center" },
};

export default function AdminPanel() {
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const [days, setDays] = useState(30);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);

  const [query, setQuery] = useState("");
  const [onlyActive, setOnlyActive] = useState(false);

  const [bulkVersion, setBulkVersion] = useState("1.0");
  const [bulkOnlyActive, setBulkOnlyActive] = useState(true);
  const [bulkMsg, setBulkMsg] = useState("");

  const [data, setData] = useState({ total: 0, licenses: [] });
  const [toast, setToast] = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const fmtDate = (iso) => {
    if (!iso) return "-";
    try {
      const d = new Date(iso);
      return d.toLocaleString();
    } catch {
      return iso;
    }
  };

  const fetchJson = async (url, opts = {}) => {
    const res = await fetch(url, {
      ...opts,
      headers: {
        "Content-Type": "application/json",
        ...(opts.headers || {}),
      },
    });

    const text = await res.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {
      json = { ok: false, message: text };
    }

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        window.location.href = "/admin/login";
      }
      throw new Error(json?.message || `HTTP ${res.status}`);
    }

    if (json?.ok === false) throw new Error(json?.message || "Falhou");
    return json;
  };

  const loadLicenses = async () => {
    setLoading(true);
    try {
      const url = `/api/admin/licenses?page=${page}&limit=${limit}`;
      const json = await fetchJson(url, { method: "GET" });
      setData({ total: json.total || 0, licenses: json.licenses || [] });
    } catch (e) {
      showToast("err", e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLicenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const filteredLicenses = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data.licenses || []).filter((l) => {
      if (onlyActive && !l.is_active) return false;
      if (!q) return true;
      const key = String(l.key || "").toLowerCase();
      const hwid = String(l.hwid || "").toLowerCase();
      return key.includes(q) || hwid.includes(q);
    });
  }, [data.licenses, query, onlyActive]);

  const createKey = async () => {
    setCreating(true);
    try {
      const json = await fetchJson("/api/admin/create-key", {
        method: "POST",
        body: JSON.stringify({ days: Number(days) }),
      });

      showToast("ok", `Key criada: ${json.license?.key || "OK"}`);
      await loadLicenses();
    } catch (e) {
      showToast("err", e.message);
    } finally {
      setCreating(false);
    }
  };

  const resetHwid = async (key) => {
    if (!confirm(`Resetar HWID da key:\n\n${key}\n\nConfirmar?`)) return;
    try {
      await fetchJson("/api/admin/reset-hwid", {
        method: "POST",
        body: JSON.stringify({ key }),
      });
      showToast("ok", "HWID resetado.");
      await loadLicenses();
    } catch (e) {
      showToast("err", e.message);
    }
  };

  const deleteKey = async (key) => {
    if (!confirm(`DELETAR a key:\n\n${key}\n\nIsso não tem volta. Confirmar?`)) return;
    try {
      await fetchJson("/api/admin/delete-key", {
        method: "POST",
        body: JSON.stringify({ key }),
      });
      showToast("ok", "Key deletada.");
      await loadLicenses();
    } catch (e) {
      showToast("err", e.message);
    }
  };

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast("ok", "Copiado.");
    } catch {
      showToast("err", "Não consegui copiar (permissão do navegador).");
    }
  };

  const bulkUpdateVersion = async () => {
    setBulkMsg("Atualizando...");
    try {
      const json = await fetchJson("/api/admin/bulk-update-version", {
        method: "POST",
        body: JSON.stringify({ version: bulkVersion, only_active: bulkOnlyActive }),
      });

      setBulkMsg(`✅ ${json.updated} keys -> v${json.version}`);
      showToast("ok", `Atualizou ${json.updated} keys para v${json.version}`);
      await loadLicenses();
    } catch (e) {
      setBulkMsg(`❌ ${e.message}`);
      showToast("err", e.message);
    }
  };

  const totalPages = Math.max(1, Math.ceil((data.total || 0) / limit));

  return (
    <div style={ui.page}>
      <div style={ui.gridGlow} />

      <div style={ui.container}>
        {/* Top bar */}
        <div style={ui.topbar}>
          <div>
            <div style={ui.title}>Painel Admin</div>
            <div style={ui.sub}>Gerenciar licenças (Supabase + Vercel)</div>
          </div>

          <div style={ui.actions}>
            <button
              style={ui.btnGhost}
              onClick={() => loadLicenses()}
              disabled={loading}
              title="Recarregar"
            >
              {loading ? "Carregando..." : "Recarregar"}
            </button>

            <a href="/api/admin/logout" style={ui.btnDangerLink}>
              Sair
            </a>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div
            style={{
              ...ui.toast,
              borderColor: toast.type === "ok" ? "rgba(0,255,153,0.28)" : "rgba(255,77,77,0.30)",
              background: toast.type === "ok" ? "rgba(9,18,14,0.88)" : "rgba(18,9,9,0.88)",
            }}
          >
            <span style={{ opacity: 0.92, fontWeight: 800 }}>
              {toast.type === "ok" ? "✅ " : "❌ "}
              {toast.msg}
            </span>
          </div>
        )}

        {/* Cards */}
        <div style={ui.grid}>
          {/* Create */}
          <div style={{ ...ui.card, gridColumn: "span 4" }}>
            <div style={ui.cardTitle}>Gerar Key</div>
            <div style={ui.cardDesc}>Cria uma key nova com expiração em X dias.</div>

            <div style={ui.row}>
              <label style={ui.label}>Dias</label>
              <input
                style={ui.input}
                type="number"
                value={days}
                min={1}
                max={3650}
                onChange={(e) => setDays(e.target.value)}
              />
            </div>

            <button
              style={{
                ...ui.btnPrimary,
                marginTop: 12,
                opacity: creating ? 0.7 : 1,
                cursor: creating ? "not-allowed" : "pointer",
              }}
              onClick={createKey}
              disabled={creating}
              onMouseEnter={(e) => {
                if (creating) return;
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow =
                  "0 18px 55px rgba(0,0,0,0.40), 0 0 0 1px rgba(0,255,153,0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0px)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.35)";
              }}
            >
              {creating ? "Gerando..." : "Gerar key"}
            </button>

            <div style={{ marginTop: 10, color: "rgba(255,255,255,0.45)", fontSize: 12 }}>
              Dica: depois dá “copiar” na tabela.
            </div>
          </div>

          {/* Bulk Update Version */}
          <div style={{ ...ui.card, gridColumn: "span 4" }}>
            <div style={ui.cardTitle}>Forçar Update (versão)</div>
            <div style={ui.cardDesc}>Atualiza a versão exigida para todas as keys.</div>

            <div style={ui.row}>
              <label style={ui.label}>Versão</label>
              <input
                style={ui.input}
                placeholder="ex: 1.1"
                value={bulkVersion}
                onChange={(e) => setBulkVersion(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 10 }}>
              <label style={{ display: "flex", gap: 8, alignItems: "center", color: "rgba(255,255,255,0.75)" }}>
                <input
                  type="checkbox"
                  checked={bulkOnlyActive}
                  onChange={(e) => setBulkOnlyActive(e.target.checked)}
                />
                Atualizar só ativas
              </label>
            </div>

            <button style={{ ...ui.btnPrimary, marginTop: 12 }} onClick={bulkUpdateVersion}>
              Atualizar versão de todas
            </button>

            {bulkMsg && (
              <div style={{ marginTop: 10, color: "rgba(255,255,255,0.70)", fontSize: 12 }}>
                {bulkMsg}
              </div>
            )}
          </div>

          {/* Filters */}
          <div style={{ ...ui.card, gridColumn: "span 4" }}>
            <div style={ui.cardTitle}>Filtros</div>
            <div style={ui.cardDesc}>Pesquise por key ou HWID.</div>

            <div style={ui.row}>
              <label style={ui.label}>Busca</label>
              <input
                style={ui.input}
                placeholder="ex: MAL0-.... ou HWID"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 10 }}>
              <label style={{ display: "flex", gap: 8, alignItems: "center", color: "rgba(255,255,255,0.75)" }}>
                <input
                  type="checkbox"
                  checked={onlyActive}
                  onChange={(e) => setOnlyActive(e.target.checked)}
                />
                Mostrar só ativas
              </label>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 12, alignItems: "center" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ color: "rgba(255,255,255,0.60)", fontSize: 12 }}>Por página</span>
                <select
                  style={ui.select}
                  value={limit}
                  onChange={(e) => {
                    setPage(1);
                    setLimit(Number(e.target.value));
                  }}
                >
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={200}>200</option>
                </select>
              </div>

              <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
                <button
                  style={ui.btnGhost}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  ◀
                </button>
                <div style={{ color: "rgba(255,255,255,0.60)", fontSize: 12 }}>
                  Página <b style={{ color: "#fff" }}>{page}</b> /{" "}
                  <b style={{ color: "#fff" }}>{totalPages}</b>
                </div>
                <button
                  style={ui.btnGhost}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                >
                  ▶
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ ...ui.card, marginTop: 14 }}>
          <div style={ui.cardTitle}>Licenças</div>
          <div style={ui.cardDesc}>
            Total no banco: <b style={{ color: "#fff" }}>{data.total || 0}</b> — exibindo{" "}
            <b style={{ color: "#fff" }}>{filteredLicenses.length}</b> após filtros.
          </div>

          <div style={ui.tableWrap}>
            <table style={ui.table}>
              <thead>
                <tr>
                  <th style={ui.th}>Key</th>
                  <th style={ui.th}>HWID</th>
                  <th style={ui.th}>Expira</th>
                  <th style={ui.th}>Ativa</th>
                  <th style={ui.thRight}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredLicenses.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={ui.empty}>
                      {loading ? "Carregando..." : "Nenhuma licença encontrada."}
                    </td>
                  </tr>
                ) : (
                  filteredLicenses.map((l) => (
                    <tr key={l.key} style={ui.tr}>
                      <td style={ui.tdMono}>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <span style={{ color: "rgba(255,255,255,0.92)" }}>{l.key}</span>
                          <button style={ui.badgeBtn} onClick={() => copy(l.key)}>
                            copiar
                          </button>
                        </div>
                      </td>

                      <td style={ui.td}>
                        <span style={{ color: l.hwid ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.35)" }}>
                          {l.hwid || "—"}
                        </span>
                      </td>

                      <td style={ui.td}>{fmtDate(l.expires_at)}</td>

                      <td style={ui.td}>
                        <span
                          style={{
                            ...ui.pill,
                            background: l.is_active ? "rgba(0,255,153,0.10)" : "rgba(255,77,77,0.10)",
                            borderColor: l.is_active ? "rgba(0,255,153,0.28)" : "rgba(255,77,77,0.30)",
                            color: l.is_active ? "#6bffb8" : "#ffb0b0",
                          }}
                        >
                          {l.is_active ? "ativa" : "inativa"}
                        </span>
                      </td>

                      <td style={ui.tdRight}>
                        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                          <button style={ui.btnSmall} onClick={() => resetHwid(l.key)}>
                            Reset HWID
                          </button>
                          <button style={ui.btnSmallDanger} onClick={() => deleteKey(l.key)}>
                            Deletar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div style={ui.footer}>
          <span style={{ opacity: 0.85 }}>
            Se quiser, depois a gente adiciona ativar/desativar, editar expiração e logs.
          </span>
        </div>
      </div>
    </div>
  );
}
