export const siteConfig = {
  name: "ARAH",
  tagline: "Your Direction to Personal Growth",
  description:
    "Malaysia's Personal Growth Operating System — combine habit tracking, goal management, mood awareness, reflection, and AI coaching into one behavioral intelligence platform.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://arah.my",
  ogImage: "/og-image.png",
  creator: "ARAH Technologies Sdn Bhd",
  keywords: [
    "habit tracker",
    "personal growth",
    "productivity",
    "mood tracking",
    "goal tracking",
    "behavioral intelligence",
    "Malaysia",
    "self improvement",
  ],
  links: {
    instagram: "https://instagram.com/arah.my",
    tiktok: "https://tiktok.com/@arah.my",
    twitter: "https://twitter.com/arah_my",
    linkedin: "https://linkedin.com/company/arah-my",
  },
} as const;

// Ensure keywords is typed as an array of strings
export type SiteConfig = Omit<typeof siteConfig, "keywords"> & {
  keywords: string[];
};
