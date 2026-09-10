export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  why: string;
  status: string;
  links?: ProjectLink[];
}

export const projects: Project[] = [
  {
    slug: "ride-together",
    title: "Ride Together",
    description:
      "A platform for organizing and managing group motorcycle rides — from membership and registration to participation and real-time ride data.",
    why: "To make group motorcycle riding safer, more coordinated and easier to manage.",
    status: "In development",
    links: [
      { label: "GitHub repository", url: "https://github.com/vtrravikumar/RideTogether" },
    ],
  },
  {
    slug: "vtr-press",
    title: "VTR Press",
    description:
      "An independent publishing workflow built around Markdown, Typst and automation to make producing professional books repeatable and maintainable.",
    why: "To turn book production into a repeatable engineering workflow rather than a one-off publishing exercise.",
    status: "In development",
    links: [
      { label: "GitHub repository", url: "https://github.com/vtrravikumar/vtr-press" },
    ],
  },
  {
    slug: "homelab-engineering",
    title: "HomeLab Engineering",
    description:
      "A personal engineering laboratory exploring home automation, Raspberry Pi, Home Assistant, networking and practical engineering.",
    why: "To keep experimenting with technology while applying the engineering discipline learned from larger systems.",
    status: "Ongoing",
    links: [
      { label: "GitHub repository", url: "https://github.com/vtrravikumar/HomeLab-Engineering" },
    ],
  },
];
