import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Loading from "../common/Loading";

const GenericLineChart = ({
  title,
  data = [],
  dataKey = "value",
  dropdownOptions = [],
  selectedYear,
  onYearChange,
  loading = false,
  error = "",
  link = null,
  linkText = "Details",
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 md:p-6">
      <div className="flex justify-between items-center">
        <p className="text-2xl font-bold text-gray-700 dark:text-gray-200">
          {title} {selectedYear && `(${selectedYear})`}
        </p>
        {loading ? <Loading /> : null}
      </div>

      <div className="h-64 mt-4">
        {loading ? (
          <Loading />
        ) : error ? (
          <p className="text-red-400">Error: {error}</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="flex justify-between items-center pt-5">
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            {selectedYear}
            <svg className="w-2.5 ml-2 inline" viewBox="0 0 10 6" fill="none">
              <path
                d="M1 1L5 5L9 1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          {isDropdownOpen && (
            <div className="absolute z-10 mt-2 bg-white dark:bg-gray-700 rounded-lg shadow w-44">
              <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                {dropdownOptions.map((year) => (
                  <li key={year}>
                    <button
                      onClick={() => {
                        onYearChange(year);
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      {year}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {link && (
          <a
            href={link}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:hover:text-blue-500"
          >
            {linkText}
          </a>
        )}
      </div>
    </div>
  );
};

export default GenericLineChart;
