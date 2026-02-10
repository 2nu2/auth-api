import { useEffect, useMemo, useState } from "react";

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
      <div style={ui.overlay} />

      {/* “modal app” */}
      <div style={ui.modal}>
        {/* top right close */}
        <a href="/api/admin/logout" style={ui.close} title="Sair">
          ×
        </a>

        {/* header */}
        <div style={ui.header}>
          <div>
            <div style={ui.title}>admin panel</div>
            <div style={ui.sub}>
              keys: <b style={{ color: "rgba(255,255,255,0.9)" }}>{data.total || 0}</b> • página{" "}
              <b style={{ color: "rgba(255,255,255,0.9)" }}>{page}</b>/{totalPages}
            </div>
          </div>

          <div style={ui.headerBtns}>
            <button style={ui.btnFlat} onClick={() => loadLicenses()} disabled={loading}>
              {loading ? "loading..." : "reload"}
            </button>
            <a href="/api/admin/logout" style={ui.btnFlatDanger}>
              logout
            </a>
          </div>
        </div>

        {/* toast */}
        {toast && (
          <div
            style={{
              ...ui.toast,
              borderColor:
                toast.type === "ok" ? "rgba(150,190,255,0.35)" : "rgba(255,80,80,0.30)",
              background:
                toast.type === "ok" ? "rgba(15,20,28,0.90)" : "rgba(20,12,12,0.90)",
            }}
          >
            {toast.type === "ok" ? "✅ " : "❌ "}
            {toast.msg}
          </div>
        )}

        {/* content */}
        <div style={ui.content}>
          {/* left: actions */}
          <div style={ui.leftCol}>
            <div style={ui.block}>
              <div style={ui.blockTitle}>generate key</div>
              <div style={ui.blockSub}>create a new license expiring in X days</div>

              <div style={ui.row}>
                <div style={ui.label}>days</div>
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
                  ...ui.btnBlue,
                  opacity: creating ? 0.75 : 1,
                  cursor: creating ? "not-allowed" : "pointer",
                }}
                onClick={createKey}
                disabled={creating}
              >
                {creating ? "authorizing..." : "authorize"}
              </button>
            </div>

            <div style={ui.block}>
              <div style={ui.blockTitle}>force update</div>
              <div style={ui.blockSub}>set required version for licenses</div>

              <div style={ui.row}>
                <div style={ui.label}>version</div>
                <input
                  style={ui.input}
                  value={bulkVersion}
                  onChange={(e) => setBulkVersion(e.target.value)}
                  placeholder="ex: 1.1"
                />
              </div>

              <label style={ui.checkRow}>
                <input
                  type="checkbox"
                  checked={bulkOnlyActive}
                  onChange={(e) => setBulkOnlyActive(e.target.checked)}
                />
                <span>only active</span>
              </label>

              <button style={ui.btnBlue} onClick={bulkUpdateVersion}>
                authorize
              </button>

              {bulkMsg ? <div style={ui.msg}>{bulkMsg}</div> : null}
            </div>

            <div style={ui.block}>
              <div style={ui.blockTitle}>filters</div>
              <div style={ui.blockSub}>search by key or hwid</div>

              <div style={ui.row}>
                <div style={ui.label}>search</div>
                <input
                  style={ui.input}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="key / hwid"
                />
              </div>

              <label style={ui.checkRow}>
                <input
                  type="checkbox"
                  checked={onlyActive}
                  onChange={(e) => setOnlyActive(e.target.checked)}
                />
                <span>only active</span>
              </label>

              <div style={ui.rowSplit}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={ui.miniLabel}>per page</span>
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

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <button
                    style={ui.btnMini}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                  >
                    ◀
                  </button>
                  <span style={ui.miniLabel}>
                    {page} / {totalPages}
                  </span>
                  <button
                    style={ui.btnMini}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                  >
                    ▶
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* right: table */}
          <div style={ui.rightCol}>
            <div style={ui.tableShell}>
              <div style={ui.tableHeader}>
                <div style={ui.tableTitle}>licenses</div>
                <div style={ui.tableSub}>
                  showing <b style={{ color: "rgba(255,255,255,0.9)" }}>{filteredLicenses.length}</b>
                </div>
              </div>

              <div style={ui.tableWrap}>
                <table style={ui.table}>
                  <thead>
                    <tr>
                      <th style={ui.th}>key</th>
                      <th style={ui.th}>hwid</th>
                      <th style={ui.th}>expires</th>
                      <th style={ui.th}>active</th>
                      <th style={ui.thRight}>actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLicenses.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={ui.empty}>
                          {loading ? "loading..." : "no licenses"}
                        </td>
                      </tr>
                    ) : (
                      filteredLicenses.map((l, i) => (
                        <tr
                          key={l.key}
                          style={{
                            ...ui.tr,
                            background: i % 2 ? "rgba(255,255,255,0.015)" : "transparent",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(120,170,255,0.06)")}
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = i % 2 ? "rgba(255,255,255,0.015)" : "transparent")
                          }
                        >
                          <td style={ui.tdMono}>
                            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                              <span>{l.key}</span>
                              <button style={ui.badge} onClick={() => copy(l.key)}>
                                copy
                              </button>
                            </div>
                          </td>

                          <td style={ui.td}>{l.hwid || "—"}</td>
                          <td style={ui.td}>{fmtDate(l.expires_at)}</td>

                          <td style={ui.td}>
                            <span
                              style={{
                                ...ui.pill,
                                borderColor: l.is_active ? "rgba(150,190,255,0.35)" : "rgba(255,80,80,0.28)",
                                background: l.is_active ? "rgba(120,170,255,0.10)" : "rgba(255,80,80,0.08)",
                                color: l.is_active ? "rgba(190,220,255,0.95)" : "rgba(255,190,190,0.95)",
                              }}
                            >
                              {l.is_active ? "active" : "inactive"}
                            </span>
                          </td>

                          <td style={ui.tdRight}>
                            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                              <button style={ui.btnRow} onClick={() => resetHwid(l.key)}>
                                reset
                              </button>
                              <button style={ui.btnRowDanger} onClick={() => deleteKey(l.key)}>
                                delete
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
          </div>
        </div>

        <div style={ui.footer}>
          tip: keep it simple • blur • flat buttons • “authorize” vibe
        </div>
      </div>
    </div>
  );
}

const ui = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #0b0c0f 0%, #08090c 100%)",
    display: "grid",
    placeItems: "center",
    padding: 18,
    fontFamily: "Arial, sans-serif",
    position: "relative",
    overflow: "hidden",
    color: "#fff",
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
    width: "min(1200px, 96vw)",
    height: "min(760px, 88vh)",
    borderRadius: 14,
    background: "rgba(16,16,18,0.72)",
    border: "1px solid rgba(255,255,255,0.10)",
    boxShadow: "0 30px 90px rgba(0,0,0,0.65)",
    position: "relative",
    zIndex: 2,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },

  close: {
    position: "absolute",
    right: 10,
    top: 6,
    width: 34,
    height: 34,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.03)",
    color: "rgba(255,255,255,0.65)",
    fontSize: 22,
    lineHeight: "34px",
    textAlign: "center",
    textDecoration: "none",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    padding: "14px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(0,0,0,0.20)",
    backdropFilter: "blur(6px)",
  },
  title: {
    fontSize: 16,
    fontWeight: 700,
    letterSpacing: 0.2,
    textTransform: "lowercase",
    color: "rgba(255,255,255,0.92)",
  },
  sub: {
    marginTop: 4,
    fontSize: 12,
    color: "rgba(255,255,255,0.55)",
  },
  headerBtns: { display: "flex", gap: 10, alignItems: "center" },

  btnFlat: {
    height: 36,
    padding: "0 12px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    color: "rgba(255,255,255,0.85)",
    cursor: "pointer",
  },
  btnFlatDanger: {
    height: 36,
    padding: "0 12px",
    borderRadius: 8,
    border: "1px solid rgba(255,80,80,0.25)",
    background: "rgba(255,80,80,0.08)",
    color: "rgba(255,190,190,0.95)",
    textDecoration: "none",
    display: "grid",
    placeItems: "center",
    fontWeight: 600,
  },

  toast: {
    position: "fixed",
    right: 18,
    top: 18,
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.10)",
    boxShadow: "0 14px 45px rgba(0,0,0,0.55)",
    zIndex: 9999,
    maxWidth: 520,
    backdropFilter: "blur(10px)",
    color: "rgba(255,255,255,0.9)",
  },

  content: {
    display: "grid",
    gridTemplateColumns: "380px 1fr",
    gap: 14,
    padding: 14,
    height: "100%",
    overflow: "hidden",
  },

  leftCol: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    overflow: "auto",
    paddingRight: 4,
  },
  rightCol: { overflow: "hidden" },

  block: {
    background: "rgba(10, 24, 40, 0.45)",
    border: "1px solid rgba(120,170,255,0.10)",
    borderRadius: 6,
    padding: 14,
    boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.25)",
  },
  blockTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: "rgba(255,255,255,0.90)",
    textTransform: "lowercase",
  },
  blockSub: {
    marginTop: 4,
    fontSize: 12,
    color: "rgba(255,255,255,0.55)",
  },

  row: { display: "flex", gap: 10, alignItems: "center", marginTop: 12 },
  label: { width: 70, fontSize: 12, color: "rgba(255,255,255,0.55)" },

  input: {
    flex: 1,
    height: 38,
    borderRadius: 6,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(0,0,0,0.35)",
    outline: "none",
    color: "rgba(255,255,255,0.88)",
    padding: "0 10px",
  },

  checkRow: {
    marginTop: 10,
    display: "flex",
    gap: 10,
    alignItems: "center",
    color: "rgba(255,255,255,0.70)",
    fontSize: 12,
  },

  btnBlue: {
    marginTop: 12,
    height: 44,
    width: "100%",
    borderRadius: 2,
    border: "1px solid rgba(150,190,255,0.35)",
    background: "rgba(130, 175, 240, 0.85)",
    color: "rgba(255,255,255,0.92)",
    fontSize: 16,
    fontWeight: 500,
    letterSpacing: 0.2,
    cursor: "pointer",
  },

  msg: {
    marginTop: 10,
    fontSize: 12,
    color: "rgba(255,255,255,0.70)",
  },

  rowSplit: {
    marginTop: 12,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  miniLabel: { fontSize: 12, color: "rgba(255,255,255,0.55)" },
  select: {
    height: 34,
    borderRadius: 6,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(0,0,0,0.35)",
    color: "rgba(255,255,255,0.85)",
    outline: "none",
    padding: "0 8px",
  },
  btnMini: {
    height: 34,
    width: 36,
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    color: "rgba(255,255,255,0.85)",
    cursor: "pointer",
  },

  tableShell: {
    height: "100%",
    background: "rgba(10, 24, 40, 0.45)",
    border: "1px solid rgba(120,170,255,0.10)",
    borderRadius: 6,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  tableHeader: {
    padding: "12px 14px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(0,0,0,0.22)",
  },
  tableTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: "rgba(255,255,255,0.90)",
    textTransform: "lowercase",
  },
  tableSub: {
    marginTop: 4,
    fontSize: 12,
    color: "rgba(255,255,255,0.55)",
  },

  tableWrap: { overflow: "auto", height: "100%" },
  table: { width: "100%", borderCollapse: "collapse", minWidth: 860 },

  th: {
    position: "sticky",
    top: 0,
    textAlign: "left",
    fontSize: 12,
    color: "rgba(255,255,255,0.60)",
    padding: "10px 12px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(0,0,0,0.45)",
    backdropFilter: "blur(6px)",
    zIndex: 2,
    textTransform: "lowercase",
  },
  thRight: { position: "sticky", top: 0, textAlign: "right", ...this?.th },

  tr: { borderBottom: "1px solid rgba(255,255,255,0.06)" },
  td: { padding: "10px 12px", fontSize: 13, color: "rgba(255,255,255,0.82)", verticalAlign: "middle" },
  tdMono: {
    padding: "10px 12px",
    fontSize: 13,
    color: "rgba(255,255,255,0.86)",
    fontFamily: "Consolas, monospace",
    verticalAlign: "middle",
  },
  tdRight: { padding: "10px 12px", fontSize: 13, color: "rgba(255,255,255,0.82)", textAlign: "right" },
  empty: { padding: 18, textAlign: "center", color: "rgba(255,255,255,0.55)" },

  badge: {
    padding: "5px 9px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    color: "rgba(255,255,255,0.82)",
    cursor: "pointer",
    fontSize: 12,
  },

  btnRow: {
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    color: "rgba(255,255,255,0.85)",
    cursor: "pointer",
    fontWeight: 600,
  },
  btnRowDanger: {
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid rgba(255,80,80,0.25)",
    background: "rgba(255,80,80,0.08)",
    color: "rgba(255,190,190,0.95)",
    cursor: "pointer",
    fontWeight: 700,
  },

  pill: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.12)",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 0.2,
    textTransform: "lowercase",
  },

  footer: {
    padding: "10px 14px",
    borderTop: "1px solid rgba(255,255,255,0.08)",
    color: "rgba(255,255,255,0.45)",
    fontSize: 12,
    textAlign: "center",
    background: "rgba(0,0,0,0.18)",
  },
};
