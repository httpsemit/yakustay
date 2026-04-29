import type { Metadata } from "next";
import ContactClient from "@/components/layout/ContactClient";

export const metadata: Metadata = {
  title: "Contact Us | Hotel near North Lakhimpur Railway Station",
  description:
    "Get in touch with Chello Yaku Guest House. Located in Kimin, Rajapukhuri area, we are the perfect budget hotel near North Lakhimpur. Call or email us today.",
};

export default function ContactPage() {
  return <ContactClient />;
}
