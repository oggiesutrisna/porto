export type AreaId = "home" | "projects" | "skills" | "about" | "contact";

export interface NavigationItem {
  id: AreaId;
  label: string;
  icon: string;
  cameraTarget: { x: number; y: number; z: number };
  cameraZoom: number;
}

export const navigationData: NavigationItem[] = [
  {
    id: "home",
    label: "Home",
    icon: "🏠",
    cameraTarget: { x: 0, y: 0, z: 0 },
    cameraZoom: 1.0,
  },
  {
    id: "projects",
    label: "Projects",
    icon: "💻",
    cameraTarget: { x: 0, y: 0, z: -10 },
    cameraZoom: 1.1,
  },
  {
    id: "skills",
    label: "Skills",
    icon: "⚡",
    cameraTarget: { x: -10, y: 0, z: 0 },
    cameraZoom: 1.25,
  },
  {
    id: "about",
    label: "About",
    icon: "🎨",
    cameraTarget: { x: 10, y: 0, z: 0 },
    cameraZoom: 1.1,
  },
  {
    id: "contact",
    label: "Contact",
    icon: "📧",
    cameraTarget: { x: 0, y: 0, z: 10 },
    cameraZoom: 1.25,
  },
];
