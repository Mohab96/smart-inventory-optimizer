import Header from "../../components/common/Header";

import AreaChart from "../../components/charts/AreaChart";
import StatsGrid from "../../components/charts/StatsGrid";
import MonthlyFilterCard from "../../components/charts/MonthlyFilterCard";

const Dashboard = () => {
  // const [drawerOpen, setDrawerOpen] = useState(true);
  // console.log(token);
  // const revenue = useSelector((state) => state.revenue);
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(fetchRevenue());
  // }, []);

  // console.log(revenue);

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`w-64 z-40 h-full p-4 overflow-y-auto transition-transform  bg-white dark:bg-gray-800`}
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
              <MonthlyFilterCard />
            </div>
            {/* AreaChart taking 2 columns */}
            <div className="col-span-1 h-80 flex items-center justify-center">
              <MonthlyFilterCard />
            </div>
            <div className="col-span-1 md:col-span-2 xl:col-span-2 w-full">
              <AreaChart />
            </div>
            {/* Placeholder for another component in the 3rd column */}
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
