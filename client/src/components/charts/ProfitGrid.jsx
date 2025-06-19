import { useDispatch, useSelector } from "react-redux";
import MonthCard from "../cards/MonthCard";
import { useEffect, useState, useMemo } from "react";
import {
  fetchRevenuesPerMonth,
  fetchRevenuesPerQuarter,
} from "../../store/features/dashboardSlices/revenueSlice";
import { fetchCategorySales } from "../../store/features/dashboardSlices/salesSlice";
import { fetchTotalProducts, fetchTotalCategories } from "../../store/features/dashboardSlices/overviewSlice";
import { DollarSign, ShoppingBag, Package, LayoutGrid } from "lucide-react";

const ProfitGrid = ({ selectedYear }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const monthlyRevenue = useSelector((state) => state.revenue.monthlyData);
  const quarterlyRevenue = useSelector((state) => state.revenue.quarterlyData);
  const categorySales = useSelector((state) => state.sales);
  const { totalProducts, totalCategories } = useSelector((state) => state.overview);

  const [page, setPage] = useState(1);
  const limit = 10; 
  useEffect(() => {
    if (token) {
      dispatch(fetchRevenuesPerMonth({ year: selectedYear }));
      dispatch(fetchRevenuesPerQuarter({ year: selectedYear }));
      dispatch(fetchCategorySales({ page, limit, orderBy: "desc", year: selectedYear }));
      dispatch(fetchTotalProducts());
      dispatch(fetchTotalCategories());
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
    // Handle division by zero for percentage change calculation
    if (previous === 0) {
        return current > 0 ? 100 : 0; 
    }
    return ((current - previous) / previous) * 100;
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
    <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 py-5 bg-transparent">
      <MonthCard
        value={currentMonthRevenue.toLocaleString()}
        label="Revenues this month"
        percentage={`${monthlyChange.toFixed(2)}%`}
        color={monthlyChange >= 0 ? "text-green-400" : "text-red-400"}
        path="/yearRevenues"
        cardIcon={DollarSign}
      />

      <MonthCard
        value={currentQuarterRevenue.toLocaleString()}
        label="Revenues this Quarter"
        percentage={`${quarterlyChange.toFixed(2)}%`}
        color={quarterlyChange >= 0 ? "text-green-400" : "text-red-400"}
        path="/quarterRevenues"
        cardIcon={DollarSign}
      />
      <MonthCard
        value={bestCategory}
        label="Best Category Sales"
        percentage={`${bestCategorySales} units`}
        color="text-blue-400"
        path="/bestCategories"
        cardIcon={ShoppingBag}
      />
    </div>
  );
};

export default ProfitGrid;
