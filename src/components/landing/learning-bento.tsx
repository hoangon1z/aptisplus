import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, AudioLines, CalendarDays, History, Layers } from "lucide-react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import styles from "./learning-bento.module.css";

export function LearningBento() {
  return (
    <section className={styles.section} aria-labelledby="learning-tools-title" data-landing-section="learning-tools">
      <div className={styles.intro}>
        <h2 id="learning-tools-title">Chọn bước tiếp theo của bạn.</h2>
        <p>Từ làm quen thao tác đến xem lại bài đã nộp. Mỗi lần luyện tập đều có một nơi để bắt đầu.</p>
      </div>
      <BentoGrid className={styles.grid}>
        <BentoGridItem
          className={`${styles.item} ${styles.wide}`}
          header={<div className={`${styles.art} ${styles.ribbon}`}><Image src="/assets/indigo-ribbon.png" alt="" fill sizes="(max-width: 767px) 90vw, 60vw" /><span>Listening · Reading · Speaking · Writing</span></div>}
          icon={<Layers aria-hidden="true" />}
          title={<h3>Bốn kỹ năng, một không gian luyện tập.</h3>}
          description={<><p>Chọn kỹ năng và làm quen với từng dạng câu hỏi trong phòng thi mô phỏng.</p><Link href="/practice">Khám phá bộ đề <ArrowUpRight aria-hidden="true" /></Link></>}
        />
        <BentoGridItem
          className={styles.item}
          header={<div className={`${styles.art} ${styles.mic}`}><AudioLines aria-hidden="true" /><span>Thu thử. Nghe lại. Sẵn sàng.</span></div>}
          icon={<AudioLines aria-hidden="true" />}
          title={<h3>Tự tin trước khi bật mic.</h3>}
          description={<><p>Kiểm tra microphone và nghe lại bản thu trước khi bắt đầu Speaking.</p><Link href="/exam/speaking">Kiểm tra mic <ArrowUpRight aria-hidden="true" /></Link></>}
        />
        <BentoGridItem
          className={styles.item}
          header={<div className={`${styles.art} ${styles.history}`}><History aria-hidden="true" /><span>Bài đã nộp được lưu trên thiết bị này.</span></div>}
          icon={<History aria-hidden="true" />}
          title={<h3>Nhìn lại từng lần luyện.</h3>}
          description={<><p>Mở lịch sử để xem lại câu trả lời và bản ghi âm đã lưu của bạn.</p><Link href="/results">Xem lịch sử <ArrowUpRight aria-hidden="true" /></Link></>}
        />
        <BentoGridItem
          className={`${styles.item} ${styles.wide}`}
          header={<div className={`${styles.art} ${styles.schedule}`}><CalendarDays aria-hidden="true" /><span>Chọn kỹ năng.<br />Dành một khoảng thời gian.</span></div>}
          icon={<CalendarDays aria-hidden="true" />}
          title={<h3>Để buổi luyện tiếp theo có một chỗ trong ngày.</h3>}
          description={<><p>Tự tạo lịch luyện tập và theo dõi những kỹ năng đã có bài nộp tại dashboard.</p><Link href="/dashboard">Lên lịch luyện tập <ArrowUpRight aria-hidden="true" /></Link></>}
        />
      </BentoGrid>
    </section>
  );
}
