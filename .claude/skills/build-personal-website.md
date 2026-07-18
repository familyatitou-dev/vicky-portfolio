---
name: build-personal-website
description: Build a dark-theme personal portfolio website from a resume. Covers discovery, framework design, content adaptation, visual customization, component building, and deployment. Trigger when the user wants to create a personal website, portfolio site, or resume website.
---

# Build Personal Website

Build a single-page dark-theme portfolio website from a user's resume, adapting the "3D Creator" template to their profession and personal brand.

## Process Overview

```
Discover → Design → Adapt → Build → Deploy
```

Each phase has mandatory checkpoints — do NOT skip a phase without user approval.

---

## Phase 1: Discover (必须)

### 1.1 Read the resume
- Extract text from PDF (use `pdftotext -layout` or Python `PyPDF2`)
- Identify: name, target role, education, experience, skills, portfolio items, contact info

### 1.2 Understand requirements
- Ask what kind of site they want (portfolio / resume / personal brand)
- Ask if they have visual references or style preferences
- Identify their "creative label" — e.g., "Digital Creator", "Content Strategist", "3D Artist"
- Ask what name/alias to use on the site (English name, nickname, etc.)

### 1.3 Portfolio inventory
Ask the user to list ALL portfolio items they want to showcase, organized by category:
- Images: screenshots, designs, photos
- Videos: clips, reels, demos
- Links: websites, mini-programs, tools

### Checkpoint 1
```
Summarize back to the user:
1. Name & creative label
2. Site structure proposal (5 sections)
3. Portfolio categories identified
→ Wait for confirmation before proceeding
```

---

## Phase 2: Framework Design

### 2.1 Site structure (standard 5-section layout)

| Section | Purpose | Content |
|---------|---------|---------|
| Hero | First impression | Name, title, portrait, CTA |
| Marquee | Visual energy | Skill tags / brand logos / work samples |
| About | Trust building | Brief intro, highlights, stats |
| Skills/Services | Capability showcase | Numbered list with descriptions |
| Projects | Proof of work | Portfolio cards with upload slots |

### 2.2 Navigation
- 4 links: 关于 / 技能 / 作品 / 联系
- Smooth scroll anchors: `#about`, `#skills`, `#projects`, `#contact`

### 2.3 Content adaptation rules
- Rewrite ALL text based on the user's actual background
- **Services → Skills**: Rename this section to match their profession. For designers: "Services", for operators: "专业技能", for developers: "技术栈"
- **Marquee choices**: Designers → work samples GIF; Operators → skill tag cloud; Developers → tech stack icons
- **About text**: Short (3-4 sentences) + data highlights (3-4 numbers)

### Checkpoint 2
```
Present the adapted framework with ALL Chinese/English text.
→ User must approve before any code is written
```

---

## Phase 3: Visual & Content Adaptation

### 3.1 Portrait strategy
- Ask for user's photo (prefer: modest clothing, good lighting, front-facing)
- Apply CSS dark-tech effects: rounded container, purple/pink glow ring, contrast + desaturation filter, gradient overlay
- Photo path: `import.meta.env.BASE_URL + 'photos/xxx.jpg'` (for subdirectory deployment)

### 3.2 Portfolio section design
Two approaches, choose based on user's content:

**Approach A: Tab switcher** (for many categories)
```
[新媒体运营] [AI创作]
├── Category header
│   ├── Sub-category (e.g., 口播剪辑 ×5)
│   │   ├── Placeholder card grid
```

**Approach B: Sticky cards** (for 3-5 featured projects with images)
```
01 ──────── Project Name
│  [image] [image]
│  [image]
```

### 3.3 Contact modal
- WeChat modal with copy-to-clipboard functionality
- Phone number or WeChat ID displayed prominently
- "已复制 ✓" feedback animation

### 3.4 Visual specifications
- Background: `#0C0C0C`
- Font: Kanit (Google Fonts, weights 300-900)
- Gradient text: `linear-gradient(180deg, #646973 0%, #BBCCD7 100%)` with `-webkit-background-clip: text`
- Accent gradient: `linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)`
- Text color: `#D7E2EA`

### Checkpoint 3
```
Show the user:
1. Their photo (with CSS effects preview if possible)
2. Portfolio structure with upload slot counts
3. About section text
→ Confirm all before building
```

---

## Phase 4: Build

### 4.1 Tech stack
```
React 18+ / TypeScript / Tailwind CSS 3.4 / Framer Motion / Lucide React
Vite as build tool
```

### 4.2 Project setup
```bash
npm create vite@latest <name> -- --template react-ts
cd <name>
npm install framer-motion lucide-react
npm install -D tailwindcss@^3.4 postcss autoprefixer
npx tailwindcss init -p
```

### 4.3 Component order (build in this sequence)
1. **Reusable components**: `FadeIn`, `Magnet`, `ContactButton`, `LiveProjectButton`, `AnimatedText`
2. **Section components**: `HeroSection` → `MarqueeSection` → `AboutSection` → `ServicesSection` → `ProjectsSection`
3. **Assembly**: `App.tsx` imports all sections in order

### 4.4 Key technical patterns

**FadeIn wrapper** (whileInView animation):
```tsx
const ref = useRef(null);
const isInView = useInView(ref, { once: true, margin: '50px', amount: 0 });
const Component = motion.create('div');
```

**Magnet effect** (mouse-follow):
```tsx
// Track mouse relative to element center
// Apply translate3d(distX/strength, distY/strength, 0)
// Smooth transition in (0.3s ease-out) and out (0.6s ease-in-out)
```

**IndexedDB persistence** (for portfolio uploads):
```tsx
// src/utils/storage.ts — openDB, saveUpload, loadUpload, removeUpload
// Images/videos: base64 → IndexedDB
// Links: localStorage
// Key format: `${tabKey}-${categoryLabel}-${index}`
```

**Asset paths for deployment**:
```tsx
// Always use BASE_URL for public/ assets
src={import.meta.env.BASE_URL + 'photos/avatar.jpg'}
```

### 4.5 vite.config.ts for deployment
```ts
export default defineConfig({
  plugins: [react()],
  base: './',
  build: { outDir: 'docs' },
})
```

### Checkpoint 4
```
1. npm run build passes
2. Local dev server works
3. User confirms all sections look correct
→ Proceed to deployment
```

---

## Phase 5: Deploy

### 5.1 GitHub Pages (recommended)
```bash
git init && git add -A && git commit -m "init"
# Create repo on github.com
git remote add origin git@github.com:<user>/<repo>.git
git branch -M main && git push -u origin main
```
Then: Settings → Pages → Branch: `main`, Folder: `/docs` → Save

### 5.2 SSH key setup (if needed)
```bash
ssh-keygen -t ed25519 -C "email"
# Add to https://github.com/settings/keys
ssh-keyscan github.com >> ~/.ssh/known_hosts
```

### 5.3 Post-deploy checklist
- [ ] Hero photo displays correctly
- [ ] All sections scroll correctly
- [ ] Contact modal opens
- [ ] Portfolio uploads persist on refresh
- [ ] Mobile responsive

### 5.4 Update workflow
```bash
npm run build
git add -A && git commit -m "update"
git push
# GitHub Pages auto-deploys in ~1 min
```

---

## Common Customizations

| User says | Do this |
|-----------|---------|
| "文案变成中文" | Translate all headings, descriptions, nav links to Chinese |
| "服务改成技能" | Rename section heading + nav link + section id |
| "作品集分两类" | Add tab switcher, split data into two arrays |
| "换一张照片" | Update `src` path in HeroSection, rebuild |
| "加更多占位" | Extend `items` array in portfolio data |
| "照片露肤度高" | Try other photos, let user pick |
| "上传后刷新没了" | Add IndexedDB persistence layer |

---

## Files Checklist

```
project/
├── index.html              # Google Fonts link (Kanit)
├── tailwind.config.js      # Content paths
├── vite.config.ts          # base: './', outDir: 'docs'
├── .gitignore              # node_modules, dist, .env
├── src/
│   ├── index.css           # Tailwind directives + global reset
│   ├── main.tsx            # ReactDOM render
│   ├── App.tsx             # Import & arrange all sections
│   ├── App.css             # DELETE — not needed
│   ├── utils/
│   │   └── storage.ts      # IndexedDB helpers
│   └── components/
│       ├── FadeIn.tsx       # whileInView wrapper
│       ├── Magnet.tsx       # Mouse-follow effect
│       ├── ContactButton.tsx # With WeChat modal
│       ├── LiveProjectButton.tsx
│       ├── AnimatedText.tsx  # Char-by-char scroll reveal
│       ├── HeroSection.tsx
│       ├── MarqueeSection.tsx
│       ├── AboutSection.tsx
│       ├── ServicesSection.tsx
│       └── ProjectsSection.tsx
└── public/
    └── photos/             # User photos & avatar
    └── projects/           # User project screenshots
```
