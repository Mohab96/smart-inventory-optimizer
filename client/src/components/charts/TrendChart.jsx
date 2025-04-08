import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// Custom bar component for styling
const CustomAreaBar = ({ x, y, width, height, fill }) => {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        fillOpacity={0.6}
      />
      <rect
        x={x}
        y={y + height - 4}
        width={width}
        height={4}
        fill={fill}
        fillOpacity={0.9}
      />
    </g>
  );
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label, type }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 p-3 border border-gray-600 rounded shadow-lg">
        <p className="font-bold text-gray-200">{label}</p>
        <p className="text-blue-400">
          {type === "revenue" ? "Revenue" : "Sales"}:{" "}
          <span className="font-bold">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

/**
 * TrendChart Component specialized for Category Trends
 *
 * @param {Object} props
 * @param {Array} props.data - The chart data array
 * @param {string} props.title - Chart title
 * @param {boolean} props.hasData - Whether real data is available
 * @param {Array} props.testData - Fallback test data
 * @param {string} props.type - The type of data ("sales" or "revenue")
 */
const TrendChart = ({
  data,
  title,
  hasData = false,
  testData = [],
  type = "sales",
}) => {
  // Colors specific for Sales visualization
  const colors = {
    barFill: type === "revenue" ? "#34D399" : "#4f46e5", // Green for revenue, Indigo for sales
    lineStroke: type === "revenue" ? "#059669" : "#38bdf8", // Darker green for revenue, Light blue for sales trend line
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow">
      <h2 className="text-xl mb-4"></h2>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={hasData ? data : testData}
            margin={{ top: 10, right: 10, left: 10, bottom: 30 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#374151"
              opacity={0.6}
            />
            <XAxis
              dataKey="month"
              tick={{ fill: "#e5e7eb" }}
              axisLine={{ stroke: "#4b5563" }}
              angle={-45}
              textAnchor="end"
              height={60}
              tickMargin={10}
            />
            <YAxis
              tick={{ fill: "#e5e7eb" }}
              axisLine={{ stroke: "#4b5563" }}
              width={60}
            />
            <Tooltip
              content={(props) => <CustomTooltip {...props} type={type} />}
            />
            <Legend wrapperStyle={{ paddingTop: 10 }} />
            {/* <Bar
              dataKey="value"
              name={type === "revenue" ? "Revenue" : "Sales"}
              fill={colors.barFill}
              shape={<CustomAreaBar />}
            /> */}
            <Line
              type="monotone"
              dataKey="value"
            //   name={type === "revenue" ? "Revenue Trend" : "Sales Trend"}
              stroke={colors.lineStroke}
              strokeWidth={3}
              dot={{
                stroke: colors.lineStroke,
                strokeWidth: 2,
                r: 4,
                fill: "#1e293b",
              }}
              activeDot={{
                stroke: colors.lineStroke,
                strokeWidth: 3,
                r: 6,
                fill: "#1e293b",
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendChart;
