"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/context/LanguageContext";
import { useRouter, useSearchParams } from "next/navigation";
import { formatApiError } from "@/utils/errorFormatter";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const { t, isRTL } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const loggedOut = searchParams.get("logged_out") === "true";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({ username, password });
      router.push("/dashboard");
    } catch (err: any) {
      const formatted = formatApiError(err, t, isRTL);
      setError(formatted.message || t("Failed to sign in. Please check your credentials."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto sm:pt-10">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-bold text-slate-900 text-title-sm dark:text-white/90 sm:text-title-md">
              {t("Sign In")}
            </h1>
            <p className="text-sm text-slate-500 dark:text-gray-400">
              {t("Enter your username and password to sign in!")}
            </p>
          </div>

          {loggedOut && !error && (
            <div className="p-3 mb-4 text-sm text-emerald-700 bg-emerald-100 rounded-xl dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              {t("Logged out successfully.")}
            </div>
          )}

          {error && (
            <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-400">
              {error}
            </div>
          )}

          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    {t("Username / Email")} <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    placeholder={t("Enter your username or email")}
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>
                    {t("Password")} <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder={t("Enter your password")}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute z-30 -translate-y-1/2 cursor-pointer top-1/2 ${
                        isRTL ? "left-4" : "right-4"
                      }`}
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-slate-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-slate-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-slate-700 text-theme-sm dark:text-gray-400">
                      {t("Keep me logged in")}
                    </span>
                  </div>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-[var(--color-primary)] hover:brightness-90 dark:text-brand-400"
                  >
                    {t("Forgot password?")}
                  </Link>
                </div>
                <div>
                  <Button className="w-full" size="sm" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? t("Signing in...") : t("Sign in")}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-slate-700 dark:text-gray-400 sm:text-start">
                {t("Don't have an account?")}{" "}
                <Link
                  href="/signup"
                  className="text-[var(--color-primary)] hover:brightness-90 dark:text-brand-400 font-semibold"
                >
                  {t("Sign Up")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
