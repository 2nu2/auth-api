export default function handler(req, res) {
  res.status(200).json({
    ok: true,
    msg: "verify online",
    method: req.method,
    query: req.query,
  });
}
