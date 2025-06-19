import React, { useEffect, useRef, useState } from "react";
import CategorySalesTrendCard from "../../components/cards/CategorySalesTrendCard";
import CategoryRevenueTrendCard from "../../components/cards/CategoryRevenueTrendCard";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategoriesSalesTrends,
  fetchCategoriesRevenuesTrends,
  fetchProductsSalesTrends,
  fetchProductsRevenuesTrends,
} from "../../store/features/trendSlices/trendSlice";

const TrendVisualizer = () => {
  const dispatch = useDispatch();
  // Separate year state for each chart group
  const [categorySalesYear, setCategorySalesYear] = useState(2025);
  const [categoryRevenueYear, setCategoryRevenueYear] = useState(2025);
  const [productSalesYear, setProductSalesYear] = useState(2025);
  const [productRevenueYear, setProductRevenueYear] = useState(2025);

  const [salesChartData, setSalesChartData] = useState([]);
  const [revenueChartData, setRevenueChartData] = useState([]);
  const [productSalesChartData, setProductSalesChartData] = useState([]);
  const [productRevenueChartData, setProductRevenueChartData] = useState([]);
  const { loading, salesData, revenueData, error } = useSelector(
    (state) => state.trend
  );

  const fetchedOnce = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const salesTrendData = await dispatch(
          fetchCategoriesSalesTrends(categorySalesYear)
        ).unwrap();
        processTrendData(salesTrendData, setSalesChartData);
      } catch (err) {
        console.error("❌ Error while fetching category sales trends:", err);
      }
    };
    fetchData();
  }, [dispatch, categorySalesYear]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const revenueTrendData = await dispatch(
          fetchCategoriesRevenuesTrends(categoryRevenueYear)
        ).unwrap();
        processTrendData(revenueTrendData, setRevenueChartData);
      } catch (err) {
        console.error("❌ Error while fetching category revenue trends:", err);
      }
    };
    fetchData();
  }, [dispatch, categoryRevenueYear]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productSalesTrendData = await dispatch(
          fetchProductsSalesTrends(productSalesYear)
        ).unwrap();
        processProductTrendData(productSalesTrendData, setProductSalesChartData);
      } catch (err) {
        console.error("❌ Error while fetching product sales trends:", err);
      }
    };
    fetchData();
  }, [dispatch, productSalesYear]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRevenueTrendData = await dispatch(
          fetchProductsRevenuesTrends(productRevenueYear)
        ).unwrap();
        processProductTrendData(productRevenueTrendData, setProductRevenueChartData);
      } catch (err) {
        console.error("❌ Error while fetching product revenue trends:", err);
      }
    };
    fetchData();
  }, [dispatch, productRevenueYear]);

  // Also process data whenever Redux state changes
  useEffect(() => {
    if (salesData) {
      processTrendData(salesData, setSalesChartData);
    }
  }, [salesData]);

  useEffect(() => {
    if (revenueData) {
      processTrendData(revenueData, setRevenueChartData);
    }
  }, [revenueData]);

  // Process category trend data
  const processTrendData = (data, setData) => {
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

    // Process data for each category
    const categories = ["Groceries", "Sports Equipment", "Footwear"];
    const formattedData = monthOrder.map((month) => {
      const monthData = {
        month: month.charAt(0).toUpperCase() + month.slice(1),
      };

      // Add data for each category
      categories.forEach((category) => {
        const categoryData = data[category];
        if (categoryData) {
          monthData[category] = categoryData[month] !== undefined
            ? typeof categoryData[month] === "string"
              ? parseInt(categoryData[month])
              : categoryData[month]
            : 0;
        } else {
          monthData[category] = 0;
        }
      });

      return monthData;
    });

    setData(formattedData);
  };

  // Process product trend data
  const processProductTrendData = (data, setData) => {
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

    // Get the top 3 products
    const products = Object.keys(data)
      .map(product => ({
        name: product,
        total: Object.values(data[product]).reduce((sum, v) => sum + Number(v), 0)
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 3)
      .map(p => p.name);
    
    const formattedData = monthOrder.map((month) => {
      const monthData = {
        month: month.charAt(0).toUpperCase() + month.slice(1),
      };

      // Add data for each product
      products.forEach((product) => {
        const productData = data[product];
        if (productData) {
          monthData[product] = productData[month] !== undefined
            ? typeof productData[month] === "string"
              ? parseInt(productData[month])
              : productData[month]
            : 0;
        } else {
          monthData[product] = 0;
        }
      });

      return monthData;
    });

    setData(formattedData);
  };

  // Years array with only 2023, 2024, and 2025
  const years = [2025, 2024, 2023];

  // Check if there's any non-zero data
  const hasData = (chartData) =>
    chartData &&
    chartData.length > 0 &&
    chartData.some((item) => 
      Object.values(item).some(value => typeof value === 'number' && value > 0)
    );

  // Get chart title based on current selections
  const getChartTitle = (type, isProduct = false) => {
    return `${isProduct ? 'Product' : 'Category'} ${type === "revenue" ? "Revenue" : "Sales"} Trends`;
  };

  // Colors for categories and products
  const categoryColors = {
    Groceries: "#4f46e5",
    "Sports Equipment": "#38bdf8",
    Footwear: "#34D399",
  };
  // For products, generate colors dynamically (fallback to default if not enough)
  const productColors = [
    "#eab308", // Amber
    "#f472b6", // Pink
    "#f87171", // Red
    "#10b981", // Emerald
    "#6366f1", // Indigo
    "#06b6d4", // Cyan
  ];

  // Get top 3 product names for the current product data
  const productLineKeys = productSalesChartData[0]
    ? Object.keys(productSalesChartData[0]).filter((k) => k !== "month")
    : [];
  const productColorMap = productLineKeys.reduce((acc, key, idx) => {
    acc[key] = productColors[idx % productColors.length];
    return acc;
  }, {});

  // Category line keys
  const categoryLineKeys = Object.keys(categoryColors);

  // Debug: Log processed chart data
  useEffect(() => {
    console.log('Sales Chart Data:', salesChartData);
    console.log('Revenue Chart Data:', revenueChartData);
    console.log('Product Sales Chart Data:', productSalesChartData);
    console.log('Product Revenue Chart Data:', productRevenueChartData);
  }, [salesChartData, revenueChartData, productSalesChartData, productRevenueChartData]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-1 ">
        <div className="flex flex-col w-full">
          <div className="flex-1 w-full">
            <CategorySalesTrendCard
              loading={loading}
              error={error}
              chartData={salesChartData}
              getChartTitle={() => getChartTitle("sales")}
              hasData={hasData(salesChartData)}
              selectedYear={categorySalesYear}
              handleYearChange={e => setCategorySalesYear(Number(e.target.value))}
              years={years}
              lineKeys={categoryLineKeys}
              colors={categoryColors}
            />
          </div>
          <div className="flex-1 w-full">
            <CategoryRevenueTrendCard
              loading={loading}
              error={error}
              chartData={revenueChartData}
              getChartTitle={() => getChartTitle("revenue")}
              hasData={hasData(revenueChartData)}
              selectedYear={categoryRevenueYear}
              handleYearChange={e => setCategoryRevenueYear(Number(e.target.value))}
              years={years}
              lineKeys={categoryLineKeys}
              colors={categoryColors}
            />
          </div>
          <div className="flex-1 w-full">
            <CategorySalesTrendCard
              loading={loading}
              error={error}
              chartData={productSalesChartData}
              getChartTitle={() => getChartTitle("sales", true)}
              hasData={hasData(productSalesChartData)}
              selectedYear={productSalesYear}
              handleYearChange={e => setProductSalesYear(Number(e.target.value))}
              years={years}
              lineKeys={productLineKeys}
              colors={productColorMap}
            />
          </div>
          <div className="flex-1 w-full">
            <CategoryRevenueTrendCard
              loading={loading}
              error={error}
              chartData={productRevenueChartData}
              getChartTitle={() => getChartTitle("revenue", true)}
              hasData={hasData(productRevenueChartData)}
              selectedYear={productRevenueYear}
              handleYearChange={e => setProductRevenueYear(Number(e.target.value))}
              years={years}
              lineKeys={productLineKeys}
              colors={productColorMap}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendVisualizer;
