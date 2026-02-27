export interface FeaturedProject {
  repoName: string;
  title: string;
  description: string;
  badge?: string;
  priority: number;
}

export const featuredProjects: FeaturedProject[] = [
  {
    repoName: 'porto',
    title: 'Portfolio Website',
    description: 'Modern portfolio built with Astro and glassmorphism design',
    badge: 'Featured',
    priority: 1,
  },
];

export function getFeaturedProjects(repoNames: string[]): FeaturedProject[] {
  return featuredProjects
    .filter((f) => repoNames.includes(f.repoName))
    .sort((a, b) => a.priority - b.priority);
}

export function isFeatured(repoName: string): boolean {
  return featuredProjects.some((f) => f.repoName === repoName);
}
