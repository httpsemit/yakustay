import type { Metadata } from "next";
import ContactClient from "@/components/layout/ContactClient";

export const metadata: Metadata = {
  title: "Contact Us — Chello Yaku Guest House",
  description:
    "Get in touch with Chello Yaku Guest House in Kimin. Send us a message, find us near the petrol pump, or call us. We reply within 24 hours.",
};

export default function ContactPage() {
  return <ContactClient />;
}
