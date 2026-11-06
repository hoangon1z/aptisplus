# Aptis practice platform
<!-- impeccable:product-schema 1 -->

## Platform
web

## Stack
User selected Next.js, shadcn/ui, Inter, Material icons and GSAP plugins. Frontend first; backend decisions deferred.

## Users
Vietnamese learners preparing for Aptis ESOL General; administrators author practice exams.

## Product Purpose
Make learners familiar with exam interfaces, timing and interactions through realistic practice in Listening, Reading, Speaking and Writing. Grammar and Vocabulary excluded from initial scope.

## Capabilities and Constraints
Listening: 17 groups, 40 minutes; Q1–13 ABC, Q14 four speaker dropdowns, Q15 Man/Woman/Both, Q16–17 two ABC subquestions. Two audio starts maximum; pause-resume position remains open.
Reading: five groups, 35 minutes; gap dropdowns, two sentence ordering tasks, four authors/seven matching statements, seven paragraphs/eight headings.
Speaking: mic test and playback; TTS instructions; three personal answers of 30 seconds, three single-image answers of 45 seconds, three two-image answers of 45 seconds, final 60-second preparation and 120-second recording. Finish Recording appears only below 10 seconds. Automatically save and advance.
Writing: four groups, 50 minutes; five short answers, one 20–30 word answer, three 30–40 word answers, two emails (about 50 and 120–150 words). Suggested counters 45/60/75/225 do not block typing. Formatting bold/italic/underline/strike.
Common exam shell: countdown, proportional time bar, bookmarks, question list overlay, dark mode, magnification, previous/next, review and submission dialogs. Shared timers auto-submit on expiry.
AI grading is planned, not connected in frontend demo. Preserve backend integration seams, no invented real grades or authentication.

## Brand Commitments
The premium public and workspace identity remains primary #514FE4, navy #161A35, lavender #EEEDFF, background #F8F9FD, white surfaces, Inter and Lucide React icons. Its visual authority is the supplied concept for the hero floating Listening UI with abstract indigo ribbon, vertical skills showcase and student dashboard. Split form/image authentication is retained. No invented scores, progress or achievements. Dashboard coverage measures skills with submitted attempts, not proficiency; schedules are created by the learner.

The latest user decision restores all four actual exam interfaces to the original exam screenshots and overrides the earlier premium-exam direction. Listening, Reading, Writing and Speaking use exam violet #23085a, a white canvas, Inter (16px body, 24px question header) and self-hosted Material Symbols Rounded. Preserve square A/B/C rows (70px minimum height), plain Play/Stop, unboxed question content, the left question drawer and fixed bottom toolbar. Speaking retains its desktop right recording panel (300px) and circular timer (185px), with existing mobile reflow. Public/workspace premium styles must not apply to the actual exam runner or its portal dialogs: use reference-exam and reference-exam-dialog, never premium-exam. Existing timing, play limits, persistence and submission behavior remain unchanged. See EXAM_RESTORATION.md for implementation and verification evidence.

## Evidence on Hand
User supplied reference screenshots in conversation. No official affiliation, testimonials, success metrics or paid plans supplied. Working name Aptis Studio is provisional.

## Product Principles
Exam behavior precedes decoration. Save work. Clearly distinguish demos from connected features. Keep public SEO content crawlable. Do not promise Google rankings.

## Accessibility & Inclusion
Responsive website, keyboard operation, reduced motion, exam magnification and dark mode.
