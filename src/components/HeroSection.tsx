import { useState } from 'react';
import FadeIn from './FadeIn';
import Magnet from './Magnet';
import ContactButton from './ContactButton';

export default function HeroSection() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: '关于', href: '#about' },
    { label: '技能', href: '#skills' },
    { label: '作品', href: '#projects' },
    { label: '联系', href: '#contact' },
  ];

  return (
    <section className="h-screen flex flex-col overflow-x-clip relative">
      {/* Navbar */}
      <FadeIn delay={0} y={-20}>
        <nav className="flex items-center justify-between px-6 md:px-10 pt-6 md:pt-8 relative z-30">
          {/* Desktop nav */}
          <div className="hidden sm:flex items-center justify-between w-full">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[#D7E2EA] font-medium uppercase tracking-wider
                  text-sm md:text-lg lg:text-[1.4rem]
                  hover:opacity-70 transition-opacity duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            className="sm:hidden text-[#D7E2EA] uppercase tracking-wider text-sm font-medium"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? '关闭' : '菜单'}
          </button>
        </nav>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="sm:hidden flex flex-col items-center gap-6 py-8 bg-[#0C0C0C] absolute top-16 left-0 right-0 z-20">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-[#D7E2EA] font-medium uppercase tracking-wider text-lg
                  hover:opacity-70 transition-opacity duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </FadeIn>

      {/* Hero Heading */}
      <div className="overflow-hidden">
        <FadeIn delay={0.15} y={40}>
          <h1 className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full
            text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw]
            mt-6 sm:mt-4 md:-mt-5">
            Hi, i&apos;m vicky
          </h1>
        </FadeIn>
      </div>

      {/* Bottom bar */}
      <div className="flex justify-between items-end pb-7 sm:pb-8 md:pb-10 mt-auto px-6 md:px-10">
        <FadeIn delay={0.35} y={20}>
          <p className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug
            max-w-[160px] sm:max-w-[220px] md:max-w-[260px]"
            style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}>
            数据驱动的内容策略 &amp; AI赋能的创意表达
          </p>
        </FadeIn>

        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>

      {/* Portrait - centered */}
      <FadeIn delay={0.6} y={30}>
        <Magnet
          padding={150}
          strength={3}
          activeTransition="transform 0.3s ease-out"
          inactiveTransition="transform 0.6s ease-in-out"
          className="absolute left-1/2 -translate-x-1/2 z-10
            w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px]
            top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0"
        >
          <div className="relative group">
            {/* Glow ring */}
            <div className="absolute -inset-2 rounded-full opacity-40 blur-xl
              bg-gradient-to-r from-[#B600A8]/30 via-[#7621B0]/20 to-[#BE4C00]/30
              group-hover:opacity-60 transition-opacity duration-500" />
            {/* Image container */}
            <div className="relative rounded-full overflow-hidden
              ring-1 ring-white/10 shadow-2xl shadow-purple-900/20">
              <img
                src="/photos/3b336373aad37892618ccd6819bc7002.jpg"
                alt="Vicky"
                className="w-full h-auto object-cover block
                  contrast-110 brightness-90 saturate-75"
              />
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 rounded-full
                bg-gradient-to-t from-[#0C0C0C]/80 via-transparent to-transparent" />
              {/* Subtle edge highlight */}
              <div className="absolute inset-0 rounded-full
                bg-gradient-to-br from-white/5 via-transparent to-transparent" />
            </div>
          </div>
        </Magnet>
      </FadeIn>
    </section>
  );
}
