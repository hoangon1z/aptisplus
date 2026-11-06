import Image from "next/image";
import Link from "next/link";
export function WorkspaceBrand() {
  return (
    <Link
      href="/"
      className="workspace-brand"
      aria-label="AptisPlus — Trang chủ"
    >
      <Image
        src="/brand/aptisplus-logo.svg"
        alt="AptisPlus"
        width={198}
        height={50}
        priority
      />
    </Link>
  );
}
