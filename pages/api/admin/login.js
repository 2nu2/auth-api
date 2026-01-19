// pages/api/admin/login.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { supabaseAdmin } from "../../../libs/supabaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  try {
    const { user, pass } = req.body || {};
    if (!user || !pass) {
      return res.status(400).json({ ok: false, message: "user e pass obrigatórios" });
    }

    const { data, error } = await supabaseAdmin
      .from("admins")
      .select("id,user_name,pass_hash,role,is_active")
      .eq("user_name", user)
      .limit(1)
      .maybeSingle();

    if (error) {
      return res.status(500).json({ ok: false, message: "Erro no banco: " + error.message });
    }

    if (!data || !data.is_active) {
      return res.status(401).json({ ok: false, message: "Admin inválido ou desativado" });
    }

    const okPass = await bcrypt.compare(pass, data.pass_hash);
    if (!okPass) {
      return res.status(401).json({ ok: false, message: "Senha incorreta" });
    }

    const token = jwt.sign(
      { adminId: data.id, user: data.user_name, role: data.role },
      process.env.ADMIN_JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Cookie HttpOnly (não aparece no JS do navegador)
    res.setHeader(
      "Set-Cookie",
      serialize("admin_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 dias
      })
    );

    return res.status(200).json({ ok: true, message: "Logado" });
  } catch (e) {
    return res.status(500).json({ ok: false, message: "Erro: " + e.message });
  }
}
