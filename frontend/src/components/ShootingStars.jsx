import { useEffect, useRef } from "react";

// A very faint, ambient canvas of drifting stars + occasional shooting stars.
// Deliberately subtle: this is atmosphere, not the focal point.
export default function ShootingStars() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width, height;
    let animationId;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Static twinkling stars
    const stars = Array.from({ length: 110 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.1 + 0.2,
      baseAlpha: Math.random() * 0.4 + 0.15,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      phase: Math.random() * Math.PI * 2,
    }));

    // Shooting stars: rare, faint, diagonal streaks
    let shootingStars = [];
    const spawnShootingStar = () => {
      shootingStars.push({
        x: Math.random() * width * 0.7 + width * 0.3,
        y: Math.random() * height * 0.3,
        len: Math.random() * 120 + 80,
        speed: Math.random() * 4 + 5,
        angle: (200 * Math.PI) / 180,
        life: 0,
        maxLife: 60,
        alpha: 0,
      });
    };

    let frame = 0;
    let nextSpawn = 200 + Math.random() * 300;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // twinkling stars
      stars.forEach((s) => {
        s.phase += s.twinkleSpeed;
        const alpha = s.baseAlpha + Math.sin(s.phase) * 0.15;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(231,233,245,${Math.max(alpha, 0.05)})`;
        ctx.fill();
      });

      if (!prefersReduced) {
        frame++;
        if (frame > nextSpawn) {
          spawnShootingStar();
          frame = 0;
          nextSpawn = 250 + Math.random() * 400;
        }

        shootingStars.forEach((s) => {
          s.life++;
          s.x -= Math.cos(s.angle) * s.speed;
          s.y += Math.sin(s.angle) * s.speed;
          const lifeRatio = s.life / s.maxLife;
          s.alpha = lifeRatio < 0.2 ? lifeRatio / 0.2 : 1 - (lifeRatio - 0.2) / 0.8;

          const tailX = s.x + Math.cos(s.angle) * s.len;
          const tailY = s.y - Math.sin(s.angle) * s.len;
          const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
          grad.addColorStop(0, `rgba(124,92,255,${0.5 * s.alpha})`);
          grad.addColorStop(1, "rgba(124,92,255,0)");
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.3;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();
        });
        shootingStars = shootingStars.filter((s) => s.life < s.maxLife);
      }

      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
