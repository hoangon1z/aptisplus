"use client";
import Link from "next/link";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { SkillSignal, SIGNAL_SHAPES } from "../landing/skill-signal";
import Image from "next/image";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Icon } from "@/components/icon";
import { skills } from "@/lib/exams";
import { A_RIBBON } from "./aptisplus-symbol";
import { WAVE_HEIGHTS } from "./aptisplus-motion-hero";
import styles from "./cinematic.module.css";
gsap.registerPlugin(
  useGSAP,
  ScrollTrigger,
  SplitText,
  DrawSVGPlugin,
  MorphSVGPlugin,
);
const chapters = [
  {
    title: "Lắng nghe để hiểu.",
    detail:
      "Bắt nhịp hội thoại, nhận diện thông tin và chọn câu trả lời có chủ đích.",
    metaphor: "Từ âm thanh, tìm ra thông điệp.",
  },
  {
    title: "Đọc với chủ đích.",
    detail:
      "Kết nối cấu trúc, ý chính và những chi tiết làm nên ý nghĩa của đoạn văn.",
    metaphor: "Từ các dòng chữ, nhìn thấy cấu trúc.",
  },
  {
    title: "Nói thật tự tin.",
    detail:
      "Quan sát hình ảnh, sắp xếp suy nghĩ và diễn đạt quan điểm của chính bạn.",
    metaphor: "Từ suy nghĩ, cất thành lời.",
  },
  {
    title: "Viết thật rõ ràng.",
    detail:
      "Biến ý tưởng thành câu trả lời nhất quán, đúng ngữ cảnh và có mạch lạc.",
    metaphor: "Từ ý tưởng, hình thành câu chữ.",
  },
];
const writingWords =
  "Dear Alex, I was disappointed to hear about the change. I think the club could arrange another meeting so everyone has a chance to join.".split(
    " ",
  );
export function FourSkillsStory() {
  const root = useRef<HTMLElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(
        "(min-width: 900px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          el.classList.add(styles.pinned);
          const scenes = Array.from(
            el.querySelectorAll<HTMLElement>("[data-skill-scene]"),
          );
          const splits: SplitText[] = [];
          let current = -1;
          const sync = (p: number) => {
            const i = Math.min(3, Math.floor(p * 4));
            el.dataset.chapter = String(i);
            el.dataset.storyProgress = p.toFixed(4);
            if (i !== current) {
              current = i;
              setActive(i);
              scenes.forEach((s, n) => {
                s.inert = n !== i;
              });
            }
          };
          gsap.set(scenes, {
            autoAlpha: 0,
            xPercent: 0,
            rotationY: 0,
            scale: 1,
          });
          gsap.set(scenes[0], { autoAlpha: 1 });
          const tl = gsap.timeline({
            id: "aptis-four-skills",
            scrollTrigger: {
              id: "aptis-four-skills",
              trigger: el,
              start: "top top",
              end: () => "+=" + Math.round(innerHeight * 3.6),
              pin: true,
              scrub: 0.65,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => sync(self.progress),
            },
          });
          trigger.current = tl.scrollTrigger || null;
          scenes.slice(1).forEach((scene, i) => {
            const start = 1.7 + i * 2.2;
            tl.to(
              scenes[i],
              {
                autoAlpha: 0,
                xPercent: -14,
                rotationY: -7,
                scale: 0.95,
                duration: 0.7,
                ease: "power2.inOut",
              },
              start,
            ).fromTo(
              scene,
              { autoAlpha: 0, xPercent: 18, rotationY: 7, scale: 0.95 },
              {
                autoAlpha: 1,
                xPercent: 0,
                rotationY: 0,
                scale: 1,
                duration: 0.7,
                ease: "power2.inOut",
              },
              start + 0.2,
            );
          });
          scenes.forEach((scene, i) => {
            const title = scene.querySelector("[data-chapter-title]")!;
            let initial = true;
            const split = SplitText.create(title, {
              type: "lines",
              mask: "lines",
              autoSplit: true,
              linesClass: "chapter-line",
              onSplit(self) {
                const tween = gsap.fromTo(
                  self.lines,
                  { yPercent: 105 },
                  {
                    yPercent: 0,
                    duration: 0.7,
                    stagger: 0.1,
                    ease: "power3.out",
                    paused: initial,
                  },
                );
                if (initial) {
                  tl.add(tween, i === 0 ? 0.1 : 2.2 * i + 0.2);
                  tween.paused(false);
                  initial = false;
                } else tween.progress(1);
                return tween;
              },
            });
            splits.push(split);
          });
          tl.from(
            "[data-listening-bar]",
            {
              scaleY: 0.05,
              transformOrigin: "50% 50%",
              stagger: { each: 0.01, from: "center" },
              duration: 0.65,
              ease: "back.out(1.4)",
            },
            0.15,
          )
            .fromTo(
              "[data-listening-scan]",
              { scaleX: 0 },
              { scaleX: 1, transformOrigin: "left", duration: 1, ease: "none" },
              0.6,
            )
            .fromTo(
              "[data-reading-highlight]",
              { scaleX: 0 },
              {
                scaleX: 1,
                transformOrigin: "left",
                duration: 1.1,
                ease: "power2.inOut",
              },
              2.55,
            )
            .from(
              "[data-reading-heading]",
              { x: 45, rotation: -4, duration: 0.65, ease: "power3.out" },
              2.85,
            )
            .from(
              '[data-speaking-photo="0"]',
              { x: -55, rotation: -8, duration: 0.8, ease: "power3.out" },
              4.65,
            )
            .from(
              '[data-speaking-photo="1"]',
              { x: 55, rotation: 8, duration: 0.8, ease: "power3.out" },
              4.65,
            )
            .fromTo(
              "[data-speaking-ring]",
              { drawSVG: "0%" },
              { drawSVG: "100%", duration: 1.1, ease: "power2.inOut" },
              4.75,
            )
            .fromTo(
              "[data-writing-word]",
              { opacity: 0 },
              { opacity: 1, stagger: 0.035, duration: 0.12, ease: "none" },
              6.85,
            )
            .fromTo(
              "[data-writing-cursor]",
              { opacity: 0 },
              {
                opacity: 1,
                duration: 0.18,
                repeat: 3,
                yoyo: true,
                ease: "none",
              },
              7.55,
            )
            .to(
              "[data-story-ribbon]",
              {
                rotation: 28,
                xPercent: 20,
                yPercent: -12,
                duration: 8.8,
                ease: "none",
              },
              0,
            )
            .fromTo(
              "[data-story-progress]",
              { scaleX: 0.03 },
              { scaleX: 1, duration: 8.8, ease: "none" },
              0,
            );
          el.querySelectorAll<SVGPathElement>("[data-skill-signal]").forEach(
            (path, n) => {
              tl.fromTo(
                path,
                { drawSVG: "0%" },
                { drawSVG: "100%", duration: 1.2 },
                0,
              );
              [1, 2, 3].forEach((stage) =>
                tl.to(
                  path,
                  {
                    morphSVG: { shape: SIGNAL_SHAPES[n][stage] },
                    duration: 0.9,
                    ease: "power2.inOut",
                  },
                  1.7 + (stage - 1) * 2.2,
                ),
              );
            },
          );
          sync(0);
          return () => {
            splits.forEach((s) => s.revert());
            scenes.forEach((s) => {
              s.inert = false;
            });
            trigger.current = null;
            el.classList.remove(styles.pinned);
            delete el.dataset.chapter;
            delete el.dataset.storyProgress;
          };
        },
        root,
      );
      mm.add(
        "(max-width: 899px), (pointer: coarse), (prefers-reduced-motion: reduce)",
        () => {
          if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
          const scenes = Array.from(
            el.querySelectorAll<HTMLElement>("[data-skill-scene]"),
          );
          const locals: ScrollTrigger[] = [];
          scenes.forEach((scene, i) => {
            const local = ScrollTrigger.create({
              trigger: scene,
              start: "top 60%",
              onEnter: () => setActive(i),
              onEnterBack: () => setActive(i),
            });
            locals.push(local);
          });
          gsap.from(el.querySelectorAll("[data-listening-bar]"), {
            scaleY: 0.15,
            transformOrigin: "center",
            duration: 0.7,
            stagger: 0.01,
            scrollTrigger: { trigger: scenes[0], start: "top 75%", once: true },
          });
          gsap.fromTo(
            "[data-reading-highlight]",
            { scaleX: 0 },
            {
              scaleX: 1,
              transformOrigin: "left",
              duration: 0.85,
              scrollTrigger: {
                trigger: scenes[1],
                start: "top 65%",
                once: true,
              },
            },
          );
          gsap.fromTo(
            "[data-speaking-ring]",
            { drawSVG: "0%" },
            {
              drawSVG: "100%",
              duration: 1.2,
              scrollTrigger: {
                trigger: scenes[2],
                start: "top 65%",
                once: true,
              },
            },
          );
          gsap.fromTo(
            "[data-writing-word]",
            { opacity: 0 },
            {
              opacity: 1,
              stagger: 0.035,
              duration: 0.1,
              scrollTrigger: {
                trigger: scenes[3],
                start: "top 65%",
                once: true,
              },
            },
          );
          return () => locals.forEach((t) => t.kill());
        },
        root,
      );
      return () => mm.revert();
    },
    { scope: root },
  );
  function go(i: number) {
    if (trigger.current) {
      const top =
        trigger.current.start +
        (trigger.current.end - trigger.current.start) * ((i + 0.4) / 4);
      window.scrollTo({ top, behavior: "auto" });
    } else
      root.current?.querySelectorAll("[data-skill-scene]")[i]?.scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "start",
      });
    setActive(i);
  }
  return (
    <section
      ref={root}
      id="skills"
      className={styles.story}
      data-motion-story
      aria-labelledby="skills-heading"
    >
      <div className={styles.storyLayout}>
        <div className={styles.storyIntro}>
          <h2 id="skills-heading">
            Bốn kỹ năng.
            <br />
            <em>Một hành trình.</em>
          </h2>
          <p>
            Không còn xa lạ với phòng thi. Đi qua từng kỹ năng, tìm nhịp thực
            hành của chính bạn.
          </p>
          <div
            className={styles.chapterNavigation}
            role="tablist"
            aria-label="Bốn kỹ năng"
            aria-orientation="vertical"
          >
            {skills.map((s, i) => (
              <button
                id={"skill-tab-" + i}
                key={s.id}
                role="tab"
                aria-label={s.name}
                aria-selected={active === i}
                aria-controls={"skill-scene-" + i}
                data-chapter-tab
                onClick={() => go(i)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                    e.preventDefault();
                    const next = (i + (e.key === "ArrowDown" ? 1 : 3)) % 4;
                    go(next);
                    document.getElementById("skill-tab-" + next)?.focus();
                  }
                }}
              >
                <span>0{i + 1}</span>
                <Icon name={s.icon} />
                {s.name}
                <Icon name="arrow_forward" />
              </button>
            ))}
          </div>
          <SkillSignal active={active} />
          <div className={styles.storyTrack}>
            <span data-story-progress />
          </div>
          <div className={styles.storyHint}>
            <span>Cuộn để đi qua từng kỹ năng</span>
            <Icon name="south" />
          </div>
          <svg
            className={styles.storyRibbon}
            data-story-ribbon
            viewBox="20 105 210 125"
            aria-hidden="true"
          >
            <path d={A_RIBBON} fill="#6863c0" />
          </svg>
        </div>
        <div className={styles.scenes}>
          {skills.map((s, i) => (
            <article
              className={styles.scene}
              key={s.id}
              id={"skill-scene-" + i}
              data-skill-scene
              data-skill={s.id}
              role="tabpanel"
              aria-labelledby={"skill-tab-" + i}
            >
              <div className={styles.sceneTop}>
                <span>0{i + 1} / 04</span>
                <span>
                  <Icon name={s.icon} />
                  {s.name}
                </span>
              </div>
              <h3 data-chapter-title>{chapters[i].title}</h3>
              <p>{chapters[i].detail}</p>
              <div className={styles.skillProduct}>
                {i === 0 && (
                  <div className={styles.listeningProduct}>
                    <div className={styles.productLabel}>
                      <Icon name="headphones" />
                      <span>Listening · Xem trước</span>
                    </div>
                    <div className={styles.storyWave} aria-hidden="true">
                      {WAVE_HEIGHTS.map((v, n) => (
                        <i
                          key={n}
                          data-listening-bar
                          style={{ height: v + "px" }}
                        />
                      ))}
                    </div>
                    <p>What is changing about the appointment?</p>
                    <div className={styles.storyOption}>
                      <span>A</span>The date
                    </div>
                    <div
                      className={
                        styles.storyOption + " " + styles.storySelected
                      }
                    >
                      <i data-listening-scan />
                      <span>B</span>
                      <strong>The time</strong>
                      <Icon name="check_circle" />
                    </div>
                    <div className={styles.storyOption}>
                      <span>C</span>The place
                    </div>
                  </div>
                )}
                {i === 1 && (
                  <div className={styles.readingProduct}>
                    <div className={styles.productLabel}>
                      <Icon name="auto_stories" />
                      <span>Reading · Chọn heading</span>
                    </div>
                    <div data-reading-heading className={styles.readingHeading}>
                      <span>A journey without leaving Earth</span>
                      <Icon name="check" />
                    </div>
                    <div className={styles.paragraph}>
                      <p>
                        The crew entered a spaceship and prepared for a long
                        journey.
                      </p>
                      <p>
                        <mark>
                          <i data-reading-highlight />
                          Their destination was Mars, but the experiment took
                          place on Earth.
                        </mark>
                      </p>
                      <p>
                        Living together helped researchers understand the human
                        side of space travel.
                      </p>
                    </div>
                    <span className={styles.productFootnote}>
                      Đọc. Kết nối. Chọn ý chính.
                    </span>
                  </div>
                )}
                {i === 2 && (
                  <div className={styles.speakingProduct}>
                    <div className={styles.productLabel}>
                      <Icon name="mic" />
                      <span>Speaking · Mô tả hình ảnh</span>
                    </div>
                    <div className={styles.photoPair}>
                      <Image
                        data-speaking-photo="0"
                        src="/assets/golf.jpg"
                        width={300}
                        height={190}
                        alt="Một người đang chơi golf"
                      />
                      <Image
                        data-speaking-photo="1"
                        src="/assets/basketball.jpg"
                        width={300}
                        height={190}
                        alt="Một trận bóng rổ"
                      />
                    </div>
                    <p>Tell me what you see in the two pictures.</p>
                    <div className={styles.voicePrompt}>
                      <div className={styles.micRing}>
                        <svg viewBox="0 0 80 80" aria-hidden="true">
                          <circle
                            cx="40"
                            cy="40"
                            r="35"
                            stroke="#dedbf6"
                            strokeWidth="2"
                            fill="none"
                          />
                          <circle
                            data-speaking-ring
                            cx="40"
                            cy="40"
                            r="35"
                            stroke="#514fe4"
                            strokeWidth="3"
                            fill="none"
                            transform="rotate(-90 40 40)"
                          />
                        </svg>
                        <Icon name="mic" />
                      </div>
                      <div>
                        <strong>Quan sát. Sắp xếp. Cất lời.</strong>
                        <span>45 giây cho mỗi lượt trả lời</span>
                      </div>
                    </div>
                  </div>
                )}
                {i === 3 && (
                  <div className={styles.writingProduct}>
                    <div className={styles.productLabel}>
                      <Icon name="edit_note" />
                      <span>Writing · Email cho bạn</span>
                    </div>
                    <div className={styles.mailHeader}>
                      <span>To</span>
                      <strong>Alex</strong>
                      <span>Informal email</span>
                    </div>
                    <div className={styles.mailBody}>
                      {writingWords.map((word, n) => (
                        <span data-writing-word key={n}>
                          {word}{" "}
                        </span>
                      ))}
                      <i data-writing-cursor className={styles.writingCursor} />
                    </div>
                    <span className={styles.productFootnote}>
                      Ý rõ ràng. Câu mạch lạc. Đúng ngữ cảnh.
                    </span>
                  </div>
                )}
              </div>
              <div className={styles.sceneBottom}>
                <span>{chapters[i].metaphor}</span>
                <Link href={"/exam/" + s.id} aria-label={"Luyện " + s.name}>
                  Thực hành <Icon name="arrow_forward" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
