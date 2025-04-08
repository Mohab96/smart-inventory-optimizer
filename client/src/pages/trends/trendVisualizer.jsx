import { useEffect, useRef, useState } from "react";
import Header from "../../components/common/Header";
import Sidebar from "../../components/common/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategoriesSalesTrends,
  fetchProductsSalesTrends,
  fetchCategoriesRevenuesTrends,
  fetchProductsRevenuesTrends,
} from "../../store/features/trendSlices/trendSlice";
import ColChart from "../../components/charts/ColChart";

const TrendVisualizer = () => {
  const dispatch = useDispatch();
  const [selectedYear, setSelectedYear] = useState(2015);
  const { loading, data, error } = useSelector((state) => state.trend);

  const fetchedOnce = useRef(false);

  useEffect(() => {
    if (fetchedOnce.current) return; // prevent double-fetch in dev

    const fetchAllTrends = async () => {
      try {
        const categoriesSalesRes = await dispatch(
          fetchCategoriesSalesTrends(selectedYear)
        ).unwrap();
        console.log("✅ Categories Sales Trends:", categoriesSalesRes);

        const productsSalesRes = await dispatch(
          fetchProductsSalesTrends(selectedYear)
        ).unwrap();
        console.log("✅ Products Sales Trends:", productsSalesRes);

        const categoriesRevenueRes = await dispatch(
          fetchCategoriesRevenuesTrends(selectedYear)
        ).unwrap();
        console.log("✅ Categories Revenues Trends:", categoriesRevenueRes);

        const productsRevenueRes = await dispatch(
          fetchProductsRevenuesTrends(selectedYear)
        ).unwrap();
        console.log("✅ Products Revenues Trends:", productsRevenueRes);
      } catch (err) {
        console.error("❌ Error while fetching trends:", err);
      }
    };

    fetchAllTrends();
    fetchedOnce.current = true;
  }, [dispatch, selectedYear]);

  // Helpers to convert data to chart format
  const formatTrendData = (source) =>
    Object.entries(source || {}).map(([month, value]) => ({
      month: month.charAt(0).toUpperCase() + month.slice(1),
      value,
    }));

  const categoriesSalesData = formatTrendData(data?.categoriesSales?.vehicle);
  const productsSalesData = formatTrendData(
    data?.productsSales?.["Ford Escape 2014"]
  );
  const categoriesRevenueData = formatTrendData(
    data?.categoriesRevenues?.vehicle
  );
  const productsRevenueData = formatTrendData(
    data?.productsRevenues?.["Mercedes-Benz E-Class 2013"]
  );

  const years = Array.from(
    { length: new Date().getFullYear() - 2013 + 1 },
    (_, i) => 2013 + i
  ).reverse();

  // Use the categoriesSalesData to map to chartData
  const chartData = categoriesSalesData.map(({ month, value }) => ({
    name: month,
    value,
  }));

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-y-auto p-4 dark:bg-gray-900 text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Year Dropdown */}
            <div className="relative mb-4">
              <button
                className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white inline-flex items-center"
                type="button"
              >
                Year: {selectedYear}
                <svg
                  className="w-2.5 m-2.5 ms-1.5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <div className="absolute right-0 z-10 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700">
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                  {years.map((year) => (
                    <li key={year}>
                      <button
                        className="w-full text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={() => setSelectedYear(year)}
                      >
                        {year}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ColChart Component */}
            <ColChart
              title="Categories Sales Trends"
              value="3.4k"
              subtitle="Sales Trends per Month"
              percentage="42.5%"
              stats={[
                { label: "Money spent:", value: "$3,232" },
                { label: "Conversion rate:", value: "1.2%" },
              ]}
              chartData={chartData}
              selectedYear={selectedYear} // Pass selectedYear here
              onYearChange={setSelectedYear} // Pass onYearChange function here
              years={years} // Pass years here
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendVisualizer;
