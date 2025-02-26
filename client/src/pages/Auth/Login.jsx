import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import BgImg from "../../assets/images/signUpImg.jpg";
import logo from "../../assets/images/logo.png";
import InputForm from "../../components/common/InputForm";
import { selectPosition } from "../../store/features/positionSlice";
import { login } from "../../store/actions/authActions";
import { selectAuthError } from "../../store/features/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const position = useSelector(selectPosition);
  const error = useSelector(selectAuthError);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      console.log(username, password);
      dispatch(login({ username, password }));
      if (error) throw Error(error);
    } catch (error) {
      setErrorMessage(error.message);
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
            {errorMessage && (
              <div className="bg-red-100 text-red-700 rounded-lg block w-full xl:w-3/4 px-3 py-2 ">
                {errorMessage}
              </div>
            )}
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
          <div>
            <p className="mt-10 text-center text-sm text-gray-500">
              Don&apos;t have an account?
              <Link
                to="/register"
                className="text-orange-500 font-medium hover:text-orange-600 px-1"
              >
                Register
              </Link>
            </p>
            <p className="mt-4 text-center text-sm text-gray-500">
              Forgot your password?
              <Link
                to="/forgotpassword"
                className="text-orange-500 font-medium hover:text-orange-600 px-1"
              >
                Reset Password
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
