import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Clock } from "lucide-react";

const ExpiryCountdown = ({ 
  expiryDate,
  size = "md", // sm, md, lg
  showIcon = true,
  className = ""
}) => {
  // Calculate days until expiry
  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get status and colors based on days
  const getStatusInfo = (days) => {
    if (days <= 0) {
      return {
        status: "Expired",
        color: "red",
        bgColor: "bg-red-500/10",
        textColor: "text-red-500",
        borderColor: "border-red-500/20",
        progressColor: "stroke-red-500",
        icon: <AlertTriangle className="h-5 w-5 text-red-500" />
      };
    }
    if (days <= 7) {
      return {
        status: "Critical",
        color: "orange",
        bgColor: "bg-orange-500/10",
        textColor: "text-orange-500",
        borderColor: "border-orange-500/20",
        progressColor: "stroke-orange-500",
        icon: <AlertTriangle className="h-5 w-5 text-orange-500" />
      };
    }
    if (days <= 30) {
      return {
        status: "Warning",
        color: "yellow",
        bgColor: "bg-yellow-500/10",
        textColor: "text-yellow-500",
        borderColor: "border-yellow-500/20",
        progressColor: "stroke-yellow-500",
        icon: <Clock className="h-5 w-5 text-yellow-500" />
      };
    }
    return {
      status: "Good",
      color: "green",
      bgColor: "bg-green-500/10",
      textColor: "text-green-500",
      borderColor: "border-green-500/20",
      progressColor: "stroke-green-500",
      icon: <Clock className="h-5 w-5 text-green-500" />
    };
  };

  // Size variants
  const sizeClasses = {
    sm: {
      container: "w-20 h-20",
      circle: "w-16 h-16",
      text: "text-sm",
      icon: "h-4 w-4"
    },
    md: {
      container: "w-28 h-28",
      circle: "w-24 h-24",
      text: "text-base",
      icon: "h-5 w-5"
    },
    lg: {
      container: "w-36 h-36",
      circle: "w-32 h-32",
      text: "text-lg",
      icon: "h-6 w-6"
    }
  };

  const days = getDaysUntilExpiry(expiryDate);
  const statusInfo = getStatusInfo(days);
  const sizeInfo = sizeClasses[size];

  // Calculate progress percentage (max 30 days)
  const progress = Math.min(Math.max((days / 30) * 100, 0), 100);
  const circumference = 2 * Math.PI * 40; // radius = 40
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`relative ${sizeInfo.container} ${statusInfo.bgColor} ${statusInfo.borderColor} border-2 rounded-full flex items-center justify-center ${className}`}
    >
      {/* Circular Progress */}
      <svg className={`absolute ${sizeInfo.circle} -rotate-90`}>
        <circle
          cx="50%"
          cy="50%"
          r="40"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-gray-200/20"
        />
        <motion.circle
          cx="50%"
          cy="50%"
          r="40"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className={statusInfo.progressColor}
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={{ strokeDasharray: circumference, strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>

      {/* Content */}
      <div className="flex flex-col items-center justify-center z-10">
        {showIcon && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {statusInfo.icon}
          </motion.div>
        )}
        <motion.span
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`${sizeInfo.text} font-bold ${statusInfo.textColor}`}
        >
          {days}
        </motion.span>
        <motion.span
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`text-xs ${statusInfo.textColor}`}
        >
          {days === 1 ? 'day' : 'days'}
        </motion.span>
      </div>

      {/* Status Badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
        className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.textColor}`}
      >
        {statusInfo.status}
      </motion.div>
    </motion.div>
  );
};

export default ExpiryCountdown; 