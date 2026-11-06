"use client";
import { studentStories } from "@/lib/landing-content";
import { useScrollArtwork } from "@/lib/motion/use-scroll-artwork";
import styles from "./landing-journey.module.css";
export function StudentStories() {
  const root = useScrollArtwork((tl) => {
    tl.fromTo(
      "[data-story-line]",
      { drawSVG: "0%" },
      { drawSVG: "100%", duration: 2, stagger: 0.2 },
      0,
    ).fromTo(
      "[data-story-sheet]",
      { rotation: -10, x: 45, transformOrigin: "50% 100%" },
      { rotation: 0, x: 0, duration: 2 },
      0,
    );
  });
  return (
    <section
      ref={root}
      id="stories"
      data-landing-section="stories"
      className={`${styles.section} ${styles.stories}`}
    >
      <div className={styles.split}>
        <div>
          <h2 data-editorial-heading>
            Hành trình thật.
            <br />
            <em>Câu chuyện thật.</em>
          </h2>
          <p>
            Mỗi người có một lý do để bắt đầu. Chúng mình muốn dành nơi này cho
            những trải nghiệm được chính học viên đồng ý chia sẻ.
          </p>
        </div>
        <svg
          viewBox="0 0 560 330"
          aria-hidden="true"
          className={styles.storyArtwork}
        >
          <path
            data-story-line
            d="M5 265 C110 265 85 40 230 56 S395 320 550 95"
            fill="none"
            stroke="#9386e8"
            strokeWidth="1"
          />
          <g data-story-sheet>
            <path d="M133 50 L440 28 L420 260 L114 290 Z" fill="#292943" />
            <path d="M140 48 L440 28 L420 260" fill="none" stroke="#777393" />
            {[112, 145, 178, 211].map((y, i) => (
              <path
                key={y}
                data-story-line
                d={`M170 ${y} L${365 - i * 24} ${y - 14}`}
                stroke={i === 0 ? "#b6a9ff" : "#777393"}
                strokeWidth={i === 0 ? 4 : 1}
              />
            ))}
          </g>
        </svg>
      </div>
      {studentStories.length ? (
        <div className={styles.verifiedStories}>
          {studentStories.map((story) => (
            <blockquote key={story.id}>
              <p>“{story.quote}”</p>
              <footer>
                {story.name} · {story.context}
              </footer>
            </blockquote>
          ))}
        </div>
      ) : (
        <div className={styles.publicationNote}>
          <span className={styles.statusDot} />
          <p>
            <strong>
              Chưa có câu chuyện học viên được xác minh để công bố.
            </strong>
            <br />
            Nội dung sẽ được bổ sung khi có sự đồng ý chia sẻ.
          </p>
        </div>
      )}
    </section>
  );
}
