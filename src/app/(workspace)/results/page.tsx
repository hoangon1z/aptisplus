"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { readAttempts, getSkill, skills, type Attempt } from "@/lib/exams";
export default function ResultsPage() {
  const [attempts, setAttempts] = useState<Attempt[]>([]),
    [ready, setReady] = useState(false),
    [filter, setFilter] = useState("all");
  useEffect(() => {
    setAttempts(readAttempts());
    setReady(true);
  }, []);
  const shown = attempts.filter((a) => filter === "all" || a.skill === filter);
  return (
    <>
      <div className="page-title">
        <div>
          <h1>Mỗi bài làm, một bước tiến.</h1>
          <p>Xem lại những lần luyện tập đã lưu trên trình duyệt này.</p>
        </div>
        <Button asChild>
          <Link href="/practice">
            Luyện bài mới <Icon name="add" />
          </Link>
        </Button>
      </div>
      <Tabs
        value={filter}
        onValueChange={setFilter}
        className="workspace-filters"
      >
        <TabsList aria-label="Lọc lịch sử theo kỹ năng">
          {[{ id: "all", name: "Tất cả" }, ...skills].map((s) => (
            <TabsTrigger key={s.id} value={s.id}>
              {s.name}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={filter} className="mt-4">
          {!ready ? (
            <div
              className="space-y-3"
              role="status"
              aria-label="Đang tải lịch sử"
            >
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : shown.length ? (
            <div className="results-table-wrap">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bài luyện</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Xem lại</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shown.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell>
                        <div className="result-title">
                          <span
                            className="result-skill-icon"
                            style={{ background: getSkill(a.skill)?.color }}
                          >
                            <Icon name={getSkill(a.skill)?.icon || "task"} />
                          </span>
                          <div>
                            <h3>
                              <Link href={"/results/" + a.id}>{a.title}</Link>
                            </h3>
                            <p>{new Date(a.date).toLocaleString("vi-VN")}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{Math.ceil(a.duration / 60)} phút</TableCell>
                      <TableCell>
                        <Badge variant="secondary">Đã nộp · Chưa chấm AI</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="sm">
                          <Link
                            href={"/results/" + a.id}
                            aria-label={"Xem lại " + a.title}
                          >
                            <Icon name="arrow_forward" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="border-t px-5 py-3 text-xs text-muted-foreground">
                {shown.length} bài làm · Dữ liệu trên thiết bị này
              </div>
            </div>
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Icon name="history_edu" />
                </EmptyMedia>
                <EmptyTitle>Hành trình bắt đầu từ bài đầu tiên.</EmptyTitle>
                <EmptyDescription>
                  {filter === "all"
                    ? "Bài thi đã nộp sẽ xuất hiện ở đây để bạn xem lại."
                    : "Chưa có bài làm cho kỹ năng này trên thiết bị."}
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button asChild>
                  <Link href="/practice">
                    Chọn đề luyện tập <Icon name="arrow_forward" />
                  </Link>
                </Button>
              </EmptyContent>
            </Empty>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}
