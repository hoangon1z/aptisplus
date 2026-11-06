"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import "@fontsource/material-symbols-rounded/400.css";
import { listeningOptions, listeningPrompts, audioScripts } from "@/lib/exams";
import styles from "./landing-journey.module.css";
import room from "./exam-preview.module.css";
function Symbol({ name }: { name: string }) {
  return (
    <span className="material-symbols-rounded" aria-hidden="true">
      {name}
    </span>
  );
}
export function ExamExperience() {
  const [question, setQuestion] = useState(0),
    [playing, setPlaying] = useState(false),
    [audioError, setAudioError] = useState("");
  const [answers, setAnswers] = useState<Record<number, number>>({}),
    [bookmarks, setBookmarks] = useState<Record<number, boolean>>({}),
    [plays, setPlays] = useState<Record<number, number>>({});
  const [listOpen, setListOpen] = useState(false),
    [markedOnly, setMarkedOnly] = useState(false),
    [accessOpen, setAccessOpen] = useState(false),
    [infoOpen, setInfoOpen] = useState(false),
    [dark, setDark] = useState(false),
    [scale, setScale] = useState(1),
    [remaining, setRemaining] = useState(2400);
  useEffect(() => {
    const deadline = Date.now() + 2400000;
    const timer = setInterval(
      () =>
        setRemaining(Math.max(0, Math.ceil((deadline - Date.now()) / 1000))),
      1000,
    );
    return () => {
      clearInterval(timer);
      window.speechSynthesis?.cancel();
    };
  }, []);
  useEffect(() => {
    if (remaining === 0) window.speechSynthesis?.cancel();
  }, [remaining]);
  function change(n: number) {
    window.speechSynthesis?.cancel();
    setPlaying(false);
    setAudioError("");
    setQuestion(n);
  }
  function play() {
    if (playing) {
      window.speechSynthesis?.cancel();
      setPlaying(false);
      return;
    }
    if ((plays[question] || 0) >= 2 || remaining === 0) return;
    if (!window.speechSynthesis) {
      setAudioError("Trình duyệt này chưa hỗ trợ đọc âm thanh mẫu.");
      return;
    }
    const u = new SpeechSynthesisUtterance(audioScripts[question]);
    u.lang = "en-GB";
    u.onend = () => setPlaying(false);
    u.onerror = () => {
      setPlaying(false);
      setAudioError("Chưa phát được âm thanh mẫu.");
    };
    setPlays((p) => ({ ...p, [question]: (p[question] || 0) + 1 }));
    setPlaying(true);
    window.speechSynthesis.speak(u);
  }
  const markedCount = Object.values(bookmarks).filter(Boolean).length;
  const clock = `00:${String(Math.floor(remaining / 60)).padStart(2, "0")}:${String(remaining % 60).padStart(2, "0")}`;
  return (
    <section
      id="exam-experience"
      data-landing-section="exam"
      className={`${styles.section} ${styles.exam}`}
    >
      <div className={styles.journeyIntro}>
        <h2>
          Đừng để giao diện thi
          <br />
          <em>là điều xa lạ.</em>
        </h2>
        <p>
          Thử điều hướng, đánh dấu câu hỏi và chọn đáp án trên giao diện phòng
          thi đã thống nhất.
        </p>
      </div>
      <div
        className={`${room.frame} ${dark ? room.dark : ""}`}
        data-exam-preview
      >
        <div className={room.timer} aria-label="Thời gian còn lại">
          <strong>{clock}</strong>
          <span>Time remaining</span>
          <div>
            <i style={{ width: `${(remaining / 2400) * 100}%` }} />
          </div>
        </div>
        <div className={room.content} style={{ fontSize: `${scale}em` }}>
          <header className={room.heading}>
            <div>
              <span>Listening</span>
              <h3>Question {question + 1} of 17</h3>
            </div>
            <button
              type="button"
              className={room.bookmark}
              aria-label="Đánh dấu câu mẫu"
              aria-pressed={!!bookmarks[question]}
              onClick={() =>
                setBookmarks((b) => ({ ...b, [question]: !b[question] }))
              }
            >
              <Symbol
                name={bookmarks[question] ? "bookmark_added" : "bookmark"}
              />{" "}
              Bookmark
            </button>
          </header>
          <div className={room.prompt}>
            <p>{listeningPrompts[question]}</p>
            <button
              type="button"
              className={room.play}
              aria-label={playing ? "Dừng âm thanh" : "Nghe câu mẫu"}
              aria-pressed={playing}
              onClick={play}
              disabled={
                (!playing && (plays[question] || 0) >= 2) || remaining === 0
              }
            >
              <Symbol name={playing ? "stop_circle" : "play_circle"} />
              <span>Play/Stop</span>
            </button>
            {audioError && <p role="status">{audioError}</p>}
            <fieldset className={room.answers} disabled={remaining === 0}>
              <legend className="sr-only">Chọn đáp án câu mẫu</legend>
              {listeningOptions[question].map((option, i) => (
                <label
                  key={option}
                  className={answers[question] === i ? room.selected : ""}
                >
                  <input
                    type="radio"
                    name={`sample-${question}`}
                    checked={answers[question] === i}
                    onChange={() =>
                      setAnswers((a) => ({ ...a, [question]: i }))
                    }
                  />
                  <strong>{"ABC"[i]}</strong>
                  <span>{option}</span>
                </label>
              ))}
            </fieldset>
            {remaining === 0 && (
              <p role="status">
                Hết thời gian bản thử.{" "}
                <Link href="/exam/listening">Mở bài luyện đầy đủ</Link>
              </p>
            )}
          </div>
        </div>
        {listOpen && (
          <aside className={room.drawer} aria-label="Question List">
            <header>
              <strong>Question List</strong>
              <button
                type="button"
                aria-label="Đóng danh sách câu"
                onClick={() => setListOpen(false)}
              >
                <Symbol name="close" />
              </button>
            </header>
            <div className={room.tabs}>
              <button
                type="button"
                aria-pressed={!markedOnly}
                onClick={() => setMarkedOnly(false)}
              >
                All
              </button>
              <button
                type="button"
                aria-pressed={markedOnly}
                onClick={() => setMarkedOnly(true)}
              >
                Bookmarked ({markedCount})
              </button>
            </div>
            <Link className={room.instructions} href="/exam/listening">
              Aptis General
              <br />
              Listening
              <br />
              Instructions
            </Link>
            <h4>Listening</h4>
            <p>17 Questions</p>
            {Array.from({ length: 17 }, (_, i) => {
              if (markedOnly && !bookmarks[i]) return null;
              const content = (
                <>
                  <strong>{String(i + 1).padStart(2, "0")}</strong>
                  <span>
                    <span>{i < 2 ? "Seen" : "Not Seen"}</span>
                    <span>
                      {answers[i] !== undefined ? "Attempted" : "Not Attempted"}
                    </span>
                  </span>
                </>
              );
              return i < 2 ? (
                <button
                  key={i}
                  type="button"
                  className={`${room.questionItem} ${question === i ? room.current : ""}`}
                  aria-label={`Mở câu mẫu ${i + 1}`}
                  aria-current={question === i ? "step" : undefined}
                  onClick={() => change(i)}
                >
                  {content}
                </button>
              ) : (
                <Link
                  key={i}
                  className={room.questionItem}
                  href="/exam/listening"
                  aria-label={`Mở bài đầy đủ để làm câu ${i + 1}`}
                >
                  {content}
                </Link>
              );
            })}
          </aside>
        )}
        {infoOpen && (
          <div className={room.access} role="status">
            Bản thử gồm hai câu tương tác. Mở bài luyện đầy đủ để làm 17 câu.
            Play/Stop dùng giọng đọc trình duyệt, tối đa hai lượt phát mỗi câu.
          </div>
        )}
        {accessOpen && (
          <div className={room.access} aria-label="Accessibility">
            <strong>Accessibility</strong>
            <button
              type="button"
              aria-pressed={dark}
              onClick={() => setDark(!dark)}
            >
              Dark mode <Symbol name={dark ? "toggle_on" : "toggle_off"} />
            </button>
            <div>
              <span>Magnification</span>
              <button
                type="button"
                aria-label="Thu nhỏ bản thử"
                disabled={scale <= 0.9}
                onClick={() => setScale((s) => Math.max(0.9, s - 0.1))}
              >
                <Symbol name="remove" />
              </button>
              <button
                type="button"
                aria-label="Phóng to bản thử"
                disabled={scale >= 1.3}
                onClick={() => setScale((s) => Math.min(1.3, s + 0.1))}
              >
                <Symbol name="add" />
              </button>
            </div>
          </div>
        )}
        <nav className={room.toolbar} aria-label="Điều hướng bản thử">
          <div>
            <button
              type="button"
              aria-label="Danh sách câu hỏi"
              aria-expanded={listOpen}
              onClick={() => {
                setListOpen(!listOpen);
                setAccessOpen(false);
                setInfoOpen(false);
              }}
            >
              <Symbol name="format_list_bulleted" />
            </button>
            <button
              type="button"
              aria-label="Thông tin bản thử"
              aria-expanded={infoOpen}
              onClick={() => {
                setInfoOpen(!infoOpen);
                setAccessOpen(false);
                setListOpen(false);
              }}
            >
              <Symbol name="info" />
            </button>
            <button
              type="button"
              aria-label="Accessibility"
              aria-expanded={accessOpen}
              onClick={() => {
                setAccessOpen(!accessOpen);
                setListOpen(false);
                setInfoOpen(false);
              }}
            >
              <Symbol name="accessibility_new" />
            </button>
          </div>
          <div>
            <Link href="/exam/listening" aria-label="Vào bài luyện đầy đủ">
              <Symbol name="exit_to_app" />
            </Link>
            <button
              type="button"
              aria-label="Câu trước"
              disabled={question === 0}
              onClick={() => change(0)}
            >
              <Symbol name="west" />
              <span>Previous</span>
            </button>
            <button
              type="button"
              aria-label="Câu tiếp"
              className={room.next}
              disabled={question === 1}
              onClick={() => change(1)}
            >
              <span>Next</span>
              <Symbol name="east" />
            </button>
          </div>
        </nav>
      </div>
      <p className={styles.fine}>
        Bản thử trên landing gồm hai câu tương tác. Mở bài luyện đầy đủ để làm
        17 câu. Âm thanh mẫu dùng giọng đọc trình duyệt; mỗi câu tối đa hai lượt
        phát. Đã chọn đáp án: {Object.keys(answers).length}/2.
      </p>
      <p className={styles.formatNote}>
        AptisPlus là nền tảng luyện tập độc lập. Phiên bản hiện tại tập trung
        Listening, Reading, Speaking và Writing.
      </p>
    </section>
  );
}
