/* eslint-disable */
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/common/Header";
import { selectToken } from "../../store/features/authSlice";
import { useEffect, useState } from "react";
import { fetchLowStock } from "../../store/features/dashboardSlices/lowStockSlice";
import Sidebar from "../../components/common/Sidebar";
import { AlertTriangle, Package } from "lucide-react";
import QuantityIndicator from "../../components/common/QuantityIndicator";

const LowStockProducts = () => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const {
    loading,
    data: products,
    error,
  } = useSelector((state) => state.lowStock);

  const [page, setPage] = useState(1);
  const limit = 10; // You can also make this dynamic if needed

  // Dispatch fetchExpiryDate when the token or page changes.
  useEffect(() => {
    if (token) {
      dispatch(fetchLowStock({ page, limit, orderBy: "asc" }));
    }
  }, [dispatch, token, page, limit]);

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage((prevPage) => prevPage - 1);
  };

  const getStockStatus = (stock) => {
    if (stock <= 5) return "critical";
    if (stock <= 20) return "low";
    if (stock <= 50) return "medium";
    return "high";
  };

  const getStockStatusColor = (status) => {
    switch (status) {
      case "critical":
        return "bg-red-900/20 text-red-400 border-red-500/50";
      case "low":
        return "bg-orange-900/20 text-orange-400 border-orange-500/50";
      case "medium":
        return "bg-yellow-900/20 text-yellow-400 border-yellow-500/50";
      default:
        return "bg-green-900/20 text-green-400 border-green-500/50";
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center space-x-3 mb-6">
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
            <h2 className="text-2xl font-bold text-white">
              Low Stock Products
            </h2>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 text-red-500">
              {error}
            </div>
          ) : (
            <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.01] transition-all duration-300">
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-xl font-semibold text-white">Low Stock Details</h3>
              </div>
              <div className="overflow-x-auto">
                {products.data && products.data.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Product Details
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Current Stock
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Stock Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                      {products.data.map((product, index) => {
                        const stockStatus = getStockStatus(product.currentStock);
                        const stockStatusColor = getStockStatusColor(stockStatus);
                        return (
                          <tr
                            key={`${product.productId}-${product.dateId}-${index}`}
                            className="hover:bg-gray-700/50 transition-colors duration-200"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-left">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                                    <Package className="h-5 w-5 text-blue-400" />
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-white">
                                    {product.product.name}
                                  </div>
                                  <div className="text-sm text-gray-400">
                                    ID: {product.productId}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <div className="flex items-center justify-center">
                                <QuantityIndicator
                                  quantity={product.currentStock}
                                  size="sm"
                                  showIcon={false}
                                />
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <span
                                className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${stockStatusColor}`}
                              >
                                {stockStatus.charAt(0).toUpperCase() + stockStatus.slice(1)} Stock
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-gray-400 text-lg">No products found.</p>
                  </div>
                )}
              </div>

              {/* Pagination Controls */}
              <div className="mt-6 flex justify-between items-center p-6 border-t border-gray-700">
                <button
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className="inline-flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 hover:bg-gray-600 transition-colors duration-200 disabled:hover:bg-gray-700"
                >
                  Previous
                </button>
                <span className="text-gray-300 font-medium">Page {page}</span>
                <button
                  onClick={handleNextPage}
                  className="inline-flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LowStockProducts;
