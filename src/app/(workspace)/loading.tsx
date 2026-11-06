import { LoaderCircle } from "lucide-react";
export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="workspace-loading">
      <LoaderCircle size={28} className="auth-spinner" aria-hidden="true" />
      <h1>Đang mở không gian luyện tập…</h1>
      <p>Vui lòng chờ trong giây lát.</p>
    </div>
  );
}
