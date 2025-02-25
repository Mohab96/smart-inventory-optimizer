import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/common/Header";
import { selectToken } from "../../store/features/authSlice";
import { fetchCategoriesExpiringSoon } from "../../store/features/dashboardSlices/expiryDateSlice";
import Sidebar from "../../components/common/Sidebar";
import CategoriesExpiringSoonTable from "../../components/tables/CategoriesExpiringSoonTable";

const CategoriesExpiringSoon = () => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
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
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className="flex-1 overflow-y-auto p-4 dark:bg-gray-700">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Categories Expiring Soon
          </h2>

          {loading ? (
            <p className="text-white">Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : categories?.data?.length > 0 ? (
            categories.data.map((category) => (
              <div key={category.categoryId} className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  {category.categoryName}
                </h3>
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
            ))
          ) : (
            <p className="text-white">No categories found.</p>
          )}

          {/* Pagination Controls */}
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-white">Page {page}</span>
            <button
              onClick={handleNextPage}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesExpiringSoon;
