import { supabaseAdmin } from "../../libs/supabaseAdmin";

function getClientIp(req) {
  const xf = req.headers["x-forwarded-for"];
  if (typeof xf === "string" && xf.length > 0) return xf.split(",")[0].trim();
  return req.socket?.remoteAddress || null;
}

function nowUtcMs() {
  return Date.now();
}

export default async function handler(req, res) {
  try {
    // healthcheck
    if (req.method === "GET") {
      return res.status(200).json({ ok: true, msg: "verify online", method: "GET", query: req.query || {} });
    }

    if (req.method !== "POST") {
      return res.status(405).json({ ok: false, message: "Method not allowed" });
    }

    const body = req.body || {};
    const key = String(body.key || "").trim();
    const hwid = String(body.hwid || "").trim();
    const version = String(body.version || "").trim();

    if (!key) return res.status(400).json({ ok: false, message: "Missing key" });
    if (!hwid) return res.status(400).json({ ok: false, message: "Missing hwid" });

    // 1) buscar licença
    const { data: lic, error: findErr } = await supabaseAdmin
      .from("licenses")
      .select("id, key, hwid, expires_at, is_active, version, last_ip")
      .eq("key", key)
      .maybeSingle();

    if (findErr) {
      return res.status(500).json({ ok: false, message: "DB error (find)", detail: findErr.message });
    }

    if (!lic) {
      return res.status(401).json({ ok: false, message: "Invalid key" });
    }

    // 2) is_active
    if (!lic.is_active) {
      return res.status(403).json({
        ok: false,
        message: "License disabled",
        expires_at: lic.expires_at,
        is_active: false,
      });
    }

    // 3) expiração
    if (lic.expires_at) {
      const exp = new Date(lic.expires_at).getTime();
      if (!Number.isNaN(exp) && nowUtcMs() > exp) {
        return res.status(403).json({
          ok: false,
          message: "License expired",
          expires_at: lic.expires_at,
          is_active: true,
        });
      }
    }

    // 4) checagem de versão (se você quiser forçar)
    // regra: se lic.version tiver valor e for diferente do client -> bloqueia (upgrade required)
    if (lic.version && version && lic.version !== version) {
      return res.status(426).json({
        ok: false,
        message: "Update required",
        version_ok: false,
        required_version: lic.version,
      });
    }

    // 5) HWID bind
    // - se hwid no banco estiver vazio/null => grava o hwid do cliente (primeiro login)
    // - se já tiver hwid => compara, se diferente bloqueia
    const dbHwid = (lic.hwid || "").trim();

    if (dbHwid && dbHwid !== hwid) {
      return res.status(403).json({
        ok: false,
        message: "HWID mismatch",
        expires_at: lic.expires_at,
        is_active: true,
      });
    }

    const ip = getClientIp(req);

    // 6) update last_ip e (se precisar) hwid
    const updatePayload = {};
    if (!dbHwid) updatePayload.hwid = hwid;
    if (ip) updatePayload.last_ip = ip;

    if (Object.keys(updatePayload).length > 0) {
      const { error: upErr } = await supabaseAdmin
        .from("licenses")
        .update(updatePayload)
        .eq("id", lic.id);

      if (upErr) {
        return res.status(500).json({ ok: false, message: "DB error (update)", detail: upErr.message });
      }
    }

    // ok
    return res.status(200).json({
      ok: true,
      message: "OK",
      expires_at: lic.expires_at,
      is_active: true,
      version_ok: true,
      // se quiser, manda também:
      // bound: !dbHwid, // true se bindou agora
    });
  } catch (e) {
    return res.status(500).json({ ok: false, message: "Internal error", detail: String(e?.message || e) });
  }
}
