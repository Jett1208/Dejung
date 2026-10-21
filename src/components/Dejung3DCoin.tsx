import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Dejung3DCoinProps {
  isOverAllocated: boolean;
  unallocatedBalance: number;
}

export const Dejung3DCoin: React.FC<Dejung3DCoinProps> = ({ isOverAllocated }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const prevMouseXRef = useRef(0);
  const spinVelocityRef = useRef(0.015);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 130;
    const height = container.clientHeight || 130;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    // Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      // WebGL is unsupported or running in headless testing environment
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // Group holding the coin
    const coinGroup = new THREE.Group();
    scene.add(coinGroup);

    // Coin Mesh (Cylinder)
    const coinGeo = new THREE.CylinderGeometry(2.4, 2.4, 0.35, 48);
    // Rotate to face camera
    coinGeo.rotateX(Math.PI / 2);

    // Coin face texture with "D" monogram
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Background circle (Dark Matte Black)
      ctx.fillStyle = '#090B0E';
      ctx.beginPath();
      ctx.arc(128, 128, 120, 0, Math.PI * 2);
      ctx.fill();

      // Outer emerald ring
      ctx.lineWidth = 14;
      ctx.strokeStyle = isOverAllocated ? '#FF5C7A' : '#05DF72';
      ctx.stroke();

      // D Monogram (Drawn upright with crisp font)
      ctx.fillStyle = isOverAllocated ? '#FF5C7A' : '#05DF72';
      ctx.font = 'bold 130px Mitr, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('D', 128, 134);
    }
    const coinTexture = new THREE.CanvasTexture(canvas);
    // Rotate texture 180 degrees so 'D' is standing upright
    coinTexture.center.set(0.5, 0.5);
    coinTexture.rotation = Math.PI;

    const coinMat = new THREE.MeshStandardMaterial({
      color: isOverAllocated ? 0xff477e : 0x05df72,
      metalness: 0.85,
      roughness: 0.25,
      map: coinTexture,
    });

    const coinMesh = new THREE.Mesh(coinGeo, coinMat);
    coinGroup.add(coinMesh);

    // Outer Glow Ring
    const ringGeo = new THREE.TorusGeometry(2.65, 0.06, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: isOverAllocated ? 0xff477e : 0x10b981,
      transparent: true,
      opacity: 0.85,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    coinGroup.add(ringMesh);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(
      isOverAllocated ? 0xff3b5f : 0x05df72,
      3.0
    );
    keyLight.position.set(5, 5, 5);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(
      isOverAllocated ? 0xff85a1 : 0x10b981,
      4.0,
      15
    );
    rimLight.position.set(-4, -4, 3);
    scene.add(rimLight);

    // Interactive Drag / Touch
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevMouseXRef.current = e.clientX;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - prevMouseXRef.current;
      prevMouseXRef.current = e.clientX;
      coinGroup.rotation.y += deltaX * 0.02;
      spinVelocityRef.current = deltaX * 0.01;
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    // Touch Support for Mobile / iPad
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        isDraggingRef.current = true;
        prevMouseXRef.current = e.touches[0].clientX;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length === 0) return;
      const deltaX = e.touches[0].clientX - prevMouseXRef.current;
      prevMouseXRef.current = e.touches[0].clientX;
      coinGroup.rotation.y += deltaX * 0.02;
      spinVelocityRef.current = deltaX * 0.01;
    };

    const onTouchEnd = () => {
      isDraggingRef.current = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Animation Loop
    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      time += 0.03;

      // Gentle floating bob
      coinGroup.position.y = Math.sin(time) * 0.12;

      // Continuous Auto-Spin with Momentum
      if (!isDraggingRef.current) {
        // Base auto-spin speed (steady 0.024 rad/frame = smooth continuous 360 degree revolution)
        spinVelocityRef.current = THREE.MathUtils.lerp(spinVelocityRef.current, 0.024, 0.04);
        coinGroup.rotation.y += spinVelocityRef.current;
      }

      // Elegant fixed 3D tilt with subtle dynamic wobble to display coin thickness and edge glow
      coinGroup.rotation.x = 0.22 + Math.sin(time * 0.6) * 0.05;
      coinGroup.rotation.z = Math.cos(time * 0.4) * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      coinGeo.dispose();
      coinMat.dispose();
      coinTexture.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      renderer.dispose();
    };
  }, [isOverAllocated]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        ref={mountRef}
        title="แตะหรือลากเพื่อหมุนเหรียญ 3D"
        className="w-28 h-28 cursor-grab active:cursor-grabbing touch-none select-none transition-transform hover:scale-105"
      />
      <span className="text-[10px] font-extralight text-slate-400 dark:text-slate-500 mt-0.5">
        แตะลากหมุนเหรียญ 3D
      </span>
    </div>
  );
};
