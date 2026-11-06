import { useId } from "react";
// Exact source: public/brand/aptisplus-symbol.svg, supplied by the user.
export const A_BODY =
  "M 22 195 L 89 46 Q 102 18 120 18 Q 138 18 153 46 L 232 194 Q 243 216 221 225 Q 200 230 190 212 L 138 117 Q 128 98 117 118 L 60 211 Q 49 227 32 220 Q 15 212 22 195 Z";
export const A_RIBBON =
  "M 26 191 C 66 162 96 143 123 129 C 155 113 178 105 201 140 L 217 166 C 190 147 169 145 146 156 C 109 174 85 202 61 215 C 42 226 23 208 26 191 Z";
export const A_PLUS =
  "M 208 38 C 208 32 213 27 219 27 C 225 27 230 32 230 38 L 230 47 L 239 47 C 245 47 250 52 250 58 C 250 64 245 69 239 69 L 230 69 L 230 78 C 230 84 225 89 219 89 C 213 89 208 84 208 78 L 208 69 L 199 69 C 193 69 188 64 188 58 C 188 52 193 47 199 47 L 208 47 Z";
export function AptisPlusSymbol({
  className = "",
  animated = false,
}: {
  className?: string;
  animated?: boolean;
}) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg
      viewBox="0 0 270 252"
      className={className}
      data-hero-mark={animated ? "" : undefined}
      role="img"
      aria-label="Biểu tượng AptisPlus A cộng"
    >
      <defs>
        <linearGradient id={uid + "body"} x1=".1" y1=".1" x2=".95" y2="1">
          <stop stopColor="#8277FF" />
          <stop offset=".43" stopColor="#5C51F5" />
          <stop offset="1" stopColor="#3831D5" />
        </linearGradient>
        <linearGradient id={uid + "ribbon"} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#DAD4FF" />
          <stop offset=".48" stopColor="#9D96F8" />
          <stop offset="1" stopColor="#F7F5FF" />
        </linearGradient>
      </defs>
      {animated && (
        <path
          data-logo-trace
          d={A_BODY}
          fill="none"
          stroke="#514FE4"
          strokeWidth="1.8"
          opacity="0"
        />
      )}
      <path
        data-logo-body={animated ? "" : undefined}
        d={A_BODY}
        fill={"url(#" + uid + "body)"}
      />
      <path
        data-logo-ribbon={animated ? "" : undefined}
        d={A_RIBBON}
        fill={"url(#" + uid + "ribbon)"}
      />
      <path
        data-logo-plus={animated ? "" : undefined}
        d={A_PLUS}
        fill="#514FE4"
      />
    </svg>
  );
}
