import { GoogleLogin } from "@react-oauth/google";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { logo } from "../assets";
import {
  showToastError,
  showToastSuccess,
} from "../components/common/ShowToast";
import axios from "axios";
import { useAuth } from "../context/authContext";
import { API_BASE_URL } from "../config/api";
import { Button, Input } from "../components/ui";
import { FaEye, FaEyeSlash, FaArrowRight } from "react-icons/fa";

const Signin = () => {
  const formContext = useForm();
  const { register, handleSubmit, formState } = formContext;
  const { errors } = formState;
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/login`,
        data
      );
      if (response.data.status === "success") {
        showToastSuccess("Login successful");
        login(response.data?.token);
        localStorage.setItem('user_id', response.data.user?.id)
        navigate("/");
      }
    } catch (err) {
      showToastError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      setLoading(true);
      const googleData = { token: response.credential };
      const result = await axios.post(
        `${API_BASE_URL}/auth/google`,
        googleData,
        {
          withCredentials: true,
        }
      );
      if (result.data.status === "success") {
        showToastSuccess("Login successful");
        localStorage.setItem('user_id', result.data.user?.id)
        login(result.data?.token);
        navigate("/");
      }
    } catch (err) {
      console.error("Error during Google login:", err);
      showToastError("Google login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleFailure = (error) => {
    showToastError("Google authentication failed");
    console.error("Google authentication error:", error);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-primary-600 via-primary-500 to-accent-600 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-30"></div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate("/")}>
            <img src={logo} alt="Chatlas Logo" className="w-12 h-12" />
            <span className="text-3xl font-bold text-white">Chatlas</span>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-5xl font-bold text-white leading-tight">
            Connect with
            <br />
            anyone, anywhere
          </h1>
          <p className="text-xl text-white/90 max-w-md">
            Break language barriers with real-time translation and seamless group communication.
          </p>
          
          <div className="flex items-center space-x-4 pt-6">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-white/20 border-2 border-white flex items-center justify-center">
                  <span className="text-white font-medium">👤</span>
                </div>
              ))}
            </div>
            <p className="text-white/90">Join 10,000+ users worldwide</p>
          </div>
        </div>

        <div className="relative z-10 text-white/60 text-sm">
          © 2025 Chatlas. All rights reserved.
        </div>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="flex items-center justify-center p-6 lg:p-12 bg-neutral-50">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center space-x-3">
            <img src={logo} alt="Chatlas Logo" className="w-10 h-10" />
            <span className="text-2xl font-bold text-neutral-900">Chatlas</span>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-4xl font-bold text-neutral-900">Welcome back</h2>
            <p className="text-lg text-neutral-600">Sign in to continue your conversations</p>
          </div>

          {/* Google Sign In */}
          <div className="space-y-4">
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
                useOneTap
                theme="outline"
                size="large"
                width="100%"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-neutral-50 text-neutral-500">Or continue with email</span>
              </div>
            </div>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="input-modern"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                />
                {errors.email && (
                  <p className="mt-1.5 text-sm text-error">{errors.email?.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="input-modern pr-12"
                    {...register("password", { required: "Password is required" })}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-sm text-error">{errors.password?.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-neutral-600">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              fullWidth
              loading={loading}
              icon={<FaArrowRight />}
            >
              Sign in
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center pt-4">
            <p className="text-neutral-600">
              Don't have an account?{" "}
              <Link to="/signup" className="font-medium text-primary-600 hover:text-primary-700 transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
