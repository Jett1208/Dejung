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

    // Create floating luminous particles (like digital money dust)
    const particleCount = 70;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);

    const mintColor = new THREE.Color(isDark ? '#72F6BD' : '#10b981');
    const limeColor = new THREE.Color(isDark ? '#D9FF62' : '#059669');
    const purpleColor = new THREE.Color(isDark ? '#A985FF' : '#6366f1');

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;

      // Randomly pick brand color
      const rand = Math.random();
      const chosenColor = rand > 0.6 ? limeColor : rand > 0.3 ? mintColor : purpleColor;
      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;

      speeds[i] = 0.02 + Math.random() * 0.03;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle texture (soft circle)
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
      size: isDark ? 2.8 : 2.0,
      map: texture,
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 0.65 : 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Floating subtle 3D geometric tokens (Icosahedrons)
    const tokenCount = 8;
    const tokens: THREE.Mesh[] = [];
    const tokenGeo = new THREE.IcosahedronGeometry(0.9, 0);

    for (let i = 0; i < tokenCount; i++) {
      const tokenMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? limeColor : mintColor,
        wireframe: true,
        transparent: true,
        opacity: isDark ? 0.35 : 0.2,
      });
      const mesh = new THREE.Mesh(tokenGeo, tokenMat);
      mesh.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50,
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
      const posAttr = geometry.attributes.position;
      const array = posAttr.array as Float32Array;

      // Drift particles upward
      for (let i = 0; i < particleCount; i++) {
        array[i * 3 + 1] += speeds[i];
        if (array[i * 3 + 1] > 30) {
          array[i * 3 + 1] = -30;
        }
      }
      posAttr.needsUpdate = true;

      // Rotate tokens
      tokens.forEach((token, idx) => {
        token.rotation.x += delta * (0.3 + idx * 0.05);
        token.rotation.y += delta * (0.4 + idx * 0.05);
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
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

  return <div ref={mountRef} className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" />;
};
