// pages/api/admin/create-key.js
import crypto from "crypto";
import { requireAdmin } from "../../../libs/adminAuth";
import { supabaseAdmin } from "../../../libs/supabaseAdmin";

function makeKey() {
  // Ex: MAL0-8F2A-19CD-77B1
  const part = () => crypto.randomBytes(2).toString("hex").toUpperCase();
  return `MAL0-${part()}${part()}-${part()}${part()}-${part()}${part()}`;
}

function addDaysIso(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export default async function handler(req, res) {
  const admin = requireAdmin(req, res);
  if (!admin) return;

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  try {
    const days = Number(req.body?.days ?? 30);
    if (!Number.isFinite(days) || days < 1 || days > 3650) {
      return res.status(400).json({ ok: false, message: "days inválido" });
    }

    // tenta algumas vezes pra evitar colisão
    for (let i = 0; i < 5; i++) {
      const key = makeKey();
      const expires_at = addDaysIso(days);

      const { data, error } = await supabaseAdmin
        .from("licenses")
        .insert({
          key,
          expires_at,
          is_active: true,
          hwid: null,
        })
        .select()
        .single();

      if (!error) {
        return res.status(200).json({ ok: true, license: data });
      }

      // se for key duplicada, tenta de novo
      if (!String(error.message || "").toLowerCase().includes("duplicate")) {
        return res.status(500).json({ ok: false, message: error.message });
      }
    }

    return res.status(500).json({ ok: false, message: "Falha ao gerar key (colisão)" });
  } catch (e) {
    return res.status(500).json({ ok: false, message: String(e?.message || e) });
  }
}
