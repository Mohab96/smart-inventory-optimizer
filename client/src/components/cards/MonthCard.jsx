/* eslint-disable */

import { useNavigate } from "react-router-dom";

const MonthCard = ({ value, label, percentage, color, path, iconPath }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-4 sm:p-6 xl:p-8">
      <div className="flex items-center justify-between">
        <div className="flex-shrink-0">
          <span className="text-2xl sm:text-3xl leading-none font-bold text-gray-900 dark:text-white">
            {value}
          </span>
          <h3 className="text-base font-normal text-gray-500 dark:text-gray-400 whitespace-pre-line">
            {label}
          </h3>
        </div>
        <div className="flex flex-col">
          <div
            className={`flex items-center justify-center flex-1 ${color} text-base font-bold`}
          >
            {percentage}
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fillRule="evenodd" d={iconPath} clipRule="evenodd"></path>
            </svg>
          </div>
          <div>
            <button
              onClick={() => navigate(path)}
              className="uppercase text-sm font-semibold inline-flex items-center rounded-lg text-blue-600 hover:text-blue-700 dark:hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 cursor-pointer"
            >
              Show All
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
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthCard;
