import React from "react";
import { motion } from "framer-motion";
import { Package, AlertTriangle } from "lucide-react";

const QuantityIndicator = ({ 
  quantity,
  size = "md", // sm, md, lg
  showIcon = true,
  className = ""
}) => {
  // Get status and colors based on quantity
  const getQuantityInfo = (quantity) => {
    if (quantity <= 0) {
      return {
        status: "Out of Stock",
        color: "red",
        bgColor: "bg-red-500/10",
        textColor: "text-red-500",
        borderColor: "border-red-500",
        icon: <AlertTriangle className="h-5 w-5 text-red-500" />
      };
    }
    if (quantity <= 5) {
      return {
        status: "Low Stock",
        color: "orange",
        bgColor: "bg-orange-500/10",
        textColor: "text-orange-500",
        borderColor: "border-orange-500",
        icon: <AlertTriangle className="h-5 w-5 text-orange-500" />
      };
    }
    if (quantity <= 20) {
      return {
        status: "Medium Stock",
        color: "yellow",
        bgColor: "bg-yellow-500/10",
        textColor: "text-yellow-500",
        borderColor: "border-yellow-500",
        icon: <Package className="h-5 w-5 text-yellow-500" />
      };
    }
    return {
      status: "In Stock",
      color: "green",
      bgColor: "bg-green-500/10",
      textColor: "text-green-500",
      borderColor: "border-green-500",
      icon: <Package className="h-5 w-5 text-green-500" />
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