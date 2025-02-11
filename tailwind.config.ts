import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			darkText: '#141414',
  			lightText: '#ececec',
			accent1: "#E1B860",
			accent2: "",
  			dark75: 'rgba(20, 20, 20, .75)',
  			dark50: 'rgba(20, 20, 20, .5)',
  			dark35: 'rgba(20, 20, 20, .35)',
  			light85: 'rgba(236, 236, 236, 0.85)',
  			light70: 'rgba(236, 236, 236, 0.7)',
  			light50: 'rgba(236, 236, 236, 0.5)',
  			light40: 'rgba(236, 236, 236, 0.4)',
  			light35: 'rgba(236, 236, 236, 0.35)',
  			light25: 'rgba(236, 236, 236, 0.25)',
  			light20: 'rgba(236, 236, 236, 0.2)',
  			pendingBg: 'rgba(214, 112, 64, .4)',
  			pendingBorder: 'rgb(214, 112, 64)',
  			paidBg: 'rgba(169, 227, 122, 0.4)',
  			paidBorder: 'rgb(169, 227, 122)',
  			ongoingBg: 'rgba(233, 157, 77, 0.4)',
  			ongoingBorder: 'rgb(233, 157, 77)',
  			completedBg: 'rgba(140, 185, 227, .4)',
  			completedBorder: 'rgb(140, 185, 227)',
			destructiveBg: 'rgba(168, 15, 15, 0.4)',
			destructiveBorder: '#A80F0F',
  		},
  		borderRadius: {
  			customLg: '6%',
  			customMd: '3%',
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
		accentColor: {
			accent: 'var(--color-accent1)',
		}
  	}
  },
  plugins: [
      require("tailwindcss-animate")
],
} satisfies Config;
