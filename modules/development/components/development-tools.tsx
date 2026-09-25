// Keep the dev-only package out of production client references and preloads.
export async function DevelopmentTools() {
  if (process.env.NODE_ENV !== "development") return null;
  const { Agentation } = await import("agentation");
  return <Agentation />;
}
