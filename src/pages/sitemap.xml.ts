import { fetchGitHubUser } from '../lib/github';

const GITHUB_USERNAME = 'oggiesutrisna';
const SITE_URL = 'https://oggiesutrisna.vercel.app';

export async function GET() {
  let repos: any[] = [];

  try {
    const user = await fetchGitHubUser(GITHUB_USERNAME);
    repos = user.repositories;

    const excludedRepos = ['crispylogger'];
    repos = repos.filter((repo) => !excludedRepos.includes(repo.name));
  } catch (e) {
    console.error('Failed to fetch repos for sitemap:', e);
  }

  const formatDate = (date: string) => {
    return new Date(date).toISOString();
  };

  const pages = [
    {
      url: SITE_URL,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '1.0',
    },
    ...repos.map((repo) => ({
      url: `${SITE_URL}/project/${repo.name}`,
      lastmod: formatDate(repo.updatedAt),
      changefreq: 'weekly' as const,
      priority: '0.8',
    })),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
