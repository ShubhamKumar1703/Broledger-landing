import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiCalendar, 
  FiTarget, 
  FiBell, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiClock 
} from "react-icons/fi";
import { LuBrain } from "react-icons/lu";

const orbitingItems = [
  { 
    id: "sync", 
    title: "Google Sync", 
    type: "system", 
    icon: FiCalendar, 
    color: "text-rose-400 bg-rose-500/10 border-rose-500/20", 
    angle: 0 
  },
  { 
    id: "ai_nudge", 
    title: "AI Briefing", 
    type: "ai", 
    icon: LuBrain, 
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", 
    angle: 90 
  },
  { 
    id: "goals", 
    title: "Goal Tracker", 
    type: "goal", 
    icon: FiTarget, 
    color: "text-violet-400 bg-violet-500/10 border-violet-500/20", 
    angle: 180 
  },
  { 
    id: "reminders", 
    title: "Predictive Alert", 
    type: "reminder", 
    icon: FiBell, 
    color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20", 
    angle: 270 
  }
];

export default function AgendaOrbit() {
  const [activeTab, setActiveTab] = useState("sync");
  const [ripples, setRipples] = useState([]);
  const [isAutoActive, setIsAutoActive] = useState(true);

  // Goals tab state
  const [milestones, setMilestones] = useState([
    { id: 1, label: "✈️ Flights Booked", weight: 40, completed: true },
    { id: 2, label: "🏨 Hotels Secured", weight: 40, completed: true },
    { id: 3, label: "🎟️ Visas Processed", weight: 20, completed: false }
  ]);

  // Reminders tab state
  const [notificationDispatched, setNotificationDispatched] = useState(false);

  // Auto orbit focus changes
  useEffect(() => {
    if (!isAutoActive) return;

    const interval = setInterval(() => {
      setActiveTab((current) => {
        const idx = orbitingItems.findIndex((item) => item.id === current);
        const nextIdx = (idx + 1) % orbitingItems.length;
        return orbitingItems[nextIdx].id;
      });
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoActive]);

  // Pulse wave effect
  useEffect(() => {
    let color = "rgba(139, 92, 246, 0.6)"; // default violet
    if (activeTab === "sync") color = "rgba(244, 63, 94, 0.6)";
    else if (activeTab === "ai_nudge") color = "rgba(52, 211, 153, 0.6)";
    else if (activeTab === "reminders") color = "rgba(99, 102, 241, 0.6)";

    const newRipple = { id: Math.random(), color };
    setRipples((prev) => [...prev, newRipple]);

    const timer = setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 1500);

    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setIsAutoActive(false); // Pause auto-rotation when user clicks
  };

  const getDashboardCoreContent = () => {
    switch (activeTab) {
      case "sync":
        return {
          label: "Google Sync",
          value: "₹42,680",
          status: "Calendar Connected",
          statusColor: "text-emerald-400",
          glowColor: "shadow-[0_0_50px_rgba(244,63,94,0.25)] border-rose-500/30"
        };
      case "ai_nudge":
        return {
          label: "AI Health Score",
          value: "87 / 100",
          status: "Nudges Active",
          statusColor: "text-emerald-400",
          glowColor: "shadow-[0_0_50px_rgba(16,185,129,0.25)] border-emerald-500/30"
        };
      case "goals":
        const progress = milestones.reduce((sum, m) => m.completed ? sum + m.weight : sum, 0);
        return {
          label: "Travel Fund Target",
          value: `${progress}%`,
          status: "International Trip",
          statusColor: "text-violet-400",
          glowColor: "shadow-[0_0_50px_rgba(139,92,246,0.25)] border-violet-500/30"
        };
      case "reminders":
        return {
          label: "Predictive Alerts",
          value: "2 Pending",
          status: "Action Required",
          statusColor: "text-rose-400",
          glowColor: "shadow-[0_0_50px_rgba(99,102,241,0.25)] border-indigo-500/30"
        };
      default:
        return {
          label: "Dashboard Core",
          value: "₹42,680",
          status: "Calendar Synced",
          statusColor: "text-emerald-400",
          glowColor: "shadow-[0_0_50px_rgba(139,92,246,0.15)] border-white/10"
        };
    }
  };

  const dashboardCore = getDashboardCoreContent();
  const totalGoalProgress = milestones.reduce((sum, m) => m.completed ? sum + m.weight : sum, 0);

  const renderTabContent = () => {
    switch (activeTab) {
      case "sync":
        return (
          <div className="flex flex-col gap-4">
            <div className="glass-panel border border-white/5 rounded-2xl p-5 flex flex-col gap-4 bg-[#11131c]/60 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center border text-rose-400 bg-rose-500/10 border-rose-500/20">
                    <FiCalendar size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-white">Rent Bill</h4>
                    <span className="text-[9px] uppercase font-bold text-slate-500">Obligation</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-white">₹5,000</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-slate-500 font-bold uppercase text-[9px]">Google Calendar</p>
                  <p className="text-emerald-400 font-semibold mt-0.5">✓ Sync Connected</p>
                </div>
                <div>
                  <p className="text-slate-500 font-bold uppercase text-[9px]">Status / Interval</p>
                  <p className="text-rose-400 font-semibold mt-0.5">⚠️ Overdue</p>
                </div>
              </div>
            </div>

            <div className="px-4 py-3 rounded-xl border border-rose-500/20 bg-rose-600/10 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <span className="animate-pulse">⚡</span>
              <span>Google Calendar Engine: Connected & Monitoring "BroLedger Financial Events"</span>
            </div>
          </div>
        );
      case "ai_nudge":
        return (
          <div className="flex flex-col gap-4">
            <div className="glass-panel border border-white/5 rounded-2xl p-5 bg-[#11131c]/60 flex items-center gap-5 relative overflow-hidden">
              <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    className="stroke-white/5"
                    strokeWidth="5"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="32"
                    cy="32"
                    r="26"
                    className="stroke-emerald-400"
                    strokeWidth="5"
                    fill="transparent"
                    strokeDasharray="163"
                    initial={{ strokeDashoffset: 163 }}
                    animate={{ strokeDashoffset: 163 * (1 - 87 / 100) }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    strokeLinecap="round"
                    style={{ filter: "drop-shadow(0 0 4px rgba(52,211,153,0.5))" }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-base font-black text-white leading-none">87</span>
                  <span className="text-[6px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Score</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-extrabold text-white">Financial Health Score</h4>
                <p className="text-xs text-slate-400 mt-1 leading-normal">
                  Excellent standing. Your budget utilization is optimized, and debt overhead is minimized.
                </p>
              </div>
            </div>

            <div className="glass-panel border border-emerald-500/20 bg-emerald-500/5 rounded-2xl p-5 relative overflow-hidden flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <FiSparkles className="animate-pulse" /> Groq AI Engine Nudge
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "🤖 Groq Live Nudge: You spent 12% less on dining in your Personal Cashbook this week. Transferring ₹1,800 to your active Savings Goal will maximize your yield."
              </p>
            </div>
          </div>
        );
      case "goals":
        return (
          <div className="flex flex-col gap-4">
            <div className="glass-panel border border-white/5 rounded-2xl p-5 bg-[#11131c]/60 flex flex-col gap-4 relative overflow-hidden">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                    🎯 International Travel Fund
                  </h4>
                  <span className="text-[9px] uppercase font-bold text-slate-500">Savings Target Goal</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-violet-400">{totalGoalProgress}% Complete</span>
                </div>
              </div>

              <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${totalGoalProgress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Sub-Milestones (Click to toggle):</p>
                <div className="flex flex-wrap gap-2">
                  {milestones.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setMilestones(prev => prev.map(item => item.id === m.id ? { ...item, completed: !item.completed } : item));
                      }}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                        m.completed
                          ? "bg-violet-600/10 border-violet-500/40 text-violet-300"
                          : "bg-white/2 border-white/5 text-slate-500 hover:border-white/10 hover:text-slate-300"
                      }`}
                    >
                      <span className={m.completed ? "text-violet-400 font-extrabold" : "text-slate-600"}>
                        {m.completed ? "✓" : "○"}
                      </span>
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case "reminders":
        return (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <div className="glass-panel border border-white/5 bg-[#11131c]/60 rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                    <FiAlertCircle size={14} />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Electricity Bill</h5>
                    <span className="text-[8px] text-slate-500 font-semibold uppercase">Due 2 days ago</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[8px] font-extrabold uppercase bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    Overdue
                  </span>
                  <span className="text-xs font-black text-white">₹3,420</span>
                </div>
              </div>

              <div className="glass-panel border border-white/5 bg-[#11131c]/60 rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <FiClock size={14} />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">AWS Cloud Services</h5>
                    <span className="text-[8px] text-slate-500 font-semibold uppercase">Due Tomorrow</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[8px] font-extrabold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Due in 24h
                  </span>
                  <span className="text-xs font-black text-white">₹1,850</span>
                </div>
              </div>
            </div>

            <div className="glass-panel border border-indigo-500/20 bg-indigo-500/5 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-extrabold text-white">Automated Dispatch Engine</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Triggers email digests & system alerts when thresholds are reached.
                </p>
              </div>
              <button
                onClick={() => {
                  setNotificationDispatched(true);
                  setTimeout(() => setNotificationDispatched(false), 3000);
                }}
                disabled={notificationDispatched}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer border shrink-0 ${
                  notificationDispatched
                    ? "bg-emerald-500/10 border-emerald-500/45 text-emerald-300"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500 hover:shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                }`}
              >
                {notificationDispatched ? "✓ Dispatched" : "⚡ Dispatch Alert"}
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-10">
      {/* Left Column: Orbital Visualization */}
      <div className="col-span-1 lg:col-span-7 flex items-center justify-center min-h-[380px] relative">
        
        {/* Neon Pulse Waves */}
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.div
              key={ripple.id}
              initial={{ width: 192, height: 192, opacity: 0.8, border: `2px solid ${ripple.color}` }}
              animate={{ width: 380, height: 380, opacity: 0, border: `2px solid ${ripple.color.replace("0.6", "0")}` }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute rounded-full pointer-events-none z-0"
              style={{ boxShadow: `0 0 15px ${ripple.color}` }}
            />
          ))}
        </AnimatePresence>

        {/* Core Glowing Dashboard Mockup */}
        <div className={`relative w-48 h-48 rounded-3xl border bg-[#11131c]/80 flex flex-col items-center justify-center glass-panel z-10 transition-all duration-500 ${dashboardCore.glowColor}`}>
          <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/10 to-indigo-600/10 rounded-3xl pointer-events-none" />
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">{dashboardCore.label}</span>
          <span className="text-3xl font-black text-white mt-1.5 tracking-tight">{dashboardCore.value}</span>
          <span className={`text-[10px] font-semibold mt-1.5 flex items-center gap-1.5 ${dashboardCore.statusColor}`}>
            <FiCheckCircle size={12} /> {dashboardCore.status}
          </span>
        </div>

        {/* Orbit Path Circles */}
        <div className="absolute w-80 h-80 rounded-full border border-white/5 pointer-events-none" />
        <div className="absolute w-[360px] h-[360px] rounded-full border border-white/2 pointer-events-none" />

        {/* Floating elements with CSS orbital positioning */}
        {orbitingItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <div
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className="absolute cursor-pointer group z-20"
              style={{
                transform: `rotate(${item.angle}deg) translate(160px) rotate(-${item.angle}deg)`
              }}
            >
              <motion.div 
                whileHover={{ scale: 1.15 }}
                animate={{
                  y: [0, -4, 0],
                }}
                transition={{
                  duration: 3 + idx * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className={`w-12 h-12 rounded-full flex items-center justify-center border shadow-lg transition-all duration-300 ${item.color} ${
                  isActive 
                    ? "ring-2 ring-offset-2 ring-offset-[#090a0f] scale-110 " + 
                      (item.id === "sync" ? "ring-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]" : 
                       item.id === "ai_nudge" ? "ring-emerald-500 shadow-[0_0_15px_rgba(52,211,153,0.4)]" : 
                       item.id === "goals" ? "ring-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.4)]" : 
                       "ring-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)]")
                    : "opacity-60 hover:opacity-100"
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
            Agenda OS Engine
          </span>
          <h3 className="text-3xl font-extrabold text-white tracking-tight mt-3">
            Financial Agenda & Orbits
          </h3>
          <p className="text-slate-400 text-sm mt-2 leading-relaxed">
            See your bills, subscriptions, income streams, and savings goals orbiting a unified balance dashboard. Click any item on the left to inspect its Google Calendar sync status.
          </p>
        </div>

        {/* Selected tab dynamic content panel */}
        <div className="min-h-[220px] flex flex-col justify-start">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
