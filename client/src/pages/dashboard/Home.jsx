import Header from "../../components/common/Header";
import AreaChart from "../../components/charts/AreaChart";
import Sidebar from "../../components/common/Sidebar";
import LossGrid from "../../components/charts/LossGrid";
import ProfitGrid from "../../components/charts/ProfitGrid";
import { useDispatch, useSelector } from "react-redux";
import QuarterPieChart from "../../components/charts/QuarterPieChart";
import QuarterChart from "../../components/charts/QuarterChart";
import PieChart from "../../components/charts/PieChart";
import { useEffect, useState } from "react";
import { fetchRevenuesPerMonth } from "../../store/features/dashboardSlices/revenueSlice";
// import PieChart from "../../components/charts/PieChart";

const Dashboard = () => {
  const token = useSelector((state) => state.auth.token);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const dispatch = useDispatch();
  // const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      dispatch(fetchRevenuesPerMonth({ year: selectedYear }));
    }
  }, [dispatch, token, selectedYear]);

  const {
    loading,
    monthlyData: revenue,
    error,
  } = useSelector((state) => state.revenue);

  // Extract non-zero revenue months
  const revenueData = revenue?.data || {};
  const nonZeroMonths = Object.entries(revenueData)
    .filter(([_, value]) => value > 0)
    .map(([month, value]) => ({ month, value }));

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
            {/* <QuarterPieChart /> */}
            <PieChart data={nonZeroMonths} />
          </div>
          <LossGrid />
          <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 py-5">
            <QuarterPieChart />
            <QuarterChart />
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
