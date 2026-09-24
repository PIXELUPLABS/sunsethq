export function FormGuideLine() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-0 bottom-0 left-10 hidden border-l border-dashed border-black/20 sm:block"
    />
  );
}

export function FormGrainTexture() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-multiply"
      style={{ backgroundImage: "url(/images/pricing/grain-texture.webp)", backgroundSize: "296px 296px" }}
    />
  );
}
