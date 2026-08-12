import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROGRAMMATIC_TEMPLATES } from "@/lib/templates";
import TemplatePageClient from "./TemplatePageClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate static paths at build time for programmatic SEO templates
export async function generateStaticParams() {
  return PROGRAMMATIC_TEMPLATES.map((t) => ({
    slug: t.slug,
  }));
}

// Dynamic SEO metadata block
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const template = PROGRAMMATIC_TEMPLATES.find((t) => t.slug === slug);

  if (!template) {
    return {
      title: "Template Not Found | mems.in",
      description: "The requested meme template could not be found.",
    };
  }

  const titleText = `${template.name} Meme Generator & Creator - mems.in`;
  const descText = `Generate custom ${template.name} memes online for free. Edit text overlays, adjust fonts, outlines, drag and position layers. Simple, fast and watermark-free.`;

  return {
    title: titleText,
    description: descText,
    alternates: {
      canonical: `/templates/${template.slug}`,
    },
    openGraph: {
      title: `${template.name} Meme Maker Online`,
      description: descText,
      url: `https://mems.in/templates/${template.slug}`,
      siteName: "mems.in",
      type: "website",
      images: [
        {
          url: template.url,
          width: template.width,
          height: template.height,
          alt: `${template.name} Template`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${template.name} Meme Generator`,
      description: descText,
      images: [template.url],
    },
  };
}

export default async function ProgrammaticTemplatePage({ params }: PageProps) {
  const { slug } = await params;
  const template = PROGRAMMATIC_TEMPLATES.find((t) => t.slug === slug);

  if (!template) {
    notFound();
  }

  // Schema Markup specific to this template tool
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": `${template.name} Meme Generator`,
    "url": `https://mems.in/templates/${template.slug}`,
    "operatingSystem": "All",
    "applicationCategory": "MultimediaApplication",
    "description": `Create custom ${template.name} memes online. Adjust fonts, outlines, and colors. Drag and drop text overlays directly on the canvas.`,
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "image": template.url
  };

  return (
    <>
      {/* Dynamic structured data script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      
      <TemplatePageClient template={template} />
    </>
  );
}
