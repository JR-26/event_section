// Updated file: frontend/src/App.jsx
// (Only adding the import and route for PostsPage; no other changes)

import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import EventsPage from "./pages/EventsPage";
import PostsPage from "./pages/PostsPage"; // Added import
import "./index.css";

// Dashboard/Home Page Component
function DashboardPage() {
  return (
    <>
      {/* HEADER SECTION */}
      <section className="bg-white p-10 rounded-2xl shadow-md border border-gray-200">
        <h1 className="text-4xl font-extrabold text-blue-900 mb-4">
          Welcome to the Department of AI and DS
        </h1>
        <p className="text-gray-600 leading-relaxed max-w-3xl mb-10">
          Our mission is to foster innovation and excellence in Artificial
          Intelligence and Data Science through cutting-edge research,
          industry collaboration, and a dynamic learning environment.
        </p>
        {/* STATS */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          {[
            { label: "Ongoing Projects", value: "50+" },
            { label: "Faculty Members", value: "12" },
            { label: "Active Students", value: "300+" },
            { label: "Research Lab", value: "1" },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-[#eef4ff] p-6 rounded-xl shadow-sm border border-blue-100 text-center"
            >
              <div className="text-3xl font-bold text-blue-900">
                {item.value}
              </div>
              <p className="text-blue-700 mt-1 text-sm">{item.label}</p>
            </div>
          ))}
        </div>
        {/* BUTTON ROW */}
        <div className="flex space-x-4">
          {[
            "Current Enigma Leaderboard",
            "View Genesys Winners",
            "Search Mentors",
          ].map((btn) => (
            <button
              key={btn}
              className="bg-blue-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition"
            >
              {btn}
            </button>
          ))}
        </div>
      </section>
      {/* RECENT UPDATES */}
      <section className="bg-white mt-12 p-8 rounded-2xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-blue-900">
          Recent Updates
        </h2>
        <div className="space-y-4">
          {[
            { title: "Need Volunteers for Yukta2k26", time: "1 day ago" },
            { title: "Enigma Contest results out", time: "2 day ago" },
            { title: "50+ students placed in final year", time: "5 day ago" },
          ].map((u) => (
            <div key={u.title} className="pb-3 border-b">
              <p className="text-blue-900 font-medium">{u.title}</p>
              <p className="text-gray-500 text-sm">{u.time}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

// Placeholder components for other pages
function LeaderboardsPage() {
  return (
    <div className="bg-white p-10 rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-3xl font-bold text-blue-900 mb-4">Leaderboards</h2>
      <p className="text-gray-600">Leaderboards content coming soon...</p>
    </div>
  );
}

function AchievementsPage() {
  return (
    <div className="bg-white p-10 rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-3xl font-bold text-blue-900 mb-4">Achievements</h2>
      <p className="text-gray-600">Achievements content coming soon...</p>
    </div>
  );
}

function ConnectPage() {
  return (
    <div className="bg-white p-10 rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-3xl font-bold text-blue-900 mb-4">Connect</h2>
      <p className="text-gray-600">Connect content coming soon...</p>
    </div>
  );
}

function ProjectsPage() {
  return (
    <div className="bg-white p-10 rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-3xl font-bold text-blue-900 mb-4">Projects</h2>
      <p className="text-gray-600">Projects content coming soon...</p>
    </div>
  );
}

// Removed the duplicate PostsPage function placeholder

export default function App() {
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <BrowserRouter>
      <div className="h-screen bg-[#f5f7fb] font-sans overflow-hidden flex relative">
        {/* SIDEBAR */}
        <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
        
        {/* MAIN AREA */}
        <div
          className={`
            flex-1 flex flex-col overflow-hidden transition-all duration-300
            ${isOpen ? "ml-64" : "ml-0"}
          `}
        >
          {/* NAVBAR */}
          <Navbar />
          
          {/* PAGE CONTENT */}
          <main className="flex-1 overflow-y-auto p-10">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/leaderboards" element={<LeaderboardsPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/achievements" element={<AchievementsPage />} />
              <Route path="/connect" element={<ConnectPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/posts" element={<PostsPage />} /> {/* Added route */}
            </Routes>

          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}