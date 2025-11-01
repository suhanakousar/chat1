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
import { Button } from "../components/ui";
import { FaEye, FaEyeSlash, FaArrowRight, FaCheck } from "react-icons/fa";

const Signup = () => {
  const formContext = useForm();
  const { register, handleSubmit, formState, getValues } = formContext;
  const { errors } = formState;
  const { login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const togglePasswordVisibilityConfirm = () =>
    setShowPasswordConfirm(!showPasswordConfirm);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/signup`,
        data
      );
      if (response.data?.status === "success") {
        showToastSuccess(response.data?.message || "Account created successfully");
        localStorage.setItem('user_id', response.data.user?.id)
        login(response.data?.token);
        navigate("/");
      }
    } catch (err) {
      showToastError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    "Real-time translation to 140+ languages",
    "Secure end-to-end encrypted messaging",
    "Create unlimited group chats",
    "Voice-to-text with AI recognition",
  ];

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-accent-600 via-accent-500 to-primary-600 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-30"></div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate("/")}>
            <img src={logo} alt="Chatlas Logo" className="w-12 h-12" />
            <span className="text-3xl font-bold text-white">Chatlas</span>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-white leading-tight">
              Join the global
              <br />
              conversation
            </h1>
            <p className="text-xl text-white/90 max-w-md">
              Experience seamless communication without language barriers.
            </p>
          </div>

          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <FaCheck className="text-white text-sm" />
                </div>
                <p className="text-white/90">{feature}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-white/60 text-sm">
          © 2025 Chatlas. All rights reserved.
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="flex items-center justify-center p-6 lg:p-12 bg-neutral-50">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center space-x-3">
            <img src={logo} alt="Chatlas Logo" className="w-10 h-10" />
            <span className="text-2xl font-bold text-neutral-900">Chatlas</span>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-4xl font-bold text-neutral-900">Create account</h2>
            <p className="text-lg text-neutral-600">Start chatting across languages</p>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Full name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="input-modern"
                {...register("username", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters"
                  }
                })}
              />
              {errors.username && (
                <p className="mt-1.5 text-sm text-error">{errors.username?.message}</p>
              )}
            </div>

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
                  placeholder="Create a strong password"
                  className="input-modern pr-12"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters"
                    }
                  })}
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

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={showPasswordConfirm ? "text" : "password"}
                  placeholder="Re-enter your password"
                  className="input-modern pr-12"
                  {...register("passwordConfirm", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === getValues("password") || "Passwords do not match"
                  })}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibilityConfirm}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  {showPasswordConfirm ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
              {errors.passwordConfirm && (
                <p className="mt-1.5 text-sm text-error">{errors.passwordConfirm?.message}</p>
              )}
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                className="w-4 h-4 mt-1 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                {...register("terms", {
                  required: "You must accept the terms and conditions"
                })}
              />
              <label className="ml-2 text-sm text-neutral-600">
                I agree to the{" "}
                <Link to="/terms" className="font-medium text-primary-600 hover:text-primary-700">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="font-medium text-primary-600 hover:text-primary-700">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.terms && (
              <p className="text-sm text-error">{errors.terms?.message}</p>
            )}

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              fullWidth
              loading={loading}
              icon={<FaArrowRight />}
            >
              Create account
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="text-center pt-4">
            <p className="text-neutral-600">
              Already have an account?{" "}
              <Link to="/signin" className="font-medium text-primary-600 hover:text-primary-700 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
