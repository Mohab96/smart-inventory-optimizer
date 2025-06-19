import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "../../store/features/transactionSlices/transactionSlice";
import { useTheme } from "./ThemeContext";

const TransactionList = () => {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(
    `${new Date().getFullYear() - 1}-01-01`
  );
  const { theme } = useTheme();

  const {
    loading,
    data: transactions,
    error,
  } = useSelector((state) => state.transaction);

  useEffect(() => {
    dispatch(fetchTransactions(selectedDate));
  }, [dispatch, selectedDate]);

  // Calculate summary statistics
  const transactionData = transactions?.data || [];
  const totalTransactions = transactionData.length;
  const totalRevenue = transactionData.reduce(
    (sum, t) => sum + t.amount * t.batch.sellingPrice,
    0
  );
  const positiveTransactions = transactionData.filter(
    (t) => t.amount > 0
  ).length;
  const negativeTransactions = transactionData.filter(
    (t) => t.amount < 0
  ).length;

  return (
    <div className={`min-h-screen p-6 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Transaction Dashboard</h1>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Monitor and analyze your daily transactions</p>
            </div>
            {/* Date Picker */}
            <div className="mt-4 md:mt-0">
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Select Date</label>
              <div className="relative">
                <input
                  type="date"
                  className={`border rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200 hover:border-gray-500 ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Statistics Cards */}
        {!loading && !error && transactionData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className={`flex-1 rounded-xl shadow-xl p-6 border-l-4 border-blue-500 hover:scale-[1.01] transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center">
                <div className={`p-3 rounded-full mr-4 ${theme === 'dark' ? 'bg-blue-900 bg-opacity-50' : 'bg-blue-100'}`}>
                  <svg
                    className="w-6 h-6 text-blue-400"
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
                <div>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Transactions</p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{totalTransactions}</p>
                </div>
              </div>
            </div>

            <div className={`flex-1 rounded-xl shadow-xl p-6 border-l-4 border-green-500 hover:scale-[1.01] transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex flex-row gap-6">
                <div className={`p-3 rounded-full mr-4 ${theme === 'dark' ? 'bg-green-900 bg-opacity-50' : 'bg-green-100'}`}>
                  <svg
                    className="w-6 h-6 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <div>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Revenue</p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>${totalRevenue.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className={`flex-1 rounded-xl shadow-xl p-6 border-l-4 border-emerald-500 hover:scale-[1.01] transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center">
                <div className={`p-3 rounded-full mr-4 ${theme === 'dark' ? 'bg-emerald-900 bg-opacity-50' : 'bg-emerald-100'}`}>
                  <svg
                    className="w-6 h-6 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 11l5-5m0 0l5 5m-5-5v12"
                    />
                  </svg>
                </div>
                <div>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Sales</p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{positiveTransactions}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className={`flex justify-center items-center h-64 rounded-xl shadow-xl border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} font-medium`}>Loading transactions...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className={`bg-red-900 bg-opacity-20 border-l-4 border-red-500 p-4 rounded-lg shadow-xl border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className={`h-5 w-5 ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className={`text-sm ${theme === 'dark' ? 'text-red-300' : 'text-red-600'} font-medium`}>Error loading transactions: {error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && transactionData.length === 0 && (
          <div className={`rounded-xl shadow-xl p-12 text-center border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <svg
              className={`mx-auto h-12 w-12 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'} mb-4`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>No transactions found</h3>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>There are no transactions for the selected date.</p>
          </div>
        )}

        {/* Transactions Table */}
        {!loading && !error && transactionData.length > 0 && (
          <div className={`rounded-xl shadow-xl overflow-hidden border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className={`px-6 py-4 border-b border-${theme === 'dark' ? 'gray-700' : 'gray-200'} bg-${theme === 'dark' ? 'gray-750' : 'gray-50'}`}>
              <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Transaction Details</h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-1`}>{new Date(selectedDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}</p>
            </div>

            <div className="overflow-x-auto">
              <table className={`min-w-full divide-y divide-${theme === 'dark' ? 'gray-700' : 'gray-200'}`}>
                <thead className={`bg-${theme === 'dark' ? 'gray-750' : 'gray-50'}`}>
                  <tr>
                    <th className={`px-6 py-3 text-left text-xs font-medium text-${theme === 'dark' ? 'gray-300' : 'gray-700'} uppercase tracking-wider`}>Product</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium text-${theme === 'dark' ? 'gray-300' : 'gray-700'} uppercase tracking-wider`}>Quantity</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium text-${theme === 'dark' ? 'gray-300' : 'gray-700'} uppercase tracking-wider`}>Unit Price</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium text-${theme === 'dark' ? 'gray-300' : 'gray-700'} uppercase tracking-wider`}>Total Value</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium text-${theme === 'dark' ? 'gray-300' : 'gray-700'} uppercase tracking-wider`}>Type</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium text-${theme === 'dark' ? 'gray-300' : 'gray-700'} uppercase tracking-wider`}>Time</th>
                  </tr>
                </thead>
                <tbody className={`bg-${theme === 'dark' ? 'gray-800' : 'gray-50'} divide-y divide-${theme === 'dark' ? 'gray-700' : 'gray-200'}`}>
                  {transactionData.map((transaction, index) => (
                    <tr
                      key={transaction.transactionId}
                      className={`hover:bg-${theme === 'dark' ? 'gray-750' : 'gray-100'} transition-colors duration-150 ${
                        index % 2 === 0 ? `${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}` : `${theme === 'dark' ? 'bg-gray-825' : 'bg-gray-100'}`
                      }`}
                    >
                      <td className={`px-6 py-4 whitespace-nowrap`}>
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className={`h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                              <span className={`text-${theme === 'dark' ? 'white' : 'gray-900'} font-medium text-sm`}>
                                {transaction.product?.name?.charAt(0) || "P"}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {transaction.product?.name || "Unknown Product"}
                            </div>
                            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              ID: {transaction.transactionId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap`}>
                        <div className="flex items-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              transaction.amount > 0
                                ? `${theme === 'dark' ? 'bg-green-900 bg-opacity-50 text-green-300 border border-green-700' : 'bg-green-100'}`
                                : transaction.amount < 0
                                ? `${theme === 'dark' ? 'bg-red-900 bg-opacity-50 text-red-300 border border-red-700' : 'bg-red-100'}`
                                : `${theme === 'dark' ? 'bg-gray-700 text-gray-300 border border-gray-600' : 'bg-gray-200'}`
                            }`}
                          >
                            {transaction.amount > 0 ? "+" : ""}
                            {transaction.amount}
                          </span>
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        <span className="font-medium">
                          ${transaction.batch.sellingPrice}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        <span
                          className={
                            transaction.amount > 0
                              ? `${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`
                              : transaction.amount < 0
                              ? `${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`
                              : `${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`
                          }
                        >
                          $
                          {(
                            Math.abs(transaction.amount) *
                            transaction.batch.sellingPrice
                          ).toFixed(2)}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap`}>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transaction.amount > 0
                              ? `${theme === 'dark' ? 'bg-green-900 bg-opacity-50 text-green-300 border border-green-700' : 'bg-green-100'}`
                              : `${theme === 'dark' ? 'bg-red-900 bg-opacity-50 text-red-300 border border-red-700' : 'bg-red-100'}`
                          }`}
                        >
                          {transaction.amount > 0 ? (
                            <>
                              <svg
                                className={`w-3 h-3 mr-1 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 11l5-5m0 0l5 5m-5-5v12"
                                />
                              </svg>
                              Sale
                            </>
                          ) : (
                            <>
                              <svg
                                className={`w-3 h-3 mr-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 13l-5 5m0 0l-5-5m5 5V6"
                                />
                              </svg>
                              Return
                            </>
                          )}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {new Date(
                          transaction.date?.fullDate
                        ).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
