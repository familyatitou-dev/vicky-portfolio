import { useEffect, useRef, useState } from 'react';

const TAG_ROWS = [
  // Row 1 — AI & 自动化
  [
    'AI Agent',
    'Workflow 搭建',
    'Skill 开发',
    'AI 视频生成',
    'AI 文案创作',
    '批量内容产出',
    'Vibe Coding',
    '自动化工具',
    'Prompt 工程',
  ],
  // Row 2 — 平台
  [
    '抖音运营',
    '小红书运营',
    '快手运营',
    'Shopee',
    '直播带货',
    '短视频策划',
    '账号矩阵',
    '跨境电商',
  ],
  // Row 3 — 核心能力
  [
    '数据分析',
    'Python',
    'SQL',
    '流量增长',
    '用户转化',
    '内容策略',
    '竞品调研',
    '复盘优化',
    'SOP 搭建',
    '爆款逻辑',
  ],
  // Row 4 — 创意工具
  [
    '剪映',
    'Photoshop',
    '口播脚本',
    '视频剪辑',
    '海报设计',
    '混剪创作',
    'PPT 设计',
    '品牌视觉',
  ],
];

function TagPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-5 py-2.5 sm:px-7 sm:py-3
      rounded-full border border-[#D7E2EA]/15
      text-[#D7E2EA]/70 font-light tracking-wider
      whitespace-nowrap flex-shrink-0
      hover:border-[#B600A8]/40 hover:text-[#D7E2EA]
      hover:shadow-[0_0_20px_rgba(182,0,168,0.15)]
      transition-all duration-400 cursor-default"
      style={{ fontSize: 'clamp(0.75rem, 1.2vw, 0.95rem)' }}>
      {label}
    </span>
  );
}

function MarqueeRow({
  tags,
  direction,
  speed,
  offset,
}: {
  tags: string[];
  direction: 'right' | 'left';
  speed: number;
  offset: number;
}) {
  const tripled = [...tags, ...tags, ...tags, ...tags];

  const translateX = direction === 'right'
    ? offset * speed
    : -offset * speed;

  return (
    <div
      className="flex gap-3 sm:gap-4"
      style={{
        transform: `translateX(${translateX}px)`,
        willChange: 'transform',
      }}
    >
      {tripled.map((tag, i) => (
        <TagPill key={i} label={tag} />
      ))}
    </div>
  );
}

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const sectionTop = sectionRef.current.offsetTop;
      const val = (window.scrollY - sectionTop + window.innerHeight) * 0.2;
      setScrollOffset(val);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const speeds = [0.5, 0.6, 0.45, 0.55];
  const directions: ('right' | 'left')[] = ['right', 'left', 'right', 'left'];

  return (
    <section
      ref={sectionRef}
      className="bg-[#0C0C0C] pt-20 sm:pt-28 md:pt-36 pb-8 overflow-hidden"
    >
      <div className="flex flex-col gap-3 sm:gap-4">
        {TAG_ROWS.map((row, i) => (
          <MarqueeRow
            key={i}
            tags={row}
            direction={directions[i]}
            speed={speeds[i]}
            offset={scrollOffset}
          />
        ))}
      </div>
    </section>
  );
}
