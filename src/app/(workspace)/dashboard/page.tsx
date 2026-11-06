"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  History,
  Plus,
  Sparkles,
  X,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SkillSelect } from "@/components/skill-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { JourneyHero } from "@/components/dashboard/journey-hero";
import { LearningOverview } from "@/components/dashboard/learning-overview";
import { skills, readAttempts, type Attempt } from "@/lib/exams";
import styles from "@/components/dashboard/dashboard-v5.module.css";

type Plan = { id: string; skill: string; date: string };
type DraftInfo = { skill: string; question: number };

export default function Dashboard() {
  const [name, setName] = useState("Học viên");
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [draft, setDraft] = useState<DraftInfo | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => {
    try {
      setName(
        JSON.parse(localStorage.getItem("aptis-profile") || "{}").name ||
          "Học viên",
      );
    } catch {}
    setAttempts(readAttempts());
    try {
      const saved = JSON.parse(localStorage.getItem("aptis-plans") || "[]");
      if (Array.isArray(saved)) setPlans(saved);
    } catch {}
    for (const s of skills) {
      try {
        const d = JSON.parse(
          localStorage.getItem("aptis-draft-" + s.id) || "null",
        );
        if (d?.deadline > Date.now()) {
          setDraft({ skill: s.id, question: d.question });
          break;
        }
      } catch {}
    }
    setToday(new Date());
    setReady(true);
  }, []);
  const count = (id: string) => attempts.filter((a) => a.skill === id).length;
  const recommended = [...skills].sort((a, b) => count(a.id) - count(b.id));
  const feature = skills.find((s) => s.id === draft?.skill) || recommended[0];
  const recent = [...attempts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
  const practiced = skills.filter((s) => count(s.id) > 0).length;
  function removePlan(id: string) {
    const next = plans.filter((p) => p.id !== id);
    setPlans(next);
    localStorage.setItem("aptis-plans", JSON.stringify(next));
  }
  return (
    <div className={styles.dashboard} data-dashboard-v5>
      <div className={styles.greeting}>
        <div>
          <h1>
            Chào trở lại, <span>{name}.</span>
          </h1>
          <p>Tiếp tục hành trình. Làm quen hơn với từng kỹ năng.</p>
        </div>
        <Link href="/practice" className={styles.quietLink}>
          Khám phá bộ đề <ArrowRight size={15} />
        </Link>
      </div>
      <JourneyHero skill={feature} question={draft?.question} ready={ready} />
      {ready && today ? (
        <LearningOverview attempts={attempts} ready={ready} today={today} />
      ) : (
        <div
          className={styles.overviewGrid}
          aria-label="Đang tải dữ liệu luyện tập"
        >
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className={styles.loadingPanel} />
          ))}
        </div>
      )}
      <div className={styles.lowerGrid}>
        <div className={styles.mainColumn}>
          <Card className={styles.panel}>
            <div className={styles.panelHeading}>
              <h2>Bốn kỹ năng, từng bước làm quen</h2>
              <Link href="/practice" className={styles.quietLink}>
                Chọn bài luyện <ArrowRight size={14} />
              </Link>
            </div>
            <div className={styles.skillPath}>
              {skills.map((s) => (
                <Link href={`/exam/${s.id}`} key={s.id}>
                  <span
                    className={count(s.id) ? styles.pathDone : styles.pathNext}
                  >
                    {count(s.id) ? <Check size={17} /> : <Icon name={s.icon} />}
                  </span>
                  <strong>{s.name}</strong>
                  <small>
                    {count(s.id)
                      ? `${count(s.id)} bài đã nộp`
                      : "Chưa có bài nộp"}
                  </small>
                </Link>
              ))}
            </div>
            <p className={styles.caption}>
              {practiced
                ? `Bạn đã có bài nộp ở ${practiced}/4 kỹ năng. Tiếp tục khám phá phần còn lại hoặc luyện lại bất cứ lúc nào.`
                : "Chọn kỹ năng bạn muốn bắt đầu. Mỗi bước đều được tính từ bài làm thật."}
            </p>
          </Card>
          <Card className={`${styles.panel} ${styles.recommendations}`}>
            <div className={styles.panelHeading}>
              <h2>
                <Sparkles size={17} />
                Đề xuất cho bạn
              </h2>
              <Link href="/practice" className={styles.quietLink}>
                Xem tất cả <ArrowRight size={14} />
              </Link>
            </div>
            <div className={styles.recommendationGrid}>
              {recommended.map((s) => (
                <Link
                  key={s.id}
                  href={`/exam/${s.id}`}
                  className={`${styles.skillCard} ${styles[s.id]}`}
                >
                  <div>
                    <Icon name={s.icon} />
                    <span className={styles.skillArrow}>
                      <ArrowRight size={14} />
                    </span>
                  </div>
                  <h3>Luyện {s.name}</h3>
                  <p>{s.description}</p>
                  <span className={styles.skillFoot}>
                    {count(s.id)
                      ? `${count(s.id)} lượt đã luyện`
                      : "Bắt đầu khám phá"}
                    <ChevronRight size={13} />
                  </span>
                </Link>
              ))}
            </div>
          </Card>
        </div>
        <div className={styles.sideColumn}>
          <Card className={styles.panel}>
            <div className={styles.panelHeading}>
              <h2>Hoạt động mới nhất</h2>
              <Link href="/results" className={styles.quietLink}>
                Tất cả <ArrowRight size={14} />
              </Link>
            </div>
            {recent.length ? (
              <div className={`${styles.recentList} dashboard-recent-list`}>
                {recent.map((a) => (
                  <Link key={a.id} href={`/results/${a.id}`}>
                    <span className={styles.activityIcon}>
                      <Icon
                        name={
                          skills.find((s) => s.id === a.skill)?.icon ||
                          "history"
                        }
                      />
                    </span>
                    <div>
                      <strong>{a.title}</strong>
                      <small>
                        {new Date(a.date).toLocaleDateString("vi-VN")} ·{" "}
                        {Math.ceil(a.duration / 60)} phút
                      </small>
                    </div>
                    <ChevronRight size={15} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className={styles.empty}>
                <History size={27} />
                <p>Bài làm đầu tiên sẽ xuất hiện ở đây.</p>
                <Link href="/practice">
                  Chọn một bài luyện <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </Card>
          <Card className={`${styles.panel} ${styles.schedulePanel}`}>
            <div className={styles.panelHeading}>
              <h2>
                <CalendarDays size={17} />
                Lịch luyện sắp tới
              </h2>
              <button
                type="button"
                className={styles.addPlan}
                onClick={() => setOpen(true)}
                aria-label="Thêm lịch luyện tập"
              >
                <Plus size={15} />
                Thêm
              </button>
            </div>
            {plans.length ? (
              <div className={`${styles.planList} practice-schedule`}>
                {[...plans]
                  .sort((a, b) => a.date.localeCompare(b.date))
                  .map((p) => (
                    <div key={p.id}>
                      <span className={styles.planMarker} />
                      <Link href={`/exam/${p.skill}`}>
                        <strong>
                          {skills.find((s) => s.id === p.skill)?.name} Practice
                          01
                        </strong>
                        <small>
                          {new Date(p.date + "T12:00:00").toLocaleDateString(
                            "vi-VN",
                            {
                              weekday: "short",
                              day: "numeric",
                              month: "numeric",
                            },
                          )}
                        </small>
                      </Link>
                      <button
                        type="button"
                        onClick={() => removePlan(p.id)}
                        aria-label="Xóa lịch"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ))}
              </div>
            ) : (
              <div className={styles.empty}>
                <CalendarDays size={27} />
                <p>Dành một khoảng thời gian cho buổi luyện tiếp theo.</p>
                <button type="button" onClick={() => setOpen(true)}>
                  Đặt lịch luyện đầu tiên <Plus size={14} />
                </button>
              </div>
            )}
            <p className={styles.caption}>
              Lịch cá nhân được lưu trên thiết bị này.
            </p>
          </Card>
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="workspace-dialog">
          <DialogTitle>Lên lịch luyện tập</DialogTitle>
          <DialogDescription>
            Chọn kỹ năng và ngày bạn muốn dành thời gian luyện.
          </DialogDescription>
          <form
            className="admin-form"
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              const next = [
                ...plans,
                {
                  id: crypto.randomUUID(),
                  skill: String(data.get("skill")),
                  date: String(data.get("date")),
                },
              ];
              localStorage.setItem("aptis-plans", JSON.stringify(next));
              setPlans(next);
              setOpen(false);
            }}
          >
            <Label className="field-stack">
              Kỹ năng
              <SkillSelect />
            </Label>
            <Label className="field-stack">
              Ngày luyện
              <Input name="date" type="date" required />
            </Label>
            <Button type="submit">
              Lưu lịch <Check size={16} />
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
