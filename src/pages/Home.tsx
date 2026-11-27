import './Home.css';
import { useEffect, useState } from 'react';
import { IoMenuSharp } from 'react-icons/io5';
import { HiMiniXMark } from 'react-icons/hi2';
import { FiArrowUpRight, FiArrowDown, FiGithub } from 'react-icons/fi';
import type { IconType } from 'react-icons';
import {
    SiReact, SiTypescript, SiNextdotjs, SiJavascript, SiHtml5, SiCss3, SiGit,
    SiGithub, SiVercel, SiNotion, SiSlack, SiFigma, SiClaude, SiOpenai, SiVelog,
} from 'react-icons/si';
import { profile, about, timeline, skills, projects } from '../data/profile';

// 흐르는 띠: 공식 로고(Simple Icons) + 이름. 평소엔 검정, 마우스를 올리면 브랜드 색
const MARQUEE: { name: string; Icon: IconType; color: string }[] = [
    { name: 'React', Icon: SiReact, color: '#61DAFB' },
    { name: 'TypeScript', Icon: SiTypescript, color: '#3178C6' },
    { name: 'Next.js', Icon: SiNextdotjs, color: '#000000' },
    { name: 'JavaScript', Icon: SiJavascript, color: '#E8C900' },
    { name: 'HTML5', Icon: SiHtml5, color: '#E34F26' },
    { name: 'CSS3', Icon: SiCss3, color: '#1572B6' },
    { name: 'Git', Icon: SiGit, color: '#F05032' },
    { name: 'GitHub', Icon: SiGithub, color: '#181717' },
    { name: 'Vercel', Icon: SiVercel, color: '#000000' },
    { name: 'Notion', Icon: SiNotion, color: '#000000' },
    { name: 'Slack', Icon: SiSlack, color: '#4A154B' },
    { name: 'Figma', Icon: SiFigma, color: '#F24E1E' },
    { name: 'Claude', Icon: SiClaude, color: '#D97757' },
    { name: 'ChatGPT', Icon: SiOpenai, color: '#000000' },
];

const MENU = [
    { id: 'about', label: 'About' },
    { id: 'skill', label: 'Skill' },
    { id: 'project', label: 'Project' },
];

// 큰 제목을 한 글자씩 쓰고 지우며 반복
const LINE1 = 'Frontend';
const LINE2 = 'Developer';

function TypedTitle() {
    const total = LINE1.length + LINE2.length;
    const [n, setN] = useState(0);
    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setN(total);
            return;
        }
        let i = 0;
        let deleting = false;
        let timer: number;
        const tick = () => {
            i += deleting ? -1 : 1;
            setN(i);
            let delay = deleting ? 70 : i === LINE1.length ? 320 : 85;
            if (!deleting && i === total) {
                deleting = true;
                delay = 2600; // 다 쓰고 잠깐 보여주기
            } else if (deleting && i === 0) {
                deleting = false;
                delay = 600;
            }
            timer = window.setTimeout(tick, delay);
        };
        timer = window.setTimeout(tick, 450);
        return () => window.clearTimeout(timer);
    }, [total]);

    const l1 = LINE1.slice(0, n);
    const l2 = LINE2.slice(0, Math.max(0, n - LINE1.length));
    const onLine2 = n > LINE1.length;
    return (
        <h1 className="hero-title reveal" aria-label={`${LINE1} ${LINE2}`}>
            <span aria-hidden>
                {l1}
                {!onLine2 && <span className="caret" />}
                <br />
                <em>{l2}</em>
                {onLine2 && <span className="caret" />}
            </span>
        </h1>
    );
}

function Home() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [active, setActive] = useState('');
    const [scrolled, setScrolled] = useState(false);
    const [activeTile, setActiveTile] = useState(0); // Skill: 검은 칸 번호

    // 스크롤 위치에 따라 현재 메뉴 표시 + 등장 애니메이션
    useEffect(() => {
        // About 문장: 스크롤을 내리는 만큼 위 문장부터 차례로 한 글자씩 타이핑 (올리면 다시 지워짐)
        const lead = document.querySelector<HTMLElement>('.about-lead');
        const lines = Array.from(document.querySelectorAll<HTMLElement>('.about-lead p'));
        const texts = lines.map((el) => el.dataset.text ?? '');
        const total = texts.reduce((sum, t) => sum + t.length, 0);
        const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let frame = 0;
        const paintLines = () => {
            frame = 0;
            if (!lead) return;
            const vh = window.innerHeight;
            const top = lead.getBoundingClientRect().top;
            // 문단 윗부분이 화면 아래쪽(85%)에 닿으면 시작, 화면 25%까지 올라오면 끝
            const p = still ? 1 : Math.min(1, Math.max(0, (vh * 0.85 - top) / (vh * 0.6)));
            let left = Math.round(p * total);
            let current = -1;
            lines.forEach((el, i) => {
                const text = texts[i];
                const n = Math.min(text.length, left);
                left -= n;
                if (current === -1 && n < text.length) current = i;
                const typed = el.querySelector<HTMLElement>('.typed');
                const rest = el.querySelector<HTMLElement>('.rest');
                if (typed && rest && typed.textContent?.length !== n) {
                    typed.textContent = text.slice(0, n);
                    rest.textContent = text.slice(n);
                }
            });
            // 커서는 지금 쓰고 있는 문장에만 (다 쓰면 숨김)
            lines.forEach((el, i) => el.classList.toggle('typing', p > 0 && i === current));
        };
        const onScroll = () => {
            setScrolled(window.scrollY > 24);
            if (!frame) frame = requestAnimationFrame(paintLines);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        const sectionObs = new IntersectionObserver(
            (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
            { rootMargin: '-45% 0px -50% 0px' },
        );
        document.querySelectorAll('section[id]').forEach((el) => sectionObs.observe(el));

        const revealObs = new IntersectionObserver(
            (entries) =>
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        e.target.classList.add('in');
                        revealObs.unobserve(e.target);
                    }
                }),
            { threshold: 0.12 },
        );
        document.querySelectorAll('.reveal').forEach((el) => revealObs.observe(el));

        return () => {
            window.removeEventListener('scroll', onScroll);
            cancelAnimationFrame(frame);
            sectionObs.disconnect();
            revealObs.disconnect();
        };
    }, []);


    return (
        <div className="page">
            <div className="bg" aria-hidden>
                <span className="blob b1" />
                <span className="blob b2" />
                <span className="blob b3" />
                <span className="grain" />
            </div>

            <header className={`nav ${scrolled ? 'scrolled' : ''} ${isMenuOpen ? 'open' : ''}`}>
                <a className="logo" href="#top" onClick={() => setIsMenuOpen(false)}>
                    hxont<em>.</em>
                </a>
                <nav className="links">
                    {MENU.map((m) => (
                        <a
                            key={m.id}
                            href={`#${m.id}`}
                            className={active === m.id ? 'active' : ''}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {m.label}
                        </a>
                    ))}
                </nav>
                <a className="nav-cta" href="#contact" onClick={() => setIsMenuOpen(false)}>
                    Contact
                </a>
                <button className="toggle" aria-label="메뉴" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <HiMiniXMark /> : <IoMenuSharp />}
                </button>
            </header>

            <section className="hero" id="top">
                <TypedTitle />
                <div className="hero-bottom reveal">
                    <div>
                        <p className="hero-name">
                            {profile.name}
                        </p>
                        <p className="hero-tagline">{profile.tagline}</p>
                    </div>
                    <div className="hero-actions">
                        <a className="btn dark" href={profile.velog} target="_blank" rel="noreferrer">
                            <SiVelog /> Velog <FiArrowUpRight />
                        </a>
                        <a className="btn light" href={profile.github} target="_blank" rel="noreferrer">
                            <FiGithub /> GitHub
                        </a>
                    </div>
                </div>
                <a className="scroll-hint" href="#about" aria-label="아래로">
                    <FiArrowDown />
                </a>
            </section>

            <div className="marquee" aria-hidden>
                <div className="marquee-track">
                    {[...MARQUEE, ...MARQUEE].map(({ name, Icon, color }, i) => (
                        <span key={i} style={{ '--brand': color } as React.CSSProperties}>
                            <b className="mq-item">
                                <Icon className="mq-logo" />
                                {name}
                            </b>
                            <i>✦</i>
                        </span>
                    ))}
                </div>
            </div>

            <section className="section" id="about">
                <p className="label reveal">(01) About</p>
                <div className="about-grid">
                    <div className="about-lead reveal">
                        {about.map((line) => (
                            <p key={line} data-text={line}>
                                <span className="typed" />
                                <span className="caret" aria-hidden />
                                <span className="rest">{line}</span>
                            </p>
                        ))}
                    </div>
                    <ol className="timeline reveal">
                        {timeline.map((t) => (
                            <li key={t.title}>
                                <span className="period">{t.period}</span>
                                <div>
                                    <strong>{t.title}</strong>
                                    <p>{t.desc}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            <section className="section" id="skill">
                <p className="label reveal">(02) Skill</p>
                <div className={`bento a${activeTile}`} onMouseLeave={() => setActiveTile(0)}>
                    {skills.map((g, i) => (
                        <div
                            className={`tile reveal t${i}`}
                            data-on={activeTile === i}
                            key={g.title}
                            onMouseEnter={() => setActiveTile(i)}
                        >
                            <span className="tile-no">0{i + 1}</span>
                            <h3>{g.title}</h3>
                            <ul>
                                {g.items.map((s) => (
                                    <li key={s}>{s}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            <section className="section" id="project">
                <p className="label reveal">(03) Project</p>
                <ul className="works">
                    {projects.map((p, i) => {
                        const Tag = p.link ? 'a' : 'div';
                        return (
                            <li className="reveal" key={p.title}>
                                <Tag
                                    className="work"
                                    {...(p.link ? { href: p.link, target: '_blank', rel: 'noreferrer' } : {})}
                                >
                                    <span className="work-no">{String(i + 1).padStart(2, '0')}</span>
                                    <div className="work-main">
                                        <h3>
                                            {p.title}
                                            {p.live && <span className="live">운영 중</span>}
                                        </h3>
                                        <p className="work-summary">{p.summary}</p>
                                        {p.points.length > 0 && (
                                            <ul className="work-points">
                                            {p.points.map((pt) => (
                                                <li key={pt}>{pt}</li>
                                            ))}
                                        </ul>
                                        )}
                                    </div>
                                    <div className="work-meta">
                                        <span className="period">{p.period}</span>
                                        <div className="tags">
                                            {p.stack.map((s) => (
                                                <span key={s}>{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                    {p.link && <FiArrowUpRight className="work-arrow" />}
                                </Tag>
                            </li>
                        );
                    })}
                </ul>
            </section>

            <section className="section" id="contact">
                <div className="contact reveal">
                    <p className="label light">(04) Contact</p>
                    <h2>
                        Let's build
                        <br />
                        something <em>together.</em>
                    </h2>
                    <a className="contact-mail" href={`mailto:${profile.email}`}>
                        {profile.email} <FiArrowUpRight />
                    </a>
                </div>
            </section>

            <footer className="footer">
                <span>© {new Date().getFullYear()} hxont</span>
                <a href="#top">Back to top ↑</a>
            </footer>
        </div>
    );
}

export default Home;
