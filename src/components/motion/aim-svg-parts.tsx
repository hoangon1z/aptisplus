/** Original, code-native vector parts. Each SVG can move independently. */
export function AimGlyph({ kind }: { kind: number }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <g
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {kind % 5 === 0 && <path d="M24 7v34M7 24h34" />}
        {kind % 5 === 1 && (
          <>
            <path d="M8 16v16m8-22v28m8-34v40m8-34v28m8-22v16" />
          </>
        )}
        {kind % 5 === 2 && (
          <>
            <path d="M24 14c-6-5-12-5-18-3v27c6-2 12-2 18 3 6-5 12-5 18-3V11c-6-2-12-2-18 3Z" />
            <path d="M24 14v27M11 18h7m-7 6h7m12-6h7m-7 6h7" />
          </>
        )}
        {kind % 5 === 3 && (
          <>
            <rect x="18" y="5" width="12" height="25" rx="6" />
            <path d="M12 23a12 12 0 0 0 24 0M24 35v8m-7 0h14" />
          </>
        )}
        {kind % 5 === 4 && (
          <>
            <path d="m10 33-2 8 8-2L40 15 34 9 10 33ZM29 14l6 6M10 33l6 6" />
            <path d="M25 40h15" />
          </>
        )}
      </g>
    </svg>
  );
}

export function AimOrbit() {
  return (
    <svg viewBox="0 0 640 640" fill="none" aria-hidden="true">
      <circle
        data-orbit-ring
        cx="320"
        cy="320"
        r="236"
        stroke="currentColor"
        strokeWidth=".6"
      />
      <circle
        data-orbit-ring
        cx="320"
        cy="320"
        r="278"
        stroke="currentColor"
        strokeWidth=".5"
        strokeDasharray="2 10"
      />
      <g data-orbit-ticks stroke="currentColor" strokeWidth="1">
        {Array.from({ length: 48 }, (_, i) => (
          <path
            key={i}
            data-orbit-tick
            d={i % 4 === 0 ? "M320 15v17" : "M320 20v7"}
            transform={`rotate(${i * 7.5} 320 320)`}
          />
        ))}
      </g>
    </svg>
  );
}
