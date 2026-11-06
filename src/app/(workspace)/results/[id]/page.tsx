"use client";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import { readAttempts, getSkill, type Attempt } from "@/lib/exams";
import { getRecording } from "@/lib/recordings";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
function RecordingPlayer({ id }: { id: string }) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    let objectUrl = "";
    getRecording(id)
      .then((blob) => {
        if (active && blob) {
          objectUrl = URL.createObjectURL(blob);
          setUrl(objectUrl);
        } else if (active)
          setError("Không tìm thấy bản ghi trên thiết bị này.");
      })
      .catch(() => setError("Không thể đọc bản ghi."));
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [id]);
  return url ? (
    <audio controls src={url} />
  ) : (
    <small>{error || "Đang tải bản ghi…"}</small>
  );
}
export default function ResultDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [attempt, setAttempt] = useState<Attempt | undefined>();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setAttempt(readAttempts().find((a) => a.id === id));
    setReady(true);
  }, [id]);
  if (!ready)
    return (
      <div role="status" aria-label="Đang tải bài làm" className="space-y-4">
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="h-28 w-full" />
      </div>
    );
  if (!attempt)
    return (
      <div className="empty-state">
        <Icon name="description" />
        <h1>Không tìm thấy bài làm</h1>
        <p>Bài làm chỉ được lưu trên trình duyệt đã nộp bài.</p>
        <Button asChild>
          <Link href="/results">Về lịch sử</Link>
        </Button>
      </div>
    );
  return (
    <>
      <Link className="back-link" href="/results">
        <Icon name="arrow_back" />
        Lịch sử bài thi
      </Link>
      <div className="page-title">
        <div>
          <h1>{getSkill(attempt.skill)?.name} — Bài làm của bạn</h1>
          <p>
            {new Date(attempt.date).toLocaleString("vi-VN")} · {attempt.title}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href={"/exam/" + attempt.skill}>
            Luyện lại <Icon name="refresh" />
          </Link>
        </Button>
      </div>
      <Alert className="ai-pending" role="note">
        <Icon name="auto_awesome" />
        <div>
          <AlertTitle>Không gian phản hồi AI</AlertTitle>
          <AlertDescription>
            Chưa kết nối dịch vụ chấm điểm. Khi có backend, điểm luyện tập, nhận
            xét và gợi ý cải thiện sẽ xuất hiện ở đây.
          </AlertDescription>
        </div>
        <Badge variant="outline">Chưa chấm điểm</Badge>
      </Alert>
      <h2 className="result-answer-title">Câu trả lời đã nộp</h2>
      {Object.entries(attempt.answers).filter(([, v]) => v).length ? (
        Object.entries(attempt.answers)
          .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
          .filter(([, v]) => v)
          .map(([key, value]) => (
            <Card className="answer-review" key={key}>
              <h3>
                {attempt.skill === "speaking"
                  ? "Bản ghi " + (Number(key) + 1)
                  : "Câu " + key}
              </h3>
              {attempt.skill === "speaking" ? (
                <RecordingPlayer id={attempt.id + ":" + key} />
              ) : (
                <p>
                  {value.startsWith("[")
                    ? (() => {
                        try {
                          return JSON.parse(value)
                            .map((v: number | null) =>
                              v === null ? "—" : String(v + 1),
                            )
                            .join(" → ");
                        } catch {
                          return value;
                        }
                      })()
                    : attempt.skill === "listening" && /^[012]$/.test(value)
                      ? "ABC"[Number(value)]
                      : value.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ")}
                </p>
              )}
            </Card>
          ))
      ) : (
        <div className="empty-state">
          <p>Bạn chưa nhập câu trả lời trong lượt thi này.</p>
        </div>
      )}
    </>
  );
}
