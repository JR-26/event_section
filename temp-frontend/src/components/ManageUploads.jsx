import React, { useEffect, useState } from "react";

export default function ManageUploads() {
  const [uploads, setUploads] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("qpUploads");
    setUploads(saved ? JSON.parse(saved) : []);
  }, []);

  // Delete an upload
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this upload?")) return;

    const updated = uploads.filter((u) => u.id !== id);
    setUploads(updated);
    localStorage.setItem("qpUploads", JSON.stringify(updated));
  };

  return (
    <div style={{ padding: "30px", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "20px" }}>
        Manage Question Paper Uploads
      </h1>

      {uploads.length === 0 ? (
        <p>No question papers uploaded yet.</p>
      ) : (
        uploads.map((u) => (
          <div
            key={u.id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "12px",
              background: "#fafafa",
            }}
          >
            <p><strong>{u.code}</strong> — {u.subject}</p>
            <p style={{ color: "#555" }}>{u.internal}</p>
            <p style={{ fontSize: "12px", color: "#888" }}>
              Uploaded: {new Date(u.uploadedAt).toLocaleString()}
            </p>

            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
              <a
                href={u.fileUrl}
                target="_blank"
                style={{
                  padding: "6px 12px",
                  background: "green",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "5px",
                }}
              >
                View
              </a>

              <a
                href={u.fileUrl}
                download={u.fileName}
                style={{
                  padding: "6px 12px",
                  background: "#555",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "5px",
                }}
              >
                Download
              </a>

              <button
                onClick={() => handleDelete(u.id)}
                style={{
                  padding: "6px 12px",
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
