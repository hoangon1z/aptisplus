export function SkillVisual({ skill }: { skill: string }) {
  return (
    <svg
      viewBox="0 0 240 80"
      fill="none"
      aria-hidden="true"
      style={{
        width: "100%",
        height: 72,
        color:
          skill === "speaking"
            ? "#97624e"
            : skill === "reading"
              ? "#39716c"
              : skill === "writing"
                ? "#70609b"
                : "#514fe4",
      }}
    >
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        {skill === "listening" ? (
          <>
            {Array.from({ length: 29 }, (_, i) => (
              <path
                data-ink
                key={i}
                d={`M${24 + i * 6} ${40 - Math.abs(Math.sin(i * 0.65)) * 25}v${Math.abs(Math.sin(i * 0.65)) * 50}`}
              />
            ))}
            <path d="M14 40h10m174 0h25" />
          </>
        ) : skill === "reading" ? (
          <>
            <path data-ink d="M48 16h130v52H48zM61 28h99M61 39h79M61 50h92" />
            <path strokeWidth="4" opacity=".2" d="M42 10h143v64H42z" />
            <path data-ink d="M72 58h60" strokeWidth="3" />
          </>
        ) : skill === "speaking" ? (
          <>
            <rect x="104" y="10" width="30" height="42" rx="15" />
            <path
              data-ink
              d="M96 37v6a23 23 0 0046 0v-6M119 66v10m-12 0h24M44 40q12-35 24 0t24 0m58 0q12-35 24 0t24 0"
            />
            <path d="M114 20h10m-10 7h10" />
          </>
        ) : (
          <>
            <path
              data-ink
              d="M30 58c22-64 29-46 20-17s26-40 27-14-9 37 13 10 10 31 38 2M145 20h62M145 33h42M145 46h55M30 70h176"
            />
            <path d="M213 41v24" strokeWidth="3" />
          </>
        )}
      </g>
    </svg>
  );
}
