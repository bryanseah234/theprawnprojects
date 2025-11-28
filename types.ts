export interface VercelProjectResponse {
  projects: any[];
  pagination: any;
}

export interface Project {
  id: string;
  name: string;
  framework?: string;
  link?: string; // Derived from alias[0].domain or targets.production.url
  updatedAt: number;
}