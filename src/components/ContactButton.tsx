import { useState } from 'react';

interface ContactButtonProps {
  className?: string;
}

export default function ContactButton({ className = '' }: ContactButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText('19164002075');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`rounded-full text-white font-medium uppercase tracking-widest
          px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4
          text-xs sm:text-sm md:text-base
          transition-opacity hover:opacity-90 cursor-pointer
          ${className}`}
        style={{
          background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
          boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
          outline: '2px solid white',
          outlineOffset: '-3px',
        }}
      >
        联系我
      </button>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className="relative bg-[#1a1a1a] border border-[#D7E2EA]/20 rounded-[30px] sm:rounded-[40px]
              px-8 py-8 sm:px-12 sm:py-10 max-w-sm w-full text-center
              shadow-2xl shadow-purple-900/30"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-5 text-[#D7E2EA]/50 hover:text-[#D7E2EA]
                text-2xl leading-none transition-colors"
            >
              &times;
            </button>

            <h3 className="text-[#D7E2EA] font-medium text-lg sm:text-xl tracking-wide mb-6">
              添加微信联系
            </h3>

            <div className="bg-[#0C0C0C] rounded-2xl px-6 py-4 mb-6 border border-[#D7E2EA]/10">
              <p className="text-[#D7E2EA]/50 text-xs tracking-wider uppercase mb-2">微信号</p>
              <p className="text-[#D7E2EA] font-medium text-lg tracking-wide select-all">
                19164002075
              </p>
            </div>

            <button
              onClick={handleCopy}
              className={`rounded-full px-8 py-3 text-sm font-medium tracking-wider
                transition-all duration-300 cursor-pointer
                ${copied
                  ? 'bg-green-600 text-white'
                  : 'bg-[#D7E2EA]/10 text-[#D7E2EA] hover:bg-[#D7E2EA]/20 border border-[#D7E2EA]/20'
                }`}
            >
              {copied ? '已复制 ✓' : '复制微信号'}
            </button>

            <p className="text-[#D7E2EA]/30 text-xs mt-4 tracking-wide">
              点击复制后打开微信添加好友
            </p>
          </div>
        </div>
      )}
    </>
  );
}
