import './Home.css';
import { useEffect, useRef, useState } from 'react';
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

// 사이트 전용 커서: 리본이 마우스를 따라다님. 링크·버튼 위에선 갸웃하며 커짐 (마우스 쓰는 PC에서만)
function Cursor() {
    const dot = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!window.matchMedia('(pointer: fine)').matches) return;
        const root = document.documentElement;
        root.classList.add('has-cursor', 'cursor-out'); // 마우스를 움직이기 전엔 숨김
        const move = (e: PointerEvent) => {
            const el = dot.current;
            if (!el) return;
            el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            el.classList.toggle('hot', !!(e.target as Element | null)?.closest('a, button'));
            root.classList.remove('cursor-out');
        };
        const leave = () => root.classList.add('cursor-out');
        const down = () => dot.current?.classList.add('down');
        const up = () => dot.current?.classList.remove('down');
        window.addEventListener('pointermove', move);
        document.addEventListener('mouseleave', leave);
        window.addEventListener('pointerdown', down);
        window.addEventListener('pointerup', up);
        return () => {
            root.classList.remove('has-cursor', 'cursor-out');
            window.removeEventListener('pointermove', move);
            document.removeEventListener('mouseleave', leave);
            window.removeEventListener('pointerdown', down);
            window.removeEventListener('pointerup', up);
        };
    }, []);
    return (
        <div className="cursor-dot" ref={dot} aria-hidden>
            <img src="/ribbon.png" alt="" />
        </div>
    );
}

function Home() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [active, setActive] = useState('');
    const [scrolled, setScrolled] = useState(false);
    const [activeTile, setActiveTile] = useState(0); // Skill: 검은 칸 번호
    const [activeProject, setActiveProject] = useState(0); // Project: 지금 펼쳐진 프로젝트
    const showcaseRef = useRef<HTMLDivElement>(null);
    const heroWrapRef = useRef<HTMLDivElement>(null);
    const heroCardRef = useRef<HTMLDivElement>(null);
    const hscrollRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    // 목록을 누르면 그 프로젝트 차례가 되는 위치로 스크롤
    const goProject = (i: number) => {
        const el = showcaseRef.current;
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY;
        const total = el.offsetHeight - window.innerHeight;
        window.scrollTo({ top: top + (total * (i + 0.5)) / projects.length, behavior: 'smooth' });
    };

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
        // Project 쇼케이스: 화면이 고정된 동안 스크롤 진행도로 몇 번째 프로젝트인지 결정
        const paintShowcase = () => {
            const el = showcaseRef.current;
            if (!el || !el.offsetParent) return; // 모바일에선 숨김
            const r = el.getBoundingClientRect();
            const total = el.offsetHeight - window.innerHeight;
            const p = Math.min(0.999, Math.max(0, -r.top / total));
            setActiveProject(Math.floor(p * projects.length));
        };
        // Skill 가로 슬라이드: 칸마다 스크롤 구간을 넉넉히 주고, 구간마다 잠깐 멈췄다가 다음 칸으로 넘어감 (PC만)
        const paintSkillSlide = () => {
            const wrap = hscrollRef.current;
            const track = trackRef.current;
            if (!wrap || !track) return;
            if (window.innerWidth < 861) {
                // 모바일: 칸이 세로로 쌓이므로, 화면 가운데에 가장 가까운 칸을 선택
                wrap.style.height = '';
                track.style.transform = '';
                const mid = window.innerHeight / 2;
                let best = 0;
                let bestGap = Infinity;
                Array.from(track.children).forEach((el, i) => {
                    const r = el.getBoundingClientRect();
                    const gap = Math.abs(r.top + r.height / 2 - mid);
                    if (gap < bestGap) {
                        bestGap = gap;
                        best = i;
                    }
                });
                setActiveTile(best);
                return;
            }
            const n = skills.length;
            const vh = window.innerHeight;
            const perTile = vh * 0.8; // 칸 하나에 스크롤 0.8화면
            const total = perTile * (n - 1);
            const endHold = perTile * 0.8; // 마지막 칸도 충분히 보여주고 넘어가도록 여유 구간
            wrap.style.height = `${vh + total + endHold}px`;
            const p = Math.min(1, Math.max(0, -wrap.getBoundingClientRect().top / total));
            // 구간 앞뒤 30%는 멈춤, 가운데 40%에서만 부드럽게 이동
            const s = p * (n - 1);
            const i = Math.min(n - 2, Math.floor(s));
            const f = Math.min(1, Math.max(0, (s - i - 0.3) / 0.4));
            const eased = f * f * (3 - 2 * f);
            const pos = i + eased; // 0 ~ n-1
            const dist = Math.max(0, track.scrollWidth - track.clientWidth);
            track.style.transform = `translateX(${(-pos / (n - 1)) * dist}px)`;
            setActiveTile(Math.round(pos));
        };

        // [C] 첫 화면 카드: 스크롤 진행도(0→1)에 따라 여백·모서리가 줄어 화면 가득
        const paintHeroCard = () => {
            const wrap = heroWrapRef.current;
            const card = heroCardRef.current;
            if (!wrap || !card) return;
            const total = wrap.offsetHeight - window.innerHeight;
            const p = Math.min(1, Math.max(0, window.scrollY / total));
            const k = 1 - p;
            const side = window.innerWidth < 861 ? 10 : 24;
            card.style.inset = `${k * 92}px ${k * side}px ${k * side}px`;
            card.style.borderRadius = `${k * 40}px`;
        };
        const onScroll = () => {
            setScrolled(window.scrollY > 24);
            if (!frame)
                frame = requestAnimationFrame(() => {
                    paintLines();
                    paintShowcase();
                    paintHeroCard();
                    paintSkillSlide();
                });
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
            <Cursor />
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

            {/* [C] 첫 화면: 둥근 핑크 카드가 스크롤하면 화면 가득 커짐 */}
            <div className="hero-wrap" ref={heroWrapRef}>
                <div className="hero-pin">
                    <div className="hero-card" ref={heroCardRef} aria-hidden />
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
                </div>
            </div>

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
                <p className="label reveal">01 About</p>
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
                {/* PC: 화면을 고정하고 세로 스크롤만큼 칸들이 가로로 지나감 */}
                <div className="hscroll" ref={hscrollRef}>
                    <div className="hpin">
                <p className="label reveal">02 Skill</p>
                <div className={`bento a${activeTile}`} ref={trackRef}>
                    {skills.map((g, i) => (
                        <div
                            className={`tile reveal t${i}`}
                            data-on={activeTile === i}
                            key={g.title}
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
                    </div>
                </div>
            </section>

            <section className="section" id="project">
                <p className="label reveal">03 Project</p>

                {/* PC: 화면을 고정하고 스크롤하면 프로젝트가 하나씩 펼쳐짐 */}
                <div className="showcase" ref={showcaseRef} style={{ height: `${projects.length * 70 + 40}vh` }}>
                    <div className="stage">
                        <ol className="sc-list">
                            {projects.map((p, i) => (
                                <li key={p.title} className={i === activeProject ? 'on' : ''}>
                                    <button className="sc-head" onClick={() => goProject(i)}>
                                        <span className="work-no">{String(i + 1).padStart(2, '0')}</span>
                                        <h3>
                                            {p.title}
                                            {p.live && <span className="live">운영 중</span>}
                                        </h3>
                                        <span className="period">{p.period}</span>
                                    </button>
                                    <div className="sc-body">
                                        <div className="sc-body-inner">
                                            <p className="work-summary">{p.summary}</p>
                                            {p.points.length > 0 && (
                                                <ul className="work-points">
                                                    {p.points.map((pt) => (
                                                        <li key={pt}>{pt}</li>
                                                    ))}
                                                </ul>
                                            )}
                                            <div className="sc-foot">
                                                <div className="tags">
                                                    {p.stack.map((s) => (
                                                        <span key={s}>{s}</span>
                                                    ))}
                                                </div>
                                                {p.link && (
                                                    <a className="sc-link" href={p.link} target="_blank" rel="noreferrer">
                                                        보러 가기 <FiArrowUpRight />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ol>
                        <div className="sc-preview" aria-hidden>
                            {projects.map((p, i) => (
                                <div key={p.title} className={`sc-shot ${i === activeProject ? 'on' : ''}`}>
                                    {p.shots ? (
                                        <div className="sc-phones">
                                            {p.shots.map((src) => (
                                                <img key={src} src={src} alt="" loading="lazy" />
                                            ))}
                                        </div>
                                    ) : p.image ? (
                                        <img src={p.image} alt="" loading="lazy" className={p.fit === 'contain' ? 'contain' : ''} />
                                    ) : (
                                        <div className="sc-ph">
                                            <em>{p.title}</em>
                                            <span>{p.stack.join(' · ')}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                            <span className="sc-count">
                                {String(activeProject + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 모바일: 기존 목록 */}
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
                                    {(p.image || p.shots) && (
                                        <div className="work-thumb" aria-hidden>
                                            {p.shots ? (
                                                <div className="sc-phones">
                                                    {p.shots.map((src) => (
                                                        <img key={src} src={src} alt="" loading="lazy" />
                                                    ))}
                                                </div>
                                            ) : (
                                                <img src={p.image} alt="" loading="lazy" className={p.fit === 'contain' ? 'contain' : ''} />
                                            )}
                                        </div>
                                    )}
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
                <div
                    className="contact reveal"
                    onMouseMove={(e) => {
                        const box = e.currentTarget.getBoundingClientRect();
                        e.currentTarget.style.setProperty('--mx', `${e.clientX - box.left}px`);
                        e.currentTarget.style.setProperty('--my', `${e.clientY - box.top}px`);
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.removeProperty('--mx');
                        e.currentTarget.style.removeProperty('--my');
                    }}
                >
                    <p className="label light">04 Contact</p>
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
                <a className="credit" href="https://www.flaticon.com/free-icon/ribbon_2357692" target="_blank" rel="noreferrer">
                    Ribbon icon from Flaticon
                </a>
                <a href="#top">Back to top ↑</a>
            </footer>
        </div>
    );
}

export default Home;
