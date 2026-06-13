import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";

const faqs = [
  {
    question: "What is BroLedger?",
    answer: "BroLedger is a premium personal and group financial operating system. Unlike generic budgeting templates, BroLedger allows you to split restaurant receipts in collaborative split sessions, simplify peer-to-peer debts in group rooms, sync calendar events, and manage personal expenses in a secure, AI-powered private cashbook."
  },
  {
    question: "How does the Smart Debt Simplification solver work?",
    answer: "BroLedger runs a greedy flow-optimization algorithm. The engine computes the absolute net balances of all room members, splits them into debtor and creditor pools, sorts them by descending balance absolute values, and matches them greedily to collapse complex debt loops (e.g. A owes B owes C) into the minimum number of bank transfers."
  },
  {
    question: "Is my receipt OCR scanning data private?",
    answer: "Yes, entirely. BroLedger uses a secure backend proxy to communicate with Google's gemini-2.5-flash API. Your receipt photos are compressed locally using HTML5 canvas, analyzed purely for line-item extraction in a single API pass, and never used for advertising or model training."
  },
  {
    question: "How does the Google Calendar integration work?",
    answer: "Whenever you record upcoming bills or subscription items in your Financial Agenda, BroLedger automatically syncs them to a dedicated Google Calendar called 'BroLedger Financial Events'. It writes calendar alerts (e.g. 1 day before, 2 hours before) and provides a direct settlement link in the event description."
  },
  {
    question: "Does BroLedger support offline use?",
    answer: "Yes! BroLedger is built as a Progressive Web App (PWA) with a local service worker cache and offline persistence. You can load your ledger transactions, review details, and compose logs offline. The app automatically pushes updates to Firestore once a network connection is re-established."
  }
];

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState(-1);

  return (
    <section id="faq" className="py-24 bg-[#090a0f] relative overflow-hidden">
      {/* Background glow node */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-glow-blue pointer-events-none opacity-10" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">
            Common Inquiries
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mt-4">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            Have questions about how the AI models or debt solvers work? Find answers here.
          </p>
        </div>

        {/* FAQ Accordion container */}
        <div className="flex flex-col gap-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;

            return (
              <div
                key={idx}
                className="glass-panel border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/10"
              >
                {/* Accordion Trigger */}
                <button
                  onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left font-bold text-sm md:text-base text-white hover:text-violet-400 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-slate-500"
                  >
                    <FiChevronDown size={18} />
                  </motion.div>
                </button>

                {/* Accordion Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-1 text-slate-400 text-xs md:text-sm leading-relaxed border-t border-white/5 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
