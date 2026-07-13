import { FaqItem, SupportChannel } from "@/lib/types/support";

export const MOCK_SUPPORT_CHANNELS: SupportChannel[] = [
  {
    id: "crisis-hotline",
    title: "Crisis Hotline",
    description:
      "Immediate voice support from a trained rapid response coordinator. For urgent, time-sensitive situations.",
    availability: "24/7 · Answered in under 60 seconds",
    ctaLabel: "Call Now",
    href: "tel:+233800100200",
    icon: "phone",
    urgency: "emergency",
    external: true,
  },
  {
    id: "ma-guy-chat",
    title: "Chat with Ma Guy",
    description:
      "Talk it through anonymously with our AI-guided companion, available whenever you need to be heard.",
    availability: "24/7 · Instant response",
    ctaLabel: "Chat Now",
    href: "/ma-guy",
    icon: "chat",
    urgency: "standard",
  },
  {
    id: "sms-support",
    title: "Text Support",
    description:
      "Prefer texting? Send a message and a coordinator will respond discreetly, no calls required.",
    availability: "Mon–Sat · 8am–10pm",
    ctaLabel: "Send a Text",
    href: "sms:+233800100200",
    icon: "sms",
    urgency: "standard",
    external: true,
  },
  {
    id: "email-support",
    title: "Email a Coordinator",
    description:
      "For non-urgent questions, drop us a note and get a thoughtful, private reply within one business day.",
    availability: "Response within 24 hours",
    ctaLabel: "Email Us",
    href: "mailto:support@brocodeafrica.com",
    icon: "email",
    urgency: "standard",
    external: true,
  },
];

export const MOCK_SUPPORT_FAQS: FaqItem[] = [
  {
    id: "faq-1",
    question: "Is everything I share with Brocode Africa confidential?",
    answer:
      "Yes. All conversations, whether with a coordinator, on our hotline, or through Ma Guy, are private and anonymous by default. We never share your identity or details with third parties without your explicit consent, except where required by law to protect someone's safety.",
  },
  {
    id: "faq-2",
    question: "What counts as a crisis situation?",
    answer:
      "A crisis is any moment where you feel unsafe, are in danger, or are experiencing a mental health emergency, including thoughts of self-harm. If you're unsure, reach out anyway. Our coordinators are trained to assess urgency and will never turn you away.",
  },
  {
    id: "faq-3",
    question: "How fast will someone respond?",
    answer:
      "The Crisis Hotline connects you to a live coordinator in under 60 seconds, 24/7. Ma Guy responds instantly. Text and email channels are for non-urgent matters and are answered within 24 hours.",
  },
  {
    id: "faq-4",
    question: "Do I need to create an account to get support?",
    answer:
      "No. You can access the hotline, chat, or coordinator form anonymously without signing up. Creating a free pseudonymous profile simply lets you save your conversation history and revisit resources later.",
  },
  {
    id: "faq-5",
    question: "What happens after I submit the coordinator request form?",
    answer:
      "A member of our support team reviews your message and reaches out through your preferred contact method, usually within a few hours. For anything urgent, please use the Crisis Hotline or Ma Guy chat instead of the form.",
  },
  {
    id: "faq-6",
    question: "Is this service free?",
    answer:
      "Yes, all Brocode Africa support channels, including the crisis hotline, chat, and coordinator consultations, are completely free to access for young people across the continent.",
  },
];
