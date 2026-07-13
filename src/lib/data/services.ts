import { CoreService, SecondaryService } from "@/lib/types/service";

export const MOCK_CORE_SERVICES: CoreService[] = [
  {
    id: "1",
    slug: "mental-health",
    title: "Mental Health Support",
    description:
      "Confidential counseling and therapy sessions with professionals who understand the unique pressures of young adulthood.",
    tags: ["Anxiety", "Stress", "Identity"],
    href: "/services/mental-health",
    variant: "default",
  },
  {
    id: "2",
    slug: "srhr",
    title: "SRHR Services",
    description:
      "Expert advice on sexual and reproductive health. Private consultations, digital prescriptions, and wellness trackers.",
    tags: ["Health", "Advice", "Private"],
    href: "/services/srhr",
    variant: "default",
  },
  {
    id: "3",
    slug: "crisis-support",
    title: "Crisis Support",
    description:
      "Immediate intervention for urgent situations. Connect with a rapid response coordinator within 60 seconds.",
    tags: ["Immediate", "Emergency"],
    href: "/support",
    variant: "crisis",
    badge: "24/7 PRIORITY",
  },
];

export const MOCK_SECONDARY_SERVICES: SecondaryService[] = [
  {
    id: "4",
    slug: "financial-literacy",
    title: "Finance Mastery",
    description:
      "Master your money with Brocode Africa's youth-tailored financial planning tools.",
    image: "/images/services/financial-literacy.jpg",
    ctaLabel: "Learn More",
    href: "/services/financial-literacy",
  },
  {
    id: "5",
    slug: "peer-network",
    title: "Peer Network",
    description:
      "Connect with thousands of peers in Brocode Africa's moderated safe spaces.",
    image: "/images/community.png",
    ctaLabel: "Join Community",
    href: "/support",
  },
];
