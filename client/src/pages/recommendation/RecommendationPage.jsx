import Header from "../../components/common/Header";
import Sidebar from "../../components/common/Sidebar";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecommendations } from "../../store/features/recommendationSices/recommendationsSlice";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RecommendationPage = () => {
  const dispatch = useDispatch();
  const { loading, data = {}, error } = useSelector((state) => state.recommendation);
  
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
      sales
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
            <h2 className="text-xl font-semibold mb-4">Recommendation Settings</h2>
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
                  onChange={(e) => setNumberOfProducts(parseInt(e.target.value) || 1)}
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
                  onChange={(e) => setDaysOfForecasting(parseInt(e.target.value) || 1)}
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
                    'Get Recommendations'
                  )}
                </button>
              </div>
            </div>
            
            <div className="mt-3 text-sm text-gray-400">
              <p>• Products: 1-20 items • Forecasting: 1-30 days</p>
            </div>
          </div>

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
                <h2 className="text-2xl font-bold">Product Recommendations</h2>
                <div className="text-sm text-gray-400">
                  Showing {recommendations.length} products • {daysOfForecasting} days forecast
                </div>
              </div>
              
              {recommendations.length === 0 ? (
                <div className="bg-gray-600 p-8 rounded-lg shadow text-center">
                  <div className="text-gray-300 mb-2">
                    <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium">No recommendations available</p>
                  <p className="text-gray-400 mt-1">Try adjusting your search parameters above</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {recommendations.map((item, index) => (
                    <div key={index} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                      <div className="p-5 border-b border-gray-700">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-xl font-semibold">{item.product.name}</h3>
                          <span className="bg-blue-500 text-xs px-2 py-1 rounded-full">
                            {item.product.category.name}
                          </span>
                        </div>
                        <div className="text-sm text-gray-400">
                          <p>Product ID: {item.product.productId}</p>
                          <p>Category Name: {item.product.category.categoryName}</p>
                        </div>
                      </div>
                      
                      <div className="p-5">
                        <div className="mb-4">
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">Daily Sales Overview</span>
                            <span className="text-green-400 font-bold">
                              Total: {item.totalAmount}
                            </span>
                          </div>
                          
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart
                                data={prepareChartData(item.dailySales)}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                <XAxis dataKey="day" stroke="#999" />
                                <YAxis stroke="#999" />
                                <Tooltip 
                                  contentStyle={{ backgroundColor: '#2d3748', borderColor: '#4a5568' }} 
                                  labelStyle={{ color: '#e2e8f0' }}
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
                        
                        <div className="mt-4">
                          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${Math.min(item.dailySales.length, 7)}, 1fr)` }}>
                            {item.dailySales.map((sale, i) => (
                              <div key={i} className="flex flex-col items-center">
                                <div className="text-xs text-gray-400">Day {i+1}</div>
                                <div className={`text-sm font-medium ${sale > (item.totalAmount / item.dailySales.length) ? 'text-green-400' : 'text-yellow-400'}`}>
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
