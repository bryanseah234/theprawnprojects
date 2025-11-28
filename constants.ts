import { Project } from "./types";

// In a real Vercel deployment, these would come from process.env
// For this demo, we handle the case where they are missing.
export const VERCEL_API_TOKEN = process.env.REACT_APP_VERCEL_API_TOKEN || process.env.VERCEL_API_TOKEN || '';
export const TEAM_ID = process.env.REACT_APP_TEAM_ID || process.env.NEXT_PUBLIC_TEAM_ID || '';

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'mock-1',
    name: 'neo-portfolio-v1',
    framework: 'Next.js',
    link: 'https://prawnprojects.vercel.app',
    updatedAt: Date.now(),
  },
  {
    id: 'mock-2',
    name: 'retro-game-boy',
    framework: 'React',
    link: 'https://retro-game.hong-yi.me',
    updatedAt: Date.now() - 1000000,
  },
  {
    id: 'mock-3',
    name: 'ai-story-teller',
    framework: 'Svelte',
    link: 'https://ai-story.vercel.app',
    updatedAt: Date.now() - 2000000,
  },
  {
    id: 'mock-4',
    name: 'crypto-dashboard',
    framework: 'Vue',
    link: 'https://crypto-dash-demo.com',
    updatedAt: Date.now() - 3000000,
  },
];