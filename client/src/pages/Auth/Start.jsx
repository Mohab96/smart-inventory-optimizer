import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPosition } from "../../store/features/positionSlice";
import { UserGroupIcon, UserIcon } from "@heroicons/react/24/outline";

const Start = () => {
  const dispatch = useDispatch();
  const [selectedOption, setSelectedOption] = useState("");
  const navigate = useNavigate();

  const positions = [
    { value: "manager", label: "Manager", icon: UserGroupIcon },
    { value: "staff", label: "Staff", icon: UserIcon },
  ];

  const handleSelection = (e) => {
    setSelectedOption(e.target.value);
    dispatch(setPosition(e.target.value));
  };

  const handleSubmit = () => {
    if (!selectedOption) {
      return;
    }
    navigate("/login");
  };

  return (
    <div className="min-h-screen h-auto w-full flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full max-w-lg bg-white/20 dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200/30 dark:border-gray-800/70 p-10 backdrop-blur-md">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
            <UserGroupIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Select Your Position
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Choose your role to continue
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-5 mb-8">
          {positions.map((position) => {
            const Icon = position.icon;
            const isSelected = selectedOption === position.value;
            return (
              <label
                key={position.value}
                className={`flex items-center gap-4 p-5 rounded-xl border-2 transition-all cursor-pointer shadow-sm backdrop-blur-sm
                  ${isSelected
                    ? "border-blue-500 bg-gradient-to-r from-blue-100/80 to-purple-100/80 dark:from-blue-900/30 dark:to-purple-900/30"
                    : "border-gray-200 dark:border-gray-700 bg-white/10 dark:bg-gray-800/30 hover:border-blue-400 hover:bg-blue-50/40 dark:hover:bg-blue-900/10"}
                `}
              >
                <input
                  type="radio"
                  name="position"
                  value={position.value}
                  checked={isSelected}
                  onChange={handleSelection}
                  className="form-radio h-5 w-5 accent-blue-600 dark:accent-blue-400"
                />
                <span className={`flex items-center gap-2 text-lg font-medium ${isSelected ? "text-blue-700 dark:text-blue-300" : "text-gray-700 dark:text-gray-200"}`}>
                  <Icon className="w-6 h-6" />
                  {position.label}
                </span>
              </label>
            );
          })}
        </div>
        <button
          onClick={handleSubmit}
          disabled={!selectedOption}
          className={`w-full py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg
            ${selectedOption
              ? "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white"
              : "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed opacity-70 text-white"}
          `}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Start;
