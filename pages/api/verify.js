import { supabaseAdmin } from "../../lib/supabase";

function nowIso() {
  return new Date().toISOString();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { key, hwid, version } = req.body || {};

    if (!key || typeof key !== "string") {
      return res.status(400).json({ success: false, reason: "BAD_REQUEST", message: "Missing key" });
    }
    if (!hwid || typeof hwid !== "string") {
      return res.status(400).json({ success: false, reason: "BAD_REQUEST", message: "Missing hwid" });
    }
    if (!version || typeof version !== "string") {
      return res.status(400).json({ success: false, reason: "BAD_REQUEST", message: "Missing version" });
    }

    // busca a licença
    const { data: row, error } = await supabaseAdmin
      .from("licenses")
      .select("id, key, hwid, expires_at, is_active, version")
      .eq("key", key)
      .maybeSingle();

    if (error) {
      return res.status(500).json({ success: false, reason: "DB_ERROR", message: error.message });
    }
    if (!row) {
      return res.status(401).json({ success: false, reason: "KEY_NOT_FOUND", message: "Key inválida" });
    }

    if (row.is_active !== true) {
      return res.status(403).json({ success: false, reason: "KEY_DISABLED", message: "Key desativada" });
    }

    // expiração
    if (row.expires_at) {
      const exp = new Date(row.expires_at).getTime();
      if (Number.isFinite(exp) && exp < Date.now()) {
        return res.status(403).json({ success: false, reason: "EXPIRED", message: "Key expirada" });
      }
    }

    // versão mínima exigida (opção simples):
    // se você quiser forçar update, você pode comparar version != row.version
    // (ou criar uma tabela config com "min_version")
    if (row.version && row.version !== version) {
      return res.status(426).json({
        success: false,
        reason: "UPDATE_REQUIRED",
        message: "Atualização necessária",
        required_version: row.version,
      });
    }

    // HWID: se estiver vazio no banco, “trava” no primeiro uso
    if (!row.hwid) {
      const { error: upErr } = await supabaseAdmin
        .from("licenses")
        .update({ hwid, last_ip: req.headers["x-forwarded-for"]?.toString() ?? null })
        .eq("id", row.id);

      if (upErr) {
        return res.status(500).json({ success: false, reason: "DB_ERROR", message: upErr.message });
      }
    } else if (row.hwid !== hwid) {
      return res.status(403).json({
        success: false,
        reason: "HWID_MISMATCH",
        message: "HWID não confere",
      });
    } else {
      // atualiza last_ip (opcional)
      await supabaseAdmin
        .from("licenses")
        .update({ last_ip: req.headers["x-forwarded-for"]?.toString() ?? null })
        .eq("id", row.id);
    }

    return res.status(200).json({
      success: true,
      message: "OK",
      server_time: nowIso(),
      expires_at: row.expires_at ?? null,
    });
  } catch (e) {
    return res.status(500).json({ success: false, reason: "SERVER_ERROR", message: String(e?.message ?? e) });
  }
}
