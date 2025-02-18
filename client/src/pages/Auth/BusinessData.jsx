import { useForm } from "react-hook-form";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../../store/features/authSlice";
const StepperForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [managerData, setManagerData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Manager form
  const {
    register: registerManager,
    handleSubmit: handleSubmitManager,
    trigger: triggerManager,
    formState: { errors: errorsManager },
  } = useForm();

  // Business form
  const {
    register: registerBusiness,
    handleSubmit: handleSubmitBusiness,
    trigger: triggerBusiness,
    formState: { errors: errorsBusiness },
  } = useForm();

  const steps = [{ number: 1 }, { number: 2 }];

  // Handle next step (manager form)
  const handleNextStep = async () => {
    const isValid = await triggerManager();
    if (isValid) {
      // Save manager form data to state
      handleSubmitManager((data) => {
        setManagerData(data);
        setCurrentStep(currentStep + 1);
      })();
    }
  };

  // Handle business form submission
  const onSubmitBusiness = async (businessData) => {
    const isValid = await triggerBusiness();
    if (isValid && managerData) {
      // Combine manager and business data
      const { image, ...rest } = businessData;
      image;
      const combinedData = {
        admin: { ...managerData },
        business: {
          ...rest,
          establishmentDate: new Date().toISOString(),
        },
      };
      try {
        const response = await fetch(
          "https://smart-inventory-optimizer.vercel.app/api/auth/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(combinedData),
          }
        );
        const data = await response.json();
        if (!response.ok) {
          throw Error(data.message);
        }
        const authToken = response.headers.get("Authorization");
        dispatch(setCredentials(authToken.split(" ")[1]));
        navigate("/staff-management");
      } catch (error) {
        setErrorMessage(error.message);
      }
    }
  };
  return (
    <div className="container max-w-xl mx-auto my-[80px] p-6">
      {" "}
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {errorMessage}
        </div>
      )}
      {/* Stepper */}
      <div className="flex justify-center mb-8 ">
        {steps.map((step) => (
          <div key={step.number} className="flex items-center justify-center">
            <div
              className={`transition w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= step.number
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {step.number}
            </div>
            {step.number !== steps.length && (
              <div
                className={`transition w-[300px] h-1 ${
                  currentStep > step.number ? "bg-purple-600" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      {/* Form */}
      {currentStep === 1 && (
        <form className="space-y-4">
          <h2 className="text-2xl font-bold mb-6">Manager information</h2>
          <div>
            <label className="block mb-1">Name</label>
            <input
              {...registerManager("name")}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Email *</label>
              <input
                {...registerManager("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className="w-full p-2 border rounded"
              />
              {errorsManager.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errorsManager.email.message}
                </p>
              )}
            </div>
            <div>
              <label className="block mb-1">Phone Number</label>
              <input
                {...registerManager("phoneNumber")}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Username *</label>
            <input
              {...registerManager("username", {
                required: "Username is required",
              })}
              className="w-full p-2 border rounded"
            />
            {errorsManager.username && (
              <p className="text-red-500 text-sm mt-1">
                {errorsManager.username.message}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-1">Password *</label>
            <input
              {...registerManager("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              type="password"
              className="w-full p-2 border rounded"
            />
            {errorsManager.password && (
              <p className="text-red-500 text-sm mt-1">
                {errorsManager.password.message}
              </p>
            )}
          </div>
          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              className="px-4 py-2 text-purple-600"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              className="px-4 py-2 bg-black text-white rounded"
            >
              Next Step →
            </button>
          </div>
        </form>
      )}
      {currentStep === 2 && (
        <form
          className="space-y-4"
          onSubmit={handleSubmitBusiness(onSubmitBusiness)}
        >
          <h2 className="text-2xl font-bold mb-6">Business information</h2>
          <div>
            <label className="block mb-1">Name</label>
            <input
              {...registerBusiness("name", {
                required: "Business name is required",
              })}
              className="w-full p-2 border rounded"
            />
            {errorsBusiness.name && (
              <p className="text-red-500 text-sm mt-1">
                {errorsBusiness.name.message}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-1">Business Description</label>
            <textarea
              {...registerBusiness("description")}
              rows={3}
              placeholder="Write a brief description about your business"
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              className="px-4 py-2 text-purple-600"
            >
              ← Back
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded"
            >
              Submit
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default StepperForm;
