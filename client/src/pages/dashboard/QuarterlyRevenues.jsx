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

const QuarterlyRevenues = () => {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-1 overflow-hidden">

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4 dark:bg-gray-700">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Qurater Revenues
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
