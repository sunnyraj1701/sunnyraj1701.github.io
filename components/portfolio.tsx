"use client";

import { FormEvent, useEffect, useState } from "react";

const navigation = [
  ["home", "Home"],
  ["about", "About"],
  ["skills", "Skills"],
  ["learning", "Learning"],
  ["projects", "Projects"],
  ["achievements", "Achievements"],
  ["education", "Education"],
  ["contact", "Contact"],
] as const;

const roles = [
  "Aspiring MERN Stack Developer",
  "Frontend Developer",
  "C++ Programmer",
  "Problem Solver",
];

const skills = [
  { title: "Programming", tags: ["C++", "JavaScript"], icon: "</>" },
  { title: "Web", tags: ["HTML5", "CSS3", "Responsive Design"], icon: "⌂" },
  {
    title: "Problem Solving",
    tags: ["Data Structures", "Algorithms", "OOP"],
    icon: "✳",
  },
  { title: "Tools", tags: ["Git", "GitHub", "VS Code"], icon: "⌘" },
];

const learning = [
  "React.js",
  "Node.js",
  "Express.js",
  "MongoDB",
  "REST APIs",
  "JWT Authentication",
  "Tailwind CSS",
  "Next.js",
];

const highlights = [
  "DSA-first problem solving mindset",
  "Comfortable across HTML/CSS/JS fundamentals",
  "Actively building toward full MERN proficiency",
];

function ThemeIcon({ light }: { light: boolean }) {
  return light ? (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  ) : (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function ContactForm() {
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStatus("");
    setPending(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
          website: formData.get("website"),
        }),
      });
      const result: { success?: boolean; error?: string } = await response.json();

      if (!response.ok || !result.success) {
        setError(result.error || "Your message could not be sent. Please try again.");
        return;
      }

      form.reset();
      setStatus("Message sent! Thanks for reaching out — I’ll get back to you soon.");
    } catch {
      setError("Could not reach the server. Please try again in a moment.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="glass-card contact-form reveal" onSubmit={submitMessage}>
      <div className="form-row">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" autoComplete="name" minLength={2} maxLength={80} placeholder="Your name" required />
      </div>
      <div className="form-row">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" maxLength={254} placeholder="you@example.com" required />
      </div>
      <div className="form-row">
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" rows={5} minLength={10} maxLength={5000} placeholder="Tell me about the opportunity or idea..." required />
      </div>
      <div className="website-field" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <button type="submit" className="btn btn-primary btn-block ripple" disabled={pending}>
        {pending ? "Sending..." : "Send Message"}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
      <p className="form-success show" role="status" aria-live="polite">{status}</p>
      <p className="form-error" role="alert">{error}</p>
    </form>
  );
}

export default function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightTheme, setLightTheme] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("portfolio-theme");
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    const useLightTheme = savedTheme ? savedTheme === "light" : prefersLight;
    setLightTheme(useLightTheme);
    document.documentElement.dataset.theme = useLightTheme ? "light" : "dark";
  }, []);

  useEffect(() => {
    let roleIndex = 0;
    let characterIndex = 0;
    let deleting = false;
    let timeout: ReturnType<typeof setTimeout>;

    const type = () => {
      const currentRole = roles[roleIndex];
      characterIndex += deleting ? -1 : 1;
      setRole(currentRole.slice(0, characterIndex));

      let delay = deleting ? 38 : 75;
      if (!deleting && characterIndex === currentRole.length) {
        deleting = true;
        delay = 1300;
      } else if (deleting && characterIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 350;
      }
      timeout = setTimeout(type, delay);
    };

    timeout = setTimeout(type, 250);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const updateScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0);
      setShowTop(window.scrollY > 500);

      let current = "home";
      for (const section of document.querySelectorAll<HTMLElement>("main section[id]")) {
        if (window.scrollY >= section.offsetTop - 150) current = section.id;
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(".reveal");
    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("in-view"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  function toggleTheme() {
    const nextTheme = lightTheme ? "dark" : "light";
    setLightTheme(nextTheme === "light");
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("portfolio-theme", nextTheme);
  }

  return (
    <>
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />
      <a href="#home" className="skip-link">Skip to main content</a>
      <header className={`navbar${showTop ? " scrolled" : ""}`} id="navbar">
        <nav className="nav-container" aria-label="Primary">
          <a href="#home" className="nav-logo" onClick={() => setMenuOpen(false)}>
            <span className="logo-bracket">&lt;</span>Sunny<span className="logo-accent">Raj</span><span className="logo-bracket">/&gt;</span>
          </a>
          <ul className={`nav-links${menuOpen ? " open" : ""}`} id="navLinks">
            {navigation.map(([id, label]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={`nav-link${activeSection === id ? " active-link" : ""}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <div className="nav-actions">
            <button className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${lightTheme ? "dark" : "light"} theme`}>
              <ThemeIcon light={lightTheme} />
            </button>
            <button
              className={`hamburger${menuOpen ? " open" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="navLinks"
            >
              <span /><span /><span />
            </button>
          </div>
        </nav>
      </header>

      <main id="home">
        <section className="hero" aria-label="Introduction">
          <div className="hero-shapes" aria-hidden="true">
            <div className="shape shape-1" /><div className="shape shape-2" /><div className="shape shape-3" />
          </div>
          <div className="container hero-grid">
            <div className="hero-content reveal">
              <p className="hero-eyebrow"><span className="pulse-dot" />Open to Internships &amp; Full-time SDE Roles</p>
              <h1 className="hero-title">Hi, I&apos;m <span className="gradient-text">Sunny Raj</span></h1>
              <h2 className="hero-role"><span className="typing-text">{role}</span><span className="typing-cursor" aria-hidden="true">|</span></h2>
              <p className="hero-summary">
                I&apos;m a Computer Science student passionate about building modern web applications and solving real-world problems. I enjoy cracking Data Structures &amp; Algorithms problems in C++, crafting responsive websites, and constantly leveling up my stack. My goal: become a skilled <strong>MERN Stack Developer</strong> and ship software that matters.
              </p>
              <div className="hero-buttons">
                <a href="#projects" className="btn btn-primary ripple">Explore my work</a>
                <a href="#contact" className="btn btn-secondary ripple">Let&apos;s connect</a>
                <a href="https://github.com/sunnyraj" target="_blank" rel="noopener noreferrer" className="btn btn-icon ripple" aria-label="GitHub">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.1.83-.27.83-.58v-2.02c-3.34.73-4.04-1.6-4.04-1.6-.55-1.4-1.34-1.77-1.34-1.77-1.1-.75.08-.74.08-.74 1.2.09 1.84 1.24 1.84 1.24 1.08 1.84 2.83 1.31 3.52 1 .1-.79.42-1.31.76-1.62-2.66-.3-5.47-1.34-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.6-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .31.22.69.83.57A12 12 0 0 0 12 .3" /></svg>
                </a>
                <a href="https://linkedin.com/in/sunnyraj" target="_blank" rel="noopener noreferrer" className="btn btn-icon ripple" aria-label="LinkedIn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.86 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" /></svg>
                </a>
              </div>
              <div className="hero-stats">
                <div className="stat"><span className="stat-number">300+</span><span className="stat-label">LeetCode Solved</span></div>
                <div className="stat"><span className="stat-number">8</span><span className="stat-label">Tech Currently Learning</span></div>
                <div className="stat"><span className="stat-number">1+</span><span className="stat-label">Projects Shipped</span></div>
              </div>
            </div>
            <div className="hero-visual reveal">
              <div className="code-window" role="img" aria-label="Code editor window showing developer profile">
                <div className="code-window-header"><span className="dot dot-red" /><span className="dot dot-yellow" /><span className="dot dot-green" /><span className="code-window-title">developer.js</span></div>
                <div className="code-window-body"><pre><code><span className="c-key">const</span> <span className="c-var">developer</span> = {`{
  `}<span className="c-prop">name</span>{`: `}<span className="c-str">&quot;Sunny Raj&quot;</span>{`,
  `}<span className="c-prop">role</span>{`: `}<span className="c-str">&quot;CS Student&quot;</span>{`,
  `}<span className="c-prop">stack</span>{`: [`}<span className="c-str">&quot;C++&quot;</span>{`, `}<span className="c-str">&quot;JS&quot;</span>{`, `}<span className="c-str">&quot;HTML&quot;</span>{`, `}<span className="c-str">&quot;CSS&quot;</span>{`],
  `}<span className="c-prop">learning</span>{`: [`}<span className="c-str">&quot;React&quot;</span>{`, `}<span className="c-str">&quot;Node&quot;</span>{`, `}<span className="c-str">&quot;MongoDB&quot;</span>{`],
  `}<span className="c-prop">leetcode</span>{`: `}<span className="c-num">300</span>{`+,
  `}<span className="c-prop">available</span>{`: `}<span className="c-bool">true</span>{`,
  `}<span className="c-prop">goal</span>{`: () `}<span className="c-op">=&gt;</span>{` `}<span className="c-str">&quot;MERN Stack Engineer&quot;</span>{`
};

`}<span className="c-comment">// building the future, one commit at a time</span>{`
`}<span className="c-key">console</span>{`.`}<span className="c-prop">log</span>{`(developer.`}<span className="c-prop">goal</span>{`());`}</code></pre></div>
              </div>
              <div className="code-window-glow" aria-hidden="true" />
            </div>
          </div>
          <a href="#about" className="scroll-indicator" aria-label="Scroll to About"><span className="scroll-mouse"><span className="scroll-wheel" /></span></a>
        </section>

        <section className="section" id="about">
          <div className="container">
            <p className="section-eyebrow reveal">01 — Get to know me</p>
            <h2 className="section-title reveal">About <span className="gradient-text">Me</span></h2>
            <div className="about-grid">
              <div className="about-text reveal">
                <p>I&apos;m Sunny Raj, a Computer Science student who genuinely loves the process of turning logic into working software. My journey started with C++ and Data Structures &amp; Algorithms — that&apos;s where I learned to think in terms of efficiency, edge cases, and clean problem-solving.</p>
                <p>From there, I moved into the web: HTML, CSS and JavaScript let me bring designs to life. Right now, I&apos;m deep in the process of becoming a <strong>MERN Stack Developer</strong> — layering React, Node.js, Express and MongoDB on top of the fundamentals I&apos;ve already built.</p>
                <p>I care about writing readable code, understanding the &quot;why&quot; behind a pattern, and shipping things that work end-to-end. When I&apos;m not coding, I&apos;m probably solving a LeetCode problem or reading about system design.</p>
                <div className="about-highlights">
                  {highlights.map((highlight) => <div className="highlight-item" key={highlight}><span className="highlight-check" aria-hidden="true">✓</span><span>{highlight}</span></div>)}
                </div>
              </div>
              <div className="about-card reveal">
                <div className="glass-card about-info-card">
                  <h3>Quick Info</h3>
                  <ul className="info-list">
                    <li><span>Role</span><strong>Aspiring MERN Developer</strong></li>
                    <li><span>Focus</span><strong>Frontend + DSA</strong></li>
                    <li><span>Languages</span><strong>C++, JavaScript</strong></li>
                    <li><span>Status</span><strong>Open to Internships</strong></li>
                    <li><span>Based in</span><strong>India</strong></li>
                  </ul>
                  <a href="#contact" className="btn btn-primary btn-block ripple">Let&apos;s Connect</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section section-alt" id="skills">
          <div className="container">
            <p className="section-eyebrow reveal">02 — What I work with</p>
            <h2 className="section-title reveal">Current <span className="gradient-text">Skills</span></h2>
            <p className="section-subtitle reveal">The tools and concepts I already use with confidence.</p>
            <div className="skills-grid">
              {skills.map((skill) => (
                <article className="glass-card skill-card reveal" key={skill.title}>
                  <div className="skill-icon-wrap" aria-hidden="true">{skill.icon}</div>
                  <h3>{skill.title}</h3>
                  <div className="tag-list">{skill.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="learning">
          <div className="container">
            <p className="section-eyebrow reveal">03 — Leveling up</p>
            <h2 className="section-title reveal">Currently <span className="gradient-text">Learning</span></h2>
            <p className="section-subtitle reveal">Actively building toward full MERN stack proficiency — one topic at a time.</p>
            <div className="learning-grid">{learning.map((item) => <div className="learning-chip reveal" key={item}><span className="chip-dot" />{item}</div>)}</div>
            <div className="learning-progress reveal">
              <div className="progress-track"><div className="progress-fill" style={{ width: "35%" }} /></div>
              <p className="progress-caption">MERN stack journey — steadily in progress</p>
            </div>
          </div>
        </section>

        <section className="section section-alt" id="projects">
          <div className="container">
            <p className="section-eyebrow reveal">04 — What I&apos;ve built</p>
            <h2 className="section-title reveal">Featured <span className="gradient-text">Projects</span></h2>
            <p className="section-subtitle reveal">A look at the work I&apos;ve shipped so far — more on the way as I grow into MERN.</p>
            <div className="projects-grid">
              <article className="glass-card project-card reveal">
                <div className="project-image">
                  <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Portfolio preview">
                    <defs><linearGradient id="pgrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#38BDF8" stopOpacity="0.35" /><stop offset="100%" stopColor="#06B6D4" stopOpacity="0.15" /></linearGradient></defs>
                    <rect width="400" height="240" fill="url(#pgrad)" /><rect x="24" y="24" width="352" height="24" rx="6" fill="#0F172A" fillOpacity="0.6" />
                    <circle cx="40" cy="36" r="4" fill="#38BDF8" /><circle cx="54" cy="36" r="4" fill="#38BDF8" fillOpacity="0.6" /><circle cx="68" cy="36" r="4" fill="#38BDF8" fillOpacity="0.3" />
                    <rect x="24" y="64" width="160" height="14" rx="4" fill="#38BDF8" fillOpacity="0.8" /><rect x="24" y="88" width="220" height="10" rx="3" fill="#E2E8F0" fillOpacity="0.5" /><rect x="24" y="104" width="180" height="10" rx="3" fill="#E2E8F0" fillOpacity="0.3" />
                    <rect x="24" y="130" width="100" height="34" rx="8" fill="#38BDF8" fillOpacity="0.9" /><rect x="136" y="130" width="100" height="34" rx="8" fill="none" stroke="#38BDF8" strokeOpacity="0.7" strokeWidth="2" /><rect x="24" y="184" width="352" height="32" rx="6" fill="#0F172A" fillOpacity="0.5" />
                  </svg>
                </div>
                <div className="project-body">
                  <h3>Personal Portfolio Website</h3>
                  <p>A responsive developer portfolio, now rebuilt with Next.js and a real contact API backed by SQLite — with glassmorphism UI, dark and light themes, and a custom typing effect.</p>
                  <div className="tag-list"><span className="tag tag-tech">Next.js</span><span className="tag tag-tech">TypeScript</span><span className="tag tag-tech">SQLite</span></div>
                  <div className="project-links"><a href="#contact" className="btn btn-primary btn-sm ripple">Discuss a project <span aria-hidden="true">↗</span></a></div>
                </div>
              </article>
              <article className="glass-card project-card project-card-ghost reveal">
                <div className="ghost-content"><span className="coming-icon" aria-hidden="true">＋</span><h3>More Projects Coming Soon</h3><p>Building MERN stack projects as I complete my React, Node.js and MongoDB learning path.</p></div>
              </article>
            </div>
          </div>
        </section>

        <section className="section" id="achievements">
          <div className="container">
            <p className="section-eyebrow reveal">05 — Track record</p>
            <h2 className="section-title reveal">Achievements</h2>
            <div className="achievements-grid">
              <article className="glass-card achievement-card reveal"><div className="achievement-icon" aria-hidden="true">⌘</div><span className="achievement-number">300+</span><p>LeetCode Problems Solved</p></article>
              <article className="glass-card achievement-card reveal"><div className="achievement-icon" aria-hidden="true">⌁</div><span className="achievement-static">Strong DSA</span><p>Understanding of Core Data Structures &amp; Algorithms</p></article>
              <article className="glass-card achievement-card reveal"><div className="achievement-icon" aria-hidden="true">◷</div><span className="achievement-static">Active</span><p>Consistent GitHub Contributor</p></article>
              <article className="glass-card achievement-card reveal"><div className="achievement-icon" aria-hidden="true">ϟ</div><span className="achievement-static">In Progress</span><p>Learning the Full MERN Stack</p></article>
            </div>
          </div>
        </section>

        <section className="section section-alt" id="education">
          <div className="container">
            <p className="section-eyebrow reveal">06 — Academic background</p>
            <h2 className="section-title reveal">Education</h2>
            <div className="timeline reveal">
              <article className="timeline-item"><div className="timeline-dot" /><div className="glass-card timeline-card"><h3>Bachelor of Computer Science</h3><p className="timeline-meta">Computer Science &amp; Engineering</p><p>Focused on programming fundamentals, data structures &amp; algorithms, object-oriented design, and web development — building the foundation for a career as a software engineer.</p></div></article>
              <article className="timeline-item"><div className="timeline-dot" /><div className="glass-card timeline-card"><h3>Higher Secondary Education</h3><p className="timeline-meta">Science Stream</p><p>Built a strong base in mathematics and logical reasoning — the groundwork that later fueled a passion for problem-solving and programming.</p></div></article>
            </div>
          </div>
        </section>

        <section className="section" id="contact">
          <div className="container">
            <p className="section-eyebrow reveal">07 — Get in touch</p>
            <h2 className="section-title reveal">Let&apos;s Build Something <span className="gradient-text">Together</span></h2>
            <p className="section-subtitle reveal">Have an internship opportunity, a project idea, or just want to talk tech? My inbox is open.</p>
            <div className="contact-grid">
              <ContactForm />
              <div className="contact-side reveal">
                <div className="glass-card contact-info-card">
                  <h3>Let&apos;s Connect</h3>
                  <p className="contact-intro">The quickest way to reach me is through the message form. I&apos;ll reply to the email address you provide.</p>
                  <a href="https://github.com/sunnyraj" target="_blank" rel="noopener noreferrer" className="contact-line"><span aria-hidden="true">⌘</span> github.com/sunnyraj</a>
                  <a href="https://linkedin.com/in/sunnyraj" target="_blank" rel="noopener noreferrer" className="contact-line"><span aria-hidden="true">in</span> linkedin.com/in/sunnyraj</a>
                </div>
                <div className="glass-card availability-card"><span className="pulse-dot" /><p>Currently available for <strong>internships</strong> and <strong>entry-level SDE roles</strong>.</p></div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-grid">
          <div className="footer-brand"><a href="#home" className="nav-logo"><span className="logo-bracket">&lt;</span>Sunny<span className="logo-accent">Raj</span><span className="logo-bracket">/&gt;</span></a><p>Aspiring MERN Stack Developer &amp; Software Engineer, building one project at a time.</p></div>
          <div className="footer-links"><h4>Navigate</h4><a href="#about">About</a><a href="#skills">Skills</a><a href="#projects">Projects</a><a href="#contact">Contact</a></div>
          <div className="footer-social"><h4>Connect</h4><div className="footer-social-icons"><a href="https://github.com/sunnyraj" target="_blank" rel="noopener noreferrer" aria-label="GitHub">GH</a><a href="https://linkedin.com/in/sunnyraj" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">in</a><a href="#contact" aria-label="Send a message">✉</a></div></div>
        </div>
        <div className="footer-bottom"><p>© {new Date().getFullYear()} Sunny Raj. Built with Next.js.</p></div>
      </footer>
      <button className={`back-to-top${showTop ? " show" : ""}`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></svg>
      </button>
    </>
  );
}
