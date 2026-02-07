import React, { useEffect, useRef } from "react";

export default function ElectricBorder({
  children,
  color = "#7df9ff",
  speed = 1,
  chaos = 0.12,
  thickness = 2,
  style = {},
}) {
  const pathRef = useRef(null);

  useEffect(() => {
    let frameId;
    let t = 0;

    const animate = () => {
      const path = pathRef.current;
      if (!path) return;

      const points = 80;
      const width = 100;
      const height = 100;

      const top = [];
      const bottom = [];
      const left = [];
      const right = [];

      for (let i = 0; i <= points; i++) {
        const x = (i / points) * width;
        const yOffset =
          Math.sin(i * chaos + t) * 2 +
          Math.sin(i * chaos * 1.2 + t * 1.3) * 1.5;

        top.push(`${x},${0 + yOffset}`);
        bottom.push(`${width - x},${height + yOffset}`);
        left.push(`${0 + yOffset},${height - x}`);
        right.push(`${width + yOffset},${x}`);
      }

      const d = [
        "M",
        top[0],
        "L",
        ...top.slice(1),
        "L",
        right[0],
        "L",
        ...right.slice(1),
        "L",
        bottom[0],
        "L",
        ...bottom.slice(1),
        "L",
        left[0],
        "L",
        ...left.slice(1),
        "Z",
      ].join(" ");

      path.setAttribute("d", d);

      t += 0.03 * speed;
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [speed, chaos]);

  return (
    <div
      style={{
        position: "relative",
        padding: "1px",
        borderRadius: 16,
        overflow: "hidden",
        ...style,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          filter: "drop-shadow(0 0 12px rgba(125, 249, 255, 0.6))",
          pointerEvents: "none",
        }}
      >
        <defs>
          <linearGradient id="electric-border-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>
        <path
          ref={pathRef}
          fill="none"
          stroke="url(#electric-border-gradient)"
          strokeWidth={thickness}
        />
      </svg>

      <div
        style={{
          position: "relative",
          borderRadius: 14,
          background: "rgba(10, 10, 18, 0.9)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
