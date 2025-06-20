import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  fetchRevenuesPerMonth,
  fetchRevenuesPerQuarter,
} from "../../store/features/dashboardSlices/revenueSlice";
import Loading from "../common/Loading";
import { CalendarDays, BarChartBig, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion } from "framer-motion";

const QuarterChart = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()-1);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const { loading, error } = useSelector((state) => state.revenue);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const monthlyRevenue = useSelector((state) => state.revenue.monthlyData);
  const quarterlyRevenue = useSelector((state) => state.revenue.quarterlyData);
  const quarterlyChartData = useMemo(() => {
    if (!quarterlyRevenue?.data?.quarterlyRevenue) return [];

    return quarterlyRevenue.data.quarterlyRevenue.map((quarter, index) => ({
      name: `Q${index + 1}`,
      revenue: quarter.totalRevenue,
    }));
  }, [quarterlyRevenue]);

  useEffect(() => {
    if (token) {
      dispatch(fetchRevenuesPerMonth({ year: selectedYear }));
      dispatch(fetchRevenuesPerQuarter({ year: selectedYear }));
    }
  }, [selectedYear, token, dispatch]);

  const currentMonth = new Date()
    .toLocaleString("en-US", { month: "long" })
    .toLowerCase();
  const previousMonth = new Date(new Date().setMonth(new Date().getMonth() - 1))
    .toLocaleString("en-US", { month: "long" })
    .toLowerCase();

  const currentQuarterIndex = Math.floor(new Date().getMonth() / 3);
  const previousQuarterIndex = currentQuarterIndex - 1;

  const currentMonthRevenue = monthlyRevenue?.data?.[currentMonth] ?? 0;
  const previousMonthRevenue = monthlyRevenue?.data?.[previousMonth] ?? 0;
  const currentQuarterRevenue =
    quarterlyRevenue?.data?.quarterlyRevenue[currentQuarterIndex]?.totalRevenue ?? 0;
  const previousQuarterRevenue =
    (previousQuarterIndex >= 0 && quarterlyRevenue?.data?.quarterlyRevenue[previousQuarterIndex]?.totalRevenue) ?? 0;

  const calculatePercentageChange = (current, previous) => {
    if (previous === 0) {
        return current > 0 ? 100 : 0; // If previous is 0 and current is positive, it's a 100% increase (or 0 if current is also 0)
    }
    return ((current - previous) / previous) * 100;
  };

  const getChangeIcon = (change) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const monthlyChange = useMemo(
    () => calculatePercentageChange(currentMonthRevenue, previousMonthRevenue),
    [currentMonthRevenue, previousMonthRevenue]
  );
  const quarterlyChange = useMemo(
    () =>
      calculatePercentageChange(currentQuarterRevenue, previousQuarterRevenue),
    [currentQuarterRevenue, previousQuarterRevenue]
  );

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectYear = (year) => {
    setSelectedYear(year);
    setIsDropdownOpen(false);
  };

  const currentYear = new Date().getFullYear();
  const dropdownOptions = Array.from(
    { length: currentYear - 2013 + 1 },
    (_, i) => currentYear - i
  );

  const totalRevenue = quarterlyRevenue?.data?.quarterlyRevenue?.reduce(
    (sum, quarter) => sum + Number(quarter.totalRevenue || 0),
    0
  );

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, ease: "easeOut" } 
    },
    hover: { scale: 1.02, transition: { duration: 0.2 } }
  };

  const StatCard = ({ title, value, change, period }) => (
    <div
      className="bg-gray-700 p-4 rounded-lg shadow-md flex flex-col items-center justify-center border border-gray-600 transition-all duration-300"
    >
      <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
      <h6 className="text-xl font-bold text-white mb-2">
        ${Number(value).toLocaleString()}
      </h6>
      <div className="flex items-center text-sm font-semibold">
        {getChangeIcon(change)}
        <span className={`${change > 0 ? "text-green-500" : change < 0 ? "text-red-500" : "text-gray-400"} ml-1`}>
          {change.toFixed(2)}%
        </span>
        <span className="text-gray-400 ml-1">{period}</span>
      </div>
    </div>
  );

  return (
    <div className="col-span-1 md:col-span-2 xl:col-span-2 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full flex flex-col justify-between bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700 transform hover:scale-[1.005] transition-all duration-300 h-[600px]"
      >
        {/* Header Section */}
        <div className="flex items-center space-x-3 mb-6 justify-between">
          <div className="flex items-center space-x-3">
            <BarChartBig className="h-8 w-8 text-blue-500" />
            <h2 className="text-2xl font-bold text-white">Revenue Overview</h2>
          </div>
          {/* Revenue Report Button */}
          <a
            href="/quarterRevenues"
            className="uppercase text-sm font-semibold inline-flex items-center rounded-lg px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 shadow-md"
          >
            Revenue Report
            <svg
              className="w-3 h-3 ms-2 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
          </a>
        </div>

        {/* Total Revenue & Year Selection */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col">
            <p className="text-lg font-semibold text-gray-400">Total Revenues for {selectedYear}</p>
            {loading ? (
              <Loading />
            ) : error ? (
                <p className="text-red-500 text-xl font-bold">Error: {error}</p>
            ) : (
              <h5 className="text-4xl font-extrabold text-white mt-1">
                ${Number(totalRevenue).toLocaleString()}
              </h5>
            )}
          </div>
          
          {/* Dropdown Button */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="inline-flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
            >
              <CalendarDays className="h-5 w-5 mr-2" />
              {selectedYear}
              <svg
                className="w-2.5 h-2.5 ms-2" // Adjusted margin
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-10 right-0 mt-2 bg-gray-700 divide-y divide-gray-600 rounded-lg shadow-xl w-44"
              >
                <ul className="py-2 text-sm text-gray-200">
                  {dropdownOptions.map((year) => (
                    <li key={year}>
                      <button
                        onClick={() => selectYear(year)}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-600 transition-colors duration-200"
                      >
                        {year}
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
        </div>

        {/* Monthly and Quarterly Change Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <StatCard
            title="Monthly Change"
            value={currentMonthRevenue}
            change={monthlyChange}
            period="vs. prev. month"
          />
          <StatCard
            title="Quarterly Change"
            value={currentQuarterRevenue}
            change={quarterlyChange}
            period="vs. prev. quarter"
          />
        </div>

        {/* Chart Section */}
        <div className="h-full mt-4 bg-gray-900 rounded-lg p-4 flex-1">
          {loading ? (
            <Loading />
          ) : error ? (
            <div className="text-red-500 text-center py-8">Error loading chart data.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={quarterlyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" /> {/* Darker grid */}
                <XAxis dataKey="name" stroke="#9CA3AF" tickLine={false} />
                <YAxis stroke="#9CA3AF" tickLine={false} />
                <Tooltip 
                  cursor={{ stroke: '#4B5563', strokeWidth: 1 }} // Darker cursor
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} // Darker tooltip background
                  itemStyle={{ color: '#E5E7EB' }} // Lighter text color
                  formatter={(value) => `$${value.toLocaleString()}`}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366F1" // Brighter blue/purple for line
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#6366F1', stroke: '#1F2937', strokeWidth: 2 }} // Larger, colored dots
                  activeDot={{ r: 6, fill: '#6366F1', stroke: '#1F2937', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default QuarterChart;
