"use client";

import { useDeidPass } from "../../hooks/use-deid-pass";
import "./deid-pass.css";

type Props = {
  /** Public path holding the fragment webp files. No trailing slash. */
  assetBase?: string;
  className?: string;
};

/**
 * De-identification pass: raw business records drift beneath a
 * de-identification layer and come out redacted in the register below.
 *
 * Renders only the shell on the server; the scene is built on mount.
 */
export function DeidentificationPass({ assetBase, className }: Props) {
  const ref = useDeidPass({ assetBase });

  return (
    <div
      ref={ref}
      className={`rdp${className ? ` ${className}` : ""}`}
      role="img"
      aria-label="Raw business records passing beneath a de-identification layer"
    >
      <div className="scene">
        <div className="layers">
          <div className="layer">
            <div className="plane plane-motes" />
          </div>
          <div className="layer">
            <div className="plane plane-cards" />
          </div>
          <div className="layer">
            <div className="plane plane-sheet" />
          </div>
        </div>
        <div className="callouts">
          <svg className="leaders" preserveAspectRatio="none" />
        </div>
      </div>
    </div>
  );
}
