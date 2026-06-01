export interface ProfileData {
  name: string;
  role: string;
  tagline: string;
  location: string;
  email: string;
  socials: {
    github: string;
    linkedin: string;
    twitter?: string;
  };
  about: {
    summary: string;
    philosophy: string;
    focusAreas: string[];
    values: string[];
  };
}

export const profile: ProfileData = {
  name: "I Putu Oggie Sutrisna Ady",
  role: "Laravel & Interactive Web Developer",
  tagline: "I build clean, scalable web apps with delightful interactive interfaces.",
  location: "Denpasar, Bali, Indonesia",
  email: "putuoggie@gmail.com",
  socials: {
    github: "https://github.com/oggiesutrisna",
    linkedin: "https://linkedin.com/in/oggiesutrisna",
    twitter: "https://twitter.com/oggiesutrisna",
  },
  about: {
    summary: "Senior Software Engineer with 9+ years of industry experience specializing in full-stack backend architectures, responsive server systems, and robust web applications.",
    philosophy: "I focus on Laravel, FilamentPHP, clean architecture, and interactive web experiences. I enjoy turning complex enterprise workflows into simple, polished, and delightful user interfaces.",
    focusAreas: [
      "Laravel Ecosystem (Queue, Cache, Broadcast, Event)",
      "FilamentPHP custom admin consoles",
      "Strict static typing with TypeScript/Go",
      "Interactive 3D WebGL scenes using Three.js"
    ],
    values: [
      "Maintainable, clean architecture & SOLID principles",
      "High performance & query optimization",
      "Premium typography & pixel-perfect styling",
      "Empathetic user experience & soft transitions"
    ]
  }
};
