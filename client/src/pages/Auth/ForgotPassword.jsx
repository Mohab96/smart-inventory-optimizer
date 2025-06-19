import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useTheme } from "../../components/common/ThemeContext";

const ForgotPassword = () => {
  const { theme } = useTheme();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data) => {
    try {
      setErrorMessage("");
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/auth/forget-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: data.email }),
        }
      );
      if (!response.ok) {
        throw new Error(response.errors);
      }
      setIsSubmitted(true);
    } catch (err) {
      setErrorMessage(err.message || "Error Occurred");
    }
  };

  const handleTryAgain = () => {
    setIsSubmitted(false);
    reset();
  };

  return (

    <div className={`my-24 max-w-md mx-auto p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
      <h2 className={`text-2xl font-bold mb-6 text-center ${theme === 'dark' ? 'text-orange-400' : 'text-orange-500'}`}>
        Forgot Password
      </h2>

      {!isSubmitted ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className={`block text-sm font-medium ${theme === 'dark' ? 'text-orange-400' : 'text-orange-500'}`}
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Please enter a valid email address",
                },
              })}
              className={`mt-1 block w-full rounded-md border ${
                errors.email ? "border-red-500" : (theme === 'dark' ? 'border-gray-600' : 'border-gray-300')
              } shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 p-2 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>

            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 transform transition-all duration-200 hover:scale-[1.02] ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-indigo-300 group-hover:text-indigo-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </span>
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </div>
              ) : (
                "Send Reset Instructions"
              )}
            </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 rounded-md text-white ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-700"
            } transition-colors`}
          >
            {isSubmitting ? "Sending..." : "Send Reset Instructions"}
          </button>
        </form>
      ) : (
        <div className="text-center p-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-green-500 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <p className="text-green-600 font-medium mb-2">
            Password reset instructions sent!
          </p>
          <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Check your email (including spam folder)
          </p>
          <button
            onClick={handleTryAgain}
            className="w-full py-2 px-4 rounded-md text-white bg-orange-500 hover:bg-orange-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

    </div>
  );
};

export default ForgotPassword;