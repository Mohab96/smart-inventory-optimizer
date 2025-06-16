import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/common/Header";
import Sidebar from "../../components/common/Sidebar";
import ProfitGrid from "../../components/charts/ProfitGrid";
import LossGrid from "../../components/charts/LossGrid";
import QuarterPieChart from "../../components/charts/QuarterPieChart";
import QuarterChart from "../../components/charts/QuarterChart";
import PieChart from "../../components/charts/PieChart";
import GenericLineChart from "../../components/charts/GenericLineChart";
import { fetchRevenuesPerMonth } from "../../store/features/dashboardSlices/revenueSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const {
    loading,
    monthlyData: revenue,
    error,
  } = useSelector((state) => state.revenue);

  useEffect(() => {
    if (token) {
      dispatch(fetchRevenuesPerMonth({ year: selectedYear }));
    }
  }, [dispatch, token, selectedYear]);

  const revenueData = revenue?.data || {};
  const chartData = Object.entries(revenueData).map(([month, value]) => ({
    month: month.charAt(0).toUpperCase() + month.slice(1),
    value,
  }));

  const nonZeroMonths = chartData.filter((entry) => entry.value > 0);

  const currentYear = new Date().getFullYear();
  const dropdownOptions = Array.from(
    { length: currentYear - 2013 + 1 },
    (_, i) => currentYear - i
  );

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-y-auto p-4 dark:bg-gray-700">
          <ProfitGrid />

          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 py-5">
            <div className="md:col-span-2">
              <GenericLineChart
                title="Total Revenues"
                data={chartData}
                dataKey="value"
                selectedYear={selectedYear}
                onYearChange={setSelectedYear}
                dropdownOptions={dropdownOptions}
                loading={loading}
                error={error}
                link="/yearRevenues"
                linkText="Revenue Report"
              />
            </div>

            <div className="md:col-span-1 ">
              <PieChart data={nonZeroMonths} />
            </div>
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

export default Dashboard;
