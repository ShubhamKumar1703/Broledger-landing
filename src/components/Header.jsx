import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiArrowRight } from "react-icons/fi";

export default function Header({ onOpenWaitlist }) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "OCR Scanner", href: "#ocr" },
    { name: "Personal Cashbook", href: "#cashbook" },
    { name: "Debt Collapse", href: "#settlements" },
    { name: "FAQ", href: "#faq" }
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 glass-panel border-b border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
        {/* Brandmark */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 flex items-center justify-center">
            <img 
              src="/logo.svg" 
              alt="BroLedger Logo" 
              className="w-7 h-7 drop-shadow-[0_0_15px_rgba(139,92,246,0.5)] group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <span className="text-xl font-black tracking-tighter text-white">
            Bro<span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Ledger</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={onOpenWaitlist}
            className="relative inline-flex items-center gap-2 px-5 h-10 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-violet-600 hover:bg-violet-500 transition-all duration-300 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] overflow-hidden group cursor-pointer"
          >
            <span className="relative z-10 flex items-center gap-1.5">
              Get Early Access <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden glass-panel border-t border-white/5 overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-5">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-base font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <hr className="border-white/5 my-2" />
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenWaitlist();
                }}
                className="w-full flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-bold text-white bg-violet-600 shadow-[0_0_15px_rgba(139,92,246,0.3)] cursor-pointer"
              >
                Get Early Access <FiArrowRight />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
