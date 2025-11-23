"use client";

import { useState } from "react";

export default function ClickableHeart() {
  const [isLiked, setIsLiked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (!isLiked) {
      setIsAnimating(true);
      setIsLiked(true);
      setTimeout(() => setIsAnimating(false), 600);
    } else {
      setIsLiked(false);
    }
  };

  return (
    <>
      <style>{`
        .heart-container {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          width: 30px;
          height:30px;
        }

        .heart-svg {
          position: relative;
          z-index: 2;
          width: 15px;
          height: 15px;
        }

        .heart-path {
          transition: fill 0.1s ease;
        }

        .heart-animate {
          animation: heartPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes heartPop {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.25);
          }
          100% {
            transform: scale(1);
          }
        }

        .burst-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80px;
          height: 80px;
          pointer-events: none;
        }

        .burst-circle {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          opacity: 0;
        }

        .burst-animate .burst-circle {
          animation: burstOut 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
        }

        .burst-circle:nth-child(1) {
          background: #e91e63;
          animation-delay: 0s;
        }
        .burst-circle:nth-child(2) {
          background: #f44336;
          animation-delay: 0.02s;
        }
        .burst-circle:nth-child(3) {
          background: #ff5722;
          animation-delay: 0.04s;
        }
        .burst-circle:nth-child(4) {
          background: #ff9800;
          animation-delay: 0.06s;
        }
        .burst-circle:nth-child(5) {
          background: #ffc107;
          animation-delay: 0.08s;
        }
        .burst-circle:nth-child(6) {
          background: #8bc34a;
          animation-delay: 0.1s;
        }
        .burst-circle:nth-child(7) {
          background: #00bcd4;
          animation-delay: 0.12s;
        }
        .burst-circle:nth-child(8) {
          background: #3f51b5;
          animation-delay: 0.14s;
        }

        @keyframes burstOut {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          100% {
            transform: translate(var(--tx), var(--ty)) scale(1);
            opacity: 0;
          }
        }

        .burst-circle:nth-child(1) {
          --tx: 0;
          --ty: -40px;
        }
        .burst-circle:nth-child(2) {
          --tx: 28px;
          --ty: -28px;
        }
        .burst-circle:nth-child(3) {
          --tx: 40px;
          --ty: 0;
        }
        .burst-circle:nth-child(4) {
          --tx: 28px;
          --ty: 28px;
        }
        .burst-circle:nth-child(5) {
          --tx: 0;
          --ty: 40px;
        }
        .burst-circle:nth-child(6) {
          --tx: -28px;
          --ty: 28px;
        }
        .burst-circle:nth-child(7) {
          --tx: -40px;
          --ty: 0;
        }
        .burst-circle:nth-child(8) {
          --tx: -28px;
          --ty: -28px;
        }
      `}</style>

      <span className="heart-container" onClick={handleClick}>
        <svg
          className={`heart-svg ${isAnimating ? "heart-animate" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            className="heart-path"
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill={isLiked ? "#e0245e" : "transparent"} // transparent when not liked
            stroke={isLiked ? "#e0245e" : "#a1a1a1ff"} // neutral-300 border
            strokeWidth={isLiked ? 0 : 1.5} // border only when not liked
          />
        </svg>

        {isAnimating && (
          <div className="burst-container burst-animate">
            <div className="burst-circle"></div>
            <div className="burst-circle"></div>
            <div className="burst-circle"></div>
            <div className="burst-circle"></div>
            <div className="burst-circle"></div>
            <div className="burst-circle"></div>
            <div className="burst-circle"></div>
            <div className="burst-circle"></div>
          </div>
        )}
      </span>
    </>
  );
}
