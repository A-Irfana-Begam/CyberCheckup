import { useMemo } from 'react';

const PARTICLE_COUNT = 48;

function createParticles(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${(i * 17 + 7) % 100}%`,
    top: `${(i * 23 + 11) % 100}%`,
    size: i % 5 === 0 ? 3 : i % 3 === 0 ? 2 : 1,
    delay: `${(i * 0.37) % 6}s`,
    duration: `${3 + (i % 4)}s`,
    opacity: 0.15 + (i % 5) * 0.08,
  }));
}

export default function SparkleBackground() {
  const particles = useMemo(() => createParticles(PARTICLE_COUNT), []);

  return (
    <div className="sparkle-bg" aria-hidden="true">
      <div className="sparkle-bg__ambient sparkle-bg__ambient--1" />
      <div className="sparkle-bg__ambient sparkle-bg__ambient--2" />
      <div className="sparkle-bg__ambient sparkle-bg__ambient--3" />
      <div className="sparkle-bg__grid" />
      {particles.map((p) => (
        <span
          key={p.id}
          className="sparkle-bg__particle"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
}
