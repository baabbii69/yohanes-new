// All site content lives here. Swap the placeholder values for real ones as they come in.
// Case study copy is drafted from a one-line brief per project: rewrite it in your own words.
// Photos for projects without public screenshots are openly licensed (see `credits`).

export type Category = "web" | "mobile" | "dashboard" | "backend";

export interface Project {
  slug: string;
  name: string;
  kind: string;
  categories: Category[];
  year: string; // TODO: confirm
  role: string;
  services: string[];
  summary: string;
  challenge: string;
  approach: string;
  outcome: string;
  url?: string;
  images: string[]; // base names in public/work, first one is the cover
  imageNote?: string; // shown on the case study when images are stand-ins
}

export const projects: Project[] = [
  {
    slug: "hawi",
    name: "Hawi Software",
    kind: "Studio landing page",
    categories: ["web"],
    year: "2025",
    role: "Design and front-end",
    services: ["UI design", "Motion", "Front-end build"],
    summary: "The public face of a custom software studio in Adama: a confident landing page that explains what the team builds and how they work.",
    challenge: "Hawi needed to look like a serious engineering partner to clients across Ethiopia and abroad, without leaning on stock clichés.",
    approach: "A dark hero with real team photography, a precise type system and a step-by-step process section that reads like a project plan.",
    outcome: "A fast, responsive site the team uses as their main sales tool.",
    url: "https://hawisoftware.com",
    images: ["hawi-1", "hawi-2", "hawi-3"],
  },
  {
    slug: "fiker",
    name: "Fiker Foods",
    kind: "Company website",
    categories: ["web"],
    year: "2024",
    role: "Design and build",
    services: ["UI design", "Front-end build", "Content structure"],
    summary: "A website for an Ethiopian food processing company that presents its products, its factory and the people behind them.",
    challenge: "Show a product range clearly to distributors and families, and make a local manufacturer feel as trustworthy as an imported brand.",
    approach: "Warm, appetising product photography up front, a simple product catalogue and a clear route to wholesale enquiries.",
    outcome: "A site the sales team can send to any distributor in one link.",
    url: "https://fikerfoods.et",
    images: ["fiker-1", "fiker-2"],
    imageNote: "Stand-in photography until the final screenshots are added.",
  },
  {
    slug: "auction",
    name: "Auction Ethiopia",
    kind: "Web and mobile redesign",
    categories: ["web", "mobile"],
    year: "2024",
    role: "UI and UX redesign",
    services: ["UX audit", "UI design", "Design system", "Mobile app"],
    summary: "A redesign of an online auction platform, from browsing lots to placing a bid, across the website and the mobile app.",
    challenge: "The old product made bidding feel risky: unclear lot details, hidden deadlines and a login wall before anything useful.",
    approach: "Lots first, login later. Countdown and current bid always visible, and one shared component set for web and mobile.",
    outcome: "A single design system that both the web team and the app team build from.",
    images: ["auction-1", "auction-2"],
    imageNote: "Stand-in photography until the final screens are added.",
  },
  {
    slug: "harambee",
    name: "Harambee University",
    kind: "Student app and student system",
    categories: ["mobile", "dashboard"],
    year: "2023",
    role: "UI design",
    services: ["Mobile UI", "Admin UI", "Design system"],
    summary: "A mobile app for students and the interface for the college's student information system in Adama.",
    challenge: "Students checked grades, schedules and payments in three different places, and staff re-entered the same data by hand.",
    approach: "One student app for everyday tasks and one admin system for registrar staff, sharing the same data and components.",
    outcome: "Screens for registration, grades, schedules and payments, ready for the development team.",
    images: ["harambee-1", "harambee-2"],
    imageNote: "Stand-in photography until the final screens are added.",
  },
  {
    slug: "opsa",
    name: "Oromia Private School Association",
    kind: "Landing page and dashboard",
    categories: ["web", "dashboard"],
    year: "2025",
    role: "Design and build",
    services: ["UI design", "Dashboard", "Front-end build"],
    summary: "A public site for the association and a dashboard where member schools manage their profiles, reports and announcements.",
    challenge: "Hundreds of member schools, each with different levels of comfort with software, all needing to report to one office.",
    approach: "Big, plain forms and a dashboard built around the three things a school admin does every week.",
    outcome: "One place for the association to reach every member school.",
    images: ["opsa-1", "opsa-2"],
    imageNote: "Stand-in photography until the final screens are added.",
  },
  {
    slug: "cowsville",
    name: "Cowsville",
    kind: "Farm management system",
    categories: ["backend", "dashboard"],
    year: "2025",
    role: "Backend engineering",
    services: ["Django", "Django REST Framework", "PostgreSQL", "API design"],
    summary: "A Django system that lets farmers manage their herds and lets vets and inseminators work with them on the same records.",
    challenge: "Farm records lived in notebooks. Vets and inseminators had no shared view of a cow's history, so visits were missed.",
    approach: "A role-based REST API: farmers own herds, vets log treatments, inseminators schedule visits, and everyone sees the same timeline.",
    outcome: "One source of truth for every cow, from birth to calving. Try the API demo on the home page.",
    images: ["cows-1", "cows-2"],
    imageNote: "Stand-in photography. The product is an API, see the live demo on the home page.",
  },
];

export const categoryLabels: Record<Category | "all", string> = {
  all: "All",
  web: "Web",
  mobile: "Mobile",
  dashboard: "Dashboards",
  backend: "Backend",
};

export const contact = {
  email: "hello@yohanesalemu.com", // TODO: real email
  socials: [
    // TODO: real profile links
    { label: "LinkedIn", url: "https://www.linkedin.com/" },
    { label: "Dribbble", url: "https://dribbble.com/" },
    { label: "Behance", url: "https://www.behance.net/" },
    { label: "GitHub", url: "https://github.com/baabbii69" },
    { label: "Telegram", url: "https://t.me/" },
  ],
};

export const credits: Record<string, { author: string; license: string; source: string }> = {
  "fiker-1": { author: "Kimberly Vardeman", license: "CC BY 2.0", source: "https://commons.wikimedia.org/wiki/File:Chocolate_Chip_Cookies_-_kimberlykv.jpg" },
  "fiker-2": { author: "James F. Carter", license: "CC BY-SA 3.0", source: "https://commons.wikimedia.org/wiki/File:Garibaldi_biscuit.jpg" },
  "auction-1": { author: "Diego Delso", license: "CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:Addis_Mercato,_Ad%C3%ADs_Abeba,_Etiop%C3%ADa,_2024-01-19,_DD_30.jpg" },
  "auction-2": { author: "Diego Delso", license: "CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:Addis_Mercato,_Ad%C3%ADs_Abeba,_Etiop%C3%ADa,_2024-01-19,_DD_27.jpg" },
  "harambee-1": { author: "Adam Jones", license: "CC BY-SA 2.0", source: "https://commons.wikimedia.org/wiki/File:Students_at_Addis_Ababa_University_-_Addis_Ababa_-_Ethiopia_(8667490197).jpg" },
  "harambee-2": { author: "Mehereteab", license: "CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:Playing_basketball_in_ASTU.jpg" },
  "opsa-1": { author: "Ninara", license: "CC BY 2.0", source: "https://commons.wikimedia.org/wiki/File:Oromia_IMG_5243_Ethiopia,_Oromia,_African_School_(27855722979).jpg" },
  "opsa-2": { author: "Rainer Kwiotek", license: "CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:Children_in_primary_school_in_Debre_Berhan,_Ethiopia.jpg" },
  "cows-1": { author: "Adam Jones", license: "CC BY-SA 2.0", source: "https://commons.wikimedia.org/wiki/File:Cattle_Graze_in_Fields_-_Outside_Korem_-_Ethiopia_(8722293847).jpg" },
  "cows-2": { author: "ILRI / Stevie Mann", license: "CC BY 2.0", source: "https://commons.wikimedia.org/wiki/File:ILRI,_Stevie_Mann_-_Cattle_being_watered_at_the_Ghibe_River_in_southwestern_Ethiopia.jpg" },
};
