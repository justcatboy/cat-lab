import type { APIRoute } from 'astro';
import { buildInfo } from '../lib/buildInfo';

export const GET: APIRoute = () => {
  return new Response(JSON.stringify(buildInfo, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
};
