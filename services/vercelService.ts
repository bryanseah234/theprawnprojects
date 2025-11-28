import { Project, VercelProjectResponse } from '../types';
import { VERCEL_API_TOKEN, TEAM_ID } from '../constants';

export const fetchProjects = async (): Promise<Project[]> => {
  // If no token is configured, throw immediately to trigger mock data fallback
  if (!VERCEL_API_TOKEN) {
    throw new Error('Missing Vercel API Token');
  }

  const teamParam = TEAM_ID ? `?teamId=${TEAM_ID}` : '';
  const url = `https://api.vercel.com/v9/projects${teamParam}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${VERCEL_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Vercel API Error: ${response.statusText}`);
  }

  const data: VercelProjectResponse = await response.json();

  // Map the raw Vercel response to our simplified Project type
  return data.projects.map((p: any) => {
    // Attempt to find the production deployment URL
    let liveUrl = null;
    
    // Strategy 1: targets.production.url (if available)
    if (p.targets?.production?.url) {
      liveUrl = `https://${p.targets.production.url}`;
    } 
    // Strategy 2: targets.production.alias (array of strings)
    else if (p.targets?.production?.alias && p.targets.production.alias.length > 0) {
      liveUrl = `https://${p.targets.production.alias[0]}`;
    }
    // Strategy 3: Check latestDeployment alias
    else if (p.latestDeployments?.[0]?.alias?.[0]) {
      liveUrl = `https://${p.latestDeployments[0].alias[0]}`;
    }

    return {
      id: p.id,
      name: p.name,
      framework: p.framework,
      link: liveUrl || undefined,
      updatedAt: p.updatedAt,
    };
  });
};