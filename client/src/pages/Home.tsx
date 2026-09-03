import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, Facebook, Instagram, Mail, MapPin, Menu, MessageCircle, MoveUpRight, Phone, Play, X, Youtube } from "lucide-react";
import { getWhatsAppLink } from "@shared/contact";
import { motion, AnimatePresence, useReducedMotion, Variants } from "framer-motion";

/**
 * Atelier Nocturne reminder: this page is intentionally limited to a cinematic Hero and a quiet,
 * furniture-led Brand Story. Keep the composition spacious, material-led, and easy to replace with
 * approved Heaven Furniture Mart photography later.
 */

const heroRoom = "/assets/hero_luxury_showroom.png";
const archMark = "/assets/heaven-arch-mark.svg";

const materials = [
  { id: "teak", group: "Wood", name: "Burma Teak", detail: "Warm honey grain / hand-finished", className: "material-teak" },
  { id: "walnut", group: "Wood", name: "Walnut", detail: "Smoked umber grain / satin oil", className: "material-walnut" },
  { id: "sheesham", group: "Wood", name: "Sheesham", detail: "Toasted rose grain / waxed", className: "material-sheesham" },
  { id: "black", group: "Wood", name: "Matte Black Lacquer", detail: "Deep charcoal / soft-touch", className: "material-black" },
  { id: "velvet", group: "Fabric", name: "Premium Velvet", detail: "Parchment pile / low sheen", className: "material-velvet" },
  { id: "leather", group: "Fabric", name: "Genuine Leather", detail: "Cognac hide / natural patina", className: "material-leather" },
  { id: "linen", group: "Fabric", name: "Linen", detail: "Oat weave / relaxed hand", className: "material-linen" },
];

const sectionLabels: Record<string, string> = {
  top: "The studio",
  story: "Brand story",
  "why-custom": "The Heaven standard",
  collections: "Curated collections",
  portfolio: "Featured projects",
  journey: "The bespoke journey",
  "materials-preview": "Material library",
  experience: "Experience & trust",
  contact: "Consultation",
};

const collections = [
  { id: "living", number: "01", title: "Living", items: "Modular sofas · Marble-top coffee tables · Luxury TV consoles", specs: "Burma Teak / honed marble / natural boucle", image: "/assets/collection-living.jpg", gallery: ["/assets/collection-living.jpg", "/assets/living2.jpg", "/assets/living3.jpg", "/assets/living4.jpg"], imageAlt: "Heaven Furniture Mart luxury carved sofa — Living collection" },
  { id: "bedroom", number: "02", title: "Bedroom", items: "Upholstered beds · Custom wardrobes · Vanity dressers", specs: "Linen boucle / smoked oak / aged brass", image: "/assets/collection-bedroom.jpg", gallery: ["/assets/collection-bedroom.jpg", "/assets/Bedroom2.jpg", "/assets/bed_1.jpg", "/assets/bed_2.jpg"], imageAlt: "Heaven Furniture Mart ornate carved bed — Bedroom collection" },
  { id: "dining", number: "03", title: "Dining", items: "Solid wood tables · Handcrafted chairs · Credenzas", specs: "Burma Teak / saddle leather / Studio Brass", image: "/assets/collection-dining.jpg", gallery: ["/assets/collection-dining.jpg", "/assets/chair and table.jpg", "/assets/table_1.jpg"], imageAlt: "Heaven Furniture Mart marble top dining set — Dining collection" },
  { id: "office", number: "04", title: "Office & Executive", items: "Bespoke desks · Library walls · Conference tables", specs: "Smoked oak / Italian marble / brushed metal", image: "/assets/collection-office.jpg", gallery: ["/assets/collection-office.jpg", "/assets/office2.jpg", "/assets/office3.jpg", "/assets/office4.jpg"], imageAlt: "Heaven Furniture Mart executive leather office chair — Office collection" },
];

// Framer Motion Variants
const staggerContainer: Variants = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 1, 0.5, 1],
      staggerChildren: 0.15,
    },
  },
};

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 15 } },
};

const fadeVariant: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

const modalVariant: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 10 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
  exit: { opacity: 0, scale: 0.98, y: 5, transition: { duration: 0.2, ease: "easeIn" } }
};

export default function Home() {
  const prefersReducedMotion = useReducedMotion();
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("top");
  const [menuOpen, setMenuOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [trustSlide, setTrustSlide] = useState(0);
  const [contactSubmitted, setContactSubmitted] = useState(() => typeof window !== "undefined" && new URLSearchParams(window.location.search).get("contact") === "preview-success");
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({});
  const [selectedCollection, setSelectedCollection] = useState<(typeof collections)[number] | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [selectedMaterial, setSelectedMaterial] = useState(materials[0]);
  const [previousMaterial, setPreviousMaterial] = useState(materials[0]);
  const [isMaterialChanging, setIsMaterialChanging] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const quoteButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const revealDelay = prefersReducedMotion ? 220 : 980;
    const entrance = window.setTimeout(() => {
      setIsReady(true);
      setIsLoading(false);
    }, revealDelay);
    return () => window.clearTimeout(entrance);
  }, [prefersReducedMotion]);

  useEffect(() => {
    const updatePageChrome = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      document.documentElement.style.setProperty("--scroll-progress", `${progress}%`);

      const sectionIds = ["top", "story", "why-custom", "collections", "portfolio", "journey", "materials-preview", "experience", "contact"];
      const active = sectionIds.reduce((current, id) => {
        const section = document.getElementById(id);
        if (!section) return current;
        return section.getBoundingClientRect().top <= window.innerHeight * 0.36 ? id : current;
      }, "top");
      setActiveSection(active);
    };

    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
    };

    updatePageChrome();
    window.addEventListener("scroll", updatePageChrome, { passive: true });
    window.addEventListener("resize", updatePageChrome);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", updatePageChrome);
      window.removeEventListener("resize", updatePageChrome);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (!quoteOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeQuote();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [quoteOpen]);

  useEffect(() => {
    if (!quoteOpen && !selectedCollection) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeQuote();
        setSelectedCollection(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [quoteOpen, selectedCollection]);

  const handleStageMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const stage = stageRef.current;
    if (!stage) return;
    const bounds = stage.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    stage.style.setProperty("--tilt-x", `${(-y * 3.2).toFixed(2)}deg`);
    stage.style.setProperty("--tilt-y", `${(x * 4.2).toFixed(2)}deg`);
    stage.style.setProperty("--lens-x", `${(x * 26).toFixed(2)}px`);
    stage.style.setProperty("--lens-y", `${(y * 20).toFixed(2)}px`);
  };

  const handleStageLeave = () => {
    const stage = stageRef.current;
    if (!stage) return;
    stage.style.setProperty("--tilt-x", "0deg");
    stage.style.setProperty("--tilt-y", "0deg");
    stage.style.setProperty("--lens-x", "0px");
    stage.style.setProperty("--lens-y", "0px");
  };

  const handleQuoteButtonMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (prefersReducedMotion) return;
    const button = quoteButtonRef.current;
    if (!button) return;
    const bounds = button.getBoundingClientRect();
    const x = event.clientX - bounds.left - bounds.width / 2;
    const y = event.clientY - bounds.top - bounds.height / 2;
    button.style.setProperty("--magnetic-x", `${(x * 0.08).toFixed(2)}px`);
    button.style.setProperty("--magnetic-y", `${(y * 0.12).toFixed(2)}px`);
  };

  const resetQuoteButton = () => {
    const button = quoteButtonRef.current;
    if (!button) return;
    button.style.setProperty("--magnetic-x", "0px");
    button.style.setProperty("--magnetic-y", "0px");
  };

  const selectMaterial = (material: (typeof materials)[number]) => {
    if (material.id === selectedMaterial.id) return;
    setPreviousMaterial(selectedMaterial);
    setSelectedMaterial(material);
    setIsMaterialChanging(true);
    window.setTimeout(() => setIsMaterialChanging(false), 560);
  };

  const openQuote = () => {
    setSubmitted(false);
    setQuoteOpen(true);
    setMenuOpen(false);
  };

  const closeQuote = () => {
    setQuoteOpen(false);
    setSubmitted(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const handleContactFieldChange = (field: string) => {
    setContactErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleContactSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const service = String(formData.get("service") ?? "").trim();
    const errors: Record<string, string> = {};

    if (name.length < 2) errors.name = "Please share your full name.";
    if (!/^[+\d][\d\s().-]{7,}$/.test(phone)) errors.phone = "Please enter a valid phone or WhatsApp number.";
    if (!service) errors.service = "Please choose a service interest.";

    setContactErrors(errors);
    if (Object.keys(errors).length === 0) setContactSubmitted(true);
  };

  const handleSocialPlaceholder = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
  };

  const handleNavClick = () => setMenuOpen(false);

  return (
    <main className={`studio-page ${isReady ? "is-ready" : ""}`}>
      <div className={`page-loader ${isLoading ? "" : "is-hidden"}`} aria-hidden={!isLoading}>
        <div className="page-loader-mark"><img src={archMark} alt="" /></div>
        <span className="page-loader-rule" />
        <span className="page-loader-kicker">Heaven Furniture Mart</span>
        <span className="page-loader-year">Chattogram · 2026</span>
      </div>
      <div className="scroll-progress" aria-hidden="true" />
      <section className="hero-section" id="top">
        <div className="hero-backdrop" aria-hidden="true" />
        <div className="hero-grid-lines" aria-hidden="true" />
        <header className="site-header page-container">
          <a className="brand-lockup" href="#top" aria-label="Heaven Furniture Mart home">
            <img className="brand-mark" src={archMark} alt="" />
            <span className="brand-name"><span>Heaven</span><small>Furniture Mart</small></span>
          </a>
          <nav className={`desktop-nav ${menuOpen ? "is-open" : ""}`} aria-label="Primary navigation">
            <a className={activeSection === "story" ? "is-active" : ""} href="#story" onClick={handleNavClick} aria-current={activeSection === "story" ? "page" : undefined}>Story</a>
            <a className={activeSection === "why-custom" ? "is-active" : ""} href="#why-custom" onClick={handleNavClick} aria-current={activeSection === "why-custom" ? "page" : undefined}>Standard</a>
            <a className={activeSection === "collections" ? "is-active" : ""} href="#collections" onClick={handleNavClick} aria-current={activeSection === "collections" ? "page" : undefined}>Collections</a>
            <a className={activeSection === "portfolio" ? "is-active" : ""} href="#portfolio" onClick={handleNavClick} aria-current={activeSection === "portfolio" ? "page" : undefined}>Portfolio</a>
            <a className={activeSection === "journey" ? "is-active" : ""} href="#journey" onClick={handleNavClick} aria-current={activeSection === "journey" ? "page" : undefined}>Journey</a>
            <a className={activeSection === "materials-preview" ? "is-active" : ""} href="#materials-preview" onClick={handleNavClick} aria-current={activeSection === "materials-preview" ? "page" : undefined}>Materials</a>
            <a className={activeSection === "experience" ? "is-active" : ""} href="#experience" onClick={handleNavClick} aria-current={activeSection === "experience" ? "page" : undefined}>Experience</a>
            <a className={activeSection === "contact" ? "is-active" : ""} href="#contact" onClick={handleNavClick} aria-current={activeSection === "contact" ? "page" : undefined}>Contact</a>
          </nav>
          <div className="mobile-section-context" aria-live="polite"><span className="mobile-section-context-line" /><span>{sectionLabels[activeSection] ?? "The studio"}</span><span className="mobile-section-context-index">{activeSection === "top" ? "00" : String(["story", "why-custom", "collections", "portfolio", "journey", "materials-preview", "experience", "contact"].indexOf(activeSection) + 1).padStart(2, "0")}</span></div>
          <div className="header-actions">
            <button className="header-quote" type="button" onClick={openQuote}>Request a quote <ArrowUpRight size={15} strokeWidth={1.7} /></button>
            <button className="menu-toggle" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((current) => !current)}>
              {menuOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </header>

        <div className="hero-content page-container">
          <div className="hero-copy-column">
            <div className="eyebrow reveal-item reveal-one"><span className="eyebrow-rule" /><span>Custom interiors / Chattogram</span></div>
            <h1 className="hero-title reveal-item reveal-two">Furniture,<br />crafted <em>around</em><br />you<span className="title-period">.</span></h1>
            <p className="hero-description reveal-item reveal-three">Bespoke furniture and interior styling from Chattogram. Designed for your space, size, and taste.</p>
            <div className="hero-actions reveal-item reveal-four">
              <button className="magnetic-button" ref={quoteButtonRef} type="button" onClick={openQuote} onPointerMove={handleQuoteButtonMove} onPointerLeave={resetQuoteButton}>
                <span>Request a Quote</span><span className="button-icon"><ArrowUpRight size={17} strokeWidth={1.5} /></span>
              </button>
              <a className="text-link" href="#story">Read our story <MoveUpRight size={15} strokeWidth={1.5} /></a>
            </div>
            <div className="hero-footnote reveal-item reveal-five"><span>01</span><span className="footnote-line" /><span>Made slowly, for the long view.</span></div>
          </div>

          <div className="hero-visual reveal-item reveal-visual" ref={stageRef} onPointerMove={handleStageMove} onPointerLeave={handleStageLeave}>
            <div className="visual-topline" aria-hidden="true"><span>Room study / 01</span><span>29° 51' N / 91° 52' E</span></div>
            <div className="room-frame">
              <div className="room-media"><img src={heroRoom} alt="Sculptural boucle lounge chair in a charcoal-teal living room" /><div className="room-wash" aria-hidden="true" /><div className="light-leak" aria-hidden="true" /></div>
              <div className="glass-lens" aria-hidden="true"><span>soft forms</span><span>hard lines</span></div>
              <div className="room-caption"><span>Quiet forms, considered living.</span><span>Scroll to enter <ArrowDown size={15} strokeWidth={1.4} /></span></div>
            </div>
            <div className="visual-side-label" aria-hidden="true">HEAVEN / 001</div><span className="visual-corner corner-tl" aria-hidden="true" /><span className="visual-corner corner-br" aria-hidden="true" />
          </div>
        </div>
        <div className="hero-scroll page-container"><a href="#story" className="scroll-prompt"><span className="scroll-dot" /><span>Enter the studio</span></a><span className="scroll-index">Chattogram · 2026</span></div>
      </section>

      <motion.section 
        className="brand-story-section" 
        id="story" 
        aria-labelledby="brand-story-title"
        initial={prefersReducedMotion ? "show" : "hidden"}
        whileInView="show"
        viewport={{ once: true, margin: "-10%" }}
        variants={staggerContainer}
      >
        <div className="story-watermark" aria-hidden="true">2020</div>
        <div className="page-container brand-story-grid">
          <motion.div variants={fadeVariant} className="story-visuals">
            <div className="furniture-portrait" style={{ backgroundImage: "url('/assets/brand-story-main.png')", backgroundSize: "cover", backgroundPosition: "center", width: "min(100%, 425px)", aspectRatio: "0.78", borderRadius: "2px", boxShadow: "17px 19px 0 rgba(74, 61, 48, 0.09)" }} role="img" aria-label="Heaven Furniture Mart furniture collection photograph">
              <div className="furniture-shadow" aria-hidden="true" /><div className="placeholder-sheen" aria-hidden="true" />
              <span className="placeholder-label">Furniture study / 01</span><span className="placeholder-name">Made for the way you live</span>
            </div>
            {/* TODO: Replace this placeholder with a close-up of joinery, upholstery, wood grain, or a signature furniture detail. */}
            <div className="furniture-detail-placeholder" role="img" aria-label="Placeholder for a close-up of a Heaven Furniture Mart furniture detail"><div className="detail-lines" aria-hidden="true" /><span>Detail study / 02</span></div>
            <div className="story-visual-note">Agrabad, Chattogram <span /> Established 2020</div>
          </motion.div>

          <div className="story-content">
            <motion.div variants={fadeUpVariant} className="story-kicker"><span className="kicker-number">01</span><span className="kicker-line" /><span>Brand story</span></motion.div>
            <motion.h2 variants={fadeUpVariant} className="story-title" id="brand-story-title">Furniture that<br />holds <em>your story.</em></motion.h2>
            <motion.blockquote variants={fadeUpVariant} className="founder-quote">“At Heaven Furniture Mart, we believe furniture is more than just function; it is a reflection of lifestyle, taste, and comfort.”<cite>— Abul Kalam Bhuiyan, Managing Director</cite></motion.blockquote>
            <motion.div variants={fadeUpVariant} className="story-narrative"><span className="story-accent-line" aria-hidden="true" /><p>Since our founding in 2020 in Agrabad, Chattogram, our philosophy has remained simple: true luxury is personal. We reject mass-produced catalog items in favor of bespoke craftsmanship, ensuring every piece is tailored to your exact dimensions, lifestyle, and aesthetic.</p></motion.div>
          </div>
        </div>
      </motion.section>

      <motion.section 
        className="value-section" 
        id="why-custom" 
        aria-labelledby="value-title"
        initial={prefersReducedMotion ? "show" : "hidden"}
        whileInView="show"
        viewport={{ once: true, margin: "-10%" }}
        variants={staggerContainer}
      >
        <div className="value-orbit" aria-hidden="true" />
        <motion.div variants={fadeUpVariant} className="page-container value-intro">
          <div className="value-kicker"><span className="kicker-number">02</span><span className="kicker-line" /><span>The Heaven standard</span></div>
          <div className="value-heading-row">
            <h2 id="value-title">Why <em>custom?</em></h2>
            <p>Because the pieces that stay with us should begin with the way we live. Four quiet promises shape every Heaven project.</p>
          </div>
        </motion.div>
        <div className="page-container value-matrix">
          <motion.article variants={fadeUpVariant} className="value-card">
            <div className="value-swatch swatch-oak" role="img" aria-label="Placeholder for a natural wood furniture detail"><span>SWATCH / 01</span></div>
            <div className="value-card-index">01</div>
            <h3>Fully Bespoke</h3>
            <p>Made to your exact dimensions and aesthetic preferences. Your home, your rules.</p>
            <span className="card-arrow"><ArrowUpRight size={16} strokeWidth={1.5} /></span>
          </motion.article>
          <motion.article variants={fadeUpVariant} className="value-card">
            <div className="value-swatch swatch-brass" role="img" aria-label="Placeholder for a brass and joinery furniture detail"><span>SWATCH / 02</span></div>
            <div className="value-card-index">02</div>
            <h3>In-House Artisanship</h3>
            <p>Premium woods, metals, and fabrics crafted by skilled artisans in our own workshop.</p>
            <span className="card-arrow"><ArrowUpRight size={16} strokeWidth={1.5} /></span>
          </motion.article>
          <motion.article variants={fadeUpVariant} className="value-card">
            <div className="value-swatch swatch-boucle" role="img" aria-label="Placeholder for a soft upholstery furniture detail"><span>SWATCH / 03</span></div>
            <div className="value-card-index">03</div>
            <h3>Turnkey Service</h3>
            <p>From complimentary design consultations to white-glove delivery and professional installation.</p>
            <span className="card-arrow"><ArrowUpRight size={16} strokeWidth={1.5} /></span>
          </motion.article>
          <motion.article variants={fadeUpVariant} className="value-card">
            <div className="value-swatch swatch-studio" role="img" aria-label="Placeholder for the Agrabad Experience Studio"><span>SWATCH / 04</span></div>
            <div className="value-card-index">04</div>
            <h3>Agrabad Experience Studio</h3>
            <p>Visit our physical space in Chattogram to touch, feel, and select your materials in person.</p>
            <span className="card-arrow"><ArrowUpRight size={16} strokeWidth={1.5} /></span>
          </motion.article>
        </div>
      </motion.section>

      <motion.section 
        className="collections-section" 
        id="collections" 
        aria-labelledby="collections-title"
        initial={prefersReducedMotion ? "show" : "hidden"}
        whileInView="show"
        viewport={{ once: true, margin: "-10%" }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeUpVariant} className="page-container collections-heading">
          <div className="collections-kicker"><span className="kicker-number">03</span><span className="kicker-line" /><span>Curated collections</span></div>
          <div className="collections-heading-row">
            <h2 id="collections-title">Curated for<br /><em>your space.</em></h2>
            <p>A considered edit of the pieces we return to — shaped by proportion, material, and the feeling of coming home.</p>
          </div>
        </motion.div>
        <div className="collections-scroller page-container" aria-label="Curated furniture collections">
          {collections.map((collection) => (
            <motion.button variants={fadeUpVariant} className="collection-card" type="button" key={collection.id} onClick={() => { setSelectedCollection(collection); setLightboxIndex(0); }} aria-label={`Explore ${collection.title} collection`}>
              <span className={`collection-image ${collection.image === "placeholder" ? `collection-placeholder placeholder-${collection.id}` : ""}`}>
                {collection.image === "placeholder" ? (
                  <>
                    <span className="collection-placeholder-label">Photography placeholder</span>
                  </>
                ) : <img src={collection.image} alt={collection.imageAlt} />}
                <span className="collection-overlay"><span>Explore category</span><ArrowUpRight size={16} strokeWidth={1.4} /></span>
              </span>
              <span className="collection-meta"><span className="collection-number">{collection.number}</span><span className="collection-title">{collection.title}</span></span>
              <span className="collection-items">{collection.items}</span>
            </motion.button>
          ))}
        </div>
      </motion.section>

      <motion.section 
        className="portfolio-section" 
        id="portfolio" 
        aria-labelledby="portfolio-title"
        initial={prefersReducedMotion ? "show" : "hidden"}
        whileInView="show"
        viewport={{ once: true, margin: "-10%" }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeUpVariant} className="page-container portfolio-heading">
          <div className="portfolio-kicker"><span className="kicker-number">04</span><span className="kicker-line" /><span>Featured projects</span></div>
          <div className="portfolio-heading-row">
            <h2 id="portfolio-title">Spaces transformed<br /><em>by design.</em></h2>
            <p>A selection of custom interiors tailored to the specific dimensions and aesthetics of our clients.</p>
          </div>
        </motion.div>
        <div className="portfolio-scroller page-container">
          <motion.div variants={fadeUpVariant} className="portfolio-card">
            <div className="portfolio-image-wrapper"><img src="/assets/portfolio_gulshan.png" alt="The Gulshan Residence" /></div>
            <div className="portfolio-meta">
              <h3>The Gulshan Residence</h3>
              <p>Complete living space tailored with Burma Teak and deep charcoal accents.</p>
            </div>
          </motion.div>
          <motion.div variants={fadeUpVariant} className="portfolio-card">
            <div className="portfolio-image-wrapper"><img src="/assets/portfolio_agrabad.png" alt="Agrabad Executive Suite" /></div>
            <div className="portfolio-meta">
              <h3>Agrabad Executive Suite</h3>
              <p>Bespoke bookshelves and leather seating for a high-end study.</p>
            </div>
          </motion.div>
          <motion.div variants={fadeUpVariant} className="portfolio-card">
            <div className="portfolio-image-wrapper"><img src="/assets/portfolio_banani.png" alt="Banani Penthouse" /></div>
            <div className="portfolio-meta">
              <h3>Banani Penthouse</h3>
              <p>A curated dining room featuring a solid wood statement table.</p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section 
        className="journey-section" 
        id="journey" 
        aria-labelledby="journey-title"
        initial={prefersReducedMotion ? "show" : "hidden"}
        whileInView="show"
        viewport={{ once: true, margin: "-10%" }}
        variants={staggerContainer}
      >
        <div className="journey-blueprint" aria-hidden="true" />
        <motion.div variants={fadeUpVariant} className="page-container journey-heading">
          <div className="journey-kicker"><span className="kicker-number">05</span><span className="kicker-line" /><span>How we build your vision</span></div>
          <div className="journey-heading-row"><h2 id="journey-title">The bespoke<br /><em>journey.</em></h2><p>From the first idea to the final placement, every project moves with intention. Here is how a room becomes unmistakably yours.</p></div>
        </motion.div>
        <div className="page-container journey-timeline">
          <div className="journey-line" aria-hidden="true" />
          <motion.article variants={fadeUpVariant} className="journey-step"><div className="journey-marker"><span>01</span></div><div className="journey-icon icon-consultation" aria-hidden="true"><i /><i /></div><div className="journey-copy"><span className="journey-step-label">First, we listen</span><h3>Consultation</h3><p>Share your vision, dimensions, and floor plans with our design experts.</p></div><div className="journey-number" aria-hidden="true">01</div></motion.article>
          <motion.article variants={fadeUpVariant} className="journey-step"><div className="journey-marker"><span>02</span></div><div className="journey-icon icon-materials" aria-hidden="true"><i /><i /><i /></div><div className="journey-copy"><span className="journey-step-label">Then, we compose</span><h3>3D Design &amp; Materials</h3><p>Select your premium wood finishes, fabrics, and metal hardware from our extensive library.</p></div><div className="journey-number" aria-hidden="true">02</div></motion.article>
          <motion.article variants={fadeUpVariant} className="journey-step"><div className="journey-marker"><span>03</span></div><div className="journey-icon icon-crafting" aria-hidden="true"><i /><i /></div><div className="journey-copy"><span className="journey-step-label">Made in Chattogram</span><h3>Precision Crafting</h3><p>Your piece is custom-built by our in-house master artisans right here in Chattogram.</p></div><div className="journey-number" aria-hidden="true">03</div></motion.article>
          <motion.article variants={fadeUpVariant} className="journey-step"><div className="journey-marker"><span>04</span></div><div className="journey-icon icon-installation" aria-hidden="true"><i /><i /><i /></div><div className="journey-copy"><span className="journey-step-label">Finally, we place it</span><h3>White-Glove Installation</h3><p>Delivered securely and installed perfectly in your home by our professional team.</p></div><div className="journey-number" aria-hidden="true">04</div></motion.article>
        </div>
      </motion.section>

      <motion.section 
        className="material-preview-section" 
        id="materials-preview" 
        aria-labelledby="materials-preview-title"
        initial={prefersReducedMotion ? "show" : "hidden"}
        whileInView="show"
        viewport={{ once: true, margin: "-10%" }}
        variants={staggerContainer}
      >
        <div className="material-preview-orbit" aria-hidden="true" />
        <div className="page-container material-preview-grid">
          <motion.div variants={fadeVariant} className={`material-preview-stage ${isMaterialChanging ? "is-changing" : ""}`}>
            <div className={`material-surface material-surface-previous ${previousMaterial.className}`} aria-hidden="true" />
            <div className={`material-surface material-surface-current ${selectedMaterial.className}`} aria-hidden="true" />
            <div className="material-stage-grid" aria-hidden="true" />
            <div className="material-stage-glow" aria-hidden="true" />
            <div className="material-sphere" aria-hidden="true"><span className="sphere-highlight" /></div>
            <div className="material-joint" aria-hidden="true"><span /><i /><b /></div>
            <div className="material-stage-label"><span>Material preview / live</span><strong>{selectedMaterial.name}</strong></div>
            <div className="material-stage-spec"><span>{selectedMaterial.group}</span><span>{selectedMaterial.detail}</span></div>
          </motion.div>
          <div className="material-preview-controls">
            <motion.div variants={fadeUpVariant} className="material-preview-kicker"><span className="kicker-number">06</span><span className="kicker-line" /><span>Material library</span></motion.div>
            <motion.h2 variants={fadeUpVariant} id="materials-preview-title">Crafted with<br /><em>uncompromising quality.</em></motion.h2>
            <motion.p variants={fadeUpVariant}>Choose from over 50+ premium upholstery and wood finish options.</motion.p>
            <motion.div variants={fadeUpVariant} className="material-groups">
              {["Wood", "Fabric"].map((group) => (
                <div className="material-group" key={group}>
                  <div className="material-group-label"><span>{group}</span><span>{group === "Wood" ? "04 finishes" : "03 finishes"}</span></div>
                  <div className="material-swatches" role="radiogroup" aria-label={`${group} materials`}>
                    {materials.filter((material) => material.group === group).map((material) => (
                      <button className={`material-swatch ${material.className} ${selectedMaterial.id === material.id ? "is-active" : ""}`} key={material.id} type="button" role="radio" aria-checked={selectedMaterial.id === material.id} aria-label={material.name} data-tooltip={material.name} onClick={() => selectMaterial(material)}>
                        {selectedMaterial.id === material.id && (
                          <motion.span layoutId="active-material" className="active-swatch-dot" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                        )}
                        {!selectedMaterial.id || selectedMaterial.id !== material.id ? <span /> : null}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
            <motion.div variants={fadeUpVariant} className="selected-material"><span>Selected finish</span><strong>{selectedMaterial.name}</strong><small>{selectedMaterial.detail}</small></motion.div>
          </div>
        </div>
      </motion.section>

      <motion.section 
        className="experience-section" 
        id="experience" 
        aria-labelledby="experience-title"
        initial={prefersReducedMotion ? "show" : "hidden"}
        whileInView="show"
        viewport={{ once: true, margin: "-10%" }}
        variants={staggerContainer}
      >
        <div className="experience-grain" aria-hidden="true" />
        <motion.div variants={fadeUpVariant} className="page-container experience-head">
          <div className="experience-kicker"><span className="kicker-number">07</span><span className="kicker-line" /><span>Experience &amp; trust</span></div>
          <div className="experience-heading-row"><h2 id="experience-title">Come closer.<br /><em>See the difference.</em></h2><p>A physical studio, a considered process, and a reputation built one carefully finished piece at a time.</p></div>
        </motion.div>
        <motion.div variants={fadeUpVariant} className="page-container showroom-panel">
          <div className="showroom-film">
            <div className="showroom-poster" style={{ backgroundImage: `url(${heroRoom})` }} role="img" aria-label="Placeholder poster for the Agrabad Experience Studio video"><div className="showroom-wash" /><div className="showroom-film-label"><span>Showroom film / coming soon</span><strong>Agrabad Experience Studio</strong></div><div className="showroom-play"><Play size={17} fill="currentColor" strokeWidth={1.2} /></div></div>
            <div className="showroom-caption"><span>Textures in person. Joinery under your hand.</span><span>Heaven / 006</span></div>
          </div>
          <div className="showroom-copy"><span className="showroom-eyebrow">Visit the studio</span><h3>Visit the Agrabad<br /><em>Experience Studio.</em></h3><p>Walk into our 5,000+ sq. ft. studio to feel the textures, inspect the joinery, and sit with our interior design consultants.</p><a className="directions-button" href="https://www.google.com/maps/search/?api=1&query=Agrabad%20Chattogram" target="_blank" rel="noreferrer"><MapPin size={15} strokeWidth={1.4} />Get showroom directions <ArrowUpRight size={14} strokeWidth={1.4} /></a></div>
        </motion.div>
        <motion.div variants={fadeUpVariant} className="page-container credibility-timeline">
          <div className="credibility-intro"><span className="showroom-eyebrow">A measured history</span><h3>Built over<br /><em>time.</em></h3></div>
          <div className="timeline-track" aria-label="Heaven Furniture Mart milestone timeline">
            <div className="timeline-line" aria-hidden="true" />
            <div className="timeline-node"><span>2020</span><i /><strong>Founded</strong><p>Agrabad, Chattogram</p></div>
            <div className="timeline-node"><span>2021</span><i /><strong>Showroom opened</strong><p>Experience Studio</p></div>
            <div className="timeline-node"><span>2025</span><i /><strong>Chamber member</strong><p>Verification pending</p></div>
            <div className="timeline-node"><span>2026</span><i /><strong>BFIOA recognition</strong><p>Verification pending</p></div>
          </div>
        </motion.div>
        <motion.div variants={fadeUpVariant} className="page-container trust-panel">
          <div className="trust-heading"><span className="showroom-eyebrow">Client stories</span><h3>Trust is<br /><em>felt.</em></h3><p>Verified homeowner stories and published project outcomes will live here once approved for release.</p></div>
          <div className="trust-carousel" aria-label="Verified client story placeholder">
            <div className="trust-track" style={{ transform: `translateX(-${trustSlide * 33.333}%)` }}>
              <article className="trust-card trust-card-placeholder"><span className="trust-card-index">01 / STORIES</span><div className="trust-quote-mark">“</div><p>Verified client story placeholder</p><span className="trust-card-foot">Awaiting approved quote and attribution</span></article>
              <article className="trust-card trust-card-placeholder"><span className="trust-card-index">02 / STORIES</span><div className="trust-quote-mark">“</div><p>Published project outcome placeholder</p><span className="trust-card-foot">Awaiting approved case study</span></article>
              <article className="trust-card trust-card-placeholder"><span className="trust-card-index">03 / STORIES</span><div className="trust-quote-mark">“</div><p>Homeowner experience placeholder</p><span className="trust-card-foot">Awaiting verified attribution</span></article>
            </div>
            <div className="trust-controls"><button type="button" aria-label="Previous client story" onClick={() => setTrustSlide((slide) => slide === 0 ? 2 : slide - 1)}><ArrowLeft size={15} /></button><span>{String(trustSlide + 1).padStart(2, "0")} — 03</span><button type="button" aria-label="Next client story" onClick={() => setTrustSlide((slide) => slide === 2 ? 0 : slide + 1)}><ArrowRight size={15} /></button></div>
          </div>
        </motion.div>
      </motion.section>

      <motion.section 
        className="contact-section" 
        id="contact" 
        aria-labelledby="contact-title"
        initial={prefersReducedMotion ? "show" : "hidden"}
        whileInView="show"
        viewport={{ once: true, margin: "-10%" }}
        variants={staggerContainer}
      >
        <div className="contact-arc" aria-hidden="true" />
        <div className="page-container contact-main">
          <motion.div variants={fadeUpVariant} className="contact-intro"><div className="contact-kicker"><span className="kicker-number">08</span><span className="kicker-line" /><span>Begin with a conversation</span></div><h2 id="contact-title">Let’s build<br /><em>your space.</em></h2><p>Request a complimentary design consultation or reach out to us directly.</p></motion.div>
          <motion.div variants={fadeUpVariant} className="contact-form-shell">
            {contactSubmitted ? <div className="contact-success"><span className="success-mark"><Check size={17} strokeWidth={1.5} /></span><span className="contact-eyebrow">Brief prepared</span><h3>Your brief is ready<br /><em>for the studio.</em></h3><p>This preview form is not connected to storage or email yet. For an immediate response, use the WhatsApp link below.</p><button type="button" className="contact-reset" onClick={() => { setContactSubmitted(false); setContactErrors({}); }}>Edit request <ArrowUpRight size={14} /></button></div> : <form onSubmit={handleContactSubmit} className="consultation-form" noValidate><label className={contactErrors.name ? "has-error" : ""}><span>Full name</span><input name="name" type="text" placeholder="Your name" aria-invalid={Boolean(contactErrors.name)} aria-describedby={contactErrors.name ? "contact-name-error" : undefined} onChange={() => handleContactFieldChange("name")} />{contactErrors.name && <small id="contact-name-error" className="field-error">{contactErrors.name}</small>}</label><label className={contactErrors.phone ? "has-error" : ""}><span>Phone / WhatsApp</span><input name="phone" type="tel" placeholder="+880 1xxx-xxxxxx" aria-invalid={Boolean(contactErrors.phone)} aria-describedby={contactErrors.phone ? "contact-phone-error" : undefined} onChange={() => handleContactFieldChange("phone")} />{contactErrors.phone && <small id="contact-phone-error" className="field-error">{contactErrors.phone}</small>}</label><label className={contactErrors.service ? "has-error" : ""}><span>Service interest</span><select name="service" defaultValue="" aria-invalid={Boolean(contactErrors.service)} aria-describedby={contactErrors.service ? "contact-service-error" : undefined} onChange={() => handleContactFieldChange("service")}><option value="" disabled>Select a service</option><option>Living Room</option><option>Full House</option><option>Custom Piece</option></select>{contactErrors.service && <small id="contact-service-error" className="field-error">{contactErrors.service}</small>}</label><button className="consultation-submit" type="submit">Request consultation <ArrowUpRight size={16} strokeWidth={1.4} /></button></form>}
            <a className="whatsapp-line" href={getWhatsAppLink()} target="_blank" rel="noreferrer"><MessageCircle size={16} strokeWidth={1.5} /><span>Prefer instant answers? <strong>Chat directly on WhatsApp</strong> <small>(+880 1960-481983)</small></span><ArrowUpRight size={14} strokeWidth={1.4} /></a>
          </motion.div>
        </div>
        <footer className="page-container contact-footer">
          <div className="footer-brand"><a className="brand-lockup" href="#top" aria-label="Heaven Furniture Mart home"><img className="brand-mark" src={archMark} alt="" /><span className="brand-name"><span>Heaven</span><small>Furniture Mart</small></span></a><p>Heaven Furniture Mart © 2026.<br />Designed. Crafted. Customized.</p></div>
          <div className="footer-location"><span className="footer-label">Visit the studio</span><p>Agrabad Access Road,<br />Chattogram, Bangladesh.<br /><small>Sat – Thu: 10:00 AM – 8:00 PM</small></p></div>
          <div className="footer-contact"><span className="footer-label">Stay in touch</span><a href="mailto:heavenfurnituremart@gmail.com"><Mail size={14} strokeWidth={1.4} />heavenfurnituremart@gmail.com</a><a href="tel:+8801960481983"><Phone size={14} strokeWidth={1.4} />+880 1960-481983</a><div className="social-links"><a href="#social-facebook" onClick={handleSocialPlaceholder} aria-label="Facebook profile placeholder"><Facebook size={16} /></a><a href="#social-instagram" onClick={handleSocialPlaceholder} aria-label="Instagram profile placeholder"><Instagram size={16} /></a><a href="#social-youtube" onClick={handleSocialPlaceholder} aria-label="YouTube profile placeholder"><Youtube size={16} /></a></div></div>
        </footer>
        <a className="mobile-whatsapp" href={getWhatsAppLink()} target="_blank" rel="noreferrer"><MessageCircle size={17} strokeWidth={1.6} />WhatsApp the studio</a>
      </motion.section>

      <AnimatePresence>
        {selectedCollection && (
          <motion.div 
            className="lightbox-backdrop" 
            role="presentation" 
            onMouseDown={() => setSelectedCollection(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="collection-lightbox" 
              role="dialog" 
              aria-modal="true" 
              aria-labelledby="collection-lightbox-title" 
              onMouseDown={(event) => event.stopPropagation()}
              variants={modalVariant}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              <button className="modal-close lightbox-close" type="button" aria-label="Close collection details" onClick={() => setSelectedCollection(null)}><X size={21} /></button>
              <div className={`lightbox-visual ${selectedCollection.image === "placeholder" ? `collection-placeholder placeholder-${selectedCollection.id}` : ""}`}>
                {selectedCollection.image === "placeholder" ? <span className="collection-placeholder-label">Photography placeholder</span> : <img src={selectedCollection.gallery[lightboxIndex]} alt={selectedCollection.imageAlt} />}
                {selectedCollection.gallery && selectedCollection.gallery.length > 1 && (
                  <div className="lightbox-nav">
                    <button type="button" onClick={(e) => { e.stopPropagation(); setLightboxIndex((prev) => (prev === 0 ? selectedCollection.gallery.length - 1 : prev - 1)); }} aria-label="Previous image"><ArrowLeft size={18} /></button>
                    <span>{lightboxIndex + 1} / {selectedCollection.gallery.length}</span>
                    <button type="button" onClick={(e) => { e.stopPropagation(); setLightboxIndex((prev) => (prev === selectedCollection.gallery.length - 1 ? 0 : prev + 1)); }} aria-label="Next image"><ArrowRight size={18} /></button>
                  </div>
                )}
              </div>
              <div className="lightbox-copy"><p className="section-eyebrow">Collection / {selectedCollection.number}</p><h2 id="collection-lightbox-title">{selectedCollection.title}<br /><em>in focus.</em></h2><p>{selectedCollection.items}</p><div className="spec-row"><span>Material study</span><strong>{selectedCollection.specs}</strong></div></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {quoteOpen && (
          <motion.div 
            className="modal-backdrop" 
            role="presentation" 
            onMouseDown={closeQuote}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="quote-modal" 
              role="dialog" 
              aria-modal="true" 
              aria-labelledby="quote-title" 
              onMouseDown={(event) => event.stopPropagation()}
              variants={modalVariant}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              <button className="modal-close" type="button" aria-label="Close quote form" onClick={closeQuote}><X size={21} /></button>
              {submitted ? (
                <div className="success-state"><span className="success-icon"><Check size={22} strokeWidth={1.6} /></span><p className="section-eyebrow">A note received</p><h2 id="quote-title">We’ll be in touch<br /><em>with care.</em></h2><p>Thank you for sharing the beginning of your space. Our studio will follow up shortly.</p><button className="line-link modal-link" type="button" onClick={closeQuote}>Close this note <X size={15} /></button></div>
              ) : (
                <><p className="section-eyebrow">Start a conversation</p><h2 id="quote-title">Let’s make room<br /><em>for your life.</em></h2><p className="modal-intro">Tell us where you are in the process. We’ll reply with a thoughtful next step.</p><form onSubmit={handleSubmit}><label><span>Your name</span><input name="name" type="text" placeholder="How should we call you?" required /></label><label><span>Email address</span><input name="email" type="email" placeholder="you@example.com" required /></label><label><span>What are you imagining?</span><textarea name="project" placeholder="A living room, a single piece, a whole new feeling..." rows={3} required /></label><button className="magnetic-button modal-submit" type="submit"><span>Send the note</span><span className="button-icon"><ArrowUpRight size={17} strokeWidth={1.5} /></span></button></form></>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
