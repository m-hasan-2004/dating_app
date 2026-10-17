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
  // Account & Registration
  username: "نام کاربری",
  phone_number: "شماره تلفن همراه",
  email: "ایمیل",
  password: "رمز عبور",
  password2: "تکرار رمز عبور",
  access_code: "کد دعوت / دسترسی",
  middle_man_code: "کد معرف",
  first_name: "نام",
  last_name: "نام خانوادگی",
  old_password: "رمز عبور فعلی",
  new_password: "رمز عبور جدید",
  terms: "شرایط و قوانین",

  // Personal Information
  gender: "جنسیت",
  national_code: "کد ملی",
  birth_date: "تاریخ تولد",
  birth_location: "محل تولد",
  education: "تحصیلات",
  education_level: "مقطع تحصیلی",
  degree: "رشته و گرایش تحصیلی",
  military_status: "وضعیت نظام وظیفه",
  military_status_explanation: "توضیحات نظام وظیفه",
  income: "میزان درآمد ماهانه",
  deposit: "میزان پس‌انداز و ودیعه",
  have_insurance: "وضعیت بیمه",
  insurance_type: "نوع بیمه",
  insurance_years: "سابقه بیمه",
  leisure_type: "اوقات فراغت و علایق",
  usage_cases: "مصرف دخانیات یا مواد",
  usage_case_description: "توضیحات مصرف دخانیات",
  tatto: "تتو یا خالکوبی",
  tatto_description: "توضیحات تتو",
  conviction_or_arrest_history: "سابقه محکومیت یا بازداشت",
  conviction_reason: "علت محکومیت یا بازداشت",

  // Physical Information
  height: "قد",
  weight: "وزن",
  body_and_face: "ویژگی‌های چهره و اندام",
  blood_type: "گروه خونی",
  skin_color: "رنگ پوست",
  eyes_color: "رنگ چشم",
  character_and_temperament: "طبع و مزاج",
  glasses: "عینک",
  glasses_size: "نمره عینک",
  disease_or_surgery_history: "سابقه بیماری یا جراحی",
  medication_surgery_disease_type: "نوع بیماری یا جراحی",

  // Engagements and Weddings Statuses
  status: "وضعیت",
  contract_date: "تاریخ عقد",
  marriage_date: "تاریخ ازدواج",
  divorce_date: "تاریخ طلاق",
  death_date: "تاریخ فوت",
  husband_death_date: "تاریخ فوت همسر",
  contract_length: "مدت زمان دوران عقد",
  living_length: "مدت زندگی مشترک",
  reason_for_divorce_or_death: "علت طلاق یا فوت همسر",

  // Family Information
  father_name: "نام پدر",
  mother_name: "نام مادر",
  parents_divorced: "وضعیت طلاق والدین",
  father_alive: "حیات پدر",
  mother_alive: "حیات مادر",
  father_education: "تحصیلات پدر",
  mother_education: "تحصیلات مادر",
  father_job: "شغل پدر",
  mother_job: "شغل مادر",
  father_originality: "اصالت پدر",
  mother_originality: "اصالت مادر",
  contact_with_family: "میزان ارتباط با خانواده",
  contact_with_relatives: "میزان ارتباط با بستگان",
  family_culture: "فرهنگ خانواده",
  average_family_education: "میانگین تحصیلات خانواده",
  average_family_finance: "وضعیت مالی خانواده",

  // Relatives / Children
  custody: "حضانت فرزندان",
  child_quantity: "تعداد فرزندان",
  child_gender: "جنسیت فرزند",
  ex_husband_child_count: "تعداد فرزندان از همسر سابق",

  // Financial Information
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
  dowry_type: "نوع مهریه مدنظر",
  future_spouse_dowry_type: "نوع مهریه مدنظر",
  dowry_amount: "میزان مهریه مدنظر",
  future_spose_dowry_amount: "میزان مهریه مدنظر",
  jahiziyeh: "وضعیت تهیه جهیزیه",
  future_spose_jahiziyeh: "وضعیت تهیه جهیزیه",
  jahiziyeh_explantion: "توضیحات جهیزیه",
  future_spose_jahiziyeh_explanation: "توضیحات جهیزیه",

  // Intellectual Information
  marriage_goals: "اهداف و انتظارات از اصل ازدواج",
  marriage_goals_purposes: "اهداف و انتظارات از اصل ازدواج",
  opinion_woman_job: "نظر در مورد اشتغال خانم",
  opinion_about_womans_job: "نظر در مورد اشتغال خانم",
  opinion_woman_edu: "نظر در مورد ادامه تحصیل خانم",
  opinion_about_womans_education: "نظر در مورد ادامه تحصیل خانم",
  pros_of_yourself: "نقاط قوت و خصوصیات مثبت خود",
  cons_of_yourself: "نقاط ضعف و خصوصیات منفی خود",
  type_connection_friends: "کیفیت ارتباط با دوستان",
  type_of_connection_with_friends: "کیفیت ارتباط با دوستان",
  friends_connection_reason: "کیفیت و علت ارتباط با دوستان",
  political_orientation: "گرایش و علایق سیاسی",
  opinion_velayat_faqih: "نظر و التزام به ولایت فقیه",
  opinion_about_velayat_faqih: "نظر و التزام به ولایت فقیه",
  opinion_child_quantity: "تعداد فرزندان مدنظر",
  opinion_about_child_quantity: "تعداد فرزندان مدنظر",
  contract_how: "نحوه برگزاری مراسم عقد",
  wedding_how: "نحوه برگزاری مراسم عروسی",
  worship_prayer: "میزان تقید و پایبندی به نماز و عبادات",
  worship_and_prayer: "میزان تقید و پایبندی به نماز و عبادات",
  fasting: "میزان پایبندی به روزه گرفتن",
  fasting_status: "میزان پایبندی به روزه گرفتن",
  fasting_explanation: "توضیحات مربوط به روزه‌داری",
  cover_type_house: "نوع پوشش در خانه",
  cover_type_society: "پوشش و حجاب در جامعه",
  society_cover: "پوشش و حجاب در جامعه",
  participating_prayer_quran_meetings: "میزان شرکت در مجالس مذهبی و هیئات",
  music: "میزان گوش دادن به موسیقی",
  music_status: "میزان گوش دادن به موسیقی",
  dance_singing_assemblies: "حضور در مجالس رقص و آواز",
  opinion_innocent_contact: "ارتباط با نامحرم",
  opinion_about_innocent_contact: "ارتباط با نامحرم",
  cover_type_innocent_contact: "نوع پوشش در ارتباط با نامحرم",
  decision_making_choosing_spouse: "نحوه تصمیم‌گیری در انتخاب همسر",

  // Preferred Wife / Future Spouse
  appearance_type: "تیپ و پوشش ظاهری مدنظر همسر",
  age_difference: "اختلاف سنی مدنظر با همسر",
  future_spouse_family_religious_status_importance: "میزان اهمیت وضعیت مذهبی خانواده همسر",
  future_spouse_family_financial_status_importance: "میزان اهمیت وضعیت مالی خانواده همسر",
  marriage_with_someone_with_marriage_experience: "ازدواج با فرد دارای تجربه عقد و ازدواج",
  marriage_with_someone_explanation: "توضیحات سابقه ازدواج قبلی",
  most_important_moral_feature: "مهم‌ترین ویژگی اخلاقی مدنظر همسر",
  most_important_moral_feature_of_future_spouse: "مهم‌ترین ویژگی اخلاقی مدنظر همسر",
  marriage_with_disabled: "ازدواج با فرد دارای معلولیت جسمی",
  marriage_with_disabled_person: "ازدواج با فرد دارای معلولیت جسمی",
  marriage_with_veteran: "ازدواج با فرد جانباز",
  marriage_with_veteran_person: "ازدواج با فرد جانباز",
  marriage_disabled_veteran_explanation: "توضیحات ازدواج با جانباز یا معلول",
  red_flags: "خطوط قرمز و نبایدهای اخلاقی و رفتاری",
  field_of_study: "رشته تحصیلی همسر",
  future_spouse_job: "شغل همسر مدنظر",
  current_residence_location: "محل سکونت فعلی همسر",
  after_marriage_residence_location: "محل سکونت پس از ازدواج",
  future_spouse_ethnicity: "قومیت و اصالت مدنظر",
  future_spouse_originality: "قومیت و اصالت مدنظر",
  height_min: "حداقل قد",
  height_max: "حداکثر قد",
  weight_min: "حداقل وزن",
  weight_max: "حداکثر وزن",
  additional_explanations: "توضیحات تکمیلی",

  // General Location
  province: "استان",
  city: "شهر",
  address: "آدرس",
  living_location: "محل سکونت",
  job: "شغل",
  smoking_status: "استعمال دخانیات",
  hookah_status: "مصرف قلیان",
  alcohol_status: "مصرف مشروبات الکلی",
  drugs_status: "مصرف مواد مخدر",
  alive: "در قید حیات",
  originality: "اصالت",
  // Confidential / Identity & Birth Certificate
  eitta_number: "شماره ایتا",
  landline_phone: "تلفن ثابت",
  mother_phone: "تلفن مادر",
  father_phone: "تلفن پدر",
  home_address: "آدرس منزل",
  work_address: "آدرس محل کار",
  insurance: "بیمه",
  assets: "دارایی‌ها",
  prefered_meeting_time: "اوقات پیشنهادی ملاقات",
  type_of_payment: "نوع پرداخت",
  payment_proof: "رسید پرداخت",
  birth_certificate_serial: "سریال شناسنامه",
  birth_certificate_location: "محل صدور شناسنامه",
  marriage_experince: "تجربه ازدواج",
  marriage_status: "وضعیت تاهل",
  children: "فرزندان",
  children_custody: "حضانت فرزندان",

  // Relatives / Family Members
  groom_or: "داماد یا زن داداش",
  bride_or: "عروس یا شوهر خواهر",
  number_of_sisters: "تعداد خواهران",
  number_of_brothers: "تعداد برادران",
  family_divorce_history: "سابقه طلاق در خانواده",
  family_divorce_reason: "دلایل طلاق در خانواده",
  language: "زبان",

  // Subject details & Introduced
  postive: "ارزیابی مثبت",
  positive: "ارزیابی مثبت",
  negative: "ارزیابی منفی",
  reason: "علت",
  dates_of_meetings: "تاریخ ملاقات‌ها",
  result_and_regards: "نتیجه و ملاحظات",
  result_regards: "نتیجه و ملاحظات",
  cost_of_introduction: "هزینه معرفی",
  cost_of_meeting: "هزینه ملاقات",
  preferred_date_times: "اوقات پیشنهادی ملاقات",
  signup_fee_type: "هزینه ثبت نام",
  account_number: "شماره حساب",
  bank: "نام بانک",
  bank_name: "نام بانک",
  gender_target: "نام و مشخصات صاحب حساب",
  amount: "مبلغ",
  professional_opinion: "نظر کلی کارشناسی",

  // Preferred Wife & Miscellaneous
  sadat: "سادات",
  disease_or_surgery: "بیماری یا جراحی",
  additional_explnation_marriage_with_someone: "توضیحات سابقه ازدواج قبلی",
  marriage_with_veteran_disabled_explanation: "توضیحات ازدواج با معلول یا جانباز",
  bookmarked_user: "کاربر نشان‌شده",
  code: "کد دسترسی",
  user: "کاربر",
  id: "شناسه",
  date_created: "تاریخ ایجاد",
  date_joined: "تاریخ پیوستن",
  last_login: "آخرین ورود",
  is_superuser: "ابرکاربر",
  is_staff: "وضعیت کارمندی",
  is_active: "فعال",
  active: "فعال",
  groups: "گروه‌ها",
  user_permissions: "اجازه‌های کاربر",
  updated_at: "تاریخ به‌روزرسانی",
};

export const COMMON_ERROR_TRANSLATIONS_FA: Record<string, string> = {
  // Required & Blank errors
  "This field is required.": "تکمیل این بخش الزامی است.",
  "This field may not be blank.": "این قسمت نباید خالی باشد.",
  "This field may not be null.": "لطفاً یک گزینه را انتخاب کنید.",
  "این مقدار نباید خالی باشد.": "تکمیل این بخش الزامی است.",
  "این مقدار نباید توهی باشد.": "لطفاً یک گزینه را انتخاب کنید.",
  "این مقدار نباید تهی باشد.": "لطفاً یک گزینه را انتخاب کنید.",

  // Choices & Selection
  "Invalid choice.": "لطفاً یک گزینه معتبر انتخاب نمایید.",
  "Select a valid choice. That choice is not one of the available choices.": "گزینه انتخابی معتبر نیست؛ لطفاً از گزینه‌های موجود انتخاب کنید.",
  '"" یک انتخاب معتبر نیست.': "لطفاً یک گزینه را انتخاب کنید.",
  '"[]" یک انتخاب معتبر نیست.': "لطفاً حداقل یک گزینه را انتخاب کنید.",
  "\"\" is not a valid choice.": "لطفاً یک گزینه را انتخاب کنید.",
  "\"[]\" is not a valid choice.": "لطفاً حداقل یک گزینه را انتخاب کنید.",

  // Dates
  "Enter a valid date.": "لطفاً تاریخ را به صورت صحیح انتخاب یا وارد کنید.",
  "Enter a valid date/time.": "لطفاً تاریخ و زمان را به درستی وارد کنید.",
  "فرمت تاریخ اشتباه است. از یکی از این فرمت ها استفاده کنید: YYYY-MM-DD.": "فرمت تاریخ صحیح نیست (مثال صحیح: ۱۳۷۴/۰۶/۱۵).",

  // Numbers
  "A valid number is required.": "لطفاً یک عدد معتبر وارد کنید.",
  "A valid integer is required.": "لطفاً یک عدد صحیح وارد کنید.",
  "Enter a whole number.": "لطفاً یک عدد صحیح وارد نمایید.",
  "Enter a number.": "لطفاً فقط مقدار عددی وارد کنید.",

  // Auth & Account
  "A user with that phone number already exists.": "این شماره تلفن قبلاً در سامانه ثبت شده است.",
  "This phone number is already taken.": "این شماره تلفن قبلاً در سامانه ثبت شده است.",
  "A user with that username already exists.": "این نام کاربری قبلاً انتخاب شده است.",
  "This username is already taken.": "این نام کاربری قبلاً انتخاب شده است.",
  "A user with that email already exists.": "این ایمیل قبلاً در سامانه ثبت شده است.",
  "This email is already taken.": "این ایمیل قبلاً در سامانه ثبت شده است.",
  "The two password fields didn't match.": "رمزهای عبور وارد شده یکسان نیستند.",
  "Passwords do not match.": "رمزهای عبور وارد شده یکسان نیستند.",
  "Invalid credentials.": "نام کاربری یا کلمه عبور نادرست است.",
  "Account is disabled.": "حساب کاربری شما غیرفعال شده است.",
  "Session already active.": "نشست کاربری شما فعال است.",
  "Invalid access code.": "کد دعوت نامعتبر است یا منقضی شده است.",
  "Access code is invalid.": "کد دعوت معتبر نمی‌باشد.",
  "Access code cannot be blank.": "ورود کد دعوت الزامی است.",
  "Current password is incorrect.": "رمز عبور فعلی اشتباه است.",
  "New password cannot be the same as old password.": "رمز عبور جدید نمی‌تواند مشابه رمز عبور قبلی باشد.",
  "Please enter your invitation access code.": "لطفاً کد دعوت خود را وارد کنید.",
  "Please enter a username.": "لطفاً نام کاربری را وارد کنید.",
  "Username must be at least 3 characters.": "نام کاربری باید حداقل ۳ کاراکتر باشد.",
  "Username can only contain English letters, numbers, and underscores.": "نام کاربری فقط می‌تواند شامل حروف انگلیسی، اعداد و زیرخط باشد.",
  "Please enter your email address.": "لطفاً آدرس ایمیل را وارد کنید.",
  "Please enter a valid email address.": "لطفاً یک آدرس ایمیل معتبر وارد کنید.",
  "Enter a valid email address.": "لطفاً یک آدرس ایمیل معتبر وارد کنید.",
  "Please enter your mobile phone number.": "لطفاً شماره تلفن همراه را وارد کنید.",
  "Please enter a valid mobile number (e.g. 09123456789).": "لطفاً شماره همراه معتبر ۱۱ رقمی وارد نمایید (مثال: ۰۹۱۲۳۴۵۶۷۸۹).",
  "Enter a valid phone number (e.g. 0912 345 6789) or a valid phone number with country code.": "شماره تلفن همراه معتبر نیست.",
  "The phone number entered is not valid.": "شماره تلفن همراه وارد شده معتبر نیست.",
  "Please enter a password.": "لطفاً رمز عبور را وارد نمایید.",
  "Password must be at least 8 characters long.": "رمز عبور باید حداقل ۸ کاراکتر باشد.",
  "Password must contain both letters and numbers.": "رمز عبور باید هم شامل حروف و هم اعداد باشد.",
  "Please confirm your password.": "لطفاً تکرار رمز عبور را وارد کنید.",
  "You must agree to the Terms, Conditions, and Privacy Policy.": "پذیرش قوانین و شرایط سامانه الزامی است.",
  "Please fix the errors in the form before submitting.": "لطفاً موارد مشخص‌شده در فرم را اصلاح نمایید.",
  "Registration failed. Please check your access code and details.": "ثبت‌نام ناموفق بود. لطفاً کد دعوت و مشخصات خود را بررسی کنید.",
  "Registration failed. Please check your details and try again.": "ثبت‌نام ناموفق بود. لطفاً مشخصات خود را بررسی و مجدداً تلاش کنید.",
  "Failed to sign in. Please check your credentials.": "ورود ناموفق بود. نام کاربری یا کلمه عبور را بررسی کنید.",
  "Network error": "خطای ارتباط با سرور. لطفاً اتصال اینترنت خود را بررسی نمایید.",
  "An unexpected error occurred": "خطای غیرمنتظره‌ای رخ داده است.",
  "Must be at least 18 years old": "حداقل سن مجاز ۱۸ سال است.",
  "Age cannot exceed 100 years": "سن وارد شده معتبر نیست.",
};

/**
 * Translates and humanizes a single error message string.
 */
function translateMsg(msg: string, t?: (k: string) => string, isRTL: boolean = true): string {
  if (!msg) return "";
  let trimmed = msg.trim();

  // Strip JSON array/quote wrappers if raw
  if (trimmed.startsWith('["') && trimmed.endsWith('"]')) {
    trimmed = trimmed.slice(2, -2).trim();
  }

  if (t) {
    const translated = t(trimmed);
    if (translated && translated !== trimmed) return translated;
  }

  if (isRTL) {
    if (COMMON_ERROR_TRANSLATIONS_FA[trimmed]) {
      return COMMON_ERROR_TRANSLATIONS_FA[trimmed];
    }

    // Direct pattern matches for known technical strings
    if (trimmed.includes("یک انتخاب معتبر نیست")) {
      if (trimmed.includes("[]")) return "لطفاً حداقل یک گزینه را انتخاب کنید.";
      return "لطفاً یک گزینه را انتخاب کنید.";
    }
    if (trimmed.includes("is not a valid choice")) {
      if (trimmed.includes("[]")) return "لطفاً حداقل یک گزینه را انتخاب کنید.";
      return "لطفاً یک گزینه را انتخاب کنید.";
    }
    if (trimmed.includes("این مقدار نباید خالی باشد") || trimmed.includes("may not be blank")) {
      return "تکمیل این بخش الزامی است.";
    }
    if (trimmed.includes("نباید توهی باشد") || trimmed.includes("نباید تهی باشد") || trimmed.includes("may not be null")) {
      return "لطفاً یک گزینه را انتخاب کنید.";
    }
    if (trimmed.includes("فرمت تاریخ اشتباه است") || trimmed.includes("valid date format")) {
      return "فرمت تاریخ صحیح نیست (مثال صحیح: ۱۳۷۴/۰۶/۱۵).";
    }
    if (trimmed.includes("greater than or equal to")) {
      const match = trimmed.match(/greater than or equal to\s+([\d.]+)/);
      return match ? `مقدار باید حداقل ${match[1]} باشد.` : "مقدار وارد شده کمتر از حد مجاز است.";
    }
    if (trimmed.includes("less than or equal to")) {
      const match = trimmed.match(/less than or equal to\s+([\d.]+)/);
      return match ? `مقدار باید حداکثر ${match[1]} باشد.` : "مقدار وارد شده بیشتر از حد مجاز است.";
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

/**
 * Returns a short error message suitable for the bottom of a modal form.
 * If there are field errors, returns a short prompt to fix inline errors.
 * Otherwise returns the formatted error message (or the fallback prompt).
 */
export function bottomErrorMessage(
  formatted: FormattedError,
  t?: (k: string) => string
): string {
  const fixMessage = t
    ? t("Please fix the errors in the form before submitting.")
    : "Please fix the errors in the form before submitting.";

  if (Object.keys(formatted.fieldErrors).length > 0) {
    return fixMessage;
  }
  return formatted.message || fixMessage;
}
