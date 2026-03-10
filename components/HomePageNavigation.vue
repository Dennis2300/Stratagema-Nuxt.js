<template>
  <article class="flex flex-wrap justify-center gap-10">
    <NuxtLink
      v-for="link in navLinks"
      :to="link.path"
      class="group flex flex-col items-center cursor-pointer"
    >
      <div class="relative w-[300px] h-[300px] overflow-hidden rounded-xl">
        <!-- Image -->
        <img
          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          :src="link.img"
          :alt="link.alt_name"
          width="300"
          height="300"
          fetchpriority="high"
          decoding="async"
        />
        <!-- Overlay (appears on hover) -->
        <div
          class="absolute inset-0 bg-black/70 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        ></div>
        <div
          class="absolute inset-0 bg-black/70 opacity-0 transition-opacity duration-500 opacity-50"
        ></div>
        <!-- Always-visible alt_name + sliding text -->
        <div class="absolute inset-x-0 bottom-0 p-4">
          <p
            class="text-sm text-white transform translate-y-full opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 mb-1"
          >
            {{ link.text }}
          </p>
          <h4 class="font-semibold">{{ link.alt_name }}</h4>
        </div>
      </div>
    </NuxtLink>
  </article>
</template>

<script setup>
const SUPABASE_STORAGE =
  "https://wfhyslxivzmdgbnhbnjg.supabase.co/storage/v1/object/public/StratagemaStorage";

const navLinks = [
  {
    name: "Characters",
    alt_name: "Characters Archive",
    path: "/characters",
    img: getImage("twins.webp"),
    text: "Explore all playable characters, check out their builds, and find the perfect team setup for your playstyle.",
  },
  {
    name: "Weapons",
    alt_name: "Weapons Archive",
    path: "/weapons",
    img: getImage("skirk.webp"),
    text: "Browse every weapon in the game, compare stats, and discover which ones truly power up your characters.",
  },
  {
    name: "Artifacts",
    alt_name: "Artifacts Archive",
    path: "/artifacts",
    img: getImage("chiori.webp"),
    text: "Dive into artifact sets, explore their bonuses, and optimize your stats to maximize your damage.",
  },
];

function getImage(filename) {
  return `${SUPABASE_STORAGE}/${filename}`;
}
</script>
