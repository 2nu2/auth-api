// pages/api/admin/me.js
import { getAdminFromRequest } from "../../../libs/adminAuth";

export default async function handler(req, res) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return res.status(200).json({ ok: false });

  return res.status(200).json({
    ok: true,
    user_name: admin.user_name,
    role: admin.role,
  });
}
