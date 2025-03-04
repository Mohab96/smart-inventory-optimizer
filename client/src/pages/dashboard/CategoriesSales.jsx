import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/common/Header";
import Sidebar from "../../components/common/Sidebar";
import { selectToken } from "../../store/features/authSlice";
import { fetchProductsExpiringSoon } from "../../store/features/dashboardSlices/expiryDateSlice";
import ExpiryProductsTable from "../../components/tables/ProductsExpiringSoonTable";

const CategoriesSales = () => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const { loading, data, error } = useSelector((state) => state.expiryDate);
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

  console.log("Products Data:", products);

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-y-auto p-4 dark:bg-gray-700">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Expiring Products
          </h2>
          {loading ? (
            <p className="text-white">Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              <ul className="space-y-4 ">
                {products.length > 0 ? (
                  <ExpiryProductsTable products={products} />
                ) : (
                  <p className="text-white">No products found.</p>
                )}
              </ul>
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() =>
                    setPage((prevPage) => Math.max(prevPage - 1, 1))
                  }
                  disabled={page === 1}
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-white">Page {page}</span>
                <button
                  onClick={() => setPage((prevPage) => prevPage + 1)}
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

export default CategoriesSales;
