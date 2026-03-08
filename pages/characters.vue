<template>
  <main>
    <!--Loading-->
    <section v-if="loading">
      <div class="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    </section>
    <!--Error-->
    <section v-else-if="error">
      <ErrorMessage :error="error" />
    </section>
    <!--Content-->
    <section v-else class="flex flex-col items-center mt-8">
      <header class="relative">
        <div class="relative w-[800px] h-[100px] overflow-hidden rounded-xl">
          <img
            class="w-full h-full object-cover object-bottom"
            src="https://act-upload.hoyoverse.com/event-ugc-hoyowiki/2025/06/13/237301566/fcea1426526d00185e04c4abe3cd8bdc_5451103014835655107.png?x-oss-process=image%2Fformat%2Cwebp"
            alt=""
          />
          <!-- dark overlay -->
          <div class="absolute inset-0 bg-black/60"></div>
        </div>
        <h2 class="absolute inset-0 flex items-center justify-center">
          Characters Archive
        </h2>
      </header>
      <div class="divider px-32"></div>
      <article class="w-full min-h-screen flex flex-col items-center gap-12">
        <div
          v-for="character in characters"
          :key="character.name"
          class="relative bg-app-tertiary w-2/3 overflow-hidden rounded-xl border border-white/5"
        >
          <!-- Splash Art -->
          <div class="absolute -top-10 -right-8 opacity-50 z-0">
            <img class="w-64" :src="character.splash_art_url" alt="" />
          </div>

          <!-- Character Card -->
          <div class="flex items-center gap-4 px-5 py-4">
            <div
              class="w-24 h-24 rounded-full overflow-hidden"
              :class="{
                'rarity-5': character.rarity === 5,
                'rarity-4': character.rarity === 4,
              }"
            >
              <img
                class="w-full h-full object-cover"
                :src="character.img_url"
                alt=""
              />
            </div>
            <div>
              <h3 class="font-semibold text-white">{{ character.name }}</h3>
              <div class="flex gap-0.5 mt-1">
                <span
                  v-for="n in character.rarity"
                  :key="n"
                  class="text-xs"
                  :class="
                    character.rarity === 5
                      ? 'text-amber-400'
                      : 'text-purple-400'
                  "
                  >★</span
                >
              </div>
            </div>
          </div>

          <!-- Character Tags -->
          <div
            class="flex items-center justify-between bg-app-secondary px-5 py-2 relative z-10"
          >
            <div class="flex gap-3 items-center">
              <img
                class="w-6 h-6 object-contain"
                :src="character.vision.img_url"
                :alt="character.vision.name"
              />
              <span class="text-sm text-white/60">{{
                character.vision.name
              }}</span>
              <span class="text-white/20">·</span>
              <span class="text-sm text-white/60">{{
                character.weapon_type.name
              }}</span>
              <span class="text-white/20">·</span>
              <span class="text-sm text-white/60">{{ character.role }}</span>
              <span class="text-white/20">·</span>
              <span class="text-sm text-white/60">{{
                character.main_stat
              }}</span>
            </div>
            <span class="text-xs text-white/60">
              <strong> Released: </strong>
              {{
                character.release_date
                  ? new Date(character.release_date).toLocaleDateString(
                      "en-GB",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      },
                    )
                  : "UPCOMING"
              }}
            </span>
          </div>
        </div>
        <div class="flex justify-center py-4">
          <span
            v-if="paginationLoading"
            class="loading loading-spinner loading-md"
          ></span>
          <span v-else-if="noMoreResults" class="text-gray-400"
            >No more characters</span
          >
        </div>
        <div ref="scrollTrigger"></div>
      </article>
    </section>
  </main>
</template>

<script setup>
const supabase = useSupabaseClient();

const loading = ref(true);
const error = ref(null);

// Pagination
const scrollTrigger = ref(null);
const paginationLoading = ref(false);
const currentPage = ref(0);
const totalCount = ref(0);
const pageSize = 10;

const noMoreResults = computed(
  () => characters.value.length >= totalCount.value && totalCount.value > 0,
);

const characters = ref([]);

async function loadMoreCharacter() {
  if (paginationLoading.value || noMoreResults.value) return;

  paginationLoading.value = true;
  error.value = null;

  const from = currentPage.value * pageSize;
  const to = from + pageSize - 1;

  try {
    const {
      data,
      error: err,
      count,
    } = await supabase
      .from("characters")
      .select(
        "*, vision(*), weapon_type(id, name), regions:character_region(region(id, name))",
        { count: "exact" },
      )
      .order("release_date", { ascending: false })
      .range(from, to);

    if (err) throw err;

    characters.value.push(...data);
    totalCount.value = count;
    currentPage.value++;
  } catch (e) {
    error.value = e;
    console.log(e);
  } finally {
    loading.value = false;
    paginationLoading.value = false;
  }
}

onMounted(async () => {
  await loadMoreCharacter();
  await nextTick();

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) loadMoreCharacter();
    },
    { threshold: 0.1 },
  );

  if (scrollTrigger.value) {
    observer.observe(scrollTrigger.value);
  } else {
    console.warn("scrollTrigger not found");
  }

  onUnmounted(() => observer.disconnect());
});
</script>
