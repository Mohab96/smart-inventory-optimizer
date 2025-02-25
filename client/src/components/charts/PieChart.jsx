import Chart from "react-apexcharts";
import PropTypes from "prop-types";

export default function PieChart({ data }) {
  // Extract values (series) and labels (months) from the passed data
  const chartSeries = data.map(({ value }) => value);
  const chartLabels = data.map(({ month }) => month);

  const chartOptions = {
    chart: { type: "pie", zoom: { enabled: false } },
    labels: chartLabels,
    colors: [
      "#3b82f6",
      "#e5e7eb",
      "#22d3ee",
      "#fbbf24",
      "#ef4444",
      "#10b981",
      "#8b5cf6",
      "#ec4899",
      "#06b6d4",
      "#6366f1",
      "#d946ef",
      "#4ade80",
    ].slice(0, data.length), // Trim colors based on data count
  };

  return (
    <div className="p-4 w-full dark:bg-gray-800 rounded-lg text-gray-200">
      <div className="h-full flex flex-col justify-center items-center">
        {data.length === 0 ? (
          <p>No data available</p>
        ) : (
          <Chart
            className="text-gray-200"
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

PieChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
};
