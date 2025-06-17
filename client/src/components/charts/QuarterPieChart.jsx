import Chart from "react-apexcharts";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchRevenuesPerQuarter } from "../../store/features/dashboardSlices/revenueSlice";
import Loading from "../common/Loading";
import { CalendarDays, PieChart, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function QuarterPieChart() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(fetchRevenuesPerQuarter({ year: selectedYear }));
    }
  }, [dispatch, token, selectedYear]);

  const { loading, quarterlyData: revenue, error } = useSelector(
    (state) => state.revenue
  );

  const chatData = revenue?.data?.quarterlyRevenue || [];

  const chartSeries = chatData.map((quarter) => Number(quarter.totalRevenue));
  const chartLabels = chatData.map((quarter) => `Q${quarter.quarter}`);

  const currentYear = new Date().getFullYear();
  const dropdownOptions = Array.from(
    { length: currentYear - 2013 + 1 },
    (_, i) => currentYear - i
  );

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectYear = (year) => {
    setSelectedYear(year);
    setIsDropdownOpen(false);
  };

  const chartOptions = {
    chart: {
      type: "pie",
      zoom: { enabled: false },
      background: "transparent",
      toolbar: { show: false },
    },
    labels: chartLabels,
    colors: ["#6366F1", "#3B82F6", "#22D3EE", "#FBBF24", "#EF4444"],
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        const total = opts.w.globals.seriesTotals.reduce((a, b) => a + b, 0);
        const percent = (val / total * 100).toFixed(1);
        return `${opts.w.globals.labels[opts.seriesIndex]}: $${opts.w.globals.series[opts.seriesIndex].toLocaleString()} (${percent}%)`;
      },
      style: {
        fontSize: '12px',
        colors: ['#E5E7EB'] // Light text for dark background
      },
      dropShadow: { enabled: true, top: 1, left: 1, blur: 1, opacity: 0.5 }
    },
    legend: {
      position: 'bottom',
      labels: {
        colors: '#9CA3AF' // Light text for legend
      },
      markers: {
        width: 10,
        height: 10,
        radius: 12
      }
    },
    tooltip: {
      theme: 'dark',
      fillSeriesColor: true,
      style: {
        fontSize: '12px',
        fontFamily: undefined,
        color: '#E5E7EB', // Lighter text
      },
      cssClass: 'apex-tooltip-custom',
      x: {
        show: false
      },
      y: {
        formatter: function (val) {
          return `$${val.toLocaleString()}`;
        }
      },
    },
    stroke: {
      colors: ['#1F2937'], // Dark stroke for slices
      width: 2
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: 'Total Revenue',
              fontSize: '16px',
              fontWeight: 600,
              color: '#E5E7EB', // Light text
              formatter: function (w) {
                const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                return `$${total.toLocaleString()}`;
              }
            },
            value: {
              show: true,
              fontSize: '20px',
              fontWeight: 700,
              color: '#E5E7EB', // Light text
              offsetY: -5,
              formatter: function (val) {
                return `$${val.toLocaleString()}`;
              }
            }
          }
        }
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="col-span-1 md:col-span-1 xl:col-span-1 w-full"
    >
      <div className="w-full flex flex-col justify-between bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700 transform hover:scale-[1.005] transition-all duration-300 h-[600px]">
        {/* Header Section */}
        <div className="flex items-center space-x-3 mb-6">
          <PieChart className="h-8 w-8 text-green-500" />
          <h2 className="text-2xl font-bold text-white">Quarterly Revenue</h2>
        </div>

        {/* Year Selection */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-lg font-semibold text-gray-400">Distribution for {selectedYear}</p>
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="inline-flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
            >
              <CalendarDays className="h-5 w-5 mr-2" />
              {selectedYear}
              <svg
                className="w-2.5 h-2.5 ms-2"
                aria-hidden="true"
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

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-10 right-0 mt-2 bg-gray-700 divide-y divide-gray-600 rounded-lg shadow-xl w-44"
                >
                  <ul className="py-2 text-sm text-gray-200">
                    {dropdownOptions.map((year) => (
                      <li key={year}>
                        <button
                          onClick={() => selectYear(year)}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-600 transition-colors duration-200"
                        >
                          {year}
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Chart Section */}
        <div className="h-full flex-1 flex flex-col justify-center items-center bg-gray-900 rounded-lg p-4">
          {loading ? (
            <Loading />
          ) : error ? (
            <div className="text-red-500 text-center py-8">Error: {error}</div>
          ) : chatData.length === 0 ? (
            <div className="text-gray-400 text-lg text-center py-8">No quarterly revenue data available for {selectedYear}.</div>
          ) : (
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="donut" // Changed to donut for better total display
              height="100%"
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
