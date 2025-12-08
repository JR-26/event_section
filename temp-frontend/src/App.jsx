import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import EventsAdminPage from "./components/EventsAdminPage";
import ManageUploads from "./components/ManageUploads";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
        
        {/* ADMIN NAVBAR */}
        <nav style={{ marginBottom: "20px", display: "flex", gap: "20px" }}>
          <Link
            to="/"
            style={{
              padding: "10px 15px",
              background: "#1e3a8a",
              color: "white",
              borderRadius: "6px",
              textDecoration: "none",
            }}
          >
            Manage Events
          </Link>

          <Link
            to="/manage-uploads"
            style={{
              padding: "10px 15px",
              background: "#1e3a8a",
              color: "white",
              borderRadius: "6px",
              textDecoration: "none",
            }}
          >
            Manage QP Uploads
          </Link>
        </nav>

        {/* ROUTES */}
        <Routes>
          <Route path="/" element={<EventsAdminPage />} />
          <Route path="/manage-uploads" element={<ManageUploads />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
