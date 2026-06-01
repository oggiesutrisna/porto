export type AreaId = "home" | "projects" | "skills" | "about" | "contact";

export type RoadType =
  | "straight"
  | "corner"
  | "intersection"
  | "tJunction"
  | "end"
  | "driveway"
  | "crosswalk"
  | "barrier"
  | "streetLight";

export interface RoadTileLayout {
  type: RoadType;
  position: readonly [number, number, number];
  rotation: number;
  scale?: number;
}

interface AreaBounds {
  center: { x: number; z: number };
  radius: number;
}

interface ImportantObject {
  area: AreaId;
  x: number;
  z: number;
  radius: number;
}

export const MAX_ROADS_BY_AREA: Record<AreaId, number> = {
  home: 0,
  projects: 14,
  skills: 0,
  about: 0,
  contact: 0,
};

export const ALLOWED_ROAD_TYPES_BY_AREA: Record<AreaId, RoadType[]> = {
  home: [],
  projects: ["straight", "intersection", "driveway"],
  skills: [],
  about: [],
  contact: [],
};

export const AREA_BOUNDS: Record<AreaId, AreaBounds> = {
  home: { center: { x: 0, z: 0 }, radius: 4.8 },
  projects: { center: { x: 0, z: -10 }, radius: 5.8 },
  skills: { center: { x: -10, z: 0 }, radius: 5.2 },
  about: { center: { x: 10, z: 0 }, radius: 4.8 },
  contact: { center: { x: 0, z: 10 }, radius: 4.2 },
};

export const SAFE_MARGIN_FROM_EDGE = 1.25;
export const MIN_DISTANCE_FROM_LABEL = 1.4;
export const MIN_DISTANCE_FROM_BUILDING = 0.85;

const IMPORTANT_OBJECTS: ImportantObject[] = [
  { area: "home", x: 0, z: -1.8, radius: 1.6 },
  { area: "home", x: 0, z: 0, radius: 1.1 },
  { area: "home", x: 0, z: 1.5, radius: 1.2 },
  { area: "projects", x: -3, z: -8.2, radius: 0.9 },
  { area: "projects", x: 0, z: -8.2, radius: 0.9 },
  { area: "projects", x: 3, z: -8.2, radius: 0.9 },
  { area: "projects", x: -3, z: -11.8, radius: 0.9 },
  { area: "projects", x: 0, z: -11.8, radius: 0.9 },
  { area: "projects", x: 3, z: -11.8, radius: 0.9 },
  { area: "skills", x: -10, z: 0, radius: 2.4 },
  { area: "about", x: 10, z: -0.5, radius: 1.5 },
  { area: "contact", x: 0, z: 10, radius: 1.2 },
];

function distance2D(a: { x: number; z: number }, b: { x: number; z: number }): number {
  return Math.hypot(a.x - b.x, a.z - b.z);
}

export function validateRoadTile(
  area: AreaId,
  tile: RoadTileLayout,
  currentAreaCount: number,
): boolean {
  if (currentAreaCount >= MAX_ROADS_BY_AREA[area]) return false;
  if (!ALLOWED_ROAD_TYPES_BY_AREA[area].includes(tile.type)) return false;

  const [x, , z] = tile.position;
  const bounds = AREA_BOUNDS[area];
  const distanceFromCenter = distance2D({ x, z }, bounds.center);
  if (distanceFromCenter > bounds.radius - SAFE_MARGIN_FROM_EDGE) return false;

  const areaObjects = IMPORTANT_OBJECTS.filter((object) => object.area === area);
  return areaObjects.every((object) => {
    const requiredDistance =
      tile.type === "driveway" ? 0.45 : object.radius + MIN_DISTANCE_FROM_BUILDING;
    return distance2D({ x, z }, object) >= Math.min(requiredDistance, MIN_DISTANCE_FROM_LABEL);
  });
}
