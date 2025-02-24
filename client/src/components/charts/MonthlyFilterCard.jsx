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
import {
  fetchCategoryRevenue,
  // fetchMonthlyRevenue,
} from "../../store/features/dashboardSlices/revenueSlice";

const MonthlyFilterCard = () => {
  const dispatch = useDispatch();
  const {
    data: revenue,
    loading,
    error,
  } = useSelector((state) => state.revenue);

  const [startDate, setStartDate] = useState("2023-01-01T00:00:00Z");
  const [endDate, setEndDate] = useState("2023-12-31T23:59:59Z");

  useEffect(() => {
    // dispatch(fetchMonthlyRevenue({ startDate, endDate }));
    dispatch(fetchCategoryRevenue());
  }, [dispatch, startDate, endDate]);

  const formatForInput = (isoString) => isoString.substring(0, 10);

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value + "T00:00:00Z");
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value + "T23:59:59Z");
  };

  return (
    <div>
      <div className="max-w-sm w-full h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 md:p-6">
        <div className="mb-4 flex gap-4 w-fu">
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

        <div className="flex justify-between">
          <div>
            <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">
              $12,423
            </h5>
            <p className="text-base font-normal text-gray-500 dark:text-gray-400">
              Revenue this month
            </p>
          </div>
          <div className="flex items-center px-2.5 py-0.5 text-base font-semibold text-green-500 dark:text-green-500 text-center">
            23%
            <svg
              className="w-3 h-3 ms-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13V1m0 0L1 5m4-4 4 4"
              />
            </svg>
          </div>
        </div>

        <div className="mt-5 h-40">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenue.length ? revenue : []}>
                <XAxis dataKey="name" stroke="#8884d8" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#ff7300" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
          <a
            href="#"
            className="uppercase text-sm font-semibold inline-flex items-center rounded-lg text-blue-600 hover:text-blue-700 dark:hover:text-blue-500  hover:bg-gray-100 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 px-3 py-2"
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
      </div>
    </div>
  );
};

export default MonthlyFilterCard;
