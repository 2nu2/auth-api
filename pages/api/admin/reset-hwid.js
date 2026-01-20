// pages/api/admin/reset-hwid.js
import { requireAdmin } from "../../../libs/adminAuth";
import { supabaseAdmin } from "../../../libs/supabaseAdmin";

export default async function handler(req, res) {
  const admin = requireAdmin(req, res);
  if (!admin) return;

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  const key = String(req.body?.key || "").trim();
  if (!key) return res.status(400).json({ ok: false, message: "key obrigatória" });

  try {
    const { data, error } = await supabaseAdmin
      .from("licenses")
      .update({ hwid: null })
      .eq("key", key)
      .select()
      .single();

    if (error) return res.status(500).json({ ok: false, message: error.message });

    return res.status(200).json({ ok: true, license: data });
  } catch (e) {
    return res.status(500).json({ ok: false, message: String(e?.message || e) });
  }
}
