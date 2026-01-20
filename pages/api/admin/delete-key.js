// pages/api/admin/delete-key.js
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
    const { error } = await supabaseAdmin.from("licenses").delete().eq("key", key);
    if (error) return res.status(500).json({ ok: false, message: error.message });

    return res.status(200).json({ ok: true, message: "Deletado" });
  } catch (e) {
    return res.status(500).json({ ok: false, message: String(e?.message || e) });
  }
}
