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
import ChartCard from "../../components/charts/ChartCard";
import { BarChartBig, TrendingUp, TrendingDown, Minus, CalendarDays, Menu } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { fetchRevenuesPerMonth } from "../../store/features/dashboardSlices/revenueSlice";
import { fetchLowStock } from "../../store/features/dashboardSlices/lowStockSlice";
import { fetchCategoriesExpiringSoon } from "../../store/features/dashboardSlices/expiryDateSlice";
import { fetchProductsExpiringSoon } from "../../store/features/dashboardSlices/expiryProductsSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const {
    loading,
    monthlyData: revenue,
    error,
  } = useSelector((state) => state.revenue);
  const lowStockData = useSelector((state) => state.lowStock.data);
  const expiryDateData = useSelector((state) => state.expiryDate.data);
  const expiryProductsData = useSelector((state) => state.expiryProducts.data);

  useEffect(() => {
    if (token) {
      dispatch(fetchRevenuesPerMonth({ year: selectedYear }));
      dispatch(fetchLowStock({ page: 1, limit: 1, orderBy: "asc" }));
      dispatch(fetchCategoriesExpiringSoon({ page: 1, limit: 1, orderBy: "asc" }));
      dispatch(fetchProductsExpiringSoon({ page: 1, limit: 1, orderBy: "asc" }));
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

  // Prepare props for LossGrid
  const firstLowStockProduct = lowStockData?.data?.[0];
  const firstExpiringCategory = expiryDateData?.data?.[0];
  const firstExpiringProduct = expiryProductsData?.data?.[0];

  // Calculate stats for the stat card
  const current = chartData.length > 0 ? chartData[chartData.length - 1].value : 0;
  const previous = chartData.length > 1 ? chartData[chartData.length - 2].value : 0;
  const change = previous === 0 ? (current > 0 ? 100 : 0) : ((current - previous) / previous) * 100;
  const getChangeIcon = (change) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };
  const average = chartData.length > 0
    ? chartData.reduce((sum, d) => sum + (d.value || 0), 0) / chartData.length
    : 0;
  const statCards = [
    {
      title: "Change",
      value: `$${Number(current).toLocaleString()}`,
      icon: getChangeIcon(change),
      change: `${change.toFixed(2)}%`,
      changeClass: change > 0 ? "text-green-500" : change < 0 ? "text-red-500" : "text-gray-400",
      period: "vs. prev. period",
    },
    {
      title: "Avg. Monthly Revenue",
      value: `$${Number(average).toLocaleString()}`,
      icon: <BarChartBig className="h-4 w-4 text-yellow-400" />,
      change: "",
      changeClass: "",
      period: "",
    },
  ];
  const total = chartData.reduce((sum, d) => sum + (d.value || 0), 0);

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden fixed top-20 left-4 z-30 p-2 bg-gray-800 text-white rounded-lg shadow-lg hover:bg-gray-700 transition-colors duration-200"
        >
          <Menu className="h-6 w-6" />
        </button>

        <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
        
        <div className="flex-1 overflow-y-auto p-4 dark:bg-gray-700">
          <ProfitGrid />

          <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 py-5">
            <div className="col-span-1 md:col-span-2 xl:col-span-2">
              <ChartCard
                title="Total Revenues"
                icon={<BarChartBig className="h-8 w-8 text-blue-500" />}
                reportLink="/yearRevenues"
                reportText="Revenue Report"
                dropdownOptions={dropdownOptions}
                selectedOption={selectedYear}
                onOptionChange={setSelectedYear}
                totalLabel={`Total for ${selectedYear}`}
                totalValue={`$${Number(total).toLocaleString()}`}
                statCards={statCards}
                chart={
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                      <XAxis dataKey="month" stroke="#9CA3AF" tickLine={false} />
                      <YAxis stroke="#9CA3AF" tickLine={false} />
                      <Tooltip
                        formatter={(value) => `$${value.toLocaleString()}`}
                        contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                        itemStyle={{ color: '#E5E7EB' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#3B82F6', stroke: '#1F2937', strokeWidth: 2 }}
                        activeDot={{ r: 6, fill: '#3B82F6', stroke: '#1F2937', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                }
                loading={loading}
                error={error}
              />
            </div>
            <div className="col-span-1">
              <PieChart data={nonZeroMonths} />
            </div>
          </div>

          <LossGrid
            lowStockProduct={firstLowStockProduct}
            expiringCategory={firstExpiringCategory}
            expiringProduct={firstExpiringProduct}
          />

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
