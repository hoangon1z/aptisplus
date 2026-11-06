"use client";
import Link from "next/link";
import Image from "next/image";
import { useCallback, useState } from "react";
import { Icon } from "./icon";
import { Button } from "./ui/button";
import { AptisPlusMotionHero } from "./motion/aptisplus-motion-hero";
import { FourSkillsStory } from "./motion/four-skills-story";
import { FinalCinematicCTA } from "./landing/final-cinematic-cta";
import { AptisPlusSymbol } from "./motion/aptisplus-symbol";
import { AimOpening } from "./motion/aim-opening";
import { LearningJourney } from "./landing/learning-journey";
import { ExamExperience } from "./landing/exam-experience";
import { ProgressInsights } from "./landing/progress-insights";
import { StudyPath } from "./landing/study-path";
import { StudentStories } from "./landing/student-stories";
import { WhyAptisPlus } from "./landing/why-aptisplus";
import { Pricing } from "./landing/pricing";
import { LandingFaq } from "./landing/faq";
import { LearningBento } from "./landing/learning-bento";
export function Landing() {
  const [openingVersion, setOpeningVersion] = useState(0);
  const [openingReady, setOpeningReady] = useState(false);
  const replayOpening = () => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setOpeningReady(false);
    setOpeningVersion((v) => v + 1);
  };
  const reveal = useCallback(() => setOpeningReady(true), []);
  const [menu, setMenu] = useState(false);
  return (
    <>
      <AimOpening
        key={openingVersion}
        onReveal={reveal}
        replay={openingVersion > 0}
      />
      <div className="premium-landing cinematic-landing" data-landing-content>
        <header className="premium-header">
          <Link
            href="/"
            className="cinematic-brand header-brand"
            aria-label="AptisPlus — Trang chủ"
          >
            <span className="header-symbol" data-header-symbol>
              <AptisPlusSymbol />
            </span>
            <Image
              data-header-wordmark
              src="/brand/aptisplus-logo.svg"
              alt="AptisPlus"
              width={689}
              height={175}
              priority
            />
          </Link>
          <nav data-header-nav className={menu ? "is-open" : ""}>
            <a href="#skills">Bốn kỹ năng</a>
            <a href="#exam-experience">Phòng thi mô phỏng</a>
            <a href="#pricing">Gói học</a>
            <a href="#faq">Giải đáp</a>
          </nav>
          <div className="premium-header-actions" data-header-actions>
            <Link href="/login">Đăng nhập</Link>
            <Button asChild size="sm" className="navy-button">
              <Link href="/dashboard">
                Vào luyện thi <Icon name="arrow_forward" />
              </Link>
            </Button>
            <button
              className="mobile-menu"
              aria-label="Mở menu"
              onClick={() => setMenu(!menu)}
            >
              <Icon name={menu ? "close" : "menu"} />
            </button>
          </div>
        </header>
        <main>
          <AptisPlusMotionHero ready={openingReady} />
          <LearningJourney />
          <FourSkillsStory />
          <ExamExperience />
          <ProgressInsights />
          <StudyPath />
          <StudentStories />
          <WhyAptisPlus />
          <LearningBento />
          <Pricing />
          <LandingFaq />
          <FinalCinematicCTA />
        </main>
        <footer className="premium-footer">
          <Link
            href="/"
            className="cinematic-brand"
            aria-label="AptisPlus — Trang chủ"
          >
            <Image
              src="/brand/aptisplus-logo.svg"
              alt="AptisPlus"
              width={689}
              height={175}
            />
          </Link>
          <p>
            Nền tảng luyện tập độc lập. Không đại diện cho đơn vị tổ chức thi
            Aptis.
          </p>
          <button
            type="button"
            className="intro-replay"
            onClick={replayOpening}
          >
            <Icon name="replay" /> Xem lại mở đầu
          </button>
          <Link href="/dashboard">
            Không gian học tập <Icon name="north_east" />
          </Link>
        </footer>
      </div>
    </>
  );
}
