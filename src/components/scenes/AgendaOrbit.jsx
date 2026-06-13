import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCalendar, FiDollarSign, FiMusic, FiAward, FiCheckCircle } from "react-icons/fi";

const orbitingItems = [
  { id: 1, title: "Rent Bill", amount: "₹5,000", type: "bill", icon: FiCalendar, color: "text-rose-400 bg-rose-500/10 border-rose-500/20", angle: 0, speed: 20, status: "⚠️ Overdue" },
  { id: 2, title: "Spotify Family", amount: "₹199", type: "subscription", icon: FiMusic, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", angle: 90, speed: 15, status: "🔁 Monthly" },
  { id: 3, title: "Savings Milestone", amount: "₹10,000", type: "goal", icon: FiAward, color: "text-violet-400 bg-violet-500/10 border-violet-500/20", angle: 180, speed: 25, status: "🎯 80% Complete" },
  { id: 4, title: "Freelance Income", amount: "₹12,500", type: "income", icon: FiDollarSign, color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20", angle: 270, speed: 18, status: "📅 Syncing" }
];

export default function AgendaOrbit() {
  const [selectedItem, setSelectedItem] = useState(orbitingItems[0]);

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-10">
      {/* Left Column: Orbital Visualization */}
      <div className="col-span-1 lg:col-span-7 flex items-center justify-center min-h-[360px] relative">
        
        {/* Core Glowing Dashboard Mockup */}
        <div className="relative w-48 h-48 rounded-3xl border border-white/10 bg-[#11131c]/80 flex flex-col items-center justify-center glass-panel z-10 shadow-[0_0_50px_rgba(139,92,246,0.15)]">
          <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/10 to-indigo-600/10 rounded-3xl pointer-events-none" />
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-violet-400/80">Dashboard Core</span>
          <span className="text-2xl font-black text-white mt-1">₹42,680</span>
          <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
            <FiCheckCircle className="text-emerald-400" /> Calendar Synced
          </span>
        </div>

        {/* Orbit Path Circles */}
        <div className="absolute w-80 h-80 rounded-full border border-white/5 pointer-events-none" />
        <div className="absolute w-[360px] h-[360px] rounded-full border border-white/2 pointer-events-none" />

        {/* Floating elements with CSS orbital animation */}
        {orbitingItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="absolute cursor-pointer group z-20"
              style={{
                // Compute initial polar coordinates
                transform: `rotate(${item.angle}deg) translate(150px) rotate(-${item.angle}deg)`
              }}
            >
              <motion.div 
                whileHover={{ scale: 1.15 }}
                className={`w-12 h-12 rounded-full flex items-center justify-center border shadow-lg ${item.color} ${
                  selectedItem.id === item.id ? "ring-2 ring-violet-500 ring-offset-2 ring-offset-[#090a0f]" : ""
                }`}
              >
                <Icon size={18} />
              </motion.div>

              {/* Floating label on hover */}
              <div className="absolute top-14 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-[#11131c] border border-white/10 px-2 py-0.5 rounded text-[9px] font-bold text-white whitespace-nowrap">
                {item.title}
              </div>
            </div>
          );
        })}
      </div>

      {/* Right Column: Selected Info and Content */}
      <div className="col-span-1 lg:col-span-5 flex flex-col gap-6">
        <div>
          <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">
            Bidirectional Sync
          </span>
          <h3 className="text-3xl font-extrabold text-white tracking-tight mt-3">
            Financial Agenda & Orbits
          </h3>
          <p className="text-slate-400 text-sm mt-2 leading-relaxed">
            See your bills, subscriptions, income streams, and savings goals orbiting a unified balance dashboard. Click any item on the left to inspect its Google Calendar sync status.
          </p>
        </div>

        {/* Selected item status card */}
        <AnimatePresence mode="wait">
          {selectedItem && (
            <motion.div
              key={selectedItem.id}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              className="glass-panel border border-white/5 rounded-2xl p-5 flex flex-col gap-4 bg-white/2"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${selectedItem.color}`}>
                    <selectedItem.icon size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-white">{selectedItem.title}</h4>
                    <span className="text-[9px] uppercase font-bold text-slate-500">{selectedItem.type}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-white">{selectedItem.amount}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-slate-500 font-bold uppercase text-[9px]">Google Calendar</p>
                  <p className="text-emerald-400 font-semibold mt-0.5">✓ Sync Connected</p>
                </div>
                <div>
                  <p className="text-slate-500 font-bold uppercase text-[9px]">Status / Interval</p>
                  <p className="text-slate-200 font-semibold mt-0.5">{selectedItem.status}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
