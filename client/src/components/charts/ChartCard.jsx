import { useState } from "react";

const ChartCard = ({
  title,
  icon,
  reportLink,
  reportText = "Report",
  dropdownOptions = [],
  selectedOption,
  onOptionChange,
  totalLabel,
  totalValue,
  statCards = [],
  chart,
  loading,
  error,
  height = "h-[600px]",
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className={`w-full flex flex-col justify-between bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700 transform hover:scale-[1.005] transition-all duration-300 ${height}`}>
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6 justify-between">
        <div className="flex items-center space-x-3">
          {icon}
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
        {reportLink && (
          <a href={reportLink} className="uppercase text-sm font-semibold inline-flex items-center rounded-lg px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 shadow-md">
            {reportText}
            <svg className="w-3 h-3 ms-2 rtl:rotate-180" aria-hidden="true" viewBox="0 0 6 10" fill="none">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
            </svg>
          </a>
        )}
      </div>
      {/* Total & Dropdown */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col">
          <p className="text-lg font-semibold text-gray-400">{totalLabel}</p>
          <h5 className="text-4xl font-extrabold text-white mt-1">{totalValue}</h5>
        </div>
        {/* Dropdown */}
        {dropdownOptions.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="inline-flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
            >
              {selectedOption}
              <svg className="w-2.5 h-2.5 ms-2" aria-hidden="true" viewBox="0 0 10 6" fill="none">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            {isDropdownOpen && (
              <div className="absolute z-10 right-0 mt-2 bg-gray-700 divide-y divide-gray-600 rounded-lg shadow-xl w-44">
                <ul className="py-2 text-sm text-gray-200">
                  {dropdownOptions.map((opt) => (
                    <li key={opt}>
                      <button
                        onClick={() => {
                          onOptionChange(opt);
                          setIsDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-600 transition-colors duration-200"
                      >
                        {opt}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Stat Cards */}
      {statCards.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {statCards.map((card, idx) => (
            <div key={idx} className="bg-gray-700 p-4 rounded-lg shadow-md flex flex-col items-center justify-center border border-gray-600">
              <p className="text-sm font-medium text-gray-400 mb-1">{card.title}</p>
              <h6 className="text-xl font-bold text-white mb-2">{card.value}</h6>
              <div className="flex items-center text-sm font-semibold">
                {card.icon}
                <span className={card.changeClass + " ml-1"}>{card.change}</span>
                <span className="text-gray-400 ml-1">{card.period}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Chart */}
      <div className="h-full mt-4 bg-gray-900 rounded-lg p-4 flex-1">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">Error loading chart data.</div>
        ) : (
          chart
        )}
      </div>
    </div>
  );
};

export default ChartCard; 