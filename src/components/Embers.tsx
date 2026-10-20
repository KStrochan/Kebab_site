// Slow gold sparks drifting up behind the hero content. Pure CSS, fixed values (no randomness)
// so server and client markup always match. Hidden from assistive tech; frozen by reduced motion.
const SPARKS = [
  { left: 6, size: 3, dur: 11, delay: 0 },
  { left: 13, size: 2, dur: 14, delay: 4 },
  { left: 21, size: 4, dur: 12, delay: 7 },
  { left: 29, size: 2, dur: 16, delay: 2 },
  { left: 37, size: 3, dur: 13, delay: 9 },
  { left: 46, size: 2, dur: 15, delay: 5 },
  { left: 54, size: 4, dur: 12, delay: 1 },
  { left: 62, size: 3, dur: 17, delay: 8 },
  { left: 70, size: 2, dur: 13, delay: 3 },
  { left: 78, size: 4, dur: 14, delay: 6 },
  { left: 86, size: 3, dur: 11, delay: 10 },
  { left: 93, size: 2, dur: 16, delay: 2 },
];

export function Embers() {
  return (
    <div className="embers" aria-hidden="true">
      {SPARKS.map((s, i) => (
        <span
          key={i}
          style={{
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            animationDuration: `${s.dur}s`,
            animationDelay: `-${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
