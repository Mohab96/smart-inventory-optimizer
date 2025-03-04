import Header from "../../components/common/Header";
import AreaChart from "../../components/charts/AreaChart";
import MonthlyFilterCard from "../../components/charts/MonthlyFilterCard";
import Sidebar from "../../components/common/Sidebar";
import LossGrid from "../../components/charts/LossGrid";
import ProfitGrid from "../../components/charts/ProfitGrid";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRevenuesPerMonth,
  fetchRevenuesPerQuarter,
} from "../../store/features/dashboardSlices/revenueSlice";
import { useEffect, useState } from "react";
import QuarterPieChart from "../../components/charts/QuarterPieChart";
import QuarterChart from "../../components/charts/QuarterChart";
// import PieChart from "../../components/charts/PieChart";

const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const monthlyRevenue = useSelector((state) => state.revenue.monthlyData);
  const quarterlyRevenue = useSelector((state) => state.revenue.quarterlyData);
  // console.log(quarterlyRevenue?.data?.quarterlyRevenue);

  useEffect(() => {
    if (token) {
      dispatch(fetchRevenuesPerMonth({ year: selectedYear }));
      dispatch(fetchRevenuesPerQuarter({ year: selectedYear }));
    }
  }, [dispatch, token, selectedYear]);

  const currentMonth = new Date().getMonth(); // 0-based index (Jan = 0, Dec = 11)
  const currentQuarter = Math.floor(currentMonth / 3); // Determines the current quarter

  const currentMonthRevenue = monthlyRevenue?.data?.[currentMonth] || 0;
  const previousMonthRevenue = monthlyRevenue?.data?.[currentMonth - 1] || 0;

  const currentQuarterRevenue = quarterlyRevenue?.data?.[currentQuarter] || 0;
  const previousQuarterRevenue =
    quarterlyRevenue?.data?.[currentQuarter - 1] || 0;

  // Calculate percentage change for month and quarter
  const calculatePercentageChange = (current, previous) => {
    if (previous > 0) {
      return ((current - previous) / previous) * 100;
    }
    return 0;
  };

  const monthlyChange = calculatePercentageChange(
    currentMonthRevenue,
    previousMonthRevenue
  );
  const quarterlyChange = calculatePercentageChange(
    currentQuarterRevenue,
    previousQuarterRevenue
  );

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
            <QuarterPieChart />
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
