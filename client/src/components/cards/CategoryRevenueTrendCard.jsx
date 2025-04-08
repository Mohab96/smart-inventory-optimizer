import React from "react";
import TrendChart from "../charts/TrendChart";

const CategoryRevenueTrendCard = ({
  loading,
  error,
  chartData,
  getChartTitle,
  hasData,
  selectedYear,
  handleYearChange,
  years,
  handleCategoryChange,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 dark:bg-gray-900 text-white">
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <h1 className="text-2xl font-bold">Revenues Trends</h1>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 ml-auto">
          <select
            className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-700"
            value={selectedYear}
            onChange={handleYearChange}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-xl">Loading trend data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-900 p-4 rounded">
          <p className="text-red-200">Error loading trend data: {error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {/* Using the TrendChart component */}
          <TrendChart
            data={chartData}
            title={getChartTitle()}
            hasData={hasData}
          />

          {/* Debug output */}
          {/* <div className="col-span-1 mt-4 p-4 bg-gray-700 rounded overflow-auto max-h-64 text-sm">
            <h3 className="font-bold mb-2 text-yellow-300">
              Debug Information:
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <span className="font-semibold text-green-300">
                  API Endpoint:
                </span>{" "}
                categoriesSales
              </div>
              <div>
                <span className="font-semibold text-green-300">
                  Selected Category:
                </span>{" "}
                {selectedCategory}
              </div>
              <div>
                <span className="font-semibold text-green-300">
                  Data Available:
                </span>{" "}
                {hasData ? "Yes" : "No"}
              </div>
              <div>
                <span className="font-semibold text-green-300">
                  Month Values:
                </span>{" "}
                {debugDataValues()}
              </div>
              <div>
                <span className="font-semibold text-green-300">
                  Data Length:
                </span>{" "}
                {chartData?.length || 0}
              </div>
              <div>
                <span className="font-semibold text-green-300">
                  Data Source:
                </span>{" "}
                <span className="break-all">
                  {JSON.stringify(
                    data?.categoriesSales?.[selectedCategory] ||
                      "Not available"
                  )}
                </span>
              </div>
              <div className="mt-2">
                <span className="font-semibold text-green-300">
                  Formatted Chart Data:
                </span>
                <pre className="mt-1 text-xs overflow-auto max-h-20">
                  {JSON.stringify(chartData, null, 2)}
                </pre>
              </div>
            </div>
          </div> */}
        </div>
      )}
    </div>
  );
};

export default CategoryRevenueTrendCard;
