"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Brand } from "@/components/brand";
import { Icon } from "./exam-icon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  getSkill,
  saveAttempt,
  type SkillId,
  type AnswerMap,
} from "@/lib/exams";
import {
  ListeningQuestions,
  ReadingQuestions,
  WritingQuestions,
} from "./questions";
import { MicCheck, SpeakingFlow } from "./speaking";
import "./reference-exam.css";
type Stage = "mic" | "intro" | "instructions" | "exam" | "submitted";
type Draft = {
  answers: AnswerMap;
  bookmarks: string[];
  seen: number[];
  question: number;
  deadline: number;
  started: number;
  attemptId: string;
};
function idsFor(skill: SkillId, q: number) {
  if (skill === "listening")
    return q <= 13
      ? [String(q)]
      : Array.from(
          { length: q === 14 || q === 15 ? 4 : 2 },
          (_, i) => q + "." + i,
        );
  if (skill === "reading")
    return q === 1
      ? Array.from({ length: 5 }, (_, i) => "1." + i)
      : q === 2 || q === 3
        ? [String(q)]
        : Array.from({ length: 7 }, (_, i) => q + "." + i);
  if (skill === "writing")
    return q === 2
      ? ["2"]
      : Array.from(
          { length: q === 1 ? 5 : q === 3 ? 3 : 2 },
          (_, i) => q + "." + i,
        );
  return [String(q)];
}
function hasAnswer(value: string | undefined) {
  if (!value) return false;
  if (value.startsWith("[")) {
    try {
      return JSON.parse(value).some((v: unknown) => v !== null);
    } catch {
      return false;
    }
  }
  return (
    value
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .trim().length > 0
  );
}
export function ExamRunner({ skillId }: { skillId: SkillId }) {
  const skill = getSkill(skillId)!;
  const [stage, setStage] = useState<Stage>(
    skillId === "speaking" ? "mic" : "intro",
  );
  const [q, setQ] = useState(1);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [seen, setSeen] = useState<number[]>([]);
  const [list, setList] = useState(false);
  const [listFilter, setListFilter] = useState("all");
  const [collapsed, setCollapsed] = useState(false);
  const [access, setAccess] = useState(false);
  const [dark, setDark] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [remaining, setRemaining] = useState(skill.time * 60);
  const [modal, setModal] = useState<"review" | "submit" | "exit" | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [savedId, setSavedId] = useState("");
  const [storageError, setStorageError] = useState("");
  const deadline = useRef(0);
  const started = useRef(0);
  const attemptId = useRef("");
  const submitting = useRef(false);
  const total = skill.questions;
  const title = skill.name + " Practice Test Version 001";
  const key = "aptis-draft-" + skillId;
  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved && skillId !== "speaking") setDraft(JSON.parse(saved));
    } catch {}
    setHydrated(true);
  }, [key, skillId]);
  const submit = useCallback(() => {
    if (submitting.current) return;
    submitting.current = true;
    const id = attemptId.current || crypto.randomUUID();
    try {
      saveAttempt({
        id,
        skill: skillId,
        title,
        date: new Date().toISOString(),
        answers,
        recordings:
          skillId === "speaking" ? Object.keys(answers).length : undefined,
        duration: Math.max(
          0,
          Math.round((Date.now() - (started.current || Date.now())) / 1000),
        ),
      });
      localStorage.removeItem(key);
      setSavedId(id);
    } catch {
      setStorageError(
        "Bộ nhớ trình duyệt đầy hoặc bị chặn. Bài làm chưa được lưu vào lịch sử; hãy tải bản sao.",
      );
    }
    setModal(null);
    setStage("submitted");
    speechSynthesis.cancel();
  }, [answers, key, skillId, title]);
  const submitRef = useRef(submit);
  submitRef.current = submit;
  useEffect(() => {
    if (stage !== "exam" && !(stage === "instructions" && deadline.current))
      return;
    if (skillId === "speaking") return;
    const tick = () => {
      const r = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000));
      setRemaining(r);
      if (r === 0) submitRef.current();
    };
    tick();
    const timer = setInterval(tick, 250);
    return () => clearInterval(timer);
  }, [stage, skillId]);
  useEffect(() => {
    if (stage !== "exam" || skillId === "speaking") return;
    try {
      localStorage.setItem(
        key,
        JSON.stringify({
          answers,
          bookmarks,
          seen,
          question: q,
          deadline: deadline.current,
          started: started.current,
          attemptId: attemptId.current,
        }),
      );
    } catch {
      setStorageError("Không thể lưu tự động trên trình duyệt này.");
    }
  }, [answers, bookmarks, seen, q, stage, key, skillId]);
  useEffect(() => {
    if (stage !== "exam") return;
    const before = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", before);
    return () => window.removeEventListener("beforeunload", before);
  }, [stage]);
  function start() {
    if (!deadline.current) {
      deadline.current = Date.now() + skill.time * 60000;
      started.current = Date.now();
      attemptId.current = crypto.randomUUID();
    }
    setSeen((s) => (s.includes(q) ? s : [...s, q]));
    setStage("exam");
  }
  function navigate(n: number) {
    if (!deadline.current) {
      // This function runs only in navigation event handlers.
      // eslint-disable-next-line react-hooks/purity
      deadline.current = Date.now() + skill.time * 60000;
      // eslint-disable-next-line react-hooks/purity
      started.current = Date.now();
      attemptId.current = crypto.randomUUID();
    }
    setQ(n);
    setSeen((s) => (s.includes(n) ? s : [...s, n]));
    setStage("exam");
    window.scrollTo(0, 0);
  }
  function answer(id: string, v: string) {
    setAnswers((a) => ({ ...a, [id]: v }));
  }
  function toggleBookmark(id: string) {
    setBookmarks((b) =>
      b.includes(id) ? b.filter((x) => x !== id) : [...b, id],
    );
  }
  const bookmark = (id: string) => (
    <button
      type="button"
      aria-label={"Bookmark " + id}
      aria-pressed={bookmarks.includes(id)}
      className={"exam-bookmark " + (bookmarks.includes(id) ? "marked" : "")}
      onClick={() => toggleBookmark(id)}
    >
      <Icon name={bookmarks.includes(id) ? "bookmark_added" : "bookmark"} />
      {!id.includes(".") && <span>Bookmark</span>}
    </button>
  );
  function resume() {
    if (!draft) return;
    setAnswers(draft.answers);
    setBookmarks(draft.bookmarks);
    setSeen(draft.seen);
    setQ(draft.question);
    deadline.current = draft.deadline;
    started.current = draft.started;
    attemptId.current = draft.attemptId;
    setDraft(null);
    setStage("exam");
  }
  const countDone = (n: number) =>
    idsFor(skillId, n).filter((id) => hasAnswer(answers[id])).length;
  const status = (n: number) => {
    const done = countDone(n);
    return done === 0
      ? "Not Attempted"
      : done === idsFor(skillId, n).length
        ? "Attempted"
        : "Partially Attempted";
  };
  const displayTime =
    "00:" +
    String(Math.floor(remaining / 60)).padStart(2, "0") +
    ":" +
    String(remaining % 60).padStart(2, "0");
  if (stage === "mic")
    return (
      <div className="exam-root reference-exam">
        <header className="exam-intro-header">
          <Brand compact />
          <Link href="/practice">Back to practice</Link>
        </header>
        <MicCheck onContinue={() => setStage("intro")} />
      </div>
    );
  if (stage === "intro")
    return (
      <div className="exam-root reference-exam">
        <header className="exam-intro-header">
          <Brand compact />
          <Link href="/practice" aria-label="Tài khoản">
            <Icon name="account_circle" />
          </Link>
        </header>
        <main className="exam-intro">
          <p>Aptis General Practice Test</p>
          <h1>{title}</h1>
          <div className="exam-intro-meta">
            <div>
              <strong>Number of Questions</strong>
              <span>{total}</span>
            </div>
            {skillId !== "speaking" && (
              <div>
                <strong>Time Allowed</strong>
                <span>{skill.time} min</span>
              </div>
            )}
          </div>
          <strong>Assessment Description</strong>
          <div className="exam-intro-start">
            <Button
              disabled={!hydrated}
              onClick={() => setStage("instructions")}
            >
              Start Assessment
            </Button>
          </div>
          <small className="exam-demo-note">
            Frontend practice demo · Sample content
            {skillId === "listening" ? " · Browser voice audio preview" : ""}
          </small>
          {draft && (
            <div className="resume-draft">
              <p>
                A practice session is saved on this device. Its original timer
                continues.
              </p>
              <Button onClick={resume}>Resume test</Button>
              <Button
                variant="outline"
                onClick={() => {
                  localStorage.removeItem(key);
                  setDraft(null);
                }}
              >
                Discard saved session
              </Button>
            </div>
          )}
        </main>
      </div>
    );
  return (
    <div
      className={"exam-root reference-exam " + (dark ? "exam-dark" : "")}
      style={{ "--exam-zoom": zoom } as React.CSSProperties}
    >
      {stage === "submitted" ? (
        <main className="exam-submitted">
          <Icon name="thumb_up" />
          <p>Exam Submitted</p>
          <p>Thank you for submitting &apos;{title}&apos;</p>
          {storageError && (
            <Alert status="danger">
              <AlertDescription>{storageError}</AlertDescription>
            </Alert>
          )}
          <div className="submitted-actions">
            <Button onClick={() => location.reload()}>
              Retake test <Icon name="arrow_forward" />
            </Button>
            {savedId && (
              <Button asChild variant="outline">
                <Link href={"/results/" + savedId}>
                  Xem lại bài làm <Icon name="arrow_forward" />
                </Link>
              </Button>
            )}
            <Button asChild variant="ghost">
              <Link href="/practice">Về phòng luyện</Link>
            </Button>
            {storageError && (
              <Button
                onClick={() => {
                  const url = URL.createObjectURL(
                    new Blob([JSON.stringify({ skillId, answers, title })], {
                      type: "application/json",
                    }),
                  );
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "aptis-answers.json";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                Tải bản sao bài làm
              </Button>
            )}
          </div>
          <small>AI grading chưa kết nối trong bản frontend.</small>
        </main>
      ) : (
        <>
          {skillId !== "speaking" && stage === "exam" && (
            <div className="exam-timer" aria-label="Time remaining">
              <strong>{displayTime}</strong>
              <span>Time remaining</span>
              <div>
                <i
                  style={{
                    transform: "scaleX(" + remaining / (skill.time * 60) + ")",
                  }}
                />
              </div>
            </div>
          )}
          {stage === "instructions" ? (
            <main
              className="exam-instructions"
              style={{ fontSize: zoom + "em" }}
            >
              <h1>
                Aptis General {skill.name}
                {skillId === "speaking" ? " Test" : ""} Instructions
              </h1>
              <strong>{skill.name}</strong>
              {skillId === "listening" ? (
                <>
                  <p>You will listen to seventeen recordings.</p>
                  <p>Click on the PLAY button to listen to each recording.</p>
                  <p>You can listen to each recording TWO TIMES ONLY.</p>
                  <p>You have 40 minutes to complete the test.</p>
                </>
              ) : skillId === "reading" ? (
                <>
                  <p>The test has five parts.</p>
                  <p>You have 35 minutes to complete the test.</p>
                </>
              ) : skillId === "writing" ? (
                <>
                  <p>The test has four parts and takes up to 50 minutes.</p>
                  <p>Recommended times:</p>
                  <p>Part One: 3 minutes</p>
                  <p>Part Two: 7 minutes</p>
                  <p>Part Three: 10 minutes</p>
                  <p>Part Four: 30 minutes</p>
                </>
              ) : (
                <>
                  <p>
                    You will answer some questions about yourself and then do
                    three short speaking tasks.
                  </p>
                  <p>
                    Listen to the instructions and speak clearly into your
                    microphone when you hear the signal.
                  </p>
                  <p>Each part of the test will appear automatically.</p>
                  <p>The test will take about 12 minutes.</p>
                </>
              )}
              <p className="instruction-next">
                When you click on the &apos;Next&apos; button, the test will
                begin.
              </p>
            </main>
          ) : skillId === "speaking" ? (
            <SpeakingFlow
              attemptId={attemptId.current}
              onSaved={(id) => setAnswers((a) => ({ ...a, [id]: "recorded" }))}
              onComplete={() => setModal("submit")}
            />
          ) : (
            <main className="exam-question" style={{ fontSize: zoom + "em" }}>
              <header>
                <div>
                  <span>{skill.name}</span>
                  <h1>
                    Question {q} of {total}
                  </h1>
                </div>
                {!(skillId === "writing" && q !== 2) &&
                  !(skillId === "listening" && q >= 16) &&
                  bookmark(String(q))}
              </header>
              <div className="exam-question-body">
                {skillId === "listening" ? (
                  <ListeningQuestions
                    playbackKey={"aptis-plays-" + attemptId.current}
                    question={q}
                    answers={answers}
                    onAnswer={answer}
                    bookmark={bookmark}
                  />
                ) : skillId === "reading" ? (
                  <ReadingQuestions
                    question={q}
                    answers={answers}
                    onAnswer={answer}
                    bookmark={bookmark}
                  />
                ) : (
                  <WritingQuestions
                    question={q}
                    answers={answers}
                    onAnswer={answer}
                    bookmark={bookmark}
                  />
                )}
              </div>
            </main>
          )}
          {storageError && (
            <Alert status="warning" className="exam-storage-warning"><AlertDescription>{storageError}</AlertDescription></Alert>
          )}
          {list && (
            <aside className="question-list">
              <div className="question-list-title">
                <span>Question List</span>
                <Button
                  size="icon"
                  variant="outline"
                  aria-label="Close question list"
                  onClick={() => setList(false)}
                >
                  <Icon name="close" />
                </Button>
              </div>
              <div className="question-list-tabs">
                <button
                  className={listFilter === "all" ? "active" : ""}
                  onClick={() => setListFilter("all")}
                >
                  All
                </button>
                <button
                  className={listFilter === "bookmarked" ? "active" : ""}
                  onClick={() => setListFilter("bookmarked")}
                >
                  Bookmarked ({bookmarks.length})
                </button>
              </div>
              <button
                className="instruction-card"
                onClick={() => {
                  setStage("instructions");
                  setList(false);
                }}
              >
                Aptis General
                <br />
                {skill.name}
                <br />
                Instructions
              </button>
              <div className="question-list-group">
                <button
                  className="question-group-title"
                  onClick={() => setCollapsed(!collapsed)}
                >
                  <span>
                    <strong>{skill.name}</strong>
                    <small>{total} Questions</small>
                  </span>
                  <Icon name={collapsed ? "add" : "remove"} />
                </button>
                {!collapsed &&
                  Array.from({ length: total }, (_, i) => i + 1)
                    .filter(
                      (n) =>
                        listFilter === "all" ||
                        bookmarks.some(
                          (b) => b === String(n) || b.startsWith(n + "."),
                        ),
                    )
                    .map((n) => (
                      <button
                        className={
                          "question-list-item " +
                          (q === n && stage === "exam" ? "active" : "")
                        }
                        key={n}
                        onClick={() => {
                          navigate(n);
                        }}
                      >
                        <strong>{String(n).padStart(2, "0")}</strong>
                        <span>
                          <span>{seen.includes(n) ? "Seen" : "Not Seen"}</span>
                          <span>{status(n)}</span>
                        </span>
                      </button>
                    ))}
                {listFilter === "bookmarked" && bookmarks.length === 0 && (
                  <p className="list-empty">No bookmarked questions.</p>
                )}
              </div>
            </aside>
          )}
          {access && (
            <aside className="accessibility-panel">
              <div>
                <strong>Accessibility</strong>
                <button
                  aria-label="Close accessibility"
                  onClick={() => setAccess(false)}
                >
                  <Icon name="close" />
                </button>
              </div>
              <label>
                Dark mode{" "}
                <input
                  type="checkbox"
                  checked={dark}
                  onChange={(e) => setDark(e.target.checked)}
                />
              </label>
              <div>
                <span>Magnification</span>
                <button
                  aria-label="Decrease magnification"
                  disabled={zoom <= 0.8}
                  onClick={() => setZoom((z) => Math.max(0.8, z - 0.1))}
                >
                  <Icon name="remove" />
                </button>
                <span>{Math.round(zoom * 100)}%</span>
                <button
                  aria-label="Increase magnification"
                  disabled={zoom >= 1.5}
                  onClick={() => setZoom((z) => Math.min(1.5, z + 0.1))}
                >
                  <Icon name="add" />
                </button>
              </div>
            </aside>
          )}
          {(skillId !== "speaking" || stage === "instructions") && (
            <footer className="exam-toolbar">
              <div>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Question list"
                  onClick={() => {
                    setList(!list);
                    setAccess(false);
                  }}
                >
                  <Icon name="format_list_bulleted" />
                </Button>
                <Button variant="outline" size="icon" aria-label="Information">
                  <Icon name="info" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Accessibility"
                  onClick={() => {
                    setAccess(!access);
                    setList(false);
                  }}
                >
                  <Icon name="accessibility_new" />
                </Button>
              </div>
              <div>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Exit test"
                  onClick={() => setModal("exit")}
                >
                  <Icon name="exit_to_app" />
                </Button>
                {stage === "exam" && (
                  <Button
                    variant="outline"
                    onClick={() =>
                      q === 1 ? setStage("instructions") : navigate(q - 1)
                    }
                  >
                    <Icon name="arrow_back" />
                    Previous
                  </Button>
                )}
                <Button
                  onClick={() =>
                    stage === "instructions"
                      ? start()
                      : q === total
                        ? setModal("review")
                        : navigate(q + 1)
                  }
                >
                  Next <Icon name="arrow_forward" />
                </Button>
              </div>
            </footer>
          )}
        </>
      )}
      <Dialog
        open={modal !== null}
        onOpenChange={(open) => {
          if (!open && skillId !== "speaking") setModal(null);
        }}
      >
        <DialogContent
          className={
            "exam-dialog reference-exam-dialog " +
            (modal === "review" ? "review-dialog" : "")
          }
          hideClose
        >
          <DialogTitle>
            {modal === "review"
              ? "Question Review"
              : modal === "exit"
                ? "Leave practice test?"
                : "Submit Test?"}
          </DialogTitle>
          <DialogDescription>
            {modal === "review"
              ? "Please review the following questions"
              : modal === "exit"
                ? "Your saved written answers will remain on this device. The test timer continues."
                : "Once you submit your test you will no longer have access to the questions."}
          </DialogDescription>
          {modal === "review" ? (
            <>
              <div className="review-scroll">
                <details open>
                  <summary>
                    {skill.name}
                    <small>{total} Questions</small>
                  </summary>
                  {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
                    <details className="review-group" open key={n}>
                      <summary>
                        {String(n).padStart(2, "0")}
                        <small>{idsFor(skillId, n).length} Parts</small>
                      </summary>
                      {idsFor(skillId, n).map((id, i) => (
                        <div className="review-part" key={id}>
                          <strong>
                            {idsFor(skillId, n).length > 1
                              ? "Part " + (i + 1)
                              : String(n).padStart(2, "0")}
                          </strong>
                          <span>
                            <span>
                              {seen.includes(n) ? "Seen" : "Not Seen"}
                            </span>
                            <span>
                              {hasAnswer(answers[id])
                                ? "Attempted"
                                : "Not Attempted"}
                            </span>
                          </span>
                        </div>
                      ))}
                    </details>
                  ))}
                </details>
              </div>
              <Button
                onClick={() => {
                  setModal(null);
                  navigate(1);
                }}
              >
                Review Questions
              </Button>
              <Button variant="outline" onClick={() => setModal("submit")}>
                Submit
              </Button>
            </>
          ) : (
            <div className="dialog-actions">
              {skillId !== "speaking" && (
                <Button
                  variant="outline"
                  onClick={() => setModal(modal === "exit" ? null : "review")}
                >
                  Cancel
                </Button>
              )}
              {modal === "exit" ? (
                <Button asChild>
                  <Link href="/practice">Leave test</Link>
                </Button>
              ) : (
                <Button onClick={submit}>Submit test</Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
