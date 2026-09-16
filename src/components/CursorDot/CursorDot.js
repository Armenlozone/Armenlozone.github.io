      import React, { useEffect, useRef } from "react";

      import "./CursorDot.css";

      export default function CursorDot() {
        const dotRef = useRef(null);

        useEffect(() => {
          const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
          const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

          if (isMobile && isTouchDevice) {
            return undefined;
          }

          const dot = dotRef.current;
          let mouseX = 0;
          let mouseY = 0;
          let dotX = 0;
          let dotY = 0;
          let animationFrame;

          const handleMouseMove = (event) => {
            mouseX = event.clientX;
            mouseY = event.clientY;
            const target = event.target;
            const isLink = target.closest("a") || target.tagName === "AREA";
            dot.classList.toggle("hovering", Boolean(isLink));
          };

          const animate = () => {
            dotX += (mouseX - dotX) * 0.3;
            dotY += (mouseY - dotY) * 0.3;
            dot.style.left = `${dotX}px`;
            dot.style.top = `${dotY}px`;
            animationFrame = requestAnimationFrame(animate);
          };

          document.addEventListener("mousemove", handleMouseMove);
          animationFrame = requestAnimationFrame(animate);

          return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animationFrame);
          };
        }, []);

        return React.createElement("div", {
          ref: dotRef,
          className: "dot",
          "aria-hidden": "true",
        });
      }