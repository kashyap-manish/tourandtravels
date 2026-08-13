import { useEffect, useRef } from 'react';

const SLIDES = [
  'https://s3-us-west-2.amazonaws.com/s.cdpn.io/175711/winter.jpg',
  'https://s3-us-west-2.amazonaws.com/s.cdpn.io/175711/spring.jpg',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80',
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80',
];

function loadScript(src) {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = resolve; // don't block on error
    document.head.appendChild(s);
  });
}

export default function SlideShow() {
  const mountRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    let cleanup = null;

    async function init() {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r83/three.min.js');
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/1.20.3/TweenMax.min.js');
      if (cancelled || !mountRef.current) return;

      const THREE = window.THREE;
      const TweenMax = window.TweenMax;
      const TimelineMax = window.TimelineMax;
      const Power0 = window.Power0;

      if (!THREE || !TweenMax) return;

      const container = mountRef.current;
      const rect = container.getBoundingClientRect();
      const W = rect.width || window.innerWidth;
      const H = rect.height || window.innerHeight;

      // ── Renderer ──
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
      renderer.setSize(W, H);
      renderer.setClearColor(0x111111, 1);
      container.appendChild(renderer.domElement);

      // ── Camera ──
      const camera = new THREE.PerspectiveCamera(80, W / H, 1, 10000);
      camera.position.z = 60;

      const scene = new THREE.Scene();

      // ── Resize ──
      function onResize() {
        if (!container) return;
        const r = container.getBoundingClientRect();
        const w = r.width || window.innerWidth;
        const h = r.height || window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
      window.addEventListener('resize', onResize);

      // ── Render loop ──
      let rafId;
      function tick() {
        rafId = requestAnimationFrame(tick);
        renderer.render(scene, camera);
      }
      tick();

      // ── Build shatter geometry from a plane ──
      // Each triangle gets its own vertices (separated faces)
      function buildShatterGeometry(planeW, planeH, segW, segH) {
        const geo = new THREE.BufferGeometry();
        const positions = [];
        const uvs = [];
        const delays = [];
        const durations = [];
        const startPos = [];
        const cp0 = [];
        const cp1 = [];
        const endPos = [];

        const dx = planeW / segW;
        const dy = planeH / segH;

        const minDur = 0.8, maxDur = 1.2;
        const maxDelayX = 0.9, maxDelayY = 0.125, stretch = 0.11;

        for (let iy = 0; iy < segH; iy++) {
          for (let ix = 0; ix < segW; ix++) {
            // two triangles per cell
            const x0 = -planeW / 2 + ix * dx;
            const x1 = x0 + dx;
            const y0 = -planeH / 2 + iy * dy;
            const y1 = y0 + dy;

            const tris = [
              [[x0, y1], [x0, y0], [x1, y0]],
              [[x0, y1], [x1, y0], [x1, y1]],
            ];

            for (const tri of tris) {
              const cx = (tri[0][0] + tri[1][0] + tri[2][0]) / 3;
              const cy = (tri[0][1] + tri[1][1] + tri[2][1]) / 3;

              const dur = minDur + Math.random() * (maxDur - minDur);
              const dX = THREE.Math.mapLinear(cx, -planeW / 2, planeW / 2, 0, maxDelayX);
              const dY = THREE.Math.mapLinear(Math.abs(cy), 0, planeH / 2, maxDelayY, 0);
              const delay = dX + dY + Math.random() * stretch * dur;

              // bezier control points
              const signY = Math.sign(cy) || 1;
              const c0x = cx + THREE.Math.randFloat(0.1, 0.3) * 50;
              const c0y = cy + signY * THREE.Math.randFloat(0.1, 0.3) * 70;
              const c0z = THREE.Math.randFloatSpread(20);
              const c1x = cx + THREE.Math.randFloat(0.3, 0.6) * 50;
              const c1y = cy - signY * THREE.Math.randFloat(0.3, 0.6) * 70;
              const c1z = THREE.Math.randFloatSpread(20);

              for (const [vx, vy] of tri) {
                // local position (relative to centroid)
                positions.push(vx - cx, vy - cy, 0);
                // uv
                uvs.push((vx + planeW / 2) / planeW, (vy + planeH / 2) / planeH);
                // animation data
                delays.push(delay);
                durations.push(dur);
                startPos.push(cx, cy, 0);
                cp0.push(c0x, c0y, c0z);
                cp1.push(c1x, c1y, c1z);
                endPos.push(cx, cy, 0);
              }
            }
          }
        }

        geo.addAttribute('position',      new THREE.BufferAttribute(new Float32Array(positions), 3));
        geo.addAttribute('uv',            new THREE.BufferAttribute(new Float32Array(uvs), 2));
        geo.addAttribute('aDelay',        new THREE.BufferAttribute(new Float32Array(delays), 1));
        geo.addAttribute('aDuration',     new THREE.BufferAttribute(new Float32Array(durations), 1));
        geo.addAttribute('aStartPos',     new THREE.BufferAttribute(new Float32Array(startPos), 3));
        geo.addAttribute('aControl0',     new THREE.BufferAttribute(new Float32Array(cp0), 3));
        geo.addAttribute('aControl1',     new THREE.BufferAttribute(new Float32Array(cp1), 3));
        geo.addAttribute('aEndPos',       new THREE.BufferAttribute(new Float32Array(endPos), 3));

        return { geo, totalDuration: maxDur + maxDelayX + maxDelayY + stretch };
      }

      // ── Shader material ──
      const vertexShader = `
        uniform float uTime;
        uniform bool uOut;
        attribute float aDelay;
        attribute float aDuration;
        attribute vec3 aStartPos;
        attribute vec3 aControl0;
        attribute vec3 aControl1;
        attribute vec3 aEndPos;
        varying vec2 vUv;

        vec3 cubicBezier(vec3 p0, vec3 p1, vec3 p2, vec3 p3, float t) {
          float t2 = t * t;
          float t3 = t2 * t;
          float mt = 1.0 - t;
          float mt2 = mt * mt;
          float mt3 = mt2 * mt;
          return mt3*p0 + 3.0*mt2*t*p1 + 3.0*mt*t2*p2 + t3*p3;
        }

        float easeInOutCubic(float t) {
          return t < 0.5 ? 4.0*t*t*t : 1.0 - pow(-2.0*t + 2.0, 3.0) / 2.0;
        }

        void main() {
          vUv = uv;
          float tTime = clamp(uTime - aDelay, 0.0, aDuration);
          float tProgress = easeInOutCubic(tTime / aDuration);

          vec3 bezierPos = cubicBezier(aStartPos, aControl0, aControl1, aEndPos, tProgress);
          vec3 localPos = position * (uOut ? (1.0 - tProgress) : tProgress);
          vec3 worldPos = localPos + bezierPos;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(worldPos, 1.0);
        }
      `;

      const fragmentShader = `
        uniform sampler2D uMap;
        varying vec2 vUv;
        void main() {
          gl_FragColor = texture2D(uMap, vUv);
        }
      `;

      function createSlide(phase) {
        const { geo, totalDuration } = buildShatterGeometry(100, 60, 200, 120);
        const mat = new THREE.ShaderMaterial({
          uniforms: {
            uTime: { value: 0 },
            uOut:  { value: phase === 'out' },
            uMap:  { value: new THREE.Texture() },
          },
          vertexShader,
          fragmentShader,
          side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.frustumCulled = false;
        mesh._totalDuration = totalDuration;
        mesh._phase = phase;
        return mesh;
      }

      function setSlideImage(slide, url) {
        const loader = new THREE.TextureLoader();
        loader.crossOrigin = 'Anonymous';
        loader.load(url, (tex) => {
          slide.material.uniforms.uMap.value = tex;
          slide.material.uniforms.uMap.value.needsUpdate = true;
        });
      }

      // ── Create slides ──
      const slideOut = createSlide('out');
      const slideIn  = createSlide('in');
      scene.add(slideOut);
      scene.add(slideIn);

      let idx = 0;
      setSlideImage(slideOut, SLIDES[0]);
      setSlideImage(slideIn,  SLIDES[1]);

      // ── Timeline ──
      function makeTimeline() {
        const tl = new TimelineMax({
          repeat: -1,
          repeatDelay: 2,
          yoyo: true,
          onRepeat: () => {
            idx = (idx + 1) % SLIDES.length;
            setSlideImage(slideOut, SLIDES[idx]);
            setSlideImage(slideIn,  SLIDES[(idx + 1) % SLIDES.length]);
          },
        });
        tl.fromTo(slideOut.material.uniforms.uTime, slideOut._totalDuration,
          { value: 0 }, { value: slideOut._totalDuration, ease: Power0.easeNone }, 0);
        tl.fromTo(slideIn.material.uniforms.uTime, slideIn._totalDuration,
          { value: 0 }, { value: slideIn._totalDuration, ease: Power0.easeNone }, 0);
        return tl;
      }

      const tl = makeTimeline();

      // ── Drag scrubber ──
      let mouseDown = false, _cx = 0;
      const el = renderer.domElement;
      el.style.cursor = 'grab';

      function stop()   { TweenMax.to(tl, 0.5, { timeScale: 0 }); }
      function resume() { TweenMax.to(tl, 0.5, { timeScale: 1 }); }
      function seek(dx) {
        const p = Math.min(1, Math.max(0, tl.progress() + dx * 0.001));
        tl.progress(p);
      }

      el.addEventListener('mousedown',  e => { mouseDown = true; _cx = e.clientX; stop(); el.style.cursor = 'ew-resize'; });
      el.addEventListener('mouseup',    ()  => { mouseDown = false; resume(); el.style.cursor = 'grab'; });
      el.addEventListener('mouseleave', ()  => { if (mouseDown) { mouseDown = false; resume(); el.style.cursor = 'grab'; } });
      el.addEventListener('mousemove',  e => { if (mouseDown) { seek(e.clientX - _cx); _cx = e.clientX; } });
      el.addEventListener('touchstart', e => { _cx = e.touches[0].clientX; stop(); e.preventDefault(); }, { passive: false });
      el.addEventListener('touchend',   e => { resume(); e.preventDefault(); }, { passive: false });
      el.addEventListener('touchmove',  e => { seek(e.touches[0].clientX - _cx); _cx = e.touches[0].clientX; e.preventDefault(); }, { passive: false });

      cleanup = () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener('resize', onResize);
        tl.kill();
        renderer.dispose();
        if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      };
    }

    init();
    return () => { cancelled = true; cleanup?.(); };
  }, []);

  return (
    <div ref={mountRef} className="w-full h-full" style={{ display: 'block', minHeight: '100%' }} />
  );
}

