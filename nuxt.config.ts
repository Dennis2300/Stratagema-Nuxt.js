import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/supabase",
    "@vercel/analytics",
    "@vercel/speed-insights",
    "@nuxtjs/sitemap",
  ],
  css: ["@/assets/css/main.css"],

  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    head: {
      title: "Stratagema – Genshin Impact Builds, Teams & Artifacts",
      meta: [
        {
          name: "description",
          content:
            "Simple Genshin Impact build guides. Find the best artifacts, weapons and teams for every character.",
        },
      ],
      link: [{ rel: "icon", type: "image/png", href: "/favicon.webp" }],
    },
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith("l-"),
    },
  },
  supabase: {
    types: false,
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      exclude: ["/*"],
    },
  },
  site: {
    url: "https://stratagema.app",
  },
  sitemap: {
    exclude: ["/confirm", "/login"],
  },
});
