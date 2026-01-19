// pages/api/admin/logout.js
import { serialize } from "cookie";

export default function handler(req, res) {
  res.setHeader(
    "Set-Cookie",
    serialize("admin_token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    })
  );
  res.status(200).json({ ok: true });
}
