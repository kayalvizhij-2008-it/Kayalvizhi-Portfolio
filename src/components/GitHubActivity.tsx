import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { profile } from '../data/portfolio';
import { EASE, SectionHeading } from './fx';

type GHUser = { public_repos: number; followers: number; following: number; avatar_url: string; html_url: string };

export default function GitHubActivity() {
  const [user, setUser] = useState<GHUser | null>(null);
  const [langs, setLangs] = useState<{ name: string; count: number }[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const u = await fetch('https://api.github.com/users/kayalvizhij-2008-it').then((r) => r.json());
        if (cancelled) return;
        setUser(u);
        const repos = await fetch('https://api.github.com/users/kayalvizhij-2008-it/repos?per_page=100').then((r) => r.json());
        if (cancelled || !Array.isArray(repos)) return;
        const map: Record<string, number> = {};
        repos.forEach((r: any) => { if (r.language) map[r.language] = (map[r.language] || 0) + 1; });
        const sorted = Object.entries(map).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
        setLangs(sorted);
      } catch {
        if (!cancelled) setError(true);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <SectionHeading kicker="Developer Activity" title="GitHub & Coding" />
      <div className="gutter space-y-6">
        {error && <p className="text-sm text-mist">GitHub data unavailable right now.</p>}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-ink-2/60 p-6 text-center">
            <p className="font-display text-4xl text-bone">{user?.public_repos ?? '—'}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-mist">Public Repositories</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-ink-2/60 p-6 text-center">
            <p className="font-display text-4xl text-bone">{user?.followers ?? '—'}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-mist">Followers</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-ink-2/60 p-6 text-center">
            <p className="font-display text-4xl text-bone">{user?.following ?? '—'}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-mist">Following</p>
          </div>
        </div>

        {langs.length > 0 && (
          <div className="rounded-2xl border border-white/10 bg-ink-2/60 p-6">
            <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.3em] text-crimson">Language Distribution</h3>
            <div className="space-y-2">
              {langs.map((l) => {
                const total = langs.reduce((s, x) => s + x.count, 0);
                const pct = Math.round((l.count / total) * 100);
                return (
                  <div key={l.name} className="flex items-center gap-3">
                    <span className="w-24 text-sm text-bone/80">{l.name}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded bg-white/10">
                      <motion.div className="h-full bg-crimson" initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 0.8, ease: EASE }} />
                    </div>
                    <span className="w-10 text-right text-xs text-mist">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-white/10 bg-ink-2/60 p-6">
          <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.3em] text-crimson">Contribution Graph</h3>
          <img
            src="https://ghchart.rshah.org/C9A96E/kayalvizhij-2008-it"
            alt="GitHub contribution graph"
            className="w-full rounded"
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <div className="mt-4 flex gap-3">
            <a href={profile.links.github} target="_blank" rel="noreferrer" className="text-sm font-semibold text-crimson hover:underline">View GitHub Profile →</a>
          </div>
        </div>
      </div>
    </>
  );
}