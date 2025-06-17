import Header from "../../components/common/Header";
import Sidebar from "../../components/common/Sidebar";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecommendations } from "../../store/features/recommendationSices/recommendationsSlice";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RecommendationPage = () => {
  const dispatch = useDispatch();
  const { loading, data = {}, error } = useSelector((state) => state.recommendation);
  const numberOfProducts = 2;
  const daysOfForecasting = 5;

  useEffect(() => {
    dispatch(fetchRecommendations({ numberOfProducts, daysOfForecasting }));
  }, [dispatch, numberOfProducts, daysOfForecasting]);

  const recommendations = data.data || [];

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
          {loading && (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
          {error && (
            <div className="bg-red-500 bg-opacity-20 p-4 rounded-lg">
              <p className="text-red-400 font-medium">Error: {error}</p>
            </div>
          )}
          {!loading && !error && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Product Predictions</h2>
              
              {recommendations.length === 0 ? (
                <div className="bg-gray-600 p-6 rounded-lg shadow text-center">
                  <p className="text-lg">No recommendations available at this time.</p>
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
                          <p>Product ID: {item.product.id}</p>
                          <p>Last Modified: {new Date(item.product.lastModified).toLocaleDateString()}</p>
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
                          <div className="grid grid-cols-7 gap-1">
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