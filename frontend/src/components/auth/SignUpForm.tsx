"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import { registerApi } from "@/services/api/auth";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone_number: "",
    access_code: "",
    password: "",
    password2: "",
    middle_man_code: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.password2) {
      setError("Passwords do not match.");
      return;
    }

    if (!isChecked) {
      setError("You must agree to the Terms and Conditions.");
      return;
    }

    setIsSubmitting(true);

    try {
      await registerApi({
        username: formData.username,
        email: formData.email,
        phone_number: formData.phone_number,
        access_code: formData.access_code,
        password: formData.password,
        password2: formData.password2,
        middle_man_code: formData.middle_man_code || undefined,
      });

      // Auto-login upon successful registration and redirect to profile completion
      await login({
        username: formData.username,
        password: formData.password,
      });

      router.push("/profile");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please check your access code and details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up (Access Code Required)
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your invitation access code and details to create an account.
            </p>
          </div>

          {error && (
            <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-400">
              {error}
            </div>
          )}

          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Access Code */}
                <div>
                  <Label>
                    Access Code <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="access_code"
                    placeholder="Enter your invitation access code"
                    value={formData.access_code}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Username */}
                <div>
                  <Label>
                    Username <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="username"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label>
                      Email <span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="email"
                      name="email"
                      placeholder="Enter email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label>
                      Phone Number <span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="tel"
                      name="phone_number"
                      placeholder="+989123456789"
                      value={formData.phone_number}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Optional Middle Man Code */}
                <div>
                  <Label>Middleman Code (Optional)</Label>
                  <Input
                    type="text"
                    name="middle_man_code"
                    placeholder="Introducer code if available"
                    value={formData.middle_man_code}
                    onChange={handleChange}
                  />
                </div>

                {/* Passwords */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label>
                      Password <span className="text-error-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-3 top-1/2"
                      >
                        {showPassword ? (
                          <EyeIcon className="fill-gray-500 dark:fill-gray-400 w-4 h-4" />
                        ) : (
                          <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 w-4 h-4" />
                        )}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label>
                      Confirm Password <span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password2"
                      placeholder="Confirm password"
                      value={formData.password2}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-center gap-3 pt-2">
                  <Checkbox
                    className="w-5 h-5"
                    checked={isChecked}
                    onChange={setIsChecked}
                  />
                  <p className="inline-block font-normal text-xs text-gray-500 dark:text-gray-400">
                    I agree to the Terms, Conditions, and Privacy Policy
                  </p>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <Button className="w-full" size="sm" disabled={isSubmitting}>
                    {isSubmitting ? "Creating Account..." : "Sign Up"}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5 pb-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Already have an account?{" "}
                <Link
                  href="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
