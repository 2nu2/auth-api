// pages/api/admin/licenses.js
import { requireAdmin } from "../../../libs/adminAuth";
import { supabaseAdmin } from "../../../libs/supabaseAdmin";

export default async function handler(req, res) {
  const admin = requireAdmin(req, res);
  if (!admin) return;

  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  try {
    const page = Math.max(1, Number(req.query?.page ?? 1));
    const limit = Math.min(200, Math.max(1, Number(req.query?.limit ?? 50)));
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabaseAdmin
      .from("licenses")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) return res.status(500).json({ ok: false, message: error.message });

    return res.status(200).json({
      ok: true,
      page,
      limit,
      total: count ?? 0,
      licenses: data ?? [],
    });
  } catch (e) {
    return res.status(500).json({ ok: false, message: String(e?.message || e) });
  }
}
