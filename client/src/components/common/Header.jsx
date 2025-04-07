import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/features/authSlice";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout()); // Dispatch logout action
    navigate("/"); // Redirect to login page
  };

  return (
    <header>
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center"
          >
            <img
              src="/src/assets/images/darklogo.png"
              className="mr-3 h-6 sm:h-9"
              alt="Smart Inventory Logo"
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              Smart Inventory
            </span>
          </button>
          <div className="flex items-center lg:order-2">
            <button
              className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-red-800 bg-red-600 focus:outline-none dark:focus:ring-gray-800"
              onClick={handleLogout} // Call the logout function here
            >
              Log out
            </button>
            {/* <button
              className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
              onClick={() => navigate("*")}
            >
              Get started
            </button> */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              )}
            </button>
          </div>
          <div
            className={`${isMenuOpen ? "block" : "hidden"} lg:flex lg:w-auto lg:order-1`}
          >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              <li>
                <button
                  className="block w-full p-2 text-left rounded-lg text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  className="block w-full p-2 text-left rounded-lg text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => navigate("*")}
                >
                  Report
                </button>
              </li>
              <li>
                <button
                  className="block w-full p-2 text-left text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => navigate("/transactionsFeeding")}
                >
                  Upload Transactions
                </button>
              </li>
              <li>
                <button
                  className="block w-full p-2 text-left rounded-lg text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => navigate("/transactionsLog")}
                >
                  Transactions log
                </button>
              </li>
              <li>
                <button
                  className="block w-full p-2 text-left rounded-lg text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => navigate("/newproductaddition")}
                >
                  Add Product
                </button>
              </li>
              <li>
                <button
                  className="block w-full p-2 text-left rounded-lg text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
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
