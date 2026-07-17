import { useState, useRef, useEffect } from 'react';
import FadeIn from './FadeIn';
import { saveUpload, loadUpload, removeUpload } from '../utils/storage';

interface PortfolioItem {
  label: string;
  count: string;
  type: 'image' | 'video' | 'link';
  items?: { label?: string }[];
}

const NEW_MEDIA_ITEMS: PortfolioItem[] = [
  { label: '小红书账号', count: '×1', type: 'image', items: [{ label: '小红书主页截图' }] },
  { label: '抖音账号矩阵', count: '×4', type: 'image',
    items: [{ label: '抖音账号 ①' },{ label: '抖音账号 ②' },{ label: '抖音账号 ③' },{ label: '抖音账号 ④' }] },
  { label: '口播剪辑', count: '×5', type: 'video',
    items: [{ label: '口播作品 ①' },{ label: '口播作品 ②' },{ label: '口播作品 ③' },{ label: '口播作品 ④' },{ label: '口播作品 ⑤' }] },
  { label: '混剪作品', count: '×5', type: 'video',
    items: [{ label: '混剪作品 ①' },{ label: '混剪作品 ②' },{ label: '混剪作品 ③' },{ label: '混剪作品 ④' },{ label: '混剪作品 ⑤' }] },
  { label: 'AI视频', count: '×4', type: 'video',
    items: [{ label: 'AI视频 ①' },{ label: 'AI视频 ②' },{ label: 'AI视频 ③' },{ label: 'AI视频 ④' }] },
];

const AI_ITEMS: PortfolioItem[] = [
  { label: '海报设计', count: '×10', type: 'image',
    items: [{ label: '海报 ①' },{ label: '海报 ②' },{ label: '海报 ③' },{ label: '海报 ④' },{ label: '海报 ⑤' },{ label: '海报 ⑥' },{ label: '海报 ⑦' },{ label: '海报 ⑧' },{ label: '海报 ⑨' },{ label: '海报 ⑩' }] },
  { label: '网页制作', count: '×2', type: 'link',
    items: [{ label: '网页链接 ①' }, { label: '网页链接 ②' }] },
  { label: 'AI商业视频', count: '×2', type: 'video',
    items: [{ label: 'AI商业视频 ①' },{ label: 'AI商业视频 ②' }] },
  { label: '小程序', count: '×2', type: 'link',
    items: [{ label: '小程序链接 ①' }, { label: '小程序链接 ②' }] },
  { label: 'Skill搭建', count: '×1', type: 'link', items: [{ label: 'Skill链接' }] },
];

const LINK_PREFIX = 'vicky-link-';

function PlaceholderCard({
  label,
  type,
  storageKey,
}: {
  label: string;
  type: 'image' | 'video' | 'link';
  storageKey: string;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load from storage on mount
  useEffect(() => {
    if (type === 'link') {
      const saved = localStorage.getItem(LINK_PREFIX + storageKey);
      if (saved) setLinkUrl(saved);
    } else {
      loadUpload(storageKey).then((data) => {
        if (data) setPreview(data);
      }).finally(() => setLoading(false));
    }
    if (type === 'link') setLoading(false);
  }, [storageKey, type]);

  const handleClick = () => {
    if (type === 'link') {
      setShowLinkInput(true);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Convert to base64 for IndexedDB
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setPreview(dataUrl);
      await saveUpload(storageKey, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (type === 'link') {
      setLinkUrl('');
      localStorage.removeItem(LINK_PREFIX + storageKey);
    } else {
      setPreview(null);
      await removeUpload(storageKey);
    }
  };

  const handleLinkSave = () => {
    if (linkUrl.trim()) {
      localStorage.setItem(LINK_PREFIX + storageKey, linkUrl.trim());
      setShowLinkInput(false);
    }
  };

  const handleLinkRemove = () => {
    setLinkUrl('');
    localStorage.removeItem(LINK_PREFIX + storageKey);
  };

  const icons: Record<string, string> = {
    image: '🖼',
    video: '🎬',
    link: '🔗',
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={type === 'image' ? 'image/*' : 'video/*'}
        className="hidden"
        onChange={handleFileChange}
      />

      <div
        onClick={handleClick}
        className="aspect-[4/3] rounded-2xl sm:rounded-3xl
          bg-gradient-to-br from-[#1a1a1a] to-[#0C0C0C]
          border border-[#D7E2EA]/10
          flex flex-col items-center justify-center gap-2
          hover:border-[#D7E2EA]/30 transition-colors duration-300
          cursor-pointer group relative overflow-hidden"
      >
        {loading ? (
          <span className="text-[#D7E2EA]/30 text-xs">加载中...</span>
        ) : preview ? (
          <>
            {type === 'video' ? (
              <video src={preview} controls className="w-full h-full object-cover" />
            ) : (
              <img src={preview} alt={label} className="w-full h-full object-cover" />
            )}
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-black/70 text-white/70
                text-xs px-2 py-1 rounded-full hover:bg-red-700/80
                transition-colors"
            >
              删除
            </button>
          </>
        ) : linkUrl ? (
          <div className="flex flex-col items-center gap-2 p-4">
            <span className="text-[#B600A8] text-2xl">🔗</span>
            <a
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D7E2EA]/60 text-xs hover:text-[#B600A8] transition-colors break-all text-center underline"
            >
              {linkUrl.length > 40 ? linkUrl.slice(0, 40) + '...' : linkUrl}
            </a>
            <div className="flex gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); setShowLinkInput(true); }}
                className="text-[#D7E2EA]/40 text-[10px] hover:text-[#D7E2EA] transition-colors"
              >
                编辑
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleLinkRemove(); }}
                className="text-red-500/50 text-[10px] hover:text-red-400 transition-colors"
              >
                删除
              </button>
            </div>
          </div>
        ) : (
          <>
            <span className="text-2xl sm:text-3xl opacity-40 group-hover:opacity-60 transition-opacity">
              {icons[type]}
            </span>
            <span className="text-[#D7E2EA]/40 text-xs sm:text-sm tracking-wider
              group-hover:text-[#D7E2EA]/60 transition-colors">
              {label}
            </span>
            <span className="text-[#D7E2EA]/20 text-[10px] tracking-widest uppercase mt-1">
              点击上传
            </span>
          </>
        )}
      </div>

      {showLinkInput && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setShowLinkInput(false)}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#1a1a1a] border border-[#D7E2EA]/20
              rounded-2xl sm:rounded-3xl px-6 py-6 sm:px-8 sm:py-8
              max-w-md w-full shadow-2xl shadow-purple-900/30"
          >
            <h4 className="text-[#D7E2EA] font-medium tracking-wide mb-4">{label}</h4>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="粘贴链接地址..."
              className="w-full bg-[#0C0C0C] border border-[#D7E2EA]/20 rounded-xl
                px-4 py-3 text-[#D7E2EA] text-sm outline-none
                focus:border-[#B600A8]/50 transition-colors
                placeholder:text-[#D7E2EA]/30"
              autoFocus
              onKeyDown={(e) => { if (e.key === 'Enter') handleLinkSave(); }}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleLinkSave}
                className="flex-1 rounded-full bg-[#D7E2EA] text-[#0C0C0C]
                  py-2.5 text-sm font-medium tracking-wider
                  hover:opacity-90 transition-opacity"
              >
                保存
              </button>
              <button
                onClick={() => setShowLinkInput(false)}
                className="flex-1 rounded-full border border-[#D7E2EA]/20
                  text-[#D7E2EA]/60 py-2.5 text-sm tracking-wider
                  hover:text-[#D7E2EA] transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function PortfolioCategory({
  title,
  subtitle,
  items,
  tabKey,
}: {
  title: string;
  subtitle: string;
  items: PortfolioItem[];
  tabKey: string;
}) {
  return (
    <div className="mb-16 sm:mb-20 md:mb-24">
      <div className="mb-8 sm:mb-12">
        <h3 className="text-[#D7E2EA] font-black uppercase tracking-tight leading-none"
          style={{ fontSize: 'clamp(2rem, 6vw, 80px)' }}>
          {title}
        </h3>
        <p className="text-[#D7E2EA]/40 font-light tracking-wide mt-2"
          style={{ fontSize: 'clamp(0.8rem, 1.4vw, 1rem)' }}>
          {subtitle}
        </p>
      </div>

      {items.map((item, i) => (
        <div key={i} className="mb-10 sm:mb-14">
          <div className="flex items-baseline gap-2 mb-4 sm:mb-6">
            <h4 className="text-[#D7E2EA] font-medium tracking-wide"
              style={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)' }}>
              {item.label}
            </h4>
            <span className="text-[#D7E2EA]/30 font-light text-sm tracking-wider">
              {item.count}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {item.items?.map((sub, j) => (
              <PlaceholderCard
                key={j}
                label={sub.label || ''}
                type={item.type}
                storageKey={`${tabKey}-${item.label}-${j}`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProjectsSection() {
  const [activeTab, setActiveTab] = useState<'newmedia' | 'ai'>('newmedia');

  const tabs = [
    { key: 'newmedia' as const, label: '新媒体运营', sub: '短视频 · 直播 · 账号矩阵' },
    { key: 'ai' as const, label: 'AI创作', sub: '海报 · 视频 · 工具搭建' },
  ];

  return (
    <section
      id="projects"
      className="bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 relative z-10 px-5 sm:px-8 md:px-10 pt-16 sm:pt-20 md:pt-24"
    >
      <h2
        className="hero-heading font-black uppercase leading-none tracking-tight text-center mb-8 sm:mb-12"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        作品集
      </h2>

      <div className="flex justify-center mb-12 sm:mb-16">
        <div className="flex bg-[#1a1a1a] rounded-full p-1 gap-1 border border-[#D7E2EA]/10">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-full px-6 sm:px-10 py-3 sm:py-4
                text-sm sm:text-base font-medium tracking-wider
                transition-all duration-300 cursor-pointer
                ${activeTab === tab.key
                  ? 'bg-[#D7E2EA] text-[#0C0C0C]'
                  : 'text-[#D7E2EA]/50 hover:text-[#D7E2EA]/80'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="text-center mb-10 sm:mb-14">
        <p className="text-[#D7E2EA]/40 font-light tracking-wide"
          style={{ fontSize: 'clamp(0.8rem, 1.4vw, 1rem)' }}>
          {tabs.find((t) => t.key === activeTab)?.sub}
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        {activeTab === 'newmedia' && (
          <FadeIn delay={0} y={20} duration={0.5}>
            <PortfolioCategory
              title="新媒体运营"
              subtitle="账号运营 · 内容创作 · 流量增长"
              items={NEW_MEDIA_ITEMS}
              tabKey="newmedia"
            />
          </FadeIn>
        )}
        {activeTab === 'ai' && (
          <FadeIn delay={0} y={20} duration={0.5}>
            <PortfolioCategory
              title="AI创作"
              subtitle="智能工具 · 自动化 · 效率提升"
              items={AI_ITEMS}
              tabKey="ai"
            />
          </FadeIn>
        )}
      </div>

      <div className="h-[20vh]" />
    </section>
  );
}
