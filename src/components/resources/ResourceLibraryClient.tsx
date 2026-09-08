"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ResourceFilter, ResourceItem } from "@/lib/types/resource";

const FILTERS: Array<ResourceFilter | "All Resources"> = [
  "All Resources",
  "Health",
  "Wealth",
  "Self-Dev",
  "Courses",
];

export default function ResourceLibraryClient({ resources }: { resources: ResourceItem[] }) {
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>("All Resources");
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(9);

  const filtered = useMemo(() => {
    let list = resources;
    if (activeFilter !== "All Resources") {
      list = list.filter((resource) => resource.filters?.includes(activeFilter));
    }
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (resource) =>
          resource.title.toLowerCase().includes(q) ||
          resource.excerpt?.toLowerCase().includes(q) ||
          resource.category.toLowerCase().includes(q),
      );
    }
    return list;
  }, [resources, activeFilter, query]);

  const articles = filtered.filter((r) => (r.type ?? "article") === "article");
  const courses = filtered.filter((r) => r.type === "course");
  const downloads = filtered.filter((r) => r.type === "download");

  const visibleArticles = articles.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div className="flex flex-col gap-16 w-full">
      {/* Search */}
      <div className="flex flex-col items-center gap-10 w-full">
        <div className="bg-[#1c1b1b] border border-[rgba(77,70,53,0.2)] rounded-lg flex items-center p-[9px] w-full max-w-[672px]">
          <div className="pl-4">
            <SearchIcon />
          </div>
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search resources, courses, and guides..."
            className="flex-1 bg-transparent px-4 py-[13px] text-[16px] text-[#e5e2e1] placeholder:text-[rgba(153,144,124,0.6)] outline-none"
          />
          <button
            type="button"
            className="bg-[#ebc249] rounded px-8 py-3 font-manrope font-bold text-[16px] text-[#3d2e00]"
          >
            Search
          </button>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-4 items-center justify-center w-full border-b border-[rgba(255,255,255,0.05)] pb-6">
          {FILTERS.map((filter) => {
            const isActive = filter === activeFilter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 rounded-xl font-manrope font-bold text-xs tracking-[1.2px] uppercase transition-colors ${
                  isActive
                    ? "bg-[#ebc249] text-[#3d2e00]"
                    : "bg-[#201f1f] text-[#d1c5af] hover:text-[#e5e2e1]"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center bg-[#1c1b1b] border border-[rgba(77,70,53,0.1)] rounded-[32px]">
          <p className="font-geist font-black text-xl text-[#e5e2e1]">No resources found</p>
          <p className="max-w-sm text-sm text-[rgba(229,226,225,0.5)]">
            Try a different search term or explore another category.
          </p>
        </div>
      ) : (
        <>
          {visibleArticles.length > 0 && (
            <section className="flex flex-col gap-10">
              <SectionHeading
                title="Health Blogs"
                description="Curated editorial content on mental resilience, SRHR advocacy, and community health for African men."
                href="#"
                linkLabel="View All"
              />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {visibleArticles.map((resource) => (
                  <ArticleCard key={resource.id} resource={resource} />
                ))}
              </div>
            </section>
          )}

          {courses.length > 0 && (
            <section className="flex flex-col gap-10">
              <SectionHeading
                title="Courses"
                description="Structured, self-paced learning modules built for Africa's rising digital leaders."
                href="#"
                linkLabel="View All Courses"
              />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((resource) => (
                  <CourseCard key={resource.id} resource={resource} />
                ))}
              </div>
            </section>
          )}

          {downloads.length > 0 && (
            <section className="flex flex-col gap-10">
              <SectionHeading
                title="Guides & Downloads"
                description="Toolkits, templates, and reference documents you can save and revisit offline."
              />
              <div className="grid md:grid-cols-2 gap-6">
                {downloads.map((resource) => (
                  <DownloadItem key={resource.id} resource={resource} />
                ))}
              </div>
            </section>
          )}

          {hasMore && (
            <div className="flex items-center justify-center pt-6">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + 6)}
                className="flex items-center gap-3 px-12 py-[18px] rounded-2xl bg-[#ebc249] font-geist font-black text-[16px] text-[#3d2e00] shadow-[0px_10px_15px_-3px_rgba(235,194,73,0.2),0px_4px_6px_-4px_rgba(235,194,73,0.2)]"
              >
                Load More Resources
                <ChevronDownIcon />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function SectionHeading({
  title,
  description,
  href,
  linkLabel,
}: {
  title: string;
  description: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div className="flex flex-col gap-3 max-w-[600px]">
        <h2 className="font-geist font-black text-3xl text-[#e5e2e1]">{title}</h2>
        <p className="text-[16px] leading-6 text-[rgba(229,226,225,0.5)]">{description}</p>
      </div>
      {href && linkLabel && (
        <Link
          href={href}
          className="hidden sm:flex items-center gap-2 shrink-0 font-bold text-sm text-[#ebc249] whitespace-nowrap"
        >
          {linkLabel}
          <ArrowRightIcon />
        </Link>
      )}
    </div>
  );
}

function ArticleCard({ resource }: { resource: ResourceItem }) {
  return (
    <div className="bg-[#1c1b1b] border border-[rgba(77,70,53,0.1)] rounded-2xl overflow-hidden flex flex-col">
      <div className="relative h-56 w-full">
        <Image src={resource.image} alt={resource.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px" className="object-cover" />
        <span className="absolute left-4 top-4 bg-[rgba(42,42,42,0.9)] backdrop-blur-sm px-3 py-1 rounded-xl font-geist font-black text-[10px] tracking-[0.5px] uppercase text-[#e5e2e1]">
          {resource.category}
        </span>
      </div>
      <div className="flex flex-col gap-4 p-8">
        <h3 className="font-geist font-black text-xl text-[#e5e2e1]">{resource.title}</h3>
        <p className="text-sm leading-[23px] text-[rgba(229,226,225,0.5)]">{resource.excerpt}</p>
        <Link
          href={`/resources/${resource.slug}`}
          className="flex items-center gap-2 font-bold text-sm text-[#ebc249] w-fit"
        >
          Read More
          <ArrowRightIcon />
        </Link>
      </div>
    </div>
  );
}

function CourseCard({ resource }: { resource: ResourceItem }) {
  return (
    <div className="bg-[#1c1b1b] border border-[rgba(77,70,53,0.1)] rounded-2xl flex flex-col p-8 gap-6">
      <div className="flex gap-2 flex-wrap">
        {resource.courseTags?.map((tag, index) => (
          <span
            key={tag}
            className={`px-3 py-1 rounded-xl font-manrope font-bold text-xs uppercase ${
              index === 0
                ? "bg-[rgba(235,194,73,0.1)] text-[#ebc249]"
                : "bg-[#2a2a2a] text-[rgba(229,226,225,0.6)]"
            }`}
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="font-geist font-black text-xl text-[#e5e2e1]">{resource.title}</h3>
        <p className="text-sm leading-[23px] text-[rgba(229,226,225,0.5)]">{resource.excerpt}</p>
      </div>
      <div className="flex items-center justify-between border-t border-[rgba(255,255,255,0.05)] pt-6">
        <span className="text-sm font-bold text-[#e5e2e1]">
          {resource.price} • {resource.duration}
        </span>
        <Link
          href={`/resources/${resource.slug}`}
          className="px-6 py-3 rounded-lg bg-[#353534] font-geist font-black text-sm text-[#e5e2e1]"
        >
          Enroll Now
        </Link>
      </div>
    </div>
  );
}

function DownloadItem({ resource }: { resource: ResourceItem }) {
  return (
    <div className="bg-[#1c1b1b] border border-[rgba(77,70,53,0.1)] rounded-2xl flex items-center gap-6 p-[25px]">
      <div className="shrink-0 size-14 rounded-2xl bg-[rgba(235,194,73,0.1)] flex items-center justify-center">
        <FileIcon />
      </div>
      <div className="flex-1 flex flex-col gap-[6px] min-w-0">
        <h4 className="font-geist font-black text-[18px] text-[#e5e2e1] truncate">
          {resource.title}
        </h4>
        <p className="text-sm text-[rgba(229,226,225,0.5)]">
          {resource.fileType} • {resource.fileSize}
        </p>
      </div>
      {resource.downloadUrl ? (
        <a
          href={resource.downloadUrl}
          className="shrink-0 size-10 rounded-lg bg-[#2a2a2a] flex items-center justify-center text-[#ebc249] hover:bg-[#353534]"
          aria-label={`Download ${resource.title}`}
        >
          <DownloadIcon />
        </a>
      ) : (
        <span
          className="shrink-0 size-10 rounded-lg bg-[#2a2a2a] flex items-center justify-center text-[rgba(229,226,225,0.25)]"
          title="Not available yet"
          aria-label={`${resource.title} — download not available yet`}
        >
          <DownloadIcon />
        </span>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="6.5" stroke="rgba(153,144,124,0.6)" strokeWidth="1.5" />
      <path d="M17 17l-4-4" stroke="rgba(153,144,124,0.6)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2 6h8M6 2l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1 1.5l5 5 5-5"
        stroke="#3d2e00"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 2.5h9l5 5v15a1 1 0 01-1 1H6a1 1 0 01-1-1v-19a1 1 0 011-1z"
        stroke="#ebc249"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M15 2.5v5h5" stroke="#ebc249" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 1v9m0 0l3.5-3.5M8 10L4.5 6.5M2 13h12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
