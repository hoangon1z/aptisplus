"use client";
import Link from "next/link";
import { pricingPlans } from "@/lib/landing-content";
import { Icon } from "@/components/icon";
import { useScrollArtwork } from "@/lib/motion/use-scroll-artwork";
import styles from "./landing-journey.module.css";
export function Pricing() {
  const root = useScrollArtwork((tl) => {
    tl.fromTo(
      "[data-pricing-path]",
      { drawSVG: "0%" },
      { drawSVG: "100%", duration: 2, stagger: 0.25 },
      0,
    );
  });
  return (
    <section
      ref={root}
      id="pricing"
      data-landing-section="pricing"
      className={`${styles.section} ${styles.pricing}`}
    >
      <div className={styles.split}>
        <div>
          <h2 data-editorial-heading>
            Chọn cách học.
            <br />
            <em>Rõ ràng từ đầu.</em>
          </h2>
          <p>
            Bảng giá và thời hạn truy cập chưa được công bố. Bạn có thể khám phá
            trải nghiệm luyện tập hiện có trước.
          </p>
          <Link href="/practice" className={styles.solidLink}>
            Khám phá bài luyện <Icon name="arrow_forward" />
          </Link>
          <svg
            viewBox="0 0 500 100"
            aria-hidden="true"
            className={styles.pricingArtwork}
          >
            <path
              data-pricing-path
              d="M0 78 C100 78 100 25 230 25 S360 78 500 15"
            />
            <path
              data-pricing-path
              d="M0 85 C120 85 130 42 230 42 S360 85 500 32"
            />
          </svg>
        </div>
        {pricingPlans.length ? (
          <div className={styles.configuredPlans}>
            {pricingPlans.map((plan) => (
              <article key={plan.id}>
                <h3>{plan.name}</h3>
                <p>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: plan.price.currency,
                  }).format(plan.price.amount)}{" "}
                  / {plan.price.period}
                </p>
                <ul>
                  {plan.benefits.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <Link href={plan.checkoutHref}>Chọn gói {plan.name}</Link>
              </article>
            ))}
          </div>
        ) : (
          <div className={styles.availability}>
            <h3>Hiện có trong trải nghiệm</h3>
            <dl>
              <div>
                <dt>Bốn kỹ năng</dt>
                <dd>Có thể luyện tập</dd>
              </div>
              <div>
                <dt>Xem lại bài làm</dt>
                <dd>Lưu trên trình duyệt</dd>
              </div>
              <div>
                <dt>Chấm điểm AI</dt>
                <dd>Đang chuẩn bị</dd>
              </div>
              <div>
                <dt>Gói học & thanh toán</dt>
                <dd>Chưa công bố</dd>
              </div>
            </dl>
            <p className={styles.fine}>
              Chưa có gói học được mở bán trên trang này.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
