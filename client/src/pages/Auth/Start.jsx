import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Start = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const navigate = useNavigate();

  const positions = [
    { value: "manager", label: "Manager" },
    { value: "staff", label: "Staff" },
  ];

  const handleSelection = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleSubmit = () => {
    if (!selectedOption) {
      return;
    }
    navigate("/login");
  };

  return (
    <div className="bg-gray-100 w-full h-screen flex justify-center items-center">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-6">
          Select Your Position
        </h2>
        <div className="flex flex-col gap-4">
          {positions.map((position) => (
            <label
              key={position.value}
              className={`flex items-center p-4 border rounded-md cursor-pointer ${
                selectedOption === position.value
                  ? "border-purple-500 bg-purple-100"
                  : "border-gray-300"
              } hover:bg-purple-100`}
            >
              <input
                type="radio"
                name="position"
                value={position.value}
                checked={selectedOption === position.value}
                onChange={handleSelection}
                className="form-radio h-5 w-5 accent-purple-700"
              />
              <span className="ml-3 text-lg">{position.label}</span>
            </label>
          ))}
        </div>
        <button
          onClick={handleSubmit}
          disabled={!selectedOption}
          className={`w-full mt-6 py-3 rounded-md text-white text-lg font-medium ${
            selectedOption
              ? "bg-purple-600 hover:bg-purple-700"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Start;