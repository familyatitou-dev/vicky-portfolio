#!/usr/bin/env python3
"""Generate Vicky's portfolio PDF with clickable links and embedded images."""

import os, json, sys
from pathlib import Path
from urllib.parse import quote

# Fix Windows GBK encoding issues
sys.stdout.reconfigure(encoding='utf-8')

from fpdf import FPDF
from PIL import Image

# ── Paths ──────────────────────────────────────────────
BASE = Path(r'c:\Users\DELL\Desktop\个人网站\jack-portfolio')
PORTFOLIO_DIR = BASE / 'public' / 'portfolio'
MANIFEST_PATH = PORTFOLIO_DIR / 'manifest.json'
OUTPUT_DIR = BASE / 'docs'
OUTPUT = OUTPUT_DIR / 'Vicky_作品集.pdf'
DESKTOP_OUT = Path(r'c:\Users\DELL\Desktop') / 'Vicky_作品集.pdf'
TEMP_DIR = BASE / 'scripts' / '.pdf_temp'

# Max image dimension for PDF embedding (reduces file size dramatically)
MAX_IMG_W = 900  # pixels — good quality at A4 print size

# Online base for video/link URLs
GITHUB_BASE = 'https://familyatitou-dev.github.io/vicky-portfolio/'

# ── Color Palette (warm) ───────────────────────────────
C_BG      = (255, 250, 245)   # warm cream page bg
C_DARK    = (74,  48,  48)    # dark brown text
C_ACCENT  = (232, 120, 90)    # warm coral accent
C_ACCENT2 = (212, 149, 107)   # warm tan
C_CARD    = (255, 240, 232)   # light warm card
C_CARD2   = (245, 230, 220)   # alt card
C_WHITE   = (255, 255, 255)
C_LINE    = (237, 213, 200)   # warm divider
C_MUTED   = (155, 123, 123)   # muted text
C_DARK_BG = (30,  20,  20)    # cover dark bg
C_VIDEO   = (100, 80,  140)   # video card accent

# ── Fonts ──────────────────────────────────────────────
FONT_CN = r'C:/Windows/Fonts/msyh.ttc'   # 微软雅黑
FONT_BOLD = r'C:/Windows/Fonts/msyhbd.ttc'  # 微软雅黑粗体

# ── Data ───────────────────────────────────────────────
manifest = json.loads(MANIFEST_PATH.read_text(encoding='utf-8'))

# Portfolio structure
SECTIONS = [
    {
        'title': '一、新媒体运营作品集',
        'categories': [
            {'label': '账号运营', 'count': '×5', 'type': 'image', 'tab': 'newmedia',
             'items': ['小红书', '抖音 ①', '抖音 ②', '抖音 ③', '抖音 ④']},
            {'label': '口播剪辑', 'count': '×5', 'type': 'video', 'tab': 'newmedia',
             'items': ['口播作品 ①', '口播作品 ②', '口播作品 ③', '口播作品 ④', '口播作品 ⑤']},
            {'label': '混剪作品', 'count': '×5', 'type': 'video', 'tab': 'newmedia',
             'items': ['混剪作品 ①', '混剪作品 ②', '混剪作品 ③', '混剪作品 ④', '混剪作品 ⑤']},
            {'label': 'AI视频', 'count': '×4', 'type': 'video', 'tab': 'newmedia',
             'items': ['AI视频 ①', 'AI视频 ②', 'AI视频 ③', 'AI视频 ④']},
        ]
    },
    {
        'title': '二、AI创作作品集',
        'categories': [
            {'label': '海报设计', 'count': '×10', 'type': 'image', 'tab': 'ai',
             'items': [f'海报 {i}' for i in ['①','②','③','④','⑤','⑥','⑦','⑧','⑨','⑩']]},
            {'label': '网页制作', 'count': '×2', 'type': 'link', 'tab': 'ai',
             'items': ['网页链接 ①', '网页链接 ②']},
            {'label': 'AI商业视频', 'count': '×2', 'type': 'video', 'tab': 'ai',
             'items': ['AI商业视频 ①', 'AI商业视频 ②']},
            {'label': 'Skill搭建', 'count': '×2', 'type': 'link', 'tab': 'ai',
             'items': ['Skill链接 ①', 'Skill链接 ②']},
        ]
    },
]

def get_storage_key(tab, label, idx):
    """Build storage key matching the React app pattern: {tab}-{categoryLabel}-{index}"""
    return f"{tab}-{label}-{idx}"

def get_link_key(label, idx):
    """Link keys in manifest: vicky-link-ai-{label}-{idx}"""
    return f"vicky-link-ai-{label}-{idx}"

def find_local_file(tab, label, idx):
    """Check if file exists locally and return path."""
    key = get_storage_key(tab, label, idx)
    if key in manifest.get('files', {}):
        rel = manifest['files'][key]
        p = PORTFOLIO_DIR / os.path.basename(rel)
        if p.exists():
            return p
    return None

def resized_for_pdf(src_path):
    """Resize image to MAX_IMG_W wide, save to temp dir. Returns temp path."""
    TEMP_DIR.mkdir(parents=True, exist_ok=True)
    dst = TEMP_DIR / src_path.name
    if dst.exists():
        return dst  # already resized
    img = Image.open(src_path)
    w, h = img.size
    if w <= MAX_IMG_W:
        img.save(str(dst), quality=85, optimize=True)
    else:
        ratio = MAX_IMG_W / w
        new_h = int(h * ratio)
        img = img.resize((MAX_IMG_W, new_h), Image.LANCZOS)
        img.save(str(dst), quality=85, optimize=True)
    return dst

def get_online_url(tab, label, idx):
    """Get the online URL for a video file."""
    key = get_storage_key(tab, label, idx)
    if key in manifest.get('files', {}):
        rel = manifest['files'][key]
        # URL-encode Chinese chars in filename
        fname = os.path.basename(rel)
        encoded = quote(fname)
        return GITHUB_BASE + 'portfolio/' + encoded
    return None

def get_link_info(label, idx):
    """Get link URL and description from manifest."""
    key = get_link_key(label, idx)
    if key in manifest.get('links', {}):
        info = manifest['links'][key]
        return info.get('url', ''), info.get('desc', '')
    return '', ''


class PortfolioPDF(FPDF):
    def __init__(self):
        super().__init__('P', 'mm', 'A4')
        self.set_auto_page_break(True, 15)
        # Register fonts
        if os.path.exists(FONT_CN):
            self.add_font('CN', '', FONT_CN, uni=True)
        if os.path.exists(FONT_BOLD):
            self.add_font('CNB', '', FONT_BOLD, uni=True)
        self.font_body = 'CN' if os.path.exists(FONT_CN) else 'Helvetica'
        self.font_bold = 'CNB' if os.path.exists(FONT_BOLD) else 'Helvetica'

    def _rgb(self, color):
        """Convert (R,G,B) tuple to PDF color."""
        return tuple(c / 255 for c in color)

    # ═══════════════════════════════════════════════════
    #  COVER PAGE
    # ═══════════════════════════════════════════════════
    def cover_page(self):
        self.add_page()
        # Dark background
        self.set_fill_color(*self._rgb(C_DARK_BG))
        self.rect(0, 0, 210, 297, 'F')

        # Accent bar
        self.set_fill_color(*self._rgb(C_ACCENT))
        self.rect(0, 100, 210, 2, 'F')

        # Title
        self.set_y(115)
        self.set_text_color(*self._rgb(C_WHITE))
        self.set_font(self.font_bold, '', 32)
        self.cell(0, 14, '邵燕琪 · Vicky', align='C', new_x='LMARGIN', new_y='NEXT')

        self.set_font(self.font_body, '', 18)
        self.set_text_color(*self._rgb(C_ACCENT2))
        self.cell(0, 10, 'Digital Creator', align='C', new_x='LMARGIN', new_y='NEXT')

        self.ln(6)
        self.set_font(self.font_body, '', 13)
        self.set_text_color(*self._rgb(C_MUTED))
        self.cell(0, 8, '新媒体运营 × AI创作', align='C', new_x='LMARGIN', new_y='NEXT')

        self.ln(10)
        # Accent bar
        self.set_fill_color(*self._rgb(C_ACCENT))
        self.rect(60, self.get_y(), 90, 1, 'F')

        self.ln(12)
        # Contact info
        self.set_font(self.font_body, '', 10)
        self.set_text_color(*self._rgb(C_MUTED))
        self.cell(0, 6, '微信: 19164002075  |  邮箱: 3378803115@qq.com', align='C', new_x='LMARGIN', new_y='NEXT')
        self.cell(0, 6, '网站: familyatitou-dev.github.io/vicky-portfolio', align='C', new_x='LMARGIN', new_y='NEXT')

        # QR code placeholder at bottom
        self.set_y(245)
        self.set_font(self.font_body, '', 9)
        self.set_text_color(*self._rgb(C_MUTED))
        self.cell(0, 5, '扫码查看完整作品集 →', align='C', new_x='LMARGIN', new_y='NEXT')

    # ═══════════════════════════════════════════════════
    #  ABOUT PAGE
    # ═══════════════════════════════════════════════════
    def about_page(self):
        self.add_page()
        self._section_header('关于我')

        self.set_font(self.font_body, '', 11)
        self.set_text_color(*self._rgb(C_DARK))

        # Info row
        info_text = (
            '邵燕琪，武汉理工大学资产评估硕士（2025-2028），Base 北京。\n\n'
            '数据驱动的新媒体运营人，专注抖音、小红书、快手平台的内容策略与流量增长。\n'
            '拥有蔚来汽车、去哪儿旅行、Shopee等头部互联网企业实习经历，\n'
            '擅长直播全链路运营、AI工具批量内容创作与自动化工作流搭建。'
        )
        self.multi_cell(0, 7, info_text, new_x='LMARGIN', new_y='NEXT')

        self.ln(6)
        # Stats
        stats = [('50+', '直播复盘'), ('18%', '转化提升'), ('10w+', '内容曝光'), ('100+', '订单转化')]
        col_w = 180 / 4
        self.set_fill_color(*self._rgb(C_CARD))
        for val, label in stats:
            x = self.get_x()
            self.set_font(self.font_bold, '', 20)
            self.set_text_color(*self._rgb(C_ACCENT))
            self.cell(col_w, 10, val, align='C', fill=True)
            self.set_xy(x, self.get_y() + 10)
            self.set_font(self.font_body, '', 9)
            self.set_text_color(*self._rgb(C_MUTED))
            self.cell(col_w, 5, label, align='C', fill=True)
            self.set_xy(x + col_w, self.get_y() - 10)

        self.ln(16)
        # Experience table
        self._subsection('实习经历')
        experiences = [
            ('2026.03-08', '蔚来汽车', '新媒体（直播）运营', '抖音账号运营、直播控场、AI素材批量产出'),
            ('2025.11-2026.03', '去哪儿旅行', '直播运营', '50+场复盘、SOP搭建、转化率+18%、GMV+22%'),
            ('2024.04-11', '福坦威贸易', '跨境电商运营', 'Shopee从0到1、点击率+20%、转化率2.1%→3.5%'),
        ]
        self._table(['时间', '公司', '岗位', '核心成果'], experiences, [28, 28, 38, 86])

    # ═══════════════════════════════════════════════════
    #  PORTFOLIO SECTION
    # ═══════════════════════════════════════════════════
    def portfolio_section(self, section):
        self.add_page()
        self._section_header(section['title'])

        for cat in section['categories']:
            self._category_block(cat)

    def _category_block(self, cat):
        # Check if we need a new page (rough estimate: 50mm per image row)
        if self.get_y() > 220:
            self.add_page()

        self._subsection(f"{cat['label']}  {cat['count']}")

        items = cat['items']
        tab = cat['tab']
        label = cat['label']
        typ = cat['type']

        if typ == 'link':
            # Link cards — display in a list
            for idx in range(len(items)):
                url, desc = get_link_info(label, idx)
                if self.get_y() > 260:
                    self.add_page()
                self._link_card(items[idx].get('label', f'链接{idx+1}') if isinstance(items[idx], dict) else items[idx], url, desc)
        elif typ == 'image':
            # Image grid — 2 columns
            self._image_grid(tab, label, items)
        elif typ == 'video':
            # Video cards — 2 columns
            self._video_grid(tab, label, items)

        self.ln(3)

    def _image_grid(self, tab, label, items):
        """2-column image grid."""
        col_w = 85
        gap = 8
        img_h = 120  # 9:16 aspect: 85 * 16/9 ≈ 151, but we cap at 120mm

        for i, item in enumerate(items):
            col = i % 2
            row_start_y = self.get_y() if col == 0 else self.get_y()
            x = 17 + col * (col_w + gap)

            item_label = item.get('label', f'{i+1}') if isinstance(item, dict) else item

            local_path = find_local_file(tab, label, i)

            # Draw card background
            self.set_fill_color(*self._rgb(C_CARD))
            card_y = self.get_y()
            self.set_xy(x, card_y)
            # We'll fill after knowing the image height

            if local_path and local_path.exists():
                try:
                    # Use resized copy to keep PDF size small
                    pdf_path = resized_for_pdf(local_path)
                    img = Image.open(pdf_path)
                    img_w, img_h_px = img.size
                    ratio = img_h_px / img_w
                    display_h = min(col_w * ratio, img_h)
                    display_w = col_w if ratio <= (img_h/col_w) else img_h / ratio

                    # Center image in card
                    img_x = x + (col_w - display_w) / 2

                    # Card background
                    self.set_fill_color(*self._rgb(C_CARD))
                    self.set_xy(x, card_y)
                    self.rect(x, card_y, col_w, display_h + 10, 'F')

                    # Embed resized image
                    self.image(str(pdf_path), x=img_x, y=card_y + 3, w=display_w, h=display_h)

                    # Label below
                    self.set_xy(x, card_y + display_h + 4)
                    self.set_font(self.font_body, '', 8)
                    self.set_text_color(*self._rgb(C_MUTED))
                    self.cell(col_w, 5, item_label, align='C')

                    if col == 0:
                        self.set_xy(17, card_y + display_h + 12)
                    else:
                        self.set_xy(17, card_y + display_h + 12)
                        # Don't advance Y yet, will be set on next row

                    # For 2-column layout, advance Y after every 2 items
                    if col == 1 or i == len(items) - 1:
                        self.set_xy(17, card_y + display_h + 14)

                except Exception as e:
                    self._fallback_card(x, card_y, col_w, img_h, item_label, 'image', str(e))
            else:
                self._fallback_card(x, card_y, col_w, img_h, item_label, 'image')

            if col == 0 and i < len(items) - 1:
                # Stay on same row for next item
                self.set_xy(17, row_start_y)

        # After grid, ensure proper spacing
        self.ln(6)

    def _video_grid(self, tab, label, items):
        """2-column video cards with clickable links."""
        col_w = 85
        gap = 8
        card_h = 45

        for i, item in enumerate(items):
            col = i % 2
            x = 17 + col * (col_w + gap)

            item_label = item.get('label', f'{i+1}') if isinstance(item, dict) else item

            if col == 0:
                row_y = self.get_y()

            if self.get_y() > 265:
                self.add_page()
                x = 17 + col * (col_w + gap)
                if col == 0:
                    row_y = self.get_y()

            y = self.get_y() if col == 0 else row_y
            self.set_xy(x, y)

            # Card background
            self.set_fill_color(*self._rgb(C_CARD))
            self.rect(x, y, col_w, card_h, 'F')

            # Left accent bar
            self.set_fill_color(*self._rgb(C_ACCENT2))
            self.rect(x, y, 3, card_h, 'F')

            # Play icon
            self.set_font(self.font_body, '', 14)
            self.set_text_color(*self._rgb(C_ACCENT))
            self.set_xy(x + 12, y + 7)
            self.cell(8, 8, '>')

            # Label
            self.set_font(self.font_bold, '', 11)
            self.set_text_color(*self._rgb(C_DARK))
            self.set_xy(x + 22, y + 8)
            self.cell(col_w - 30, 7, item_label)

            # Online link
            online_url = get_online_url(tab, label, i)
            if online_url:
                self.set_font(self.font_body, '', 8)
                self.set_text_color(*self._rgb(C_ACCENT))
                self.set_xy(x + 12, y + 28)
                # Clickable link — fpdf2 supports link parameter
                self.cell(col_w - 20, 5, '[点击在线观看]', link=online_url)

            if col == 1 or i == len(items) - 1:
                self.set_xy(17, y + card_h + 4)
            else:
                self.set_xy(17, row_y)

        self.ln(4)

    def _link_card(self, name, url, desc):
        """A single link card."""
        col_w = 180
        card_h = 30

        if self.get_y() > 265:
            self.add_page()

        y = self.get_y()
        x = self.get_x()

        # Card background
        self.set_fill_color(*self._rgb(C_CARD))
        self.rect(x, y, col_w, card_h, 'F')

        # Accent bar
        self.set_fill_color(*self._rgb(C_ACCENT))
        self.rect(x, y, 3, card_h, 'F')

        # Name and description
        self.set_font(self.font_bold, '', 11)
        self.set_text_color(*self._rgb(C_DARK))
        self.set_xy(x + 12, y + 4)
        display_name = name if isinstance(name, str) else name.get('label', '')
        self.cell(col_w - 20, 6, f'{display_name}: {desc[:60] if desc else "点击查看"}')

        # Link
        clean_url = url.split(' ')[-1] if url.startswith('/') or url.startswith('.') else url
        if clean_url and clean_url.startswith('http'):
            display_url = clean_url[:70] + ('...' if len(clean_url) > 70 else '')
            self.set_font(self.font_body, '', 8)
            self.set_text_color(*self._rgb(C_ACCENT))
            self.set_xy(x + 12, y + 16)
            self.cell(col_w - 20, 5, display_url, link=clean_url)

        self.set_xy(17, y + card_h + 4)

    def _fallback_card(self, x, y, w, h, label, typ, reason=''):
        """Placeholder card when image is unavailable."""
        self.set_fill_color(*self._rgb(C_CARD2))
        self.rect(x, y, w, h, 'F')

        self.set_font(self.font_body, '', 9)
        self.set_text_color(*self._rgb(C_MUTED))
        self.set_xy(x + 5, y + h/2 - 5)
        icon = '[img]' if typ == 'image' else '[vid]'
        self.cell(w - 10, 10, f'{icon} {label}', align='C')

    # ═══════════════════════════════════════════════════
    #  SKILLS PAGE
    # ═══════════════════════════════════════════════════
    def skills_page(self):
        self.add_page()
        self._section_header('专业技能')

        skills = [
            ('01', '新媒体运营', '抖音、小红书、快手全周期账号管理与内容策略'),
            ('02', '直播运营管理', '端到端直播运营：筹备 → 执行 → 复盘 → 优化'),
            ('03', 'AI内容创作', 'AI工具批量制作、文案生成、Agent/Workflow搭建'),
            ('04', '数据分析', 'Python + SQL 数据驱动决策与增长策略'),
            ('05', '品牌叙事', '短视频、直播、跨平台整合传播'),
        ]

        self._table(['序号', '技能', '说明'], skills, [15, 40, 125])

    # ═══════════════════════════════════════════════════
    #  CONTACT PAGE
    # ═══════════════════════════════════════════════════
    def contact_page(self):
        self.add_page()
        self._section_header('联系方式')

        self.set_font(self.font_body, '', 12)
        self.set_text_color(*self._rgb(C_DARK))

        contacts = [
            ('微信', '19164002075'),
            ('邮箱', '3378803115@qq.com'),
            ('网站', 'familyatitou-dev.github.io/vicky-portfolio'),
        ]

        for label, value in contacts:
            self.set_font(self.font_bold, '', 12)
            self.set_text_color(*self._rgb(C_ACCENT))
            self.cell(20, 10, label + '：')
            self.set_font(self.font_body, '', 12)
            self.set_text_color(*self._rgb(C_DARK))
            if label == '网站':
                self.cell(0, 10, value, link='https://' + value, new_x='LMARGIN', new_y='NEXT')
            else:
                self.cell(0, 10, value, new_x='LMARGIN', new_y='NEXT')
            self.ln(4)

        self.ln(10)
        self.set_font(self.font_body, '', 10)
        self.set_text_color(*self._rgb(C_MUTED))
        self.cell(0, 6, '完整作品集请访问网站，支持视频在线播放与交互体验', align='C', new_x='LMARGIN', new_y='NEXT')

    # ═══════════════════════════════════════════════════
    #  HELPERS
    # ═══════════════════════════════════════════════════
    def _section_header(self, title):
        """Large section title."""
        self.set_fill_color(*self._rgb(C_ACCENT))
        self.set_font(self.font_bold, '', 24)
        self.set_text_color(*self._rgb(C_DARK))
        self.cell(0, 12, title, new_x='LMARGIN', new_y='NEXT')
        # Accent line
        self.set_fill_color(*self._rgb(C_ACCENT))
        self.rect(17, self.get_y() + 1, 40, 2, 'F')
        self.ln(8)

    def _subsection(self, title):
        """Category sub-header."""
        self.set_font(self.font_bold, '', 14)
        self.set_text_color(*self._rgb(C_ACCENT))
        self.cell(0, 8, title, new_x='LMARGIN', new_y='NEXT')
        self.ln(4)

    def _table(self, headers, rows, col_widths):
        """Simple table with header row."""
        x0 = 17
        # Header
        self.set_fill_color(*self._rgb(C_ACCENT))
        self.set_text_color(*self._rgb(C_WHITE))
        self.set_font(self.font_bold, '', 10)
        for j, (h, w) in enumerate(zip(headers, col_widths)):
            self.cell(w, 8, h, border=0, fill=True, align='C')
        self.ln()

        # Rows
        for i, row in enumerate(rows):
            bg = C_CARD if i % 2 == 0 else C_WHITE
            self.set_fill_color(*self._rgb(bg))
            self.set_text_color(*self._rgb(C_DARK))
            self.set_font(self.font_body, '', 9)
            for j, (cell, w) in enumerate(zip(row, col_widths)):
                align = 'C' if j == 0 else 'L'
                self.cell(w, 7, str(cell), border=0, fill=True, align=align)
            self.ln()


# ═══════════════════════════════════════════════════
#  MAIN
# ═══════════════════════════════════════════════════
def main():
    pdf = PortfolioPDF()
    pdf.set_margin(15)

    # Cover
    pdf.cover_page()

    # About
    pdf.about_page()

    # Skills
    pdf.skills_page()

    # Portfolio sections
    for section in SECTIONS:
        pdf.portfolio_section(section)

    # Contact
    pdf.contact_page()

    # Save
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    pdf.output(str(OUTPUT))
    pdf.output(str(DESKTOP_OUT))

    # Cleanup temp files
    import shutil
    if TEMP_DIR.exists():
        shutil.rmtree(TEMP_DIR)

    print(f'OK PDF saved to: {OUTPUT}')
    print(f'OK PDF saved to: {DESKTOP_OUT}')
    print(f'   Pages: {pdf.pages_count}')

if __name__ == '__main__':
    main()
