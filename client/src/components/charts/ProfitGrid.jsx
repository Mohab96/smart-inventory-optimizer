import { useDispatch, useSelector } from "react-redux";
import MonthCard from "../cards/MonthCard";
import { useEffect, useState, useMemo, useRef } from "react";
import {
  fetchRevenuesPerMonth,
  fetchRevenuesPerQuarter,
} from "../../store/features/dashboardSlices/revenueSlice";
import { fetchCategorySales } from "../../store/features/dashboardSlices/salesSlice";

const ProfitGrid = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const monthlyRevenue = useSelector((state) => state.revenue.monthlyData);
  const quarterlyRevenue = useSelector((state) => state.revenue.quarterlyData);
  const categorySales = useSelector((state) => state.sales);

  // console.log(categorySales.data.data);

  const fetchCalled = useRef(false); // Prevent unnecessary fetch calls
  const [page, setPage] = useState(1);
  const limit = 10; // You can also make this dynamic if needed
  useEffect(() => {
    if (token && !fetchCalled.current) {
      dispatch(fetchRevenuesPerMonth({ year: selectedYear }));
      dispatch(fetchRevenuesPerQuarter({ year: selectedYear }));
      dispatch(fetchCategorySales({ page, limit, orderBy: "asc" }));
      fetchCalled.current = true; // Mark as called
    }
  }, [page, limit, selectedYear, token, dispatch]);

  const currentMonth = new Date()
    .toLocaleString("en-US", { month: "long" })
    .toLowerCase();
  const previousMonth = new Date(new Date().setMonth(new Date().getMonth() - 1))
    .toLocaleString("en-US", { month: "long" })
    .toLowerCase();

  const currentQuarter = Math.floor(new Date().getMonth() / 3);

  const currentMonthRevenue = monthlyRevenue?.data?.[currentMonth] ?? 0;
  // console.log(currentQuarter);

  const previousMonthRevenue = monthlyRevenue?.data?.[previousMonth] ?? 0;
  const currentQuarterRevenue = Number(
    quarterlyRevenue?.data?.quarterlyRevenue[currentQuarter].totalRevenue ?? 0
  );
  const previousQuarterRevenue =
    quarterlyRevenue?.data?.[currentQuarter - 1] ?? 0;

  const calculatePercentageChange = (current, previous) => {
    return previous > 0 ? ((current - previous) / previous) * 100 : 0;
  };

  const monthlyChange = useMemo(
    () => calculatePercentageChange(currentMonthRevenue, previousMonthRevenue),
    [currentMonthRevenue, previousMonthRevenue]
  );
  const quarterlyChange = useMemo(
    () =>
      calculatePercentageChange(currentQuarterRevenue, previousQuarterRevenue),
    [currentQuarterRevenue, previousQuarterRevenue]
  );

  const bestCategory =
    categorySales?.data?.data?.[0]?.category?.categoryName || "N/A";
  const bestCategorySales = categorySales?.data?.data?.[0]?.totalUnitsSold || 0;

  // console.log("Best Category:", bestCategory);
  // console.log(categorySales?.data?.data?.[0]?.totalUnitsSold);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 py-5 bg-gray-100 dark:bg-gray-700">
      <MonthCard
        value={currentMonthRevenue.toLocaleString()}
        label="Revenues this month"
        percentage={`${monthlyChange.toFixed(2)}%`}
        color={monthlyChange >= 0 ? "text-green-400" : "text-red-400"}
        path="/yearRevenues"
        // iconPath="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
      />

      <MonthCard
        value={currentQuarterRevenue.toLocaleString()}
        label="Revenues this Quarter"
        percentage={`${quarterlyChange.toFixed(2)}%`}
        color={quarterlyChange >= 0 ? "text-green-400" : "text-red-400"}
        path="/quarterRevenues"
        // iconPath="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z"
      />
      <MonthCard
        value={bestCategory}
        label="Best Category Sales"
        percentage={bestCategorySales}
        color="text-green-400"
        path="/sales"
        // iconPath="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
      />
    </div>
  );
};

export default ProfitGrid;
