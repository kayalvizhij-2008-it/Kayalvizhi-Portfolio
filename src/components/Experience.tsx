import { motion } from 'framer-motion';
import { experience } from '../data/portfolio';
import { EASE, SectionHeading } from './fx';

export default function Experience() {
  return (
    <>
      <SectionHeading kicker="Experience" title="Professional Journey" />
      <div className="gutter space-y-6">
        {experience.map((e, i) => (
          <motion.article
            key={e.company}
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.8, delay: i * 0.08, ease: EASE }}
            className="rounded-2xl border border-white/10 bg-ink-2/60 p-6 backdrop-blur"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-2xl tracking-wide text-bone">{e.company}</h3>
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-crimson">{e.period}</span>
            </div>
            <p className="mt-1 text-sm font-medium text-crimson-2">{e.role} · {e.place}</p>
            <ul className="mt-4 space-y-2 text-sm text-bone/80">
              {e.points.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-crimson" />
                  {p}
                </li>
              ))}
            </ul>
            {e.tech && e.tech.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {e.tech.map((t) => (
                  <span key={t} className="rounded-full bg-white/5 px-3 py-1 text-xs text-bone/80">{t}</span>
                ))}
              </div>
            )}
          </motion.article>
        ))}
        {experience.length === 0 && (
          <p className="text-sm text-mist">Experience details will be added from the resume.</p>
        )}
      </div>
    </>
  );
}