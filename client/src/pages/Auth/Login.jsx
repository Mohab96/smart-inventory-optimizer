import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectPosition } from "../../store/features/positionSlice";
import { login } from "../../store/actions/authActions";
import { selectAuthError } from "../../store/features/authSlice";
import { useTheme } from "../../components/common/ThemeContext";

export default function Login() {
  const dispatch = useDispatch();
  const position = useSelector(selectPosition);
  const error = useSelector(selectAuthError);
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [touched, setTouched] = useState({
    username: false,
    password: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.username) {
      errors.username = "Username is required";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    return errors;
  };

  const errors = validate();
  const isValid = Object.keys(errors).length === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      username: true,
      password: true
    });

    if (!isValid) return;

    setIsSubmitting(true);
    try {
      dispatch(login({ username: formData.username, password: formData.password }));
      if (error) throw Error(error);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200'} py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200`}>
      <div className={`max-w-md w-full space-y-8 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/80'} backdrop-blur-sm p-8 rounded-xl shadow-2xl ${theme === 'dark' ? 'border border-gray-700/50' : 'border border-gray-200/50'} transform transition-all duration-200`}>
        <div>
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <h2 className={`mt-6 text-center text-3xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Welcome Back
          </h2>
          <p className={`mt-2 text-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Please sign in to your account
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="rounded-md space-y-4">
            <div>
              <label htmlFor="username" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Username
              </label>
              <div className="mt-1 relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    touched.username && errors.username 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : theme === 'dark' ? 'border-gray-700 focus:ring-indigo-500 focus:border-indigo-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                  } rounded-md shadow-sm ${theme === 'dark' ? 'placeholder-gray-500 bg-gray-900/50 text-white' : 'placeholder-gray-500 bg-white text-gray-900'} focus:outline-none focus:ring-2 focus:ring-offset-2 ${theme === 'dark' ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'} transform transition-all duration-200 hover:scale-[1.01]`}
                  placeholder="Enter your username"
                />
                {touched.username && errors.username && (
                  <p className="mt-1 text-sm text-red-400">{errors.username}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    touched.password && errors.password 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : theme === 'dark' ? 'border-gray-700 focus:ring-indigo-500 focus:border-indigo-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                  } rounded-md shadow-sm ${theme === 'dark' ? 'placeholder-gray-500 bg-gray-900/50 text-white' : 'placeholder-gray-500 bg-white text-gray-900'} focus:outline-none focus:ring-2 focus:ring-offset-2 ${theme === 'dark' ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'} transform transition-all duration-200 hover:scale-[1.01]`}
                  placeholder="Enter your password"
                />
                {touched.password && errors.password && (
                  <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                )}
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="animate-shake bg-red-900/30 text-red-200 rounded-lg p-4 text-sm flex items-center border border-red-700/50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${theme === 'dark' ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'} transform transition-all duration-200 hover:scale-[1.02] ${
              (isSubmitting || !isValid) ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg className="h-5 w-5 text-indigo-300 group-hover:text-indigo-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </span>
            {isSubmitting ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </div>
            ) : (
              "Sign in"
            )}
          </button>

          {position === "manager" && (
            <div className="text-sm text-center space-y-4">
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {"Don't have an account?"}{" "}
                <Link
                  to="/register"
                  className="font-medium text-blue-400 hover:text-blue-300 transition-colors duration-200"
                >
                  Register
                </Link>
              </p>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Forgot your password?{" "}
                <Link
                  to="/forgotpassword"
                  className="font-medium text-blue-400 hover:text-blue-300 transition-colors duration-200"
                >
                  Reset here
                </Link>
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
