'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';
import { useTranslation } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';

export default function WelcomeGuideModal() {
  const { t, isRTL } = useTranslation();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const shouldShow = localStorage.getItem('show_onboarding_guide') === 'true';
      if (shouldShow) {
        setIsOpen(true);
      }
    }
  }, []);

  const handleClose = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('show_onboarding_guide');
    }
    setIsOpen(false);
  };

  const handleFinish = () => {
    handleClose();
    router.push('/profile');
  };

  const steps = [
    {
      titleFa: 'گام ۱: تکمیل مشخصات و پرونده ازدواج',
      titleEn: 'Step 1: Complete Your Profile',
      subtitleFa: 'اطلاعات دقیق، مسیر پیوند پایدار',
      subtitleEn: 'Honest details ensure accurate matching',
      descriptionFa:
        'جهت آغاز فرآیند همسان‌گزینی، ابتدا بخش‌های مختلف پروفایل خود شامل اطلاعات فردی، اعتقادی، خانوادگی، مالی و معیارهای همسر دلخواه را با دقت تکمیل کنید. پرونده‌های کامل بالاترین شانس معرفی موفق را دارند.',
      descriptionEn:
        'To begin matchmaking, please complete your profile sections including personal, intellectual, family, financial, and preferred spouse criteria. Complete profiles receive top priority.',
      icon: (
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-xl shadow-brand-500/25 animate-bounce-subtle">
          <svg className="w-10 h-10 fill-current" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
      ),
      badgeColor: 'bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-300',
    },
    {
      titleFa: 'گام ۲: جستجو و کشف کاندیداهای متناسب',
      titleEn: 'Step 2: Candidate Search & Discovery',
      subtitleFa: 'فیلترهای پیشرفته بر اساس معیارها',
      subtitleEn: 'Multi-criteria demographic filtering',
      descriptionFa:
        'پس از تکمیل مشخصات، به بخش جستجوی کاندیداها بروید. می‌توانید بر اساس سن، قد و وزن، تحصیلات، اعتقادات مذهبی، محل سکونت و معیارهای ظاهری، کاندیداهای هم‌کفو خود را بیابید و بررسی کنید.',
      descriptionEn:
        'After completing your profile, explore the candidate directory. Use comprehensive filters including age, height, education, religious practices, and location to discover compatible matches.',
      icon: (
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-xl shadow-emerald-500/25 animate-bounce-subtle">
          <svg className="w-10 h-10 fill-current" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
        </div>
      ),
      badgeColor: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300',
    },
    {
      titleFa: 'گام ۳: نشان‌کردن و هماهنگی با واسط خیر',
      titleEn: 'Step 3: Bookmarks & Family Mediation',
      subtitleFa: 'آشنایی محترمانه، سنتی و امن',
      subtitleEn: 'Private coordination through your middle man',
      descriptionFa:
        'پروفایل‌های منتخب را به فهرست نشان‌شده‌ها اضافه کنید. واسط خیر اختصاصی شما با بررسی تناسب دو طرف، مراحل معارفه و گفت‌وگوی خانواده‌ها را با رعایت کامل حریم خصوصی هماهنگ خواهد نمود.',
      descriptionEn:
        'Save preferred candidate profiles to your bookmarks. Your assigned middle man will coordinate respectful, private family introductions and verified meetings.',
      icon: (
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-xl shadow-purple-500/25 animate-bounce-subtle">
          <svg className="w-10 h-10 fill-current" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </div>
      ),
      badgeColor: 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-300',
    },
  ];

  const current = steps[currentStep];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-xl w-full p-0 overflow-hidden">
      <div className="relative p-6 sm:p-8 flex flex-col items-center text-center">
        {/* Top Header Badge */}
        <div className="flex items-center justify-start w-full mb-4">
          <span className={`px-3 py-1 text-xs font-bold rounded-full ${current.badgeColor}`}>
            {isRTL ? `مرحله ${currentStep + 1} از ۳` : `Step ${currentStep + 1} of 3`}
          </span>
        </div>

        {/* Visual Graphic */}
        <div className="my-3">
          {current.icon}
        </div>

        {/* Title & Subtitle */}
        <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mt-2">
          {isRTL ? current.titleFa : current.titleEn}
        </h3>
        <p className="text-xs sm:text-sm font-semibold text-brand-600 dark:text-brand-400 mt-1">
          {isRTL ? current.subtitleFa : current.subtitleEn}
        </p>

        {/* Description Body */}
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-4 leading-relaxed max-w-md">
          {isRTL ? current.descriptionFa : current.descriptionEn}
        </p>

        {/* Progress Dots */}
        <div className="flex items-center gap-2 my-6">
          {steps.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentStep(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentStep === idx
                  ? 'w-7 bg-brand-500 shadow-sm'
                  : 'w-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300'
              }`}
              aria-label={`Go to step ${idx + 1}`}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between w-full gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div>
            {currentStep > 0 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentStep((s) => s - 1)}
                className="text-xs"
              >
                {isRTL ? '← قبلی' : '← Previous'}
              </Button>
            ) : (
              <div />
            )}
          </div>

          <div>
            {currentStep < steps.length - 1 ? (
              <Button
                size="sm"
                onClick={() => setCurrentStep((s) => s + 1)}
                className="text-xs min-w-[100px]"
              >
                {isRTL ? 'بعدی →' : 'Next →'}
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleFinish}
                className="text-xs min-w-[130px] bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/20 font-bold"
              >
                ✓ {isRTL ? 'متوجه شدم و شروع' : 'Got it & Get Started'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
