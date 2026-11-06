"use client";
import Link from "next/link";
import { SkillVisual } from "@/components/practice/skill-visual";
import styles from "@/components/practice/practice.module.css";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(useGSAP);
import { useEffect, useState } from "react";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";
import { Search, ChevronDown, Check } from "lucide-react";
import {
  Dropdown,
  Tabs,
  Button as HeroButton,
  Label as HeroLabel,
} from "@heroui/react";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { skills, readAttempts, type Attempt } from "@/lib/exams";
export default function PracticePage() {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-skill]", {
          y: 18,
          opacity: 0,
          duration: 0.65,
          stagger: 0.08,
        });
        gsap.from("[data-ink]", {
          strokeDasharray: 400,
          strokeDashoffset: 400,
          duration: 1.2,
          stagger: 0.06,
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );
  const [drafts, setDrafts] = useState<Record<string, number>>({});
  const [status, setStatus] = useState("all");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [unpracticed, setUnpracticed] = useState(false);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  useEffect(() => {
    setAttempts(readAttempts());
    const saved: Record<string, number> = {};
    for (const s of skills) {
      try {
        const d = JSON.parse(
          localStorage.getItem("aptis-draft-" + s.id) || "null",
        );
        if (d?.deadline > Date.now()) saved[s.id] = d.question;
      } catch {}
    }
    setDrafts(saved);
    const p = new URLSearchParams(location.search).get("skill");
    if (p) setFilter(p);
  }, []);
  const shown = skills.filter(
    (s) =>
      (filter === "all" || s.id === filter) &&
      (status === "all" ||
        (status === "submitted"
          ? attempts.some((a) => a.skill === s.id)
          : drafts[s.id] !== undefined)) &&
      (!unpracticed || !attempts.some((a) => a.skill === s.id)) &&
      String(s.name + " " + s.description)
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".exam-card", {
          y: 8,
          opacity: 0,
          duration: 0.3,
          stagger: 0.04,
        });
      });
      return () => mm.revert();
    },
    {
      scope: root,
      dependencies: [filter, search, unpracticed, status],
      revertOnUpdate: true,
    },
  );
  return (
    <div ref={root} className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1>Luyện tập theo cách của bạn.</h1>
          <p>Bốn kỹ năng. Một hành trình chinh phục Aptis ESOL.</p>
        </div>
        <span>{attempts.length} bài đã nộp trên thiết bị</span>
      </header>
      <div className={styles.skills}>
        {skills.map((s) => (
          <button
            data-skill
            key={s.id}
            className={styles.skill}
            aria-pressed={filter === s.id}
            onClick={() => {
              setFilter(s.id);
              document
                .getElementById("exam-list")
                ?.scrollIntoView({ block: "start" });
            }}
          >
            <SkillVisual skill={s.id} />
            <div>
              <h2>
                {s.name}
                <span aria-hidden="true">↗</span>
              </h2>
              <p>{s.description}</p>
              <small>1 đề luyện tập</small>
            </div>
          </button>
        ))}
      </div>
      {Object.keys(drafts).length > 0 && (
        <section className={styles.resume}>
          <h2>Tiếp tục luyện tập</h2>
          {skills
            .filter((s) => drafts[s.id] !== undefined)
            .map((s) => (
              <Link key={s.id} href={`/exam/${s.id}`}>
                <strong>{s.name} Practice Test</strong>
                <span>
                  Câu {drafts[s.id]} / {s.questions}
                </span>
                <span>Tiếp tục →</span>
              </Link>
            ))}
        </section>
      )}
      <section id="exam-list">
        <div className="list-heading">
          <h2>Thư viện đề luyện tập</h2>
        </div>
        <Tabs
          selectedKey={filter}
          onSelectionChange={(key) => setFilter(String(key))}
          className="workspace-filters"
        >
          <div className={styles.toolbar}>
            <Tabs.ListContainer className={styles.tabContainer}>
              <Tabs.List aria-label="Lọc kỹ năng" className={styles.tabList}>
                {[{ id: "all", name: "Tất cả" }, ...skills].map((s) => (
                  <Tabs.Tab key={s.id} id={s.id} className={styles.skillTab}>
                    <span>{s.name}</span>
                    <Tabs.Indicator className={styles.tabIndicator} />
                  </Tabs.Tab>
                ))}
              </Tabs.List>
            </Tabs.ListContainer>
            <div className={styles.controls}>
              {" "}
              <div className={styles.status}>
                <span>Trạng thái</span>
                <Dropdown>
                  <HeroButton
                    aria-label="Lọc trạng thái"
                    className={styles.statusTrigger}
                  >
                    {status === "submitted"
                      ? "Đã nộp"
                      : status === "draft"
                        ? "Đang làm"
                        : "Tất cả"}
                    <ChevronDown size={14} />
                  </HeroButton>
                  <Dropdown.Popover
                    className={styles.statusPopover}
                    placement="bottom end"
                  >
                    <Dropdown.Menu
                      aria-label="Trạng thái đề"
                      selectionMode="single"
                      disallowEmptySelection
                      selectedKeys={new Set([status])}
                      onSelectionChange={(keys) => {
                        if (keys !== "all") {
                          const key = Array.from(keys)[0];
                          if (key) setStatus(String(key));
                        }
                      }}
                      className={styles.statusMenu}
                    >
                      {[
                        { id: "all", label: "Tất cả" },
                        { id: "submitted", label: "Đã nộp" },
                        { id: "draft", label: "Đang làm" },
                      ].map((option) => (
                        <Dropdown.Item
                          id={option.id}
                          key={option.id}
                          textValue={option.label}
                          className={styles.statusItem}
                        >
                          <HeroLabel>{option.label}</HeroLabel>
                          {status === option.id && (
                            <Check size={15} aria-hidden="true" />
                          )}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown.Popover>
                </Dropdown>
              </div>
              <Switch
                id="unpracticed"
                thumbClassName="!translate-x-0 !transform-none"
                className={styles.switch}
                checked={unpracticed}
                onCheckedChange={setUnpracticed}
              />
              <Label htmlFor="unpracticed" className={styles.toggleLabel}>
                <span className={styles.fullLabel}>
                  Chỉ kỹ năng chưa có bài nộp
                </span>
                <span aria-hidden="true" className={styles.shortLabel}>
                  Chưa nộp
                </span>
              </Label>
              <InputGroup className={styles.searchSlot}>
                <InputGroupInput
                  aria-label="Tìm bộ đề"
                  placeholder="Tìm bộ đề…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <InputGroupAddon>
                  <Search aria-hidden="true" />
                </InputGroupAddon>
              </InputGroup>
            </div>
          </div>
          {["all", ...skills.map((s) => s.id)].map((tabId) => (
            <Tabs.Panel key={tabId} id={tabId} className={styles.tabPanel}>
              <div className="exam-grid" id="exam-library">
                {shown.map((s) => (
                  <Card className={`exam-card ${styles.test}`} key={s.id}>
                    <CardContent className="exam-card-body">
                      <Badge variant="secondary">
                        {attempts.some((a) => a.skill === s.id)
                          ? "Đã nộp bài"
                          : "Chưa nộp"}{" "}
                        · General
                      </Badge>
                      <h3>{s.name} Practice Test</h3>
                      <p>{s.description}</p>
                      <div className={styles.footer}>
                        <div className="exam-meta">
                          <span>
                            <Icon name="schedule" />
                            {s.time} phút
                          </span>
                          <span>
                            <Icon name="format_list_bulleted" />
                            {s.questions} câu lớn
                          </span>
                        </div>
                        <Button asChild>
                          <Link href={"/exam/" + s.id}>
                            {drafts[s.id] !== undefined
                              ? "Tiếp tục"
                              : attempts.some((a) => a.skill === s.id)
                                ? "Làm lại"
                                : "Bắt đầu luyện"}{" "}
                            <Icon name="arrow_forward" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {!shown.length && (
                <Empty>
                  <EmptyHeader>
                    <Icon name="search_off" />
                    <EmptyTitle>Chưa tìm thấy bộ đề</EmptyTitle>
                    <EmptyDescription>
                      Thử từ khóa khác hoặc chọn tất cả kỹ năng.
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setFilter("all");
                        setSearch("");
                        setStatus("all");
                        setUnpracticed(false);
                      }}
                    >
                      Xóa bộ lọc
                    </Button>
                  </EmptyContent>
                </Empty>
              )}
            </Tabs.Panel>
          ))}
        </Tabs>
      </section>
    </div>
  );
}
