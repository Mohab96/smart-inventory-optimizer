const StatsGrid = () => {
  const stats = [
    {
      value: "2,340",
      label: "Revenues this month",
      percentage: "14.6%",
      color: "text-green-400",
      iconPath:
        "M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z",
    },
    {
      value: "5,355",
      label: "Sales this month",
      percentage: "32.9%",
      color: "text-green-400",
      iconPath:
        "M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z",
    },
    {
      value: "385",
      label: "Offers this month",
      percentage: "-2.7%",
      color: "text-red-400",
      iconPath:
        "M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z",
    },
  ];

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 py-10 bg-gray-100 dark:bg-gray-700">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-900 shadow rounded-lg p-4 sm:p-6 xl:p-8"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl sm:text-3xl leading-none font-bold text-gray-900 dark:text-white">
                {stat.value}
              </span>
              <h3 className="text-base font-normal text-gray-500 dark:text-gray-400">
                {stat.label}
              </h3>
            </div>
            <div
              className={`ml-5 w-0 flex items-center justify-end flex-1 ${stat.color} text-base font-bold`}
            >
              {stat.percentage}
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d={stat.iconPath}
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
