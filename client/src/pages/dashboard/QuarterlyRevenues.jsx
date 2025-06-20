/* eslint-disable */
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  fetchRevenuesPerMonth,
  fetchRevenuesPerQuarter,
} from "../../store/features/dashboardSlices/revenueSlice";
import PieChart from "../../components/charts/PieChart";
import AreaChart from "../../components/charts/AreaChart";
import QuarterChart from "../../components/charts/QuarterChart";
import QuarterPieChart from "../../components/charts/QuarterPieChart";
import { useTheme } from "../../components/common/ThemeContext";

const QuarterlyRevenues = () => {
  const { theme } = useTheme();
  
  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className={`flex-1 overflow-y-auto p-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <h2 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
            Quarter Revenues
          </h2>

          {/* Charts Section */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 py-5">
            <QuarterChart />
            <QuarterPieChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuarterlyRevenues;
