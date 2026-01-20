// libs/adminAuth.js
import jwt from "jsonwebtoken";
import { parse } from "cookie";
import { supabaseAdmin } from "./supabaseAdmin";

// lê e valida o cookie "admin_token"
export async function getAdminFromRequest(req) {
  try {
    const cookies = parse(req.headers.cookie || "");
    const token = cookies.admin_token;
    if (!token) return null;

    const payload = jwt.verify(token, process.env.ADMIN_JWT_SECRET);

    // payload: { adminId, user, role, iat, exp }
    // valida no banco (e confere se está ativo)
    const { data, error } = await supabaseAdmin
      .from("admins")
      .select("id,user_name,role,is_active")
      .eq("id", payload.adminId)
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;
    if (!data.is_active) return null;

    return {
      id: data.id,
      user_name: data.user_name,
      role: data.role,
    };
  } catch {
    return null;
  }
}

// helper pra proteger endpoints
export async function requireAdmin(req, res, roles = null) {
  const admin = await getAdminFromRequest(req);
  if (!admin) {
    res.status(401).json({ ok: false, message: "Não autenticado" });
    return null;
  }

  if (Array.isArray(roles) && roles.length > 0) {
    if (!roles.includes(admin.role)) {
      res.status(403).json({ ok: false, message: "Sem permissão" });
      return null;
    }
  }

  return admin;
}
