"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface Sparkle {
  id: number
  x: number
  y: number
  size: number
  delay: number
  duration: number
  opacity: number
}

export function AiSparkles({ className }: { className?: string }) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([])

  useEffect(() => {
    const generateSparkles = () => {
      const newSparkles: Sparkle[] = []

      for (let i = 0; i < 15; i++) {
        newSparkles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 12 + 8, // Larger sparkles 8-20px
          delay: Math.random() * 3,
          duration: Math.random() * 3 + 2, // Longer duration 2-5s
          opacity: Math.random() * 0.6 + 0.4, // Variable opacity 0.4-1.0
        })
      }

      setSparkles(newSparkles)
    }

    generateSparkles()

    const interval = setInterval(generateSparkles, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={cn("absolute inset-0 rounded-md pointer-events-none overflow-hidden", className)}>
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute transition-all duration-2000 animate-sparkle-glow"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            animationDelay: `${sparkle.delay}s`,
            animationDuration: `${sparkle.duration}s`,
            opacity: sparkle.opacity,
          }}
        >
          <div className="relative w-full h-full">
            {/* Main star shape */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Vertical beam */}
                <div
                  className="absolute bg-white shadow-lg shadow-white/50"
                  style={{
                    width: "2px",
                    height: `${sparkle.size}px`,
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    borderRadius: "1px",
                  }}
                />
                {/* Horizontal beam */}
                <div
                  className="absolute bg-white shadow-lg shadow-white/50"
                  style={{
                    width: `${sparkle.size}px`,
                    height: "2px",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    borderRadius: "1px",
                  }}
                />
                {/* Center glow */}
                <div
                  className="absolute bg-white rounded-full shadow-lg shadow-white/80"
                  style={{
                    width: "4px",
                    height: "4px",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
