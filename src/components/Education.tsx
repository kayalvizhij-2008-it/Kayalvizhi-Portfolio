import { motion } from 'framer-motion';
import { education } from '../data/portfolio';
import { EASE, SectionHeading } from './fx';

export default function Education() {
  return (
    <>
      <SectionHeading kicker="Education" title="Academic Background" />
      <div className="gutter grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {education.map((e, i) => (
          <motion.article
            key={e.school}
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.8, delay: i * 0.08, ease: EASE }}
            className="rounded-2xl border border-white/10 bg-ink-2/60 p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-crimson">{e.period}</p>
            <h3 className="mt-2 font-display text-2xl tracking-wide text-bone">{e.school}</h3>
            <p className="mt-1 text-sm text-mist">{e.place}</p>
            <p className="mt-4 text-sm text-bone/85">{e.degree}</p>
            <p className="mt-2 text-sm font-semibold text-crimson-2">{e.score}</p>
          </motion.article>
        ))}
      </div>
    </>
  );
}