import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiLayers, FiCpu, FiCalendar, FiDatabase } from "react-icons/fi";

// Components imports
import Header from "./components/Header";
import Footer from "./components/Footer";
import FAQSection from "./components/FAQSection";
import WaitlistModal from "./components/WaitlistModal";
import ScrollStoryline from "./components/ScrollStoryline";

// Scenes imports
import FinancialOrb from "./components/scenes/FinancialOrb";
import OCRPipeline from "./components/scenes/OCRPipeline";
import CashbookFlow from "./components/scenes/CashbookFlow";
import DebtCollapse from "./components/scenes/DebtCollapse";
import AgendaOrbit from "./components/scenes/AgendaOrbit";

export default function App() {
  const [showWaitlist, setShowWaitlist] = useState(false);

  return (
    <div className="bg-[#090a0f] text-slate-100 min-h-screen relative overflow-hidden">
      {/* Background ambient lighting blurs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-glow-purple pointer-events-none opacity-20" />
      <div className="absolute top-[800px] left-0 w-[400px] h-[400px] bg-glow-blue pointer-events-none opacity-15" />
      <div className="absolute top-[2000px] right-0 w-[600px] h-[600px] bg-glow-purple pointer-events-none opacity-10" />

      {/* Glassmorphic Sticky Header */}
      <Header onOpenWaitlist={() => setShowWaitlist(true)} />

      {/* Dynamic Scroll Storyline overlay */}
      <div className="absolute inset-x-0 top-0 max-w-7xl mx-auto px-6 pointer-events-none z-10" style={{ height: 0 }}>
        <ScrollStoryline />
      </div>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-24 px-6 max-w-7xl mx-auto z-10">
        {/* WebGL floating orb background element */}
        <FinancialOrb />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full relative z-10">
          <div className="lg:col-span-8 flex flex-col items-start text-left">
            
            {/* Cinematic Entrance Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-300 text-[10px] font-bold uppercase tracking-widest mb-6"
            >
              <FiLayers className="animate-spin" style={{ animationDuration: '4s' }} /> Next-Gen Personal Ledger
            </motion.div>

            {/* Headline Hierarchy */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-none mb-6"
            >
              Not an expense tracker.<br />
              <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
                Your financial OS.
              </span>
            </motion.h1>

            {/* Narrative description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base md:text-lg text-slate-400 max-w-xl mb-4 leading-relaxed"
            >
              Meet BroLedger. A premium financial ecosystem for you and your circle. Streamline receipt division with Gemini AI, sync calendars, and dissolve peer debts instantly.
            </motion.p>

            {/* Platform availability note */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.38 }}
              className="text-xs text-slate-500 mb-8 flex items-center gap-1.5"
            >
              🌐 Live on Web & Mobile PWA · Install directly on Android & iOS today
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-wrap items-center gap-4"
            >
              <button
                onClick={() => setShowWaitlist(true)}
                className="relative inline-flex items-center gap-2 px-8 h-12 rounded-full text-xs font-extrabold uppercase tracking-wider text-white bg-violet-600 hover:bg-violet-500 transition-all duration-300 shadow-[0_0_20px_rgba(139,92,246,0.35)] hover:shadow-[0_0_25px_rgba(139,92,246,0.55)] group cursor-pointer"
              >
                Get Early Access to Native App <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="#features"
                className="inline-flex items-center justify-center px-8 h-12 rounded-full text-xs font-extrabold uppercase tracking-wider text-slate-400 hover:text-white border border-white/8 hover:border-white/20 bg-white/1 hover:bg-white/3 transition-all cursor-pointer"
              >
                Explore Features
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CORE FEATURE STORIES */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-6 lg:pl-24 relative z-10 flex flex-col gap-28">
        
        {/* Segment 1: Group splits OCR */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          id="ocr"
        >
          <OCRPipeline />
        </motion.div>

        <hr className="border-white/5" />

        {/* Segment 2: Cashbook Voice */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          id="cashbook"
        >
          <CashbookFlow />
        </motion.div>

        <hr className="border-white/5" />

        {/* Segment 3: Debt Solver */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          id="settlements"
        >
          <DebtCollapse />
        </motion.div>

        <hr className="border-white/5" />

        {/* Segment 4: Calendar Orbit */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <AgendaOrbit />
        </motion.div>
      </section>

      {/* TECH INTEGRATIONS GRID */}
      <section className="py-24 bg-[#0a0b12]/50 border-y border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">
              Tech Stack Ecosystem
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mt-4">
              Advanced platform integrations
            </h2>
            <p className="text-slate-400 text-sm mt-3">
              Powering the financial operating system with best-in-class tech and AI layers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Gemini AI */}
            <div className="glass-panel border border-white/5 rounded-3xl p-6 flex flex-col justify-between hover:border-white/10 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-full bg-violet-600/10 text-violet-400 flex items-center justify-center mb-4">
                  <FiCpu size={18} />
                </div>
                <h4 className="text-base font-extrabold text-white">Gemini AI Models</h4>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                  Extracts raw receipt line-items using Google's native gemini-2.5-flash with structured JSON output configurations.
                </p>
              </div>
              <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider mt-5">OCR Pipeline</span>
            </div>

            {/* Groq Llama 3 */}
            <div className="glass-panel border border-white/5 rounded-3xl p-6 flex flex-col justify-between hover:border-white/10 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-full bg-indigo-600/10 text-indigo-400 flex items-center justify-center mb-4">
                  <FiCpu size={18} />
                </div>
                <h4 className="text-base font-extrabold text-white">Groq Llama 3 Engine</h4>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                  Processes user speech logs for personal cashbook extraction using llama-3.1-8b-instant at sub-100ms response times.
                </p>
              </div>
              <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider mt-5">NLP Parser</span>
            </div>

            {/* Google Calendar */}
            <div className="glass-panel border border-white/5 rounded-3xl p-6 flex flex-col justify-between hover:border-white/10 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-full bg-emerald-600/10 text-emerald-400 flex items-center justify-center mb-4">
                  <FiCalendar size={18} />
                </div>
                <h4 className="text-base font-extrabold text-white">Google Calendar Sync</h4>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                  Maintains financial events in a dedicated Google calendar with customizable reminders and inline settlement links.
                </p>
              </div>
              <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider mt-5">Calendar Worker</span>
            </div>

            {/* Firebase Database */}
            <div className="glass-panel border border-white/5 rounded-3xl p-6 flex flex-col justify-between hover:border-white/10 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-full bg-blue-600/10 text-blue-400 flex items-center justify-center mb-4">
                  <FiDatabase size={18} />
                </div>
                <h4 className="text-base font-extrabold text-white">Firebase Realtime</h4>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                  Keeps rooms, transactions, splits, and settings synchronized globally across friends' screens in real-time.
                </p>
              </div>
              <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider mt-5">Database & Auth</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION SECTION */}
      <FAQSection />

      {/* FOOTER */}
      <Footer />

      {/* GLOBAL GLASSMORPHIC WAITLIST MODAL */}
      <WaitlistModal isOpen={showWaitlist} onClose={() => setShowWaitlist(false)} />
    </div>
  );
}
