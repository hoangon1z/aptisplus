"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { AimGlyph } from "./aim-svg-parts";
import {
  IntroBrandRig,
  IntroRibbonFragment,
  IntroTrails,
} from "./intro-vector-rig";
import { buildIntroTimeline } from "./intro-timeline";
import { useHomepageDocumentEntry } from "./document-entry";
import styles from "./aim-opening.module.css";

gsap.registerPlugin(useGSAP);
const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
export function AimOpening({
  onReveal,
  replay = false,
}: {
  onReveal: () => void;
  replay?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const skip = useRef<HTMLButtonElement>(null);
  const finish = useRef<() => void>(() => {});
  // Keep the launching control across Strict Mode's setup → cleanup → setup.
  const returnFocus = useRef<HTMLElement | null>(null);
  const documentEntry = useHomepageDocumentEntry();
  useGSAP(
    () => {
      const el = root.current!;
      const content = document.querySelector<HTMLElement>(
        "[data-landing-content]",
      )!;
      if (
        (!replay && !documentEntry) ||
        matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        onReveal();
        return;
      }
      const previousOverflow = document.documentElement.style.overflow;
      const previousRestoration = history.scrollRestoration;
      if (!returnFocus.current && !el.contains(document.activeElement)) {
        returnFocus.current = document.activeElement as HTMLElement | null;
      }
      const previousFocus = returnFocus.current;
      const release = () => {
        document.documentElement.style.overflow = previousOverflow;
        history.scrollRestoration = previousRestoration;
        content.inert = false;
      };
      let active = true;
      let revealed = false;
      const reveal = () => {
        if (!revealed) {
          revealed = true;
          onReveal();
        }
      };
      let rig: ReturnType<typeof buildIntroTimeline> | undefined;
      const close = () => {
        active = false;
        document.removeEventListener("keydown", key);
        reduced.removeEventListener("change", preference);
        release();
        rig?.restoreHeader();
        el.style.display = "none";
        el.dataset.openingState = "complete";
        if (el.contains(document.activeElement)) {
          const destination =
            previousFocus && previousFocus !== document.body
              ? previousFocus
              : content.querySelector<HTMLElement>("a");
          destination?.focus({ preventScroll: true });
        }
      };
      const stop = () => {
        rig?.tl.kill();
        reveal();
        close();
      };
      document.documentElement.style.overflow = "hidden";
      history.scrollRestoration = "manual";
      window.scrollTo({ top: 0, behavior: "instant" });
      content.inert = true;
      el.style.display = "grid";
      el.dataset.openingState = "playing";
      el.focus({ preventScroll: true });
      const key = (event: KeyboardEvent) => {
        if (!active) return;
        if (event.key === "Escape") stop();
        if (event.key === "Tab") {
          event.preventDefault();
          skip.current?.focus();
        }
      };
      const reduced = matchMedia("(prefers-reduced-motion: reduce)");
      const preference = () => {
        if (active && reduced.matches) stop();
      };
      document.addEventListener("keydown", key);
      reduced.addEventListener("change", preference);
      try {
        rig = buildIntroTimeline(el, content, reveal, close);
        finish.current = stop;
        rig.tl.play(0);
      } catch (error) {
        stop();
        console.error("AptisPlus intro recovered:", error);
      }
      return () => {
        document.removeEventListener("keydown", key);
        reduced.removeEventListener("change", preference);
        release();
        rig?.dispose();
        finish.current = () => {};
      };
    },
    { scope: root },
  );
  return (
    <div
      ref={root}
      className={styles.opening}
      data-aim-opening
      role="dialog"
      aria-modal="true"
      aria-labelledby="aim-opening-title"
      tabIndex={-1}
    >
      <div className={styles.curtain} data-intro-curtain />
      <button
        ref={skip}
        className={styles.skip}
        data-intro-skip
        onClick={() => finish.current()}
      >
        Bỏ qua ↗
      </button>
      <div className={styles.composition}>
        <div className={styles.trails}>
          <IntroTrails />
        </div>
        <div className={styles.copy} data-aim-copy>
          <p className={styles.eyebrow} data-aim-eyebrow>
            Một mục tiêu. Cả hành trình phía trước.
          </p>
          <h2 id="aim-opening-title" className={styles.title} data-aim-title>
            Bạn muốn đạt
            <br />
            <strong data-aim-emphasis>B2</strong> hay{" "}
            <strong data-aim-emphasis>C1</strong>?
          </h2>
        </div>
        <div className={styles.levels} aria-label="Các trình độ từ A1 đến C2">
          {levels.map((level, i) => (
            <div
              key={level}
              className={styles.level}
              data-aim-level={level}
              data-target={i === 3 || i === 4}
            >
              <small>0{i + 1}</small>
              <span>{level}</span>
              {(i === 3 || i === 4) && <i>Mục tiêu</i>}
            </div>
          ))}
        </div>
        {levels.map((level, i) => (
          <div className={styles.fragment} data-ribbon-fragment={i} key={level}>
            <IntroRibbonFragment index={i} />
          </div>
        ))}
        {levels.map((level, i) => (
          <div className={styles.piece} data-intro-accent={i} key={level}>
            <AimGlyph kind={i} />
          </div>
        ))}
      </div>
      <div className={styles.assembly} data-intro-brand>
        <IntroBrandRig />
      </div>
      <div className={styles.caption} data-brand-caption>
        Từ mục tiêu. Đến thành tích.
      </div>
      <p className={styles.footer} data-intro-footer>
        LISTENING · READING · SPEAKING · WRITING
      </p>
    </div>
  );
}
