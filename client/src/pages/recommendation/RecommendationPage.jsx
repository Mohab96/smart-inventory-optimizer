import Header from "../../components/common/Header";
import Sidebar from "../../components/common/Sidebar";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecommendations } from "../../store/features/recommendationSices/recommendationsSlice";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const RecommendationPage = () => {
  const dispatch = useDispatch();
  const {
    loading,
    data = {},
    error,
  } = useSelector((state) => state.recommendation);

  // State for user inputs
  const [numberOfProducts, setNumberOfProducts] = useState(2);
  const [daysOfForecasting, setDaysOfForecasting] = useState(5);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);

  useEffect(() => {
    // Initial load with default values
    if (!hasInitialLoad) {
      dispatch(fetchRecommendations({ numberOfProducts, daysOfForecasting }));
      setHasInitialLoad(true);
    }
  }, [dispatch, numberOfProducts, daysOfForecasting, hasInitialLoad]);

  const recommendations = data.data || [];

  const handleFetchRecommendations = () => {
    dispatch(fetchRecommendations({ numberOfProducts, daysOfForecasting }));
  };

  const prepareChartData = (dailySales) => {
    return dailySales.map((sales, index) => ({
      day: `Day ${index + 1}`,
      sales,
    }));
  };

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className="flex-1 overflow-y-auto p-6 dark:bg-gray-700 text-white">
          {/* Input Controls Section */}
          <div className="bg-gray-800 rounded-lg p-6 mb-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              Recommendation Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Number of Products
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={numberOfProducts}
                  onChange={(e) =>
                    setNumberOfProducts(parseInt(e.target.value) || 1)
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter number of products"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Days of Forecasting
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={daysOfForecasting}
                  onChange={(e) =>
                    setDaysOfForecasting(parseInt(e.target.value) || 1)
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter forecasting days"
                />
              </div>

              <div>
                <button
                  onClick={handleFetchRecommendations}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Loading...
                    </>
                  ) : (
                    "Get Recommendations"
                  )}
                </button>
              </div>
            </div>

            <div className="mt-3 text-sm text-gray-400">
              <p>• Products: 1-20 items • Forecasting: 1-30 days</p>
            </div>
          </div>

          {/* Chart Explanation Section */}
          {!loading && !error && recommendations.length > 0 && (
            <div className="bg-blue-900 bg-opacity-30 rounded-lg p-4 mb-6 border border-blue-500">
              <div className="flex items-start space-x-3">
                <div className="text-blue-400 mt-1">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-300 mb-2">
                    Understanding Your Sales Forecasts
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    The line charts below show predicted daily sales for each
                    product over your selected forecasting period. Each point on
                    the line represents the expected sales volume for that
                    specific day, helping you identify trends and plan inventory
                    accordingly.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-300">Fetching recommendations...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-500 bg-opacity-20 p-4 rounded-lg border border-red-500">
              <p className="text-red-400 font-medium">Error: {error}</p>
            </div>
          )}

          {/* Results Section */}
          {!loading && !error && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Product Predictions</h2>
                <div className="text-sm text-gray-400">
                  Showing {recommendations.length} products •{" "}
                  {daysOfForecasting} days forecast
                </div>
              </div>

              {recommendations.length === 0 ? (
                <div className="bg-gray-600 p-8 rounded-lg shadow text-center">
                  <div className="text-gray-300 mb-2">
                    <svg
                      className="w-16 h-16 mx-auto mb-4 opacity-50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <p className="text-lg font-medium">
                    No recommendations available
                  </p>
                  <p className="text-gray-400 mt-1">
                    Try adjusting your search parameters above
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {recommendations.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 rounded-lg shadow-lg overflow-hidden"
                    >
                      <div className="p-5 border-b border-gray-700">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-xl font-semibold">
                              {item.product.name}
                            </h3>
                            {/* Fixed Tooltip */}
                            <div className="group relative">
                              <svg
                                className="w-4 h-4 text-gray-400 cursor-help"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap shadow-lg border border-gray-700">
                                Sales forecast trend over {daysOfForecasting}{" "}
                                days
                                {/* Tooltip arrow pointing left */}
                                <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-gray-900"></div>
                              </div>
                            </div>
                          </div>
                          <span className="bg-blue-500 text-xs px-2 py-1 rounded-full">
                            {item.product.category.name}
                          </span>
                        </div>
                        <div className="text-sm text-gray-400">
                          <p>Product ID: {item.product.productId}</p>
                          <p>
                            Category Name: {item.product.category.categoryName}
                          </p>
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="mb-4">
                          <div className="flex justify-between mb-2">
                            <div>
                              <span className="font-medium">
                                Sales Forecast Trend
                              </span>
                              <p className="text-xs text-gray-400 mt-1">
                                Line chart showing predicted daily sales over{" "}
                                {daysOfForecasting} days. Rising trends indicate
                                increasing demand.
                              </p>
                            </div>
                            <span className="text-green-400 font-bold">
                              Total: {item.totalAmount}
                            </span>
                          </div>

                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart
                                data={prepareChartData(item.dailySales)}
                                margin={{
                                  top: 5,
                                  right: 30,
                                  left: 20,
                                  bottom: 5,
                                }}
                              >
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  stroke="#444"
                                />
                                <XAxis dataKey="day" stroke="#999" />
                                <YAxis stroke="#999" />
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: "#2d3748",
                                    borderColor: "#4a5568",
                                    borderRadius: "8px",
                                    border: "1px solid #4a5568",
                                  }}
                                  labelStyle={{ color: "#e2e8f0" }}
                                  formatter={(value, name) => [
                                    `${value} units`,
                                    "Predicted Sales",
                                  ]}
                                  labelFormatter={(label) =>
                                    `${label} - Forecast`
                                  }
                                />
                                <Legend />
                                <Line
                                  type="monotone"
                                  dataKey="sales"
                                  stroke="#3b82f6"
                                  strokeWidth={2}
                                  activeDot={{ r: 8 }}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Chart Guide */}
                        <div className="mt-4 p-3 bg-gray-700 rounded-lg">
                          <h4 className="text-sm font-medium mb-2 text-gray-300">
                            Chart Guide
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-400">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-0.5 bg-blue-500"></div>
                              <span>Sales trend line</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span>Daily forecast points</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-green-400">●</span>
                              <span>Above average days</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-yellow-400">●</span>
                              <span>Below average days</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div
                            className="grid gap-1"
                            style={{
                              gridTemplateColumns: `repeat(${Math.min(
                                item.dailySales.length,
                                7
                              )}, 1fr)`,
                            }}
                          >
                            {item.dailySales.map((sale, i) => (
                              <div
                                key={i}
                                className="flex flex-col items-center"
                              >
                                <div className="text-xs text-gray-400">
                                  Day {i + 1}
                                </div>
                                <div
                                  className={`text-sm font-medium ${
                                    sale >
                                    item.totalAmount / item.dailySales.length
                                      ? "text-green-400"
                                      : "text-yellow-400"
                                  }`}
                                >
                                  {sale}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendationPage;
