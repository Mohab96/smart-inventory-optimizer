import { useState } from "react";
import Header from "../../components/common/Header";
// import SalesCard from "../../components/charts/SalesCard";
// import ProgressCard from "../../components/charts/ProgressCard";
import AreaChart from "../../components/charts/AreaChart";
import StatsGrid from "../../components/charts/StatsGrid";
import SalesCard from "../../components/charts/SalesCard";

const Dashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`w-64 z-40 h-full p-4 overflow-y-auto transition-transform ${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          } bg-white dark:bg-gray-800`}
        >
          <h5 className="text-base font-semibold text-gray-200 uppercase dark:text-gray-400">
            Menu
          </h5>

          <ul className="mt-4 space-y-2 font-medium">
            <li>
              <a
                href="#"
                className="block p-2 rounded-lg text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Dashboard
              </a>
            </li>
            <li>
              <button className="block w-full p-2 text-left rounded-lg text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                Report
              </button>
            </li>
            <li>
              <button className="block w-full p-2 text-left text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                Transactions
              </button>
            </li>
            <li>
              <button className="block w-full p-2 text-left rounded-lg text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                Trend Visualizer
              </button>
            </li>
            <li>
              <button className="block w-full p-2 text-left rounded-lg text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                Add product
              </button>
            </li>
            <li>
              <button className="block w-full p-2 text-left rounded-lg text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                About
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4 dark:bg-gray-700">
          <StatsGrid />
          <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 py-10">
            {/* AreaChart taking 2 columns */}
            <div className="col-span-1 md:col-span-2 xl:col-span-2 w-full">
              <AreaChart />
            </div>

            {/* Placeholder for another component in the 3rd column */}
            <div className="col-span-1 h-80 flex items-center justify-center">
              <SalesCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
{
  /* <div className=" w-full h-80 flex items-center justify-center"></div> */
}

export default Dashboard;
