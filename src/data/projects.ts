export interface ProjectData {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  stack: string[];
  features: string[];
  demoUrl?: string;
  githubUrl?: string;
  thumbnail?: string;
  islandPosition: { x: number; y: number; z: number };
  modelType: string;
  color: string;
  priority: number;
}

export const projects: ProjectData[] = [
  {
    id: "dokterone",
    title: "DokterOne Healthcare System",
    shortTitle: "Dashboard",
    description:
      "Comprehensive healthcare data system with medical records management, Covid PCR certifications, and patient data analytics. Built with enterprise-grade security standards and HIPAA compliance considerations.",
    stack: ["PHP", "Laravel", "MySQL", "Bootstrap", "JavaScript"],
    features: [
      "Electronic Medical Record (EMR) system",
      "Covid PCR/Antigen certificate auto-generator",
      "Dynamic data visual charts & stats panels",
      "Granular role-based access control (RBAC)"
    ],
    githubUrl: "https://github.com/oggiesutrisna/dokterone",
    demoUrl: "https://dokterone.co.id",
    islandPosition: { x: 0, y: 0, z: -8.2 },
    modelType: "building-type-a",
    color: "#ff9a3d",
    priority: 1,
  },
  {
    id: "simaka",
    title: "Simaka HRMS",
    shortTitle: "Filament",
    description:
      "Full-featured Human Resource Management System with automated HR workflows, employee onboarding, leave management, and payroll integration. Built with PHP/Blade backend architecture.",
    stack: ["PHP", "Laravel", "PostgreSQL", "TailwindCSS", "Alpine.js"],
    features: [
      "Automated employee onboarding workflows",
      "Configurable dynamic leave approval structures",
      "Integrated payroll calculations & payslip generation",
      "Real-time organization structure layout graphs"
    ],
    githubUrl: "https://github.com/oggiesutrisna/simaka",
    islandPosition: { x: -3, y: 0, z: -8.2 },
    modelType: "building-type-b",
    color: "#ff6b4a",
    priority: 2,
  },
  {
    id: "leave-management",
    title: "Leave Management System",
    shortTitle: "POS",
    description:
      "Automated payroll logic system with complex business rules for lateness-to-leave conversion. Features configurable leave policies, approval workflows, and comprehensive attendance tracking.",
    stack: ["PHP", "Laravel", "MySQL", "jQuery", "Bootstrap"],
    features: [
      "Complex business rule parser (lateness conversions)",
      "Multi-level manager approval dashboard",
      "Excel/PDF comprehensive audit log exporters",
      "Active directory single sign-on integration"
    ],
    githubUrl: "https://github.com/oggiesutrisna/leave-management",
    islandPosition: { x: 3, y: 0, z: -8.2 },
    modelType: "building-type-c",
    color: "#ff7eb3",
    priority: 3,
  },
  {
    id: "porto",
    title: "Portfolio Website",
    shortTitle: "Three.js",
    description:
      "Modern 3D isometric portfolio built with Astro, Three.js, and glassmorphism overlay design. Features warm Balinese sunset aesthetics and responsive interactive islands.",
    stack: ["Vite", "TypeScript", "Three.js", "TailwindCSS", "PostCSS"],
    features: [
      "Low-poly isometric procedural mesh town rendering",
      "Responsive world-to-screen projected label hints",
      "Custom procedural character physics walking controller",
      "Completely standalone static client-side single page app"
    ],
    githubUrl: "https://github.com/oggiesutrisna/porto",
    demoUrl: "https://oggiesutrisna.vercel.app",
    islandPosition: { x: 0, y: 0, z: -11.8 },
    modelType: "building-type-d",
    color: "#9b7dff",
    priority: 4,
  },
  {
    id: "unicare-clinic",
    title: "Unicare Clinic Website",
    shortTitle: "API",
    description:
      "Complete medical clinic website with 18 services, 6 locations, appointment booking, and doctor profiles. Features service pages, location pages, contact forms, and emergency 24/7 information display.",
    stack: ["HTML5", "CSS3", "JavaScript", "jQuery", "PHP", "MySQL"],
    features: [
      "Location-aware nearest clinic search tool",
      "Direct API sync integrations with clinic schedulers",
      "Emergency hot-line quick responsive action overlays",
      "Optimized static asset caches for ultra-fast load times"
    ],
    githubUrl: "https://github.com/oggiesutrisna/unicare-clinic-legacy",
    islandPosition: { x: -3, y: 0, z: -11.8 },
    modelType: "building-type-e",
    color: "#4ecdc4",
    priority: 5,
  },
  {
    id: "gelora",
    title: "Gelora Sports Hub",
    shortTitle: "Dashboard",
    description:
      "Interactive booking and matchmaking platform for local sports facilities and communities. Features real-time occupancy graphs and automated scheduling.",
    stack: ["Vue.js", "Firebase", "TailwindCSS", "Node.js", "Express"],
    features: [
      "Real-time court occupancy state trackers",
      "Community matchmaker lobbies & join-up gates",
      "Direct Firebase push notification alerts",
      "Integrated secure payment gateways"
    ],
    githubUrl: "https://github.com/oggiesutrisna/gelora",
    islandPosition: { x: 3, y: 0, z: -11.8 },
    modelType: "building-type-f",
    color: "#ffd93d",
    priority: 6,
  },
];

export function getProjects(): ProjectData[] {
  return projects.sort((a, b) => a.priority - b.priority);
}
