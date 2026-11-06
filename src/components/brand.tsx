import Link from "next/link";
export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="brand" aria-label="Aptis Studio — Trang chủ">
      <span className="brand-mark">
        <i />
        <i />
        <i />
        <i />
      </span>
      {!compact && (
        <span>
          aptis<span className="brand-light">studio</span>
          <span className="brand-period">.</span>
        </span>
      )}
    </Link>
  );
}
