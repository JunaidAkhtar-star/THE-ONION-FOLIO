// src/components/BlurText.jsx
import React, { useEffect, useState } from "react";

export default function BlurText({
  text = "",          // default to empty string
  className = "",
  animateBy = "words",
  direction = "top",
  delay = 150,
}) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimated(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  const safeText = text ?? ""; // make sure it's never undefined or null

  const items =
    animateBy === "letters" ? safeText.split("") : safeText.split(" ");

  const getOffset = (index) => {
    const base = 15;
    const sign = index % 2 === 0 ? 1 : -1;

    switch (direction) {
      case "bottom":
        return { y: base * sign, x: 0 };
      case "left":
        return { x: -base * sign, y: 0 };
      case "right":
        return { x: base * sign, y: 0 };
      case "top":
      default:
        return { y: -base * sign, x: 0 };
    }
  };
  return (
    <span style={{ display: "inline-block" }}>
      {items.map((item, index) => {
        const offset = getOffset(index);

        return (
          <span
            key={index}
            className={className}  // apply your gradient class here
            style={{
              display: "inline-block",
              filter: animated ? "blur(0px)" : "blur(8px)",
              transform: animated
                ? "translate(0px, 0px)"
                : `translate(${offset.x}px, ${offset.y}px)`,
              opacity: animated ? 1 : 0,
              transition: "all 0.6s ease-out",
              transitionDelay: `${index * 70}ms`,
              marginRight:
                animateBy === "words" && index !== items.length - 1
                  ? "0.25em"
                  : 0,
            }}
          >
            {item === "" ? "\u00A0" : item}
          </span>
        );
      })}
    </span>
  );
}
