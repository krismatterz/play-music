import type { Config } from 'tailwindcss';
import sharedConfig from '@play/tailwind-config';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  presets: [sharedConfig],
};

export default config;
