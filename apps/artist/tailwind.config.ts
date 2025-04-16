import type { Config } from 'tailwindcss';
import sharedConfig from '@play/tailwind-config'; // Use shared config alias

const config: Pick<Config, 'content' | 'presets'> = {
  content: ['./src/**/*.tsx'],
  presets: [sharedConfig],
};

export default config;
