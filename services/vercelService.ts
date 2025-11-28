import { Project, VercelProjectResponse } from '../types';
import { VERCEL_API_TOKEN, TEAM_ID } from '../constants';

export const fetchProjects = async (): Promise<Project[]> => {
  // Verbose logging for debugging API connection issues
  console.group('🍤 Prawn Projects: API Connection Debug');
  console.log('Checking Environment Variables...');
  
  const hasToken = !!VERCEL_API_TOKEN;
  const tokenPrefix = hasToken ? VERCEL_API_TOKEN.substring(0, 5) + '...' : 'MISSING';
  
  console.log(`Token Status: ${hasToken ? 'FOUND' : 'MISSING'}`);
  console.log(`Token Preview: ${tokenPrefix}`);
  console.log(`Team ID: ${TEAM_ID || 'Not set (using personal account)'}`);

  if (!hasToken) {
    console.warn('CRITICAL: Vercel API Token is missing.');
    console.warn('Ensure your environment variable in Vercel is named correctly.');
    console.warn('Try naming it NEXT_PUBLIC_VERCEL_API_TOKEN or VITE_VERCEL_API_TOKEN to ensure it is exposed to the client.');
    console.groupEnd();
    throw new Error('Missing Vercel API Token');
  }

  const teamParam = TEAM_ID ? `?teamId=${TEAM_ID}` : '';
  const url = `https://api.vercel.com/v9/projects${teamParam}`;
  
  console.log(`Fetching from: ${url}`);
  console.groupEnd();

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${VERCEL_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Vercel API Response Error:', response.status, errorBody);
      throw new Error(`Vercel API Error: ${response.status} ${response.statusText}`);
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
  } catch (error) {
    console.error('Fetch execution failed:', error);
    throw error;
  }
};