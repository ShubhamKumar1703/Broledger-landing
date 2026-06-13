import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMic, FiPlay, FiDatabase, FiTag } from "react-icons/fi";

const mockUtterances = [
  { text: "spent 450 rupees on double cheese pizza with friends", amount: 450, category: "Food", desc: "Double cheese pizza" },
  { text: "paid 1200 for airport cab booking", amount: 1200, category: "Transportation", desc: "Airport cab booking" },
  { text: "bought movie tickets for 350", amount: 350, category: "Entertainment", desc: "Movie tickets" },
  { text: "got a premium hoodie for 1999", amount: 1999, category: "Shopping", desc: "Premium hoodie" }
];

export default function CashbookFlow() {
  const [activeIdx, setActiveIdx] = useState(-1);
  const [typingText, setTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [parsedCard, setParsedCard] = useState(null);

  const triggerUtterance = (idx) => {
    if (isTyping || showParticles) return;
    setActiveIdx(idx);
    setIsTyping(true);
    setTypingText("");
    setParsedCard(null);
  };

  // Simulate typing animation
  useEffect(() => {
    if (activeIdx === -1 || !isTyping) return;
    
    const targetText = mockUtterances[activeIdx].text;
    let charIdx = 0;
    
    const timer = setInterval(() => {
      setTypingText((prev) => prev + targetText.charAt(charIdx));
      charIdx++;
      if (charIdx >= targetText.length) {
        clearInterval(timer);
        setIsTyping(false);
        // Start particle streaming
        setShowParticles(true);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [activeIdx, isTyping]);

  // Handle particle completion and show parsed card
  useEffect(() => {
    if (!showParticles) return;

    const timer = setTimeout(() => {
      setShowParticles(false);
      setParsedCard(mockUtterances[activeIdx]);
    }, 1800);

    return () => clearTimeout(timer);
  }, [showParticles, activeIdx]);

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-10">
      {/* Left Column: Conversational triggers */}
      <div className="col-span-1 lg:col-span-5 flex flex-col gap-5">
        <div>
          <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">
            Conversational NLP
          </span>
          <h3 className="text-3xl font-extrabold text-white tracking-tight mt-3">
            Voice Capture & Cashbook
          </h3>
          <p className="text-slate-400 text-sm mt-2 leading-relaxed">
            Record a voice statement or type standard text. Our Groq AI engine extracts numeric balances, groups categories, and files them.
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Try speech presets:</p>
          {mockUtterances.map((item, idx) => (
            <button
              key={idx}
              onClick={() => triggerUtterance(idx)}
              disabled={isTyping || showParticles}
              className={`flex items-center justify-between px-4 h-12 rounded-xl text-xs font-semibold border text-left cursor-pointer transition-all ${
                activeIdx === idx 
                  ? "bg-violet-600/10 border-violet-500 text-white" 
                  : "border-white/5 bg-white/2 hover:border-white/10 text-slate-400 hover:text-slate-200"
              }`}
            >
              <span className="truncate pr-4">"{item.text}"</span>
              <FiPlay className="shrink-0 text-violet-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Right Column: AI Vault and pipeline visualizer */}
      <div className="col-span-1 lg:col-span-7 flex flex-col items-center relative min-h-[350px]">
        {/* Ambient background glow */}
        <div className="absolute inset-0 bg-glow-purple pointer-events-none opacity-20" />

        {/* Input box bubble */}
        <div className="w-full max-w-md bg-white/5 border border-white/8 rounded-2xl p-5 mb-8 relative glass-panel flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-violet-600/20 flex items-center justify-center text-violet-400 shrink-0">
            <FiMic className={isTyping ? "animate-pulse text-rose-400" : ""} />
          </div>
          <div className="flex-1 text-sm font-semibold text-slate-200">
            {typingText || <span className="text-slate-500 italic">Select a voice trigger...</span>}
            {isTyping && <span className="animate-pulse bg-violet-400 w-1.5 h-4 inline-block ml-1 align-middle" />}
          </div>
        </div>

        {/* Particle Pipeline Stream */}
        <div className="h-16 relative w-full max-w-xs flex justify-center overflow-hidden mb-4">
          <AnimatePresence>
            {showParticles && (
              <div className="absolute inset-0 flex flex-wrap justify-center items-center gap-1.5 pointer-events-none">
                {[...Array(15)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: -30, opacity: 0, scale: 0.2 }}
                    animate={{ 
                      y: [0, 40], 
                      opacity: [0, 1, 1, 0],
                      scale: [0.2, 1, 0.8, 0.4],
                      x: [Math.random() * 20 - 10, Math.random() * 40 - 20]
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: 1.2, 
                      ease: "easeInOut",
                      delay: i * 0.08,
                      repeat: Infinity 
                    }}
                    className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-violet-400 to-indigo-500 shadow-[0_0_8px_rgba(139,92,246,0.6)]"
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Financial Vault Box */}
        <div className="w-full max-w-sm rounded-2xl border border-white/8 bg-[#11131c]/60 p-6 flex flex-col items-center relative overflow-hidden glass-panel">
          <FiDatabase className={`text-slate-500 mb-2 transition-colors duration-500 ${showParticles ? "text-violet-400 animate-bounce" : ""}`} size={32} />
          <h4 className="text-xs uppercase font-extrabold tracking-widest text-slate-400 mb-4">Intelligent Personal Vault</h4>

          <AnimatePresence mode="wait">
            {!parsedCard ? (
              <motion.p 
                key="waiting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-slate-500 text-center italic py-4"
              >
                Awaiting transaction stream...
              </motion.p>
            ) : (
              <motion.div
                key="card"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full bg-white/2 border border-white/5 rounded-xl p-4 flex items-center justify-between gap-4"
              >
                <div>
                  <span className="flex items-center gap-1.5 text-[9px] font-bold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20 w-fit mb-2">
                    <FiTag /> {parsedCard.category}
                  </span>
                  <p className="text-sm font-semibold text-white">{parsedCard.desc}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Recorded into Cashbook</p>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-emerald-400">₹{parsedCard.amount}.00</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
