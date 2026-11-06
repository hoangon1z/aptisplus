"use client";
import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Check, Flame, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icon } from "@/components/icon";
import { skills, type Attempt } from "@/lib/exams";
import { activeStreak, dailyActivity } from "./learning-data";
import styles from "./dashboard-v5.module.css";

gsap.registerPlugin(useGSAP, DrawSVGPlugin);

export function LearningOverview({
  attempts,
  ready,
  today,
}: {
  attempts: Attempt[];
  ready: boolean;
  today: Date;
}) {
  const root = useRef<HTMLDivElement>(null);
  const chartRef = useRef<SVGSVGElement>(null);
  const [chartWidth, setChartWidth] = useState(372);
  useEffect(() => {
    const node = chartRef.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) =>
      setChartWidth(Math.max(240, Math.round(entry.contentRect.width))),
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  const [range, setRange] = useState("7");
  const id = useId().replace(/:/g, "");
  const practiced = skills.filter((s) =>
    attempts.some((a) => a.skill === s.id),
  ).length;
  const coverage = practiced * 25;
  const maxSkill = Math.max(
    1,
    ...skills.map((s) => attempts.filter((a) => a.skill === s.id).length),
  );
  const daily = dailyActivity(attempts, Number(range), today);
  const max = Math.max(1, ...daily.map((d) => d.count));
  const points = daily.map((d, i) => ({
    x: 38 + (i * (chartWidth - 62)) / (daily.length - 1),
    y: 104 - (d.count / max) * 76,
    ...d,
  }));
  const line = points
    .map((p, i) =>
      i
        ? `C${(points[i - 1].x + p.x) / 2} ${points[i - 1].y} ${(points[i - 1].x + p.x) / 2} ${p.y} ${p.x} ${p.y}`
        : `M${p.x} ${p.y}`,
    )
    .join(" ");
  const total = daily.reduce((n, d) => n + d.count, 0);
  const week = dailyActivity(attempts, 7, today);
  const streak = activeStreak(attempts, today);
  const minutes = Math.round(attempts.reduce((n, a) => n + a.duration, 0) / 60);
  useGSAP(
    () => {
      if (!ready) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-coverage-arc]",
          { drawSVG: "0%" },
          { drawSVG: `${coverage}%`, duration: 1.15, ease: "power3.out" },
        );
        gsap.fromTo(
          "[data-chart-line]",
          { strokeDashoffset: 100 },
          { strokeDashoffset: 0, duration: 1.1, ease: "power2.out" },
        );
      });
      return () => mm.revert();
    },
    {
      scope: root,
      dependencies: [ready, coverage, range, total],
      revertOnUpdate: true,
    },
  );
  return (
    <div ref={root} id="learning-overview" className={styles.overviewGrid}>
      <Card className={`${styles.panel} ${styles.coveragePanel}`}>
        <div className={styles.panelHeading}>
          <h2>Độ phủ luyện tập</h2>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className={styles.infoButton}
                aria-label="Độ phủ luyện tập là gì?"
              >
                <Info size={15} />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              Phần trăm kỹ năng đã có bài nộp. Không phải điểm năng lực tiếng
              Anh.
            </TooltipContent>
          </Tooltip>
        </div>
        <div className={styles.coverageLayout}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className={`${styles.coverageRing} coverage-ring`}
                aria-label={`${practiced} trên 4 kỹ năng đã có bài nộp`}
              >
                <svg viewBox="0 0 160 160" fill="none" aria-hidden="true">
                  <defs>
                    <linearGradient id={`${id}-arc`}>
                      <stop stopColor="#514fe4" />
                      <stop offset="1" stopColor="#a994ff" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="80"
                    cy="80"
                    r="65"
                    stroke="#eeedff"
                    strokeWidth="12"
                  />
                  <circle
                    data-coverage-arc
                    cx="80"
                    cy="80"
                    r="65"
                    stroke={`url(#${id}-arc)`}
                    strokeWidth="12"
                    strokeLinecap={coverage ? "round" : "butt"}
                    strokeDasharray={`${coverage * 4.084} 408.4`}
                    transform="rotate(-90 80 80)"
                  />
                  {skills.map((s, i) => {
                    const angle = ((i * 90 - 90) * Math.PI) / 180;
                    return (
                      <circle
                        key={s.id}
                        cx={80 + 65 * Math.cos(angle)}
                        cy={80 + 65 * Math.sin(angle)}
                        r="3"
                        fill={
                          attempts.some((a) => a.skill === s.id)
                            ? "#fff"
                            : "#d6d3f5"
                        }
                      />
                    );
                  })}
                </svg>
                <span className={styles.ringValue}>
                  {ready ? `${coverage}%` : "—"}
                  <small>{practiced}/4 kỹ năng</small>
                </span>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              {practiced} kỹ năng có bài nộp · {attempts.length} bài đã lưu.
            </TooltipContent>
          </Tooltip>
          <div className={styles.skillRows}>
            {skills.map((s) => {
              const all = attempts.filter((a) => a.skill === s.id);
              const latest = [...all].sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime(),
              )[0];
              return (
                <Tooltip key={s.id}>
                  <TooltipTrigger asChild>
                    <Link href={`/exam/${s.id}`} className={styles.skillRow}>
                      <Icon name={s.icon} />
                      <span>{s.name}</span>
                      <span className={styles.skillBar}>
                        <i
                          style={{ width: `${(all.length / maxSkill) * 100}%` }}
                        />
                      </span>
                      <strong>
                        {all.length}
                        <small> lượt</small>
                      </strong>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    {latest
                      ? `Gần nhất: ${new Date(latest.date).toLocaleDateString("vi-VN")} · ${Math.ceil(latest.duration / 60)} phút`
                      : "Chưa có bài nộp. Chọn để khám phá kỹ năng."}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>
        <p className={styles.caption}>
          Kỹ năng đã luyện, không phải điểm năng lực.
        </p>
        <div className={styles.realStats}>
          <span>
            <strong>{attempts.length}</strong> bài đã nộp
          </span>
          <span>
            <strong>{minutes}</strong> phút luyện
          </span>
        </div>
      </Card>
      <Card className={`${styles.panel} ${styles.activityPanel}`}>
        <div className={styles.panelHeading}>
          <h2>Hoạt động gần đây</h2>
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger
              aria-label="Khoảng thời gian hoạt động"
              className={styles.rangeSelect}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 ngày</SelectItem>
              <SelectItem value="30">30 ngày</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className={styles.chartSummary}>
          <strong>{total}</strong> bài nộp <span>trong {range} ngày qua</span>
        </p>
        <svg
          ref={chartRef}
          className={styles.chart}
          viewBox={`0 0 ${chartWidth} 140`}
          role="img"
          aria-label={`${total} bài nộp trong ${range} ngày qua`}
        >
          <defs>
            <linearGradient id={`${id}-area`} x2="0" y2="1">
              <stop stopColor="#8d7aff" stopOpacity=".25" />
              <stop offset="1" stopColor="#8d7aff" stopOpacity="0" />
            </linearGradient>
          </defs>
          {(max > 1 ? [0, Math.ceil(max / 2) / max, 1] : [0, 1]).map((t) => (
            <g key={t}>
              <line
                x1="38"
                x2={chartWidth - 24}
                y1={104 - t * 76}
                y2={104 - t * 76}
                stroke="#eeedf6"
              />
              <text x="26" y={108 - t * 76} textAnchor="end">
                {Math.round(t * max)}
              </text>
            </g>
          ))}
          {total > 0 && (
            <>
              <path
                d={`${line}L${chartWidth - 24} 104L38 104Z`}
                fill={`url(#${id}-area)`}
              />
              <path
                data-chart-line
                pathLength="100"
                strokeDasharray="100"
                strokeDashoffset="0"
                d={line}
                fill="none"
                stroke="#6950f2"
                strokeWidth="2.5"
              />
              {points
                .filter((p) => p.count > 0)
                .map((p) => (
                  <Tooltip key={p.key}>
                    <TooltipTrigger asChild>
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="4"
                        fill="#fff"
                        stroke="#6950f2"
                        strokeWidth="2"
                        tabIndex={0}
                        role="button"
                        aria-label={`${p.date.toLocaleDateString("vi-VN")}: ${p.count} bài nộp`}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      {p.date.toLocaleDateString("vi-VN")}: {p.count} bài nộp
                    </TooltipContent>
                  </Tooltip>
                ))}
            </>
          )}
          {points
            .filter(
              (_, i) =>
                i === 0 ||
                i === points.length - 1 ||
                i === Math.floor(points.length / 2),
            )
            .map((p) => (
              <text key={p.key} x={p.x} y="130" textAnchor="middle">
                {p.date.toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                })}
              </text>
            ))}
          {!total && (
            <text
              x={(chartWidth + 14) / 2}
              y="69"
              textAnchor="middle"
              className={styles.chartEmpty}
            >
              Chưa có bài nộp trong khoảng này
            </text>
          )}
        </svg>
        <Link href="/results" className={styles.quietLink}>
          Xem lịch sử bài làm
        </Link>
      </Card>
      <Card className={`${styles.panel} ${styles.streakPanel}`}>
        <div className={styles.panelHeading}>
          <h2>Nhịp học của bạn</h2>
        </div>
        <div className={styles.streakSummary}>
          <span className={styles.flame}>
            <Flame size={42} strokeWidth={1.5} />
          </span>
          <div>
            <strong>
              {streak}
              <span> ngày liên tiếp</span>
            </strong>
            <p>
              {streak
                ? "Mỗi ngày một chút. Giữ nhịp nhé."
                : "Bắt đầu nhịp luyện từ hôm nay."}
            </p>
          </div>
        </div>
        <div className={styles.week}>
          {week.map((d) => (
            <Tooltip key={d.key}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label={`${d.date.toLocaleDateString("vi-VN")}: ${d.count} bài nộp`}
                >
                  <span>
                    {d.date.toLocaleDateString("vi-VN", { weekday: "short" })}
                  </span>
                  <i className={d.count ? styles.dayDone : ""}>
                    {d.count ? <Check size={14} /> : <span />}
                  </i>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                {d.date.toLocaleDateString("vi-VN")} · {d.count} bài nộp
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        <p className={styles.caption}>
          Tính từ ngày có bài nộp đã lưu trên thiết bị.
        </p>
      </Card>
    </div>
  );
}
