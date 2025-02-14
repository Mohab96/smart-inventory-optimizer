/* eslint-disable */

import { useState } from "react";
import { Link, Links, useNavigate } from "react-router-dom";
import BgImg from "../../assets/images/signUpImg.jpg";
import logo from "../../assets/images/logo.png";
import InputForm from "../../components/common/InputForm";

export default function Login() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [profilePic, setprofilePic] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  //   const navigate = useNavigate();
  const handleSubmit = async (e) => {
    //   e.preventDefault();
    //   setIsSubmitting(true);
    //   if (!email || !username || !password || !phone) {
    //     Swal.fire({
    //       icon: "error",
    //       title: "Submission Failed",
    //       text: "All fields are required.",
    //     });
    //     setIsSubmitting(false);
    //     return;
    //   }
    //   try {
    //     const response = await axios.post(
    //       "http://localhost:3000/api/auth/register",
    //       {
    //         email,
    //         username,
    //         password,
    //         phone,
    //         profilePic,
    //       }
    //     );
    //     Swal.fire({
    //       icon: "success",
    //       title: "Registration Successful",
    //       text: "You have successfully registered!",
    //     });
    //     navigate("/");
    //   } catch (error) {
    //     // console.log(error);
    //     Swal.fire({
    //       icon: "error",
    //       title: "Registration Failed",
    //       text: error.response.data.Message || "An error occurred.",
    //     });
    //   } finally {
    //     setIsSubmitting(false);
    //   }
  };

  return (
    <>
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
        {/* data */}
        <div className="home__data flex flex-col items-center justify-center max-w-full mx-12 my-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto h-32 xl:h-48 w-auto"
              src={logo}
              alt="Your Company"
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
                // value={formData.username}
                // onChange={handleChange}
              />

              <InputForm
                id="password"
                name="password"
                type="password"
                label="Password"
                placeholder="Enter your password"
                required
                // value={formData.password}
                // onChange={handleChange}
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
          <p className="mt-10 text-center text-sm text-gray-500">
            Don't have an account? 
            <Link
              to="/signup"
              className="text-orange-500 font-medium hover:text-orange-600 px-1"
            >
            Sign Up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

// mas 3052033
