"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { registerApi } from "@/services/api/auth";
import {
  getRegistrationConfigApi,
  RegistrationConfig,
} from "@/services/api/siteSettings";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
import { formatApiError } from "@/utils/errorFormatter";

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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [config, setConfig] = useState<RegistrationConfig>({
    require_access_code: true,
    require_email: true,
  });

  const { login } = useAuth();
  const { t, isRTL } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    getRegistrationConfigApi()
      .then((cfg) => {
        if (mounted && cfg) {
          setConfig(cfg);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch registration config, using defaults:", err);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const convertPersianToEnglishDigits = (str: string) => {
    return str
      .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
      .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear field-level error as user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // 1. Access Code (only required if config.require_access_code is true)
    if (config.require_access_code && !formData.access_code.trim()) {
      errors.access_code = t("Please enter your invitation access code.");
    }

    // 2. Username
    const trimmedUsername = formData.username.trim();
    if (!trimmedUsername) {
      errors.username = t("Please enter a username.");
    } else if (trimmedUsername.length < 3) {
      errors.username = t("Username must be at least 3 characters.");
    } else if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
      errors.username = t("Username can only contain English letters, numbers, and underscores.");
    }

    // 3. Email (required only if config.require_email is true; if optional, validate format only if provided)
    const trimmedEmail = formData.email.trim();
    if (config.require_email && !trimmedEmail) {
      errors.email = t("Please enter your email address.");
    } else if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = t("Please enter a valid email address.");
    }

    // 4. Phone Number
    const rawPhone = convertPersianToEnglishDigits(formData.phone_number.trim());
    if (!rawPhone) {
      errors.phone_number = t("Please enter your mobile phone number.");
    } else if (!/^(\+98|0)?9\d{9}$/.test(rawPhone.replace(/\s+/g, ""))) {
      errors.phone_number = t("Please enter a valid mobile number (e.g. 09123456789).");
    }

    // 5. Password Complexity
    if (!formData.password) {
      errors.password = t("Please enter a password.");
    } else if (formData.password.length < 8) {
      errors.password = t("Password must be at least 8 characters long.");
    } else if (!/^(?=.*[A-Za-z])(?=.*\d)/.test(formData.password)) {
      errors.password = t("Password must contain both letters and numbers.");
    }

    // 6. Confirm Password
    if (!formData.password2) {
      errors.password2 = t("Please confirm your password.");
    } else if (formData.password !== formData.password2) {
      errors.password2 = t("Passwords do not match.");
    }

    // 7. Terms and Conditions
    if (!isChecked) {
      errors.terms = t("You must agree to the Terms, Conditions, and Privacy Policy.");
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const isValid = validateForm();
    if (!isValid) {
      setError(t("Please fix the errors in the form before submitting."));
      return;
    }

    setIsSubmitting(true);

    try {
      const normalizedPhone = convertPersianToEnglishDigits(formData.phone_number.trim());
      const payload: any = {
        username: formData.username.trim(),
        phone_number: normalizedPhone,
        password: formData.password,
        password2: formData.password2,
        middle_man_code: formData.middle_man_code.trim() || undefined,
      };

      if (formData.email.trim()) {
        payload.email = formData.email.trim();
      }

      if (config.require_access_code || formData.access_code.trim()) {
        payload.access_code = formData.access_code.trim();
      }

      await registerApi(payload);

      if (typeof window !== 'undefined') {
        localStorage.setItem('show_onboarding_guide', 'true');
      }

      // Auto-login upon successful registration and redirect to profile completion
      await login({
        username: formData.username.trim(),
        password: formData.password,
      });

      router.push("/profile");
    } catch (err: any) {
      const formatted = formatApiError(err, t, isRTL);
      if (formatted.fieldErrors && Object.keys(formatted.fieldErrors).length > 0) {
        setFieldErrors((prev) => ({ ...prev, ...formatted.fieldErrors }));
      }
      setError(
        formatted.message ||
          (config.require_access_code
            ? t("Registration failed. Please check your access code and details.")
            : t("Registration failed. Please check your details and try again."))
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto sm:pt-10">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-bold text-slate-900 text-title-sm dark:text-white/90 sm:text-title-md">
              {config.require_access_code
                ? t("Sign Up (Access Code Required)")
                : t("Sign Up")}
            </h1>
            <p className="text-sm text-slate-500 dark:text-gray-400">
              {config.require_access_code
                ? t("Enter your invitation access code and details to create an account.")
                : t("Enter your details to create an account.")}
            </p>
          </div>

          {error && (
            <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-400 font-medium">
              {error}
            </div>
          )}

          <div>
            <form onSubmit={handleSubmit} noValidate>
              <div className="space-y-4">
                {/* Access Code (rendered only when required by platform settings) */}
                {config.require_access_code && (
                  <div>
                    <Label>
                      {t("Access Code")} <span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      name="access_code"
                      placeholder={t("Enter your invitation access code")}
                      value={formData.access_code}
                      onChange={handleChange}
                      error={Boolean(fieldErrors.access_code)}
                      hint={fieldErrors.access_code}
                      required
                    />
                  </div>
                )}

                {/* Username */}
                <div>
                  <Label>
                    {t("Username")} <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="username"
                    placeholder={t("Choose a username")}
                    value={formData.username}
                    onChange={handleChange}
                    error={Boolean(fieldErrors.username)}
                    hint={fieldErrors.username}
                    required
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label>
                      {t("Email")}{" "}
                      {config.require_email ? (
                        <span className="text-error-500">*</span>
                      ) : (
                        <span className="text-xs text-gray-400 font-normal">
                          ({t("Optional")})
                        </span>
                      )}
                    </Label>
                    <Input
                      type="email"
                      name="email"
                      placeholder={
                        config.require_email
                          ? t("Enter email")
                          : t("Enter email (optional)")
                      }
                      value={formData.email}
                      onChange={handleChange}
                      error={Boolean(fieldErrors.email)}
                      hint={fieldErrors.email}
                      required={config.require_email}
                    />
                  </div>
                  <div>
                    <Label>
                      {t("Phone Number")} <span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="tel"
                      name="phone_number"
                      placeholder={isRTL ? "۰۹۱۲۳۴۵۶۷۸۹" : "+989123456789"}
                      value={formData.phone_number}
                      onChange={handleChange}
                      error={Boolean(fieldErrors.phone_number)}
                      hint={fieldErrors.phone_number}
                      required
                    />
                  </div>
                </div>

                {/* Optional Middle Man Code */}
                <div>
                  <Label>{t("Middleman Code (Optional)")}</Label>
                  <Input
                    type="text"
                    name="middle_man_code"
                    placeholder={t("Introducer code if available")}
                    value={formData.middle_man_code}
                    onChange={handleChange}
                    error={Boolean(fieldErrors.middle_man_code)}
                    hint={fieldErrors.middle_man_code}
                  />
                </div>

                {/* Passwords */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label>
                      {t("Password")} <span className="text-error-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder={t("Password")}
                        value={formData.password}
                        onChange={handleChange}
                        error={Boolean(fieldErrors.password)}
                        hint={fieldErrors.password}
                        required
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute z-30 -translate-y-1/2 cursor-pointer top-5.5 ${
                          isRTL ? "left-3" : "right-3"
                        }`}
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
                      {t("Confirm Password")} <span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password2"
                      placeholder={t("Confirm password")}
                      value={formData.password2}
                      onChange={handleChange}
                      error={Boolean(fieldErrors.password2)}
                      hint={fieldErrors.password2}
                      required
                    />
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="pt-2">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      className="w-5 h-5"
                      checked={isChecked}
                      onChange={(checked) => {
                        setIsChecked(checked);
                        if (checked && fieldErrors.terms) {
                          setFieldErrors((prev) => {
                            const next = { ...prev };
                            delete next.terms;
                            return next;
                          });
                        }
                      }}
                    />
                    <p className="inline-block font-normal text-xs text-slate-500 dark:text-gray-400">
                      {t("I agree to the Terms, Conditions, and Privacy Policy")}
                    </p>
                  </div>
                  {fieldErrors.terms && (
                    <p className="mt-1.5 text-xs text-error-500">{fieldErrors.terms}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <Button className="w-full" size="sm" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? t("Creating Account...") : t("Sign Up")}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5 pb-5">
              <p className="text-sm font-normal text-center text-slate-700 dark:text-gray-400 sm:text-start">
                {t("Already have an account?")}{" "}
                <Link
                  href="/signin"
                  className="text-[var(--color-primary)] hover:brightness-90 dark:text-brand-400 font-semibold"
                >
                  {t("Sign In")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
