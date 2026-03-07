<template>
  <main class="flex flex-col items-center">
    <!--Loading-->
    <section
      v-if="loading"
      class="h-screen w-screen flex justify-center items-center"
    >
      <l-trefoil
        size="160"
        stroke="12"
        stroke-length="0.15"
        bg-opacity="0.1"
        speed="1.4"
        color="white"
        scale="5"
      />
    </section>
    <!--Error-->
    <section
      v-else-if="error"
      class="flex flex-col items-center gap-4 text-center"
    >
      <p class="text-4xl">⚠️</p>
      <h2 class="text-xl font-bold text-red-400">Something went wrong</h2>
      <p class="text-sm text-gray-400">{{ error.message }}</p>
      <button class="btn btn-soft btn-error" @click="getAllUpdates">
        Try again
      </button>
    </section>
    <!--Content-->
    <section v-else class="mt-10 space-y-20">
      <!--Navigation Cards-->
      <article class="flex flex-wrap justify-center gap-10">
        <div
          v-for="link in navLinks"
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
              <!-- Sliding description text -->
              <p
                class="text-xs text-white transform translate-y-full opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 mb-1"
              >
                {{ link.text }}
              </p>

              <!-- alt_name always visible, slides up with the block naturally -->
              <h4 class="text-white text-sm font-semibold">
                {{ link.alt_name }}
              </h4>
            </div>
          </div>
        </div>
      </article>
      <!-- Current Banner characters-->
      <CurrentBanner />
      <!--Notice Boards-->
      <article>
        <h1>Notice Board</h1>
        <div v-for="update in updates">
          <p>{{ update.title }}</p>
          <p>{{ update.slug }}</p>
          <p>{{ update.content }}</p>
        </div>
      </article>
    </section>
  </main>
</template>

<script setup>
const supabase = useSupabaseClient();
const loading = ref(false);
const error = ref(null);
const updates = ref([]);

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

async function getAllUpdates() {
  try {
    loading.value = true;
    const { data, err } = await supabase.from("updates").select("*");
    if (err) throw err;
    updates.value = data;
  } catch (e) {
    error.value = e;
    console.error(e);
  } finally {
    loading.value = false;
  }
}

function getImage(filename) {
  return `${SUPABASE_STORAGE}/${filename}`;
}

onMounted(() => {
  getAllUpdates();
});
</script>
