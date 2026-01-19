import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET" && req.method !== "POST") {
      return res.status(405).json({ ok: false, error: "Method not allowed" });
    }

    const key = (req.query.key || req.body?.key || "").toString().trim();
    const hwid = (req.query.hwid || req.body?.hwid || "").toString().trim();

    if (!key) return res.status(400).json({ ok: false, error: "Missing key" });

    const url = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey) {
      return res.status(500).json({
        ok: false,
        error: "Missing env (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)",
      });
    }

    const supabase = createClient(url, serviceKey);

    const { data, error } = await supabase
      .from("licenses")
      .select("key, hwid, expires_at, is_active, version")
      .eq("key", key)
      .maybeSingle();

    if (error) return res.status(500).json({ ok: false, error: error.message });
    if (!data) return res.status(404).json({ ok: false, error: "Key not found" });

    if (data.is_active === false) {
      return res.status(403).json({ ok: false, error: "Key inactive" });
    }

    if (data.expires_at) {
      const exp = new Date(data.expires_at).getTime();
      if (!Number.isNaN(exp) && Date.now() > exp) {
        return res.status(403).json({ ok: false, error: "Key expired" });
      }
    }

    // HWID: se já tem hwid salvo, tem que bater; se não tem, “trava” na primeira vez
    if (hwid) {
      if (data.hwid && data.hwid.length > 0 && data.hwid !== hwid) {
        return res.status(403).json({ ok: false, error: "HWID mismatch" });
      }

      if (!data.hwid || data.hwid.length === 0) {
        const up = await supabase.from("licenses").update({ hwid }).eq("key", key);
        if (up.error) return res.status(500).json({ ok: false, error: up.error.message });
      }
    }

    return res.status(200).json({ ok: true, license: data });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e) });
  }
}
