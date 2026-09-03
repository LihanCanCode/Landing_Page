import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { Smartphone, Move3d } from "lucide-react";
import "./room-ar-preview.css";

type ARFurniturePiece = {
  id: string;
  name: string;
  model: string;
  widthCm: number;
  depthCm: number;
  heightCm: number;
};

const AR_FURNITURE: ARFurniturePiece[] = [
  { id: "sofa", name: "Lounge Sofa", model: "/assets/models/sofa.glb", widthCm: 210, depthCm: 90, heightCm: 78 },
  { id: "chair", name: "Modern Cushion Chair", model: "/assets/models/chair.glb", widthCm: 68, depthCm: 72, heightCm: 84 },
  { id: "coffee-table", name: "Glass Coffee Table", model: "/assets/models/coffee-table.glb", widthCm: 110, depthCm: 60, heightCm: 42 },
  { id: "side-table", name: "Drawer Side Table", model: "/assets/models/side-table.glb", widthCm: 45, depthCm: 40, heightCm: 55 },
  { id: "floor-lamp", name: "Round Floor Lamp", model: "/assets/models/floor-lamp.glb", widthCm: 35, depthCm: 35, heightCm: 155 },
  { id: "bookcase", name: "Open Bookcase", model: "/assets/models/bookcase.glb", widthCm: 90, depthCm: 32, heightCm: 180 },
];

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] } },
};

interface RoomARPreviewProps {
  t: Record<string, string>;
  prefersReducedMotion: boolean | null;
}

export default function RoomARPreview({ t, prefersReducedMotion }: RoomARPreviewProps) {
  const [activePiece, setActivePiece] = useState<ARFurniturePiece>(AR_FURNITURE[0]);

  return (
    <motion.section
      className="ar-preview-section"
      id="ar-preview"
      aria-labelledby="ar-preview-title"
      initial={prefersReducedMotion ? "show" : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-10%" }}
      variants={fadeUpVariant}
    >
      <div className="page-container ar-preview-grid">
        <motion.div variants={fadeUpVariant} className="ar-preview-copy">
          <div className="ar-preview-kicker">
            <span className="kicker-number">08</span>
            <span className="kicker-line" />
            <span>{t.arKicker}</span>
          </div>
          <h2 id="ar-preview-title">
            {t.arTitle.split(" ").slice(0, -2).join(" ")}
            <br />
            <em>{t.arTitle.split(" ").slice(-2).join(" ")}</em>
          </h2>
          <p>{t.arDesc}</p>

          <div className="ar-piece-select" role="radiogroup" aria-label={t.arSelectLabel}>
            {AR_FURNITURE.map((piece) => (
              <button
                key={piece.id}
                type="button"
                role="radio"
                aria-checked={activePiece.id === piece.id}
                className={`ar-piece-chip ${activePiece.id === piece.id ? "is-active" : ""}`}
                onClick={() => setActivePiece(piece)}
              >
                {piece.name}
              </button>
            ))}
          </div>

          <div className="ar-dimensions" aria-label={`${t.arDimensions} — ${activePiece.name}`}>
            <div className="ar-dimension-badge">
              <span>{t.arWidth}</span>
              <strong>{activePiece.widthCm} cm</strong>
            </div>
            <div className="ar-dimension-badge">
              <span>{t.arDepth}</span>
              <strong>{activePiece.depthCm} cm</strong>
            </div>
            <div className="ar-dimension-badge">
              <span>{t.arHeight}</span>
              <strong>{activePiece.heightCm} cm</strong>
            </div>
          </div>

          <p className="ar-note">
            <Smartphone size={14} strokeWidth={1.5} />
            {t.arNoteAndroid}
          </p>
        </motion.div>

        <motion.div variants={fadeUpVariant} className="ar-preview-stage">
          <div className="ar-stage-frame">
            <div className="ar-stage-crosshair" aria-hidden="true" />
            <model-viewer
              key={activePiece.id}
              className="ar-model-viewer"
              src={activePiece.model}
              alt={activePiece.name}
              ar
              ar-modes="scene-viewer webxr"
              ar-scale="fixed"
              camera-controls
              auto-rotate
              shadow-intensity="1"
              exposure="0.9"
              reveal="auto"
            >
              <button slot="ar-button" className="ar-launch-button" type="button">
                <Move3d size={16} strokeWidth={1.6} />
                <span>{t.arBtnLaunchShort}</span>
              </button>
            </model-viewer>
          </div>
          <div className="ar-stage-caption">
            <span>{activePiece.name}</span>
            <span>Live 3D / Android AR</span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
