import SignInForm from "@/components/auth/SignInForm";
import { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "امین وصال - ورود به سامانه",
  description: "ورود به مرکز همسان‌گزینی و ازدواج دائم امین وصال",
};

export default function SignIn() {
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
}
