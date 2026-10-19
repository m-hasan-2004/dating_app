import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "امین وصال - ثبت‌نام متقاضی",
  description: "ثبت‌نام در مرکز همسان‌گزینی و ازدواج دائم امین وصال",
};

export default function SignUp() {
  return <SignUpForm />;
}
