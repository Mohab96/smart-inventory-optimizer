import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/features/authSlice";
import { Menu, X } from "lucide-react";
import { FaBell, FaEye, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useTheme } from "./ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };
  const notificationRef = useRef(null);
  const userDropdownRef = useRef(null);

  const [notificationCount] = useState(3);

  // Sample notifications - replace with your actual notification data
  const [recentNotifications] = useState([
    {
      id: 1,
      title: "Products Expiring Soon",
      message: "4 products are expiring within the next week",
      time: "2 hours ago",
      type: "warning",
    },
    {
      id: 2,
      title: "Low Stock Alert",
      message: "Premium Coffee Beans running low",
      time: "4 hours ago",
      type: "danger",
    },
    {
      id: 3,
      title: "High Demand Prediction",
      message: "iPhone 15 Pro demand expected to increase",
      time: "6 hours ago",
      type: "info",
    },
  ]);

  // Navigation items for desktop
  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Predictions", path: "/prediction" },
    { name: "Trends", path: "/trends" },
    { name: "Upload Transactions", path: "/transactionsFeeding" },
  ];
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "Business Analytics",
      path: "/businessAnalytics",
    },
    {
      name: "Predictions",
      path: "/prediction",
    },
    { name: "Trends", path: "/trends" },
    {
      name: "Staff Management",
      path: "/staffManagement",
    },
    {
      name: "Upload Transactions",
      path: "/transactionsFeeding",
    },
    {
      name: "Transactions Log",
      path: "/transactionsLog",
    },
    {
      name: "Add Product",
      path: "/newproductaddition",
    },
    { name: "About", path: "/about" },
  ];

  const handleNotificationClick = () => {
    navigate("/notifications");
    setShowNotificationDropdown(false);
  };

  const toggleNotificationDropdown = () => {
    setShowNotificationDropdown(!showNotificationDropdown);
    setShowUserDropdown(false);
  };

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
    setShowNotificationDropdown(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotificationDropdown(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <nav className="px-4 lg:px-6 py-3">
        <div className="flex justify-between items-center px-4">
          {/* Logo Section */}
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <img
              src="/src/assets/images/darklogo.png"
              className="mr-3 h-8 sm:h-10"
              alt="Smart Inventory Logo"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white">
                Smart Inventory
              </span>
              <span className="text-xs text-gray-400 -mt-1">
                Management System
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className="text-gray-700 dark:text-gray-300 hover:text-gray-500 font-medium text-md transition-colors"
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Fixed Top Right Actions */}
          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={toggleNotificationDropdown}
                className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Notifications"
              >
                <FaBell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {notificationCount > 9 ? "9+" : notificationCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotificationDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Notifications
                      </h3>
                      <button
                        onClick={handleNotificationClick}
                        className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 text-sm font-medium flex items-center gap-1"
                      >
                        <FaEye className="w-3 h-3" />
                        View All
                      </button>
                    </div>
                  </div>

                  <div className="max-h-64 overflow-y-auto">
                    {recentNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="p-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                        onClick={handleNotificationClick}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                              notification.type === "warning"
                                ? "bg-yellow-500"
                                : notification.type === "danger"
                                ? "bg-red-500"
                                : "bg-blue-500"
                            }`}
                          ></div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                              {notification.title}
                            </h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle Button */}
            <ThemeToggleButton />

            {/* User Menu */}
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={toggleUserDropdown}
                className="flex items-center gap-2 p-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                title="User Menu"
              >
                <FaUser className="w-4 h-4" />
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* User Dropdown */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <div className="py-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                      <FaSignOutAlt className="w-4 h-4" />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center p-2 ml-2 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 transition-colors"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } lg:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700`}
        >
          <ul className="flex flex-col space-y-2 mt-4">
            {menuItems.map((item) => (
              <li key={item.name}>
                <button
                  className="block w-full p-3 text-left rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => {
                    navigate(item.path);
                    setIsMenuOpen(false);
                  }}
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}

// Theme toggle button component
function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      title="Toggle light/dark mode"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-gray-700" />
      )}
    </button>
  );
}
