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
      let liveUrl = null;

      // Helper to find the best URL from a list of aliases
      // We prioritize custom domains (no .vercel.app) first, then shortest alias
      // This ensures clean URLs like example.com over project-hash.vercel.app
      const getBestAlias = (aliases: string[]) => {
        if (!aliases || aliases.length === 0) return null;
        
        // Separate custom domains from vercel.app domains
        const customDomains = aliases.filter(a => !a.includes('.vercel.app'));
        const vercelDomains = aliases.filter(a => a.includes('.vercel.app'));
        
        // Prefer custom domains, then vercel domains, sorted by length (shortest first)
        if (customDomains.length > 0) {
          return customDomains.sort((a, b) => a.length - b.length)[0];
        }
        if (vercelDomains.length > 0) {
          return vercelDomains.sort((a, b) => a.length - b.length)[0];
        }
        return null;
      };

      // Strategy 1: Use the project's canonical link if available (most up-to-date)
      // This is set by Vercel and reflects the current project URL name
      if (p.link?.type === 'deploymentAlias' && p.link?.deploymentAlias) {
        liveUrl = `https://${p.link.deploymentAlias}`;
      }

      // Strategy 2: Check project-level aliases (custom domains and project URLs)
      if (!liveUrl && p.alias && Array.isArray(p.alias)) {
        const projectAlias = getBestAlias(p.alias.map((a: any) => 
          typeof a === 'string' ? a : a.domain
        ).filter(Boolean));
        if (projectAlias) {
          liveUrl = `https://${projectAlias}`;
        }
      }

      // Strategy 3: Check Production Target Aliases (Custom Domains live here)
      if (!liveUrl) {
        const productionAlias = getBestAlias(p.targets?.production?.alias);
        if (productionAlias) {
          liveUrl = `https://${productionAlias}`;
        }
      }
      
      // Strategy 4: Check Latest Deployment Aliases (most recent deployment)
      if (!liveUrl) {
        const deploymentAlias = getBestAlias(p.latestDeployments?.[0]?.alias);
        if (deploymentAlias) {
          liveUrl = `https://${deploymentAlias}`;
        }
      }

      // Strategy 5: Fallback to the production target URL
      if (!liveUrl && p.targets?.production?.url) {
        liveUrl = `https://${p.targets.production.url}`;
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