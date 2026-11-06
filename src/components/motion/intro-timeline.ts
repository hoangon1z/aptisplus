import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { CustomEase } from "gsap/CustomEase";
import { INTRO_ROUTES, trajectoryPath } from "./intro-vector-rig";

gsap.registerPlugin(SplitText, DrawSVGPlugin, MotionPathPlugin, CustomEase);
const labels = {
  "intro:start": 0,
  "text:question": 0.65,
  "text:emphasis": 1.6,
  "levels:enter": 2.15,
  "levels:expand": 3.65,
  "logo:assemble": 5.05,
  "hero:reveal": 6.55,
  "intro:complete": 7.85,
};

export function buildIntroTimeline(
  root: HTMLElement,
  content: HTMLElement,
  reveal: () => void,
  complete: () => void,
) {
  const q = (selector: string) => root.querySelector<HTMLElement>(selector)!;
  const all = (selector: string) =>
    Array.from(root.querySelectorAll<HTMLElement>(selector));
  const cards = all("[data-aim-level]");
  const fragments = all("[data-ribbon-fragment]");
  const mark = q("[data-intro-brand]");
  const target = content.querySelector<HTMLElement>("[data-header-symbol]")!;
  const wordmark = content.querySelector<HTMLElement>(
    "[data-header-wordmark]",
  )!;
  const nav = Array.from(
    content.querySelectorAll<HTMLElement>(
      "[data-header-nav] > *, [data-header-actions] > *",
    ),
  );
  const width = () => innerWidth / 1000;
  const height = () => innerHeight / 760;
  const originals = [target, wordmark, ...nav].map((el) => ({
    el,
    style: el.getAttribute("style"),
  }));
  const restoreHeader = () =>
    originals.forEach(({ el, style }) =>
      style === null
        ? el.removeAttribute("style")
        : el.setAttribute("style", style),
    );
  const ease = CustomEase.create("aptisEditorial", "0.16, 1, 0.3, 1");
  const tl = gsap.timeline({
    id: "aptis-aim-opening",
    paused: true,
    defaults: { ease },
    onComplete: complete,
  });
  Object.entries(labels).forEach(([name, time]) => {
    tl.addLabel(name, time);
    tl.call(
      () => {
        root.dataset.scene = name;
      },
      [],
      time,
    );
  });
  gsap.set(mark, {
    xPercent: -50,
    yPercent: -50,
    transformOrigin: "0 0",
    autoAlpha: 1,
  });
  gsap.set([target, wordmark], { opacity: 0 });
  gsap.set(nav, { y: 10, opacity: 0 });
  gsap.set(cards, { xPercent: -50, yPercent: -50 });
  gsap.set(fragments, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
  gsap.set(all("[data-intro-accent]"), {
    xPercent: -50,
    yPercent: -50,
    opacity: 0,
  });
  gsap.set(q("[data-brand-caption]"), { opacity: 0 });
  gsap.set(all("[data-brand-part]"), {
    opacity: 0,
    transformOrigin: "50% 50%",
  });
  gsap.set(
    root.querySelectorAll(
      "[data-intro-trail], [data-intro-trail-echo], [data-brand-outline], [data-seed-stroke]",
    ),
    { drawSVG: "0%" },
  );
  let initial = true;
  const split = SplitText.create(q("[data-aim-title]"), {
    type: "words",
    mask: "words",
    autoSplit: true,
    wordsClass: "aim-word",
    maskClass: "aim-word-mask",
    onSplit(self) {
      const tween = gsap.fromTo(
        self.words,
        {
          yPercent: 118,
          rotationX: -22,
          rotationZ: 2,
          scale: 0.94,
          transformOrigin: "0 100%",
        },
        {
          yPercent: 0,
          rotationX: 0,
          rotationZ: 0,
          scale: 1,
          duration: 0.9,
          stagger: 0.085,
          ease,
          paused: initial,
        },
      );
      if (initial) {
        tl.add(tween, "text:question");
        tween.paused(false);
        initial = false;
      } else tween.progress(1);
      return tween;
    },
  });
  tl.to(
    q("[data-seed-stroke]"),
    { drawSVG: "100%", duration: 0.6, ease: "power2.inOut" },
    "intro:start",
  )
    .to(
      q("[data-seed-stroke]"),
      {
        y: innerWidth < 600 ? -138 : -185,
        scaleX: 0.5,
        opacity: 0.5,
        duration: 0.7,
      },
      "text:question",
    )
    .from(
      q("[data-aim-eyebrow]"),
      { clipPath: "inset(0 100% 0 0)", duration: 0.65 },
      "text:question+=.1",
    )
    .fromTo(
      all("[data-aim-emphasis]"),
      { color: "#161A35" },
      {
        color: "#514FE4",
        scale: 1.055,
        duration: 0.5,
        stagger: 0.14,
        transformOrigin: "50% 85%",
      },
      "text:emphasis",
    )
    .to(
      q("[data-aim-copy]"),
      { y: -28, clipPath: "inset(0 0 100% 0)", opacity: 0, duration: 0.6 },
      "levels:expand-=.5",
    )
    .to(
      q("[data-seed-stroke]"),
      { opacity: 0, duration: 0.25 },
      "levels:expand-=.35",
    );
  cards.forEach((card, i) => {
    const r = INTRO_ROUTES[i];
    const x = r.start[0] * width();
    const y = r.start[1] * height();
    tl.fromTo(
      card,
      {
        x: x * 0.35,
        y: y + 60,
        opacity: 0,
        rotationX: 50,
        rotationZ: (i - 2.5) * 3,
        scale: 0.55,
      },
      {
        x,
        y,
        opacity: 1,
        rotationX: 0,
        rotationZ: (i - 2.5) * 1.5,
        scale: 1,
        duration: 0.75,
      },
      `levels:enter+=${i * 0.105}`,
    )
      .to(
        card,
        {
          motionPath: { path: trajectoryPath(i, width(), height()) },
          rotationZ: (i - 2.5) * 12,
          scale: i === 3 || i === 4 ? 1.3 : 0.7,
          duration: 1.3,
          ease: "power3.inOut",
        },
        `levels:expand+=${i * 0.045}`,
      )
      .to(
        card,
        { opacity: 0, scale: 0.45, duration: 0.4 },
        `logo:assemble-=${0.18 - i * 0.025}`,
      );
    const trail = q(`[data-intro-trail="${i}"]`);
    const echo = q(`[data-intro-trail-echo="${i}"]`);
    tl.to(
      [trail, echo],
      { drawSVG: "100%", duration: 1.25, stagger: 0.09, ease: "power2.inOut" },
      `levels:expand+=${i * 0.045}`,
    ).to(
      [trail, echo],
      {
        drawSVG: "100% 100%",
        duration: 0.85,
        stagger: 0.07,
        ease: "power3.inOut",
      },
      `logo:assemble+=${i * 0.04}`,
    );
    const fragment = fragments[i];
    tl.fromTo(
      fragment,
      { x: x * 0.7, y: y * 0.7, scale: 0.25, rotation: i * 25 - 60 },
      {
        x,
        y,
        scale: i % 2 ? 0.8 : 1.1,
        rotation: i * 25 - 30,
        autoAlpha: 1,
        duration: 0.65,
      },
      `levels:expand-=${0.35 - i * 0.04}`,
    )
      .to(
        fragment,
        {
          motionPath: { path: trajectoryPath(i, width(), height()) },
          rotation: i * 25 + 40,
          scale: i % 2 ? 1.4 : 2.2,
          duration: 1.15,
          ease: "power2.inOut",
        },
        `levels:expand+=${i * 0.045}`,
      )
      .to(
        fragment,
        {
          motionPath: {
            path: [
              { x: r.end[0] * width(), y: r.end[1] * height() },
              { x: r.end[0] * width() * 0.45, y: r.end[1] * height() * 0.8 },
              { x: (i - 2.5) * 12, y: i % 2 ? 24 : -24 },
            ],
            curviness: 1.25,
          },
          rotation: 0,
          scale: 0.4,
          autoAlpha: 0,
          duration: 0.95,
          ease: "power3.inOut",
        },
        `logo:assemble+=${i * 0.045}`,
      );
    const accent = q(`[data-intro-accent="${i}"]`);
    tl.fromTo(
      accent,
      { x: x * 1.05, y: y + 40, scale: 0.4 },
      {
        x: r.end[0] * width() * 0.85,
        y: r.end[1] * height() * 0.85,
        scale: 1,
        opacity: 0.5,
        rotation: (i - 2.5) * 15,
        duration: 1.15,
      },
      `levels:expand+=${i * 0.04}`,
    ).to(
      accent,
      { x: 0, y: 0, scale: 0, opacity: 0, duration: 0.8, ease: "power3.in" },
      `logo:assemble+=${i * 0.03}`,
    );
  });
  tl.to(
    q("[data-brand-outline]"),
    { drawSVG: "100%", duration: 1.1, ease: "power2.inOut" },
    "logo:assemble+=.05",
  );
  const rigParts = [
    { name: "left", x: -115, y: 75, rotation: -15, delay: 0.12 },
    { name: "crown", x: -18, y: -130, rotation: 8, delay: 0.22 },
    { name: "right", x: 130, y: 65, rotation: 15, delay: 0.28 },
    { name: "rear", x: -100, y: 85, rotation: -20, delay: 0.44 },
    { name: "front", x: 120, y: -45, rotation: 16, delay: 0.56 },
    { name: "plus", x: 80, y: -90, rotation: -40, delay: 0.72 },
  ];
  rigParts.forEach(({ name, x, y, rotation, delay }) =>
    tl.fromTo(
      q(`[data-brand-part="${name}"]`),
      { x, y, rotation, scale: name === "plus" ? 0.5 : 1, opacity: 0 },
      {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        opacity: 1,
        duration: 0.7,
        ease: name === "plus" ? "back.out(1.2)" : ease,
      },
      `logo:assemble+=${delay}`,
    ),
  );
  tl.to(
    q("[data-brand-outline]"),
    { opacity: 0, duration: 0.25 },
    "hero:reveal-=.2",
  )
    .call(
      () => {
        q("[data-brand-resolved]").style.visibility = "visible";
        all("[data-brand-part]").forEach((part) => {
          part.style.visibility = "hidden";
        });
      },
      [],
      "hero:reveal-=.05",
    )
    .fromTo(
      q("[data-brand-caption]"),
      { y: 12, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5 },
      "logo:assemble+=.7",
    )
    .to(
      q("[data-brand-caption]"),
      { y: -10, opacity: 0, duration: 0.3 },
      "hero:reveal",
    )
    .call(reveal, [], "hero:reveal")
    .to(
      q("[data-intro-curtain]"),
      { clipPath: "inset(100% 0 0 0)", duration: 1.15, ease: "power3.inOut" },
      "hero:reveal+=.08",
    )
    .to(
      mark,
      {
        x: () => {
          const a = mark.getBoundingClientRect();
          return target.getBoundingClientRect().left - a.left;
        },
        y: () => {
          const a = mark.getBoundingClientRect();
          return target.getBoundingClientRect().top - a.top;
        },
        scale: () =>
          target.getBoundingClientRect().width /
          mark.getBoundingClientRect().width,
        duration: 0.95,
        ease: "power3.inOut",
      },
      "hero:reveal",
    )
    .fromTo(
      wordmark,
      { opacity: 1, clipPath: "inset(0 100% 0 26%)" },
      {
        opacity: 1,
        clipPath: "inset(0 0 0 26%)",
        duration: 0.55,
        ease: "power3.out",
      },
      "hero:reveal+=.55",
    )
    .to(
      nav,
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.06 },
      "hero:reveal+=.65",
    )
    .to(
      q("[data-intro-skip]"),
      { opacity: 0, duration: 0.2 },
      "hero:reveal+=.15",
    )
    .call(
      () => {
        const a = mark.getBoundingClientRect();
        const b = target.getBoundingClientRect();
        root.dataset.handoffError = String(
          Math.round(
            Math.max(
              Math.abs(a.left - b.left),
              Math.abs(a.top - b.top),
              Math.abs(a.width - b.width),
            ) * 100,
          ) / 100,
        );
        target.style.opacity = "1";
        mark.style.visibility = "hidden";
      },
      [],
      "hero:reveal+=.97",
    )
    .to(
      q("[data-intro-footer]"),
      { opacity: 0, duration: 0.3 },
      "levels:enter",
    );
  return {
    tl,
    restoreHeader,
    dispose: () => {
      tl.kill();
      split.revert();
      restoreHeader();
    },
  };
}
