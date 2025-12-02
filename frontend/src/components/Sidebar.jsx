import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  
  const menu = [
  { name: "Dashboard", path: "/" },
  { name: "Leaderboards", path: "/leaderboards" },
  { name: "Events", path: "/events" },
  { name: "Achievements", path: "/achievements" },
  { name: "Connect", path: "/connect" },
  { name: "Projects", path: "/projects" },
  { name: "Posts", path: "/posts" },
];

  return (
    <>
      {/* TOGGLE BUTTON (always visible & attached to left edge) */}
      <button
        onClick={toggleSidebar}
        className="
          fixed top-1/2 -translate-y-1/2 
          left-0  
          z-50
          bg-blue-900 text-white
          w-6 h-20
          flex items-center justify-center
          border-r border-blue-800
          rounded-none
          shadow-md
          hover:bg-blue-700
          transition
        "
      >
        {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
      </button>

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 
          h-full bg-white 
          border-r border-gray-200 
          p-6 pt-20 
          shadow-md 
          transition-all duration-300 
          ${isOpen ? "translate-x-0 w-64" : "-translate-x-64 w-64"}
        `}
      >
        {/* MENU */}
        <nav className="space-y-3">
          {menu.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`
                block w-full text-left px-4 py-2 
                rounded-lg 
                font-medium
                transition
                ${
                  location.pathname === item.path
                    ? "bg-blue-900 text-white"
                    : "text-blue-900 hover:bg-blue-100"
                }
              `}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Edit Profile */}
        <button
          className="
            mt-10 px-4 py-2 
            rounded-lg 
            text-blue-700 
            font-semibold 
            hover:bg-blue-100
            transition
          "
        >
          Edit Profile
        </button>
      </aside>
    </>
  );
}