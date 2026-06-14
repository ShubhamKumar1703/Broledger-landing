import { useEffect, useRef, useState, useCallback } from "react";

/* ─── constants ─────────────────────────────────────────────── */
const VIOLET = "139,92,246";
const PATH_IDLE = `rgba(${VIOLET},0.12)`;
const PATH_DRAWN = `rgba(${VIOLET},0.45)`;
const PARTICLE_SIZE = 22; // resized to fit logo beautifully
const MILESTONE_SNAP_THRESHOLD = 0.035; // snap range

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
  const [isMobile, setIsMobile] = useState(false);

  /* ── dynamic positions mapped to DOM elements ── */
  const [timelineHeight, setTimelineHeight] = useState(0);
  const [pathD, setPathD] = useState("M 48 0 L 48 1000");
  const [milestonePoints, setMilestonePoints] = useState([]);
  const [milestones, setMilestones] = useState([0.125, 0.375, 0.625, 0.875]);

  /* ── screen size detection ── */
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  /* ── milestone pulse state ── */
  const prevActivated = useRef(new Set());

  /* ── calculate layout dynamically from page elements ── */
  const updateLayout = useCallback(() => {
    const container = document.getElementById("features");
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const scrollTop = window.scrollY;
    const featuresTop = containerRect.top + scrollTop;
    const featuresH = container.offsetHeight;
    const absoluteBottom = featuresTop + featuresH;

    setTimelineHeight(absoluteBottom);

    // Filter children to get segments
    const children = Array.from(container.children).filter(
      (child) => child.tagName === "DIV" && !child.style.position
    );

    const secOcr = document.getElementById("ocr");
    const secCashbook = document.getElementById("cashbook");
    const secSettlements = document.getElementById("settlements");
    const secOrbit = children[children.length - 1];

    if (!secOcr || !secCashbook || !secSettlements || !secOrbit) return;

    // Calculate Y centers relative to document top
    const y1 = secOcr.getBoundingClientRect().top + scrollTop + secOcr.offsetHeight / 2;
    const y2 = secCashbook.getBoundingClientRect().top + scrollTop + secCashbook.offsetHeight / 2;
    const y3 = secSettlements.getBoundingClientRect().top + scrollTop + secSettlements.offsetHeight / 2;
    const y4 = secOrbit.getBoundingClientRect().top + scrollTop + secOrbit.offsetHeight / 2;

    const widthVal = isMobile ? 16 : 96;
    const midX = widthVal / 2;
    
    // Logo starting coordinate on page (matches header brandmark logo position)
    const startX = isMobile ? 12 : 38;
    const startY = 36; // vertical center of sticky header (h-18 = 72px)

    let d = "";
    let dots = [];

    if (isMobile) {
      // Straight timeline on mobile
      d = `M ${startX} ${startY} L ${midX} ${featuresTop} L ${midX} ${absoluteBottom}`;
      dots = [
        { x: midX, y: y1 },
        { x: midX, y: y2 },
        { x: midX, y: y3 },
        { x: midX, y: y4 }
      ];
    } else {
      // Wavy serpentine curve on desktop
      const leftX = 22;
      const rightX = 74;

      d = [
        `M ${startX} ${startY}`,
        `C ${startX} ${startY + 200}, ${midX} ${featuresTop - 150}, ${midX} ${featuresTop - 80}`,
        `C ${midX} ${featuresTop - 20}, ${leftX} ${y1 - 100}, ${leftX} ${y1}`,
        `C ${leftX} ${y1 + 120}, ${rightX} ${y2 - 120}, ${rightX} ${y2}`,
        `C ${rightX} ${y2 + 120}, ${leftX} ${y3 - 120}, ${leftX} ${y3}`,
        `C ${leftX} ${y3 + 120}, ${rightX} ${y4 - 120}, ${rightX} ${y4}`,
        `C ${rightX} ${y4 + 80}, ${midX} ${absoluteBottom - 80}, ${midX} ${absoluteBottom}`
      ].join(" ");

      dots = [
        { x: leftX, y: y1 },
        { x: rightX, y: y2 },
        { x: leftX, y: y3 },
        { x: rightX, y: y4 }
      ];
    }

    setPathD(d);
    setMilestonePoints(dots);
    setMilestones(dots.map((dot) => dot.y / absoluteBottom));
  }, [isMobile]);

  useEffect(() => {
    updateLayout();
    const timer = setTimeout(updateLayout, 500);

    window.addEventListener("resize", updateLayout);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateLayout);
    };
  }, [updateLayout, isMobile]);

  /* ── setup path length measurement ── */
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
  }, [pathD]);

  /* ── lerp helper for smooth interpolation ── */
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
      if (path && particleRef.current) {
        const pt = path.getPointAtLength(drawLen);
        const tx = `translate(${pt.x}px, ${pt.y}px)`;
        particleRef.current.style.transform = tx;
        if (trailRef.current) trailRef.current.style.transform = tx;
      }

      /* 3. milestone pulses */
      milestones.forEach((mp, i) => {
        const dot = milestoneDots.current[i];
        if (!dot) return;
        const dist = Math.abs(currentProgress - mp);
        const reached = dist < MILESTONE_SNAP_THRESHOLD;

        if (reached && !prevActivated.current.has(i)) {
          prevActivated.current.add(i);
          dot.classList.add("storyline-pulse");
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
      const maxScroll = timelineHeight - window.innerHeight * 0.5;
      if (maxScroll <= 0) return;

      const scrollY = window.scrollY;
      targetProgress = Math.min(1, Math.max(0, scrollY / maxScroll));

      if (!animating) {
        animating = true;
        rafId.current = requestAnimationFrame(tick);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [ready, isMobile, milestones, timelineHeight, lerp]);

  /* ─────── render ─────── */
  return (
    <div
      style={{
        position: "absolute",
        left: isMobile ? 4 : 0,
        top: 0,
        height: timelineHeight || "100%",
        width: isMobile ? 16 : 96,
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
        viewBox={`0 0 ${isMobile ? 16 : 96} ${timelineHeight || 1000}`}
        style={{
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        {/* Background faint path */}
        <path
          ref={pathRef}
          d={pathD}
          fill="none"
          stroke={PATH_IDLE}
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Drawn (bright) overlay path */}
        <path
          ref={drawnPathRef}
          d={pathD}
          fill="none"
          stroke={PATH_DRAWN}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* Milestone dots */}
      {milestonePoints.map((pt, i) => {
        return (
          <div
            key={i}
            ref={(el) => (milestoneDots.current[i] = el)}
            style={{
              position: "absolute",
              left: pt.x,
              top: pt.y,
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
          background: `radial-gradient(circle, rgba(${VIOLET},0.2) 0%, transparent 70%)`,
          filter: "blur(6px)",
          willChange: "transform",
          pointerEvents: "none",
        }}
      />

      {/* Main glowing particle (BroLedger Logo) */}
      <div
        ref={particleRef}
        style={{
          position: "absolute",
          left: -(PARTICLE_SIZE / 2),
          top: -(PARTICLE_SIZE / 2),
          width: PARTICLE_SIZE,
          height: PARTICLE_SIZE,
          willChange: "transform",
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src="/logo.svg"
          alt="Brand Indicator"
          style={{
            width: "100%",
            height: "100%",
            filter: "drop-shadow(0 0 5px rgba(139,92,246,0.8)) drop-shadow(0 0 12px rgba(139,92,246,0.4))",
          }}
        />
      </div>
    </div>
  );
}
