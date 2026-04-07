import { useEffect, useRef, useState, useCallback } from "react";

interface WalkingPersonProps {
  src: string;
  size?: number;
  speed?: number;
  startX?: number;
  startY?: number;
}

const WalkingPerson = ({
  src,
  size = 70,
  speed = 0.8,
  startX = 0,
  startY = 0,
}: WalkingPersonProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: startX, y: startY });
  const targetRef = useRef({ x: startX, y: startY });
  const facingRef = useRef<1 | -1>(1);
  const animRef = useRef<number>(0);
  const [bobPhase, setBobPhase] = useState(0);
  const isMovingRef = useRef(false);
  const pauseTimerRef = useRef<number>(0);

  const pickNewTarget = useCallback(() => {
    const margin = 10;
    const maxX = window.innerWidth - size - margin;
    const maxY = window.innerHeight - size - margin;
    // Prefer bottom 40% of screen to avoid overlapping header/buttons
    const minY = window.innerHeight * 0.6;

    const x = margin + Math.random() * (maxX - margin);
    const y = minY + Math.random() * (maxY - minY);

    targetRef.current = { x, y };
    facingRef.current = x >= posRef.current.x ? 1 : -1;
    isMovingRef.current = true;
  }, [size]);

  useEffect(() => {
    const minY = window.innerHeight * 0.6;
    posRef.current = {
      x: Math.max(10, Math.min(startX, window.innerWidth - size - 10)),
      y: Math.max(minY, Math.min(startY, window.innerHeight - size - 10)),
    };
    pickNewTarget();

    let lastTime = 0;
    let bobCounter = 0;

    const animate = (time: number) => {
      const dt = lastTime ? (time - lastTime) / 16 : 1;
      lastTime = time;

      if (isMovingRef.current) {
        const dx = targetRef.current.x - posRef.current.x;
        const dy = targetRef.current.y - posRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 3) {
          isMovingRef.current = false;
          pauseTimerRef.current = 80 + Math.random() * 150;
        } else {
          const moveSpeed = speed * dt;
          posRef.current.x += (dx / dist) * moveSpeed;
          posRef.current.y += (dy / dist) * moveSpeed;
          posRef.current.x = Math.max(5, Math.min(posRef.current.x, window.innerWidth - size - 5));
          posRef.current.y = Math.max(window.innerHeight * 0.55, Math.min(posRef.current.y, window.innerHeight - size - 5));

          bobCounter += dt;
          if (bobCounter > 5) {
            bobCounter = 0;
            setBobPhase((p) => (p + 1) % 4);
          }
        }
      } else {
        pauseTimerRef.current -= dt;
        if (pauseTimerRef.current <= 0) pickNewTarget();
      }

      if (ref.current) {
        ref.current.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px)`;
      }
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [speed, startX, startY, pickNewTarget, size]);

  const bobY = bobPhase === 1 ? -4 : bobPhase === 3 ? -2 : 0;
  const bodyTilt = bobPhase === 0 ? -3 : bobPhase === 2 ? 3 : 0;

  return (
    <div
      ref={ref}
      className="absolute top-0 left-0 pointer-events-none"
      style={{ width: size, height: size + 10, zIndex: 15 }}
    >
      <div
        className="flex justify-center"
        style={{
          transform: `scaleX(${facingRef.current}) translateY(${bobY}px) rotate(${bodyTilt}deg)`,
          transition: "transform 0.15s ease",
        }}
      >
        <img src={src} alt="" width={size} height={size} className="object-contain drop-shadow-md" style={{ width: size, height: size }} />
      </div>
      <div
        className="mx-auto rounded-full opacity-15"
        style={{ width: size * 0.5, height: 6, marginTop: -2, backgroundColor: "hsl(var(--foreground))" }}
      />
    </div>
  );
};

export default WalkingPerson;
