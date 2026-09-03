import type { DetailedHTMLProps, HTMLAttributes } from "react";

type ModelViewerJSX = DetailedHTMLProps<
  HTMLAttributes<HTMLElement> & {
    src?: string;
    alt?: string;
    ar?: boolean;
    "ar-modes"?: string;
    "ar-scale"?: string;
    "ar-placement"?: string;
    "camera-controls"?: boolean;
    "auto-rotate"?: boolean;
    "shadow-intensity"?: string;
    "shadow-softness"?: string;
    exposure?: string;
    "environment-image"?: string;
    "camera-orbit"?: string;
    "field-of-view"?: string;
    "disable-zoom"?: boolean;
    poster?: string;
    reveal?: string;
    loading?: string;
  },
  HTMLElement
>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": ModelViewerJSX;
    }
  }

  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        "model-viewer": ModelViewerJSX;
      }
    }
  }
}

export {};
