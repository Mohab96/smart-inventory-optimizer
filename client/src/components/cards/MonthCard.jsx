/* eslint-disable */

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { DollarSign, ShoppingBag, TrendingUp, TrendingDown, Minus, CalendarDays } from "lucide-react";

const MonthCard = ({ value, label, percentage, color, path, cardIcon: CardMainIcon, percentageIcon: PercentageIcon }) => {
  const navigate = useNavigate();

  const getChangeIcon = (change) => {
    if (PercentageIcon) return <PercentageIcon className="h-4 w-4" />;
    const numChange = parseFloat(change.replace('%', ''));
    if (numChange > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (numChange < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className="bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-700 flex flex-col justify-between transform transition-all duration-300 relative overflow-hidden"
    >
      {/* Main Card Icon */}
      {CardMainIcon && (
        <div className="absolute top-6 right-6 text-gray-700 opacity-30">
          <CardMainIcon className="h-16 w-16" />
        </div>
      )}

      <div className="flex flex-col mb-4 z-10">
        <span className="text-4xl sm:text-5xl leading-none font-extrabold text-white mb-2">
          {value}
        </span>
        <h3 className="text-lg font-semibold text-gray-400 whitespace-pre-line">
          {label}
        </h3>
      </div>

      <div className="flex items-center justify-between z-10">
        <div className={`flex items-center text-base font-bold ${color}`}>
          {getChangeIcon(percentage)}
          <span className="ml-1">
            {percentage}
          </span>
        </div>
        
        <div>
          <button
            onClick={() => navigate(path)}
            className="uppercase text-sm font-semibold inline-flex items-center rounded-lg px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 shadow-md"
          >
            Show All
            <svg
              className="w-2.5 h-2.5 ms-1.5 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MonthCard;
