import { notFound } from "next/navigation";
import { getPage } from "@/lib/api/pages";
import CmsPageBody from "@/components/pages/CmsPageBody";

export const revalidate = 300;

export async function generateMetadata() {
  const page = await getPage("terms-of-service");
  return {
    title: page?.seo.title ?? "Terms of Service — Brocode Africa",
    description: page?.seo.description,
  };
}

export default async function TermsOfServicePage() {
  const page = await getPage("terms-of-service");
  if (!page) notFound();
  return <CmsPageBody page={page} />;
}
