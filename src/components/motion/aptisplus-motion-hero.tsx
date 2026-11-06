"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AptisPlusSymbol } from "./aptisplus-symbol";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import styles from "./cinematic.module.css";
gsap.registerPlugin(useGSAP, DrawSVGPlugin, SplitText, ScrollTrigger);
export const WAVE_HEIGHTS = [
  12, 24, 17, 38, 29, 53, 34, 21, 44, 63, 38, 22, 52, 32, 69, 43, 28, 59, 36,
  24, 49, 66, 32, 48, 23, 37, 58, 29, 45, 18, 35, 50, 25, 39, 16, 28,
];
export function AptisPlusMotionHero({ ready = true }: { ready?: boolean }) {
  const root = useRef<HTMLElement>(null);
  const [choice, setChoice] = useState(1);
  useGSAP(
    () => {
      const el = root.current;
      if (!el || !ready) return;
      const mm = gsap.matchMedia();
      mm.add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          const master = gsap.timeline({
            paused: true,
            id: "aptis-hero-intro",
            defaults: { ease: "power3.out" },
            onStart: () => {
              el.dataset.motionState = "playing";
            },
            onComplete: () => {
              el.dataset.motionState = "complete";
            },
          });
          let first = true;
          const split = SplitText.create(
            el.querySelector("[data-motion-title]")!,
            {
              type: "lines",
              mask: "lines",
              autoSplit: true,
              linesClass: "hero-line",
              onSplit(self) {
                const tween = gsap.fromTo(
                  self.lines,
                  {
                    yPercent: 112,
                    rotationX: -12,
                    transformOrigin: "50% 100%",
                  },
                  {
                    yPercent: 0,
                    rotationX: 0,
                    stagger: 0.14,
                    duration: 0.95,
                    ease: "power4.out",
                    paused: first,
                  },
                );
                if (first) {
                  master.add(tween, 0.44);
                  tween.paused(false);
                  first = false;
                } else tween.progress(1);
                return tween;
              },
            },
          );
          master
            .fromTo(
              "[data-hero-contour]",
              { drawSVG: "0% 12%" },
              {
                drawSVG: "0% 100%",
                duration: 1.8,
                stagger: 0.1,
                ease: "power2.inOut",
              },
              0.3,
            )
            .fromTo(
              "[data-logo-trace]",
              { drawSVG: "0%", opacity: 1 },
              { drawSVG: "100%", duration: 1.05, ease: "power2.inOut" },
              0,
            )
            .fromTo(
              "[data-logo-body]",
              { clipPath: "inset(100% 0% 0% 0%)", y: 20 },
              { clipPath: "inset(0% 0% 0% 0%)", y: 0, duration: 1.05 },
              0.55,
            )
            .fromTo(
              "[data-logo-ribbon]",
              {
                scaleX: 0.04,
                rotation: -22,
                opacity: 0,
                transformOrigin: "0% 50%",
              },
              {
                scaleX: 1,
                rotation: 0,
                opacity: 1,
                duration: 1.1,
                ease: "back.out(1.25)",
              },
              0.85,
            )
            .fromTo(
              "[data-logo-plus]",
              { scale: 0, rotation: -85, transformOrigin: "50% 50%" },
              { scale: 1, rotation: 0, duration: 0.8, ease: "back.out(1.9)" },
              1.3,
            )
            .to("[data-logo-trace]", { opacity: 0, duration: 0.35 }, 1.25)
            .fromTo(
              "[data-exam-frame]",
              {
                y: 120,
                z: -100,
                rotationY: -18,
                rotationX: 14,
                rotationZ: 3,
                scale: 0.86,
                opacity: 0,
              },
              {
                y: 0,
                z: 0,
                rotationY: -6,
                rotationX: 2,
                rotationZ: -4,
                scale: 1,
                opacity: 1,
                duration: 1.35,
                ease: "expo.out",
              },
              0.95,
            )
            .from(
              "[data-preview-header]",
              { clipPath: "inset(0 100% 0 0)", duration: 0.6 },
              1.55,
            )
            .from(
              "[data-preview-prompt]",
              { y: 13, opacity: 0, duration: 0.5 },
              1.7,
            )
            .from(
              "[data-wave-bar]",
              {
                scaleY: 0,
                transformOrigin: "50% 50%",
                duration: 0.65,
                stagger: { each: 0.016, from: "center" },
                ease: "back.out(1.25)",
              },
              1.6,
            )
            .from(
              "[data-preview-answer]",
              { x: 22, opacity: 0, duration: 0.5, stagger: 0.1 },
              1.95,
            )
            .from(
              "[data-answer-selection]",
              { scaleX: 0, transformOrigin: "left", duration: 0.5 },
              2.35,
            )
            .from(
              "[data-answer-check]",
              { scale: 0, rotation: -45, duration: 0.4, ease: "back.out(2)" },
              2.65,
            )
            .from(
              "[data-motion-desc]",
              { y: 15, opacity: 0, duration: 0.65 },
              1.45,
            )
            .from(
              "[data-motion-cta]",
              { clipPath: "inset(0 100% 0 0)", duration: 0.65 },
              1.8,
            )
            .from("[data-hero-details]", { opacity: 0, duration: 0.45 }, 2.2);
          master.play(0);
          return () => {
            split.revert();
            delete el.dataset.motionState;
          };
        },
        root,
      );
      mm.add(
        "(min-width: 900px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap
            .timeline({
              scrollTrigger: {
                id: "aptis-hero-handoff",
                trigger: el,
                start: "top top",
                end: "bottom top",
                scrub: 0.65,
                invalidateOnRefresh: true,
              },
            })
            .to(
              "[data-mark-stage]",
              {
                yPercent: 28,
                xPercent: 7,
                rotation: 9,
                scale: 0.88,
                duration: 1,
                ease: "none",
              },
              0,
            )
            .to(
              "[data-product-stage]",
              {
                yPercent: -19,
                xPercent: -6,
                scale: 1.045,
                duration: 1,
                ease: "none",
              },
              0,
            )
            .to(
              "[data-hero-copy]",
              { yPercent: -10, opacity: 0.35, duration: 1, ease: "none" },
              0,
            );
        },
        root,
      );
      return () => mm.revert();
    },
    { scope: root, dependencies: [ready], revertOnUpdate: true },
  );
  return (
    <section
      ref={root}
      id="experience"
      className={styles.hero}
      data-motion-hero
      aria-labelledby="aptis-hero-title"
    >
      <div className={styles.heroInner}>
        <div className={styles.heroCopy} data-hero-copy>
          <h1 id="aptis-hero-title" data-motion-title>
            Không chỉ luyện đề.
            <br />
            <em>Làm chủ</em>
            <br />
            phòng thi.
          </h1>
          <p data-motion-desc>
            Một hành trình luyện Aptis có chủ đích — từ bốn kỹ năng đến sự tự
            tin trong từng câu trả lời.
          </p>
          <div className={styles.heroActions} data-motion-cta>
            <Button asChild className="navy-button">
              <Link href="/practice">
                Bắt đầu luyện tập <Icon name="north_east" />
              </Link>
            </Button>
            <a href="#skills">
              Khám phá hành trình <Icon name="south" />
            </a>
          </div>
          <div className={styles.heroDetails} data-hero-details>
            <span>Listening</span>
            <i />
            <span>Reading</span>
            <i />
            <span>Speaking</span>
            <i />
            <span>Writing</span>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.markStage} data-mark-stage>
            <svg
              viewBox="0 0 600 500"
              className={styles.heroContours}
              aria-hidden="true"
            >
              <path
                data-hero-contour
                d="M10 440 C120 370 120 240 260 180 S420 170 590 50"
              />
              <path
                data-hero-contour
                d="M10 465 C130 395 130 265 270 205 S430 195 590 75"
              />
            </svg>
            <AptisPlusSymbol className={styles.heroMark} animated />
          </div>
          <div data-product-stage className={styles.productStage}>
            <div className={styles.examFrame} data-exam-frame>
              <div className={styles.previewHeader} data-preview-header>
                <span>
                  <Icon name="headphones" />
                  Listening
                </span>
                <strong>Aptis ESOL</strong>
              </div>
              <div className={styles.previewQuestion} data-preview-prompt>
                <small>Question 1 of 17 · Xem trước</small>
                <h2>What is the speaker trying to explain?</h2>
              </div>
              <div className={styles.previewAudio}>
                <Link href="/exam/listening" aria-label="Thử bài Listening">
                  <Icon name="play_circle" />
                </Link>
                <div className={styles.previewWave} aria-hidden="true">
                  {WAVE_HEIGHTS.map((h, i) => (
                    <i
                      data-wave-bar
                      key={i}
                      style={{ height: h * 0.52 + "px" }}
                    />
                  ))}
                </div>
                <span>
                  Audio
                  <br />
                  preview
                </span>
              </div>
              <div
                className={styles.previewAnswers}
                role="group"
                aria-label="Chọn thử đáp án Listening"
              >
                {[
                  "A change in the appointment",
                  "A new meeting schedule",
                  "The location of the office",
                ].map((text, i) => (
                  <button
                    key={text}
                    data-preview-answer
                    className={choice === i ? styles.selected : ""}
                    aria-pressed={choice === i}
                    onClick={() => setChoice(i)}
                  >
                    {i === 1 && (
                      <span
                        className={styles.answerSelection}
                        data-answer-selection
                      />
                    )}
                    <strong>{"ABC"[i]}</strong>
                    <span>{text}</span>
                    {choice === i && (
                      <span
                        className={styles.answerCheck}
                        data-answer-check={i === 1 ? "" : undefined}
                      >
                        <Icon name="check_circle" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <span className={styles.previewCaption}>
                Giao diện tương tác · Không phải bài thi đang chạy
              </span>
            </div>
          </div>
          <span className={styles.visualCaption}>Từ làm quen. Đến tự tin.</span>
        </div>
      </div>
      <a className={styles.scrollCue} href="#skills">
        <span>Cuộn để khám phá</span>
        <Icon name="south" />
      </a>
    </section>
  );
}
