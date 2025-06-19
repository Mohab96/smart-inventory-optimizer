import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProfitGrid from "../../components/charts/ProfitGrid";
import LossGrid from "../../components/charts/LossGrid";
import QuarterPieChart from "../../components/charts/QuarterPieChart";
import QuarterChart from "../../components/charts/QuarterChart";
import PieChart from "../../components/charts/PieChart";
import ChartCard from "../../components/charts/ChartCard";
import { BarChartBig, TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { fetchRevenuesPerMonth } from "../../store/features/dashboardSlices/revenueSlice";
import { fetchLowStock } from "../../store/features/dashboardSlices/lowStockSlice";
import { fetchCategoriesExpiringSoon } from "../../store/features/dashboardSlices/expiryDateSlice";
import { fetchProductsExpiringSoon } from "../../store/features/dashboardSlices/expiryProductsSlice";
import { useTheme } from "../../components/common/ThemeContext";

const Dashboard = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()-1);
  const { theme } = useTheme();

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
      dispatch(
        fetchCategoriesExpiringSoon({ page: 1, limit: 1, orderBy: "asc" })
      );
      dispatch(
        fetchProductsExpiringSoon({ page: 1, limit: 1, orderBy: "asc" })
      );
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
  const current =
    chartData.length > 0 ? chartData[chartData.length - 1].value : 0;
  const previous =
    chartData.length > 1 ? chartData[chartData.length - 2].value : 0;
  const change =
    previous === 0
      ? current > 0
        ? 100
        : 0
      : ((current - previous) / previous) * 100;
  const getChangeIcon = (change) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };
  const average =
    chartData.length > 0
      ? chartData.reduce((sum, d) => sum + (d.value || 0), 0) / chartData.length
      : 0;
  const statCards = [
    {
      title: "Change",
      value: `$${Number(current).toLocaleString()}`,
      icon: getChangeIcon(change),
      change: `${change.toFixed(2)}%`,
      changeClass:
        change > 0
          ? "text-green-500"
          : change < 0
          ? "text-red-500"
          : "text-gray-400",
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
    <div className="min-h-screen h-auto flex flex-col bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-gray-700">
          <ProfitGrid selectedYear={selectedYear} />

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
                      <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#4B5563" : "#e5e7eb"} />
                      <XAxis
                        dataKey="month"
                        stroke={theme === "dark" ? "#9CA3AF" : "#6b7280"}
                        tickLine={false}
                      />
                      <YAxis stroke={theme === "dark" ? "#9CA3AF" : "#6b7280"} tickLine={false} />
                      <Tooltip
                        formatter={(value) => `$${value.toLocaleString()}`}
                        contentStyle={{
                          backgroundColor: theme === "dark" ? "#1F2937" : "#fff",
                          color: theme === "dark" ? "#E5E7EB" : "#1F2937",
                          border: "none",
                          borderRadius: "8px",
                        }}
                        itemStyle={{ color: theme === "dark" ? "#E5E7EB" : "#1F2937" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        dot={{
                          r: 4,
                          fill: "#3B82F6",
                          stroke: theme === "dark" ? "#1F2937" : "#fff",
                          strokeWidth: 2,
                        }}
                        activeDot={{
                          r: 6,
                          fill: "#3B82F6",
                          stroke: theme === "dark" ? "#1F2937" : "#fff",
                          strokeWidth: 2,
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                }
                loading={loading}
                error={error}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-200"
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
