import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectToken } from "../../store/features/authSlice";
import { fetchCategoriesExpiringSoon } from "../../store/features/dashboardSlices/expiryDateSlice";
import CategoriesExpiringSoonTable from "../../components/tables/CategoriesExpiringSoonTable";
import { AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "../../components/common/ThemeContext";

const CategoriesExpiringSoon = () => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const { theme } = useTheme();
  const {
    loading,
    data: categories,
    error,
  } = useSelector((state) => state.expiryDate);

  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    if (token) {
      dispatch(fetchCategoriesExpiringSoon({ page, limit, orderBy: "asc" }));
    }
  }, [dispatch, token, page, limit]);

  const handleNextPage = () => setPage((prevPage) => prevPage + 1);
  const handlePrevPage = () => page > 1 && setPage((prevPage) => prevPage - 1);

  return (
    <div className={`h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center space-x-3 mb-6">
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Categories Expiring Soon
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
          ) : categories?.data?.length > 0 ? (
            <div className="space-y-6">
              {categories.data.map((category) => (
                <div 
                  key={category.categoryId} 
                  className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.01] transition-all duration-300 border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
                >
                  <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {category.categoryName}
                    </h3>
                  </div>
                  <CategoriesExpiringSoonTable
                    products={
                      category.products?.map((product) => ({
                        productId: product.productId,
                        productName: product.productName,
                        expiryDate:
                          product.batches?.length > 0
                            ? product.batches[0].expiryDate
                            : "N/A",
                        quantity:
                          product.batches?.length > 0
                            ? product.batches[0].quantity
                            : "N/A",
                      })) || []
                    }
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl p-8 text-center border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-lg`}>No categories found.</p>
            </div>
          )}

          {/* Pagination Controls */}
          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className={`inline-flex items-center px-4 py-2 ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} rounded-lg disabled:opacity-50 transition-colors duration-200 ${theme === 'dark' ? 'disabled:hover:bg-gray-700' : 'disabled:hover:bg-gray-200'}`}
            >
              <ChevronLeft className="h-5 w-5 mr-2" />
              Previous
            </button>
            <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Page {page}</span>
            <button
              onClick={handleNextPage}
              className={`inline-flex items-center px-4 py-2 ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} rounded-lg transition-colors duration-200`}
            >
              Next
              <ChevronRight className="h-5 w-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesExpiringSoon;
