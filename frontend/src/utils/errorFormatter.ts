/**
 * Error formatting and translation utility.
 * Parses API validation error objects (DRF, model validation) and generates:
 * 1. An object of field-level errors mapped to individual input fields
 * 2. A clean, human-readable summary string in the active language (no raw JSON!)
 */

export interface FormattedError {
  fieldErrors: Record<string, string>;
  message: string;
}

export const FIELD_LABELS_FA: Record<string, string> = {
  username: "نام کاربری",
  phone_number: "شماره تلفن همراه",
  email: "ایمیل",
  password: "رمز عبور",
  password2: "تکرار رمز عبور",
  access_code: "کد دعوت / دسترسی",
  middle_man_code: "کد معرف",
  first_name: "نام",
  last_name: "نام خانوادگی",
  gender: "جنسیت",
  national_code: "کد ملی",
  birth_date: "تاریخ تولد",
  height: "قد",
  weight: "وزن",
  job: "شغل",
  education: "تحصیلات",
  province: "استان",
  city: "شهر",
  address: "آدرس",
  living_location: "محل سکونت",
  old_password: "رمز عبور فعلی",
  new_password: "رمز عبور جدید",
  terms: "شرایط و قوانین",
  contact_with_family: "میزان ارتباط با خانواده",
  contact_with_relatives: "میزان ارتباط با بستگان",
  custody: "حضانت",
  status: "وضعیت",
};

export const COMMON_ERROR_TRANSLATIONS_FA: Record<string, string> = {
  "A user with that phone number already exists.": "این شماره تلفن قبلاً گرفته شده است.",
  "This phone number is already taken.": "این شماره تلفن قبلاً گرفته شده است.",
  "A user with that username already exists.": "این نام کاربری قبلاً گرفته شده است.",
  "This username is already taken.": "این نام کاربری قبلاً گرفته شده است.",
  "A user with that email already exists.": "این ایمیل قبلاً گرفته شده است.",
  "This email is already taken.": "این ایمیل قبلاً گرفته شده است.",
  "This field is required.": "این فیلد الزامی است.",
  "This field may not be blank.": "این فیلد نمی‌تواند خالی باشد.",
  "This field may not be null.": "این فیلد نمی‌تواند تهی باشد.",
  "The two password fields didn't match.": "رمزهای عبور وارد شده یکسان نیستند.",
  "Passwords do not match.": "رمزهای عبور وارد شده یکسان نیستند.",
  "Invalid credentials.": "نام کاربری یا رمز عبور اشتباه است.",
  "Account is disabled.": "حساب کاربری شما غیرفعال شده است.",
  "Session already active.": "نشست کاربری از قبل فعال است.",
  "Invalid access code.": "کد دعوت نامعتبر یا منقضی شده است.",
  "Access code is invalid.": "کد دعوت نامعتبر است.",
  "Access code cannot be blank.": "کد دعوت نمی‌تواند خالی باشد.",
  "Current password is incorrect.": "رمز عبور فعلی نادرست است.",
  "New password cannot be the same as old password.": "رمز عبور جدید نمی‌تواند مشابه رمز عبور قبلی باشد.",
  "Please enter your invitation access code.": "لطفاً کد دعوت خود را وارد کنید.",
  "Please enter a username.": "لطفاً یک نام کاربری وارد کنید.",
  "Username must be at least 3 characters.": "نام کاربری باید حداقل ۳ کاراکتر باشد.",
  "Username can only contain English letters, numbers, and underscores.": "نام کاربری فقط می‌تواند شامل حروف انگلیسی، اعداد و زیرخط (_) باشد.",
  "Please enter your email address.": "لطفاً آدرس ایمیل خود را وارد کنید.",
  "Please enter a valid email address.": "لطفاً یک آدرس ایمیل معتبر وارد کنید.",
  "Enter a valid email address.": "لطفاً یک آدرس ایمیل معتبر وارد کنید.",
  "Please enter your mobile phone number.": "لطفاً شماره تلفن همراه خود را وارد کنید.",
  "Please enter a valid mobile number (e.g. 09123456789).": "لطفاً یک شماره همراه معتبر وارد کنید (مثال: ۰۹۱۲۳۴۵۶۷۸۹).",
  "Enter a valid phone number (e.g. 0912 345 6789) or a valid phone number with country code.": "شماره تلفن همراه معتبر نیست.",
  "The phone number entered is not valid.": "شماره تلفن همراه معتبر نیست.",
  "Please enter a password.": "لطفاً رمز عبور را وارد کنید.",
  "Password must be at least 8 characters long.": "رمز عبور باید حداقل ۸ کاراکتر باشد.",
  "Password must contain both letters and numbers.": "رمز عبور باید شامل حروف و اعداد باشد.",
  "Please confirm your password.": "لطفاً تکرار رمز عبور را وارد کنید.",
  "You must agree to the Terms, Conditions, and Privacy Policy.": "پذیرش شرایط و ضوابط الزامی است.",
  "Please fix the errors in the form before submitting.": "لطفاً خطاهای فرم را برطرف نمایید.",
  "Registration failed. Please check your access code and details.": "ثبت‌نام ناموفق بود. لطفاً کد دعوت و مشخصات خود را بررسی کنید.",
  "Registration failed. Please check your details and try again.": "ثبت‌نام ناموفق بود. لطفاً مشخصات خود را بررسی و دوباره تلاش کنید.",
  "Failed to sign in. Please check your credentials.": "ورود ناموفق بود. لطفاً نام کاربری و رمز عبور را بررسی کنید.",
  "Network error": "خطای ارتباط با سرور. لطفاً اتصال اینترنت خود را بررسی کنید.",
  "An unexpected error occurred": "خطای غیرمنتظره‌ای رخ داده است.",
  "Has child from ex-husband?": "آیا از همسر سابق فرزندی دارید؟",
  "Must be at least 18 years old": "حداقل سن باید ۱۸ سال باشد.",
  "Age cannot exceed 100 years": "سن نمی‌تواند بیشتر از ۱۰۰ سال باشد.",
};

/**
 * Translates a single message string using t() if available or the fallback FA map.
 */
function translateMsg(msg: string, t?: (k: string) => string, isRTL: boolean = true): string {
  if (!msg) return "";
  const trimmed = msg.trim();
  if (t) {
    const translated = t(trimmed);
    if (translated && translated !== trimmed) return translated;
  }
  if (isRTL && COMMON_ERROR_TRANSLATIONS_FA[trimmed]) {
    return COMMON_ERROR_TRANSLATIONS_FA[trimmed];
  }
  return trimmed;
}

/**
 * Formats an API error into input field errors and a single user-friendly message.
 */
export function formatApiError(
  error: any,
  t?: (key: string) => string,
  isRTL: boolean = true
): FormattedError {
  const fieldErrors: Record<string, string> = {};
  const summaryParts: string[] = [];

  if (!error) {
    return {
      fieldErrors,
      message: translateMsg("An unexpected error occurred", t, isRTL),
    };
  }

  // 1. Check if error has structured data (DRF error dictionary)
  let data = error.data ?? error;

  // If message itself is JSON encoded, try parsing it
  if (typeof error.message === "string" && error.message.trim().startsWith("{")) {
    try {
      data = JSON.parse(error.message);
    } catch {
      // Not JSON
    }
  }

  if (typeof data === "object" && data !== null && !Array.isArray(data)) {
    for (const [field, val] of Object.entries(data)) {
      let rawMsg = "";
      if (Array.isArray(val)) {
        rawMsg = val.map((v) => (typeof v === "object" ? JSON.stringify(v) : String(v))).join(" ");
      } else if (typeof val === "object" && val !== null) {
        rawMsg = JSON.stringify(val);
      } else {
        rawMsg = String(val);
      }

      const translated = translateMsg(rawMsg, t, isRTL);
      fieldErrors[field] = translated;

      if (field === "detail" || field === "non_field_errors" || field === "message") {
        summaryParts.push(translated);
      } else {
        const fieldLabel = isRTL
          ? (FIELD_LABELS_FA[field] || (t ? t(field) : field))
          : (t ? t(field) : field);
        summaryParts.push(`${fieldLabel}: ${translated}`);
      }
    }
  } else if (Array.isArray(data)) {
    summaryParts.push(data.map((item) => translateMsg(String(item), t, isRTL)).join(" "));
  }

  if (summaryParts.length > 0) {
    return {
      fieldErrors,
      message: summaryParts.join(" | "),
    };
  }

  const rawFallback = error.message || (typeof error === "string" ? error : "An unexpected error occurred");
  return {
    fieldErrors,
    message: translateMsg(rawFallback, t, isRTL),
  };
}
