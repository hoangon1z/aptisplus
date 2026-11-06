import { notFound } from "next/navigation";
import { ExamRunner } from "@/components/exam/exam-runner";
import { getSkill, skills } from "@/lib/exams";
export function generateStaticParams() {
  return skills.map((s) => ({ skill: s.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ skill: string }>;
}) {
  const s = getSkill((await params).skill);
  return {
    title: s ? s.name + " Practice Test" : "Practice Test",
    robots: { index: false, follow: false },
  };
}
export default async function ExamPage({
  params,
}: {
  params: Promise<{ skill: string }>;
}) {
  const s = getSkill((await params).skill);
  if (!s) notFound();
  return <ExamRunner skillId={s.id} />;
}
