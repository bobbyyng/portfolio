import type { Metadata } from "next";

const siteName = "Bobby Yeung";

const siteDescription =
  "Software developer building AI/RAG agents, scalable RESTful services and internal platforms.";

function getSiteUrl(): URL {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  return new URL(url);
}

export const siteConfig = {
  name: siteName,
  description: siteDescription,
  url: getSiteUrl(),
  defaultOgImage: "/icons/icon-512.png",
};

type CreatePageMetadataOptions = {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  publishedTime?: string;
  tags?: string[];
};

export function createPageMetadata({
  title,
  description = siteDescription,
  path = "",
  image = siteConfig.defaultOgImage,
  imageAlt = title,
  type = "website",
  publishedTime,
  tags,
}: CreatePageMetadataOptions): Metadata {
  const url = new URL(path, siteConfig.url).toString();

  return {
    title,
    description,
    alternates: {
      canonical: path || "/",
    },
    openGraph: {
      title,
      description,
      url,
      siteName,
      locale: "en_US",
      type,
      ...(publishedTime ? { publishedTime } : {}),
      ...(tags?.length ? { tags } : {}),
      images: [
        {
          url: image,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export const rootMetadata: Metadata = {
  metadataBase: siteConfig.url,
  title: {
    default: `${siteName} — Software Developer`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  openGraph: {
    type: "website",
    siteName,
    locale: "en_US",
    title: `${siteName} — Software Developer`,
    description: siteDescription,
    url: "/",
    images: [
      {
        url: siteConfig.defaultOgImage,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} — Software Developer`,
    description: siteDescription,
    images: [siteConfig.defaultOgImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: siteName,
  },
  icons: {
    apple: "/icons/apple-touch-icon.png",
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  },
};
