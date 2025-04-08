import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/common/Header";
import Sidebar from "../../components/common/Sidebar";
import CategorySalesTrendCard from "../../components/cards/CategorySalesTrendCard";
import CategoryRevenueTrendCard from "../../components/cards/CategoryRevenueTrendCard";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategoriesSalesTrends,
  fetchCategoriesRevenuesTrends,
} from "../../store/features/trendSlices/trendSlice";

const TrendVisualizer = () => {
  const dispatch = useDispatch();
  const [selectedYear, setSelectedYear] = useState(2015);
  const [selectedCategory, setSelectedCategory] = useState("vehicle");
  const [salesChartData, setSalesChartData] = useState([]);
  const [revenueChartData, setRevenueChartData] = useState([]);
  const { loading, salesData, revenueData, error } = useSelector(
    (state) => state.trend
  );

  const fetchedOnce = useRef(false);

  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        const salesTrendData = await dispatch(
          fetchCategoriesSalesTrends(selectedYear)
        ).unwrap();
        console.log(`✅ Category Sales Trends:`, salesTrendData);

        // Force the data processing after successful fetch
        processTrendData(salesTrendData, selectedCategory, setSalesChartData);

        const revenueTrendData = await dispatch(
          fetchCategoriesRevenuesTrends(selectedYear)
        ).unwrap();
        console.log(`✅ Category Revenue Trends:`, revenueTrendData);

        // Force the data processing after successful fetch
        processTrendData(
          revenueTrendData,
          selectedCategory,
          setRevenueChartData
        );
      } catch (err) {
        console.error(`❌ Error while fetching category trends:`, err);
      }
    };

    fetchTrendData();
    fetchedOnce.current = true;
  }, [dispatch, selectedYear, selectedCategory]);

  // Also process data whenever Redux state changes
  useEffect(() => {
    if (salesData) {
      processTrendData(salesData, selectedCategory, setSalesChartData);
    }
  }, [salesData, selectedCategory]);

  useEffect(() => {
    if (revenueData) {
      processTrendData(revenueData, selectedCategory, setRevenueChartData);
    }
  }, [revenueData, selectedCategory]);

  // Extract this logic into a separate function for reuse
  const processTrendData = (data, category, setData) => {
    console.log(`Processing category sales data for ${category}:`, data);

    // Extract the appropriate data from the response
    const categoryData = data[category];

    if (!categoryData) {
      console.log("No data available for the selected category");
      setData([]);
      return;
    }

    // Create an array of months in order
    const monthOrder = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ];

    const formattedData = monthOrder.map((month) => {
      const monthValue =
        categoryData[month] !== undefined
          ? typeof categoryData[month] === "string"
            ? parseInt(categoryData[month])
            : categoryData[month]
          : 0;

      return {
        month: month.charAt(0).toUpperCase() + month.slice(1),
        value: monthValue,
      };
    });

    console.log("Formatted data:", formattedData);
    setData(formattedData);
  };

  const years = Array.from(
    { length: new Date().getFullYear() - 2013 + 1 },
    (_, i) => 2013 + i
  ).reverse();

  const handleYearChange = (e) => {
    const year = parseInt(e.target.value);
    setSelectedYear(year);
    fetchedOnce.current = false; // Reset to allow refetching with new year
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // Check if there's any non-zero data
  const hasData = (chartData) =>
    chartData &&
    chartData.length > 0 &&
    chartData.some((item) => item.value > 0);

  // Custom debugger function
  const debugDataValues = (chartData) => {
    if (!chartData || chartData.length === 0) return "No data available";

    return chartData.map((item) => `${item.month}: ${item.value}`).join(", ");
  };

  // Get chart title based on current selections
  const getChartTitle = (category, year, type) => {
    return `${category.charAt(0).toUpperCase() + category.slice(1)} ${type === "revenue" ? "Revenue" : "Sales"} Trends (${year})`;
  };

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 ">
        <Sidebar />
        <div className="flex flex-col w-full">
          <div className="flex-1 w-full">
            <CategorySalesTrendCard
              loading={loading}
              error={error}
              chartData={salesChartData}
              getChartTitle={() =>
                getChartTitle(selectedCategory, selectedYear, "sales")
              }
              hasData={hasData(salesChartData)}
              selectedYear={selectedYear}
              handleYearChange={handleYearChange}
              handleCategoryChange={handleCategoryChange}
              years={years}
            />
          </div>
          <div className="flex-1 w-full">
            <CategoryRevenueTrendCard
              loading={loading}
              error={error}
              chartData={revenueChartData}
              getChartTitle={() =>
                getChartTitle(selectedCategory, selectedYear, "revenue")
              }
              hasData={hasData(revenueChartData)}
              selectedYear={selectedYear}
              handleYearChange={handleYearChange}
              handleCategoryChange={handleCategoryChange}
              years={years}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendVisualizer;
