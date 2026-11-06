"use client";
import { useState } from "react";
import { landingFaq } from "@/lib/landing-content";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import styles from "./landing-journey.module.css";
export function LandingFaq() {
  const [category, setCategory] = useState("Tất cả");
  return (
    <section
      id="faq"
      data-landing-section="faq"
      className={`${styles.section} ${styles.faq}`}
    >
      <Tabs value={category} onValueChange={setCategory}>
        <div className={styles.faqLayout}>
          <div>
            <h2>
              Bạn hỏi.
              <br />
              <em>Chúng mình trả lời.</em>
            </h2>
            <TabsList className={styles.faqFilters} aria-label="Nhóm câu hỏi">
              {["Tất cả", "Luyện tập", "Bài làm & dữ liệu", "Truy cập"].map(
                (c) => (
                  <TabsTrigger key={c} value={c}>
                    {c}
                  </TabsTrigger>
                ),
              )}
            </TabsList>
          </div>
          <TabsContent value={category} className={styles.faqItems}>
            <Accordion type="single" collapsible>
              {landingFaq
                .filter((f) => category === "Tất cả" || category === f.category)
                .map((f) => (
                  <AccordionItem value={f.question} key={f.question}>
                    <AccordionTrigger>{f.question}</AccordionTrigger>
                    <AccordionContent
                      forceMount
                      className="data-[state=closed]:hidden"
                    >
                      {f.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
            </Accordion>
          </TabsContent>
        </div>
      </Tabs>
    </section>
  );
}
