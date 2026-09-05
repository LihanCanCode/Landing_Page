import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, Facebook, Instagram, Mail, MapPin, Menu, MessageCircle, MoveUpRight, Phone, Play, X, Youtube, Globe } from "lucide-react";
import { getWhatsAppLink } from "@shared/contact";
import { motion, AnimatePresence, useReducedMotion, Variants } from "framer-motion";
import { i18n } from "../i18n";
import RoomARPreview from "../components/RoomARPreview";
import FaqSection from "../components/FaqSection";

/**
 * Atelier Nocturne reminder: this page is intentionally limited to a cinematic Hero and a quiet,
 * furniture-led Brand Story. Keep the composition spacious, material-led, and easy to replace with
 * approved Heaven Furniture Mart photography later.
 */

const heroRoom = "/assets/hero_luxury_showroom.png";
const archMark = "/assets/heaven_emblem.png";

const getMaterials = (t: any) => [
  { id: "teak", group: t.matWood || "Wood", name: t.matTeakName || "Burma Teak", detail: t.matTeakDetail || "Warm honey grain / hand-finished", specs: { [t.specMoisture || "moisture"]: "10%", [t.specDensity || "density"]: "680 kg/m³", [t.specDurability || "durability"]: t.matTeakDur || "High Termite Resistance" }, className: "material-teak" },
  { id: "walnut", group: t.matWood || "Wood", name: t.matWalnutName || "Walnut", detail: t.matWalnutDetail || "Smoked umber grain / satin oil", specs: { [t.specMoisture || "moisture"]: "12%", [t.specDensity || "density"]: "610 kg/m³", [t.specDurability || "durability"]: t.matWalnutDur || "Medium Resistance" }, className: "material-walnut" },
  { id: "sheesham", group: t.matWood || "Wood", name: t.matSheeshamName || "Sheesham", detail: t.matSheeshamDetail || "Toasted rose grain / waxed", specs: { [t.specMoisture || "moisture"]: "8%", [t.specDensity || "density"]: "770 kg/m³", [t.specDurability || "durability"]: t.matSheeshamDur || "Ultra High Durability" }, className: "material-sheesham" },
  { id: "black", group: t.matWood || "Wood", name: t.matBlackName || "Matte Black Lacquer", detail: t.matBlackDetail || "Deep charcoal / soft-touch", specs: { [t.specMoisture || "moisture"]: "10%", [t.specDensity || "density"]: "650 kg/m³", [t.specDurability || "durability"]: t.matBlackDur || "Scratch-Resistant Coat" }, className: "material-black" },
  { id: "velvet", group: t.matFabric || "Fabric", name: t.matVelvetName || "Premium Velvet", detail: t.matVelvetDetail || "Parchment pile / low sheen", specs: { [t.specRub || "rubCount"]: "40,000+", [t.specComp || "comp"]: "100% Polyester", [t.specCare || "care"]: t.matVelvetCare || "Professional Dry Clean" }, className: "material-velvet" },
  { id: "leather", group: t.matFabric || "Fabric", name: t.matLeatherName || "Genuine Leather", detail: t.matLeatherDetail || "Cognac hide / natural patina", specs: { [t.specRub || "rubCount"]: t.matLeatherRub || "Full Grain", [t.specComp || "comp"]: "100% Bovine", [t.specCare || "care"]: t.matLeatherCare || "Wax Polish Bi-Annually" }, className: "material-leather" },
  { id: "linen", group: t.matFabric || "Fabric", name: t.matLinenName || "Linen", detail: t.matLinenDetail || "Oat weave / relaxed hand", specs: { [t.specRub || "rubCount"]: "30,000+", [t.specComp || "comp"]: "60% Linen, 40% Cotton", [t.specCare || "care"]: t.matLinenCare || "Spot Clean Only" }, className: "material-linen" },
];

const getSectionLabels = (t: any): Record<string, string> => ({
  top: t.navTop || "The studio",
  story: t.navStory,
  "why-custom": t.navStandard,
  collections: t.navCollections,
  portfolio: t.navPortfolio,
  journey: t.navJourney,
  "materials-preview": t.navMaterials,
  experience: t.navExperience,
  "ar-preview": t.navAR,
  faq: t.navFAQ,
  contact: t.navContact,
});

const getCollections = (t: any) => [
  { id: "living", category: "Seating", number: "01", title: t.colLiving || "Living", items: t.colLivingItems || "Modular sofas · Marble-top coffee tables · Luxury TV consoles", specs: "Burma Teak / honed marble / natural boucle", price: "৳ 1,20,000", image: "/assets/collection-living.jpg", gallery: ["/assets/collection-living.jpg", "/assets/living2.jpg", "/assets/living3.jpg", "/assets/living4.jpg", "/assets/modern sofa set.jpg", "/assets/Sofa.jpg"], imageAlt: "Heaven Furniture Mart luxury carved sofa — Living collection" },
  { id: "bedroom", category: "Beds", number: "02", title: t.colBedroom || "Bedroom", items: t.colBedroomItems || "Upholstered beds · Custom wardrobes · Vanity dressers", specs: "Linen boucle / smoked oak / aged brass", price: "৳ 1,80,000", image: "/assets/collection-bedroom.jpg", gallery: ["/assets/collection-bedroom.jpg", "/assets/Bedroom2.jpg", "/assets/bed_1.jpg", "/assets/bed_2.jpg", "/assets/bed_3.jpg"], imageAlt: "Heaven Furniture Mart ornate carved bed — Bedroom collection" },
  { id: "dining", category: "Dining", number: "03", title: t.colDining || "Dining", items: t.colDiningItems || "Solid wood tables · Handcrafted chairs · Credenzas", specs: "Burma Teak / saddle leather / Studio Brass", price: "৳ 1,50,000", image: "/assets/collection-dining.jpg", gallery: ["/assets/collection-dining.jpg", "/assets/chair and table.jpg", "/assets/table_1.jpg"], imageAlt: "Heaven Furniture Mart marble top dining set — Dining collection" },
  { id: "office", category: "Workspace", number: "04", title: t.colOffice || "Office & Executive", items: t.colOfficeItems || "Bespoke desks · Library walls · Conference tables", specs: "Smoked oak / Italian marble / brushed metal", price: "৳ 95,000", image: "/assets/collection-office.jpg", gallery: ["/assets/collection-office.jpg", "/assets/office2.jpg", "/assets/office3.jpg", "/assets/office4.jpg", "/assets/office chair_1.jpg", "/assets/office_chair_2.jpg", "/assets/office chair_3.jpg"], imageAlt: "Heaven Furniture Mart executive leather office chair — Office collection" },
  { id: "storage", category: "Storage", number: "05", title: t.colStorage || "Storage & Wardrobes", items: t.colStorageItems || "Bespoke Almirahs · Walk-in closets · Sideboards", specs: "Solid Teak / Brass Handles", price: "৳ 85,000", image: "/assets/Almirah.jpg", gallery: ["/assets/Almirah.jpg", "/assets/almirah_2.jpg"], imageAlt: "Luxury solid wood almirah" },
  { id: "accent", category: "Seating", number: "06", title: t.colAccent || "Accent Chairs", items: t.colAccentItems || "Lounge chairs · Occasional seating", specs: "Premium Velvet / Walnut frame", price: "৳ 35,000", image: "/assets/full room.jpg", gallery: ["/assets/full room.jpg", "/assets/largeroom.jpg"], imageAlt: "Accent lounge chair" },
  { id: "decor", category: "Decor", number: "07", title: t.colDecor || "Mirrors & Decor", items: t.colDecorItems || "Statement mirrors · Wall accents · Decorative pieces", specs: "Bevelled glass / Brass frame", price: "৳ 25,000", image: "/assets/Mirror.jpg", gallery: ["/assets/Mirror.jpg", "/assets/mirror2.jpg"], imageAlt: "Ornate brass-framed mirror" },
  { id: "others", category: "Others", number: "08", title: t.colOthers || "Others", items: t.colOthersItems || "Swings & jhulas · Specialty pieces · More on request", specs: "Mixed materials / Custom finishes", price: t.priceOnRequest || "Price on request", image: "/assets/dolna.jpg", gallery: ["/assets/dolna.jpg", "/assets/dolna 2.jpg"], imageAlt: "Custom furniture piece" }
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

const timelineNodeVariant: Variants = {
  hidden: { opacity: 0, x: -30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const awardVariant: Variants = {
  hidden: { opacity: 0, scale: 0.9, x: 10 },
  show: { opacity: 1, scale: 1, x: 0, transition: { duration: 0.7, type: "spring", bounce: 0.3 } }
};

export default function Home() {
  const prefersReducedMotion = useReducedMotion();
  const [lang, setLang] = useState<'en' | 'bn'>('en');
  const t = i18n[lang];
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.documentElement.className = `lang-${lang}`;
  }, [lang]);
  const [activeSection, setActiveSection] = useState("top");
  const [menuOpen, setMenuOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [trustSlide, setTrustSlide] = useState(0);
  const [contactSubmitted, setContactSubmitted] = useState(() => typeof window !== "undefined" && new URLSearchParams(window.location.search).get("contact") === "preview-success");
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({});
  const [collectionFilter, setCollectionFilter] = useState("All");
  const [collectionSearch, setCollectionSearch] = useState("");
  const collections = getCollections(t);

  const filteredCollections = collections.filter(c => {
    if (collectionFilter !== "All" && c.category !== collectionFilter) return false;
    if (collectionSearch.trim() && !c.title.toLowerCase().includes(collectionSearch.toLowerCase())) return false;
    return true;
  });

  const [catalogSlide, setCatalogSlide] = useState(0);
  const catalogGridRef = useRef<HTMLDivElement>(null);
  const catalogScrollTimeout = useRef<number | null>(null);

  const materials = getMaterials(t);
  const sectionLabels = getSectionLabels(t);

  const [selectedCollection, setSelectedCollection] = useState<(typeof collections)[number] | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [selectedMaterial, setSelectedMaterial] = useState(materials[0]);
  const [previousMaterial, setPreviousMaterial] = useState(materials[0]);
  const [isMaterialChanging, setIsMaterialChanging] = useState(false);
  const [estRoom, setEstRoom] = useState("Living");
  const [estMaterial, setEstMaterial] = useState("Teak");
  const [estScale, setEstScale] = useState(2);
  const [isNightMode, setIsNightMode] = useState(false);
  const [isXrayMode, setIsXrayMode] = useState(false);
  const [heroSlide, setHeroSlide] = useState(0);
  const [valueSlide, setValueSlide] = useState(0);
  const valueMatrixRef = useRef<HTMLDivElement>(null);
  const valueScrollTimeout = useRef<number | null>(null);

  const roomVideos = [
    "/assets/premium furnitures - Trim.mp4",
    "/assets/premium room.mp4",
    "/assets/premium office.mp4"
  ];
  const [roomVideoIdx, setRoomVideoIdx] = useState(0);

  const stageRef = useRef<HTMLDivElement>(null);
  const quoteButtonRef = useRef<HTMLButtonElement>(null);

  const getEstimate = () => {
    let base = estRoom === "Living" ? 150000 : estRoom === "Bedroom" ? 120000 : 180000;
    let matMult = estMaterial === "Teak" ? 1.5 : estMaterial === "Walnut" ? 1.3 : 1.0;
    let scaleMult = estScale === 1 ? 0.8 : estScale === 3 ? 1.4 : 1.0;
    return (base * matMult * scaleMult).toLocaleString();
  };

  useEffect(() => {
    const revealDelay = prefersReducedMotion ? 220 : 450;
    const entrance = window.setTimeout(() => {
      setIsReady(true);
      setIsLoading(false);
    }, revealDelay);
    return () => window.clearTimeout(entrance);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const timer = setInterval(() => {
      setHeroSlide(prev => (prev === 2 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const timer = setInterval(() => {
      setValueSlide(prev => (prev === 5 ? 0 : prev + 1));
    }, 3500);
    return () => clearInterval(timer);
  }, [prefersReducedMotion]);

  useEffect(() => {
    const container = valueMatrixRef.current;
    const card = container?.children[valueSlide] as HTMLElement | undefined;
    if (!container || !card) return;
    container.scrollTo({ left: card.offsetLeft, behavior: prefersReducedMotion ? "auto" : "smooth" });
  }, [valueSlide, prefersReducedMotion]);

  const handleValueScroll = () => {
    const container = valueMatrixRef.current;
    if (!container) return;
    if (valueScrollTimeout.current) window.clearTimeout(valueScrollTimeout.current);
    valueScrollTimeout.current = window.setTimeout(() => {
      const containerRect = container.getBoundingClientRect();
      let closest = 0;
      let closestDist = Infinity;
      Array.from(container.children).forEach((child, idx) => {
        const dist = Math.abs(child.getBoundingClientRect().left - containerRect.left);
        if (dist < closestDist) {
          closestDist = dist;
          closest = idx;
        }
      });
      setValueSlide(closest);
    }, 120);
  };

  useEffect(() => {
    setCatalogSlide(0);
  }, [filteredCollections.length]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (filteredCollections.length <= 1) return;
    const timer = setInterval(() => {
      setCatalogSlide(prev => (prev === filteredCollections.length - 1 ? 0 : prev + 1));
    }, 3500);
    return () => clearInterval(timer);
  }, [prefersReducedMotion, filteredCollections.length]);

  useEffect(() => {
    const container = catalogGridRef.current;
    const card = container?.children[catalogSlide] as HTMLElement | undefined;
    if (!container || !card) return;
    container.scrollTo({ left: card.offsetLeft, behavior: prefersReducedMotion ? "auto" : "smooth" });
  }, [catalogSlide, prefersReducedMotion]);

  useEffect(() => {
    const container = catalogGridRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (catalogScrollTimeout.current) window.clearTimeout(catalogScrollTimeout.current);
      catalogScrollTimeout.current = window.setTimeout(() => {
        const containerRect = container.getBoundingClientRect();
        let closest = 0;
        let closestDist = Infinity;
        Array.from(container.children).forEach((child, idx) => {
          const dist = Math.abs(child.getBoundingClientRect().left - containerRect.left);
          if (dist < closestDist) {
            closestDist = dist;
            closest = idx;
          }
        });
        setCatalogSlide(closest);
      }, 120);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const timer = setInterval(() => {
      setTrustSlide(prev => (prev === 2 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [prefersReducedMotion]);

  useEffect(() => {
    const updatePageChrome = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      document.documentElement.style.setProperty("--scroll-progress", `${progress}%`);

      const sectionIds = ["top", "story", "why-custom", "collections", "portfolio", "journey", "materials-preview", "experience", "ar-preview", "faq", "contact"];
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
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
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

      <div className="sticky-header-wrapper">
        <header className="site-header page-container">
          <a className="brand-lockup" href="#top" aria-label="Heaven Furniture Mart home">
            <img className="brand-mark" src={archMark} alt="" />
            <span className="brand-name"><span>Heaven</span><small>Furniture Mart</small></span>
          </a>
          <nav className={`desktop-nav ${menuOpen ? "is-open" : ""}`} aria-label="Primary navigation">
            <a className={activeSection === "story" ? "is-active" : ""} href="#story" onClick={handleNavClick} aria-current={activeSection === "story" ? "page" : undefined}>{t.navStory}</a>
            <a className={activeSection === "why-custom" ? "is-active" : ""} href="#why-custom" onClick={handleNavClick} aria-current={activeSection === "why-custom" ? "page" : undefined}>{t.navStandard}</a>
            <a className={activeSection === "collections" ? "is-active" : ""} href="#collections" onClick={handleNavClick} aria-current={activeSection === "collections" ? "page" : undefined}>{t.navCollections}</a>
            <a className={activeSection === "portfolio" ? "is-active" : ""} href="#portfolio" onClick={handleNavClick} aria-current={activeSection === "portfolio" ? "page" : undefined}>{t.navPortfolio}</a>
            <a className={activeSection === "journey" ? "is-active" : ""} href="#journey" onClick={handleNavClick} aria-current={activeSection === "journey" ? "page" : undefined}>{t.navJourney}</a>
            <a className={activeSection === "materials-preview" ? "is-active" : ""} href="#materials-preview" onClick={handleNavClick} aria-current={activeSection === "materials-preview" ? "page" : undefined}>{t.navMaterials}</a>
            <a className={activeSection === "experience" ? "is-active" : ""} href="#experience" onClick={handleNavClick} aria-current={activeSection === "experience" ? "page" : undefined}>{t.navExperience}</a>
            <a className={activeSection === "ar-preview" ? "is-active" : ""} href="#ar-preview" onClick={handleNavClick} aria-current={activeSection === "ar-preview" ? "page" : undefined}>{t.navAR}</a>
            <a className={activeSection === "faq" ? "is-active" : ""} href="#faq" onClick={handleNavClick} aria-current={activeSection === "faq" ? "page" : undefined}>{t.navFAQ}</a>
            <a className={activeSection === "contact" ? "is-active" : ""} href="#contact" onClick={handleNavClick} aria-current={activeSection === "contact" ? "page" : undefined}>{t.navContact}</a>
          </nav>
          <div className="mobile-section-context" aria-live="polite"><span className="mobile-section-context-line" /><span>{sectionLabels[activeSection] ?? "The studio"}</span><span className="mobile-section-context-index">{activeSection === "top" ? "00" : String(["story", "why-custom", "collections", "portfolio", "journey", "materials-preview", "experience", "ar-preview", "faq", "contact"].indexOf(activeSection) + 1).padStart(2, "0")}</span></div>
          <div className="header-actions">
            <button className="lang-toggle" type="button" onClick={() => setLang(lang === 'en' ? 'bn' : 'en')} aria-label="Toggle language">
              <Globe size={15} /> {lang === 'en' ? 'BN' : 'EN'}
            </button>
            <button className="header-quote" type="button" onClick={openQuote}>{t.heroBtnQuote} <ArrowUpRight size={15} strokeWidth={1.7} /></button>
            <button className="menu-toggle" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((current) => !current)}>
              {menuOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </header>
      </div>

      <section className="hero-section" id="top">
        <div className="hero-backdrop" aria-hidden="true" />
        <div className="hero-grid-lines" aria-hidden="true" />


        <div className="hero-content page-container">
          <div className="hero-copy-column">
            <div className="eyebrow reveal-item reveal-one"><span className="eyebrow-rule" /><span>{t.heroKicker}</span></div>
            <h1 className="hero-title reveal-item reveal-two">{t.heroTitle1}<br />{t.heroTitle2} <em>{t.heroTitle3}</em><br />{t.heroTitle4}<span className="title-period">.</span></h1>
            <p className="hero-description reveal-item reveal-three">{t.heroDesc}</p>
            <div className="hero-actions reveal-item reveal-four">
              <button className="magnetic-button" ref={quoteButtonRef} type="button" onClick={openQuote} onPointerMove={handleQuoteButtonMove} onPointerLeave={resetQuoteButton}>
                <span>{t.heroBtnQuote}</span><span className="button-icon"><ArrowUpRight size={17} strokeWidth={1.5} /></span>
              </button>
              <a className="text-link" href="#story">{t.heroBtnStory} <MoveUpRight size={15} strokeWidth={1.5} /></a>
            </div>
            <div className="hero-footnote reveal-item reveal-five"><span>01</span><span className="footnote-line" /><span>{t.heroFootnote}</span></div>
          </div>

          <div className="hero-visual reveal-item reveal-visual" ref={stageRef} onPointerMove={handleStageMove} onPointerLeave={handleStageLeave}>
            <div className="visual-topline" aria-hidden="true"><span>Room study / 01</span><span>29° 51' N / 91° 52' E</span></div>
            <div className={`room-frame ${isNightMode ? 'night-mode' : ''}`}>
              <div className="room-media">
                <img src="/assets/hero_luxury_showroom.png" alt="Executive Lounge in dark teal" className={`hero-slide-img ${heroSlide === 0 ? 'is-active' : ''}`} />
                <img src="/assets/brand-story-main.png" alt="Atelier Dining Room in charcoal slate" className={`hero-slide-img ${heroSlide === 1 ? 'is-active' : ''}`} />
                <img src="/assets/hero-bed.jpg" alt="Sanctuary Bedroom with ambient lighting" className={`hero-slide-img ${heroSlide === 2 ? 'is-active' : ''}`} />
                <div className="room-wash" aria-hidden="true" />
                <div className="light-leak" aria-hidden="true" />
                <div className="night-overlay" aria-hidden="true" />
              </div>
              <div className="cad-overlay" aria-hidden="true">
                <div className="cad-line cad-h" />
                <div className="cad-line cad-v" />
                <span className="cad-measure cad-top">W: 4200MM</span>
                <span className="cad-measure cad-left">H: 2800MM</span>
                <span className="cad-crosshair ch-1" />
                <span className="cad-crosshair ch-2" />
                <span className="cad-crosshair ch-3" />
                <span className="cad-crosshair ch-4" />
              </div>
              <div className="glass-lens" aria-hidden="true"><span>soft forms</span><span>hard lines</span></div>
              <div className="room-caption"><span>Quiet forms, considered living.</span><span>Scroll to enter <ArrowDown size={15} strokeWidth={1.4} /></span></div>
            </div>

            <div className="visual-side-label" aria-hidden="true">HEAVEN / 001</div><span className="visual-corner corner-tl" aria-hidden="true" /><span className="visual-corner corner-br" aria-hidden="true" />
          </div>
        </div>
        <div className="hero-scroll page-container"><a href="#story" className="scroll-prompt"><span className="scroll-dot" /><span>Enter the studio</span></a><span className="scroll-index">Chattogram · 2026</span></div>
      </section>

      <div className="marquee-container" aria-hidden="true">
        <div className="marquee-content">
          <span>{t.marquee}</span>
          <span>{t.marquee}</span>
        </div>
      </div>

      <motion.section
        className="brand-story-section option-c-split"
        id="story"
        aria-labelledby="brand-story-title"
      >
        <div className="page-container split-story-container">
          <div className="split-story-gallery">
            <div className="gallery-item">
              <video autoPlay muted loop playsInline className="gallery-video">
                <source src="/assets/crafting.mp4" type="video/mp4" />
              </video>
              <div className="gallery-caption"><span>Atelier crafting / 01</span><strong>Master Artisans</strong></div>
            </div>

            <div className="gallery-item video-carousel-wrapper">
              <video
                autoPlay
                muted
                playsInline
                className="gallery-video"
                src={roomVideos[roomVideoIdx]}
                onEnded={() => setRoomVideoIdx((prev) => (prev + 1) % roomVideos.length)}
              />
              <div className="gallery-caption">
                <span>Premium Rooms / 0{roomVideoIdx + 1}</span>
                <strong>The Collection</strong>
              </div>
              <div className="video-carousel-controls">
                <button type="button" aria-label="Previous video" onClick={() => setRoomVideoIdx((prev) => prev === 0 ? roomVideos.length - 1 : prev - 1)}>
                  <ArrowLeft size={18} />
                </button>
                <button type="button" aria-label="Next video" onClick={() => setRoomVideoIdx((prev) => (prev + 1) % roomVideos.length)}>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
            <motion.div
              initial={prefersReducedMotion ? "show" : "hidden"}
              whileInView="show"
              viewport={{ once: true, margin: "-10%" }}
              variants={fadeUpVariant}
              style={{ display: 'flex', justifyContent: 'center', marginTop: '60px' }}
            >
              <a href="#collections" className="btn-teal-shadow">
                See our catalogue <ArrowUpRight size={14} strokeWidth={1.5} />
              </a>
            </motion.div>
          </div>

          <div className="split-story-sticky">
            <motion.div
              initial={prefersReducedMotion ? "show" : "hidden"}
              whileInView="show"
              viewport={{ once: true, margin: "-10%" }}
              variants={staggerContainer}
              className="story-content"
            >
              <motion.div variants={fadeUpVariant} className="story-kicker"><span className="kicker-number">01</span><span className="kicker-line" /><span>{t.brandKicker}</span></motion.div>
              <motion.h2 variants={fadeUpVariant} className="story-title" id="brand-story-title">{t.brandTitle.split(' ')[0]} {t.brandTitle.split(' ')[1]}<br /><em>{t.brandTitle.split(' ').slice(2).join(' ')}</em></motion.h2>
              <motion.blockquote variants={fadeUpVariant} className="founder-quote">{t.brandQuote}<span className="closing-quote">”</span><cite>{t.brandQuoteAuthor}</cite></motion.blockquote>
              <motion.div variants={fadeUpVariant} className="story-narrative"><span className="story-accent-line" aria-hidden="true" /><p>{t.brandDesc}</p></motion.div>
            </motion.div>
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
          <div className="value-kicker"><span className="kicker-number">02</span><span className="kicker-line" /><span>{t.valueKicker}</span></div>
          <div className="value-heading-row">
            <h2 id="value-title">{t.valueTitle.split(' ')[0]} <em>{t.valueTitle.split(' ').slice(1).join(' ')}</em></h2>
            <p>{t.valueDesc}</p>
          </div>
        </motion.div>
        <div className="page-container value-matrix" ref={valueMatrixRef} onScroll={handleValueScroll}>
          <motion.article variants={fadeUpVariant} className="value-card">
            <div className="value-swatch swatch-oak" role="img" aria-label="Placeholder for a natural wood furniture detail"><span>SWATCH / 01</span></div>
            <div className="value-card-index">01</div>
            <h3>{t.value1Title}</h3>
            <p>{t.value1Desc}</p>
            <span className="card-arrow"><ArrowUpRight size={16} strokeWidth={1.5} /></span>
          </motion.article>
          <motion.article variants={fadeUpVariant} className="value-card">
            <div className="value-swatch swatch-brass" role="img" aria-label="Placeholder for a brass and joinery furniture detail"><span>SWATCH / 02</span></div>
            <div className="value-card-index">02</div>
            <h3>{t.value2Title}</h3>
            <p>{t.value2Desc}</p>
            <span className="card-arrow"><ArrowUpRight size={16} strokeWidth={1.5} /></span>
          </motion.article>
          <motion.article variants={fadeUpVariant} className="value-card">
            <div className="value-swatch swatch-studio" role="img" aria-label="Placeholder for the Agrabad Experience Studio"><span>SWATCH / 03</span></div>
            <div className="value-card-index">03</div>
            <h3>{t.value3Title}</h3>
            <p>{t.value3Desc}</p>
            <span className="card-arrow"><ArrowUpRight size={16} strokeWidth={1.5} /></span>
          </motion.article>
          <motion.article variants={fadeUpVariant} className="value-card">
            <div className="value-swatch swatch-boucle" role="img" aria-label="Placeholder for design consultation"><span>SWATCH / 04</span></div>
            <div className="value-card-index">04</div>
            <h3>{t.value4Title}</h3>
            <p>{t.value4Desc}</p>
            <span className="card-arrow"><ArrowUpRight size={16} strokeWidth={1.5} /></span>
          </motion.article>
          <motion.article variants={fadeUpVariant} className="value-card">
            <div className="value-swatch swatch-oak" style={{ filter: "hue-rotate(45deg)" }} role="img" aria-label="Placeholder for turnkey service"><span>SWATCH / 05</span></div>
            <div className="value-card-index">05</div>
            <h3>{t.value5Title}</h3>
            <p>{t.value5Desc}</p>
            <span className="card-arrow"><ArrowUpRight size={16} strokeWidth={1.5} /></span>
          </motion.article>
          <motion.article variants={fadeUpVariant} className="value-card">
            <div className="value-swatch swatch-brass" style={{ filter: "hue-rotate(90deg)" }} role="img" aria-label="Placeholder for flexible payments"><span>SWATCH / 06</span></div>
            <div className="value-card-index">06</div>
            <h3>{t.value6Title}</h3>
            <p>{t.value6Desc}</p>
            <span className="card-arrow"><ArrowUpRight size={16} strokeWidth={1.5} /></span>
          </motion.article>
        </div>
        <div className="value-dots" role="tablist" aria-label="Heaven Standard slides">
          {[0, 1, 2, 3, 4, 5].map((idx) => (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={valueSlide === idx}
              aria-label={`Show standard ${idx + 1}`}
              className={`value-dot ${valueSlide === idx ? "is-active" : ""}`}
              onClick={() => setValueSlide(idx)}
            />
          ))}
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
          <div className="collections-kicker"><span className="kicker-number">03</span><span className="kicker-line" /><span>{t.collectionKicker}</span></div>
          <div className="collections-heading-row">
            <h2 id="collections-title">{t.collectionTitle.split(' ')[0]} {t.collectionTitle.split(' ')[1]}<br /><em>{t.collectionTitle.split(' ').slice(2).join(' ')}</em></h2>
            <p>{t.collectionDesc}</p>
          </div>
        </motion.div>
        <motion.div variants={fadeUpVariant} className="page-container catalog-toolbar dynamic-scroller-toolbar" style={{ marginTop: '20px', marginBottom: '10px', borderBottom: 'none', paddingBottom: '0' }}>
          <div className="catalog-search" style={{ marginLeft: 'auto' }}>
            <input
              type="text"
              placeholder="Search catalog..."
              value={collectionSearch}
              onChange={(e) => setCollectionSearch(e.target.value)}
              style={{ width: '300px' }}
            />
          </div>
        </motion.div>

        <motion.div variants={fadeUpVariant} className="collections-grid-2row page-container" aria-label="Curated furniture collections" ref={catalogGridRef}>
          <AnimatePresence mode="popLayout">
            {filteredCollections.map((collection) => (
              <motion.button
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="collection-card" type="button" key={collection.id} onClick={() => { setSelectedCollection(collection); setLightboxIndex(0); }} aria-label={`Explore ${collection.title} collection`}
              >
                <span className={`collection-image ${collection.image === "placeholder" ? `collection-placeholder placeholder-${collection.id}` : ""}`}>
                  {collection.image === "placeholder" ? (
                    <>
                      <span className="collection-placeholder-label">Photography placeholder</span>
                    </>
                  ) : <img src={collection.image} alt={collection.imageAlt} />}
                  <span className="collection-overlay"><span>Explore category</span><ArrowUpRight size={16} strokeWidth={1.4} /></span>
                </span>
                <span className="collection-meta">
                  <span className="collection-title-row">
                    <span className="collection-number">{collection.number}</span>
                    <span className="collection-title">{collection.title}</span>
                  </span>
                  <span className="collection-price">Starts at {collection.price}</span>
                </span>
                <span className="collection-items">{collection.items}</span>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="collections-dots" role="tablist" aria-label="Collection slides">
          {filteredCollections.map((collection, idx) => (
            <button
              key={collection.id}
              type="button"
              role="tab"
              aria-selected={catalogSlide === idx}
              aria-label={`Show ${collection.title} collection`}
              className={`collections-dot ${catalogSlide === idx ? "is-active" : ""}`}
              onClick={() => setCatalogSlide(idx)}
            />
          ))}
        </div>

        <motion.div variants={fadeUpVariant} style={{ display: 'flex', justifyContent: 'center', marginTop: '60px' }}>
          <a href="#materials-preview" className="btn-teal-shadow">
            Choose your material <ArrowUpRight size={14} strokeWidth={1.5} />
          </a>
        </motion.div>
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
          <div className="portfolio-kicker"><span className="kicker-number">04</span><span className="kicker-line" /><span>{t.portfolioKicker}</span></div>
          <div className="portfolio-heading-row">
            <h2 id="portfolio-title">{t.portfolioTitle.split(' ')[0]} {t.portfolioTitle.split(' ')[1]}<br /><em>{t.portfolioTitle.split(' ').slice(2).join(' ')}</em></h2>
            <p>{t.portfolioDesc}</p>
          </div>
        </motion.div>
        <div className="portfolio-scroller page-container">
          <motion.div variants={fadeUpVariant} className="portfolio-card">
            <div className="portfolio-image-wrapper"><img src="/assets/portfolio_gulshan.png" alt="The Gulshan Residence" /></div>
            <div className="portfolio-meta">
              <h3>{t.portfolio1Title}</h3>
              <p>{t.portfolio1Desc}</p>
            </div>
          </motion.div>
          <motion.div variants={fadeUpVariant} className="portfolio-card">
            <div className="portfolio-image-wrapper"><img src="/assets/portfolio_agrabad.png" alt="Agrabad Executive Suite" /></div>
            <div className="portfolio-meta">
              <h3>{t.portfolio2Title}</h3>
              <p>{t.portfolio2Desc}</p>
            </div>
          </motion.div>
          <motion.div variants={fadeUpVariant} className="portfolio-card">
            <div className="portfolio-image-wrapper"><img src="/assets/portfolio_banani.png" alt="Banani Penthouse" /></div>
            <div className="portfolio-meta">
              <h3>{t.portfolio3Title}</h3>
              <p>{t.portfolio3Desc}</p>
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
          <div className="journey-kicker"><span className="kicker-number">05</span><span className="kicker-line" /><span>{t.journeyKicker}</span></div>
          <div className="journey-heading-row"><h2 id="journey-title">{t.journeyTitle.split(' ')[0]}<br /><em>{t.journeyTitle.split(' ').slice(1).join(' ')}</em></h2><p>{t.journeyDesc}</p></div>
        </motion.div>
        <div className="page-container journey-timeline">
          <div className="journey-line" aria-hidden="true" />
          <motion.article variants={fadeUpVariant} className="journey-step"><div className="journey-marker"><span>01</span></div><div className="journey-icon icon-consultation" aria-hidden="true"><i /><i /></div><div className="journey-copy"><span className="journey-step-label">{t.step1Label}</span><h3>{t.step1Title}</h3><p>{t.step1Desc}</p></div><div className="journey-number" aria-hidden="true">01</div></motion.article>
          <motion.article variants={fadeUpVariant} className="journey-step"><div className="journey-marker"><span>02</span></div><div className="journey-icon icon-materials" aria-hidden="true"><i /><i /><i /></div><div className="journey-copy"><span className="journey-step-label">{t.step2Label}</span><h3>{t.step2Title}</h3><p>{t.step2Desc}</p></div><div className="journey-number" aria-hidden="true">02</div></motion.article>
          <motion.article variants={fadeUpVariant} className="journey-step"><div className="journey-marker"><span>03</span></div><div className="journey-icon icon-crafting" aria-hidden="true"><i /><i /></div><div className="journey-copy"><span className="journey-step-label">{t.step3Label}</span><h3>{t.step3Title}</h3><p>{t.step3Desc}</p></div><div className="journey-number" aria-hidden="true">03</div></motion.article>
          <motion.article variants={fadeUpVariant} className="journey-step"><div className="journey-marker"><span>04</span></div><div className="journey-icon icon-installation" aria-hidden="true"><i /><i /><i /></div><div className="journey-copy"><span className="journey-step-label">{t.step4Label}</span><h3>{t.step4Title}</h3><p>{t.step4Desc}</p></div><div className="journey-number" aria-hidden="true">04</div></motion.article>
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
            <div className="material-tech-metrics">
              {Object.entries(selectedMaterial.specs).map(([key, val]) => (
                <div key={key} className="metric-badge">
                  <span>{key === 'moisture' ? 'Moisture' : key === 'density' ? 'Density' : key === 'durability' ? 'Durability' : key === 'rubCount' ? 'Rub Count' : key === 'comp' ? 'Composition' : 'Care'}</span>
                  <strong>{val as string}</strong>
                </div>
              ))}
            </div>
          </motion.div>
          <div className="material-preview-controls">
            <motion.div variants={fadeUpVariant} className="material-preview-kicker"><span className="kicker-number">06</span><span className="kicker-line" /><span>{t.materialKicker}</span></motion.div>
            <motion.h2 variants={fadeUpVariant} id="materials-preview-title">{t.materialTitle.split(' ')[0]}<br /><em>{t.materialTitle.split(' ').slice(1).join(' ')}</em></motion.h2>
            <motion.p variants={fadeUpVariant}>{t.materialDesc}</motion.p>
            <motion.div variants={fadeUpVariant} className="material-groups">
              {["Wood", "Fabric"].map((group) => (
                <div className="material-group" key={group}>
                  <div className="material-group-label"><span>{lang === 'bn' ? (group === 'Wood' ? 'কাঠ' : 'ফেব্রিক') : group}</span><span>{group === "Wood" ? (lang === 'bn' ? "০৪ ফিনিশ" : "04 finishes") : (lang === 'bn' ? "০৩ ফিনিশ" : "03 finishes")}</span></div>
                  <div className="material-swatches" role="radiogroup" aria-label={`${group} materials`}>
                    {materials.filter((material) => material.group === (group === 'Wood' ? (t.matWood || 'Wood') : (t.matFabric || 'Fabric'))).map((material) => (
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
            <motion.div variants={fadeUpVariant} className="selected-material"><span>{t.materialSelected}</span><strong>{selectedMaterial.name}</strong><small>{selectedMaterial.detail}</small></motion.div>

            <motion.div variants={fadeUpVariant} style={{ marginTop: '50px' }}>
              <a href="#ar-preview" className="btn-teal-shadow">
                See it in your room <ArrowUpRight size={14} strokeWidth={1.5} />
              </a>
            </motion.div>
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
          <div className="experience-kicker"><span className="kicker-number">07</span><span className="kicker-line" /><span>{t.navExperience}</span></div>
          <div className="experience-heading-row"><h2 id="experience-title">{t.experienceIntroTitle.split(' ').slice(0, -2).join(' ')}<br /><em>{t.experienceIntroTitle.split(' ').slice(-2).join(' ')}</em></h2><p>{t.experienceIntroDesc}</p></div>
        </motion.div>
        <motion.div variants={fadeUpVariant} className="page-container showroom-panel">
          <div className="showroom-film">
            <div className="showroom-poster" style={{ backgroundImage: `url(${heroRoom})` }} role="img" aria-label="Placeholder poster for the Agrabad Experience Studio video"><div className="showroom-wash" /><div className="showroom-film-label"><span>Showroom film / coming soon</span><strong>Agrabad Experience Studio</strong></div><div className="showroom-play"><Play size={17} fill="currentColor" strokeWidth={1.2} /></div></div>
            <div className="showroom-caption"><span>Textures in person. Joinery under your hand.</span><span>Heaven / 006</span></div>
          </div>
          <div className="showroom-copy"><span className="showroom-eyebrow">{t.experienceKicker}</span><h3>{t.experienceTitle.split(' ').slice(0, -2).join(' ')}<br /><em>{t.experienceTitle.split(' ').slice(-2).join(' ')}</em></h3><p>{t.experienceDesc}</p><a className="directions-button" href="https://www.google.com/maps/search/?api=1&query=Agrabad%20Chattogram" target="_blank" rel="noreferrer"><MapPin size={15} strokeWidth={1.4} />{t.experienceBtn} <ArrowUpRight size={14} strokeWidth={1.4} /></a></div>
        </motion.div>
        <motion.div variants={fadeUpVariant} className="page-container credibility-timeline">
          <div className="credibility-intro">
            <div><span className="showroom-eyebrow">{t.credibilityKicker}</span><h3>{t.credibilityTitle.split(' ')[0]}<br /><em>{t.credibilityTitle.split(' ').slice(1).join(' ')}</em></h3></div>
          </div>
          <motion.div
            className="timeline-track"
            aria-label="Heaven Furniture Mart milestone timeline"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-10%" }}
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.3 } }
            }}
          >
            <div className="timeline-line" aria-hidden="true" />
            <motion.div variants={timelineNodeVariant} className="timeline-node"><span>2020</span><i /><strong>{t.timeline1Title}</strong><p>{t.timeline1Desc}</p></motion.div>
            <motion.div variants={timelineNodeVariant} className="timeline-node"><span>2022</span><i /><strong>{t.timeline2Title}</strong><p>{t.timeline2Desc}</p></motion.div>
            <motion.div variants={timelineNodeVariant} className="timeline-node"><span>2025</span><i /><strong>{t.timeline3Title}</strong><p>{t.timeline3Desc}</p></motion.div>
            <motion.div variants={timelineNodeVariant} className="timeline-node timeline-highlight">
              <span>2026</span><i /><strong>{t.timeline4Title}</strong><p>{t.timeline4Desc}</p>
              <motion.div variants={awardVariant} className="award-badge-container award-badge-wrapper">
                <img src="/assets/award.png" alt="National Honor Award" className="award-badge-img" />
                <span>{t.credibilityAward}</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
        <motion.div variants={fadeUpVariant} className="page-container trust-panel">
          <div className="trust-heading"><span className="showroom-eyebrow">{t.trustKicker}</span><h3>{t.trustTitle.split(' ').slice(0, -1).join(' ')}<br /><em>{t.trustTitle.split(' ').slice(-1).join(' ')}</em></h3><p>{t.trustDesc}</p></div>
          <div className="trust-carousel" aria-label="Verified client story placeholder" style={{ overflow: 'hidden' }}>
            <div className="trust-track-fade" style={{ position: 'relative', width: '100%', minHeight: '400px', display: 'flex', alignItems: 'center' }}>
              <AnimatePresence mode="wait">
                {trustSlide === 0 && (
                  <motion.article
                    key="0"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                    className="trust-card"
                    style={{ position: 'absolute', width: '100%', left: 0, display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px', alignItems: 'center', border: '1px solid rgba(183, 154, 107, 0.3)', padding: '40px', borderRadius: '8px', background: 'rgba(239, 232, 220, 0.02)' }}
                  >
                    <div className="trust-image-wrapper" style={{ width: '100%', aspectRatio: '4/5', overflow: 'hidden', borderRadius: '4px', border: '1px solid rgba(183, 154, 107, 0.2)' }}>
                      <img src="/assets/full room.jpg" alt="Client Home" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div className="trust-text-content">
                      <span className="trust-card-index">01 / STORIES</span>
                      <div className="trust-quote-mark" style={{ color: '#b79a6b', fontFamily: '"Cormorant Garamond", serif', fontSize: '60px', lineHeight: 0, marginTop: '20px', marginBottom: '20px' }}>“</div>
                      <p style={{ fontSize: 'clamp(20px, 2.2vw, 36px)', fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', color: 'var(--parchment)', marginBottom: '30px', position: 'relative' }}>
                        The attention to detail is staggering. Heaven Furniture didn't just fill our home; they understood our lifestyle and crafted pieces that will last for generations.<span style={{ color: '#b79a6b' }}>”</span>
                      </p>
                      <span className="trust-card-foot" style={{ display: 'block', marginTop: '20px' }}>— Farah M., Gulshan Residence</span>
                    </div>
                  </motion.article>
                )}
                {trustSlide === 1 && (
                  <motion.article
                    key="1"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                    className="trust-card"
                    style={{ position: 'absolute', width: '100%', left: 0, display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px', alignItems: 'center', border: '1px solid rgba(183, 154, 107, 0.3)', padding: '40px', borderRadius: '8px', background: 'rgba(239, 232, 220, 0.02)' }}
                  >
                    <div className="trust-image-wrapper" style={{ width: '100%', aspectRatio: '4/5', overflow: 'hidden', borderRadius: '4px', border: '1px solid rgba(183, 154, 107, 0.2)' }}>
                      <img src="/assets/largeroom.jpg" alt="Client Home" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div className="trust-text-content">
                      <span className="trust-card-index">02 / STORIES</span>
                      <div className="trust-quote-mark" style={{ color: '#b79a6b', fontFamily: '"Cormorant Garamond", serif', fontSize: '60px', lineHeight: 0, marginTop: '20px', marginBottom: '20px' }}>“</div>
                      <p style={{ fontSize: 'clamp(20px, 2.2vw, 36px)', fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', color: 'var(--parchment)', marginBottom: '30px', position: 'relative' }}>
                        From the first sketch to the final installation, their artisans showed an unmatched level of dedication. The custom teak dining table is the absolute heart of our home.<span style={{ color: '#b79a6b' }}>”</span>
                      </p>
                      <span className="trust-card-foot" style={{ display: 'block', marginTop: '20px' }}>— Kamaluddin H., Banani Penthouse</span>
                    </div>
                  </motion.article>
                )}
                {trustSlide === 2 && (
                  <motion.article
                    key="2"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                    className="trust-card"
                    style={{ position: 'absolute', width: '100%', left: 0, display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px', alignItems: 'center', border: '1px solid rgba(183, 154, 107, 0.3)', padding: '40px', borderRadius: '8px', background: 'rgba(239, 232, 220, 0.02)' }}
                  >
                    <div className="trust-image-wrapper" style={{ width: '100%', aspectRatio: '4/5', overflow: 'hidden', borderRadius: '4px', border: '1px solid rgba(183, 154, 107, 0.2)' }}>
                      <img src="/assets/Bedroom2.jpg" alt="Client Home" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div className="trust-text-content">
                      <span className="trust-card-index">03 / STORIES</span>
                      <div className="trust-quote-mark" style={{ color: '#b79a6b', fontFamily: '"Cormorant Garamond", serif', fontSize: '60px', lineHeight: 0, marginTop: '20px', marginBottom: '20px' }}>“</div>
                      <p style={{ fontSize: 'clamp(20px, 2.2vw, 36px)', fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', color: 'var(--parchment)', marginBottom: '30px', position: 'relative' }}>
                        Walking into my new executive suite feels like entering a sanctuary. The bespoke mahogany desk and shelving are nothing short of architectural masterpieces.<span style={{ color: '#b79a6b' }}>”</span>
                      </p>
                      <span className="trust-card-foot" style={{ display: 'block', marginTop: '20px' }}>— Architect S. Rahman, Agrabad Suite</span>
                    </div>
                  </motion.article>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </motion.section>

      <RoomARPreview t={t as unknown as Record<string, string>} prefersReducedMotion={prefersReducedMotion} />

      <FaqSection t={t as unknown as Record<string, string>} prefersReducedMotion={prefersReducedMotion} />

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
          <motion.div variants={fadeUpVariant} className="contact-intro"><div className="contact-kicker"><span className="kicker-number">10</span><span className="kicker-line" /><span>{t.contactKicker}</span></div><h2 id="contact-title">{t.contactTitle.split(' ')[0]} {t.contactTitle.split(' ')[1]}<br /><em>{t.contactTitle.split(' ').slice(2).join(' ')}</em></h2><p>{t.contactDesc}</p></motion.div>
          <motion.div variants={fadeUpVariant} className="contact-form-shell">
            {contactSubmitted ? <div className="contact-success"><span className="success-mark"><Check size={17} strokeWidth={1.5} /></span><span className="contact-eyebrow">Brief prepared</span><h3>Your brief is ready<br /><em>for the studio.</em></h3><p>{t.contactSuccess}</p><button type="button" className="contact-reset" onClick={() => { setContactSubmitted(false); setContactErrors({}); }}>Edit request <ArrowUpRight size={14} /></button></div> : <form onSubmit={handleContactSubmit} className="consultation-form" noValidate><label className={contactErrors.name ? "has-error" : ""}><span>{t.contactName}</span><input name="name" type="text" placeholder={t.contactName} aria-invalid={Boolean(contactErrors.name)} aria-describedby={contactErrors.name ? "contact-name-error" : undefined} onChange={() => handleContactFieldChange("name")} />{contactErrors.name && <small id="contact-name-error" className="field-error">{contactErrors.name}</small>}</label><label className={contactErrors.phone ? "has-error" : ""}><span>{t.contactPhone}</span><input name="phone" type="tel" placeholder="+880 1xxx-xxxxxx" aria-invalid={Boolean(contactErrors.phone)} aria-describedby={contactErrors.phone ? "contact-phone-error" : undefined} onChange={() => handleContactFieldChange("phone")} />{contactErrors.phone && <small id="contact-phone-error" className="field-error">{contactErrors.phone}</small>}</label><label className={contactErrors.service ? "has-error" : ""}><span>{t.contactService}</span><select name="service" defaultValue="" aria-invalid={Boolean(contactErrors.service)} aria-describedby={contactErrors.service ? "contact-service-error" : undefined} onChange={() => handleContactFieldChange("service")}><option value="" disabled>{t.contactServiceOptions[0]}</option><option>{t.contactServiceOptions[1]}</option><option>{t.contactServiceOptions[2]}</option><option>{t.contactServiceOptions[3]}</option><option>{t.contactServiceOptions[4]}</option></select>{contactErrors.service && <small id="contact-service-error" className="field-error">{contactErrors.service}</small>}</label><button className="consultation-submit" type="submit">{t.contactBtn} <ArrowUpRight size={16} strokeWidth={1.4} /></button></form>}
            <a className="whatsapp-line" href={getWhatsAppLink()} target="_blank" rel="noreferrer"><MessageCircle size={16} strokeWidth={1.5} /><span>Prefer instant answers? <strong>Chat directly on WhatsApp</strong> <small>(+880 1960-481983)</small></span><ArrowUpRight size={14} strokeWidth={1.4} /></a>
          </motion.div>
        </div>
        <footer className="page-container contact-footer">
          <div className="footer-brand"><a className="brand-lockup" href="#top" aria-label="Heaven Furniture Mart home"><img className="brand-mark" src={archMark} alt="" /><span className="brand-name"><span>Heaven</span><small>Furniture Mart</small></span></a><p>Heaven Furniture Mart © 2026.<br />Designed. Crafted. Customized.</p></div>
          <div className="footer-location"><span className="footer-label">{t.experienceBtn.split(' ')[0]} {t.experienceBtn.split(' ')[1]}</span><p>Agrabad Access Road,<br />Chattogram, Bangladesh.<br /><small>Sat – Thu: 10:00 AM – 8:00 PM</small></p></div>
          <div className="footer-contact"><span className="footer-label">Stay in touch</span><a href="mailto:heavenfurnituremart@gmail.com"><Mail size={14} strokeWidth={1.4} />heavenfurnituremart@gmail.com</a><a href="tel:+8801960481983"><Phone size={14} strokeWidth={1.4} />+880 1960-481983</a><div className="social-links"><a href="#social-facebook" onClick={handleSocialPlaceholder} aria-label="Facebook profile placeholder"><Facebook size={16} /></a><a href="#social-instagram" onClick={handleSocialPlaceholder} aria-label="Instagram profile placeholder"><Instagram size={16} /></a><a href="#social-youtube" onClick={handleSocialPlaceholder} aria-label="YouTube profile placeholder"><Youtube size={16} /></a></div></div>
        </footer>
        <a className="mobile-whatsapp" href={getWhatsAppLink()} target="_blank" rel="noreferrer"><MessageCircle size={17} strokeWidth={1.6} />WhatsApp the studio</a>
        <a className="floating-whatsapp" href={getWhatsAppLink()} target="_blank" rel="noreferrer" aria-label="Chat with us on WhatsApp">
          <div className="whatsapp-icon-wrap"><MessageCircle size={22} strokeWidth={1.8} /></div>
          <div className="whatsapp-text">
            <span className="whatsapp-title">Heaven Studio <span className="online-dot" /></span>
            <span className="whatsapp-subtitle">Chat with our designers</span>
          </div>
        </a>
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
                {selectedCollection.image === "placeholder" ? <span className="collection-placeholder-label">Photography placeholder</span> : <img src={selectedCollection.gallery[lightboxIndex]} alt={selectedCollection.imageAlt} className={isXrayMode ? 'xray-active' : ''} />}

                {isXrayMode && (
                  <div className="xray-overlay">
                    <div className="xray-point pt-1"><span>01 / FRAME</span><strong>Kiln-Dried Hardwood</strong></div>
                    <div className="xray-point pt-2"><span>02 / CORE</span><strong>High-Density Foam</strong></div>
                    <div className="xray-point pt-3"><span>03 / FINISH</span><strong>Hand-Stitched Seams</strong></div>
                  </div>
                )}

                <button className="xray-toggle" onClick={(e) => { e.stopPropagation(); setIsXrayMode(!isXrayMode); }}>
                  {isXrayMode ? 'Close X-Ray' : 'View Anatomy'}
                </button>
                {selectedCollection.gallery && selectedCollection.gallery.length > 1 && (
                  <div className="lightbox-nav">
                    <button type="button" onClick={(e) => { e.stopPropagation(); setLightboxIndex((prev) => (prev === 0 ? selectedCollection.gallery.length - 1 : prev - 1)); }} aria-label="Previous image"><ArrowLeft size={18} /></button>
                    <span>{lightboxIndex + 1} / {selectedCollection.gallery.length}</span>
                    <button type="button" onClick={(e) => { e.stopPropagation(); setLightboxIndex((prev) => (prev === selectedCollection.gallery.length - 1 ? 0 : prev + 1)); }} aria-label="Next image"><ArrowRight size={18} /></button>
                  </div>
                )}
              </div>
              <div className="lightbox-copy"><p className="section-eyebrow">Collection / {selectedCollection.number}</p><h2 id="collection-lightbox-title">{selectedCollection.title}<br /><em>in focus.</em></h2><p>{selectedCollection.items}</p><div className="spec-row"><span>Material study</span><strong>{selectedCollection.specs}</strong></div><div className="spec-row" style={{ marginTop: '15px' }}><span>{t.collectionStarts}</span><strong>{selectedCollection.price}</strong></div><a className="lightbox-whatsapp" href={getWhatsAppLink(`Hi, I'm interested in the ${selectedCollection.title} collection.`)} target="_blank" rel="noreferrer"><MessageCircle size={16} strokeWidth={1.6} />Ask in WhatsApp</a></div>
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
