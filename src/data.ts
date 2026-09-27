// All site content lives here.
// Case study copy is drafted from a one-line brief per project: rewrite it in your own words.
// Covers in public/work/ are art-directed brand covers (Hawi uses a real screenshot of the live site).

export interface Project {
  slug: string;
  name: string;
  short: string; // name used in the giant viewfinder type
  kind: string;
  year: string; // TODO: confirm
  role: string;
  tools: string[];
  summary: string;
  problem: string;
  approach: string;
  result: string;
  url?: string;
}

export const projects: Project[] = [
  {
    slug: "hawi",
    name: "Hawi Software",
    short: "Hawi",
    kind: "Studio website",
    year: "2025",
    role: "Design and front-end",
    tools: ["Figma", "GSAP", "Responsive build"],
    summary: "The public face of a custom software studio in Adama: a confident site that explains what the team builds and how they work.",
    problem: "Hawi needed to look like a serious engineering partner to clients in Ethiopia and abroad, without leaning on stock clichés.",
    approach: "A dark hero with real team photography, a precise type system and a process section that reads like a project plan.",
    result: "A fast, responsive site the team uses as their main sales tool.",
    url: "https://hawisoftware.com",
  },
  {
    slug: "fiker",
    name: "Fiker Foods",
    short: "Fiker",
    kind: "Company website",
    year: "2024",
    role: "Design and build",
    tools: ["Figma", "Front-end", "Content structure"],
    summary: "A website for an Ethiopian food processing company that presents its products, its factory and the people behind them.",
    problem: "Make a local manufacturer feel as trustworthy as an imported brand, for distributors and families alike.",
    approach: "Products up front, a simple catalogue and one clear route to wholesale enquiries.",
    result: "A site the sales team can send to any distributor in one link.",
    url: "https://fikerfoods.et",
  },
  {
    slug: "auction",
    name: "Auction Ethiopia",
    short: "Auction",
    kind: "Web and app redesign",
    year: "2024",
    role: "UI and UX redesign",
    tools: ["UX audit", "Design system", "Mobile UI"],
    summary: "A redesign of an online auction platform, from browsing lots to placing a bid, across the website and the mobile app.",
    problem: "Bidding felt risky: unclear lot details, hidden deadlines and a login wall before anything useful.",
    approach: "Lots first, login later. The countdown and current bid stay visible, and web and app share one component set.",
    result: "One design system that both the web team and the app team build from.",
  },
  {
    slug: "harambee",
    name: "Harambee University",
    short: "Harambee",
    kind: "Student app and system",
    year: "2023",
    role: "UI design",
    tools: ["Mobile UI", "Admin UI", "Design system"],
    summary: "A mobile app for students and the interface for the college's student information system.",
    problem: "Students checked grades, schedules and payments in three places, and staff re-entered the same data by hand.",
    approach: "One app for everyday student tasks and one admin system for registrar staff, sharing data and components.",
    result: "Screens for registration, grades, schedules and payments, ready for the development team.",
  },
  {
    slug: "opsa",
    name: "Oromia Private School Association",
    short: "OPSA",
    kind: "Website and dashboard",
    year: "2025",
    role: "Design and build",
    tools: ["Figma", "Dashboard", "Front-end"],
    summary: "A public site for the association and a dashboard where member schools manage their profiles, reports and announcements.",
    problem: "Hundreds of member schools, each with a different comfort level with software, all reporting to one office.",
    approach: "Big, plain forms and a dashboard built around the three things a school admin does every week.",
    result: "One place for the association to reach every member school.",
  },
  {
    slug: "cowsville",
    name: "Cowsville",
    short: "Cowsville",
    kind: "Farm management system",
    year: "2025",
    role: "Backend engineering",
    tools: ["Django", "Django REST Framework", "PostgreSQL"],
    summary: "A Django system where farmers manage their herds and vets and inseminators work on the same records.",
    problem: "Farm records lived in notebooks. Vets and inseminators had no shared view of a cow's history, so visits were missed.",
    approach: "A role-based REST API: farmers own herds, vets log treatments, inseminators schedule visits, and everyone sees one timeline.",
    result: "One source of truth for every cow, from birth to calving.",
  },
];

export const disciplines = [
  {
    id: "design",
    title: "Design",
    body: "Interfaces in Figma: flows, components and every state a screen can be in. Plus the posters, banners and logos a brand needs around it.",
    tools: ["UI for web and mobile", "Design systems", "Prototypes", "Graphics and logos"],
  },
  {
    id: "frontend",
    title: "Front-end",
    body: "I build what I design: scroll-driven motion, layered layouts and clean dashboards that stay fast on an ordinary laptop.",
    tools: ["TypeScript", "GSAP", "Responsive layout", "Performance"],
  },
  {
    id: "backend",
    title: "Back-end",
    body: "Django and Django REST Framework are home. I have built enterprise platforms with teams and on my own, and small services in Go.",
    tools: ["Django", "Django REST Framework", "PostgreSQL", "Go"],
  },
];

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
