import { useState, useRef, useEffect } from 'react';
import FadeIn from './FadeIn';
import { saveUpload, loadUpload, removeUpload, exportAll } from '../utils/storage';

// Pre-loaded portfolio files — deployed with the site, works cross-device
let preloadCache: { files: Record<string, string>; links: Record<string, { url: string; desc: string }> } | null = null;
async function getPreload(): Promise<typeof preloadCache> {
  if (preloadCache) return preloadCache;
  try {
    const res = await fetch(import.meta.env.BASE_URL + 'portfolio/manifest.json');
    if (res.ok) {
      preloadCache = await res.json();
      return preloadCache;
    }
  } catch {}
  return null;
}
function getPreloadedFile(key: string): string | null {
  if (!preloadCache?.files[key]) return null;
  return import.meta.env.BASE_URL + preloadCache.files[key];
}
function getPreloadedLink(key: string): { url: string; desc: string } | null {
  if (!preloadCache?.links[key]) return null;
  return preloadCache.links[key];
}

interface PortfolioItem {
  label: string;
  count: string;
  type: 'image' | 'video' | 'link';
  aspect?: string;
  items?: { label?: string }[];
}

const NEW_MEDIA_ITEMS: PortfolioItem[] = [
  { label: '账号运营', count: '×5', type: 'image',
    items: [{ label: '小红书' },{ label: '抖音 ①' },{ label: '抖音 ②' },{ label: '抖音 ③' },{ label: '抖音 ④' }] },
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
  { label: '网页制作', count: '×2', type: 'link', aspect: '16/9',
    items: [{ label: '网页链接 ①' }, { label: '网页链接 ②' }] },
  { label: 'AI商业视频', count: '×2', type: 'video',
    items: [{ label: 'AI商业视频 ①' },{ label: 'AI商业视频 ②' }] },
  { label: 'Skill搭建', count: '×2', type: 'link', aspect: '16/9', items: [{ label: 'Skill链接 ①' }, { label: 'Skill链接 ②' }] },
];

const LINK_PREFIX = 'vicky-link-';

function PlaceholderCard({
  label,
  type,
  storageKey,
  aspect = '9/16',
  editable = false,
}: {
  label: string;
  type: 'image' | 'video' | 'link';
  storageKey: string;
  aspect?: string;
  editable?: boolean;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkDesc, setLinkDesc] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load from storage on mount — preloaded files first
  useEffect(() => {
    if (type === 'link') {
      // Check preloaded first
      const preload = getPreloadedLink(storageKey);
      if (preload) {
        setLinkUrl(preload.url);
        setLinkDesc(preload.desc);
        setLoading(false);
        return;
      }
      // Fallback to localStorage
      const saved = localStorage.getItem(LINK_PREFIX + storageKey);
      if (saved) {
        try {
          const data = JSON.parse(saved);
          setLinkUrl(data.url || '');
          setLinkDesc(data.desc || '');
        } catch {
          setLinkUrl(saved);
        }
      }
      setLoading(false);
    } else {
      // Check preloaded first
      const preloadUrl = getPreloadedFile(storageKey);
      if (preloadUrl) {
        setPreview(preloadUrl);
        setLoading(false);
        return;
      }
      // Fallback to IndexedDB
      loadUpload(storageKey).then((data) => {
        if (data) setPreview(data);
      }).finally(() => setLoading(false));
    }
  }, [storageKey, type]);

  const handleClick = () => {
    if (!editable) return;
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
      setLinkDesc('');
      localStorage.removeItem(LINK_PREFIX + storageKey);
    } else {
      setPreview(null);
      await removeUpload(storageKey);
    }
  };

  const handleLinkSave = () => {
    if (linkUrl.trim()) {
      localStorage.setItem(LINK_PREFIX + storageKey, JSON.stringify({
        url: linkUrl.trim(),
        desc: linkDesc.trim(),
      }));
      setShowLinkInput(false);
    }
  };

  const handleLinkRemove = () => {
    setLinkUrl('');
    setLinkDesc('');
    localStorage.removeItem(LINK_PREFIX + storageKey);
  };

  const icons: Record<string, string> = {
    image: '🖼',
    video: '🎬',
    link: '🔗',
  };

  return (
    <>
      {editable && (
        <input
          ref={fileInputRef}
          type="file"
          accept={type === 'image' ? 'image/*' : 'video/*'}
          className="hidden"
          onChange={handleFileChange}
        />
      )}

      <div
        onClick={handleClick}
        className="rounded-2xl sm:rounded-3xl border
          flex flex-col items-center justify-center gap-2
          hover:border-[#D7E2EA]/30 transition-colors duration-300
          group relative overflow-hidden"
        style={{
            aspectRatio: aspect,
            background: type === 'link'
              ? 'linear-gradient(135deg, #2a1a30, #1a1525)'
              : 'linear-gradient(135deg, #1a1a1a, #0C0C0C)',
            borderColor: type === 'link' ? 'rgba(182,0,168,0.3)' : 'rgba(215,226,234,0.1)',
            cursor: editable ? 'pointer' : 'default',
          }}
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
            {editable && (
              <button
                onClick={handleRemove}
                className="absolute top-2 right-2 bg-black/70 text-white/70
                  text-xs px-2 py-1 rounded-full hover:bg-red-700/80
                  transition-colors"
              >
                删除
              </button>
            )}
          </>
        ) : linkUrl ? (
          <div className="flex flex-col items-center justify-between h-full p-3 sm:p-4">
            <div className="flex-1 flex flex-col items-center justify-center gap-1">
              <span className="text-lg">🔗</span>
              <a
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D7E2EA] text-xs sm:text-sm font-medium hover:text-[#B600A8] transition-colors break-all text-center underline leading-tight"
              >
                {linkUrl.length > 32 ? linkUrl.slice(0, 32) + '...' : linkUrl}
              </a>
              {linkDesc && (
                <p className="text-[#D7E2EA]/40 text-[10px] sm:text-xs text-center leading-snug mt-1 line-clamp-3">
                  {linkDesc}
                </p>
              )}
            </div>
            {editable && (
              <div className="flex gap-3 mt-auto pt-2">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowLinkInput(true); }}
                  className="text-[#D7E2EA]/50 text-[10px] hover:text-[#D7E2EA] transition-colors"
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
            )}
          </div>
        ) : type === 'link' ? (
          editable ? (
            <div className="flex flex-col items-center justify-center gap-2 p-3">
              <span className="text-lg sm:text-xl opacity-50">🔗</span>
              <span className="text-[#D7E2EA]/50 text-xs sm:text-sm tracking-wider text-center">
                {label}
              </span>
              <span className="text-[#D7E2EA]/20 text-[10px] tracking-wider text-center">
                {label.includes('网页') ? '粘贴链接地址' : '粘贴 Skill 链接'}
              </span>
              <span className="text-[#D7E2EA]/15 text-[10px] tracking-widest uppercase mt-1">
                点击添加
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 p-3">
              <span className="text-lg sm:text-xl opacity-30">🔗</span>
              <span className="text-[#D7E2EA]/30 text-xs sm:text-sm tracking-wider text-center">
                暂未添加
              </span>
            </div>
          )
        ) : (
          editable ? (
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
          ) : (
            <span className="text-[#D7E2EA]/25 text-xs tracking-wider">—</span>
          )
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
            />
            <textarea
              value={linkDesc}
              onChange={(e) => setLinkDesc(e.target.value)}
              placeholder="添加说明介绍（选填）..."
              rows={3}
              className="w-full mt-3 bg-[#0C0C0C] border border-[#D7E2EA]/20 rounded-xl
                px-4 py-3 text-[#D7E2EA] text-sm outline-none resize-none
                focus:border-[#B600A8]/50 transition-colors
                placeholder:text-[#D7E2EA]/30"
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
  editable,
}: {
  title: string;
  subtitle: string;
  items: PortfolioItem[];
  tabKey: string;
  editable: boolean;
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
                aspect={item.aspect}
                editable={editable}
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
  const [exporting, setExporting] = useState(false);
  const editable = window.location.search.includes('edit');

  // Preload manifest on mount
  useEffect(() => { getPreload(); }, []);

  const handleExport = async () => {
    setExporting(true);
    try {
      const indexDBData = await exportAll();
      const linkData: Record<string, string | null> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('vicky-link-')) {
          linkData[key] = localStorage.getItem(key);
        }
      }
      const fullExport = { indexDB: indexDBData, links: linkData, exportedAt: new Date().toISOString() };
      const blob = new Blob([JSON.stringify(fullExport, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'vicky-portfolio-backup.json';
      a.click();
      URL.revokeObjectURL(url);
      alert('导出成功！把下载的 JSON 文件发给我，我帮你放到项目里。');
    } catch (e) {
      alert('导出失败：' + e);
    }
    setExporting(false);
  };

  const tabs = [
    { key: 'newmedia' as const, label: '新媒体运营', sub: '短视频 · 直播 · 账号矩阵' },
    { key: 'ai' as const, label: 'AI创作', sub: '海报 · 视频 · 工具搭建' },
  ];

  return (
    <section
      id="projects"
      className="bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 relative z-10 px-5 sm:px-8 md:px-10 pt-16 sm:pt-20 md:pt-24"
    >
      <div className="flex items-center justify-center gap-4 mb-8 sm:mb-12 flex-wrap">
        <h2
          className="hero-heading font-black uppercase leading-none tracking-tight text-center"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          作品集
        </h2>
        {editable && (
          <button
            onClick={handleExport}
            disabled={exporting}
            className="rounded-full border border-[#B600A8]/40 text-[#B600A8]/70
              px-4 py-2 text-xs tracking-wider
              hover:bg-[#B600A8]/10 hover:text-[#B600A8]
              transition-colors cursor-pointer disabled:opacity-30"
          >
            {exporting ? '导出中...' : '📦 导出数据'}
          </button>
        )}
      </div>

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
        <p className="text-[#D7E2EA]/15 text-[10px] sm:text-xs tracking-wide mt-3">
          {editable
            ? '💡 编辑模式：上传内容保存在当前浏览器，刷新不丢失'
            : '💡 分享模式 · 只读 — 添加 ?edit 到网址末尾即可编辑'}
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
              editable={editable}
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
              editable={editable}
            />
          </FadeIn>
        )}
      </div>

      <div className="h-[20vh]" />
    </section>
  );
}
