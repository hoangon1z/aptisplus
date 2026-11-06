import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function NotFound() {
  return (
    <main className="empty-state">
      <h1>Trang này chưa có trong hành trình.</h1>
      <p>Quay lại phòng luyện để chọn bài thi của bạn.</p>
      <Button asChild>
        <Link href="/practice">Về phòng luyện</Link>
      </Button>
    </main>
  );
}
