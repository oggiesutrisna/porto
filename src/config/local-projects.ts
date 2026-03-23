export interface LocalProject {
  id: string;
  title: string;
  description: string;
  badge?: string;
  badgeColor?: string;
  technologies: string[];
  link: string;
  githubLink?: string;
  icon?: string;
  dates?: string;
  priority: number;
}

export const localProjects: LocalProject[] = [
  {
    id: 'unicare-clinic',
    title: 'Unicare Clinic Website',
    description: 'Complete medical clinic website with 18 services, 6 locations, appointment booking, and doctor profiles. Built as the main web developer from 2019-2025. Features include service pages, location pages, contact forms, and emergency 24/7 information display.',
    badge: 'Archived',
    badgeColor: 'red',
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'jQuery', 'PHP', 'MySQL', 'Bootstrap'],
    link: '/unicare-clinic/index.html',
    icon: '🏥',
    dates: '2019 - 2025',
    priority: 1,
  },
];

export function getLocalProjects(): LocalProject[] {
  return localProjects.sort((a, b) => a.priority - b.priority);
}
