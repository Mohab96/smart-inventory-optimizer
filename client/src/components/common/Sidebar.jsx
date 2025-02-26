import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-64 z-40 h-full p-4 overflow-y-auto transition-transform bg-white dark:bg-gray-800">
      <h5 className="text-base font-semibold text-gray-200 uppercase dark:text-gray-400">
        Menu
      </h5>

      <ul className="mt-4 space-y-2 font-medium">
        <li>
          <button
            className="block w-full p-2 text-left rounded-lg text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Dashboard
          </button>
        </li>
        <li>
          <button
            className="block w-full p-2 text-left rounded-lg text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => navigate("/staffManagement")}
          >
            Staff Management
          </button>
        </li>
        <li>
          <button
            className="block w-full p-2 text-left text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => navigate("/transactionsFeeding")}
          >
            Transactions
          </button>
        </li>
        <li>
          <button
            className="block w-full p-2 text-left rounded-lg text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => navigate("*")}
          >
            Trend Visualizer
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
  );
};

export default Sidebar;
