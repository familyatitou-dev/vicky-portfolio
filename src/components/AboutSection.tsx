import FadeIn from './FadeIn';
import ContactButton from './ContactButton';

const DECOR_IMAGES = [
  {
    src: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png',
    className:
      'w-[120px] sm:w-[160px] md:w-[210px] top-[4%] left-[1%] sm:left-[2%] md:left-[4%]',
    delay: 0.1,
    x: -80,
    y: 0,
  },
  {
    src: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png',
    className:
      'w-[100px] sm:w-[140px] md:w-[180px] bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%]',
    delay: 0.25,
    x: -80,
    y: 0,
  },
  {
    src: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png',
    className:
      'w-[120px] sm:w-[160px] md:w-[210px] top-[4%] right-[1%] sm:right-[2%] md:right-[4%]',
    delay: 0.15,
    x: 80,
    y: 0,
  },
  {
    src: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png',
    className:
      'w-[130px] sm:w-[170px] md:w-[220px] bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%]',
    delay: 0.3,
    x: 80,
    y: 0,
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="relative min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-20 overflow-hidden">
      {/* Decorative corner images */}
      {DECOR_IMAGES.map((img, i) => (
        <FadeIn
          key={i}
          delay={img.delay}
          x={img.x}
          y={img.y}
          duration={0.9}
          className={`absolute ${img.className}`}
        >
          <img src={img.src} alt="" className="w-full h-auto" />
        </FadeIn>
      ))}

      {/* Heading */}
      <FadeIn delay={0} y={40}>
        <h2
          className="hero-heading font-black uppercase leading-none tracking-tight text-center"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          关于我
        </h2>
      </FadeIn>

      {/* Simple self-intro */}
      <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16 mt-8 sm:mt-12">
        <FadeIn delay={0.2} y={30}>
          <div className="flex flex-col gap-8 sm:gap-10 text-center max-w-[600px]">
            {/* Info row */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3
              text-[#D7E2EA] font-light tracking-wide"
              style={{ fontSize: 'clamp(0.9rem, 1.6vw, 1.15rem)' }}>
              <span>邵燕琪 · Vicky</span>
              <span className="text-[#D7E2EA]/30">|</span>
              <span>武汉理工大学 · 资产评估硕士</span>
              <span className="text-[#D7E2EA]/30">|</span>
              <span>Base 北京</span>
            </div>

            {/* Bio paragraph */}
            <p className="text-[#D7E2EA]/80 font-light leading-relaxed"
              style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.3rem)' }}>
              数据驱动的新媒体运营人，专注于抖音、小红书、快手平台的内容策略与流量增长。
              拥有蔚来汽车、去哪儿旅行等头部互联网企业实习经历，
              擅长直播全链路运营、AI工具批量内容创作与自动化工作流搭建。
              坚信好内容 + 好数据 = 好增长，致力于用创意与技术为品牌赋能。
            </p>

            {/* Quick highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
              {[
                { num: '50+', label: '直播复盘' },
                { num: '18%', label: '转化提升' },
                { num: '10w+', label: '内容曝光' },
                { num: '100+', label: '订单转化' },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col items-center gap-1">
                  <span className="hero-heading font-black leading-none"
                    style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
                    {stat.num}
                  </span>
                  <span className="text-[#D7E2EA]/50 text-xs tracking-wider uppercase">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.4} y={20}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
}
