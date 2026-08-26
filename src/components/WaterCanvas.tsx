"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Zero-dependency WebGL water layer for hero imagery.
 *
 * Refracts the photo through three stacked displacement fields:
 *   1. concentric ripples radiating from the pointer,
 *   2. procedural droplets running down the glass with trails,
 *   3. a slow noise "flow" so the surface is never fully still.
 *
 * Shader math adapted from the 21st.dev catalogue
 * (ruixen.ui/ripple-distortion, paper-design/water — Apache-2.0),
 * rewritten without three.js and extended with droplet trails and
 * chromatic aberration.
 *
 * The <img> underneath stays the LCP element; the canvas fades in on top
 * once the context is live, and never renders at all on reduced-motion
 * or when WebGL is unavailable.
 */

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform sampler2D u_tex;
uniform vec2  u_res;
uniform vec2  u_img;
uniform float u_time;
uniform vec2  u_mouse;
uniform float u_mouseOn;
uniform float u_drops;

varying vec2 v_uv;

vec2 coverUV(vec2 uv) {
  float rs = u_res.x / max(u_res.y, 1.0);
  float ri = u_img.x / max(u_img.y, 1.0);
  vec2 s = rs < ri ? vec2(ri / rs, 1.0) : vec2(1.0, rs / ri);
  return (uv - 0.5) / s + 0.5;
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

/* Droplets sliding down the pane, each dragging a thin trail. */
vec2 dropField(vec2 uv, float t, out float glint) {
  vec2 d = vec2(0.0);
  glint = 0.0;

  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    float speed = 0.055 + hash(vec2(fi, 1.7)) * 0.085;
    float x     = 0.06 + hash(vec2(fi, 2.3)) * 0.88;
    float phase = hash(vec2(fi, 3.1));
    float r     = 0.014 + hash(vec2(fi, 4.9)) * 0.016;

    float y = 1.18 - fract(t * speed + phase) * 1.38;

    vec2 p = uv - vec2(x, y);
    p.x *= 1.35;

    float head  = smoothstep(r, 0.0, length(p));
    float above = step(y, uv.y);
    float trail = above
                * smoothstep(0.2, 0.0, uv.y - y)
                * smoothstep(r * 0.7, 0.0, abs(p.x))
                * 0.35;

    float m = head + trail;
    d += normalize(p + vec2(1e-5)) * m * 0.013;
    glint += head + trail * 0.5;
  }
  return d * u_drops;
}

void main() {
  vec2 uv = v_uv;

  /* 1 — pointer ripples (aspect-corrected so the field stays circular) */
  float aspect = u_res.x / max(u_res.y, 1.0);
  vec2  md     = (uv - u_mouse) * vec2(aspect, 1.0);
  float dist   = length(md);
  float ripple = sin(dist * 20.0 - u_time * 2.6) * 0.0055 * exp(-dist * 6.5);
  vec2  rip    = normalize(uv - u_mouse + vec2(1e-5)) * ripple * u_mouseOn;

  /* 2 — droplets */
  float glint;
  vec2 drp = dropField(uv, u_time, glint);

  /* 3 — ambient flow */
  float n1 = noise(uv * 3.2 + vec2(0.0, u_time * 0.045));
  float n2 = noise(uv * 6.4 - vec2(u_time * 0.028, 0.0));
  vec2  flow = vec2(n1 - 0.5, n2 - 0.5) * 0.0026;

  vec2 disp = rip + drp + flow;
  vec2 base = coverUV(uv);

  /* chromatic split along the displacement vector */
  vec3 col;
  col.r = texture2D(u_tex, base + disp * 1.03).r;
  col.g = texture2D(u_tex, base + disp).g;
  col.b = texture2D(u_tex, base + disp * 0.97).b;

  /* wet specular where the surface bends hardest */
  float spec = clamp(length(disp) * 26.0, 0.0, 1.0);
  col += spec * 0.09 + glint * 0.05;

  /* the pointer wipes the glass clean: a crisper, richer disc that follows it */
  float clean = smoothstep(0.24, 0.02, dist) * u_mouseOn;
  float lum   = dot(col, vec3(0.299, 0.587, 0.114));
  vec3  crisp = mix(vec3(lum), col * 1.035, 1.14);
  col = mix(col, crisp, clean);

  /* bright meniscus at the edge of the wipe */
  float rim = smoothstep(0.262, 0.238, dist) - smoothstep(0.238, 0.208, dist);
  col += rim * 0.055 * u_mouseOn;

  gl_FragColor = vec4(col, 1.0);
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[WaterCanvas] shader compile failed", gl.getShaderInfoLog(sh));
    }
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export default function WaterCanvas({
  src,
  className = "",
  drops = 1,
}: {
  src: string;
  className?: string;
  drops?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Not worth the battery or the frame budget on phones and low-core
    // machines — the plain photo underneath already looks right.
    if (window.innerWidth < 768) return;
    if ((navigator.hardwareConcurrency ?? 8) <= 4) return;

    const gl = (canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      premultipliedAlpha: false,
      powerPreference: "low-power",
    }) ||
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[WaterCanvas] link failed", gl.getProgramInfoLog(prog));
      }
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const U = {
      tex: gl.getUniformLocation(prog, "u_tex"),
      res: gl.getUniformLocation(prog, "u_res"),
      img: gl.getUniformLocation(prog, "u_img"),
      time: gl.getUniformLocation(prog, "u_time"),
      mouse: gl.getUniformLocation(prog, "u_mouse"),
      mouseOn: gl.getUniformLocation(prog, "u_mouseOn"),
      drops: gl.getUniformLocation(prog, "u_drops"),
    };

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([16, 16, 18, 255]),
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.uniform1i(U.tex, 0);
    gl.uniform2f(U.img, 16, 9);
    gl.uniform1f(U.drops, drops);

    let raf = 0;
    let disposed = false;
    const start = performance.now();
    const pointer = { x: 0.5, y: 0.5, on: 0, targetOn: 0 };
    const smooth = { x: 0.5, y: 0.5 };

    const resize = () => {
      // The refraction is soft by nature, so it survives being rendered below
      // device resolution — and that is what keeps the hero off the main
      // thread's critical path.
      const dpr = Math.min(window.devicePixelRatio || 1, 1);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (w === 0 || h === 0) return;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(U.res, w, h);
    };

    const img = new Image();
    img.decoding = "async";
    img.src = src;
    img.onload = () => {
      if (disposed) return;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.uniform2f(U.img, img.naturalWidth, img.naturalHeight);
      setLive(true);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = canvas.getBoundingClientRect();
      pointer.x = (e.clientX - r.left) / r.width;
      pointer.y = 1 - (e.clientY - r.top) / r.height;
      pointer.targetOn = 1;
    };
    const onLeave = () => {
      pointer.targetOn = 0;
    };

    // While the page is moving, the hero is flying past anyway — give the whole
    // frame budget to the scroll and resume the water once it settles.
    let scrolling = false;
    let scrollTimer = 0;
    const onScroll = () => {
      scrolling = true;
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => {
        scrolling = false;
      }, 160);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });

    // ~40fps is indistinguishable for water this slow and leaves the rest of
    // the frame budget to scrolling.
    const MIN_FRAME_MS = 1000 / 40;
    let lastDraw = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || scrolling || document.hidden) return;
      if (now - lastDraw < MIN_FRAME_MS) return;
      lastDraw = now;

      smooth.x += (pointer.x - smooth.x) * 0.16;
      smooth.y += (pointer.y - smooth.y) * 0.16;
      pointer.on += (pointer.targetOn - pointer.on) * 0.1;

      gl.uniform1f(U.time, (now - start) / 1000);
      gl.uniform2f(U.mouse, smooth.x, smooth.y);
      gl.uniform1f(U.mouseOn, pointer.on);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(scrollTimer);
      gl.deleteTexture(tex);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [src, drops]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none h-full w-full transition-opacity duration-[1600ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] ${
        live ? "opacity-100" : "opacity-0"
      } ${className}`}
    />
  );
}
