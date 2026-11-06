"use client";
import Link from "next/link";
import { A_BODY, A_RIBBON, A_PLUS } from "@/components/motion/aptisplus-symbol";
import { Icon } from "@/components/icon";
import { useScrollArtwork } from "@/lib/motion/use-scroll-artwork";
import styles from "./landing-journey.module.css";
export function FinalCinematicCTA() {
  const root = useScrollArtwork((tl) => {
    tl.addLabel("skills:converge", 0)
      .fromTo(
        "[data-finale-strand]",
        { drawSVG: "0% 25%" },
        {
          drawSVG: "75% 100%",
          duration: 2.7,
          stagger: 0.12,
          ease: "power2.inOut",
        },
        0,
      )
      .fromTo(
        "[data-finale-outline]",
        { drawSVG: "0%" },
        { drawSVG: "100%", duration: 2.3, ease: "power2.inOut" },
        0.65,
      )
      .addLabel("brand:resolve", 1.5)
      .fromTo(
        "[data-finale-body]",
        { clipPath: "inset(100% 0 0 0)" },
        { clipPath: "inset(0% 0 0 0)", duration: 1.6, ease: "power3.out" },
        1.5,
      )
      .fromTo(
        "[data-finale-ribbon]",
        { scaleX: 0.05, rotation: -25, transformOrigin: "10% 90%" },
        { scaleX: 1, rotation: 0, duration: 1.4, ease: "power3.out" },
        1.8,
      )
      .fromTo(
        "[data-finale-plus]",
        { rotation: -90, scale: 0.2, transformOrigin: "center" },
        { rotation: 0, scale: 1, duration: 1, ease: "back.out(1.3)" },
        2.1,
      )
      .to(
        "[data-finale-strand]",
        { drawSVG: "100% 100%", duration: 0.9, stagger: 0.08 },
        2.4,
      )
      .addLabel("invitation:ready", 3.3);
  }, "clamp(bottom bottom)");
  return (
    <section
      ref={root}
      id="how"
      data-landing-section="finale"
      className={styles.finale}
    >
      <div className={styles.finaleCopy}>
        <h2 data-editorial-heading>
          Mục tiêu tiếp theo?
          <br />
          <em>Bắt đầu từ hôm nay.</em>
        </h2>
        <p>
          Một kỹ năng. Một bài luyện.
          <br />
          Thêm một bước tự tin vào phòng thi.
        </p>
        <div className={styles.finaleActions} data-final-cta>
          <Link href="/practice">
            Chọn bài luyện <Icon name="arrow_forward" />
          </Link>
          <Link href="/register">
            Tạo tài khoản <Icon name="north_east" />
          </Link>
        </div>
      </div>
      <svg
        data-final-preview
        className={styles.finaleArt}
        viewBox="0 0 720 650"
        aria-hidden="true"
      >
        <g fill="none" strokeWidth="1.3">
          {[
            "M5 100 C100 100 60 180 130 150 S140 80 210 140 S260 200 360 250",
            "M8 270 L125 270 C230 270 180 330 360 330",
            "M10 390 C100 390 90 440 160 420 S250 380 350 380",
            "M30 585 C160 585 140 480 240 490 S310 440 400 400",
          ].map((d, i) => (
            <path
              key={d}
              data-finale-strand
              d={d}
              stroke={["#afa0ff", "#7377ce", "#a2a8df", "#7d6bda"][i]}
            />
          ))}
        </g>
        <g transform="translate(235 145) scale(1.45)">
          <path
            data-finale-outline
            d={A_BODY}
            fill="none"
            stroke="#b9a6ff"
            strokeWidth=".7"
          />
          <path data-finale-body d={A_BODY} fill="#7562e7" />
          <path data-finale-ribbon d={A_RIBBON} fill="#c3b4ff" />
          <path data-finale-plus d={A_PLUS} fill="#b4a2ff" />
        </g>
      </svg>
      <div className={styles.finaleFoot}>
        <span>Listening · Reading · Speaking · Writing</span>
        <span>Học theo nhịp của bạn.</span>
      </div>
    </section>
  );
}
