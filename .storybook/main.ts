import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  stories: ["../modules/value-my-data/**/*.stories.tsx"],
  framework: "@storybook/nextjs-vite",
  staticDirs: ["../public"],
  core: { disableTelemetry: true },
};

export default config;
