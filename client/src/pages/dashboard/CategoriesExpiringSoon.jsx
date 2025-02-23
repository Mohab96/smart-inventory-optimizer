import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/common/Header";
import { selectToken } from "../../store/features/authSlice";
import { fetchCategoriesExpiringSoon } from "../../store/features/dashboardSlices/expiryDateSlice";

const CategoriesExpiringSoon = () => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const {
    loading,
    data: products,
    error,
  } = useSelector((state) => state.expiryDate);

  const [page, setPage] = useState(1);
  const limit = 10; // You can also make this dynamic if needed

  // Dispatch fetchExpiryDate when the token or page changes.
  useEffect(() => {
    if (token) {
      dispatch(fetchCategoriesExpiringSoon({ page, limit, orderBy: "asc" }));
    }
  }, [dispatch, token, page, limit]);

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage((prevPage) => prevPage - 1);
  };

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`w-64 z-40 h-full p-4 overflow-y-auto transition-transform ${
            true ? "translate-x-0" : "-translate-x-full"
          } bg-white dark:bg-gray-800`}
        >
          <h5 className="text-base font-semibold text-gray-200 uppercase dark:text-gray-400">
            Menu
          </h5>
          <ul className="mt-4 space-y-2 font-medium">
            <li>
              <a
                href="#"
                className="block p-2 rounded-lg text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Dashboard
              </a>
            </li>
            <li>
              <button className="block w-full p-2 text-left rounded-lg text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                Report
              </button>
            </li>
            <li>
              <button className="block w-full p-2 text-left text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                Transactions
              </button>
            </li>
            <li>
              <button className="block w-full p-2 text-left rounded-lg text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                Trend Visualizer
              </button>
            </li>
            <li>
              <button className="block w-full p-2 text-left rounded-lg text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                Add product
              </button>
            </li>
            <li>
              <button className="block w-full p-2 text-left rounded-lg text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                About
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4 dark:bg-gray-700">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Categories Expiring Soon
          </h2>
          {loading ? (
            <p className="text-white">Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              <ul className="space-y-4">
                {products && products.length > 0 ? (
                  products.map((product) => (
                    <li
                      key={product.id}
                      className="p-4 bg-white dark:bg-gray-800 rounded shadow"
                    >
                      <p className="font-bold">{product.name}</p>
                      <p>Expiry Date: {product.expiryDate}</p>
                    </li>
                  ))
                ) : (
                  <p className="text-white">No products found.</p>
                )}
              </ul>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoriesExpiringSoon;
