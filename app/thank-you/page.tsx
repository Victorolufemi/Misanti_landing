import type { Metadata } from "next";
import { ThankYou } from "./ThankYou";

export const metadata: Metadata = {
  title: "You are on the list · Misanti",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ThankYou />;
}
