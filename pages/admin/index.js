export default function AdminPanel() {
  return (
    <div style={{
      background: "#0b0b0b",
      color: "#fff",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Arial"
    }}>
      <h1>🔐 Painel Admin</h1>

      <p>Auth API online</p>

      <a
        href="/api/verify"
        style={{
          marginTop: 20,
          color: "#00ff99"
        }}
      >
        Testar API
      </a>
    </div>
  );
}
