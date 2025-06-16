import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/common/Header";
import Sidebar from "../../components/common/Sidebar";
import { selectToken } from "../../store/features/authSlice";
import { fetchCategorySales } from "../../store/features/dashboardSlices/salesSlice";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  LabelList,
} from "recharts";

const CategorySales = () => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken); // Get the token from state
  const { loading, data, error } = useSelector((state) => state.sales); // Use the sales slice
  const categories = data?.data || []; // Extract categories data

  const [page, setPage] = useState(1);
  const limit = 10; // Limit to top 10 categories

  useEffect(() => {
    if (token) {
      dispatch(fetchCategorySales({ page, limit, orderBy: "desc" })); // Fetch category sales
    }
  }, [dispatch, token, page, limit]);

  // Transform data for the chart
  const chartData = categories.map((item) => ({
    name: item.category.categoryName,
    unitsSold: item.totalUnitsSold,
  }));

  // Calculate the highest and lowest values
  const maxUnitsSold = Math.max(...chartData.map((item) => item.unitsSold), 0);
  const minUnitsSold = Math.min(...chartData.map((item) => item.unitsSold), 0);

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Top 10 Category Sales
          </h1>

          {/* Loading and Error States */}
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            </div>
          )}
          {error && <p className="text-center text-red-500">Error: {error}</p>}

          {/* Chart */}
          {!loading && !error && chartData.length > 0 && (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#ccc" }}
                  axisLine={{ stroke: "#ccc" }}
                  tickLine={{ stroke: "#ccc" }}
                />
                <YAxis
                  domain={[maxUnitsSold, minUnitsSold]} // Reverse the domain
                  tick={{ fill: "#ccc" }}
                  axisLine={{ stroke: "#ccc" }}
                  tickLine={{ stroke: "#ccc" }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#bbb", borderRadius: 8 }}
                  labelStyle={{ fontWeight: "bold" }}
                />
                <Legend />
                <Bar dataKey="unitsSold" fill="#fff" barSize={30}>
                  <LabelList dataKey="unitsSold" position="top" fill="#000" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {/* No Data State */}
          {!loading && !error && chartData.length === 0 && (
            <p className="text-center text-gray-500">
              No data available for the selected categories.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategorySales;
