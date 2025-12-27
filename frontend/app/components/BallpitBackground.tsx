'use client';

import { useEffect, useRef } from 'react';

interface Ball {
  baseX: number; // Original fixed position
  baseY: number;
  x: number; // Current position (with pan effect)
  y: number;
  radius: number;
  color: string;
  z: number; // Depth for 3D effect
}

export default function BallpitBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballsRef = useRef<Ball[]>([]);
  const animationFrameRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });
  const panOffsetRef = useRef({ x: 0, y: 0 });
  const targetPanRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize mouse to center
    mouseRef.current = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };

    // Ball colors
    const colors = [
      '#5B7C99',
      '#90A4AE',
      '#ECEFF1',
      '#F7F8F9',
      '#4A6B88',
      '#B0BEC5',
    ];

    // Initialize balls at screen edges (closer to center)
    const initializeBalls = () => {
      const ballCount = 70; // Increased for better coverage
      const balls: Ball[] = [];
      const edgeMargin = 30; // Small margin for balls slightly off-screen
      const centerZone = 0.4; // 40% of screen width/height from edges is the "edge zone"

      for (let i = 0; i < ballCount; i++) {
        const baseRadius = Math.random() * 20 + 10;
        let baseX: number, baseY: number;
        
        // Position balls pushed to sides but closer to center
        const edge = Math.floor(Math.random() * 4);
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const edgeZoneWidth = canvas.width * centerZone;
        const edgeZoneHeight = canvas.height * centerZone;
        
        switch (edge) {
          case 0: // Left side
            baseX = -edgeMargin + Math.random() * edgeZoneWidth;
            baseY = Math.random() * canvas.height;
            break;
          case 1: // Right side
            baseX = canvas.width - edgeZoneWidth + Math.random() * (edgeZoneWidth + edgeMargin);
            baseY = Math.random() * canvas.height;
            break;
          case 2: // Top side
            baseX = Math.random() * canvas.width;
            baseY = -edgeMargin + Math.random() * edgeZoneHeight;
            break;
          case 3: // Bottom side
            baseX = Math.random() * canvas.width;
            baseY = canvas.height - edgeZoneHeight + Math.random() * (edgeZoneHeight + edgeMargin);
            break;
          default:
            baseX = Math.random() * canvas.width;
            baseY = Math.random() * canvas.height;
        }

        balls.push({
          baseX: baseX,
          baseY: baseY,
          x: baseX,
          y: baseY,
          radius: baseRadius,
          color: colors[Math.floor(Math.random() * colors.length)],
          z: Math.random() * 100 + 50, // Depth value (50-150)
        });
      }

      ballsRef.current = balls;
    };

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Recalculate ball positions on resize
      initializeBalls();
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    initializeBalls();

    // Track mouse position for pan effect
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      // Calculate normalized mouse position (-1 to 1)
      const normalizedX = (e.clientX - centerX) / centerX;
      const normalizedY = (e.clientY - centerY) / centerY;
      
      // Set target pan (subtle movement)
      targetPanRef.current = {
        x: normalizedX * 30, // Max 30px pan
        y: normalizedY * 30,
      };
      
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Helper function to convert hex to rgba
    const hexToRgba = (hex: string, alpha: number): string => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smoothly interpolate pan offset
      panOffsetRef.current.x += (targetPanRef.current.x - panOffsetRef.current.x) * 0.1;
      panOffsetRef.current.y += (targetPanRef.current.y - panOffsetRef.current.y) * 0.1;

      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;
      const panX = panOffsetRef.current.x;
      const panY = panOffsetRef.current.y;
      const maxDistance = 200; // Maximum distance for cursor effect

      const balls = ballsRef.current;
      balls.forEach((ball) => {
        // Apply pan effect to base position (fixed but moves with mouse)
        ball.x = ball.baseX + panX;
        ball.y = ball.baseY + panY;

        // Calculate distance from cursor for 3D effect
        const dx = ball.x - mouseX;
        const dy = ball.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Apply 3D effect based on cursor proximity (scale and opacity)
        let scale = 1;
        let opacity = 0.6;
        
        if (distance < maxDistance) {
          // Scale radius based on distance (closer = larger, creating depth)
          scale = 1 + (1 - distance / maxDistance) * 0.5;
          ball.z = 50 + (1 - distance / maxDistance) * 100; // Bring closer
          opacity = 0.6 + (1 - distance / maxDistance) * 0.4; // More opaque when closer
        } else {
          // Gradually return to base
          ball.z += (100 - ball.z) * 0.1;
          opacity = 0.6;
        }

        // Calculate opacity and size based on depth (z-index)
        const depthFactor = ball.z / 150; // Normalize to 0-1
        const finalOpacity = opacity + depthFactor * 0.2; // 0.6 to 1.0
        const sizeMultiplier = 0.8 + depthFactor * 0.4; // 0.8 to 1.2

        // Draw ball with 3D effect
        const drawRadius = ball.radius * scale * sizeMultiplier;
        
        ctx.save();
        
        // Create gradient for 3D sphere effect
        const gradient = ctx.createRadialGradient(
          ball.x - drawRadius * 0.3,
          ball.y - drawRadius * 0.3,
          0,
          ball.x,
          ball.y,
          drawRadius
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${0.4 * finalOpacity})`);
        gradient.addColorStop(0.5, hexToRgba(ball.color, finalOpacity));
        gradient.addColorStop(1, hexToRgba(ball.color, finalOpacity * 0.7));

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, drawRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Add highlight for 3D effect
        const highlightGradient = ctx.createRadialGradient(
          ball.x - drawRadius * 0.4,
          ball.y - drawRadius * 0.4,
          0,
          ball.x - drawRadius * 0.2,
          ball.y - drawRadius * 0.2,
          drawRadius * 0.3
        );
        highlightGradient.addColorStop(0, `rgba(255, 255, 255, ${0.6 * finalOpacity})`);
        highlightGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = highlightGradient;
        ctx.fill();

        ctx.restore();
      });

      // Draw connections between nearby balls (with depth consideration)
      balls.forEach((ball, i) => {
        balls.slice(i + 1).forEach((otherBall) => {
          const dx = otherBall.x - ball.x;
          const dy = otherBall.y - ball.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            // Calculate average depth for connection opacity
            const avgDepth = (ball.z + otherBall.z) / 2;
            const depthFactor = avgDepth / 150;
            const connectionOpacity = (0.15 + depthFactor * 0.1) * (1 - distance / 150);

            ctx.beginPath();
            ctx.moveTo(ball.x, ball.y);
            ctx.lineTo(otherBall.x, otherBall.y);
            ctx.strokeStyle = `rgba(91, 124, 153, ${connectionOpacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
}
