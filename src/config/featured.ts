export interface FeaturedProject {
  repoName: string;
  title: string;
  description: string;
  badge?: string;
  priority: number;
}

export const featuredProjects: FeaturedProject[] = [
  {
    repoName: 'dokterone',
    title: 'DokterOne Healthcare System',
    description: 'Comprehensive healthcare data system with medical records management, Covid PCR certifications, and patient data analytics. Built with enterprise-grade security standards and HIPAA compliance considerations.',
    badge: 'Healthcare',
    priority: 1,
  },
  {
    repoName: 'simaka',
    title: 'Simaka HRMS',
    description: 'Full-featured Human Resource Management System with automated HR workflows, employee onboarding, leave management, and payroll integration. Built with PHP/Blade backend architecture.',
    badge: 'Enterprise',
    priority: 2,
  },
  {
    repoName: 'leave-management',
    title: 'Leave Management System',
    description: 'Automated payroll logic system with complex business rules for lateness-to-leave conversion. Features configurable leave policies, approval workflows, and comprehensive attendance tracking.',
    badge: 'Featured',
    priority: 3,
  },
  {
    repoName: 'porto',
    title: 'Portfolio Website',
    description: 'Modern portfolio built with Astro and glassmorphism design',
    badge: 'Featured',
    priority: 4,
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
