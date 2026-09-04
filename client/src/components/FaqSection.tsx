import { motion, Variants } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import "./faq-section.css";

const FAQ_KEYS = [
  { q: "faqQ1", a: "faqA1" },
  { q: "faqQ2", a: "faqA2" },
  { q: "faqQ3", a: "faqA3" },
  { q: "faqQ4", a: "faqA4" },
  { q: "faqQ5", a: "faqA5" },
  { q: "faqQ6", a: "faqA6" },
];

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] } },
};

interface FaqSectionProps {
  t: Record<string, string>;
  prefersReducedMotion: boolean | null;
}

export default function FaqSection({ t, prefersReducedMotion }: FaqSectionProps) {
  return (
    <motion.section
      className="faq-section"
      id="faq"
      aria-labelledby="faq-title"
      initial={prefersReducedMotion ? "show" : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-10%" }}
      variants={fadeUpVariant}
    >
      <div className="page-container faq-inner">
        <motion.div variants={fadeUpVariant} className="faq-copy">
          <div className="faq-kicker">
            <span className="kicker-number">09</span>
            <span className="kicker-line" />
            <span>{t.faqKicker}</span>
          </div>
          <h2 id="faq-title">
            {t.faqTitle.split(" ").slice(0, -2).join(" ")}
            <br />
            <em>{t.faqTitle.split(" ").slice(-2).join(" ")}</em>
          </h2>
          <p>{t.faqDesc}</p>
        </motion.div>

        <motion.div variants={fadeUpVariant} className="faq-list">
          <Accordion type="single" collapsible className="faq-accordion">
            {FAQ_KEYS.map(({ q, a }, index) => (
              <AccordionItem key={q} value={q} className="faq-item">
                <AccordionTrigger className="faq-trigger">
                  <span className="faq-index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="faq-question">{t[q]}</span>
                </AccordionTrigger>
                <AccordionContent className="faq-answer">{t[a]}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </motion.section>
  );
}
