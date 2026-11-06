"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { skills, readAttempts, type Attempt } from "@/lib/exams";
import { Icon } from "@/components/icon";
import { useScrollArtwork } from "@/lib/motion/use-scroll-artwork";
import styles from "./landing-journey.module.css";
export function ProgressInsights() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [selected, setSelected] = useState(0);
  useEffect(() => {
    const update = () => {
      const a = readAttempts();
      setAttempts(
        Array.isArray(a)
          ? a.filter(
              (x) =>
                skills.some((s) => s.id === x.skill) &&
                Number.isFinite(x.duration),
            )
          : [],
      );
    };
    update();
    window.addEventListener("storage", update);
    return () => window.removeEventListener("storage", update);
  }, []);
  const counts = skills.map(
    (s) => attempts.filter((a) => a.skill === s.id).length,
  );
  const minutes = Math.round(
    attempts.reduce((sum, a) => sum + a.duration, 0) / 60,
  );
  const root = useScrollArtwork((tl) => {
    tl.fromTo(
      "[data-progress-branch]",
      { drawSVG: "0%" },
      { drawSVG: "100%", duration: 1.7, stagger: 0.2 },
      0,
    )
      .from(
        "[data-progress-node]",
        { scale: 0.2, transformOrigin: "center", duration: 0.5, stagger: 0.2 },
        0.6,
      )
      .from(
        "[data-progress-label]",
        { clipPath: "inset(0 100% 0 0)", duration: 0.6, stagger: 0.1 },
        1,
      );
  });
  return (
    <section
      ref={root}
      className={`${styles.section} ${styles.insights}`}
      id="insights"
      data-landing-section="insights"
    >
      <div className={styles.split}>
        <div>
          <h2 data-editorial-heading>
            Nhìn thấy việc đã làm.
            <br />
            <em>Biết nơi cần tiếp tục.</em>
          </h2>
          <p>
            Lịch sử bài luyện giúp bạn nhìn lại kỹ năng đã thực hành, thời gian
            đã dành và câu trả lời đã lưu.
          </p>
          <div className={styles.realMetrics}>
            <div>
              <strong>{attempts.length}</strong>
              <span>Bài đã nộp</span>
            </div>
            <div>
              <strong>{minutes}</strong>
              <span>Phút thực hành</span>
            </div>
          </div>
          <p className={styles.fine}>
            Dữ liệu thực trên trình duyệt này. Số bài và thời gian không phải
            điểm năng lực hay kết quả CEFR. Chấm điểm AI đang được phát triển.
          </p>
          <Link className={styles.textLink} href="/results">
            Xem lại bài làm của bạn <Icon name="arrow_forward" />
          </Link>
        </div>
        <div className={styles.coverageArtwork}>
          <svg
            viewBox="0 0 600 440"
            role="img"
            aria-label="Số bài luyện đã nộp ở từng kỹ năng"
          >
            <path d="M30 214h45" stroke="#AAA1DE" fill="none" />
            <path d="M78 47v338" stroke="#E4E0F6" fill="none" />
            {skills.map((s, i) => (
              <g
                key={s.id}
                className={
                  selected === i ? styles.focusBranch : styles.quietBranch
                }
              >
                <path
                  data-progress-branch
                  d={`M75 214C170 214 160 ${65 + i * 100} 270 ${65 + i * 100}S415 ${65 + i * 100} 545 ${65 + i * 100}`}
                  fill="none"
                />
                <g data-progress-node>
                  <path d={`M270 ${57 + i * 100}v16m-8-8h16`} fill="none" />
                  <circle cx="545" cy={65 + i * 100} r="4" />
                </g>
                <text data-progress-label x="285" y={50 + i * 100}>
                  {s.name}
                </text>
                <text
                  data-progress-label
                  x="545"
                  y={49 + i * 100}
                  textAnchor="end"
                >
                  {counts[i]} bài
                </text>
              </g>
            ))}
          </svg>
          <div className={styles.skillFilters}>
            {skills.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setSelected(i)}
                aria-pressed={selected === i}
              >
                <Icon name={s.icon} />
                {s.name}
              </button>
            ))}
          </div>
          {!attempts.length && (
            <p className={styles.fine}>
              Chưa có bài đã nộp. Hành trình của bạn sẽ hiện ở đây sau lần luyện
              đầu tiên.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
