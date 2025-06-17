import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar,
  ChevronDown,
  Download,
  FileText,
  Filter,
  Printer,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";

const COLORS = [
  "#60A5FA", // blue-400
  "#34D399", // green-400
  "#FBBF24", // yellow-400
  "#F87171", // red-400
  "#A78BFA", // purple-400
  "#2DD4BF", // teal-400
];

const baseUrl = import.meta.env.VITE_BASE_URL;

const BusinessAnalyticsDashboard = () => {
  const navigate = useNavigate();
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [categoryRevenue, setCategoryRevenue] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [expiringProducts, setExpiringProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [quarterlyRevenue, setQuarterlyRevenue] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const reportRef = useRef(null);

  const calculateYAxisScale = (data) => {
    if (!data || data.length === 0) return { min: 0, max: 1000 };
    
    const values = data.map(item => item.totalRevenue || item.revenue);
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    const padding = (max - min) * 0.1;
    
    return {
      min: Math.max(0, min - padding),
      max: max + padding,
      stepSize: Math.ceil((max - min) / 5)
    };
  };

  useEffect(() => {
    fetchData();
  }, [year]);

  const fetchData = async () => {
    setLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      console.log("Token is missing!");
      return;
    }

    try {
      const [
        monthlyData,
        categoryData,
        productsRevenueData,
        expiringData,
        stockData,
        quarterlyData,
      ] = await Promise.all([
        axios.get(
          `${baseUrl}/api/statistics/yearly-revenue-per-month?year=${year}`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        axios.get(
          `${baseUrl}/api/statistics/yearly-revenue-per-category?year=${year}`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        axios.get(
          `${baseUrl}/api/statistics/products-revenues?limit=5&orderBy=desc`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        axios.get(
          `${baseUrl}/api/statistics/products-expiringsoon?page=1&limit=5&orderBy=desc`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        axios.get(`${baseUrl}/api/statistics/products-stock?limit=5`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(
          `${baseUrl}/api/statistics/total-revenue-per-quarter?year=${year}`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
      ]);

      // Process monthly revenue data
      const monthNames = [
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

      const processedMonthlyData = monthNames.map((month, index) => ({
        name: month.charAt(0).toUpperCase() + month.slice(1),
        revenue: monthlyData.data.data[month] || 0,
        month: index + 1,
      }));

      setMonthlyRevenue(processedMonthlyData);

      // Process category revenue data
      setCategoryRevenue(categoryData.data.data || []);

      // Process top products by revenue
      setTopProducts(productsRevenueData.data.data || []);

      // Process expiring products
      setExpiringProducts(expiringData.data.data || []);

      // Process low stock products
      setLowStockProducts(stockData.data.data || []);

      // Process quarterly revenue
      setQuarterlyRevenue(quarterlyData.data.data.quarterlyRevenue || []);
      setTotalRevenue(parseFloat(quarterlyData.data.data.totalRevenue || 0));
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      // Handle errors appropriately - maybe set error state and display a message
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const calculatePercentChange = (current, previous) => {
    if (!previous) return 100;
    return (((current - previous) / previous) * 100).toFixed(1);
  };

  const getQuarterTotalRevenue = (quarter) => {
    const qData = quarterlyRevenue.find((q) => q.quarter === quarter);
    return qData ? parseFloat(qData.totalRevenue) : 0;
  };

  const getCurrentQuarter = () => {
    const currentMonth = new Date().getMonth();
    return Math.floor(currentMonth / 3) + 1;
  };

  const downloadPDF = async () => {
    if (!reportRef.current) return;

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`Business_Report_${year}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="flex flex-col items-center">
          <RefreshCw className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="mt-4 text-lg font-medium text-white">
            Loading report data...
          </p>
        </div>
      </div>
    );
  }

  const currentQuarter = getCurrentQuarter();
  const previousQuarter = currentQuarter > 1 ? currentQuarter - 1 : 4;
  const currentQuarterRevenue = getQuarterTotalRevenue(currentQuarter);
  const previousQuarterRevenue = getQuarterTotalRevenue(previousQuarter);
  const percentChange = calculatePercentChange(
    currentQuarterRevenue,
    previousQuarterRevenue
  );

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#E5E7EB', // gray-200
          font: {
            size: 14,
            weight: 'bold'
          }
        },
      },
      title: {
        display: true,
        text: 'Category Sales Performance',
        color: '#F3F4F6', // gray-100
        font: {
          size: 18,
          weight: 'bold'
        },
        padding: {
          top: 20,
          bottom: 20
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        min: calculateYAxisScale(monthlyRevenue).min,
        max: calculateYAxisScale(monthlyRevenue).max,
        ticks: {
          color: '#D1D5DB', // gray-300
          stepSize: calculateYAxisScale(monthlyRevenue).stepSize,
          callback: function(value) {
            return value.toLocaleString();
          },
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.2)', // gray-600 with opacity
          drawBorder: false
        },
      },
      x: {
        ticks: {
          color: '#D1D5DB', // gray-300
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.2)', // gray-600 with opacity
          drawBorder: false
        },
      },
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Business Analytics Report
          </h1>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </button>

            <div className="relative">
              <select
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="appearance-none bg-gray-800 border border-gray-700 rounded-md py-2 pl-4 pr-10 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {[2025, 2024, 2023, 2022, 2021, 2020].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>

            <button
              onClick={fetchData}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </button>

            <button
              onClick={downloadPDF}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </button>
          </div>
        </div>

        {/* PDF Report Content */}
        <div ref={reportRef} className="bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Annual Business Review {year}
              </h2>
              <p className="text-gray-400 mt-1">
                Generated on {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-gray-400">{year}</span>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
              <div className="flex justify-between">
                <h3 className="text-lg font-semibold text-white">
                  Total Annual Revenue
                </h3>
                <FileText className="h-6 w-6 text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-blue-400 mt-2">
                {formatCurrency(totalRevenue)}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Across all product categories
              </p>
            </div>

            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
              <div className="flex justify-between">
                <h3 className="text-lg font-semibold text-white">
                  Current Quarter
                </h3>
                <FileText className="h-6 w-6 text-green-400" />
              </div>
              <p className="text-3xl font-bold text-green-400 mt-2">
                {formatCurrency(currentQuarterRevenue)}
              </p>
              <div className={`flex items-center text-sm mt-2 ${percentChange >= 0 ? "text-green-400" : "text-red-400"}`}>
                <span>{percentChange}%</span>
                <span className="ml-1">
                  {percentChange >= 0 ? "increase" : "decrease"} from Q{previousQuarter}
                </span>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
              <div className="flex justify-between">
                <h3 className="text-lg font-semibold text-white">
                  Inventory Status
                </h3>
                <FileText className="h-6 w-6 text-purple-400" />
              </div>
              <p className="text-3xl font-bold text-purple-400 mt-2">
                {lowStockProducts.length}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Products with low stock levels
              </p>
            </div>
          </div>

          {/* Monthly Revenue Chart */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold text-white mb-4">
              Monthly Revenue Trend
            </h3>
            <div className="bg-gray-700 rounded-lg border border-gray-600 p-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(75, 85, 99, 0.2)" />
                  <XAxis
                    dataKey="name"
                    tickFormatter={(value) => value.substring(0, 3)}
                    tick={{ fill: "#D1D5DB", fontSize: 12 }}
                  />
                  <YAxis
                    tickFormatter={(value) => `$${value / 1000}k`}
                    tick={{ fill: "#D1D5DB", fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value) => [`${formatCurrency(value)}`, "Revenue"]}
                    labelFormatter={(label) => `${label}`}
                    contentStyle={{
                      backgroundColor: '#1F2937', // gray-800
                      border: '1px solid #374151', // gray-700
                      color: '#F3F4F6', // gray-100
                      borderRadius: '0.375rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                  />
                  <Legend wrapperStyle={{ color: '#E5E7EB' }} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    name="Monthly Revenue"
                    stroke="#60A5FA" // blue-400
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#60A5FA" }}
                    activeDot={{ r: 6, stroke: "#3B82F6", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Two Column Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Category Revenue Distribution */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Revenue by Category
              </h3>
              <div className="bg-gray-700 rounded-lg border border-gray-600 p-4 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryRevenue}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="totalRevenue"
                      nameKey="categoryName"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryRevenue.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: '#1F2937', // gray-800
                        border: '1px solid #374151', // gray-700
                        color: '#F3F4F6', // gray-100
                        borderRadius: '0.375rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}
                    />
                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      wrapperStyle={{ color: '#E5E7EB' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Products by Revenue */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Top Products by Revenue
              </h3>
              <div className="bg-gray-700 rounded-lg border border-gray-600 p-4 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topProducts}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={true}
                      vertical={false}
                      stroke="rgba(75, 85, 99, 0.2)"
                    />
                    <XAxis
                      type="number"
                      tickFormatter={(value) => `$${value / 1000}k`}
                      tick={{ fill: "#D1D5DB", fontSize: 12 }}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fill: "#D1D5DB", fontSize: 12 }}
                      width={100}
                    />
                    <Tooltip
                      formatter={(value) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: '#1F2937', // gray-800
                        border: '1px solid #374151', // gray-700
                        color: '#F3F4F6', // gray-100
                        borderRadius: '0.375rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}
                    />
                    <Bar dataKey="totalRevenue" name="Revenue" fill="#60A5FA">
                      {topProducts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Quarterly Revenue Chart */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold text-gray-100 mb-4">
              Quarterly Revenue Breakdown
            </h3>
            <div className="bg-gray-800  rounded-lg border border-gray-200 p-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={quarterlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="quarter"
                    tickFormatter={(value) => `Q${value}`}
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                  />
                  <YAxis
                    tickFormatter={(value) => `$${value / 1000}k`}
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value) => [
                      formatCurrency(parseFloat(value)),
                      "Revenue",
                    ]}
                    labelFormatter={(label) => `Quarter ${label}`}
                  />
                  <Legend />
                  <Bar
                    dataKey="totalRevenue"
                    name="Quarterly Revenue"
                    fill="#10b981"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tables Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            {/* Expiring Products Table */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Products Expiring Soon
              </h3>
              <div className="bg-gray-700 rounded-lg border border-gray-600 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-600">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Expiry Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Quantity
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-700 divide-y divide-gray-600">
                    {expiringProducts.map((product, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-gray-700" : "bg-gray-800"}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {product.productName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {formatDate(product.expiryDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {product.quantity}
                        </td>
                      </tr>
                    ))}
                    {expiringProducts.length === 0 && (
                      <tr>
                        <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-400">
                          No products expiring soon
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Low Stock Products Table */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Low Stock Products
              </h3>
              <div className="bg-gray-700 rounded-lg border border-gray-600 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-600">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Current Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-700 divide-y divide-gray-600">
                    {lowStockProducts.map((product, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-gray-700" : "bg-gray-800"}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {product.product.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {product.currentStock}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            product.currentStock <= 10
                              ? "bg-red-900 text-red-200"
                              : "bg-yellow-900 text-yellow-200"
                          }`}>
                            {product.currentStock <= 10 ? "Critical" : "Low"}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {lowStockProducts.length === 0 && (
                      <tr>
                        <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-400">
                          No low stock products
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-gray-700">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-400">
                This report was generated automatically based on your business data.
              </p>
              <div className="flex items-center text-sm text-gray-400">
                <Printer className="h-4 w-4 mr-1" />
                <span>Page 1 of 1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessAnalyticsDashboard;
