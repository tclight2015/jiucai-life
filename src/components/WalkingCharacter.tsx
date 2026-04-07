import { useEffect, useRef, useState, useCallback } from "react";

interface Props {
  src: string;
  size?: number;
  speed?: number;
  startX?: number;
  startY?: number;
}

const WalkingCharacter = ({ src, size = 100, speed = 1, startX = 0, startY = 0 }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: startX, y: startY });
  const targetRef = useRef({ x: startX, y: startY });
  const facingRef = useRef<1 | -1>(1);
  const animRef = useRef<number>(0);
  const [bobPhase, setBobPhase] = useState(0);
  const isMovingRef = useRef(false);
  const pauseTimerRef = useRef<number>(0);

  const pickNewTarget = useCallback(() => {
    const maxX = window.innerWidth - size;
    const maxY = window.innerHeight - size - 40;
    targetRef.current = {
      x: Math.random() * maxX,
      y: Math.max(100, Math.random() * maxY),
    };
    const dx = targetRef.current.x - posRef.current.x;
    facingRef.current = dx >= 0 ? 1 : -1;
    isMovingRef.current = true;
  }, [size]);

  useEffect(() => {
    posRef.current = { x: startX, y: startY };
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
          pauseTimerRef.current = 60 + Math.random() * 120;
        } else {
          const moveSpeed = speed * dt;
          posRef.current.x += (dx / dist) * moveSpeed;
          posRef.current.y += (dy / dist) * moveSpeed;
          bobCounter += dt;
          if (bobCounter > 4) {
            bobCounter = 0;
            setBobPhase((p) => (p + 1) % 2);
          }
        }
      } else {
        pauseTimerRef.current -= dt;
        if (pauseTimerRef.current <= 0) {
          pickNewTarget();
        }
      }

      if (ref.current) {
        ref.current.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px) scaleX(${facingRef.current})`;
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [speed, startX, startY, pickNewTarget]);

  return (
    <div
      ref={ref}
      className="absolute top-0 left-0 transition-none pointer-events-none"
      style={{ width: size, height: size }}
    >
      <img
        src={src}
        alt="character"
        width={size}
        height={size}
        className="w-full h-full object-contain drop-shadow-lg"
        style={{
          transform: `translateY(${bobPhase === 1 && isMovingRef.current ? -4 : 0}px)`,
          transition: "transform 0.15s ease",
        }}
      />
      {/* Shadow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full opacity-20"
        style={{
          width: size * 0.5,
          height: size * 0.1,
          backgroundColor: "hsl(var(--foreground))",
        }}
      />
    </div>
  );
};

export default WalkingCharacter;
