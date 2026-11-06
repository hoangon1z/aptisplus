export function SoundWave({
  active = false,
  compact = false,
}: {
  active?: boolean;
  compact?: boolean;
}) {
  return (
    <span
      className={
        "sound-wave " + (active ? "playing " : "") + (compact ? "compact" : "")
      }
      aria-hidden="true"
    >
      {Array.from({ length: compact ? 25 : 54 }, (_, i) => (
        <i
          key={i}
          style={{
            height: 8 + Math.sin(i * 1.91) ** 2 * (i < 28 ? 33 : 17) + "px",
            animationDelay: (i % 9) * 0.09 + "s",
          }}
        />
      ))}
    </span>
  );
}
