"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEffect, useRef, useState } from "react";
import { Icon } from "./exam-icon";
import {
  type AnswerMap,
  listeningPrompts,
  listeningOptions,
  audioScripts,
  speakers,
  opinions,
  readingAuthors,
  authorQuestions,
  headings,
  paragraphs,
  writingShort,
  writingChat,
} from "@/lib/exams";
export function ABC({
  id,
  options,
  answers,
  onAnswer,
}: {
  id: string;
  options: string[];
  answers: AnswerMap;
  onAnswer: (id: string, v: string) => void;
}) {
  return (
    <div
      className="abc-options"
      role="radiogroup"
      aria-label="Choose one answer"
    >
      {options.map((option, i) => (
        <button
          type="button"
          role="radio"
          aria-checked={answers[id] === String(i)}
          key={option}
          className={answers[id] === String(i) ? "chosen" : ""}
          onClick={() => onAnswer(id, String(i))}
        >
          <span>{"ABC"[i]}</span>
          <span>{option}</span>
          {answers[id] === String(i) && <Icon name="check" />}
        </button>
      ))}
    </div>
  );
}
export function AnswerSelect({
  id,
  options,
  answers,
  onAnswer,
  label,
}: {
  id: string;
  options: readonly string[];
  answers: AnswerMap;
  onAnswer: (id: string, v: string) => void;
  label: string;
}) {
  return (
    <select
      aria-label={label}
      value={answers[id] || ""}
      onChange={(e) => onAnswer(id, e.target.value)}
    >
      <option value="" />
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
}
export function AudioPlay({
  question,
  playbackKey,
}: {
  question: number;
  playbackKey: string;
}) {
  const [playing, setPlaying] = useState(false);
  const [counts, setCounts] = useState<Record<number, number>>({});
  const [error, setError] = useState("");
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);
  useEffect(
    () => () => {
      speechSynthesis.cancel();
    },
    [],
  );
  useEffect(() => {
    speechSynthesis.cancel();
    utterance.current = null;
    setPlaying(false);
    setError("");
    try {
      setCounts(JSON.parse(sessionStorage.getItem(playbackKey) || "{}"));
    } catch {}
  }, [question, playbackKey]);
  function toggle() {
    if (!("speechSynthesis" in window)) {
      setError("Audio preview is not supported in this browser.");
      return;
    }
    if (playing) {
      speechSynthesis.pause();
      setPlaying(false);
      return;
    }
    if ((counts[question] || 0) >= 2) {
      return;
    }
    if (utterance.current && speechSynthesis.paused) {
      speechSynthesis.resume();
    } else {
      const text =
        question <= 13
          ? audioScripts[question - 1]
          : question === 14
            ? "Speaker A. I used to dislike science, but now I really enjoy it. Speaker B. I love reading books about science. Speaker C. I would like to study science at university. Speaker D. At school, I enjoyed other subjects more than science."
            : question === 15
              ? "Man: Parents should pay attention to what children eat. Woman: I agree. I also think children should be encouraged to play sports. Man: A quiet place helps them concentrate. Woman: Yes, and sleeping too much can make children feel tired."
              : "The new transport plan has some benefits, but it does not represent the opinions of the whole community. The media have not reported all of the details fairly.";
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-GB";
      u.rate = 0.92;
      u.onend = () => {
        setPlaying(false);
        utterance.current = null;
      };
      u.onerror = () => {
        setPlaying(false);
        setError("Playback failed. Please try again.");
      };
      utterance.current = u;
      speechSynthesis.speak(u);
    }
    setCounts((c) => {
      const next = { ...c, [question]: (c[question] || 0) + 1 };
      try {
        sessionStorage.setItem(playbackKey, JSON.stringify(next));
      } catch {}
      return next;
    });
    setPlaying(true);
  }
  return (
    <div className="audio-play">
      <button
        type="button"
        onClick={toggle}
        aria-label="Play/Stop"
        disabled={!playing && (counts[question] || 0) >= 2}
      >
        <Icon name={playing ? "stop_circle" : "play_circle"} />
        <span className="audio-play-label">Play/Stop</span>
      </button>
      <span>{counts[question] || 0}/2 plays · demo voice</span>
      {error && (
        <Alert status="danger">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
type Props = {
  question: number;
  answers: AnswerMap;
  onAnswer: (id: string, v: string) => void;
  bookmark: (id: string) => React.ReactNode;
  playbackKey?: string;
};
export function ListeningQuestions({
  question: q,
  answers,
  onAnswer,
  bookmark,
  playbackKey = "aptis-audio-plays",
}: Props) {
  const selectProps = { answers, onAnswer };
  if (q <= 13)
    return (
      <>
        <p>{listeningPrompts[q - 1]}</p>
        <AudioPlay question={q} playbackKey={playbackKey} />
        <ABC
          id={String(q)}
          options={listeningOptions[q - 1]}
          {...selectProps}
        />
      </>
    );
  if (q === 14)
    return (
      <>
        <p>
          Four people are talking about science. Complete the sentences below.
        </p>
        <AudioPlay question={q} playbackKey={playbackKey} />
        <div className="speaker-selects">
          {["A", "B", "C", "D"].map((s, i) => (
            <label key={s}>
              Speaker {s} ...{" "}
              <AnswerSelect
                id={"14." + i}
                options={speakers}
                label={"Speaker " + s}
                {...selectProps}
              />
            </label>
          ))}
        </div>
      </>
    );
  if (q === 15)
    return (
      <>
        <p>
          Listen to two parents discussing the issue of children’s health. Read
          the opinions below and decide whose opinion matches the statements:
          the man, the woman, or both the man and the woman. You can listen to
          the discussion twice.
        </p>
        <AudioPlay question={q} playbackKey={playbackKey} />
        <p className="spaced">Who expresses which opinion?</p>
        <div className="opinion-selects">
          {opinions.map((o, i) => (
            <label key={o}>
              {i + 1}. {o}{" "}
              <AnswerSelect
                id={"15." + i}
                options={["Man", "Woman", "Both"]}
                label={o}
                {...selectProps}
              />
            </label>
          ))}
        </div>
      </>
    );
  return (
    <>
      <p>
        Listen to{" "}
        {q === 16
          ? "a city planner talk at a press conference about a new transport plan"
          : "a speaker discussing changes in education"}{" "}
        and answer the questions below.
      </p>
      <AudioPlay question={q} playbackKey={playbackKey} />
      {[0, 1].map((i) => (
        <section className="exam-subquestion" key={i}>
          {bookmark(q + "." + i)}
          <p>
            {i === 0
              ? "What is his opinion of the plan overall?"
              : "What is his opinion of the role of the media?"}
          </p>
          <ABC
            id={q + "." + i}
            options={
              i === 0
                ? [
                    "It is very similar to previous community projects in the same area.",
                    "It was prepared without proper consultation with the community.",
                    "It does not represent the opinions of the whole community.",
                  ]
                : [
                    "He is critical of the media’s reporting of the plan.",
                    "He is surprised by the media’s interest in the plan.",
                    "He is confused by the media’s reaction to the plan.",
                  ]
            }
            {...selectProps}
          />
        </section>
      ))}
    </>
  );
}
const orderingTexts = [
  [
    "For this reason it is easy for them to take a wrong turn and get lost.",
    "These will help visitors to find their way to our beautiful town.",
    "This road is busy during the summer when tourists visit the area.",
    "They don’t know the road because many of them are here for the first time.",
    "Therefore, there should be more signs along the road.",
  ],
  [
    "Finally, we shared our findings with the whole class.",
    "Before leaving, we packed lunch and checked the weather.",
    "After arriving, we followed a path through the trees.",
    "Our teacher asked us to observe the plants along the way.",
    "We wrote down what we saw in our notebooks.",
  ],
];
function Ordering({ question: q, answers, onAnswer }: Omit<Props, "bookmark">) {
  const texts = orderingTexts[q - 2];
  const [selected, setSelected] = useState<number | null>(null);
  const order: (number | null)[] = (() => {
    try {
      return JSON.parse(answers[String(q)] || "[null,null,null,null,null]");
    } catch {
      return [null, null, null, null, null];
    }
  })();
  function move(item: number, slot: number) {
    const next = order.map((v) => (v === item ? null : v));
    const displaced = next[slot];
    const old = order.indexOf(item);
    next[slot] = item;
    if (old >= 0 && displaced !== null) next[old] = displaced;
    onAnswer(String(q), JSON.stringify(next));
    setSelected(null);
  }
  return (
    <>
      <p>
        <strong>
          The sentences below are from a report. Put the sentences in the right
          order. The first sentence is done for you.
        </strong>
      </p>
      <p className="ordering-help">
        Drag a sentence, or select one and click a space. Click a placed
        sentence to return it.
      </p>
      <div className="ordering">
        <div className="ordering-slots">
          <h3>
            {q === 2 ? "Signs on the coast road" : "A visit to the forest"}
          </h3>
          <p>
            {q === 2
              ? "This report gives information about the traffic problems on the coast road."
              : "Last week, our class went on a trip to a nearby forest."}
          </p>
          {order.map((item, i) => (
            <button
              key={i}
              className="drop-slot"
              aria-label={"Position " + (i + 1)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const n = Number(e.dataTransfer.getData("text/plain"));
                if (Number.isInteger(n) && n >= 0 && n < 5) move(n, i);
              }}
              onClick={() => {
                if (selected !== null) move(selected, i);
                else if (item !== null) {
                  const next = [...order];
                  next[i] = null;
                  onAnswer(String(q), JSON.stringify(next));
                }
              }}
            >
              {item !== null ? texts[item] : <span>{i + 1}</span>}
            </button>
          ))}
        </div>
        <div className="ordering-bank">
          {texts.map(
            (text, i) =>
              !order.includes(i) && (
                <button
                  key={text}
                  draggable
                  onDragStart={(e) =>
                    e.dataTransfer.setData("text/plain", String(i))
                  }
                  aria-pressed={selected === i}
                  className={selected === i ? "selected" : ""}
                  onClick={() => setSelected(i)}
                >
                  <Icon name="drag_indicator" />
                  {text}
                </button>
              ),
          )}
        </div>
      </div>
    </>
  );
}
export function ReadingQuestions({ question: q, answers, onAnswer }: Props) {
  const p = { answers, onAnswer };
  if (q === 1)
    return (
      <>
        <p>
          <strong>
            Read the email from Janice to her friend. Choose one word from the
            list for each gap. The first one is done for you.
          </strong>
        </p>
        <div className="reading-email">
          <p>Dear Sally,</p>
          <p>
            Tim and I are on holiday in Greece. We have a nice{" "}
            <select aria-label="Example answer" value="view" disabled>
              <option>view</option>
            </select>{" "}
            of the sea from our hotel.
          </p>
          <p>
            The weather is{" "}
            <AnswerSelect
              id="1.0"
              options={["sunny", "cold", "wet"]}
              label="The weather"
              {...p}
            />{" "}
            and it’s really hot.
          </p>
          <p>
            Yesterday we went on a{" "}
            <AnswerSelect
              id="1.1"
              options={["boat", "walk", "ride"]}
              label="On the lake"
              {...p}
            />{" "}
            on the lake and caught some fish.
          </p>
          <p>
            We had lunch and then we visited an old{" "}
            <AnswerSelect
              id="1.2"
              options={["castle", "river", "journey"]}
              label="Visited an old"
              {...p}
            />
            .
          </p>
          <p>
            Tomorrow we are going to take a car and{" "}
            <AnswerSelect
              id="1.3"
              options={["drive", "swim", "fly"]}
              label="Take a car and"
              {...p}
            />{" "}
            around.
          </p>
          <p>
            We are going to visit some{" "}
            <AnswerSelect
              id="1.4"
              options={["shops", "fields", "stations"]}
              label="Visit some"
              {...p}
            />{" "}
            and buy clothes.
          </p>
          <p>Love,</p>
          <p>Janice</p>
        </div>
      </>
    );
  if (q === 2 || q === 3) return <Ordering question={q} {...p} />;
  if (q === 4)
    return (
      <>
        <p>
          <strong>
            Four people respond in the comments section of an online magazine
            article about education and work. Read the texts and then answer the
            questions below.
          </strong>
        </p>
        {readingAuthors.map((a) => (
          <div className="author-text" key={a.name}>
            <h3>{a.name}</h3>
            <p>{a.text}</p>
          </div>
        ))}
        <div className="author-questions">
          {authorQuestions.map((a, i) => (
            <label key={a}>
              <strong>{i + 1}.</strong> Who thinks{" "}
              {i === 1 ? "" : "you should "}
              {a}?{" "}
              <AnswerSelect
                id={"4." + i}
                options={readingAuthors.map((a) => a.name)}
                label={"Who thinks " + a}
                {...p}
              />
            </label>
          ))}
        </div>
      </>
    );
  return (
    <>
      <p>
        <strong>
          Read the passage quickly. Choose a heading for each numbered paragraph
          (1–7) from the drop-down box. There is one more heading than you need.
        </strong>
      </p>
      <h2 className="passage-title">Mission to Mars</h2>
      {paragraphs.map((text, i) => (
        <div className="heading-paragraph" key={i}>
          <label>
            <strong>{i + 1}.</strong>{" "}
            <AnswerSelect
              id={"5." + i}
              options={headings}
              label={"Heading for paragraph " + (i + 1)}
              {...p}
            />
          </label>
          <p>
            <strong>{i + 1}.</strong> {text}
          </p>
        </div>
      ))}
    </>
  );
}
function WritingEditor({
  id,
  limit,
  answers,
  onAnswer,
}: {
  id: string;
  limit: number;
  answers: AnswerMap;
  onAnswer: (id: string, v: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const value = answers[id] || "";
  useEffect(() => {
    // Preserve the caret while typing; restore saved markup on navigation.
    if (ref.current && document.activeElement !== ref.current)
      ref.current.innerHTML = value;
  }, [id, value]);
  const text = (answers[id] || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .trim();
  const words = text ? text.split(/\s+/).length : 0;
  return (
    <div className="writing-editor">
      <div className="format-toolbar">
        {[
          ["format_bold", "bold"],
          ["format_italic", "italic"],
          ["format_underlined", "underline"],
          ["format_strikethrough", "strikeThrough"],
        ].map(([icon, command]) => (
          <button
            type="button"
            aria-label={command}
            key={command}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              ref.current?.focus();
              document.execCommand(command);
              if (ref.current) onAnswer(id, ref.current.innerHTML);
            }}
          >
            <Icon name={icon} />
          </button>
        ))}
      </div>
      <div
        ref={ref}
        role="textbox"
        aria-label={"Answer " + id}
        aria-multiline
        contentEditable
        suppressContentEditableWarning
        data-placeholder="Type your answer here"
        onInput={(e) => onAnswer(id, e.currentTarget.innerHTML)}
        onPaste={(e) => {
          e.preventDefault();
          document.execCommand(
            "insertText",
            false,
            e.clipboardData.getData("text/plain"),
          );
        }}
      />
      <div className={words > limit ? "word-counter over" : "word-counter"}>
        Words{" "}
        <strong>
          {words} / {limit}
        </strong>
      </div>
    </div>
  );
}
export function WritingQuestions({
  question: q,
  answers,
  onAnswer,
  bookmark,
}: Props) {
  const p = { answers, onAnswer };
  if (q === 1)
    return (
      <>
        <p>
          <strong>
            You want to join a travel club. You have 5 messages from a member of
            the club. Write short answers (1–5 words) to each message.
            Recommended time: 3 minutes.
          </strong>
          <br />
          <strong>Example</strong> How are you? I’m fine, thanks.
        </p>
        {writingShort.map((text, i) => (
          <section className="exam-subquestion" key={text}>
            {bookmark("1." + i)}
            <label className="short-answer">
              {text}
              <input
                aria-label={text}
                placeholder="Type your answer here"
                value={answers["1." + i] || ""}
                onChange={(e) => onAnswer("1." + i, e.target.value)}
              />
            </label>
          </section>
        ))}
      </>
    );
  if (q === 2)
    return (
      <>
        <p>
          <strong>
            You are a new member of the Travel Club. Fill in the form. Write in
            sentences. Use 20–30 words. Recommended time: 7 minutes.
          </strong>
          <br />
          Please tell us why you are interested in travel.
        </p>
        <WritingEditor id="2" limit={45} {...p} />
      </>
    );
  if (q === 3)
    return (
      <>
        <p>
          <strong>
            You are communicating online with other members of the club. Reply
            to their questions. Write in sentences. Use 30–40 words per answer.
            Recommended time: 10 minutes.
          </strong>
        </p>
        {writingChat.map((text, i) => (
          <section className="exam-subquestion" key={text}>
            {bookmark("3." + i)}
            <p>{text}</p>
            <WritingEditor id={"3." + i} limit={60} {...p} />
          </section>
        ))}
      </>
    );
  return (
    <>
      <p>
        <strong>
          You are a member of the Travel Club. You have received this email from
          the club:
        </strong>
        <br />
        Dear Member,
        <br />
        We are writing to tell you that the famous travel writer Mr David Price
        will unfortunately not be able to attend our next club meeting. Although
        Mr Price will not be there to sign copies of his new book{" "}
        <em>Around The World In Eighty Ways</em>, members of the club will be
        able to buy a copy at the price of twenty five pounds. If you would like
        to reserve a copy of the book, please contact the club secretary.
        <br />
        The President
      </p>
      {[0, 1].map((i) => (
        <section className="exam-subquestion" key={i}>
          {bookmark("4." + i)}
          <p>
            <strong>
              {i === 0
                ? "Write an email to your friend. Write about your feelings and what you think the club should do about the situation. Write about 50 words. Recommended time: 10 minutes."
                : "Write an email to the president of the club. Write about your feelings and what you think the club should do about the situation. Write 120–150 words. Recommended time: 20 minutes."}
            </strong>
          </p>
          <WritingEditor id={"4." + i} limit={i === 0 ? 75 : 225} {...p} />
        </section>
      ))}
    </>
  );
}
