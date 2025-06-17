import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Calendar } from "lucide-react";

const AnimatedDateCard = ({ 
  date,
  variant = "default", // default, primary, secondary, danger
  size = "md", // sm, md, lg
  showIcon = true,
  className = ""
}) => {
  // Format the date using date-fns
  const formattedDate = {
    month: format(new Date(date), "MMMM"),
    day: format(new Date(date), "dd"),
    weekday: format(new Date(date), "EEEE"),
    year: format(new Date(date), "yyyy")
  };

  // Size variants
  const sizeClasses = {
    sm: "w-24 h-24 text-sm",
    md: "w-32 h-32 text-base",
    lg: "w-40 h-40 text-lg"
  };

  // Color variants
  const colorVariants = {
    default: {
      header: "bg-gray-700",
      headerHover: "bg-gray-600",
      day: "text-gray-700",
      dayHover: "text-gray-600",
      weekday: "text-gray-600",
      weekdayHover: "text-gray-500"
    },
    primary: {
      header: "bg-blue-600",
      headerHover: "bg-blue-500",
      day: "text-blue-700",
      dayHover: "text-blue-600",
      weekday: "text-blue-600",
      weekdayHover: "text-blue-500"
    },
    secondary: {
      header: "bg-purple-600",
      headerHover: "bg-purple-500",
      day: "text-purple-700",
      dayHover: "text-purple-600",
      weekday: "text-purple-600",
      weekdayHover: "text-purple-500"
    },
    danger: {
      header: "bg-red-600",
      headerHover: "bg-red-500",
      day: "text-red-700",
      dayHover: "text-red-600",
      weekday: "text-red-600",
      weekdayHover: "text-red-500"
    }
  };

  const colors = colorVariants[variant];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8, y: -20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      className={`flex flex-col ${sizeClasses[size]} bg-white rounded-xl shadow-lg overflow-hidden ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      {/* Header Section */}
      <motion.div
        className={`${colors.header} px-4 py-2 flex items-center justify-between`}
        variants={sectionVariants}
        whileHover={{ backgroundColor: colors.headerHover }}
      >
        <span className="text-white font-semibold">{formattedDate.month}</span>
        {showIcon && <Calendar className="h-4 w-4 text-white" />}
      </motion.div>

      {/* Day Section */}
      <motion.div
        className="flex-1 flex flex-col items-center justify-center"
        variants={sectionVariants}
      >
        <motion.span
          className={`text-4xl font-bold ${colors.day}`}
          whileHover={{ color: colors.dayHover }}
        >
          {formattedDate.day}
        </motion.span>
        <motion.span
          className={`text-sm font-medium ${colors.weekday}`}
          whileHover={{ color: colors.weekdayHover }}
        >
          {formattedDate.weekday}
        </motion.span>
      </motion.div>

      {/* Year Section */}
      <motion.div
        className={`px-4 py-1 text-center text-xs font-medium ${colors.weekday}`}
        variants={sectionVariants}
      >
        {formattedDate.year}
      </motion.div>
    </motion.div>
  );
};

export default AnimatedDateCard; 