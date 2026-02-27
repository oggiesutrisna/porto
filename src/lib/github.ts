import { GraphQLClient, gql } from 'graphql-request';
import type { GitHubRepo, GitHubUser, Language } from '../types/github';
import { getLanguageColor } from '../types/github';

const GITHUB_GRAPHQL_ENDPOINT = 'https://api.github.com/graphql';

interface GitHubGraphQLResponse {
  user: {
    login: string;
    name: string;
    bio: string;
    avatarUrl: string;
    url: string;
    followers: { totalCount: number };
    following: { totalCount: number };
    repositories: {
      nodes: RawRepo[];
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string;
      };
    };
  };
}

interface RawRepo {
  id: string;
  name: string;
  fullName: string;
  description: string;
  url: string;
  homepageUrl: string;
  isArchived: boolean;
  isFork: boolean;
  stargazerCount: number;
  forkCount: number;
  issues: { totalCount: number };
  licenseInfo: { name: string } | null;
  repositoryTopics: {
    nodes: Array<{ topic: { name: string } }>;
  };
  languages: {
    edges: Array<{ size: number; node: { name: string } }>;
  };
  updatedAt: string;
  createdAt: string;
  pushedAt: string;
  defaultBranchRef: { name: string } | null;
}

const REPOS_QUERY = gql`
  query GetUserRepos($login: String!, $first: Int!, $after: String) {
    user(login: $login) {
      login
      name
      bio
      avatarUrl
      url
      followers(first: 1) {
        totalCount
      }
      following(first: 1) {
        totalCount
      }
      repositories(first: $first, after: $after, orderBy: { field: UPDATED_AT, direction: DESC }, ownerAffiliations: [OWNER], isFork: false) {
        nodes {
          id
          name
          fullName: nameWithOwner
          description
          url
          homepageUrl
          isArchived
          isFork
          stargazerCount
          forkCount
          issues(states: OPEN) {
            totalCount
          }
          licenseInfo {
            name
          }
          repositoryTopics(first: 10) {
            nodes {
              topic {
                name
              }
            }
          }
          languages(first: 5, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              size
              node {
                name
              }
            }
          }
          updatedAt
          createdAt
          pushedAt
          defaultBranchRef {
            name
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

const README_QUERY = gql`
  query GetRepoReadme($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      object(expression: "HEAD:README.md") {
        ... on Blob {
          text
        }
      }
      object(expression: "HEAD:readme.md") {
        ... on Blob {
          text
        }
      }
    }
  }
`;

let githubClient: GraphQLClient | null = null;

function getGitHubClient(): GraphQLClient {
  if (!githubClient) {
    const token = import.meta.env.GITHUB_TOKEN;
    if (!token) {
      throw new Error('GITHUB_TOKEN environment variable is required');
    }
    githubClient = new GraphQLClient(GITHUB_GRAPHQL_ENDPOINT, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
  }
  return githubClient;
}

export async function fetchGitHubUser(username: string): Promise<GitHubUser> {
  const client = getGitHubClient();
  
  const data = await client.request<GitHubGraphQLResponse>(REPOS_QUERY, {
    login: username,
    first: 50,
  });

  const repos = data.user.repositories.nodes.map(transformRepo);

  return {
    login: data.user.login,
    name: data.user.name,
    bio: data.user.bio,
    avatarUrl: data.user.avatarUrl,
    url: data.user.url,
    followers: data.user.followers.totalCount,
    following: data.user.following.totalCount,
    repositories: repos,
  };
}

export async function fetchRepoReadme(owner: string, name: string): Promise<string | null> {
  try {
    const client = getGitHubClient();
    const data = await client.request<{
      repository: {
        object: { text: string } | null;
      };
    }>(README_QUERY, { owner, name });

    return data.repository.object?.text || null;
  } catch (error) {
    console.error(`Failed to fetch README for ${owner}/${name}:`, error);
    return null;
  }
}

function transformRepo(raw: RawRepo): GitHubRepo {
  const totalSize = raw.languages.edges.reduce((sum, edge) => sum + edge.size, 0);
  
  const languages: Language[] = raw.languages.edges.map((edge) => ({
    name: edge.node.name,
    percentage: totalSize > 0 ? Math.round((edge.size / totalSize) * 100) : 0,
    color: getLanguageColor(edge.node.name),
  }));

  const topics = raw.repositoryTopics.nodes.map((t) => t.topic.name);

  return {
    id: raw.id,
    name: raw.name,
    fullName: raw.fullName,
    description: raw.description,
    url: raw.url,
    homepage: raw.homepageUrl,
    language: languages[0]?.name || null,
    languages,
    stargazersCount: raw.stargazerCount,
    forksCount: raw.forkCount,
    openIssuesCount: raw.issues.totalCount,
    license: raw.licenseInfo?.name || null,
    topics,
    isArchived: raw.isArchived,
    isFork: raw.isFork,
    updatedAt: raw.updatedAt,
    createdAt: raw.createdAt,
    pushedAt: raw.pushedAt,
    defaultBranch: raw.defaultBranchRef?.name || 'main',
    readme: null,
  };
}

export function filterRepos(
  repos: GitHubRepo[],
  search: string,
  selectedTopics: string[],
  language: string | null
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
        repo.topics.includes(topic)
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
  sortBy: 'stars' | 'updated' | 'name',
  direction: 'asc' | 'desc' = 'desc'
): GitHubRepo[] {
  const sorted = [...repos].sort((a, b) => {
    switch (sortBy) {
      case 'stars':
        return b.stargazersCount - a.stargazersCount;
      case 'updated':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return direction === 'asc' ? sorted : sorted.reverse();
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
