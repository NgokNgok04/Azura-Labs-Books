import { type Config } from "tailwindcss";
import animatePlugin from "tailwindcss-animate";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [animatePlugin],
};

export default config;
