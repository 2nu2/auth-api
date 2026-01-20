// pages/admin/index.js
import { useEffect, useMemo, useState } from "react";

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(1000px 500px at 20% 0%, #151515 0%, #0b0b0b 55%, #070707 100%)",
    color: "#fff",
    fontFamily: "Arial, sans-serif",
    padding: 22,
  },
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 14,
    marginBottom: 16,
  },
  title: { fontSize: 22, fontWeight: 800, letterSpacing: 0.2 },
  sub: { marginTop: 4, color: "#b5b5b5", fontSize: 13 },
  toast: {
    position: "fixed",
    right: 18,
    top: 18,
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
    zIndex: 9999,
    maxWidth: 520,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14,
  },
  card: {
    background: "rgba(16,16,16,0.85)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 16,
    padding: 16,
    boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
  },
  cardTitle: { fontSize: 16, fontWeight: 800, marginBottom: 6 },
  cardDesc: { color: "#b5b5b5", fontSize: 13, marginBottom: 12 },
  row: { display: "flex", gap: 10, alignItems: "center", marginTop: 10 },
  label: { width: 70, color: "#d0d0d0", fontSize: 13 },
  input: {
    flex: 1,
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.10)",
    outline: "none",
    background: "#0e0e0e",
    color: "#fff",
  },
  select: {
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "#0e0e0e",
    color: "#fff",
    outline: "none",
  },
  btnPrimary: {
    marginTop: 12,
    width: "100%",
    padding: "11px 12px",
    borderRadius: 12,
    border: "1px solid rgba(0,255,153,0.25)",
    background: "linear-gradient(180deg, rgba(0,255,153,0.20), rgba(0,255,153,0.10))",
    color: "#6bffb8",
    fontWeight: 800,
    cursor: "pointer",
  },
  btnGhost: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    color: "#e6e6e6",
    cursor: "pointer",
  },
  btnDangerLink: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,77,77,0.25)",
    background: "linear-gradient(180deg, rgba(255,77,77,0.18), rgba(255,77,77,0.08))",
    color: "#ff9a9a",
    fontWeight: 800,
    textDecoration: "none",
    display: "inline-block",
  },
  tableWrap: {
    marginTop: 10,
    overflow: "auto",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.06)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: 860,
    background: "rgba(10,10,10,0.6)",
  },
  th: {
    textAlign: "left",
    fontSize: 12,
    color: "#bdbdbd",
    padding: "12px 12px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    background: "rgba(255,255,255,0.03)",
  },
  thRight: {
    textAlign: "right",
    fontSize: 12,
    color: "#bdbdbd",
    padding: "12px 12px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    background: "rgba(255,255,255,0.03)",
  },
  tr: { borderBottom: "1px solid rgba(255,255,255,0.05)" },
  td: { padding: "12px 12px", fontSize: 13, color: "#dedede", verticalAlign: "middle" },
  tdMono: {
    padding: "12px 12px",
    fontSize: 13,
    color: "#dedede",
    fontFamily: "Consolas, monospace",
    verticalAlign: "middle",
  },
  tdRight: { padding: "12px 12px", fontSize: 13, color: "#dedede", textAlign: "right" },
  empty: { padding: 18, textAlign: "center", color: "#9b9b9b" },
  pill: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 0.2,
  },
  badgeBtn: {
    padding: "5px 8px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    color: "#d8d8d8",
    cursor: "pointer",
    fontSize: 12,
  },
  btnSmall: {
    padding: "8px 10px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    color: "#e6e6e6",
    cursor: "pointer",
    fontWeight: 700,
  },
  btnSmallDanger: {
    padding: "8px 10px",
    borderRadius: 12,
    border: "1px solid rgba(255,77,77,0.25)",
    background: "rgba(255,77,77,0.08)",
    color: "#ff9a9a",
    cursor: "pointer",
    fontWeight: 800,
  },
  footer: { marginTop: 14, color: "#b5b5b5", fontSize: 12, textAlign: "center" },
};

export default function AdminPanel() {
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  // gerar key
  const [days, setDays] = useState(30);

  // paginação / listagem
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);

  // filtros
  const [query, setQuery] = useState("");
  const [onlyActive, setOnlyActive] = useState(false);

  // bulk update version
  const [bulkVersion, setBulkVersion] = useState("1.0");
  const [bulkOnlyActive, setBulkOnlyActive] = useState(true);
  const [bulkMsg, setBulkMsg] = useState("");

  const [data, setData] = useState({ total: 0, licenses: [] });
  const [toast, setToast] = useState(null); // { type: "ok"|"err", msg: string }

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
    <div style={styles.page}>
      {/* Top bar */}
      <div style={styles.topbar}>
        <div>
          <div style={styles.title}>🔐 Painel Admin</div>
          <div style={styles.sub}>Gerenciar licenças (Supabase + Vercel)</div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            style={styles.btnGhost}
            onClick={() => loadLicenses()}
            disabled={loading}
            title="Recarregar"
          >
            {loading ? "Carregando..." : "Recarregar"}
          </button>

          <a href="/api/admin/logout" style={styles.btnDangerLink}>
            Sair
          </a>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          style={{
            ...styles.toast,
            borderColor: toast.type === "ok" ? "#2dff9a55" : "#ff4d4d55",
            background: toast.type === "ok" ? "#0e1a14" : "#1a0e0e",
          }}
        >
          <span style={{ opacity: 0.9 }}>
            {toast.type === "ok" ? "✅ " : "❌ "}
            {toast.msg}
          </span>
        </div>
      )}

      {/* Cards */}
      <div style={styles.grid}>
        {/* Create */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>Gerar Key</div>
          <div style={styles.cardDesc}>Cria uma key nova com expiração em X dias.</div>

          <div style={styles.row}>
            <label style={styles.label}>Dias</label>
            <input
              style={styles.input}
              type="number"
              value={days}
              min={1}
              max={3650}
              onChange={(e) => setDays(e.target.value)}
            />
          </div>

          <button
            style={{
              ...styles.btnPrimary,
              opacity: creating ? 0.7 : 1,
              cursor: creating ? "not-allowed" : "pointer",
            }}
            onClick={createKey}
            disabled={creating}
          >
            {creating ? "Gerando..." : "Gerar key"}
          </button>

          <div style={{ marginTop: 10, color: "#8a8a8a", fontSize: 12 }}>
            Dica: depois dá “copiar” na tabela.
          </div>
        </div>

        {/* Bulk Update Version */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>Forçar Update (versão)</div>
          <div style={styles.cardDesc}>Atualiza a versão exigida para todas as keys.</div>

          <div style={styles.row}>
            <label style={styles.label}>Versão</label>
            <input
              style={styles.input}
              placeholder="ex: 1.1"
              value={bulkVersion}
              onChange={(e) => setBulkVersion(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 10 }}>
            <label style={{ display: "flex", gap: 8, alignItems: "center", color: "#cfcfcf" }}>
              <input
                type="checkbox"
                checked={bulkOnlyActive}
                onChange={(e) => setBulkOnlyActive(e.target.checked)}
              />
              Atualizar só ativas
            </label>
          </div>

          <button style={styles.btnPrimary} onClick={bulkUpdateVersion}>
            Atualizar versão de todas
          </button>

          {bulkMsg && (
            <div style={{ marginTop: 10, color: "#bdbdbd", fontSize: 12 }}>{bulkMsg}</div>
          )}
        </div>

        {/* Filters */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>Filtros</div>
          <div style={styles.cardDesc}>Pesquise por key ou HWID.</div>

          <div style={styles.row}>
            <label style={styles.label}>Busca</label>
            <input
              style={styles.input}
              placeholder="ex: MAL0-.... ou HWID"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 10 }}>
            <label style={{ display: "flex", gap: 8, alignItems: "center", color: "#cfcfcf" }}>
              <input
                type="checkbox"
                checked={onlyActive}
                onChange={(e) => setOnlyActive(e.target.checked)}
              />
              Mostrar só ativas
            </label>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ color: "#bdbdbd", fontSize: 12 }}>Por página</span>
              <select
                style={styles.select}
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

            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <button
                style={styles.btnGhost}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                ◀
              </button>
              <div style={{ color: "#bdbdbd", fontSize: 12, paddingTop: 8 }}>
                Página {page} / {totalPages}
              </div>
              <button
                style={styles.btnGhost}
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
      <div style={{ ...styles.card, marginTop: 14 }}>
        <div style={styles.cardTitle}>Licenças</div>
        <div style={styles.cardDesc}>
          Total no banco: <b style={{ color: "#fff" }}>{data.total || 0}</b> — exibindo{" "}
          <b style={{ color: "#fff" }}>{filteredLicenses.length}</b> após filtros.
        </div>

        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Key</th>
                <th style={styles.th}>HWID</th>
                <th style={styles.th}>Expira</th>
                <th style={styles.th}>Ativa</th>
                <th style={styles.thRight}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredLicenses.length === 0 ? (
                <tr>
                  <td colSpan={5} style={styles.empty}>
                    {loading ? "Carregando..." : "Nenhuma licença encontrada."}
                  </td>
                </tr>
              ) : (
                filteredLicenses.map((l) => (
                  <tr key={l.key} style={styles.tr}>
                    <td style={styles.tdMono}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ color: "#eaeaea" }}>{l.key}</span>
                        <button style={styles.badgeBtn} onClick={() => copy(l.key)}>
                          copiar
                        </button>
                      </div>
                    </td>

                    <td style={styles.td}>
                      <span style={{ color: l.hwid ? "#d8d8d8" : "#6f6f6f" }}>
                        {l.hwid || "—"}
                      </span>
                    </td>

                    <td style={styles.td}>{fmtDate(l.expires_at)}</td>

                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.pill,
                          background: l.is_active ? "#0e2a1c" : "#2a0e0e",
                          borderColor: l.is_active ? "#2dff9a55" : "#ff4d4d55",
                          color: l.is_active ? "#6bffb8" : "#ff9a9a",
                        }}
                      >
                        {l.is_active ? "ativa" : "inativa"}
                      </span>
                    </td>

                    <td style={styles.tdRight}>
                      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <button style={styles.btnSmall} onClick={() => resetHwid(l.key)}>
                          Reset HWID
                        </button>
                        <button style={styles.btnSmallDanger} onClick={() => deleteKey(l.key)}>
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

      <div style={styles.footer}>
        <span style={{ opacity: 0.7 }}>
          Se quiser, depois a gente adiciona ativar/desativar, editar expiração e logs.
        </span>
      </div>
    </div>
  );
}
