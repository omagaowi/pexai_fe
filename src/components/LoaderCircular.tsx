import React from 'react';
import PropTypes from 'prop-types';

interface CircularLoaderProps {
  size: number,
  strokeWidth: number,
  bgColor: string,
  duration: number,
  color: string
}

const CircularLoader: React.FC<CircularLoaderProps> = ({ size, strokeWidth, bgColor, duration, color }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={`animate-spin`}
    >
      {/* Background Circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke = {bgColor? bgColor: "#e0e0e0"}
        strokeWidth={strokeWidth}
        fill="none"
      />

      {/* Spinning Circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * 0.25}
        strokeLinecap="round"
        className="origin-center"
        style={{
          animation: `dash ${duration}s ease-in-out infinite`,
        }}
      />

      <style>
        {`
          @keyframes dash {
            0% {
              stroke-dashoffset: ${circumference * 0.25};
            }
            50% {
              stroke-dashoffset: ${circumference * 0.75};
              transform: rotate(90deg);
            }
            100% {
              stroke-dashoffset: ${circumference * 0.25};
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </svg>
  );
};

CircularLoader.propTypes = {
  size: PropTypes.number,
  strokeWidth: PropTypes.number,
  color: PropTypes.string,
  duration: PropTypes.number,
};

export default CircularLoader;
