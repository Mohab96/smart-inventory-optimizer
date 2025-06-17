import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/common/Header";
import Sidebar from "../../components/common/Sidebar";
import { selectToken } from "../../store/features/authSlice";
import { fetchCategorySales } from "../../store/features/dashboardSlices/salesSlice";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CategoriesSales = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const { data: categorySales, loading, error } = useSelector((state) => state.sales);

  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    if (token) {
      dispatch(fetchCategorySales({ page, limit, orderBy: "desc" }));
    }
  }, [page, limit, token, dispatch]);

  const chartData = {
    labels: categorySales?.data?.map(item => item.category.categoryName) || [],
    datasets: [
      {
        label: 'Total Units Sold',
        data: categorySales?.data?.map(item => item.totalUnitsSold) || [],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderColor: 'rgb(53, 162, 235)',
        borderWidth: 1,
      },
    ],
  };

  const calculateYAxisScale = (data) => {
    if (!data || data.length === 0) return { min: 0, max: 1000 };
    
    const values = data.map(item => item.totalUnitsSold);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    const padding = (max - min) * 0.1;
    
    return {
      min: Math.max(0, min - padding),
      max: max + padding,
      stepSize: Math.ceil((max - min) / 5)
    };
  };

  const yAxisScale = calculateYAxisScale(categorySales?.data);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
      },
      title: {
        display: true,
        text: 'Category Sales Performance',
        color: 'white',
        font: {
          size: 18,
          weight: 'bold'
        },
        padding: {
          top: 20,
          bottom: 20
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        min: yAxisScale.min,
        max: yAxisScale.max,
        ticks: {
          color: 'white',
          stepSize: yAxisScale.stepSize,
          callback: function(value) {
            return value.toLocaleString();
          },
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        },
      },
      x: {
        ticks: {
          color: 'white',
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        },
      },
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <h2 className="text-3xl font-bold text-white">
            Best Selling Categories
          </h2>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 text-red-500">
              {error}
            </div>
          ) : (
            <>
              {/* Top 3 Categories Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {categorySales?.data?.slice(0, 3).map((item, index) => (
                  <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 200}ms` }}>
                    <div className={`relative rounded-xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300 hover:shadow-blue-500/20 h-full
                      ${index === 0 ? 'bg-gradient-to-r from-blue-600 to-blue-800' : 
                        index === 1 ? 'bg-gradient-to-r from-purple-600 to-purple-800' : 
                        'bg-gradient-to-r from-green-600 to-green-800'}`}>
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwIDIuMjA5LTEuNzkxIDQtNCA0cy00LTEuNzkxLTQtNCAxLjc5MS00IDQtNCA0IDEuNzkxIDQgNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-10"></div>
                      <div className="relative p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-white text-sm font-medium uppercase tracking-wider">
                                {index === 0 ? 'Top Category' : 
                                 index === 1 ? 'Second Place' : 
                                 'Third Place'}
                              </span>
                              <span className="text-white/50 text-xs">
                                #{index + 1}
                              </span>
                            </div>
                            <p className="mt-2 text-2xl font-bold text-white">
                              {item.category.categoryName}
                            </p>
                            <div className="mt-4 flex items-center">
                              <span className="text-white text-xl font-bold">
                                {item.totalUnitsSold.toLocaleString()}
                              </span>
                              <span className="ml-2 text-white/70">units sold</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-center w-16 h-16 bg-white bg-opacity-10 rounded-full animate-pulse">
                            {index === 0 ? (
                              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                              </svg>
                            ) : index === 1 ? (
                              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                              </svg>
                            ) : (
                              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                            )}
                          </div>
                        </div>
                        {index === 0 && categorySales.data[1] && (
                          <div className="mt-4 pt-4 border-t border-white/10">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-white/70">Leading by</span>
                              <span className="text-white font-medium">
                                {(item.totalUnitsSold - categorySales.data[1].totalUnitsSold).toLocaleString()} units
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-6 transform hover:scale-[1.01] transition-all duration-300">
                <Bar data={chartData} options={chartOptions} />
              </div>
              
              <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.01] transition-all duration-300">
                <div className="p-6 border-b border-gray-700">
                  <h3 className="text-xl font-semibold text-white">Detailed Category Breakdown</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Total Units Sold
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {categorySales?.data?.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-700 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {item.category.categoryName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {item.totalUnitsSold.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
                  disabled={page === 1}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 hover:bg-blue-600 transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 disabled:hover:bg-blue-500"
                >
                  Previous
                </button>
                <span className="text-white font-medium">Page {page}</span>
                <button
                  onClick={() => setPage((prevPage) => prevPage + 1)}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 transform hover:scale-105"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoriesSales;
