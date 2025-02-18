/* eslint-disable */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import BgImg from "../../assets/images/signUpImg.jpg";
import logo from "../../assets/images/logo.png";
import InputForm from "../../components/common/InputForm";
import { selectPosition } from "../../store/features/positionSlice";
import { setCredentials, setError } from "../../store/features/authSlice";
import { setToken } from "../../store/features/tokenSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const position = useSelector(selectPosition);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    dispatch(setError(null));
    try {
      const response = await fetch(
        "https://smart-inventory-optimizer.vercel.app/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }
      const authToken = response.headers.get("Authorization");
      dispatch(setToken(authToken.split(" ")[1]));
      const data = await response.json();
      dispatch(
        setCredentials({
          token: data.token,
          user: data.user,
        })
      );

      navigate("/staff-management");
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid max-w-full min-h-screen grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 justify-center ">
      {/* BG */}
      <div
        className="home__img hidden sm:flex max-h-full rounded-r-3xl shadow-2xl"
        style={{
          backgroundImage: `url(${BgImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      {/* Login Form */}
      <div className="home__data flex flex-col items-center justify-center max-w-full mx-12 my-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-32 xl:h-48 w-auto"
            src={logo}
            alt="Company Logo"
          />
          <h2 className="mt-10 text-center text-2xl xl:text-4xl font-bold leading-9 tracking-tight text-orange-500 hover:text-orange-500">
            LOGIN
          </h2>
        </div>

        <div className="mt-10 flex w-full lg:px-12 justify-center items-center ">
          <form
            className="space-y-6 flex flex-col w-full justify-center items-center "
            onSubmit={handleSubmit}
          >
            <InputForm
              id="username"
              name="username"
              type="text"
              label="Username"
              placeholder="Enter your username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <InputForm
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              className={`bg-orange-500 text-white font-bold py-2 px-4 rounded-lg mt-8 w-full xl:w-3/4 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging..." : "LOGIN"}
            </button>
          </form>
        </div>

        {position === "manager" && (
          <p className="mt-10 text-center text-sm text-gray-500">
            Don't have an account?
            <Link
              to="/business-data"
              className="text-orange-500 font-medium hover:text-orange-600 px-1"
            >
              Sign Up
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
