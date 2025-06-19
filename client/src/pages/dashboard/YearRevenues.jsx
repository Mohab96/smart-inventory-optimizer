/* eslint-disable */
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchRevenuesPerMonth } from "../../store/features/dashboardSlices/revenueSlice";
import PieChart from "../../components/charts/PieChart";
import ChartCard from "../../components/charts/ChartCard";
import { BarChartBig, Calendar, DollarSign } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useTheme } from "../../components/common/ThemeContext";

const YearRevenues = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()-1);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const { theme } = useTheme();

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

  // Convert data to array format for table display
  const revenueTableData = revenueData
    ? Object.entries(revenueData).map(([month, revenue]) => ({
        month,
        revenue,
      }))
    : [];

  // Generate dropdown options from 2025 to 2013
  const dropdownOptions = Array.from({ length: 2025 - 2013 + 1 }, (_, i) => 2025 - i);

  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-1 overflow-hidden">

        {/* Main Content */}
        <div className={`flex-1 overflow-y-auto p-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <h2 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
            <span className="flex items-center gap-3">
              <BarChartBig className="h-8 w-8 text-blue-500" />
              <span className="text-4xl font-extrabold bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-200 bg-clip-text text-transparent drop-shadow-lg">
                Yearly Revenue Overview
              </span>
            </span>
            <span className={`block text-lg font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'} mt-2 ml-1`}>Track your business performance by year</span>
          </h2>

          {/* Charts Section */}
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
                totalValue={`$${Object.values(revenueData).reduce((sum, v) => sum + (typeof v === 'number' ? v : 0), 0).toLocaleString()}`}
                statCards={[]}
                chart={
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={Object.entries(revenueData).map(([month, value]) => ({ month: month.charAt(0).toUpperCase() + month.slice(1), value }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#4B5563" : "#e5e7eb"} />
                      <XAxis dataKey="month" stroke={theme === "dark" ? "#9CA3AF" : "#6b7280"} tickLine={false} />
                      <YAxis stroke={theme === "dark" ? "#9CA3AF" : "#6b7280"} tickLine={false} />
                      <Tooltip
                        formatter={(value) => `$${value.toLocaleString()}`}
                        contentStyle={{ 
                          backgroundColor: theme === "dark" ? "#1F2937" : "#fff", 
                          border: "none", 
                          borderRadius: "8px",
                          color: theme === "dark" ? "#E5E7EB" : "#1F2937"
                        }}
                        itemStyle={{ color: theme === "dark" ? "#E5E7EB" : "#1F2937" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        dot={{ r: 4, fill: "#3B82F6", stroke: theme === "dark" ? "#1F2937" : "#fff", strokeWidth: 2 }}
                        activeDot={{ r: 6, fill: "#3B82F6", stroke: theme === "dark" ? "#1F2937" : "#fff", strokeWidth: 2 }}
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

          {/* Monthly Revenues Cards */}
          <div className="mt-6">
            <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3 flex items-center gap-2`}>
              <Calendar className="h-6 w-6 text-blue-400" />
              Monthly Revenues
            </h3>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className={`w-10 h-10 border-4 ${theme === 'dark' ? 'border-blue-800' : 'border-blue-200'} rounded-full animate-spin ${theme === 'dark' ? 'border-t-blue-400' : 'border-t-blue-600'}`}></div>
              </div>
            ) : error ? (
              <div className={`text-center ${theme === 'dark' ? 'text-red-400' : 'text-red-500'} font-semibold py-8`}>Error: {error}</div>
            ) : revenueTableData.length === 0 ? (
              <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>No revenue data found for this year.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {revenueTableData.map(({ month, revenue }, idx) => (
                  <div
                    key={month}
                    className={`${theme === 'dark' ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 border-gray-700' : 'bg-gradient-to-br from-white via-gray-50 to-white border-gray-200'} rounded-2xl shadow-xl border p-6 flex flex-col items-center gap-3 hover:scale-[1.03] hover:shadow-2xl transition-transform duration-300`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-6 w-6 text-blue-400" />
                      <span className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} capitalize`}>{month}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <DollarSign className="h-6 w-6 text-green-400" />
                      <span className="text-2xl font-bold text-green-400">${revenue.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearRevenues;
