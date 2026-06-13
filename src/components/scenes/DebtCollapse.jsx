import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMinimize2, FiRefreshCw, FiArrowRight } from "react-icons/fi";

export default function DebtCollapse() {
  const [isOptimized, setIsOptimized] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  const [transfers, setTransfers] = useState(3);

  // Refs for tracking coordinates
  const containerRef = useRef(null);
  const aliceRef = useRef(null);
  const bobRef = useRef(null);
  const charlieRef = useRef(null);

  const [coords, setCoords] = useState({
    alice: { x: 0, y: 0 },
    bob: { x: 0, y: 0 },
    charlie: { x: 0, y: 0 }
  });

  const toggleOptimize = () => {
    setPulse(true);
    setShowRipple(true);

    setTimeout(() => {
      setIsOptimized(!isOptimized);
      setPulse(false);
    }, 400);

    setTimeout(() => {
      setShowRipple(false);
    }, 1000);
  };

  // Synchronized countdown animation for transfers count
  useEffect(() => {
    if (isOptimized) {
      const t1 = setTimeout(() => setTransfers(2), 200);
      const t2 = setTimeout(() => setTransfers(1), 400);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    } else {
      const t1 = setTimeout(() => setTransfers(2), 200);
      const t2 = setTimeout(() => setTransfers(3), 400);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [isOptimized]);

  // Dynamically calculate node centers relative to their parent container
  useEffect(() => {
    const updateCoords = () => {
      if (!containerRef.current || !aliceRef.current || !bobRef.current || !charlieRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();

      const getCenter = (el) => {
        const rect = el.getBoundingClientRect();
        return {
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top + rect.height / 2
        };
      };

      setCoords({
        alice: getCenter(aliceRef.current),
        bob: getCenter(bobRef.current),
        charlie: getCenter(charlieRef.current)
      });
    };

    let frameId;
    const loop = () => {
      updateCoords();
      frameId = requestAnimationFrame(loop);
    };
    loop();

    window.addEventListener("resize", updateCoords);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", updateCoords);
    };
  }, [isOptimized]);

  // Truncate vector lines with starting and ending node clearances
  const getBorderCoords = (from, to, rEnd = 28) => {
    const rStart = 28;
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const d = Math.sqrt(dx * dx + dy * dy);

    if (d === 0) return { x1: from.x, y1: from.y, x2: to.x, y2: to.y };
    return {
      x1: from.x + (dx / d) * rStart,
      y1: from.y + (dy / d) * rStart,
      x2: to.x - (dx / d) * rEnd,
      y2: to.y - (dy / d) * rEnd
    };
  };

  // Midpoint helper for placing the amount tags on paths
  const getMidpoint = (from, to) => {
    return {
      x: (from.x + to.x) / 2,
      y: (from.y + to.y) / 2
    };
  };

  const lineAB = getBorderCoords(coords.alice, coords.bob, 34);
  const lineBC = getBorderCoords(coords.bob, coords.charlie, 34);
  const lineCA = getBorderCoords(coords.charlie, coords.alice, 34);
  const lineAC = getBorderCoords(coords.alice, coords.charlie, 38);

  const midAB = getMidpoint(coords.alice, coords.bob);
  const midBC = getMidpoint(coords.bob, coords.charlie);
  const midCA = getMidpoint(coords.charlie, coords.alice);
  const midAC = getMidpoint(coords.alice, coords.charlie);

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-10">
      {/* Premium CSS Keyframe Styles for subtle node floating */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes floatAlice {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(0.4deg); }
        }
        @keyframes floatBob {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-7px) rotate(-0.5deg); }
        }
        @keyframes floatCharlie {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-4px) rotate(0.3deg); }
        }
        .animate-float-alice { animation: floatAlice 4.5s ease-in-out infinite; }
        .animate-float-bob { animation: floatBob 5.5s ease-in-out infinite; }
        .animate-float-charlie { animation: floatCharlie 4.0s ease-in-out infinite; }
      `}} />

      {/* Left Column: Visualizer screen */}
      <div className="col-span-1 lg:col-span-7 flex flex-col items-center">
        <div
          ref={containerRef}
          className="relative w-full max-w-lg h-[340px] rounded-3xl border border-white/8 bg-[#0b0c13]/95 glass-panel overflow-hidden flex items-center justify-center"
        >
          {/* Grid background lines */}
          <div className="absolute inset-0 laser-grid opacity-25 pointer-events-none" />

          {/* Ripple Pulse Effect Overlay */}
          <AnimatePresence>
            {showRipple && (
              <motion.div
                initial={{ scale: 0, opacity: 0.9 }}
                animate={{ scale: 2.2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="absolute w-40 h-40 rounded-full border border-violet-500/50 shadow-[0_0_35px_rgba(139,92,246,0.35)] pointer-events-none z-30"
              />
            )}
          </AnimatePresence>

          {/* Circle Node A: Alice (Violet Glow) */}
          <motion.div
            ref={aliceRef}
            className="absolute z-20 flex flex-col items-center justify-center"
            style={{ width: 56, height: 56 }}
            animate={{
              left: isOptimized ? "20%" : "15%",
              top: isOptimized ? "60%" : "25%"
            }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
          >
            <div className="animate-float-alice flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-violet-600 border border-violet-400/30 shadow-[0_0_20px_rgba(139,92,246,0.45)] flex items-center justify-center font-bold text-white text-base">
                A
              </div>
              <span className="text-[10px] font-semibold text-slate-200 mt-1.5">Alice</span>
              <span className="text-[8px] text-rose-400 font-extrabold bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 mt-1 whitespace-nowrap">
                Net: -₹300
              </span>
            </div>
          </motion.div>

          {/* Circle Node B: Bob (Subtle Grey Glow) */}
          <motion.div
            ref={bobRef}
            className="absolute z-20 flex flex-col items-center justify-center"
            style={{ width: 56, height: 56 }}
            animate={{
              left: isOptimized ? "50%" : "75%",
              top: isOptimized ? "15%" : "25%",
              opacity: isOptimized ? 0.25 : 1
            }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
          >
            <div className="animate-float-bob flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-slate-700 border border-slate-500/30 shadow-[0_0_15px_rgba(255,255,255,0.12)] flex items-center justify-center font-bold text-white text-base">
                B
              </div>
              <span className="text-[10px] font-semibold text-slate-200 mt-1.5">Bob</span>
              <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded border mt-1 whitespace-nowrap ${isOptimized
                ? "text-slate-400 bg-white/5 border-white/10"
                : "text-amber-400 bg-amber-500/10 border-amber-500/20"
                }`}>
                Net: ₹0
              </span>
            </div>
          </motion.div>

          {/* Circle Node C: Charlie (Emerald Glow) */}
          <motion.div
            ref={charlieRef}
            className="absolute z-20 flex flex-col items-center justify-center"
            style={{ width: 56, height: 56 }}
            animate={{
              left: isOptimized ? "80%" : "45%",
              top: isOptimized ? "60%" : "75%"
            }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
          >
            <div className="animate-float-charlie flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-emerald-600 border border-emerald-400/30 shadow-[0_0_20px_rgba(16,185,129,0.45)] flex items-center justify-center font-bold text-white text-base">
                C
              </div>
              <span className="text-[10px] font-semibold text-slate-200 mt-1.5">Charlie</span>
              <span className="text-[8px] text-emerald-400 font-extrabold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 mt-1 whitespace-nowrap">
                Net: +₹300
              </span>
            </div>
          </motion.div>

          {/* Dynamic Vector Lines Canvas */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            <defs>
              <marker id="arrow-red" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="rgba(244,63,94,0.6)" />
              </marker>
              <marker id="arrow-green" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#10b981" />
              </marker>
            </defs>

            <AnimatePresence>
              {!isOptimized ? (
                <>
                  {/* Alice to Bob (Owes 500) */}
                  <motion.line
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    exit={{ pathLength: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    x1={lineAB.x1} y1={lineAB.y1} x2={lineAB.x2} y2={lineAB.y2}
                    stroke="rgba(244,63,94,0.35)" strokeWidth="2.2"
                    markerEnd="url(#arrow-red)"
                  />
                  {/* Bob to Charlie (Owes 500) */}
                  <motion.line
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    exit={{ pathLength: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    x1={lineBC.x1} y1={lineBC.y1} x2={lineBC.x2} y2={lineBC.y2}
                    stroke="rgba(244,63,94,0.35)" strokeWidth="2.2"
                    markerEnd="url(#arrow-red)"
                  />
                  {/* Charlie to Alice (Owes 200) */}
                  <motion.line
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    exit={{ pathLength: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    x1={lineCA.x1} y1={lineCA.y1} x2={lineCA.x2} y2={lineCA.y2}
                    stroke="rgba(244,63,94,0.35)" strokeWidth="2.2"
                    markerEnd="url(#arrow-red)"
                  />
                </>
              ) : (
                /* Optimized Collapse: Alice directly to Charlie (300) */
                <motion.line
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  x1={lineAC.x1} y1={lineAC.y1} x2={lineAC.x2} y2={lineAC.y2}
                  stroke="#10b981" strokeWidth="3.2"
                  style={{ filter: "drop-shadow(0 0 5px rgba(16, 185, 129, 0.45))" }}
                  markerEnd="url(#arrow-green)"
                />
              )}
            </AnimatePresence>
          </svg>

          {/* Absolute HTML mid-point amount label overlays */}
          <div className="absolute inset-0 pointer-events-none z-30">
            <AnimatePresence>
              {!isOptimized ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    style={{ left: midAB.x, top: midAB.y, transform: "translate(-50%, -50%)" }}
                    className="absolute text-[9px] font-extrabold text-rose-300 bg-[#090a0f] border border-white/10 px-2 py-0.5 rounded shadow-lg"
                  >
                    ₹500
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    style={{ left: midBC.x, top: midBC.y, transform: "translate(-50%, -50%)" }}
                    className="absolute text-[9px] font-extrabold text-rose-300 bg-[#090a0f] border border-white/10 px-2 py-0.5 rounded shadow-lg"
                  >
                    ₹500
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    style={{ left: midCA.x, top: midCA.y, transform: "translate(-50%, -50%)" }}
                    className="absolute text-[9px] font-extrabold text-rose-300 bg-[#090a0f] border border-white/10 px-2 py-0.5 rounded shadow-lg"
                  >
                    ₹200
                  </motion.div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  style={{ left: midAC.x - 70, top: midAC.y + 24, transform: "translate(-50%, -50%)" }}
                  className="absolute text-[10px] font-black text-emerald-400 bg-[#090a0f] border border-emerald-500/35 px-3 py-1 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                >
                  Alice pays Charlie ₹300
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Right Column: Information card and collapse triggers */}
      <div className="col-span-1 lg:col-span-5 flex flex-col gap-6">
        <div>
          <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">
            Greedy Flow Optimization
          </span>
          <h3 className="text-3xl font-extrabold text-white tracking-tight mt-3">
            Smart Debt Simplification
          </h3>
          <p className="text-slate-400 text-sm mt-2 leading-relaxed">
            Eliminate loops of bank transfers. Our greedy simplification engine matches net balances to compute the minimal direct paths.
          </p>
        </div>

        {/* Transfer Path Comparison Cards */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            animate={{
              borderColor: !isOptimized ? "rgba(244, 63, 94, 0.2)" : "rgba(255, 255, 255, 0.05)",
              boxShadow: !isOptimized ? "0 0 15px rgba(244, 63, 94, 0.05)" : "none"
            }}
            transition={{ duration: 0.4 }}
            className="p-4 rounded-2xl bg-white/2 border flex flex-col transition-all"
          >
            <span className="text-[9px] uppercase font-bold text-slate-500">Unoptimized Paths</span>
            <span className="text-2xl font-black text-rose-400 mt-1">
              {transfers} Transfer{transfers !== 1 ? "s" : ""}
            </span>
            <span className="text-xs text-slate-400 mt-0.5">₹1,200 total volume</span>
          </motion.div>

          <motion.div
            animate={{
              scale: isOptimized ? [1, 1.04, 1] : 1,
              borderColor: isOptimized ? "rgba(16, 185, 129, 0.35)" : "rgba(255, 255, 255, 0.05)",
              boxShadow: isOptimized ? "0 0 15px rgba(16, 185, 129, 0.15)" : "none"
            }}
            transition={{ duration: 0.4 }}
            className="p-4 rounded-2xl bg-violet-600/5 border flex flex-col transition-all"
          >
            <span className="text-[9px] uppercase font-bold text-violet-400">Simplified Path</span>
            <span className={`text-2xl font-black mt-1 transition-colors duration-300 ${isOptimized ? "text-emerald-400 font-extrabold" : "text-slate-400"}`}>
              1 Transfer
            </span>
            <span className={`text-xs mt-0.5 transition-colors duration-300 ${isOptimized ? "text-emerald-300 font-bold" : "text-slate-400"}`}>
              ₹300 total volume
            </span>
          </motion.div>
        </div>

        {/* Trigger Button with premium neon-bordered glows */}
        <button
          onClick={toggleOptimize}
          disabled={pulse}
          className="w-full flex items-center justify-center gap-2 h-12 rounded-xl text-xs font-bold uppercase tracking-wider text-white border border-violet-500/50 bg-violet-600/10 hover:bg-violet-600/20 shadow-[0_0_15px_rgba(139,92,246,0.25)] hover:shadow-[0_0_25px_rgba(139,92,246,0.45)] transition-all cursor-pointer"
        >
          <FiMinimize2 />
          {isOptimized ? "RESET COMPLEX WEB" : "✨ COLLAPSE DEBT NETWORK"}
        </button>
      </div>
    </div>
  );
}
