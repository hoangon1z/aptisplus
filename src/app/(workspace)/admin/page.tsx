"use client";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SkillSelect } from "@/components/skill-select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icon";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { skills } from "@/lib/exams";
type ExamRow = {
  id: string;
  name: string;
  skill: string;
  status: string;
  description?: string;
};
const initial: ExamRow[] = skills.map((s) => ({
  id: s.id,
  name: s.name + " Practice Test Version 001",
  skill: s.id,
  status: "Đề mẫu",
}));
export default function AdminPage() {
  const [rows, setRows] = useState<ExamRow[]>(initial);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ExamRow | null>(null);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    try {
      const r = localStorage.getItem("aptis-admin-drafts");
      if (r) setRows([...initial, ...JSON.parse(r)]);
    } catch {}
  }, []);
  function save(next: ExamRow[]) {
    setRows(next);
    localStorage.setItem(
      "aptis-admin-drafts",
      JSON.stringify(next.filter((r) => r.status !== "Đề mẫu")),
    );
  }
  return (
    <>
      <div className="page-title">
        <div>
          <h1>Không gian quản lý đề</h1>
          <p>
            Sắp xếp nội dung luyện tập. Bản demo lưu bản nháp trên thiết bị.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Icon name="add" />
          Tạo bản nháp
        </Button>
      </div>
      <Alert className="admin-notice" role="note">
        <Icon name="info" />
        <AlertDescription>
          Giao diện quản trị demo, chưa có phân quyền. Bản nháp lưu thông tin
          đề; biên soạn câu hỏi và xuất bản sẽ được hoàn thiện cùng backend.
        </AlertDescription>
      </Alert>
      <div className="list-heading">
        <h2>
          Thư viện đề thi <span className="count-label">{rows.length}</span>
        </h2>
        <Label className="workspace-search">
          <Icon name="search" />
          <Input
            placeholder="Tìm tên đề…"
            aria-label="Tìm tên đề"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Label>
      </div>
      {message && (
        <Alert status="success" role="status">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      <div className="table-scroll">
        <Table className="admin-table">
          <TableHeader>
            <TableRow>
              <TableHead>Tên đề</TableHead>
              <TableHead>Kỹ năng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows
              .filter((r) => r.name.toLowerCase().includes(query.toLowerCase()))
              .map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <strong>{r.name}</strong>
                    <small>{r.description || "Aptis ESOL General"}</small>
                  </TableCell>
                  <TableCell>
                    {skills.find((s) => s.id === r.skill)?.name}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={r.status === "Đề mẫu" ? "secondary" : "outline"}
                    >
                      {r.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {r.status === "Đề mẫu" ? (
                      <Button size="sm" variant="outline" asChild>
                        <Link href={"/exam/" + r.skill}>
                          Xem đề <Icon name="open_in_new" />
                        </Link>
                      </Button>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditing(r);
                            setOpen(true);
                          }}
                        >
                          Sửa
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            save(rows.filter((x) => x.id !== r.id));
                            setMessage("Đã xóa bản nháp.");
                          }}
                        >
                          Xóa
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <p className="px-4 py-3 text-xs text-muted-foreground sm:hidden">
          Vuốt ngang bảng để xem trạng thái và thao tác.
        </p>
        {!rows.some((r) =>
          r.name.toLowerCase().includes(query.toLowerCase()),
        ) && (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>Không tìm thấy đề thi</EmptyTitle>
              <EmptyDescription>Thử tên đề hoặc từ khóa khác.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="workspace-dialog">
          <DialogTitle>
            {editing ? "Sửa thông tin đề" : "Tạo bản nháp đề thi"}
          </DialogTitle>
          <DialogDescription>
            Thông tin được lưu trên trình duyệt này, chưa xuất bản thành bài
            thi.
          </DialogDescription>
          <form
            key={editing?.id || "new"}
            className="admin-form"
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              const row = {
                id: editing?.id || crypto.randomUUID(),
                name: String(data.get("name")),
                skill: String(data.get("skill")),
                description: String(data.get("description")),
                status: "Bản nháp",
              };
              save(
                editing
                  ? rows.map((r) => (r.id === editing.id ? row : r))
                  : [...rows, row],
              );
              setOpen(false);
              setMessage("Đã lưu bản nháp.");
            }}
          >
            <Label className="field-stack">
              Tên đề
              <Input
                name="name"
                required
                defaultValue={editing?.name}
                placeholder="Ví dụ: Listening Practice Test 002"
              />
            </Label>
            <Label className="field-stack">
              Kỹ năng
              <SkillSelect defaultValue={editing?.skill || "listening"} />
            </Label>
            <Label className="field-stack">
              Ghi chú
              <Textarea
                name="description"
                defaultValue={editing?.description}
                placeholder="Chủ đề và mục tiêu của bộ đề…"
              />
            </Label>
            <Button type="submit">
              Lưu bản nháp <Icon name="save" />
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
