"use client";
import { useState } from "react";
import { Icon } from "@/components/icon";
import { useScrollArtwork } from "@/lib/motion/use-scroll-artwork";
import styles from "./landing-journey.module.css";
export function WhyAptisPlus() {
  const [marked, setMarked] = useState(false);
  const [size, setSize] = useState(16);
  const [dark, setDark] = useState(false);
  const root = useScrollArtwork((tl) => {
    tl.fromTo(
      "[data-why-contour]",
      { drawSVG: "0%" },
      { drawSVG: "100%", duration: 3, stagger: 0.2 },
      0,
    ).fromTo(
      "[data-detail-rule]",
      { scaleX: 0, transformOrigin: "0 50%" },
      { scaleX: 1, duration: 2, stagger: 0.4 },
      0.3,
    );
  });
  return (
    <section
      ref={root}
      id="why"
      data-landing-section="why"
      className={`${styles.section} ${styles.why}`}
    >
      <div className={styles.journeyIntro}>
        <h2 data-editorial-heading>
          Ít bỡ ngỡ hơn.
          <br />
          <em>Tập trung vào bài làm.</em>
        </h2>
        <p>
          Những thao tác nhỏ cũng cần được làm quen: đánh dấu câu hỏi, điều
          hướng và điều chỉnh cách đọc phù hợp với bạn.
        </p>
      </div>
      <div className={styles.whyLayout}>
        <div className={`${styles.controlDemo} ${dark ? styles.demoDark : ""}`}>
          <div className={styles.demoTop}>
            <span>Thử ngay một thao tác</span>
            <button
              type="button"
              aria-label="Đánh dấu câu hỏi minh họa"
              aria-pressed={marked}
              onClick={() => setMarked(!marked)}
            >
              <Icon name={marked ? "bookmark_added" : "bookmark"} />
            </button>
          </div>
          <p style={{ fontSize: size }}>
            Câu hỏi này cần thêm một chút thời gian?
          </p>
          <button
            type="button"
            className={styles.bookmarkAction}
            onClick={() => setMarked(!marked)}
            aria-pressed={marked}
          >
            {marked ? "Đã đánh dấu để xem lại" : "Đánh dấu rồi tiếp tục"}
            <Icon name="arrow_forward" />
          </button>
          <div className={styles.demoBottom}>
            <span>{marked ? "Bookmarked (1)" : "Bookmarked (0)"}</span>
            <div>
              <button
                type="button"
                aria-label="Giảm cỡ chữ minh họa"
                disabled={size === 14}
                onClick={() => setSize(Math.max(14, size - 2))}
              >
                <Icon name="remove" />
              </button>
              <button
                type="button"
                aria-label="Tăng cỡ chữ minh họa"
                disabled={size === 22}
                onClick={() => setSize(Math.min(22, size + 2))}
              >
                <Icon name="add" />
              </button>
              <button
                type="button"
                aria-label="Đổi giao diện minh họa"
                aria-pressed={dark}
                onClick={() => setDark(!dark)}
              >
                <Icon name={dark ? "light_mode" : "dark_mode"} />
              </button>
            </div>
          </div>
          <svg viewBox="0 0 500 100" aria-hidden="true">
            <path data-why-contour d="M-10 95 C140 -50 280 130 510 12" />
            <path data-why-contour d="M-10 110 C140 -35 280 145 510 27" />
          </svg>
        </div>
        <div className={styles.whyDetails}>
          <article>
            <div data-detail-rule />
            <h3>Thao tác có chủ đích.</h3>
            <p>
              Danh sách câu hỏi và dấu bookmark giúp bạn quay lại phần cần xem
              lại trước khi nộp.
            </p>
          </article>
          <article>
            <div data-detail-rule />
            <h3>Không gian dễ đọc hơn.</h3>
            <p>
              Dark mode và phóng to, thu nhỏ trong phòng thi cho phép bạn điều
              chỉnh giao diện khi luyện tập.
            </p>
          </article>
          <article>
            <div data-detail-rule />
            <h3>Giữ lại để nhìn lại.</h3>
            <p>
              Lịch sử lưu câu trả lời trên thiết bị đang dùng. Bạn có thể mở lại
              bài làm thay vì bắt đầu từ trí nhớ.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
