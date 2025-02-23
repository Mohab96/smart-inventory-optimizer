import { useNavigate } from "react-router-dom";
const StatsGrid = () => {
  const stats = [
    {
      value: "2,340",
      label: "Reven this month",
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
  const navigate = useNavigate();

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 py-10 bg-gray-100 dark:bg-gray-700">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-900 shadow rounded-lg p-4 sm:p-6 xl:p-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex-shrink-0">
              <span className="text-2xl sm:text-3xl leading-none font-bold text-gray-900 dark:text-white">
                {stat.value}
              </span>
              <h3 className="text-base font-normal text-gray-500 dark:text-gray-400 whitespace-pre-line">
                {stat.label}
              </h3>
            </div>
            <div className="flex flex-col">
              <div
                className={`flex items-center justify-center flex-1 ${stat.color} text-base  font-bold`}
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
              <div>
                <a
                  // href="#"
                  onClick={() => {
                    navigate("/expiryDateProducts");
                  }}
                  className="uppercase text-sm font-semibold inline-flex items-center rounded-lg text-blue-600 hover:text-blue-700 dark:hover:text-blue-500  hover:bg-gray-100 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 px-3 py-2"
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
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
