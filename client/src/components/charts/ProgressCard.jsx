import { useState } from "react";

const ProgressCard = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="max-w-sm w-full bg-white rounded-lg shadow-sm dark:bg-gray-800 p-4 md:p-6">
      <div className="flex justify-between mb-3">
        <div className="flex items-center">
          <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white pe-1">
            Your teams progress
          </h5>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
        <div className="grid grid-cols-3 gap-3 mb-2">
          <dl className="bg-orange-50 dark:bg-gray-600 rounded-lg flex flex-col items-center justify-center h-[78px]">
            <dt className="w-8 h-8 rounded-full bg-orange-100 dark:bg-gray-500 text-orange-600 dark:text-orange-300 text-sm font-medium flex items-center justify-center mb-1">
              12
            </dt>
            <dd className="text-orange-600 dark:text-orange-300 text-sm font-medium">
              To do
            </dd>
          </dl>
          <dl className="bg-teal-50 dark:bg-gray-600 rounded-lg flex flex-col items-center justify-center h-[78px]">
            <dt className="w-8 h-8 rounded-full bg-teal-100 dark:bg-gray-500 text-teal-600 dark:text-teal-300 text-sm font-medium flex items-center justify-center mb-1">
              23
            </dt>
            <dd className="text-teal-600 dark:text-teal-300 text-sm font-medium">
              In progress
            </dd>
          </dl>
          <dl className="bg-blue-50 dark:bg-gray-600 rounded-lg flex flex-col items-center justify-center h-[78px]">
            <dt className="w-8 h-8 rounded-full bg-blue-100 dark:bg-gray-500 text-blue-600 dark:text-blue-300 text-sm font-medium flex items-center justify-center mb-1">
              64
            </dt>
            <dd className="text-blue-600 dark:text-blue-300 text-sm font-medium">
              Done
            </dd>
          </dl>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="hover:underline text-xs text-gray-500 dark:text-gray-400 font-medium inline-flex items-center"
        >
          Show more details
        </button>
        {showDetails && (
          <div className="border-gray-200 border-t dark:border-gray-600 pt-3 mt-3 space-y-2">
            <dl className="flex items-center justify-between">
              <dt className="text-gray-500 dark:text-gray-400 text-sm font-normal">
                Average task completion rate:
              </dt>
              <dd className="bg-green-100 text-green-800 text-xs font-medium inline-flex items-center px-2.5 py-1 rounded-md dark:bg-green-900 dark:text-green-300">
                57%
              </dd>
            </dl>
            <dl className="flex items-center justify-between">
              <dt className="text-gray-500 dark:text-gray-400 text-sm font-normal">
                Days until sprint ends:
              </dt>
              <dd className="bg-gray-100 text-gray-800 text-xs font-medium inline-flex items-center px-2.5 py-1 rounded-md dark:bg-gray-600 dark:text-gray-300">
                13 days
              </dd>
            </dl>
            <dl className="flex items-center justify-between">
              <dt className="text-gray-500 dark:text-gray-400 text-sm font-normal">
                Next meeting:
              </dt>
              <dd className="bg-gray-100 text-gray-800 text-xs font-medium inline-flex items-center px-2.5 py-1 rounded-md dark:bg-gray-600 dark:text-gray-300">
                Thursday
              </dd>
            </dl>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between">
        <div className="flex justify-between items-center pt-5">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 text-center inline-flex items-center dark:hover:text-white"
          >
            Last 7 days
          </button>
          {dropdownOpen && (
            <div className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700">
              <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                <li>
                  <a href="#" className="block px-4 py-2">
                    Yesterday
                  </a>
                </li>
                <li>
                  <a href="#" className="block px-4 py-2">
                    Today
                  </a>
                </li>
                <li>
                  <a href="#" className="block px-4 py-2">
                    Last 7 days
                  </a>
                </li>
                <li>
                  <a href="#" className="block px-4 py-2">
                    Last 30 days
                  </a>
                </li>
                <li>
                  <a href="#" className="block px-4 py-2">
                    Last 90 days
                  </a>
                </li>
              </ul>
            </div>
          )}
          <a
            href="#"
            className="uppercase text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Progress report
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProgressCard;
