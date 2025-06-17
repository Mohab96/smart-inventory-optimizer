import Chart from "react-apexcharts";
import PropTypes from "prop-types";
import { PieChart as PieChartIcon } from "lucide-react";

export default function PieChart({ data, title = "Product Distribution", subtitle = "By Month" }) {
  // Extract values (series) and labels (months) from the passed data
  const chartSeries = data.map(({ value }) => value);
  const chartLabels = data.map(({ month }) => month);
  const total = chartSeries.reduce((sum, val) => sum + val, 0);

  const chartOptions = {
    chart: {
      type: "donut",
      background: "transparent",
      toolbar: { show: false }
    },
    labels: chartLabels,
    legend: {
      position: "bottom",
      labels: { colors: "#E5E7EB", useSeriesColors: false },
      fontSize: "16px",
      fontWeight: 500,
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} units`,
      },
      style: { fontSize: "15px" },
    },
    colors: [
      "#6366f1", "#3b82f6", "#22d3ee", "#fbbf24", "#ef4444", "#10b981",
      "#8b5cf6", "#ec4899", "#06b6d4", "#d946ef", "#4ade80", "#e5e7eb"
    ].slice(0, data.length),
    stroke: { colors: ["#1F2937"], width: 2 },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "1.1rem",
              color: "#fff",
              offsetY: -10,
            },
            value: {
              show: true,
              fontSize: "2rem",
              fontWeight: 700,
              color: "#fff",
              offsetY: 10,
              formatter: (val, opts) => {
                if (opts && opts.seriesIndex !== undefined && opts.seriesIndex !== null && opts.seriesIndex >= 0) {
                  return `${Number(val).toLocaleString()}`;
                }
                return `${total.toLocaleString()}`;
              }
            },
            total: {
              show: true,
              label: "Total Units",
              fontSize: "1.1rem",
              color: "#fff",
              formatter: () => `${total.toLocaleString()}`
            }
          }
        }
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700 transform hover:scale-[1.005] transition-all duration-300">
      {/* Header Section */}
      <div className="flex items-center space-x-3 mb-6">
        <PieChartIcon className="h-8 w-8 text-blue-500" />
        <div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="text-sm text-gray-400">{subtitle}</p>
        </div>
      </div>
      {/* Chart Section */}
      <div className="h-full flex flex-col justify-center items-center">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-gray-400 text-lg">No data available</p>
          </div>
        ) : (
          <Chart
            className="text-gray-200"
            options={chartOptions}
            series={chartSeries}
            type="donut"
            height={350}
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
  title: PropTypes.string,
  subtitle: PropTypes.string,
};
