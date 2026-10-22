import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Ambient3DBackgroundProps {
  isDark: boolean;
}

export const Ambient3DBackground: React.FC<Ambient3DBackgroundProps> = ({ isDark }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;

    // Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'low-power',
      });
    } catch {
      // WebGL unsupported or in headless test environment
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Floating luminous 3D particles with rich emerald glow
    const particleCount = 80;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);

    const vibrantGreen = new THREE.Color(isDark ? '#05DF72' : '#059669');
    const emeraldGreen = new THREE.Color(isDark ? '#10B981' : '#10b981');
    const mintGreen = new THREE.Color(isDark ? '#34D399' : '#047857');

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;

      const rand = Math.random();
      const chosenColor = rand > 0.6 ? vibrantGreen : rand > 0.3 ? emeraldGreen : mintGreen;
      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;

      speeds[i] = 0.015 + Math.random() * 0.025;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.3, 'rgba(255,255,255,0.7)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
    }
    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: isDark ? 3.4 : 2.0,
      map: texture,
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 0.75 : 0.40,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Subtle floating geometric tokens
    const tokenCount = 8;
    const tokens: THREE.Mesh[] = [];
    const tokenGeo = new THREE.IcosahedronGeometry(0.85, 0);

    for (let i = 0; i < tokenCount; i++) {
      const tokenMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? vibrantGreen : emeraldGreen,
        wireframe: true,
        transparent: true,
        opacity: isDark ? 0.35 : 0.20,
      });
      const mesh = new THREE.Mesh(tokenGeo, tokenMat);
      mesh.position.set(
        (Math.random() - 0.5) * 45,
        (Math.random() - 0.5) * 45,
        (Math.random() - 0.5) * 20
      );
      scene.add(mesh);
      tokens.push(mesh);
    }

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (prefersReducedMotion) {
        renderer.render(scene, camera);
        return;
      }

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();
      const posAttr = geometry.attributes.position;
      const array = posAttr.array as Float32Array;

      // Drift particles upward with subtle undulating wave
      for (let i = 0; i < particleCount; i++) {
        array[i * 3 + 1] += speeds[i];
        array[i * 3] += Math.sin(elapsedTime * 0.5 + i) * 0.015;
        if (array[i * 3 + 1] > 30) {
          array[i * 3 + 1] = -30;
        }
      }
      posAttr.needsUpdate = true;

      // Gentle rotation
      tokens.forEach((token, idx) => {
        token.rotation.x += delta * (0.2 + idx * 0.04);
        token.rotation.y += delta * (0.25 + idx * 0.04);
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      texture.dispose();
      tokenGeo.dispose();
      tokens.forEach((t) => (t.material as THREE.Material).dispose());
      renderer.dispose();
    };
  }, [isDark]);

  return (
    <>
      {/* Background Animated Blobs for Glass Translucency */}
      <div className="blob-container">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      {/* 3D WebGL Canvas Layer */}
      <div ref={mountRef} className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" />
    </>
  );
};
