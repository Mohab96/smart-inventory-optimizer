/* eslint-disable */
import React from "react";
import { motion } from "framer-motion";

const DateCard = ({ dateString }) => {
  // Helper function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    // Array of month names
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = monthNames[date.getMonth()]; // Get month by index

    // Get the day of the month (padded with 0)
    const day = String(date.getDate()).padStart(2, "0");

    // Array of weekday names
    const weekdayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const weekday = weekdayNames[date.getDay()]; // Get weekday by index

    return { month, day, weekday };
  };

  // Destructure the formatted date
  const { month, day, weekday } = formatDate(dateString);

  // Framer Motion animation variants for the container (entire card)
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8, y: -50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
        when: "beforeChildren", // Children animate after parent
        staggerChildren: 0.1, // Stagger children animation for a smooth effect
      },
    },
    exit: { opacity: 0, scale: 0.8, y: 50, transition: { duration: 0.3 } },
  };

  // Framer Motion animation variants for each section (month, day, weekday)
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  // Reusable component for the sections (month, day, weekday)
  const MotionSection = ({ children, className, hoverStyle }) => (
    <motion.div
      className={className}
      variants={sectionVariants}
      whileHover={hoverStyle} // Apply hover style
    >
      {children}
    </motion.div>
  );

  return (
    <motion.div
      className="flex flex-col w-32 h-32 bg-white mx-auto font-bold rounded-lg shadow-md text-md cursor-default lg:w-28 lg:h-w-28"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{ scale: 1.05 }} // Scale slightly on hover for the whole container
    >
      {/* Month Section */}
      <MotionSection
        className="w-full h-1/3 py-2 text-white font-bold bg-red-600 border-b  text-center rounded-t-lg"
        hoverStyle={{
          backgroundColor: "red",
          transition: { duration: 0.3 },
        }}
      >
        {month}
      </MotionSection>

      {/* Day Section */}
      <MotionSection
        className="text-5xl h-1/3 text-gray-700 text-center mt-2 lg:text-4xl"
        hoverStyle={{ color: "#4a5568", transition: { duration: 0.3 } }}
      >
        {day}
      </MotionSection>

      {/* Weekday Section */}
      <MotionSection
        className="text-red-600 h-1/3 text-xl font-bold mt-1 text-center lg:text-xl"
        hoverStyle={{ color: "red", transition: { duration: 0.3 } }}
      >
        {weekday}
      </MotionSection>
    </motion.div>
  );
};

export default DateCard;
