
'use client';

import { motion } from 'framer-motion';

export function AnimatedLogo() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
       <motion.svg
        width="100"
        height="120"
        viewBox="0 0 270 330"
        className="drop-shadow-lg"
        initial="start"
        animate="end"
      >
        <title>Animated Nepali Flag</title>
        <motion.path
          d="M0 0 H270 L90 150 L270 150 L0 300 V0 Z"
          fill="#003893"
          variants={{
            start: { pathLength: 0, pathOffset: 1 },
            end: {
              pathLength: 1,
              pathOffset: 0,
              transition: { duration: 2, ease: 'easeInOut' },
            },
          }}
        />
        <motion.path
          d="M5 5 H245 L85 147 L245 147 L5 295 V5 Z"
          fill="#DC143C"
           initial={{ opacity: 0 }}
           animate={{ opacity: 1, transition: { delay: 1, duration: 1 } }}
        >
            <animate
                attributeName="d"
                values="M5 5 H245 L85 147 L245 147 L5 295 V5 Z; M5 5 H245 L95 145 L245 147 L5 295 V5 Z; M5 5 H245 L85 147 L245 147 L5 295 V5 Z"
                dur="4s"
                repeatCount="indefinite"
            />
        </motion.path>
        <motion.g 
            fill="white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 1.5, duration: 1 } }}
        >
          {/* Sun */}
          <circle cx="90" cy="225" r="35" />
          <g transform="translate(90 225)">
            {[...Array(12)].map((_, i) => (
              <path
                key={i}
                d="M0 -38 L5 -48 L-5 -48 Z"
                transform={`rotate(${i * 30})`}
              />
            ))}
          </g>
          {/* Moon */}
          <path d="M90 50 A40 40 0 1 0 90 130 A30 30 0 1 1 90 50 Z" />
          <g transform="translate(90 90)">
            <path d="M0 -20 A5 5 0 1 1 0 -10 A7 7 0 1 0 0 -20" />
          </g>
        </motion.g>
      </motion.svg>
    </div>
  );
}
