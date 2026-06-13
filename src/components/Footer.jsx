import React from "react";
import { FiArrowUp, FiHeart } from "react-icons/fi";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-white/5 bg-[#090a0f] pt-20 pb-12 overflow-hidden">
      {/* Background glow ambient node */}
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-glow-blue pointer-events-none opacity-20" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-8 mb-16">
          {/* Brand Info */}
          <div className="col-span-2 flex flex-col gap-5">
            <a href="#" className="flex items-center gap-3">
              <img src="/logo.svg" alt="BroLedger Logo" className="w-7 h-7 drop-shadow-[0_0_10px_rgba(139,92,246,0.3)]" />
              <span className="text-lg font-black tracking-tighter text-white">
                Bro<span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Ledger</span>
              </span>
            </a>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              The premium, dark-mode personal finance operating system that simplifies settlements. Track, OCR-scan, sync, and dissolve complex debts between friends.
            </p>
          </div>

          {/* Column 1: Product */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200">Product</h4>
            <div className="flex flex-col gap-2.5 text-sm text-slate-400">
              <a href="#features" className="hover:text-violet-400 transition-colors">Group Splits</a>
              <a href="#ocr" className="hover:text-violet-400 transition-colors">AI Receipt scanning</a>
              <a href="#cashbook" className="hover:text-violet-400 transition-colors">Personal Cashbook</a>
              <a href="#settlements" className="hover:text-violet-400 transition-colors">Debt Simplification</a>
            </div>
          </div>

          {/* Column 2: Integrations */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200">Integrations</h4>
            <div className="flex flex-col gap-2.5 text-sm text-slate-400">
              <a href="#features" className="hover:text-violet-400 transition-colors">Google Calendar</a>
              <a href="#features" className="hover:text-violet-400 transition-colors">Gemini AI Models</a>
              <a href="#features" className="hover:text-violet-400 transition-colors">Groq Llama 3</a>
              <a href="#features" className="hover:text-violet-400 transition-colors">EmailJS Engine</a>
            </div>
          </div>

          {/* Column 3: Legal */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200">Legal</h4>
            <div className="flex flex-col gap-2.5 text-sm text-slate-400">
              <a href="#" className="hover:text-violet-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-violet-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-violet-400 transition-colors">Security Audit</a>
            </div>
          </div>
        </div>

        <hr className="border-white/5 mb-10" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-slate-500 flex items-center gap-1.5">
            &copy; {new Date().getFullYear()} BroLedger. All rights reserved. Crafted with 
            <FiHeart className="text-violet-500 fill-violet-500 animate-pulse" /> for premium finances.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-4 h-9 rounded-full border border-white/5 bg-white/2 hover:bg-white/5 text-xs text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            Back to Top <FiArrowUp />
          </button>
        </div>
      </div>
    </footer>
  );
}
