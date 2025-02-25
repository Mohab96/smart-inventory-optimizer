/* eslint-disable */
import { useDispatch, useSelector } from "react-redux";
import MonthCard from "../cards/MonthCard";
import { useEffect, useState } from "react";
import {
  fetchRevenuesPerMonth,
  fetchRevenuesPerQuarter,
} from "../../store/features/dashboardSlices/revenueSlice";

const ProfitGrid = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const monthlyRevenue = useSelector((state) => state.revenue.monthlyData);
  const quarterlyRevenue = useSelector((state) => state.revenue.quarterlyData);
  

  useEffect(() => {
    if (token) {
      dispatch(fetchRevenuesPerMonth({ year: selectedYear }));
      dispatch(fetchRevenuesPerQuarter({ year: selectedYear }));
    }
  }, [dispatch, token, selectedYear]);

  const currentMonth = new Date().getMonth(); // 0-based index (Jan = 0, Dec = 11)
  const currentQuarter = Math.floor(currentMonth / 3); // Determines the current quarter

  const currentMonthRevenue = monthlyRevenue?.data?.[currentMonth] || 0;
  const previousMonthRevenue = monthlyRevenue?.data?.[currentMonth - 1] || 0;

  const currentQuarterRevenue = quarterlyRevenue?.data?.[currentQuarter] || 0;
  const previousQuarterRevenue =
    quarterlyRevenue?.data?.[currentQuarter - 1] || 0;

  // Calculate percentage change for month and quarter
  const calculatePercentageChange = (current, previous) => {
    if (previous > 0) {
      return ((current - previous) / previous) * 100;
    }
    return 0;
  };

  const monthlyChange = calculatePercentageChange(
    currentMonthRevenue,
    previousMonthRevenue
  );
  const quarterlyChange = calculatePercentageChange(
    currentQuarterRevenue,
    previousQuarterRevenue
  );

  // console.log(quarterlyRevenue.data.quarterlyRevenue);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 py-5 bg-gray-100 dark:bg-gray-700">
      <MonthCard
        value="2,340"
        label="Sales this month"
        percentage="14.6%"
        color="text-green-400"
        path="/sales"
        iconPath="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
      />

      <MonthCard
        value={currentMonthRevenue.toLocaleString()}
        label="Revenues this month"
        percentage={`${monthlyChange.toFixed(2)}%`}
        color={monthlyChange >= 0 ? "text-green-400" : "text-red-400"}
        path="/yearRevenues"
        iconPath="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
      />

      <MonthCard
        value={currentQuarterRevenue.toLocaleString()}
        label="Revenues this Quarter"
        percentage={`${quarterlyChange.toFixed(2)}%`}
        color={quarterlyChange >= 0 ? "text-green-400" : "text-red-400"}
        path="/quarterRevenues"
        iconPath="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z"
      />
    </div>
  );
};

export default ProfitGrid;
