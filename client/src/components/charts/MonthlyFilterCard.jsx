import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchMonthlyRevenue } from "../../store/features/dashboardSlices/revenueSlice";

const MonthlyFilterCard = () => {
  const dispatch = useDispatch();
  const {
    data: revenue,
    loading,
    error,
  } = useSelector((state) => state.revenue);

  const [startDate, setStartDate] = useState("2023-01-01T00:00:00Z");
  const [endDate, setEndDate] = useState("2023-12-31T23:59:59Z");

  // Fetch revenue whenever the user changes the date range
  useEffect(() => {
    if (startDate && endDate) {
      dispatch(fetchMonthlyRevenue({ startDate, endDate }));
    }
  }, [dispatch, startDate, endDate]);

  const formatForInput = (isoString) => isoString.substring(0, 10);

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value + "T00:00:00Z";
    setStartDate(newStartDate);
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value + "T23:59:59Z";
    setEndDate(newEndDate);
  };

  const revenueArray = revenue?.data
    ? Object.values(revenue.data).map((sales, index) => ({
        name: Object.keys(revenue.data)[index],
        sales,
      }))
    : [];

  const totalRevenue = revenueArray.reduce(
    (sum, entry) => sum + (entry.sales || 0),
    0
  );

  // console.log(revenue);
  
  return (
    <div className="max-w-sm w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 md:p-6">
      {/* Date Pickers */}
      <div className="mb-4 flex gap-4 w-full">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Start Date:
          </label>
          <input
            type="date"
            value={formatForInput(startDate)}
            onChange={handleStartDateChange}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            End Date:
          </label>
          <input
            type="date"
            value={formatForInput(endDate)}
            onChange={handleEndDateChange}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Total Revenue Display */}
      <div className="flex justify-between">
        <div>
          <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">
            ${totalRevenue.toLocaleString()}
          </h5>
          <p className="text-base font-normal text-gray-500 dark:text-gray-400">
            Revenue in selected range
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="mt-5 h-40">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : revenue?.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenue}>
              <XAxis dataKey="name" stroke="#8884d8" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#ff7300" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No data available</p>
        )}
      </div>

      {/* Sales Report Link */}
      <a
        href="#"
        className="uppercase text-sm font-semibold inline-flex items-center rounded-lg text-blue-600 hover:text-blue-700 dark:hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 px-3 py-2"
      >
        Sales Report
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
  );
};

export default MonthlyFilterCard;
