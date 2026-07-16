import FadeIn from './FadeIn';

const SERVICES = [
  {
    number: '01',
    name: '新媒体运营',
    description:
      '覆盖抖音、小红书、快手等主流平台的全周期账号管理与内容策略，从内容策划、流量获客到粉丝增长与互动优化，全方位提升品牌在社交媒体的影响力。',
  },
  {
    number: '02',
    name: '直播运营管理',
    description:
      '端到端直播运营服务，涵盖开播筹备、实时中控执行、数据监控与调整，以及下播后的多维复盘分析，持续优化转化率与用户留存，打造高转化直播间。',
  },
  {
    number: '03',
    name: 'AI内容创作',
    description:
      '熟练运用各类AI工具进行短视频批量制作、文案自动生成，可独立搭建AI Agent与自动化Workflow/Skill，大幅提升内容产出效率，降低运营人力成本。',
  },
  {
    number: '04',
    name: '数据分析',
    description:
      '基于Python与SQL的数据驱动决策，追踪核心KPI指标，分析用户行为模式，优化从内容到转化的全链路漏斗，将数据洞察转化为可落地的增长策略。',
  },
  {
    number: '05',
    name: '品牌叙事',
    description:
      '通过高质量的短视频内容、富有互动的直播体验和整合性的跨平台传播策略，为品牌打造一致的视觉语言与品牌故事，让品牌在目标用户心中留下深刻印象。',
  },
];

export default function ServicesSection() {
  return (
    <section
      id="skills"
      className="bg-[#FFFFFF] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px]
        px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
    >
      <h2
        className="text-[#0C0C0C] font-black uppercase text-center mb-16 sm:mb-20 md:mb-28"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        专业技能
      </h2>

      <div className="max-w-5xl mx-auto flex flex-col">
        {SERVICES.map((service, i) => (
          <FadeIn key={i} delay={i * 0.1} y={30}>
            <div
              className="flex items-start gap-6 sm:gap-10 md:gap-14
                py-8 sm:py-10 md:py-12
                border-b border-[rgba(12,12,12,0.15)]"
            >
              <span
                className="font-black text-[#0C0C0C] leading-none flex-shrink-0"
                style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
              >
                {service.number}
              </span>
              <div className="flex flex-col gap-2 sm:gap-3 pt-2 sm:pt-4">
                <h3
                  className="font-medium uppercase text-[#0C0C0C]"
                  style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
                >
                  {service.name}
                </h3>
                <p
                  className="font-light leading-relaxed max-w-2xl text-[#0C0C0C] opacity-60"
                  style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}
                >
                  {service.description}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
