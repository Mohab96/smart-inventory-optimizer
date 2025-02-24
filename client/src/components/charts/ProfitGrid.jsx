import MonthCard from "../cards/MonthCard";

const ProfitGrid = () => {
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
        value="5,355"
        label="Expiring categories"
        percentage="30%"
        color="text-green-400"
        path="/revenue"
        iconPath="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
      />

      <MonthCard
        value="385"
        label="Expiring Products"
        percentage="-2.7%"
        color="text-red-400"
        path="/expiryDateProducts"
        iconPath="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z"
      />
    </div>
  );
};

export default ProfitGrid;
