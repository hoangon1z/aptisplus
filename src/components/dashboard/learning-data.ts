import type { Attempt } from "@/lib/exams";

export function dayKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function dailyActivity(attempts: Attempt[], days: number, today: Date) {
  const counts = new Map<string, number>();
  for (const attempt of attempts) {
    const date = new Date(attempt.date);
    if (!Number.isNaN(date.getTime()))
      counts.set(dayKey(date), (counts.get(dayKey(date)) || 0) + 1);
  }
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(today);
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - (days - 1 - index));
    return { date, key: dayKey(date), count: counts.get(dayKey(date)) || 0 };
  });
}
export function activeStreak(attempts: Attempt[], today: Date) {
  const days = new Set(
    attempts
      .filter((a) => !Number.isNaN(new Date(a.date).getTime()))
      .map((a) => dayKey(new Date(a.date))),
  );
  const cursor = new Date(today);
  cursor.setHours(12, 0, 0, 0);
  if (!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
