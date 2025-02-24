import Header from "../../components/common/Header";
import AreaChart from "../../components/charts/AreaChart";
import MonthlyFilterCard from "../../components/charts/MonthlyFilterCard";
import Sidebar from "../../components/common/Sidebar";
import LossGrid from "../../components/charts/LossGrid";
import ProfitGrid from "../../components/charts/ProfitGrid";

const Dashboard = () => {

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4 dark:bg-gray-700">
          <ProfitGrid />
          <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 py-5">
            <AreaChart />
            <MonthlyFilterCard />
          </div>
          <LossGrid />
          <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 py-5">
            <AreaChart />
            <MonthlyFilterCard />
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
