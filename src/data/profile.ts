// 포트폴리오 내용은 이 파일에서만 고치면 됩니다.

export const profile = {
    name: '김훈정',
    nameEn: 'Hoonjeong Kim',
    role: 'Frontend Developer',
    // 초안 문구 — 확정 전
    tagline: '기획부터 화면까지, 직접 만들어 현장에 닿게 하는\n프론트엔드 개발자입니다.',
    typed: ['Frontend Developer', 'React · TypeScript', '기획하는 개발자'],
    email: 'hxont.dev@gmail.com',
    github: 'https://github.com/hxont',
    velog: 'https://velog.io/@hxont/posts',
};

// 초안 문구 — 확정 전
export const about = [
    '항상 사용자의 입장에서 문제를 바라봅니다.',
    '필요하면 기획도, 디자인도, 운영도 직접 해서 끝까지 완성합니다.',
    '반복되는 일은 AI로 자동화해, 사람이 더 중요한 일에 집중하게 만듭니다.',
];

export type TimelineItem = { period: string; title: string; desc: string };

export const timeline: TimelineItem[] = [
    { period: '2025.11 ~', title: '예이린 사회적협동조합 · AI돌봄혁신본부 주임', desc: '홈페이지 개발 · PM · 기획/디자인 · 업무 자동화' },
    { period: '2024.09 ~ 2025.01', title: 'JLK · SI 기업', desc: '통합 모니터링 시스템 웹 디자인 기획 · 프론트엔드 개발' },
    { period: '2022.03 ~ 2026.02', title: '인제대학교 컴퓨터공학과', desc: '졸업 · 복수전공 USG 융합전공 스마트제조ICT' },
];

export type SkillGroup = { title: string; items: string[] };

export const skills: SkillGroup[] = [
    { title: 'Frontend', items: ['React', 'TypeScript', 'Next.js', 'JavaScript', 'HTML / CSS', 'Git', 'Vercel'] },
    { title: 'PM', items: ['요구사항 정리', '이슈 관리', 'QA', '개발사 협업', 'Notion', 'Slack'] },
    { title: 'Planning & Design', items: ['UI/UX 설계', '서비스 기획', '포스터', '행사 총괄', 'Figma'] },
    { title: 'AX & DX', items: ['Claude Code', 'ChatGPT', '업무 자동화', 'DB 구축'] },
];

export type Project = {
    title: string;
    period: string;
    summary: string;
    points: string[];
    stack: string[];
    link?: string;
    live?: boolean; // 운영 중 표시
    image?: string; // Project 미리보기 이미지 (public/projects)
    shots?: string[]; // 앱 화면 여러 장 (휴대폰 화면처럼 나란히)
    fit?: 'contain'; // 이미지를 잘리지 않게 전체 보이기
};

// 내부 업무 플랫폼 화면·리니어 내용은 넣지 않음
export const projects: Project[] = [
    {
        title: '공식 홈페이지',
        live: true,
        image: '/projects/home.jpg',
        period: '2025.11 ~',
        summary: '예이린 사회적협동조합 공식 홈페이지 개발 및 운영',
        points: [],
        stack: ['Next.js', 'TypeScript', 'HTML/CSS'],
        link: 'https://yeirin.com',
    },
    {
        title: '럭키드로우 룰렛',
        live: true,
        image: '/projects/roulette.jpg',
        period: '2026.09',
        summary: '2026 대한민국 사회서비스 박람회 부스에서 사용',
        points: [
            'Canvas + requestAnimationFrame으로 회전 애니메이션 구현',
            '효과음, 결과 기록(localStorage), 반응형 화면',
        ],
        stack: ['JavaScript', 'Canvas API', 'CSS'],
        link: 'https://plobi-luckydraw.vercel.app',
    },
    {
        title: '불꽃놀이 멍',
        live: true,
        image: '/projects/fireworks.jpg',
        period: '2026.11',
        summary: '광안리, 여의도에서 사람들과 함께 즐기는 불꽃놀이 멍 플랫폼',
        points: [
            'three.js로 3D 해변·한강공원과 불꽃 구현, 모바일은 조이스틱으로 이동',
            'WebSocket으로 자리 앉기·접속자 위치를 실시간 동기화, 시계 기준으로 모두 같은 쇼 감상',
            'Web Audio API로 음원 파일 없이 소리 생성, 거리에 따라 늦고 작게 들리는 입체 사운드',
        ],
        stack: ['TypeScript', 'three.js', 'WebSocket', 'Web Audio API'],
        link: 'https://fireworks-mung.vercel.app',
    },
    {
        title: '통합 모니터링 시스템',
        image: '/projects/monitor.jpg',
        period: '2024.09 ~ 2025.01',
        summary: '통합 모니터링 시스템 · 웹/앱 기획 · 디자인 · 프론트엔드 개발',
        points: [
            '반응형 · 웹뷰 기반 앱 개발',
        ],
        stack: ['React', 'Figma', 'Responsive'],
    },
    {
        title: 'Pilly',
        shots: ['/projects/pilly1.jpg', '/projects/pilly2.jpg', '/projects/pilly3.jpg'],
        period: '2025.01 ~ 2025.05',
        summary: '주기적으로 복약하는 사람들에게 편의성을 제공하는 앱',
        points: ['기획 · 디자인 · 프론트엔드 개발', '복약 푸시 알림, OCR 처방전 인식, AI 부작용 예측 화면'],
        stack: ['React Native', 'JavaScript', 'Figma'],
        link: 'https://github.com/hxont/pilly',
    },
    {
        title: 'Nutri Plan',
        image: '/projects/nutri.jpg',
        fit: 'contain',
        period: '2024.09 ~ 2024.12',
        summary: '식단과 운동 관리를 체계적으로 도와주는 앱',
        points: ['기획 · 디자인 · 프론트엔드 개발', '식단 분석·피드백, 위치 기반 운동 장소 추천 화면', 'AI 챗봇 맞춤 식단·운동 추천 화면', '성과 발표회 참여'],
        stack: ['React Native', 'JavaScript', 'Figma'],
    },
    {
        title: 'Deepfocus',
        shots: ['/projects/deep1.jpg', '/projects/deep2.jpg', '/projects/deep3.jpg'],
        period: '2024.06 ~ 2024.09',
        summary: '독서 활동에 깊은 집중을 할 수 있도록 도움을 주고, 체계적으로 기록할 수 있는 앱',
        points: ['기획 · 디자인 · 프론트엔드 개발', '도서 검색, 독서 타이머, 독서 메모, 독서 나무(리포트) 화면'],
        stack: ['React Native', 'JavaScript', 'Figma'],
    },
];
