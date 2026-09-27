// All site content lives here. Swap the dummy values for real ones as they come in.
// Anything marked TODO is a placeholder that should be confirmed before launch.
// Project summaries are drafts written from a one-line brief: rewrite them in your own words.

export interface Project {
  slug: string;
  name: string;
  kind: string;
  summary: string;
  role: string;
  year: string; // TODO: confirm real years
  stack: string[];
  color: string; // accent used on the project frame
  url?: string;
  cover: string; // TODO: replace placeholder covers in public/work/ with real screenshots
  coverSmall: string;
}

export const projects: Project[] = [
  {
    slug: "hawi",
    name: "Hawi Software",
    kind: "Landing page",
    summary: "The public face of a software studio in Adama. A dark, precise landing page that loads fast and sells engineering without the buzzwords.",
    role: "Design and front-end",
    year: "2025",
    stack: ["Figma", "GSAP", "Responsive build"],
    color: "#C8191E",
    url: "https://hawisoftware.com",
    cover: "/work/hawi.webp",
    coverSmall: "/work/hawi-sm.webp",
  },
  {
    slug: "fiker",
    name: "Fiker Foods",
    kind: "Company website",
    summary: "A website for a food processing company that shows the products, the factory and the people behind them, with a warm, appetising look.",
    role: "Design and build",
    year: "2024",
    stack: ["Figma", "Front-end", "Responsive build"],
    color: "#F0B63F",
    url: "https://fikerfoods.et",
    cover: "/work/fiker.webp",
    coverSmall: "/work/fiker-sm.webp",
  },
  {
    slug: "auction",
    name: "Auction Ethiopia",
    kind: "Web and mobile redesign",
    summary: "A full redesign of an online auction platform. Clearer bidding, faster listing flows and one visual system across the website and the app.",
    role: "UI and UX redesign",
    year: "2024",
    stack: ["Figma", "Design system", "Mobile UI"],
    color: "#F5B400",
    cover: "/work/auction.webp",
    coverSmall: "/work/auction-sm.webp",
  },
  {
    slug: "harambee",
    name: "Harambee University",
    kind: "Student app and student system",
    summary: "A mobile app for students and the UI for the college's student information system: grades, schedules, payments and registration.",
    role: "UI design",
    year: "2023",
    stack: ["Figma", "Mobile app", "Admin UI"],
    color: "#2F5BD3",
    cover: "/work/harambee.webp",
    coverSmall: "/work/harambee-sm.webp",
  },
  {
    slug: "opsa",
    name: "Oromia Private School Association",
    kind: "Landing page and dashboard",
    summary: "A public site for the association and a dashboard for member schools to manage their profiles, reports and announcements.",
    role: "Design and build",
    year: "2025",
    stack: ["Figma", "Dashboard", "Front-end"],
    color: "#B7361F",
    cover: "/work/opsa.webp",
    coverSmall: "/work/opsa-sm.webp",
  },
];

export interface SkillGroup {
  id: "design" | "frontend" | "backend";
  layer: string; // shown in the layers panel
  title: string;
  body: string;
  items: string[];
}

export const skills: SkillGroup[] = [
  {
    id: "design",
    layer: "Design",
    title: "Interfaces people understand on the first try.",
    body: "Most of my work starts in Figma: flows, components and every state a screen can be in. Plus the posters, banners and logos a brand needs around it.",
    items: ["UI for web and mobile", "Design systems", "Prototypes", "Posters and banners", "Logos"],
  },
  {
    id: "frontend",
    layer: "Front-end",
    title: "Motion that feels expensive and runs on any laptop.",
    body: "I turn designs into sites with scroll-driven animation, layered depth and clean dashboards. I use AI to move fast, then review every line by hand.",
    items: ["GSAP and ScrollTrigger", "Landing pages", "Dashboards", "TypeScript", "Performance budgets"],
  },
  {
    id: "backend",
    layer: "Back-end",
    title: "The system behind the screen, built to last.",
    body: "Django and Django REST Framework are home. I have built large enterprise platforms with teams and on my own, and I write small services in Go.",
    items: ["Django", "Django REST Framework", "PostgreSQL", "Roles and permissions", "Go"],
  },
];

export const contact = {
  email: "hello@yohanesalemu.com", // TODO: real email
  socials: [
    // TODO: real profile links
    { label: "LinkedIn", url: "https://www.linkedin.com/" },
    { label: "Dribbble", url: "https://dribbble.com/" },
    { label: "Behance", url: "https://www.behance.net/" },
    { label: "GitHub", url: "https://github.com/" },
    { label: "Telegram", url: "https://t.me/" },
  ],
};
