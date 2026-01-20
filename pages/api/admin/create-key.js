// pages/api/admin/create-key.js
import { supabaseAdmin } from "../../../libs/supabaseAdmin";
import { getAdminFromRequest } from "../../../libs/adminAuth";

function randomBlock(len = 4) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sem O/0/I/1 pra evitar confusão
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function generateKey() {
  return `mal0-${randomBlock(4)}-${randomBlock(4)}`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  // valida admin logado via cookie JWT
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return res.status(401).json({ ok: false, message: "Não autorizado" });
  }

  try {
    const body = req.body || {};
    const days = Number.isFinite(+body.days) ? Math.max(0, parseInt(body.days, 10)) : 30;
    const version = typeof body.version === "string" && body.version.trim() ? body.version.trim() : "1.0";
    const is_active = body.is_active === false ? false : true;

    // expiração
    const expires_at = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

    // tenta gerar key única (retries)
    let newKey = null;
    for (let attempt = 0; attempt < 10; attempt++) {
      const candidate = generateKey();

      // check rápido (por causa do UNIQUE, mas isso dá uma msg mais amigável)
      const { data: exists } = await supabaseAdmin
        .from("licenses")
        .select("id")
        .eq("key", candidate)
        .maybeSingle();

      if (!exists) {
        newKey = candidate;
        break;
      }
    }

    if (!newKey) {
      return res.status(500).json({ ok: false, message: "Falha ao gerar key (colisão). Tente novamente." });
    }

    const { data, error } = await supabaseAdmin
      .from("licenses")
      .insert([
        {
          key: newKey,
          hwid: null,
          expires_at,
          is_active,
          version,
          last_ip: null,
        },
      ])
      .select("*")
      .maybeSingle();

    if (error) {
      return res.status(500).json({ ok: false, message: "Erro ao inserir: " + error.message });
    }

    return res.status(200).json({
      ok: true,
      message: "Key criada",
      key: data.key,
      expires_at: data.expires_at,
      is_active: data.is_active,
      version: data.version,
    });
  } catch (e) {
    return res.status(500).json({ ok: false, message: "Erro: " + e.message });
  }
}
