import { notFound } from "next/navigation";
import { getPage } from "@/lib/api/pages";
import CmsPageBody from "@/components/pages/CmsPageBody";

export const revalidate = 300;

export async function generateMetadata() {
  const page = await getPage("privacy-policy");
  return {
    title: page?.seo.title ?? "Privacy Policy — Brocode Africa",
    description: page?.seo.description,
  };
}

export default async function PrivacyPolicyPage() {
  const page = await getPage("privacy-policy");
  if (!page) notFound();
  return <CmsPageBody page={page} />;
}
