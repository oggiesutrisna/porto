// Tech Stack Data
export interface TechItem {
    title: string;
    description: string;
    experience: string;
    tags: string[];
    icon: string;
}

export const techStack: TechItem[] = [
    {
        title: "Backend",
        description:
            "Building robust server-side applications with modern frameworks and best practices.",
        experience: "8+ years",
        tags: ["PHP", "Laravel", "Node.js", "Go", "Python"],
        icon: "server",
    },
    {
        title: "Frontend",
        description:
            "Creating beautiful, responsive user interfaces with cutting-edge technologies.",
        experience: "7+ years",
        tags: ["Vue.js", "React", "TypeScript", "Astro", "TailwindCSS"],
        icon: "layout",
    },
    {
        title: "Database",
        description:
            "Designing and optimizing database architectures for performance and scalability.",
        experience: "8+ years",
        tags: ["MySQL", "PostgreSQL", "MongoDB", "Redis", "Elasticsearch"],
        icon: "database",
    },
    {
        title: "DevOps",
        description:
            "Implementing CI/CD pipelines and cloud infrastructure for seamless deployments.",
        experience: "5+ years",
        tags: ["Docker", "Kubernetes", "AWS", "GCP", "GitHub Actions"],
        icon: "cloud",
    },
    {
        title: "System Design",
        description:
            "Architecting scalable, distributed systems with resilient patterns and best practices.",
        experience: "6+ years",
        tags: ["Microservices", "REST API", "GraphQL", "Message Queues", "Caching"],
        icon: "architecture",
    },
    {
        title: "Tools",
        description:
            "Leveraging modern development tools for efficient workflow and collaboration.",
        experience: "8+ years",
        tags: ["Git", "VS Code", "Figma", "Postman", "Jira"],
        icon: "wrench",
    },
];
