"use client";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { A_RIBBON } from "./aptisplus-symbol";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import styles from "./cinematic.module.css";
gsap.registerPlugin(useGSAP, ScrollTrigger, DrawSVGPlugin);
export function ExamResolution() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          gsap
            .timeline({
              scrollTrigger: {
                id: "aptis-exam-resolution",
                trigger: root.current,
                start: "top 78%",
                end: "center 55%",
                scrub: 0.5,
              },
            })
            .fromTo(
              "[data-final-ribbon]",
              { drawSVG: "0%" },
              { drawSVG: "100%", duration: 1, ease: "none" },
              0,
            )
            .from(
              "[data-final-preview]",
              {
                rotationX: 10,
                y: 45,
                clipPath: "inset(0 0 100% 0)",
                duration: 0.9,
                ease: "power3.out",
              },
              0.12,
            )
            .from(
              "[data-final-option]",
              { x: 20, opacity: 0, stagger: 0.1, duration: 0.35 },
              0.5,
            )
            .from(
              "[data-final-cta]",
              { clipPath: "inset(0 100% 0 0)", duration: 0.5 },
              0.7,
            );
        },
        root,
      );
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <section className={styles.resolution} ref={root} id="how">
      <div className={styles.resolutionCopy}>
        <h2>
          Từ làm quen.
          <br />
          <em>Đến làm chủ.</em>
        </h2>
        <p>
          Bạn đã thấy cách bài thi vận hành.
          <br />
          Giờ là lúc bắt đầu với bài luyện của chính mình.
        </p>
        <div data-final-cta>
          <Button asChild className="navy-button">
            <Link href="/practice">
              Chọn kỹ năng của bạn <Icon name="north_east" />
            </Link>
          </Button>
          <Link className={styles.resolutionLink} href="/dashboard">
            Mở không gian học tập <Icon name="arrow_forward" />
          </Link>
        </div>
        <svg
          viewBox="20 105 210 125"
          aria-hidden="true"
          className={styles.finalRibbon}
        >
          <path
            data-final-ribbon
            d={A_RIBBON}
            fill="none"
            stroke="#b6aef3"
            strokeWidth=".7"
          />
        </svg>
      </div>
      <div className={styles.finalPreview} data-final-preview>
        <div className={styles.finalPreviewHeader}>
          <span>
            <Icon name="headphones" />
            Listening Practice
          </span>
          <span>40 phút</span>
        </div>
        <small>Question 1 of 17 · Giao diện xem trước</small>
        <h3>
          A doctor’s secretary calls about an appointment. What is changing?
        </h3>
        {["The date", "The time", "The place"].map((o, i) => (
          <div
            data-final-option
            key={o}
            className={i === 1 ? styles.finalSelected : ""}
          >
            <strong>{"ABC"[i]}</strong>
            <span>{o}</span>
            {i === 1 && <Icon name="check_circle" />}
          </div>
        ))}
        <Link href="/exam/listening">
          Thử trong phòng thi <Icon name="arrow_forward" />
        </Link>
      </div>
    </section>
  );
}
