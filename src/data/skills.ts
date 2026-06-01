export interface SkillData {
  id: string;
  name: string;
  category: "backend" | "frontend" | "database" | "tools";
  description: string;
  level: "Expert" | "Advanced" | "Intermediate";
  islandPosition: { x: number; y: number; z: number };
  icon: string;
}

export const skills: SkillData[] = [
  {
    id: "laravel",
    name: "Laravel Framework",
    category: "backend",
    description: "Developing highly secure, robust, and scalable backend applications, queue workers, complex event broadcasts, and secure microservices.",
    level: "Expert",
    islandPosition: { x: -12, y: 0, z: -2 },
    icon: "laravel",
  },
  {
    id: "filament",
    name: "FilamentPHP",
    category: "tools",
    description: "Rapidly building elegant, secure, and highly dynamic administration panels, CRM modules, and enterprise control panels.",
    level: "Expert",
    islandPosition: { x: -10, y: 0, z: -2 },
    icon: "filament",
  },
  {
    id: "threejs",
    name: "Three.js / WebGL",
    category: "frontend",
    description: "Creating performant, beautiful, and interactive 3D digital experiences, custom canvas shaders, and spatial user interfaces.",
    level: "Advanced",
    islandPosition: { x: -8, y: 0, z: -2 },
    icon: "threejs",
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "frontend",
    description: "Enforcing type-safe strict compilation rules, enterprise modular patterns, and safe runtime boundaries in large frontends.",
    level: "Expert",
    islandPosition: { x: -12, y: 0, z: 0 },
    icon: "typescript",
  },
  {
    id: "javascript",
    name: "JavaScript (ES6+)",
    category: "frontend",
    description: "Writing lightweight, high-performance, asynchronous event-driven pipelines, DOM projections, and client-side reactive systems.",
    level: "Expert",
    islandPosition: { x: -10, y: 0, z: 0 },
    icon: "javascript",
  },
  {
    id: "api",
    name: "API Integration",
    category: "backend",
    description: "Designing RESTful, GraphQL, and server-to-server JSON integrations with secure OAuth controls, request throttlers, and query caches.",
    level: "Expert",
    islandPosition: { x: -8, y: 0, z: 0 },
    icon: "api",
  },
  {
    id: "database",
    name: "Database Systems",
    category: "database",
    description: "Architecting, indexing, and optimizing relational schemas (PostgreSQL, MySQL), query logs tuning, and setting up transactional caches.",
    level: "Advanced",
    islandPosition: { x: -11, y: 0, z: 2 },
    icon: "database",
  },
  {
    id: "tailwind",
    name: "TailwindCSS & UX",
    category: "frontend",
    description: "Crafting beautiful responsive styling, dynamic micro-transitions, customized CSS variables themes, and accessible tap layout boundaries.",
    level: "Expert",
    islandPosition: { x: -9, y: 0, z: 2 },
    icon: "tailwind",
  },
];

export function getSkills(): SkillData[] {
  return skills;
}
