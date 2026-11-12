import type { APIRoute } from 'astro';
import { execSync } from 'node:child_process';
import pkg from '../../package.json';

function git(cmd: string): string | null {
  try {
    return execSync(`git ${cmd}`, { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return null;
  }
}

// В GitHub Actions берём данные из переменных окружения, локально — из git.
const commit = process.env.GITHUB_SHA ?? git('rev-parse HEAD');

export const GET: APIRoute = () => {
  const data = {
    name: pkg.name,
    version: pkg.version,
    commit,
    commitShort: commit?.slice(0, 7) ?? null,
    branch: process.env.GITHUB_REF_NAME ?? git('rev-parse --abbrev-ref HEAD'),
    runNumber: process.env.GITHUB_RUN_NUMBER ?? null,
    builtAt: new Date().toISOString(),
  };

  return new Response(JSON.stringify(data, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
};
