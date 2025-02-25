/* eslint-disable */
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/common/Header";
import { useEffect, useState } from "react";
import Sidebar from "../../components/common/Sidebar";
import { fetchRevenuesPerMonth } from "../../store/features/dashboardSlices/revenueSlice";
import PieChart from "../../components/charts/PieChart";
import AreaChart from "../../components/charts/AreaChart";

const YearRevenues = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      dispatch(fetchRevenuesPerMonth({ year: selectedYear }));
    }
  }, [dispatch, token, selectedYear]);

  const {
    loading,
    monthlyData: revenue,
    error,
  } = useSelector((state) => state.revenue);

  // Extract non-zero revenue months
  const revenueData = revenue?.data || {};
  const nonZeroMonths = Object.entries(revenueData)
    .filter(([_, value]) => value > 0)
    .map(([month, value]) => ({ month, value }));

  // Convert data to array format for table display
  const revenueTableData = revenueData
    ? Object.entries(revenueData).map(([month, revenue]) => ({
        month,
        revenue,
      }))
    : [];

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4 dark:bg-gray-700">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Year Revenues
          </h2>

          {/* Charts Section */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 py-5">
            <AreaChart />
            <PieChart data={nonZeroMonths} />
          </div>

          {/* Monthly Revenues Table */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-white mb-3">
              Monthly Revenues
            </h3>
            {loading ? (
              <p className="text-white">Loading data...</p>
            ) : error ? (
              <p className="text-red-500">Error: {error}</p>
            ) : (
              <table className="w-full border-collapse border border-gray-600 text-white">
                <thead>
                  <tr className="bg-gray-800">
                    <th className="border border-gray-600 px-4 py-2">Month</th>
                    <th className="border border-gray-600 px-4 py-2">
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {revenueTableData.map(({ month, revenue }) => (
                    <tr key={month} className="bg-gray-700">
                      <td className="border border-gray-600 px-4 py-2 capitalize">
                        {month}
                      </td>
                      <td className="border border-gray-600 px-4 py-2">
                        ${revenue.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearRevenues;
