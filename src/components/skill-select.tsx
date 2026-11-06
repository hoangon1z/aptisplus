"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { skills } from "@/lib/exams";
export function SkillSelect({
  name = "skill",
  defaultValue = "listening",
  id = "skill",
}: {
  name?: string;
  defaultValue?: string;
  id?: string;
}) {
  return (
    <Select name={name} defaultValue={defaultValue}>
      <SelectTrigger id={id} aria-label="Kỹ năng">
        <SelectValue placeholder="Chọn kỹ năng" />
      </SelectTrigger>
      <SelectContent className="z-[150]">
        {skills.map((s) => (
          <SelectItem key={s.id} value={s.id}>
            {s.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
