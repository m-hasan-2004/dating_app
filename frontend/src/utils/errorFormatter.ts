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
  contract_date: "تاریخ عقد",
  marriage_date: "تاریخ ازدواج",
  divorce_date: "تاریخ طلاق",
  death_date: "تاریخ فوت",
  husband_death_date: "تاریخ فوت همسر",
  body_and_face: "ویژگی‌های چهره و اندام",
  blood_type: "گروه خونی",
  skin_color: "رنگ پوست",
  eyes_color: "رنگ چشم",
  character_and_temperament: "طبع و مزاج",
  glasses: "عینک",
  glasses_size: "نمره عینک",
  disease_or_surgery_history: "سابقه بیماری یا جراحی",
  medication_surgery_disease_type: "نوع بیماری یا جراحی",
  capital: "دارایی‌ها و سرمایه",
  other_capital: "سایر سرمایه‌ها",
  other_captial: "سایر سرمایه‌ها",
  current_residence_status: "وضعیت مسکن فعلی",
  ownership_status: "وضعیت مالکیت",
  rent_amount: "مبلغ اجاره",
  mortgage_amount: "مبلغ رهن",
  after_marriage_residence_status: "وضعیت مسکن بعد از ازدواج",
  ex_spouse_financial_status: "وضعیت مالی همسر سابق",
  ex_spouse_financial_pay_status: "نحوه پرداخت به همسر سابق",
  ex_spouse_financial_amount: "مبلغ پرداختی به همسر سابق",
  future_spouse_dowry_type: "نوع مهریه مدنظر",
  future_spose_dowry_amount: "میزان مهریه مدنظر",
  future_spose_jahiziyeh: "وضعیت تهیه جهیزیه",
  future_spose_jahiziyeh_explanation: "توضیحات جهیزیه",
  height_min: "حداقل قد",
  height_max: "حداکثر قد",
  weight_min: "حداقل وزن",
  weight_max: "حداکثر وزن",
  education_level: "مقطع تحصیلی",
  field_of_study: "رشته تحصیلی",
  future_spouse_job: "شغل همسر مدنظر",
  current_residence_location: "محل سکونت فعلی همسر",
  after_marriage_residence_location: "محل سکونت پس از ازدواج",
  future_spouse_ethnicity: "قومیت و اصالت مدنظر",
  future_spouse_originality: "قومیت و اصالت مدنظر",
  marriage_goals: "اهداف ازدواج",
  marriage_goals_purposes: "اهداف ازدواج",
  opinion_woman_job: "نظر در مورد اشتغال خانم",
  opinion_about_womans_job: "نظر در مورد اشتغال خانم",
  opinion_woman_edu: "نظر در مورد تحصیل خانم",
  opinion_about_womans_education: "نظر در مورد تحصیل خانم",
  pros_of_yourself: "نقاط قوت شما",
  cons_of_yourself: "نقاط ضعف شما",
  type_connection_friends: "نحوه ارتباط با دوستان",
  type_of_connection_with_friends: "نحوه ارتباط با دوستان",
  friends_connection_reason: "دلیل نحوه ارتباط با دوستان",
  political_orientation: "گرایش سیاسی",
  opinion_velayat_faqih: "نظر درباره ولایت فقیه",
  opinion_about_velayat_faqih: "نظر درباره ولایت فقیه",
  opinion_child_quantity: "تعداد فرزندان مدنظر",
  opinion_about_child_quantity: "تعداد فرزندان مدنظر",
  contract_how: "نحوه برگزاری مراسم عقد",
  wedding_how: "نحوه برگزاری مراسم عروسی",
  worship_prayer: "تقید به نماز",
  fasting_status: "تقید به روزه",
  society_cover: "پوشش در اجتماع",
  music_status: "گوش دادن به موسیقی",
  dance_singing_assemblies: "حضور در مجالس رقص و آواز",
  smoking_status: "استعمال دخانیات",
  hookah_status: "مصرف قلیان",
  alcohol_status: "مصرف مشروبات الکلی",
  drugs_status: "مصرف مواد مخدر",
  alive: "در قید حیات",
  originality: "اصالت",
  additional_explanations: "توضیحات تکمیلی",
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
  "This field may not be null.": "این فیلد نمی‌تواند خالی باشد.",
  "Enter a valid date.": "لطفاً یک تاریخ معتبر وارد کنید.",
  "Enter a valid date/time.": "لطفاً یک تاریخ و ساعت معتبر وارد کنید.",
  "A valid number is required.": "لطفاً یک عدد معتبر وارد کنید.",
  "A valid integer is required.": "لطفاً یک عدد صحیح معتبر وارد کنید.",
  "Enter a whole number.": "لطفاً یک عدد کامل وارد کنید.",
  "Enter a number.": "لطفاً یک عدد معتبر وارد کنید.",
  "Invalid choice.": "گزینه انتخاب شده نامعتبر است.",
  "Select a valid choice. That choice is not one of the available choices.": "گزینه انتخاب شده در میان گزینه‌های معتبر نیست.",
  "Invalid choice for body and face.": "گزینه انتخاب شده برای چهره و اندام نامعتبر است.",
  "Body and face is required.": "انتخاب ویژگی‌های چهره و اندام الزامی است.",
  "Invalid selection for type of friends' connection.": "گزینه انتخاب شده برای ارتباط با دوستان نامعتبر است.",
  "Please specify the type of connection you have with friends.": "لطفاً نحوه ارتباط خود با دوستان را مشخص کنید.",
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
  "Ensure this value is greater than or equal to": "مقدار باید بزرگتر یا مساوی باشد.",
  "Ensure this value is less than or equal to": "مقدار باید کوچکتر یا مساوی باشد.",
  "Ensure this field has no more than": "تعداد کاراکترها بیش از حد مجاز است.",
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
  if (isRTL) {
    if (COMMON_ERROR_TRANSLATIONS_FA[trimmed]) {
      return COMMON_ERROR_TRANSLATIONS_FA[trimmed];
    }
    // Dynamic pattern matching
    if (trimmed.includes("greater than or equal to")) {
      const match = trimmed.match(/greater than or equal to\s+([\d.]+)/);
      return match ? `مقدار باید بزرگتر یا مساوی با ${match[1]} باشد.` : "مقدار باید بزرگتر یا مساوی باشد.";
    }
    if (trimmed.includes("less than or equal to")) {
      const match = trimmed.match(/less than or equal to\s+([\d.]+)/);
      return match ? `مقدار باید کوچکتر یا مساوی با ${match[1]} باشد.` : "مقدار باید کوچکتر یا مساوی باشد.";
    }
    if (trimmed.includes("Ensure this field has no more than")) {
      const match = trimmed.match(/no more than\s+(\d+)/);
      return match ? `حداکثر طول مجاز ${match[1]} کاراکتر است.` : "تعداد کاراکترها بیش از حد مجاز است.";
    }
    if (trimmed.includes("Ensure this field has at least")) {
      const match = trimmed.match(/at least\s+(\d+)/);
      return match ? `حداقل طول مجاز ${match[1]} کاراکتر است.` : "تعداد کاراکترها کمتر از حد مجاز است.";
    }
    if (trimmed.startsWith("Invalid choice for") || trimmed.startsWith("Invalid selection for")) {
      return "گزینه انتخاب شده نامعتبر است.";
    }
    if (trimmed.includes("valid number is required") || trimmed.includes("valid integer is required")) {
      return "لطفاً یک عدد معتبر وارد کنید.";
    }
    if (trimmed.includes("valid date is required") || trimmed.includes("valid date")) {
      return "لطفاً یک تاریخ معتبر وارد کنید.";
    }
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
