import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectToken } from "../../store/features/authSlice";
import { fetchProductsExpiringSoon } from "../../store/features/dashboardSlices/expiryProductsSlice";
import ExpiryProductsTable from "../../components/tables/ProductsExpiringSoonTable";
import { AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "../../components/common/ThemeContext";

const ExpiryDateProducts = () => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const { theme } = useTheme();
  const { loading, data, error } = useSelector((state) => state.expiryProducts);
  const products = data?.data || [];

  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    if (token) {
      dispatch(fetchProductsExpiringSoon({ page, limit, orderBy: "asc" })).then(
        (result) => {
          if (fetchProductsExpiringSoon.fulfilled.match(result)) {
            // console.log("API Response:", result.payload);
          }
        }
      );
    }
  }, [dispatch, token, page, limit]);

  return (
    <div className={`h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center space-x-3 mb-6">
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Products Expiring Soon
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
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.01] transition-all duration-300 border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Expiry Details</h3>
              </div>
              <div className="overflow-x-auto">
                {products.length > 0 ? (
                  <ExpiryProductsTable products={products} />
                ) : (
                  <div className="p-8 text-center">
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-lg`}>No products found.</p>
                  </div>
                )}
              </div>
              <div className={`px-6 py-4 border-t ${theme === 'dark' ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50/50'}`}>
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
                    disabled={page === 1}
                    className={`inline-flex items-center px-4 py-2 ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} rounded-lg disabled:opacity-50 transition-colors duration-200 ${theme === 'dark' ? 'disabled:hover:bg-gray-700' : 'disabled:hover:bg-gray-200'}`}
                  >
                    <ChevronLeft className="h-5 w-5 mr-2" />
                    Previous
                  </button>
                  <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Page {page}</span>
                  <button
                    onClick={() => setPage((prevPage) => prevPage + 1)}
                    className={`inline-flex items-center px-4 py-2 ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} rounded-lg transition-colors duration-200`}
                  >
                    Next
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpiryDateProducts;
