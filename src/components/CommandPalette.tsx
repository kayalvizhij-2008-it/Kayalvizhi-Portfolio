import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects, type Project } from '../data/portfolio';


export default function CommandPalette({ onOpenProject, onNavigate }: { onOpenProject: (p: Project) => void; onNavigate: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const items = q.trim()
    ? projects.filter((p) => p.title.toLowerCase().includes(q.toLowerCase())).slice(0, 8)
    : projects.slice(0, 8);

  const sections = ['about', 'experience', 'education', 'originals', 'library', 'skills', 'github', 'achievements', 'resume', 'contact'];

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[160] flex items-start justify-center bg-black/70 p-4 pt-24 backdrop-blur" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
          <motion.div className="w-full max-w-xl rounded-2xl border border-white/15 bg-ink-2 p-4 shadow-2xl" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
            <input autoFocus placeholder="Search projects or sections..." value={q} onChange={(e) => setQ(e.target.value)} className="min-h-11 w-full rounded-md border border-white/15 bg-ink px-4 text-sm text-bone placeholder:text-smoke focus:border-crimson focus:outline-none" />
            <div className="mt-3 max-h-80 overflow-y-auto">
              <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-mist">Sections</p>
              <div className="mb-3 flex flex-wrap gap-2">
                {sections.filter((s) => !q || s.includes(q.toLowerCase())).map((s) => (
                  <button key={s} onClick={() => { onNavigate(s); setOpen(false); }} className="rounded-full bg-white/5 px-3 py-1 text-xs text-bone hover:bg-crimson/20">{s}</button>
                ))}
              </div>
              <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-mist">Projects</p>
              {items.map((p) => (
                <button key={p.id} onClick={() => { onOpenProject(p); setOpen(false); }} className="block w-full rounded-md px-3 py-2 text-left text-sm text-bone hover:bg-white/5">
                  {p.title} <span className="text-xs text-mist">— {p.category}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}