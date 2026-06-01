import type { GitHubRepo, GitHubUser, Language } from "../types/github";
import { getLanguageColor } from "../types/github";
import { projects } from "../data/projects";
export async function fetchGitHubUser(username: string): Promise<GitHubUser> {
  // Try public REST API (works in browser without credentials up to 60/hr)
  try {
    const userRes = await fetch(`https://api.github.com/users/${username}`);
    if (!userRes.ok) throw new Error("REST user fetch failed");
    const userData = await userRes.json();

    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    if (!reposRes.ok) throw new Error("REST repos fetch failed");
    const reposData = await reposRes.json();

    const repositories: GitHubRepo[] = reposData
      .filter((r: any) => !r.fork)
      .map((r: any) => ({
        id: String(r.id),
        name: r.name,
        fullName: r.full_name,
        description: r.description,
        url: r.html_url,
        homepage: r.homepage,
        language: r.language || null,
        languages: r.language
          ? [{ name: r.language, percentage: 100, color: getLanguageColor(r.language) }]
          : [],
        stargazersCount: r.stargazers_count,
        forksCount: r.forks_count,
        openIssuesCount: r.open_issues_count,
        license: r.license?.name || null,
        topics: r.topics || [],
        isArchived: r.archived,
        isFork: r.fork,
        updatedAt: r.updated_at,
        createdAt: r.created_at,
        pushedAt: r.pushed_at,
        defaultBranch: r.default_branch || "main",
        readme: null,
      }));

    return {
      login: userData.login,
      name: userData.name || userData.login,
      bio: userData.bio || "Senior Software Engineer with 9+ years experience.",
      avatarUrl: userData.avatar_url,
      url: userData.html_url,
      followers: userData.followers,
      following: userData.following,
      repositories,
    };
  } catch (e) {
    console.warn("REST API failed. Using robust mock/local data fallback.", e);
  }

  // 3. Resilient fallback to local static mock data
  return {
    login: username,
    name: "Oggie Sutrisna",
    bio: "Senior Software Engineer with 9+ years building scalable systems and elegant solutions.",
    avatarUrl: "https://github.com/oggiesutrisna.png",
    url: `https://github.com/${username}`,
    followers: 120,
    following: 75,
    repositories: projects.map((p) => ({
      id: p.id,
      name: p.id,
      fullName: `${username}/${p.id}`,
      description: p.description,
      url: p.githubUrl || `https://github.com/${username}/${p.id}`,
      homepage: p.demoUrl || null,
      language: p.stack[0] || "TypeScript",
      languages: p.stack.map((s, idx) => ({
        name: s,
        percentage: idx === 0 ? 60 : Math.round(40 / (p.stack.length - 1)),
        color: getLanguageColor(s),
      })),
      stargazersCount: 25,
      forksCount: 5,
      openIssuesCount: 0,
      license: "MIT",
      topics: p.stack.map(s => s.toLowerCase()),
      isArchived: false,
      isFork: false,
      updatedAt: new Date().toISOString(),
      createdAt: new Date(2023, 0, 1).toISOString(),
      pushedAt: new Date().toISOString(),
      defaultBranch: "main",
      readme: null,
    })),
  };
}

export async function fetchRepoReadme(owner: string, name: string): Promise<string | null> {
  // Try REST / raw.githubusercontent.com fetch (no tokens needed!)
  try {
    const response = await fetch(`https://raw.githubusercontent.com/${owner}/${name}/main/README.md`);
    if (response.ok) return await response.text();
    
    // Try master branch as fallback
    const masterResponse = await fetch(`https://raw.githubusercontent.com/${owner}/${name}/master/README.md`);
    if (masterResponse.ok) return await masterResponse.text();
  } catch (error) {
    console.warn(`REST README fetch failed for ${owner}/${name}:`, error);
  }

  return null;
}

export function filterRepos(
  repos: GitHubRepo[],
  search: string,
  selectedTopics: string[],
  language: string | null,
): GitHubRepo[] {
  return repos.filter((repo) => {
    if (search) {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        repo.name.toLowerCase().includes(searchLower) ||
        (repo.description?.toLowerCase().includes(searchLower) ?? false) ||
        repo.topics.some((t) => t.toLowerCase().includes(searchLower));
      if (!matchesSearch) return false;
    }

    if (selectedTopics.length > 0) {
      const hasSelectedTopic = selectedTopics.some((topic) =>
        repo.topics.includes(topic),
      );
      if (!hasSelectedTopic) return false;
    }

    if (language && repo.language !== language) {
      return false;
    }

    return true;
  });
}

export function sortRepos(
  repos: GitHubRepo[],
  sortBy: "stars" | "updated" | "name",
  direction: "asc" | "desc" = "desc",
): GitHubRepo[] {
  const sorted = [...repos].sort((a, b) => {
    switch (sortBy) {
      case "stars":
        return b.stargazersCount - a.stargazersCount;
      case "updated":
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return direction === "asc" ? sorted : sorted.reverse();
}

export function getAllTopics(repos: GitHubRepo[]): string[] {
  const topicSet = new Set<string>();
  repos.forEach((repo) => repo.topics.forEach((topic) => topicSet.add(topic)));
  return Array.from(topicSet).sort();
}

export function getAllLanguages(repos: GitHubRepo[]): string[] {
  const langSet = new Set<string>();
  repos.forEach((repo) => {
    if (repo.language) langSet.add(repo.language);
  });
  return Array.from(langSet).sort();
}
