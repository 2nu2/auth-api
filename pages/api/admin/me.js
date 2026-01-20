// pages/api/admin/me.js
import jwt from "jsonwebtoken";

function parseCookies(cookieHeader = "") {
  const out = {};
  cookieHeader.split(";").forEach((part) => {
    const [k, ...v] = part.trim().split("=");
    if (!k) return;
    out[k] = decodeURIComponent(v.join("=") || "");
  });
  return out;
}

export default function handler(req, res) {
  try {
    const cookies = parseCookies(req.headers.cookie || "");
    const token = cookies.admin_token;

    if (!token) {
      return res.status(401).json({ ok: false, message: "Not logged" });
    }

    const payload = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
    return res.status(200).json({ ok: true, admin: payload });
  } catch (e) {
    return res.status(401).json({ ok: false, message: "Invalid token" });
  }
}
