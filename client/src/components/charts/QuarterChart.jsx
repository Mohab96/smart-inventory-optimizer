import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  fetchRevenuesPerMonth,
  fetchRevenuesPerQuarter,
} from "../../store/features/dashboardSlices/revenueSlice";
import Loading from "../common/Loading";

const QuarterChart = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const loading = useSelector((state) => state.revenue.loading);
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

  const fetchCalled = useRef(false); // Prevent unnecessary fetch calls

  useEffect(() => {
    if (token && !fetchCalled.current) {
      dispatch(fetchRevenuesPerMonth({ year: selectedYear }));
      dispatch(fetchRevenuesPerQuarter({ year: selectedYear }));
      fetchCalled.current = true; // Mark as called
    }
  }, [selectedYear, token, dispatch]);

  const currentMonth = new Date()
    .toLocaleString("en-US", { month: "long" })
    .toLowerCase();
  const previousMonth = new Date(new Date().setMonth(new Date().getMonth() - 1))
    .toLocaleString("en-US", { month: "long" })
    .toLowerCase();

  const currentQuarter = Math.floor(new Date().getMonth() / 3);

  const currentMonthRevenue = monthlyRevenue?.data?.[currentMonth] ?? 0;
  // console.log(currentQuarter);

  const previousMonthRevenue = monthlyRevenue?.data?.[previousMonth] ?? 0;
  const currentQuarterRevenue =
    quarterlyRevenue?.data?.quarterlyRevenue[currentQuarter].totalRevenue ?? 0;
  const previousQuarterRevenue =
    quarterlyRevenue?.data?.[currentQuarter - 1] ?? 0;

  const calculatePercentageChange = (current, previous) => {
    return previous > 0 ? ((current - previous) / previous) * 100 : 0;
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
  const lastYear = currentYear - 1;
  const dropdownOptions = [currentYear, lastYear];

  //   console.log(quarterlyRevenue);
  const totalRevenue = quarterlyRevenue?.data?.quarterlyRevenue?.reduce(
    (sum, quarter) => sum + Number(quarter.totalRevenue || 0),
    0
  );
  return (
    <div className="col-span-1 md:col-span-2 xl:col-span-2 w-full">
      <div className="w-full flex flex-col justify-between bg-white rounded-lg shadow-sm dark:bg-gray-800 p-4 md:p-6">
        {/* Top Section - Total Revenue or Loading */}
        <div className="flex justify-between">
          <div className="flex w-full justify-between items-center">
            <p className="text-3xl font-bold text-gray-500 dark:text-gray-200">
              Total Revenues
            </p>
            {loading ? (
              <Loading /> // Show loading spinner in the top section
            ) : (
              <h5 className="text-3xl font-bold text-gray-900 dark:text-white pb-2">
                ${Number(totalRevenue).toLocaleString()}
              </h5>
            )}
          </div>
        </div>

        {/* Chart Section */}
        <div id="area-chart" className="h-32 mt-4">
          {loading ? (
            <Loading /> // Show loading spinner instead of the chart
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={quarterlyChartData}>
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
        {/* Bottom Section - Year Selection Dropdown */}
        <div className="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between">
          <div className="flex justify-between items-center pt-5">
            {/* Dropdown Button */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 text-center inline-flex items-center dark:hover:text-white"
              >
                {selectedYear}
                <svg
                  className="w-2.5 m-2.5 ms-1.5"
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
                <div className="absolute z-10 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700">
                  <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                    {dropdownOptions.map((year) => (
                      <li key={year}>
                        <button
                          onClick={() => selectYear(year)}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          {year}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Revenue Report Button */}
            <a
              href="#"
              className="uppercase text-sm font-semibold inline-flex items-center rounded-lg text-blue-600 hover:text-blue-700 dark:hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 px-3 py-2"
            >
              Revenue Report
              <svg
                className="w-2.5 h-2.5 ms-1.5 rtl:rotate-180"
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
        </div>
      </div>
    </div>
  );
};

export default QuarterChart;
