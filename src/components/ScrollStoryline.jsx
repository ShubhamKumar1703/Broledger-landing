import { useEffect, useRef, useState, useCallback } from "react";

/* ─── constants ─────────────────────────────────────────────── */
const VIOLET = "139,92,246";
const PATH_IDLE = `rgba(${VIOLET},0.12)`;
const PATH_DRAWN = `rgba(${VIOLET},0.45)`;
const PARTICLE_SIZE = 10;
const MILESTONE_COUNT = 4;
const MILESTONE_POSITIONS = [0.125, 0.375, 0.625, 0.875]; // normalised 0-1
const MILESTONE_SNAP_THRESHOLD = 0.035; // how close before "reached"

/* Serpentine S-curve that weaves gently left-right across the narrow viewBox.
   viewBox is 100 × 1000 — each curve segment spans ~250 units of height.       */
const CURVE_D = [
  "M 50 0",
  "C 50 60, 20 100, 20 160",
  "S 80 260, 80 320",
  "S 20 420, 20 500",
  "S 80 580, 80 660",
  "S 20 760, 20 840",
  "S 50 940, 50 1000",
].join(" ");

/* ─── component ─────────────────────────────────────────────── */
export default function ScrollStoryline() {
  const svgRef = useRef(null);
  const pathRef = useRef(null);
  const drawnPathRef = useRef(null);
  const particleRef = useRef(null);
  const trailRef = useRef(null);
  const milestoneDots = useRef([]);
  const rafId = useRef(null);
  const totalLen = useRef(0);
  const [ready, setReady] = useState(false);

  /* ── milestone pulse state ── */
  const prevActivated = useRef(new Set());

  /* ── one-time setup: measure path length ── */
  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    totalLen.current = path.getTotalLength();

    // initialise dash for background path (fully visible, faint)
    path.style.strokeDasharray = `${totalLen.current}`;
    path.style.strokeDashoffset = "0";

    // initialise dash for drawn (bright) overlay path
    const dp = drawnPathRef.current;
    if (dp) {
      dp.style.strokeDasharray = `${totalLen.current}`;
      dp.style.strokeDashoffset = `${totalLen.current}`;
    }

    setReady(true);
  }, []);

  /* ── lerp helper for buttery-smooth interpolation ── */
  const lerp = useCallback((a, b, t) => a + (b - a) * t, []);

  /* ── scroll handler with rAF ── */
  useEffect(() => {
    if (!ready) return;

    let currentProgress = 0; // smoothed value
    let targetProgress = 0;
    let animating = false;

    const tick = () => {
      currentProgress = lerp(currentProgress, targetProgress, 0.12);

      // clamp
      if (currentProgress < 0) currentProgress = 0;
      if (currentProgress > 1) currentProgress = 1;

      const len = totalLen.current;
      const drawLen = currentProgress * len;

      /* 1. progressive path draw */
      const dp = drawnPathRef.current;
      if (dp) {
        dp.style.strokeDashoffset = `${len - drawLen}`;
      }

      /* 2. position particle + trail */
      const path = pathRef.current;
      const svg = svgRef.current;
      if (path && particleRef.current && svg) {
        const svgHeight = svg.clientHeight;
        const pt = path.getPointAtLength(drawLen);
        const xPx = (pt.x / 100) * 60;
        const yPx = (pt.y / 1000) * svgHeight;
        const tx = `translate(${xPx}px, ${yPx}px)`;
        particleRef.current.style.transform = tx;
        if (trailRef.current) trailRef.current.style.transform = tx;
      }

      /* 3. milestone pulses */
      MILESTONE_POSITIONS.forEach((mp, i) => {
        const dot = milestoneDots.current[i];
        if (!dot) return;
        const dist = Math.abs(currentProgress - mp);
        const reached = dist < MILESTONE_SNAP_THRESHOLD;

        if (reached && !prevActivated.current.has(i)) {
          prevActivated.current.add(i);
          dot.classList.add("storyline-pulse");
          // remove class after animation so it can re-trigger on re-scroll
          setTimeout(() => {
            dot.classList.remove("storyline-pulse");
            prevActivated.current.delete(i);
          }, 700);
        }

        // subtle proximity glow — scale up slightly when nearby
        const proximity = Math.max(0, 1 - dist * 6);
        dot.style.opacity = 0.45 + proximity * 0.55;
        dot.style.transform = `translate(-50%,-50%) scale(${1 + proximity * 0.5})`;
      });

      // keep ticking while we haven't converged
      if (Math.abs(currentProgress - targetProgress) > 0.0005) {
        rafId.current = requestAnimationFrame(tick);
      } else {
        animating = false;
      }
    };

    const onScroll = () => {
      const section = document.getElementById("features");
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;
      const sectionH = section.offsetHeight;
      const scrollY = window.scrollY;

      // progress 0→1 within the features section (with a little padding)
      const raw = (scrollY - sectionTop + window.innerHeight * 0.35) / sectionH;
      targetProgress = Math.min(1, Math.max(0, raw));

      if (!animating) {
        animating = true;
        rafId.current = requestAnimationFrame(tick);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // fire once to set initial position
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [ready, lerp]);

  /* ── milestone dot positions (computed once) ── */
  const milestonePoints = ready
    ? MILESTONE_POSITIONS.map((p) =>
        pathRef.current?.getPointAtLength(p * totalLen.current)
      )
    : [];

  /* ─────── render ─────── */
  return (
    <div
      className="hidden lg:block"
      style={{
        position: "absolute",
        left: 18,
        top: 0,
        bottom: 0,
        width: 60,
        pointerEvents: "none",
        zIndex: 1,
      }}
      aria-hidden="true"
    >
      {/* inject keyframe for milestone pulse */}
      <style>{`
        @keyframes storylinePulse {
          0%   { box-shadow: 0 0 0 0 rgba(${VIOLET},0.7); }
          70%  { box-shadow: 0 0 18px 8px rgba(${VIOLET},0.0); }
          100% { box-shadow: 0 0 0 0 rgba(${VIOLET},0.0); }
        }
        .storyline-pulse {
          animation: storylinePulse 0.7s ease-out;
        }
      `}</style>

      <svg
        ref={svgRef}
        viewBox="0 0 100 1000"
        preserveAspectRatio="none"
        style={{
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        {/* Background faint path */}
        <path
          ref={pathRef}
          d={CURVE_D}
          fill="none"
          stroke={PATH_IDLE}
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Drawn (bright) overlay path */}
        <path
          ref={drawnPathRef}
          d={CURVE_D}
          fill="none"
          stroke={PATH_DRAWN}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* Milestone dots */}
      {milestonePoints.map((pt, i) => {
        if (!pt) return null;
        // map SVG viewBox coords → pixel coords inside the 60px-wide strip, full height
        const xPx = (pt.x / 100) * 60;
        const yPct = (pt.y / 1000) * 100; // percent of container height

        return (
          <div
            key={i}
            ref={(el) => (milestoneDots.current[i] = el)}
            style={{
              position: "absolute",
              left: xPx,
              top: `${yPct}%`,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: `rgba(${VIOLET},0.6)`,
              boxShadow: `0 0 8px rgba(${VIOLET},0.5), 0 0 20px rgba(${VIOLET},0.2)`,
              opacity: 0.45,
              transform: "translate(-50%,-50%)",
              transition: "opacity 0.3s, transform 0.3s",
              willChange: "opacity, transform",
            }}
          />
        );
      })}

      {/* Trailing afterglow (larger, softer) */}
      <div
        ref={trailRef}
        style={{
          position: "absolute",
          left: -10,
          top: -10,
          width: PARTICLE_SIZE + 20,
          height: PARTICLE_SIZE + 20,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(${VIOLET},0.25) 0%, transparent 70%)`,
          filter: "blur(6px)",
          willChange: "transform",
          pointerEvents: "none",
        }}
      />

      {/* Main glowing particle */}
      <div
        ref={particleRef}
        style={{
          position: "absolute",
          left: -(PARTICLE_SIZE / 2),
          top: -(PARTICLE_SIZE / 2),
          width: PARTICLE_SIZE,
          height: PARTICLE_SIZE,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(${VIOLET},1) 0%, rgba(${VIOLET},0.6) 60%, transparent 100%)`,
          boxShadow: `0 0 20px rgba(${VIOLET},0.8), 0 0 60px rgba(${VIOLET},0.4)`,
          willChange: "transform",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
