import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/features/authSlice";
import { LogOut, Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="bg-gray-900 border-b border-gray-700 shadow-lg">
      <nav className="px-4 lg:px-6 py-3">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          {/* Logo and Brand */}
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200"
          >
            <img
              src="../../../src/assets/images/Darklogo.png"
              className="h-8 sm:h-10"
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

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3 lg:order-2">
            <button
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-800 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </button>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center p-2 text-sm text-gray-400 rounded-lg lg:hidden hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 transition-all duration-200"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Navigation Menu */}
          <div
            className={`${
              isMenuOpen ? "block" : "hidden"
            } lg:flex lg:w-auto lg:order-1 w-full lg:w-auto`}
          >
            <ul className="flex flex-col mt-4 lg:flex-row lg:space-x-1 lg:mt-0 bg-gray-800 lg:bg-transparent rounded-lg lg:rounded-none p-2 lg:p-0">
              <li>
                <button
                  className="block w-full p-3 text-left rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 font-medium"
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  className="block w-full p-3 text-left rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 font-medium"
                  onClick={() => navigate("/prediction")}
                >
                  Predictions
                </button>
              </li>
              <li>
                <button
                  className="block w-full p-3 text-left rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 font-medium"
                  onClick={() => navigate("/trends")}
                >
                  Trends
                </button>
              </li>
              <li>
                <button
                  className="block w-full p-3 text-left rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 font-medium"
                  onClick={() => navigate("/transactionsFeeding")}
                >
                  Upload Transactions
                </button>
              </li>
              <li>
                <button
                  className="block w-full p-3 text-left rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 font-medium"
                  onClick={() => navigate("/transactionsLog")}
                >
                  Transactions Log
                </button>
              </li>
              <li>
                <button
                  className="block w-full p-3 text-left rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 font-medium"
                  onClick={() => navigate("/newproductaddition")}
                >
                  Add Product
                </button>
              </li>
              <li>
                <button
                  className="block w-full p-3 text-left rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 font-medium"
                  onClick={() => navigate("*")}
                >
                  About
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
