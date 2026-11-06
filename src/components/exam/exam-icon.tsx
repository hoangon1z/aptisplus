import "@fontsource/material-symbols-rounded/400.css";

/** The exam uses the Material icon font specified in the reference UI. */
export function Icon({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  return (
    <span
      className={`material-symbols-rounded exam-icon ${className}`}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
