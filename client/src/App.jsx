import React, { useEffect, useRef, useState } from 'react';

// Render *word* as italic serif accent.
const Rich = ({ text }) =>
  text.split(/(\*[^*]+\*)/g).map((p, i) =>
    p.startsWith('*') ? <em key={i}>{p.slice(1, -1)}</em> : <React.Fragment key={i}>{p}</React.Fragment>
  );

function Reveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setOn(true), io.disconnect()), { threshold: 0.15 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${on ? 'in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

const mailto = (email, topic) =>
  `mailto:${email}?subject=${encodeURIComponent(`Let's ${topic ? 'play: ' + topic : 'talk'}`)}&body=${encodeURIComponent(
    `Hey Anunay,\n\nI'm up for ${topic || 'a chat'}. When are you free?\n\n`
  )}`;

const STICKERS = [
  { e: '♟️', s: { top: '14%', left: '8%' }, d: 0 },
  { e: '🔍', s: { top: '10%', right: '8%' }, d: 0.6 },
  { e: '📈', s: { top: '34%', right: '22%' }, d: 1.2 },
  { e: '✈️', s: { top: '62%', left: '6%' }, d: 0.3 },
  { e: '🏸', s: { top: '60%', right: '7%' }, d: 0.9 },
];

export default function App() {
  const [c, setC] = useState(null);
  const [copied, setCopied] = useState(false);
  const [topic, setTopic] = useState('');
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ type: '', msg: '' });

  useEffect(() => {
    fetch('/api/content').then((r) => r.json()).then(setC).catch(() => setC(false));
  }, []);

  // Mouse parallax for hero stickers.
  useEffect(() => {
    const onMove = (e) => {
      const x = (e.clientX / innerWidth - 0.5) * 24;
      const y = (e.clientY / innerHeight - 0.5) * 24;
      document.documentElement.style.setProperty('--px', `${x}px`);
      document.documentElement.style.setProperty('--py', `${y}px`);
    };
    addEventListener('mousemove', onMove);
    return () => removeEventListener('mousemove', onMove);
  }, []);

  if (c === null) return <div className="loading">♟️</div>;
  if (c === false) return <div className="loading">Couldn't reach the server. Is it running? 🔌</div>;

  const copy = async () => {
    try { await navigator.clipboard.writeText(c.email); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const send = async (e) => {
    e.preventDefault();
    setStatus({ type: 'busy', msg: 'Sending…' });
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, topic }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      setForm({ name: '', email: '', message: '' });
      setStatus({ type: 'ok', msg: 'Sent! I reply within a day 🎉' });
    } catch (err) {
      setStatus({ type: 'err', msg: err.message || 'Something went wrong.' });
    }
  };

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  const ticker = [...c.ticker, ...c.ticker, ...c.ticker, ...c.ticker];

  return (
    <>
      <header className="nav">
        <a href="#top" className="logo">{c.name} 👋</a>
        <nav>
          <button className="pill white" onClick={() => scrollTo('obsessions')}>What I do</button>
          <button className="pill white" onClick={() => scrollTo('camera')}>Watch</button>
          <a className="pill orange" href={mailto(c.email)}>Say hi →</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          {STICKERS.map((s) => (
            <span key={s.e} className="sticker" style={{ ...s.s, animationDelay: `${s.d}s` }}>
              <span className="sticker-in">{s.e}</span>
            </span>
          ))}
          <span className="pill blue tag tilt-l">{c.role} 🧑‍💻</span>
          <h1>
            <span className="hi">Hey there! <span className="wave">👋</span> I'm</span>
            {c.name}
          </h1>
          <p className="lead"><Rich text={c.tagline} /></p>
          <div className="row">
            <a className="pill orange big" href={mailto(c.email)}>Say hello 👋</a>
          </div>
        </section>

        <div className="marquee" aria-hidden="true">
          <div className="track">
            {ticker.map((t, i) => (
              <span key={i}>{['♟️', '🏸', '🏏', '🥒', '✈️', '📊'][i % 6]} {t}</span>
            ))}
          </div>
        </div>

        <section className="about wrap">
          <Reveal className="photo-wrap">
            <div className="photo"><img src="/anunay.png" alt="Anunay sitting on a mossy staircase" /></div>
          </Reveal>
          <Reveal delay={120} className="about-text">
            <small>{c.about.label} ✍️</small>
            <p><Rich text={c.about.text} /> 😜</p>
          </Reveal>
        </section>

        <section id="obsessions" className="wrap">
          <Reveal><h2>What I'm <em>obsessed</em> with 👀</h2></Reveal>
          <div className="grid">
            {c.obsessions.map((o, i) => (
              <Reveal key={o.id} delay={(i % 2) * 100}>
                <article className={`card ${o.color}`}>
                  <div className="media"><span>{o.emoji}</span><i>{o.title}</i></div>
                  <div className="card-head">
                    <h3>{o.title} {o.emoji}</h3>
                    {o.badge && <span className="pill white small">{o.badge}</span>}
                  </div>
                  <p>{o.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="camera" className="dark">
          <div className="wrap">
            <Reveal>
              <h2><Rich text={c.camera.title} /> 🎥</h2>
              <p className="muted">{c.camera.text}</p>
            </Reveal>
            <div className="grid">
              {c.camera.channels.map((ch, i) => (
                <Reveal key={ch.name} delay={i * 100}>
                  <article className={`card ${ch.color}`}>
                    <div className="media"><span>{ch.emoji}</span><i>{ch.name} preview</i></div>
                    <div className="card-head">
                      <h3>{ch.name} {ch.emoji}</h3>
                      <a className="pill white small" href={ch.url} target="_blank" rel="noreferrer">{ch.cta}</a>
                    </div>
                    <p>{ch.body}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="play" className="play wrap">
          <Reveal>
            <span className="pill green tag tilt-r">Bring to opponents, promise 🤝</span>
            <h2 className="center">Wanna <em>play?</em> 🎮</h2>
            <p className="lead center">Pick what you're up for. One tap opens a ready-to-send email. I reply within a day. 😊</p>
            <div className="chips">
              {c.play.map((p) => (
                <a
                  key={p.label}
                  className={`pill ${p.color} ${topic === p.label ? 'sel' : ''}`}
                  href={mailto(c.email, p.label)}
                  onMouseEnter={() => setTopic(p.label)}
                  onFocus={() => setTopic(p.label)}
                >
                  {p.emoji} {p.label}
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="mail-card">
              <small>Or just email me directly ↓</small>
              <a className="big-mail" href={mailto(c.email)}>{c.email}</a>
              <div className="chips">
                <button className="pill white" onClick={copy}>{copied ? 'Copied! ✅' : 'Copy email 📋'}</button>
                {c.links.map((l) => (
                  <a key={l.label} className={`pill ${l.color}`} href={l.url} target="_blank" rel="noreferrer">
                    {l.label} {l.emoji}
                  </a>
                ))}
              </div>
              <form onSubmit={send}>
                <p className="form-title">…or drop a note right here{topic && <> about <b>{topic}</b></>}</p>
                <input placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <input type="email" placeholder="Your email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                <textarea rows="3" placeholder="Game on? Tell me the details…" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
                <button className="pill orange big" disabled={status.type === 'busy'}>Send it 🚀</button>
                {status.msg && <p className={`status ${status.type}`} role="status">{status.msg}</p>}
              </form>
            </div>
          </Reveal>
        </section>
      </main>

      <footer>
        <p>© {new Date().getFullYear()} {c.name} · made with way too much coffee ☕ and at least one blundered queen ♛</p>
      </footer>
      <a className="pill orange fab" href={mailto(c.email)}>Say hi 👋</a>
    </>
  );
}
