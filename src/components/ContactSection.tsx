import { useState } from 'react';
import { profile } from '../data/portfolio';
import { SectionHeading } from './fx';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', honeypot: '' });
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.subject.trim()) e.subject = 'Subject is required';
    if (form.message.trim().length < 10) e.message = 'Message too short';
    return e;
  }

  function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (form.honeypot) return; // spam
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) { setStatus('error'); return; }
    const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(`From: ${form.name} <${form.email}>\n\n${form.message}`)}`;
    window.location.href = mailto;
    setStatus('success');
  }

  return (
    <>
      <SectionHeading kicker="Contact" title="Get In Touch" />
      <div className="gutter grid gap-8 lg:grid-cols-2">
        <div className="space-y-4 text-bone/85">
          <p className="text-sm leading-relaxed">
            Open to internships and opportunities. Reach out via email or the form.
          </p>
          <div className="space-y-2 text-sm">
            <p><span className="text-mist">Email:</span> <a href={`mailto:${profile.email}`} className="text-crimson hover:underline">{profile.email}</a></p>
            <p><span className="text-mist">Phone:</span> {profile.phone}</p>
            <p><span className="text-mist">LinkedIn:</span> <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="text-crimson hover:underline">Profile</a></p>
            <p><span className="text-mist">GitHub:</span> <a href={profile.links.github} target="_blank" rel="noreferrer" className="text-crimson hover:underline">Profile</a></p>
          </div>
          <p className="mt-4 inline-block rounded-full border border-crimson/40 bg-crimson/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-crimson">
            Open to internships and opportunities
          </p>
        </div>

        <form onSubmit={submit} className="space-y-3" noValidate>
          <input type="text" name="company" value={form.honeypot} onChange={(e) => setForm({ ...form, honeypot: e.target.value })} className="hidden" tabIndex={-1} autoComplete="off" />
          {(['name', 'email', 'subject'] as const).map((f) => (
            <div key={f}>
              <input
                type={f === 'email' ? 'email' : 'text'}
                placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                value={form[f]}
                onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                className="min-h-11 w-full rounded-md border border-white/15 bg-ink-2 px-4 text-sm text-bone placeholder:text-smoke focus:border-crimson focus:outline-none"
              />
              {errors[f] && <p className="mt-1 text-xs text-red-400">{errors[f]}</p>}
            </div>
          ))}
          <div>
            <textarea
              placeholder="Message"
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full rounded-md border border-white/15 bg-ink-2 px-4 py-3 text-sm text-bone placeholder:text-smoke focus:border-crimson focus:outline-none"
            />
            {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
          </div>
          <button type="submit" className="min-h-11 rounded-md bg-crimson px-6 text-sm font-bold text-ink transition hover:bg-crimson-2">
            Send Message
          </button>
          {status === 'success' && <p className="text-sm text-green-400">Opening your email client…</p>}
          {status === 'error' && Object.keys(errors).length > 0 && <p className="text-sm text-red-400">Please fix the errors above.</p>}
        </form>
      </div>
    </>
  );
}