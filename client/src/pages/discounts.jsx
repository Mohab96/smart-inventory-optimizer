import { useEffect, useState } from "react";
import Header from "../components/common/Header";
import { Percent, Tag } from "lucide-react";

const DiscountProductCard = ({
  productName = "Product",
  suggestedDiscount = 0,
  categoryName = "-",
  productPrice = 0,
  productPriceAfterDiscount = 0,
  isNew = false,
}) => (
  <div
    className="relative rounded-2xl p-6 shadow-2xl bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl flex flex-col gap-2 min-w-[300px] max-w-xs mx-auto border border-gray-200/40 dark:border-gray-800/70 transition-transform duration-300 hover:scale-[1.03] hover:shadow-2xl animate-fade-in"
    style={{ animation: 'fadeIn 0.7s cubic-bezier(0.4,0,0.2,1)' }}
  >
    {/* Accent bar */}
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-green-400 dark:from-blue-700 dark:via-cyan-600 dark:to-green-500 rounded-t-2xl" />
    {/* Interactive Discount badge with gradient, glow, and animation */}
    <div className="absolute top-4 right-4 z-10 group">
      <div className="flex items-center gap-2 px-4 py-2 rounded-full font-extrabold text-lg shadow-lg border border-blue-300 dark:border-blue-700 bg-gradient-to-r from-blue-500 via-cyan-400 to-green-400 text-white drop-shadow-lg transition-transform duration-200 hover:scale-110 hover:shadow-2xl hover:from-blue-600 hover:to-green-500 focus:outline-none focus:ring-2 focus:ring-blue-400 animate-pulse-slow relative">
        <Percent className="h-6 w-6 text-white drop-shadow" />
        <span className="tracking-tight">{suggestedDiscount}%</span>
      </div>
      <span className="absolute right-0 mt-2 w-max px-2 py-1 rounded bg-gray-900 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg z-20">Suggested Discount</span>
    </div>
    {/* New badge */}
    {isNew && (
      <span className="absolute top-4 left-4 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">NEW</span>
    )}
    {/* Title and category */}
    <div className="mt-2">
      <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 via-cyan-400 to-green-400 dark:from-blue-400 dark:via-cyan-300 dark:to-green-400 bg-clip-text text-transparent tracking-tight leading-tight mb-1 drop-shadow transition-transform duration-200 hover:scale-105 hover:drop-shadow-xl cursor-pointer select-text">
        {productName}
      </h2>
      <p className="text-gray-400 font-medium text-sm">{categoryName}</p>
    </div>
    {/* Price section */}
    <div className="flex items-end gap-3 mt-6">
      <span className="text-lg text-gray-400 line-through">${productPrice?.toFixed ? productPrice.toFixed(2) : productPrice}</span>
      <span className="text-3xl font-bold text-green-600 dark:text-green-400 font-mono drop-shadow-sm">${productPriceAfterDiscount?.toFixed ? productPriceAfterDiscount.toFixed(2) : productPriceAfterDiscount}</span>
      <Tag className="h-6 w-6 text-green-400 dark:text-green-300" />
    </div>
  </div>
);

// Add fade-in and pulse animation to global styles if not present
// @layer utilities { .animate-fade-in { animation: fadeIn 0.7s cubic-bezier(0.4,0,0.2,1); } }
// @keyframes fadeIn { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: none; } }
// @layer utilities { .animate-pulse-slow { animation: pulse 2.2s cubic-bezier(0.4,0,0.6,1) infinite; } }

const Discounts = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await fetch("http://localhost:2000/api/insights/get-discounts?limit=10", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch discounts");
        const data = await response.json();
        setDiscounts(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDiscounts();
  }, []);

  // Helper: mark as new if created in last 3 days (if createdAt exists)
  const isNewDiscount = (item) => {
    if (!item.createdAt) return false;
    const created = new Date(item.createdAt);
    const now = new Date();
    return (now - created) / (1000 * 60 * 60 * 24) < 3;
  };

  return (
    <div className="min-h-screen h-auto flex flex-col bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <div className="flex flex-1">
        <div className="flex flex-col w-full p-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto w-full">
            <div className="mb-8">
              <h1
                className="text-4xl font-extrabold bg-gradient-to-r from-blue-500 via-cyan-400 to-green-400 dark:from-blue-400 dark:via-cyan-300 dark:to-green-400 bg-clip-text text-transparent mb-2 drop-shadow-lg transition-transform duration-200 hover:scale-105 hover:drop-shadow-xl cursor-pointer select-text"
                tabIndex={0}
                aria-label="Discounts"
              >
                Discounts
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Latest discount insights
              </p>
            </div>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin border-t-blue-600 dark:border-t-blue-400"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 dark:text-red-400 font-semibold py-8">{error}</div>
            ) : (
              <div>
                {discounts.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">No discounts found.</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {discounts.map((item, idx) => (
                      <DiscountProductCard
                        key={idx}
                        productName={item.productName || item.name || "Product"}
                        suggestedDiscount={item.suggestedDiscount || item.discountPercent || 0}
                        categoryName={item.categoryName || item.category || "-"}
                        productPrice={item.productPrice || item.price || 0}
                        productPriceAfterDiscount={item.productPriceAfterDiscount || item.priceAfterDiscount || 0}
                        isNew={isNewDiscount(item)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discounts; 