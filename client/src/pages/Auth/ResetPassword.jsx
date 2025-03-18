import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";
const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  console.log(token);
  const onSubmit = async (data) => {
    try {
      setErrorMessage("");

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ password: data.password }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to reset password. Please try again.");
      }

      // Handle success
      setIsSubmitted(true);
    } catch (err) {
      setErrorMessage(err.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="my-24 max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-orange-500">
        Reset Password
      </h2>

      {!isSubmitted ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-orange-500"
            >
              New Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              className={`mt-1 block w-full rounded-md border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 p-2`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-orange-500"
            >
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
              className={`mt-1 block w-full rounded-md border ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              } shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 p-2`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {errorMessage && (
            <div className="text-red-500 text-sm text-center">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 rounded-md text-white ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-700"
            } transition-colors`}
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
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
            Password reset successfully!
          </p>
          <p className="text-gray-600 text-sm mb-4">
            You can now log in with your new password.
          </p>
          <Link
            to="/login"
            className="inline-block w-full py-2 px-4 rounded-md text-white bg-orange-500 hover:bg-orange-700 transition-colors"
          >
            Log in with new password
          </Link>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
