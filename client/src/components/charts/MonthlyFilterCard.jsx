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
import { fetchRevenue } from "../../store/features/dashboardSlices/revenueSlice";

const MonthlyFilterCard = () => {
  const dispatch = useDispatch();
  const {
    data: revenue,
    loading,
    error,
  } = useSelector((state) => state.revenue);

  // Initial dates (ISO strings)
  const [startDate, setStartDate] = useState("2023-01-01T00:00:00Z");
  const [endDate, setEndDate] = useState("2023-12-31T23:59:59Z");

  // Dispatch fetchRevenue whenever the dates change
  useEffect(() => {
    dispatch(fetchRevenue({ startDate, endDate }));
  }, [dispatch, startDate, endDate]);

  // Helper to format the ISO string for the date input (YYYY-MM-DD)
  const formatForInput = (isoString) => isoString.substring(0, 10);

  // Handle date changes from the inputs
  const handleStartDateChange = (e) => {
    const date = e.target.value;
    // Append time for the start of the day in ISO format
    setStartDate(date + "T00:00:00Z");
  };

  const handleEndDateChange = (e) => {
    const date = e.target.value;
    // Append time for the end of the day in ISO format
    setEndDate(date + "T23:59:59Z");
  };

  return (
    <div className="max-w-sm w-full h-full bg-white rounded-lg shadow-sm dark:bg-gray-800 p-4 md:p-6">
      {/* Date Inputs */}
      <div className="mb-4 flex gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start Date:
          </label>
          <input
            type="date"
            value={formatForInput(startDate)}
            onChange={handleStartDateChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Date:
          </label>
          <input
            type="date"
            value={formatForInput(endDate)}
            onChange={handleEndDateChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
      </div>

      {/* Sales Card Header */}
      <div className="flex justify-between">
        <div>
          <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">
            $12,423
          </h5>
          <p className="text-base font-normal text-gray-500 dark:text-gray-400">
            Sales this week
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

      {/* Sales Chart */}
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
      </div>
    </div>
  );
};

export default MonthlyFilterCard;
