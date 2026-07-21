const pptxgen = require("pptxgenjs");
const path = require("path");
const fs = require("fs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "邵燕琪 (Vicky)";
pres.title = "Vicky · Digital Creator — 作品集";

// Warm color palette
const C = {
  bg:      "FFFAF5",  // warm cream
  dark:    "4A3030",  // warm dark brown
  text:    "4A3030",  // dark text
  muted:   "9B7B7B",  // warm taupe
  accent:  "E8785A",  // warm coral
  accent2: "D4956B",  // warm peach
  card:    "FFF0E8",  // warm card bg
  card2:   "F5E6DC",  // warm card alt
  white:   "FFFFFF",
  line:    "EDD5C8",  // warm border
};

const FONT = "Calibri";
const FB = "Arial Black";
const BASE = path.join(__dirname, "..", "public", "portfolio");

function addBar(s, color) {
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.04, fill: { color: color || C.accent } });
}

function addImg(s, file, x, y, w, h) {
  const fp = path.join(BASE, file);
  if (fs.existsSync(fp)) {
    try {
      s.addImage({ path: fp, x, y, w, h, sizing: { type: "cover", w, h } });
      return;
    } catch (e) {}
  }
  s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: C.card } });
  s.addText("待补充", { x, y, w, h, fontSize: 10, fontFace: FONT, color: C.muted, align: "center", valign: "middle" });
}

// ============ SLIDE 1: COVER ============
(() => {
  const s = pres.addSlide();
  s.background = { color: "FFF5EE" };
  // Decorative gradient-like shapes
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
  s.addShape(pres.shapes.OVAL, { x: 7.5, y: -1, w: 4, h: 4, fill: { color: C.card, transparency: 50 } });
  s.addShape(pres.shapes.OVAL, { x: -1, y: 3, w: 4, h: 4, fill: { color: C.card, transparency: 50 } });

  s.addText("邵燕琪 · Vicky", {
    x: 1, y: 1.3, w: 8, h: 1.2,
    fontSize: 46, fontFace: FB, color: C.dark, bold: true, align: "center", margin: 0,
  });
  s.addText("DIGITAL CREATOR", {
    x: 1, y: 2.4, w: 8, h: 0.6,
    fontSize: 18, fontFace: FONT, color: C.accent, align: "center", charSpacing: 6, margin: 0,
  });
  s.addShape(pres.shapes.RECTANGLE, { x: 3.5, y: 3.2, w: 3, h: 0.025, fill: { color: C.accent2 } });
  s.addText("新媒体运营 × AI创作 作品集", {
    x: 1, y: 3.5, w: 8, h: 0.6,
    fontSize: 15, fontFace: FONT, color: C.muted, align: "center", margin: 0,
  });
  s.addText("微信 19164002075  |  3378803115@qq.com  |  Base 北京", {
    x: 1.5, y: 4.8, w: 7, h: 0.4,
    fontSize: 10, fontFace: FONT, color: C.muted, align: "center", margin: 0,
  });
})();

// ============ SLIDE 2: ABOUT ============
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addBar(s);

  s.addText("关于我", { x: 0.8, y: 0.5, w: 8.4, h: 0.8, fontSize: 32, fontFace: FB, color: C.dark, bold: true, margin: 0 });
  s.addText([
    { text: "邵燕琪，武汉理工大学资产评估硕士，Base 北京。", options: { breakLine: true, fontSize: 16, color: C.dark } },
    { text: "", options: { breakLine: true, fontSize: 6 } },
    { text: "数据驱动的新媒体运营人，专注抖音、小红书、快手平台的内容策略与流量增长。", options: { breakLine: true, fontSize: 14, color: C.muted } },
    { text: "蔚来汽车 · 去哪儿旅行 · Shopee，擅长直播全链路运营与AI自动化工作流搭建。", options: { breakLine: true, fontSize: 14, color: C.muted } },
    { text: "", options: { breakLine: true, fontSize: 6 } },
    { text: "坚信好内容 + 好数据 = 好增长，用创意与技术为品牌赋能。", options: { fontSize: 14, color: C.muted } },
  ], { x: 0.8, y: 1.6, w: 5, h: 3.5, fontFace: FONT, valign: "top", margin: 0 });

  const stats = [{ n: "50+", l: "直播复盘" }, { n: "18%", l: "转化提升" }, { n: "10w+", l: "内容曝光" }, { n: "100+", l: "订单转化" }];
  stats.forEach((st, i) => {
    const rx = 6.2 + (i % 2) * 1.8, ry = 1.6 + Math.floor(i / 2) * 1.9;
    s.addShape(pres.shapes.RECTANGLE, { x: rx, y: ry, w: 1.5, h: 1.5, fill: { color: C.card } });
    s.addText(st.n, { x: rx, y: ry, w: 1.5, h: 0.9, fontSize: 28, fontFace: FB, color: C.accent, bold: true, align: "center", valign: "bottom", margin: 0 });
    s.addText(st.l, { x: rx, y: ry + 0.85, w: 1.5, h: 0.5, fontSize: 11, fontFace: FONT, color: C.muted, align: "center", valign: "top", margin: 0 });
  });

  // Experience
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.6, w: 8.4, h: 0.8, fill: { color: C.card } });
  const exp = [
    { text: "蔚来汽车  |  新媒体运营  |  2026.03-08", options: { breakLine: true, fontSize: 11, color: C.dark } },
    { text: "去哪儿旅行  |  直播运营    |  2025.11-2026.03", options: { breakLine: true, fontSize: 11, color: C.dark } },
    { text: "Shopee     |  跨境电商    |  2024.04-11", options: { fontSize: 11, color: C.dark } },
  ];
  s.addText(exp, { x: 1.2, y: 4.6, w: 7.6, h: 0.8, fontFace: FONT, valign: "middle", margin: 0 });
})();

// ============ SLIDE 3: 账号运营 (with actual images) ============
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addBar(s);
  s.addText("账号运营 ×5", { x: 0.8, y: 0.35, w: 8.4, h: 0.55, fontSize: 26, fontFace: FB, color: C.dark, bold: true, margin: 0 });
  s.addText("小红书 ×1  +  抖音 ×4", { x: 0.8, y: 0.82, w: 8.4, h: 0.3, fontSize: 12, fontFace: FONT, color: C.muted, margin: 0 });

  const fileMap = {
    "小红书": "newmedia-账号运营-0.png",
    "抖音 ①": "newmedia-账号运营-1.jpg",
    "抖音 ②": "newmedia-账号运营-2.jpg",
    "抖音 ③": "newmedia-账号运营-3.jpg",
    "抖音 ④": "newmedia-账号运营-4.jpg",
  };
  const labels = Object.keys(fileMap);
  const cols = 5, gap = 0.1, mx = 0.5, iw = (9 - (cols - 1) * gap) / cols;
  labels.forEach((l, i) => {
    const x = mx + i * (iw + gap);
    addImg(s, fileMap[l], x, 1.3, iw, iw * (16 / 9));
    s.addText(l, { x, y: 1.3 + iw * (16 / 9) + 0.04, w: iw, h: 0.25, fontSize: 8, fontFace: FONT, color: C.muted, align: "center", margin: 0 });
  });
})();

// ============ SLIDE 4: 口播剪辑 ============
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addBar(s);
  s.addText("口播剪辑 ×5", { x: 0.8, y: 0.35, w: 8.4, h: 0.55, fontSize: 26, fontFace: FB, color: C.dark, bold: true, margin: 0 });
  s.addText("品牌口播脚本创作与专业剪辑", { x: 0.8, y: 0.82, w: 8.4, h: 0.3, fontSize: 12, fontFace: FONT, color: C.muted, margin: 0 });

  const cols = 5, gap = 0.1, mx = 0.5, iw = (9 - (cols - 1) * gap) / cols;
  for (let i = 0; i < 5; i++) {
    const x = mx + i * (iw + gap);
    s.addShape(pres.shapes.RECTANGLE, { x, y: 1.3, w: iw, h: iw * (9 / 16), fill: { color: C.card } });
    s.addText("🎬", { x, y: 1.3, w: iw, h: iw * (9 / 16), fontSize: 20, fontFace: FONT, align: "center", valign: "middle", color: C.accent2 });
    s.addText(`口播 ${i + 1}`, { x, y: 1.3 + iw * (9 / 16) + 0.04, w: iw, h: 0.25, fontSize: 8, fontFace: FONT, color: C.muted, align: "center", margin: 0 });
  }
})();

// ============ SLIDE 5: 混剪作品 ============
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addBar(s);
  s.addText("混剪作品 ×5", { x: 0.8, y: 0.35, w: 8.4, h: 0.55, fontSize: 26, fontFace: FB, color: C.dark, bold: true, margin: 0 });
  s.addText("创意混剪，节奏感与画面叙事", { x: 0.8, y: 0.82, w: 8.4, h: 0.3, fontSize: 12, fontFace: FONT, color: C.muted, margin: 0 });

  const cols = 5, gap = 0.1, mx = 0.5, iw = (9 - (cols - 1) * gap) / cols;
  for (let i = 0; i < 5; i++) {
    const x = mx + i * (iw + gap);
    s.addShape(pres.shapes.RECTANGLE, { x, y: 1.3, w: iw, h: iw * (9 / 16), fill: { color: C.card2 } });
    s.addText("🎬", { x, y: 1.3, w: iw, h: iw * (9 / 16), fontSize: 20, fontFace: FONT, align: "center", valign: "middle", color: C.accent });
    s.addText(`混剪 ${i + 1}`, { x, y: 1.3 + iw * (9 / 16) + 0.04, w: iw, h: 0.25, fontSize: 8, fontFace: FONT, color: C.muted, align: "center", margin: 0 });
  }
})();

// ============ SLIDE 6: AI视频 ============
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addBar(s);
  s.addText("AI视频 ×4", { x: 0.8, y: 0.35, w: 8.4, h: 0.55, fontSize: 26, fontFace: FB, color: C.dark, bold: true, margin: 0 });
  s.addText("AI辅助视频创作，高效内容产出", { x: 0.8, y: 0.82, w: 8.4, h: 0.3, fontSize: 12, fontFace: FONT, color: C.muted, margin: 0 });

  const cols = 4, gap = 0.15, mx = 0.8, iw = (8.4 - (cols - 1) * gap) / cols;
  for (let i = 0; i < 4; i++) {
    const x = mx + i * (iw + gap);
    s.addShape(pres.shapes.RECTANGLE, { x, y: 1.3, w: iw, h: iw * (9 / 16), fill: { color: C.card } });
    s.addText("🎬", { x, y: 1.3, w: iw, h: iw * (9 / 16), fontSize: 22, fontFace: FONT, align: "center", valign: "middle", color: C.accent2 });
    s.addText(`AI视频 ${i + 1}`, { x, y: 1.3 + iw * (9 / 16) + 0.04, w: iw, h: 0.25, fontSize: 8, fontFace: FONT, color: C.muted, align: "center", margin: 0 });
  }
})();

// ============ SLIDE 7: 海报设计 1/2 ============
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addBar(s);
  s.addText("海报设计 1/2", { x: 0.8, y: 0.3, w: 8.4, h: 0.5, fontSize: 24, fontFace: FB, color: C.dark, bold: true, margin: 0 });
  s.addText("AI生成商业海报 · 多风格多场景", { x: 0.8, y: 0.7, w: 8.4, h: 0.28, fontSize: 11, fontFace: FONT, color: C.muted, margin: 0 });

  const cols = 5, gap = 0.08, mx = 0.5, iw = (9 - (cols - 1) * gap) / cols;
  for (let i = 0; i < 5; i++) {
    const x = mx + i * (iw + gap);
    addImg(s, `ai-海报设计-${i}.png`, x, 1.15, iw, iw * (9 / 16));
  }
})();

// ============ SLIDE 8: 海报设计 2/2 ============
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addBar(s);
  s.addText("海报设计 2/2", { x: 0.8, y: 0.3, w: 8.4, h: 0.5, fontSize: 24, fontFace: FB, color: C.dark, bold: true, margin: 0 });
  s.addText("AI生成商业海报 · 多风格多场景", { x: 0.8, y: 0.7, w: 8.4, h: 0.28, fontSize: 11, fontFace: FONT, color: C.muted, margin: 0 });

  const cols = 5, gap = 0.08, mx = 0.5, iw = (9 - (cols - 1) * gap) / cols;
  for (let i = 5; i < 10; i++) {
    const x = mx + (i - 5) * (iw + gap);
    addImg(s, `ai-海报设计-${i}.png`, x, 1.15, iw, iw * (9 / 16));
  }
})();

// ============ SLIDE 9: 网页 + 商业视频 + Skill ============
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addBar(s);

  // AI 商业视频
  s.addText("AI商业视频 ×2", { x: 0.8, y: 0.5, w: 4, h: 0.35, fontSize: 16, fontFace: FB, color: C.dark, bold: true, margin: 0 });
  for (let i = 0; i < 2; i++) {
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8 + i * 2.1, y: 1.0, w: 1.9, h: 1.3, fill: { color: C.card } });
    s.addText(`🎬 商业视频 ${i + 1}`, { x: 0.8 + i * 2.1, y: 1.0, w: 1.9, h: 1.3, fontSize: 11, fontFace: FONT, color: C.accent2, align: "center", valign: "middle" });
  }

  // 网页制作
  s.addText("网页制作 ×2", { x: 5.5, y: 0.5, w: 4, h: 0.35, fontSize: 16, fontFace: FB, color: C.dark, bold: true, margin: 0 });
  const webs = [
    { name: "日本旅行攻略站", url: "whimsical-macaron-eb27fb.netlify.app", desc: "沉浸式日本旅游攻略体验" },
    { name: "午餐盲盒创意站", url: "loquacious-tanuki-66c3c4.netlify.app", desc: "趣味午餐盲盒交互网站" },
  ];
  webs.forEach((w, i) => {
    s.addShape(pres.shapes.RECTANGLE, { x: 5.5, y: 1.0 + i * 2.0, w: 4, h: 0.8, fill: { color: C.card } });
    s.addText(w.name, { x: 5.7, y: 1.0 + i * 2.0, w: 3.6, h: 0.42, fontSize: 13, fontFace: FONT, color: C.dark, bold: true, valign: "bottom", margin: 0 });
    s.addText(w.url, { x: 5.7, y: 1.0 + i * 2.0 + 0.38, w: 3.6, h: 0.4, fontSize: 9, fontFace: FONT, color: C.muted, valign: "top", margin: 0 });
  });

  // Skill
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 3.0, w: 8.4, h: 0.02, fill: { color: C.line } });
  s.addText("Skill 搭建 ×2", { x: 0.8, y: 3.2, w: 4, h: 0.35, fontSize: 16, fontFace: FB, color: C.dark, bold: true, margin: 0 });
  const skills = [
    { name: "个人网站搭建 Skill", desc: "从简历到部署的一键建站工作流" },
    { name: "视频分析 Skill", desc: "抖音视频数据拆解与分析自动化" },
  ];
  skills.forEach((sk, i) => {
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8 + i * 4.3, y: 3.7, w: 4, h: 0.7, fill: { color: C.card } });
    s.addText(sk.name, { x: 1.0 + i * 4.3, y: 3.7, w: 3.6, h: 0.38, fontSize: 13, fontFace: FONT, color: C.accent, bold: true, valign: "bottom", margin: 0 });
    s.addText(sk.desc, { x: 1.0 + i * 4.3, y: 3.7 + 0.36, w: 3.6, h: 0.3, fontSize: 10, fontFace: FONT, color: C.muted, valign: "top", margin: 0 });
  });
})();

// ============ SLIDE 10: CONTACT ============
(() => {
  const s = pres.addSlide();
  s.background = { color: "FFF5EE" };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
  s.addShape(pres.shapes.OVAL, { x: 7.5, y: 3, w: 5, h: 5, fill: { color: C.card, transparency: 60 } });

  s.addText("联系我", { x: 1, y: 1.0, w: 8, h: 0.8, fontSize: 34, fontFace: FB, color: C.dark, bold: true, align: "center", margin: 0 });

  const contacts = [
    { l: "微信", v: "19164002075" },
    { l: "邮箱", v: "3378803115@qq.com" },
    { l: "网站", v: "familyatitou-dev.github.io/vicky-portfolio" },
    { l: "城市", v: "北京" },
  ];
  contacts.forEach((c, i) => {
    const y = 2.1 + i * 0.65;
    s.addShape(pres.shapes.RECTANGLE, { x: 2.2, y, w: 5.6, h: 0.5, fill: { color: C.white } });
    s.addText(c.l, { x: 2.5, y, w: 1.2, h: 0.5, fontSize: 13, fontFace: FONT, color: C.accent, bold: true, valign: "middle", margin: 0 });
    s.addText(c.v, { x: 3.7, y, w: 3.9, h: 0.5, fontSize: 13, fontFace: FONT, color: C.dark, valign: "middle", margin: 0 });
  });

  s.addText("期待与您合作！", { x: 1, y: 4.8, w: 8, h: 0.5, fontSize: 14, fontFace: FONT, color: C.muted, align: "center", margin: 0 });
})();

// Save
const outPath = path.join(__dirname, "..", "Vicky_作品集_v2.pptx");
pres.writeFile({ fileName: outPath }).then(() => {
  console.log("PPT saved: " + outPath);
}).catch((err) => {
  console.error("Error:", err);
});
