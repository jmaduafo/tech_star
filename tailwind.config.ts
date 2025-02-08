import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        darkText: "#141414",
        lightText: "#ececec",
        accent: "hsl(41, 68, 63, 100%)",
        light70: "rgba(236, 236, 236, 0.7)",
        light40: "rgba(236, 236, 236, 0.4)",
        light35: "rgba(236, 236, 236, 0.35)",
        light20: "rgba(236, 236, 236, 0.2)",
        pendingBg: "rgba(214, 112, 64, .4)",
        pendingBorder: "rgb(214, 112, 64)",
        paidBg: "rgba(169, 227, 122, 0.4)",
        paidBorder: "rgb(169, 227, 122)",
        ongoingBg: "rgba(233, 157, 77, 0.4)",
        ongoingBorder: "rgb(233, 157, 77)",
        completedBg: "rgba(140, 185, 227, .4)",
        completedBorder: "rgb(140, 185, 227)",
      },
      borderRadius: {
        customLg: "6%",
        customMd: "3%",
      }
    },
  },
  plugins: [],
} satisfies Config;
