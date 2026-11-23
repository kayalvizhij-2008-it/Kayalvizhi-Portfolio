import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { projects, type Project } from '../data/portfolio';
import { EASE, SectionHeading } from './fx';

const CATEGORIES = ['All', 'Artificial Intelligence', 'Machine Learning', 'Full-Stack Development', 'Developer Tools', 'FinTech', 'Healthcare', 'Social Impact', 'Data Science', 'Computer Science', 'Web Development', 'Software Engineering'];

export default function ProjectLibrary({ onOpen }: { onOpen: (p: Project) => void }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [language, setLanguage] = useState('All');
  const [sort, setSort] = useState('name');

  const languages = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.stack.forEach((s) => set.add(s)));
    return ['All', ...Array.from(set).sort()];
  }, []);

  const filtered = useMemo(() => {
    let list = projects.filter((p) => {
      const q = query.trim().toLowerCase();
      const matchesQ = !q || p.title.toLowerCase().includes(q) || p.logline.toLowerCase().includes(q);
      const matchesCat = category === 'All' || p.category === category || p.genre === category;
      const matchesLang = language === 'All' || p.stack.includes(language);
      return matchesQ && matchesCat && matchesLang;
    });
    if (sort === 'name') list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [query, category, language, sort]);

  return (
    <>
      <SectionHeading kicker="Library" title="Complete Project Library" />
      <div className="gutter">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <input
            type="search"
            placeholder="Search projects..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-11 flex-1 rounded-md border border-white/15 bg-ink-2 px-4 text-sm text-bone placeholder:text-smoke focus:border-crimson focus:outline-none"
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="min-h-11 rounded-md border border-white/15 bg-ink-2 px-3 text-sm text-bone">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="min-h-11 rounded-md border border-white/15 bg-ink-2 px-3 text-sm text-bone">
            {languages.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="min-h-11 rounded-md border border-white/15 bg-ink-2 px-3 text-sm text-bone">
            <option value="name">Sort by name</option>
          </select>
          {(query || category !== 'All' || language !== 'All') && (
            <button onClick={() => { setQuery(''); setCategory('All'); setLanguage('All'); }} className="min-h-11 rounded-md border border-white/15 px-4 text-sm text-bone hover:border-crimson">
              Clear filters
            </button>
          )}
        </div>

        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-mist">No projects match your search.</p>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: (i % 6) * 0.05, ease: EASE }}
              className="group rounded-xl border border-white/10 bg-ink-2/60 p-5 transition hover:border-crimson/60"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl tracking-wide text-bone">{p.title}</h3>
                {p.featured && <span className="rounded bg-crimson/20 px-2 py-0.5 text-[10px] font-bold text-crimson">Featured</span>}
              </div>
              <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-mist">{p.category || p.genre}</p>
              <p className="mt-3 line-clamp-3 text-sm text-bone/75">{p.logline}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.stack.slice(0, 4).map((t) => (
                  <span key={t} className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-bone/80">{t}</span>
                ))}
              </div>
              <div className="mt-4 flex gap-3">
                <button onClick={() => onOpen(p)} className="text-xs font-semibold text-crimson hover:underline">View details</button>
                {p.github && (
                  <a href={p.github} target="_blank" rel="noreferrer" className="text-xs font-semibold text-mist hover:text-bone">GitHub →</a>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </>
  );
}