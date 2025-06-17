import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 p-3 border border-gray-600 rounded shadow-lg">
        <p className="font-bold text-gray-200">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: <span className="font-bold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/**
 * TrendChart Component specialized for Category/Product Trends
 *
 * @param {Object} props
 * @param {Array} props.data - The chart data array
 * @param {string} props.title - Chart title
 * @param {boolean} props.hasData - Whether real data is available
 * @param {Array} props.testData - Fallback test data
 * @param {Array} props.lineKeys - Array of keys to plot as lines
 * @param {Object} props.colors - Object mapping key to color
 */
const TrendChart = ({
  data,
  title,
  hasData = false,
  testData = [],
  lineKeys = [],
  colors = {},
}) => {
  // Debug log
  console.log('TrendChart data:', data);
  console.log('TrendChart lineKeys:', lineKeys);
  console.log('TrendChart colors:', colors);

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow">
      <h2 className="text-xl mb-4">{title}</h2>
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
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: 10 }} />
            {/* Line for each key (category or product) */}
            {lineKeys.map((key) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={key}
                stroke={colors[key] || "#8884d8"}
                strokeWidth={3}
                dot={{
                  stroke: colors[key] || "#8884d8",
                  strokeWidth: 2,
                  r: 4,
                  fill: "#1e293b",
                }}
                activeDot={{
                  stroke: colors[key] || "#8884d8",
                  strokeWidth: 3,
                  r: 6,
                  fill: "#1e293b",
                }}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendChart;
