export type ChannelUrgency = "emergency" | "standard";

export interface SupportChannel {
  id: string;
  title: string;
  description: string;
  availability: string;
  ctaLabel: string;
  href: string;
  icon: "phone" | "chat" | "sms" | "email";
  urgency: ChannelUrgency;
  /** True when the href is an external tel:/sms:/mailto: link rather than an internal route. */
  external?: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface CoordinatorRequest {
  name: string;
  email: string;
  topic: string;
  message: string;
}

export interface CoordinatorRequestResult {
  success: boolean;
  ticketId?: string;
  message: string;
}
