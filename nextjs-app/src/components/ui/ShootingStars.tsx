"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
}

export default function ShootingStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let stars: Star[] = [];
    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const addStar = () => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height * 0.5;
      const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.3;
      const speed = 3 + Math.random() * 4;
      const maxLife = 60 + Math.random() * 60;
      stars.push({
        x, y,
        vx: Math.cos(angle) * speed * -1,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife,
        size: 1.5 + Math.random() * 2,
        hue: Math.random() > 0.5 ? 260 : 180, // violet or teal
      });
    };

    let frame = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      if (frame % 90 === 0) addStar();

      stars = stars.filter((s) => s.life < s.maxLife);
      for (const s of stars) {
        s.life++;
        s.x += s.vx;
        s.y += s.vy;

        const progress = s.life / s.maxLife;
        const alpha = progress < 0.1 ? progress / 0.1 : 1 - (progress - 0.1) / 0.9;
        const len = 60 + s.size * 20;

        const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * (len / (Math.abs(s.vx) || 1)), s.y - s.vy * (len / (Math.abs(s.vy) || 1)));
        grad.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.9})`);
        grad.addColorStop(1, `rgba(255, 255, 255, 0)`);

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * 15, s.y - s.vy * 15);
        ctx.strokeStyle = grad;
        ctx.lineWidth = s.size;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}
