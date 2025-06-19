import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectToken } from "../../store/features/authSlice";
import Header from "../../components/common/Header";
import Sidebar from "../../components/common/Sidebar";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { ShoppingBag } from "lucide-react";
import { useTheme } from "../../components/common/ThemeContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CategoriesSales = () => {
  const { theme } = useTheme();
  const token = useSelector(selectToken);
  const [categorySales, setCategorySales] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchCategorySales = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/categories/sales?page=${page}&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch category sales");
        }

        const data = await response.json();
        setCategorySales(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchCategorySales();
    }
  }, [token, page]);

  const calculateYAxisScale = (data) => {
    if (!data || data.length === 0) return { min: 0, max: 100, stepSize: 20 };
    
    const maxValue = Math.max(...data.map(item => item.totalUnitsSold));
    const minValue = Math.min(...data.map(item => item.totalUnitsSold));
    
    const range = maxValue - minValue;
    const stepSize = Math.ceil(range / 5);
    
    return {
      min: Math.max(0, minValue - stepSize),
      max: maxValue + stepSize,
      stepSize: stepSize
    };
  };

  const yAxisScale = calculateYAxisScale(categorySales?.data || []);

  const chartData = {
    labels: categorySales?.data?.map((item) => item.category.categoryName) || [],
    datasets: [
      {
        label: "Units Sold",
        data: categorySales?.data?.map((item) => item.totalUnitsSold) || [],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(147, 51, 234, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(236, 72, 153, 0.8)",
          "rgba(14, 165, 233, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(251, 146, 60, 0.8)",
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(147, 51, 234, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(245, 158, 11, 1)",
          "rgba(239, 68, 68, 1)",
          "rgba(139, 92, 246, 1)",
          "rgba(236, 72, 153, 1)",
          "rgba(14, 165, 233, 1)",
          "rgba(34, 197, 94, 1)",
          "rgba(251, 146, 60, 1)",
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Category Sales Performance",
        color: theme === 'dark' ? 'white' : '#1f2937',
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
          color: theme === 'dark' ? 'white' : '#1f2937',
          stepSize: yAxisScale.stepSize,
          callback: function(value) {
            return value.toLocaleString();
          },
          font: {
            size: 12
          }
        },
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
      },
      x: {
        ticks: {
          color: theme === 'dark' ? 'white' : '#1f2937',
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 12
          }
        },
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
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
    <div className="min-h-screen h-auto flex flex-col bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <div className="flex flex-1 pt-16">
        <div className="sticky top-16 h-[calc(100vh-4rem)] z-30">
          <Sidebar />
        </div>
        <div className="flex flex-col w-full p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full">
            <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-8`}>
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

                <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg mb-6 transform hover:scale-[1.01] transition-all duration-300 border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                  <Bar data={chartData} options={chartOptions} />
                </div>
                
                <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.01] transition-all duration-300 border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Detailed Category Breakdown</h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {categorySales?.data?.map((item, index) => (
                        <div
                          key={index}
                          className={`relative ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/90 border-gray-800/70' : 'bg-gradient-to-br from-gray-50/90 via-white/80 to-gray-50/90 border-gray-200/70'} rounded-2xl shadow-2xl border p-6 flex flex-col items-center gap-3 hover:scale-[1.04] hover:-translate-y-1 hover:shadow-blue-500/30 backdrop-blur-md transition-all duration-300 group`}
                        >
                          {/* Colored Accent Bar */}
                          <div className="absolute left-0 top-4 bottom-4 w-2 rounded-full bg-gradient-to-b from-blue-500 via-purple-500 to-emerald-400 group-hover:from-blue-400 group-hover:to-emerald-300 transition-all duration-300"></div>
                          {/* Icon */}
                          <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-blue-900/80 rounded-full p-2 shadow-lg border border-blue-700">
                            <ShoppingBag className="h-7 w-7 text-blue-300" />
                          </div>
                          <div className="flex items-center gap-2 mb-2 mt-6">
                            <span className="text-lg font-semibold text-blue-400 capitalize tracking-wide drop-shadow">{item.category.categoryName}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-2xl font-bold text-emerald-300 drop-shadow">{item.totalUnitsSold.toLocaleString()}</span>
                            <span className="text-emerald-200 text-lg">units</span>
                          </div>
                        </div>
                      ))}
                    </div>
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
                  <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Page {page}</span>
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
    </div>
  );
};

export default CategoriesSales;
