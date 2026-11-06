"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "./exam-icon";
import { Button } from "@/components/ui/button";
import { speakingQuestions } from "@/lib/exams";
import { storeRecording } from "@/lib/recordings";
type Phase = "instructions" | "preparation" | "recording" | "saving" | "error";
function useMicrophone() {
  const stream = useRef<MediaStream | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const context = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const [level, setLevel] = useState(0);
  const frame = useRef(0);
  useEffect(
    () => () => {
      cancelAnimationFrame(frame.current);
      if (recorder.current?.state === "recording") recorder.current.stop();
      stream.current?.getTracks().forEach((t) => t.stop());
      void context.current?.close();
    },
    [],
  );
  async function open() {
    if (!navigator.mediaDevices?.getUserMedia)
      throw new Error(
        "Trình duyệt chưa hỗ trợ microphone. Hãy dùng Chrome hoặc Edge qua localhost/HTTPS.",
      );
    if (!stream.current) {
      stream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      context.current = new AudioContext();
      await context.current.resume();
      analyser.current = context.current.createAnalyser();
      analyser.current.fftSize = 256;
      context.current
        .createMediaStreamSource(stream.current)
        .connect(analyser.current);
      const values = new Uint8Array(analyser.current.frequencyBinCount);
      const measure = () => {
        analyser.current?.getByteFrequencyData(values);
        setLevel(values.reduce((a, b) => a + b, 0) / values.length / 128);
        frame.current = requestAnimationFrame(measure);
      };
      measure();
    }
    return stream.current;
  }
  async function start() {
    const s = await open();
    return new Promise<Blob>((resolve, reject) => {
      const r = new MediaRecorder(s);
      recorder.current = r;
      const chunks: BlobPart[] = [];
      r.ondataavailable = (e) => {
        if (e.data.size) chunks.push(e.data);
      };
      r.onerror = () =>
        reject(new Error("Không thể ghi âm. Vui lòng kiểm tra microphone."));
      r.onstop = () => resolve(new Blob(chunks, { type: r.mimeType }));
      r.start(1000);
    });
  }
  const stop = useCallback(() => {
    if (recorder.current?.state === "recording") recorder.current.stop();
  }, []);
  return { open, start, stop, level };
}
export function Waveform({ level }: { level: number }) {
  return (
    <div className="waveform" aria-label="Microphone input level">
      {Array.from({ length: 54 }, (_, i) => (
        <i
          key={i}
          style={{
            transform:
              "scaleY(" +
              Math.max(0.04, level * (0.4 + Math.sin(i * 1.7) ** 2) * 3) +
              ")",
          }}
        />
      ))}
    </div>
  );
}
export function MicCheck({ onContinue }: { onContinue: () => void }) {
  const mic = useMicrophone();
  const [state, setState] = useState("idle");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const urlRef = useRef("");
  useEffect(
    () => () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    },
    [],
  );
  async function record() {
    setError("");
    try {
      await mic.open();
      setState("recording");
      const promise = mic.start();
      const blob = await promise;
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      const u = URL.createObjectURL(blob);
      urlRef.current = u;
      setUrl(u);
      setState("recorded");
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Không thể truy cập mic. Hãy cấp quyền trong trình duyệt.",
      );
      setState("idle");
    }
  }
  return (
    <div className="mic-check">
      <span className="mic-check-icon">
        <Icon name="mic" />
      </span>
      <h1>Kiểm tra microphone</h1>
      <p>
        Thu một đoạn ngắn rồi nghe lại để chắc chắn giọng nói của bạn rõ ràng.
      </p>
      <div className="mic-check-panel">
        <Waveform level={mic.level} />
        {state === "recording" ? (
          <Button onClick={() => mic.stop()}>
            <Icon name="stop_circle" />
            Dừng ghi âm thử
          </Button>
        ) : (
          <Button variant="outline" onClick={record}>
            <Icon name="mic" />
            {url ? "Thu thử lại" : "Bắt đầu thu thử"}
          </Button>
        )}
        {url && <audio controls src={url} />}
      </div>
      {error && (
        <Alert status="danger">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button disabled={!url || state === "recording"} onClick={onContinue}>
        Mic đã ổn, tiếp tục <Icon name="arrow_forward" />
      </Button>
      <small>Âm thanh thử chỉ được sử dụng trên trình duyệt này.</small>
    </div>
  );
}
const prompts = [
  "Part One. In this part, I am going to ask you three short questions about yourself and your interests. You will have 30 seconds to reply to each question. Begin speaking when you hear this sound.",
  "Part Two. In this part, I am going to ask you to describe a picture. Then I will ask you two questions about it. You will have 45 seconds for each response. Begin speaking when you hear this sound.",
  "Part Three. In this part, I am going to ask you to compare two pictures, and I will then ask you two questions about them. You will have 45 seconds for each response. Begin speaking when you hear this sound.",
  "Part Four. I am going to show you a picture and ask you three questions. You will have one minute to think about your answers before you start speaking. You will have two minutes to answer all three questions.",
];
const finalQuestions =
  "Tell me about a time when you were on your own. How did you feel about it? What are some of the ways of passing the time on your own?";
export function SpeakingFlow({
  attemptId,
  onComplete,
  onSaved,
}: {
  attemptId: string;
  onComplete: () => void;
  onSaved: (id: string) => void;
}) {
  const [index, setIndex] = useState(0);
  const [showPrompt, setShowPrompt] = useState(true);
  const [phase, setPhase] = useState<Phase>("instructions");
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState("");
  const mic = useMicrophone();
  const recording = useRef<Promise<Blob> | null>(null);
  const deadline = useRef(0);
  const saving = useRef(false);
  const finished = useRef(false);
  const advanceRef = useRef<() => void>(() => {});
  const part = index < 9 ? Math.floor(index / 3) : 3;
  const sub = index % 3;
  const question = part < 3 ? speakingQuestions[part][sub] : finalQuestions;
  const stopRecording = mic.stop;
  const finish = useCallback(async () => {
    if (saving.current || finished.current) return;
    saving.current = true;
    setPhase("saving");
    stopRecording();
    try {
      const blob = await recording.current;
      if (!blob?.size)
        throw new Error("Bản ghi chưa có âm thanh. Vui lòng thử lại câu này.");
      await storeRecording(attemptId + ":" + index, blob);
      onSaved(String(index));
      saving.current = false;
      if (index === 9) {
        finished.current = true;
        onComplete();
      } else {
        setIndex((v) => v + 1);
        setShowPrompt(index === 2 || index === 5 || index === 8);
        setPhase("instructions");
      }
    } catch (e) {
      saving.current = false;
      setError(e instanceof Error ? e.message : "Không thể lưu bản ghi.");
      setPhase("error");
    }
  }, [index, attemptId, onComplete, onSaved, stopRecording]);
  advanceRef.current = finish;
  async function startRecording() {
    try {
      await mic.open();
      const audioContext = new AudioContext();
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      gain.gain.value = 0.08;
      osc.frequency.value = 880;
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.start();
      osc.stop(audioContext.currentTime + 0.15);
      osc.onended = () => void audioContext.close();
      recording.current = mic.start();
      recording.current.catch(() => {});
      const duration = part === 0 ? 30 : part === 3 ? 120 : 45;
      deadline.current = Date.now() + duration * 1000;
      setSeconds(duration);
      setPhase("recording");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không thể bắt đầu ghi âm.");
      setPhase("error");
    }
  }
  const startRef = useRef(startRecording);
  startRef.current = startRecording;
  useEffect(() => {
    let cancelled = false;
    if (phase !== "instructions") return;
    if (!("speechSynthesis" in window)) {
      setError("Trình duyệt không hỗ trợ đọc đề. Hãy thử Chrome hoặc Edge.");
      setPhase("error");
      return;
    }
    const text = showPrompt ? prompts[part] : question;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-GB";
    u.rate = 0.95;
    u.onend = () => {
      if (cancelled) return;
      if (showPrompt) setShowPrompt(false);
      else if (part === 3) {
        deadline.current = Date.now() + 60000;
        setSeconds(60);
        setPhase("preparation");
      } else void startRef.current();
    };
    u.onerror = (e) => {
      if (!cancelled && e.error !== "interrupted" && e.error !== "canceled") {
        setError("Không thể đọc câu hỏi. Vui lòng thử lại.");
        setPhase("error");
      }
    };
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
    return () => {
      cancelled = true;
      speechSynthesis.cancel();
    };
  }, [index, showPrompt, phase, part, question]);
  useEffect(() => {
    if (phase !== "recording" && phase !== "preparation") return;
    const tick = () => {
      const left = Math.max(
        0,
        Math.ceil((deadline.current - Date.now()) / 1000),
      );
      setSeconds(left);
      if (left === 0) {
        if (phase === "preparation") void startRef.current();
        else void advanceRef.current();
      }
    };
    const timer = setInterval(tick, 200);
    return () => clearInterval(timer);
  }, [phase]);
  return (
    <div className={"speaking-screen " + (showPrompt ? "is-prompt" : "")}>
      <div className="speaking-content">
        {showPrompt ? (
          <>
            <h2>Prompt</h2>
            <p className="speaking-prompt">{prompts[part]}</p>
          </>
        ) : (
          <>
            <span>Speaking</span>
            <h2>
              {part === 3 ? "Question 4 of 4" : "Part " + (sub + 1) + " of 3"}
            </h2>
            <div className="speaking-task">
              {part === 3 && (
                <p>
                  <strong>Part Four</strong> — {prompts[3]}
                </p>
              )}
              {part === 1 && (
                <Image
                  sizes="(max-width: 800px) 100vw, 50vw"
                  src="/assets/museum.jpg"
                  alt="Visitors looking at exhibits in a museum"
                  width="430"
                  height="310"
                />
              )}
              {part === 2 && (
                <div className="speaking-pictures">
                  <Image
                    sizes="(max-width: 800px) 100vw, 50vw"
                    src="/assets/golf.jpg"
                    alt="A person playing golf"
                    width="400"
                    height="290"
                  />
                  <Image
                    sizes="(max-width: 800px) 100vw, 50vw"
                    src="/assets/basketball.jpg"
                    alt="People playing basketball"
                    width="400"
                    height="290"
                  />
                </div>
              )}
              {part === 3 && (
                <Image
                  sizes="(max-width: 800px) 100vw, 50vw"
                  src="/assets/alone.jpg"
                  alt="A quiet place to spend time alone"
                  width="430"
                  height="290"
                />
              )}
              <p>
                {part === 3 ? (
                  <>
                    {finalQuestions.split("? ").map((q, i) => (
                      <span className="final-speaking-q" key={i}>
                        {q}
                        {i < 2 ? "?" : ""}
                      </span>
                    ))}
                  </>
                ) : (
                  question
                )}
              </p>
              {part === 3 && (
                <strong>
                  You now have one minute to think about your answers. You can
                  make notes if you wish.
                </strong>
              )}
            </div>
          </>
        )}
      </div>
      {(!showPrompt || phase === "error") && (
        <aside className="recording-panel">
          <h3>
            {phase === "instructions"
              ? "Instructions…"
              : phase === "preparation"
                ? "Preparation…"
                : phase === "saving"
                  ? "Saving…"
                  : phase === "error"
                    ? "Microphone / audio error"
                    : "Recording…"}
          </h3>
          <div className="recording-circle">
            {phase === "instructions" ? (
              <Icon name="volume_up" />
            ) : phase === "error" ? (
              <Icon name="mic_off" />
            ) : phase === "saving" ? (
              <Icon name="hourglass_top" />
            ) : (
              <span>{seconds}s</span>
            )}
          </div>
          {phase === "recording" && (
            <>
              <Waveform level={mic.level} />
              {mic.level < 0.02 && <p>Audio input too low</p>}
              {seconds < 10 && seconds > 0 && (
                <Button className="finish-recording" onClick={finish}>
                  Finish Recording
                </Button>
              )}
            </>
          )}
          {phase === "preparation" && (
            <p>
              Think about your answers.
              <br />
              Recording begins automatically.
            </p>
          )}
          {phase === "error" && (
            <>
              <Alert status="danger">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              <Button
                onClick={() => {
                  setError("");
                  setPhase("instructions");
                }}
              >
                Thử lại câu này
              </Button>
            </>
          )}
          <small className="speech-demo-label">
            Browser voice demo · Chưa kết nối AI TTS
          </small>
        </aside>
      )}
    </div>
  );
}
