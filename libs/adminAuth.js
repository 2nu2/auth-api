// libs/adminAuth.js
import jwt from "jsonwebtoken";
import cookie from "cookie";

export function requireAdmin(req, res) {
  try {
    const cookies = cookie.parse(req.headers.cookie || "");
    const token = cookies.admin_token;

    if (!token) {
      res.status(401).json({ ok: false, message: "Not logged" });
      return null;
    }

    const payload = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
    if (!payload?.user) {
      res.status(401).json({ ok: false, message: "Invalid token" });
      return null;
    }

    return payload; // { user, role, ... }
  } catch (e) {
    res.status(401).json({ ok: false, message: "Invalid token" });
    return null;
  }
}
