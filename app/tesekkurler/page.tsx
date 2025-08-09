export default function TesekkurlerPage() {
    return (
      <div style={{
        fontFamily: "'Inter', sans-serif",
        margin: 0,
        padding: 0,
        background: "#f0f4f8",
        color: "#333",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh"
      }}>
        <div style={{
          background: "#fff",
          padding: "40px",
          maxWidth: "600px",
          width: "90%",
          borderRadius: "12px",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
          textAlign: "center"
        }}>
          <h1 style={{ fontSize: "2rem", color: "#1e88e5", marginBottom: "16px" }}>
            Teşekkürler!
          </h1>
          <p style={{ fontSize: "1.1rem", marginBottom: "24px" }}>
            Vize ön başvurunuz başarıyla alınmıştır. En kısa sürede sizinle iletişime geçeceğiz.
          </p>
          <a href="/" style={{
            display: "inline-block",
            padding: "12px 24px",
            background: "#1e88e5",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "8px",
            fontWeight: 600,
            transition: "background 0.3s"
          }}>
            Ana Sayfaya Dön
          </a>
        </div>
      </div>
    );
  }
  