# Vicky 个人网站 — Digital Creator Portfolio

## 技术栈
React 18 + TypeScript + Tailwind CSS 3.4 + Framer Motion + Lucide React
构建工具：Vite | 部署：GitHub Pages (docs/ 目录)

## 项目结构
```
src/components/
├── HeroSection.tsx        # 导航 + 标题 + 人物照片（CSS暗黑特效）
├── MarqueeSection.tsx     # 技能标签云滚动
├── AboutSection.tsx       # 关于我 + 数据看板
├── ServicesSection.tsx    # 专业技能（5项）
├── ProjectsSection.tsx    # 作品集 Tab切换（新媒体/AI）
├── FadeIn.tsx             # 滚动入场动画
├── Magnet.tsx             # 鼠标跟随磁吸
├── ContactButton.tsx      # 微信弹窗联系
├── LiveProjectButton.tsx  # 查看详情按钮
├── AnimatedText.tsx       # 逐字滚动渐显
src/utils/
└── storage.ts             # IndexedDB + localStorage 持久化
```

## 作品集上传
- 图片/视频 → IndexedDB（base64），刷新不丢失
- 链接 → localStorage
- 存储key格式：`{tabKey}-{categoryLabel}-{index}`

## 部署
1. `npm run build` → 输出到 docs/
2. `git push` → GitHub Pages 自动部署
3. 网址：https://familyatitou-dev.github.io/vicky-portfolio/

## Skills
- `/build-personal-website` — 从简历到上线的完整建站流程
