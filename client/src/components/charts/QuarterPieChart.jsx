import Chart from "react-apexcharts";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchRevenuesPerQuarter } from "../../store/features/dashboardSlices/revenueSlice";

export default function QuarterPieChart() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      dispatch(fetchRevenuesPerQuarter({ year: selectedYear }));
    }
  }, [dispatch, token, selectedYear]);

  const { loading, quarterlyData: revenue } = useSelector(
    (state) => state.revenue
  );

  // Ensure revenue data exists before accessing it
  const chatData = revenue?.data?.quarterlyRevenue || [];

//   console.log("Quarterly Revenue Data:", chatData);

  // Ensure data exists before mapping
  const chartSeries = chatData.map((quarter) => Number(quarter.totalRevenue)); // Convert to number
  const chartLabels = chatData.map((quarter) => `Q${quarter.quarter}`); // Use actual quarter numbers

  const chartOptions = {
    chart: { type: "pie", zoom: { enabled: false } },
    labels: chartLabels,
    colors: ["#3b82f6", "#22d3ee", "#fbbf24", "#ef4444"].slice(
      0,
      chatData.length
    ), // Trim colors
  };

  return (
    <div className="p-4 w-full dark:bg-gray-800 rounded-lg text-gray-200">
      <div className="h-full flex flex-col justify-center items-center">
        {loading ? (
          <p>Loading...</p>
        ) : chatData.length === 0 ? (
          <p>No data available</p>
        ) : (
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="pie"
            height={400}
          />
        )}
      </div>
    </div>
  );

}
