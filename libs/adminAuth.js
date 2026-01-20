import { getAdminFromRequest } from "../../../libs/adminAuth";

export default async function handler(req, res) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) return res.status(200).json({ ok: false });

    return res.status(200).json({
      ok: true,
      user_name: admin.user_name,
      role: admin.role,
    });
  } catch (e) {
    return res.status(200).json({ ok: false });
  }
}
