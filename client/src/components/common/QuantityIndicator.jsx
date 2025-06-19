import React from "react";
import { motion } from "framer-motion";
import { Package, AlertTriangle } from "lucide-react";
import { useTheme } from "./ThemeContext";

const QuantityIndicator = ({ 
  quantity,
  size = "md", // sm, md, lg
  showIcon = true,
  className = ""
}) => {
  const { theme } = useTheme();
  // Get status and colors based on quantity
  const getQuantityInfo = (quantity) => {
    if (quantity <= 0) {
      return {
        status: "Out of Stock",
        color: "red",
        bgColor: theme === 'dark' ? "bg-red-500/10" : "bg-red-100/60",
        textColor: theme === 'dark' ? "text-red-500" : "text-red-600",
        borderColor: theme === 'dark' ? "border-red-500" : "border-red-200",
        icon: <AlertTriangle className={`h-5 w-5 ${theme === 'dark' ? 'text-red-500' : 'text-red-600'}`} />
      };
    }
    if (quantity <= 5) {
      return {
        status: "Low Stock",
        color: "orange",
        bgColor: theme === 'dark' ? "bg-orange-500/10" : "bg-orange-100/60",
        textColor: theme === 'dark' ? "text-orange-500" : "text-orange-600",
        borderColor: theme === 'dark' ? "border-orange-500" : "border-orange-200",
        icon: <AlertTriangle className={`h-5 w-5 ${theme === 'dark' ? 'text-orange-500' : 'text-orange-600'}`} />
      };
    }
    if (quantity <= 20) {
      return {
        status: "Medium Stock",
        color: "yellow",
        bgColor: theme === 'dark' ? "bg-yellow-500/10" : "bg-yellow-100/60",
        textColor: theme === 'dark' ? "text-yellow-500" : "text-yellow-600",
        borderColor: theme === 'dark' ? "border-yellow-500" : "border-yellow-200",
        icon: <Package className={`h-5 w-5 ${theme === 'dark' ? 'text-yellow-500' : 'text-yellow-600'}`} />
      };
    }
    return {
      status: "In Stock",
      color: "green",
      bgColor: theme === 'dark' ? "bg-green-500/10" : "bg-green-100/60",
      textColor: theme === 'dark' ? "text-green-500" : "text-green-600",
      borderColor: theme === 'dark' ? "border-green-500" : "border-green-200",
      icon: <Package className={`h-5 w-5 ${theme === 'dark' ? 'text-green-500' : 'text-green-600'}`} />
    };
  };

  // Size variants
  const sizeClasses = {
    sm: {
      box: "w-16 h-16 text-base",
      text: "text-base",
      badge: "text-xs",
      icon: "h-4 w-4"
    },
    md: {
      box: "w-20 h-20 text-lg",
      text: "text-lg",
      badge: "text-sm",
      icon: "h-5 w-5"
    },
    lg: {
      box: "w-24 h-24 text-xl",
      text: "text-xl",
      badge: "text-base",
      icon: "h-6 w-6"
    }
  };

  const quantityInfo = getQuantityInfo(quantity);
  const sizeInfo = sizeClasses[size];

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        className={`relative flex flex-col items-center justify-center ${sizeInfo.box} rounded-xl ${quantityInfo.bgColor} ${quantityInfo.borderColor} border-2 transition-all duration-300`}
      >
        {showIcon && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute top-2 left-2"
          >
            {quantityInfo.icon}
          </motion.div>
        )}
        <span className={`font-bold ${sizeInfo.text} ${quantityInfo.textColor}`}>{quantity}</span>
        <span className={`text-xs ${quantityInfo.textColor}`}>{quantity === 1 ? 'unit' : 'units'}</span>
      </motion.div>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3 }}
        className={`mt-2 px-3 py-1 rounded-full font-semibold ${sizeInfo.badge} ${quantityInfo.bgColor} ${quantityInfo.textColor} ${quantityInfo.borderColor} border`}
      >
        {quantityInfo.status}
      </motion.div>
    </div>
  );
};

export default QuantityIndicator; 