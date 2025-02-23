import { useState } from "react";
import { useForm } from "react-hook-form";

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [apiError, setErrorMessage] = useState("");

  const onSubmit = async (data) => {
    console.log("submit");
    try {
    console.log("Try");
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
        throw Error(response.errors);
      }
    console.log("Ok");
      const token = response.headers.get("Authorization").split(" ")[1];
      console.log("Password reset token (test):", token);
      setIsSubmitted(true);
    } catch (err) {
      console.log("Error");
      setErrorMessage(err.message || "Err");
    }
  };

  return (
    <div className="my-24 max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-orange-500">
        Forgot Password
      </h2>

      {!isSubmitted ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-orange-500"
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
                errors.email ? "border-red-500" : "border-gray-300"
              } shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 p-2`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {apiError && (
            <div className="text-red-500 text-sm text-center">{apiError}</div>
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
          <p className="text-gray-600 text-sm">
            Check your email (including spam folder)
          </p>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
