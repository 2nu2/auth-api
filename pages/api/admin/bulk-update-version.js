// pages/api/admin/bulk-update-version.js
import { supabaseAdmin } from "../../../libs/supabaseAdmin";
import { getAdminFromRequest } from "../../../libs/adminAuth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  const admin = getAdminFromRequest(req);
  if (!admin) {
    return res.status(401).json({ ok: false, message: "Não autorizado" });
  }

  try {
    const { version, only_active = true } = req.body || {};
    const v = (version || "").trim();

    if (!v) {
      return res.status(400).json({ ok: false, message: "version obrigatória" });
    }

    // monta query
    let q = supabaseAdmin.from("licenses").update({ version: v });

    // filtro opcional: só keys ativas
    if (only_active) q = q.eq("is_active", true);

    // Supabase exige algum filtro em alguns setups:
    // usamos um filtro "sempre verdadeiro" baseado em id não nulo
    q = q.not("id", "is", null).select("id");

    const { data, error } = await q;

    if (error) {
      return res.status(500).json({ ok: false, message: "Erro no banco: " + error.message });
    }

    return res.status(200).json({
      ok: true,
      message: "Versão atualizada com sucesso",
      updated: data?.length || 0,
      version: v,
      only_active,
    });
  } catch (e) {
    return res.status(500).json({ ok: false, message: "Erro: " + e.message });
  }
}
