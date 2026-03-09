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
      <div class="flex justify-center items-center h-64">
        <ErrorMessage :error="error" />
      </div>
    </section>
    <!--Content-->
    <section v-else class="relative">
      <header class="relative flex justify-center items-center mt-8">
        <div class="relative w-[800px] h-[100px] overflow-hidden rounded-xl">
          <img
            class="w-full h-full object-cover object-bottom"
            src="https://act-upload.hoyoverse.com/event-ugc-hoyowiki/2025/06/13/237301566/fcea1426526d00185e04c4abe3cd8bdc_5451103014835655107.png?x-oss-process=image%2Fformat%2Cwebp"
            alt=""
          />
          <!-- dark overlay -->
          <div class="absolute inset-0 bg-black/60"></div>
        </div>
        <h2
          class="absolute inset-0 flex items-center justify-center font-rubik-dirt tracking-wide"
        >
          Characters Archive
        </h2>
      </header>
      <!--Filter-->
      <div class="pl-32 w-fit cursor-pointer" @click="isFilterPanelOpen = true">
        <div
          class="bg-app-muted py-1 px-3 flex items-center gap-1 w-fit rounded-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            fill="currentColor"
            class="bi bi-funnel-fill"
            viewBox="0 0 16 16"
          >
            <path
              d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5z"
            />
          </svg>
          <span>Filters</span>
        </div>
      </div>
      <div class="divider px-32 mt-0 mb-8"></div>
      <!--Character Card-->
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
              <h3 class="leading-none">{{ character.name }}</h3>
              <div class="flex gap-0.5 items-center">
                <span
                  v-for="n in character.rarity"
                  :key="n"
                  class="text-lg leading-none"
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
      <!--Filter Panel-->
      <Transition name="fade">
        <div
          v-if="isFilterPanelOpen"
          class="fixed inset-0 z-20 top-0 left-0 w-screen h-screen flex items-center justify-center bg-black/75"
          @click="isFilterPanelOpen = false"
        >
          <div
            class="max-w-1/2 bg-app-tertiary rounded-b-2xl border-t-4 border-app-accent p-4"
            @click.stop
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  fill="currentColor"
                  class="bi bi-funnel-fill"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5z"
                  />
                </svg>
                <h4>Filter Characters</h4>
              </div>
              <button
                class="btn btn-error btn-xs"
                @click="
                  filtersWereApplied
                    ? (isFilterPanelOpen = false)
                    : hasActiveFilters
                      ? resetFilters()
                      : (isFilterPanelOpen = false)
                "
              >
                X
              </button>
            </div>
            <div class="space-y-8">
              <!--Visions-->
              <div>
                <span class="divider divider-start font-acme tracking-wide mb-2"
                  >Rarity</span
                >
                <div class="filter">
                  <input
                    class="btn filter-reset"
                    type="radio"
                    name="metaframeworks"
                    aria-label="All"
                    @click="selectRarity(null)"
                  />
                  <input
                    class="btn"
                    type="radio"
                    name="metaframeworks"
                    aria-label="★★★★★"
                    @click="selectRarity(5)"
                  />
                  <input
                    class="btn"
                    type="radio"
                    name="metaframeworks"
                    aria-label="★★★★"
                    @click="selectRarity(4)"
                  />
                </div>
              </div>
              <!--Visions-->
              <div>
                <span class="divider divider-start font-acme tracking-wide mb-2"
                  >Visions/Element</span
                >
                <div class="flex flex-wrap gap-4">
                  <template v-for="vision in visions">
                    <div class="relative inline-flex items-center">
                      <input
                        class="btn pl-10"
                        type="checkbox"
                        name="frameworks"
                        :aria-label="vision.name"
                      />
                      <img
                        :src="vision.img_url"
                        class="absolute left-2 w-6 h-6 pointer-events-none"
                      />
                    </div>
                  </template>
                </div>
              </div>
              <!--Regions-->
              <div>
                <span class="divider divider-start font-acme tracking-wide mb-2"
                  >Regions</span
                >
                <div class="flex flex-wrap gap-4">
                  <template v-for="region in regions">
                    <div class="relative inline-flex items-center">
                      <input
                        class="btn pl-10"
                        type="checkbox"
                        name="frameworks"
                        :aria-label="region.name"
                      />
                      <img
                        v-if="region.img_url"
                        :src="region.img_url"
                        class="absolute left-2 w-6 h-6 pointer-events-none"
                      />
                      <img
                        v-else
                        src="https://act-upload.hoyoverse.com/event-ugc-hoyowiki/2025/11/22/237301566/8ef5e0aaf7edf5d156a382a5b0cc72da_8094299417877861659.png?x-oss-process=image%2Fformat%2Cwebp"
                        class="absolute left-2 w-6 h-6 pointer-events-none"
                      />
                    </div>
                  </template>
                </div>
              </div>
              <!--Weapon Types-->
              <div>
                <span class="divider divider-start font-acme tracking-wide mb-2"
                  >Weapon Types</span
                >
                <div class="flex flex-wrap gap-4">
                  <template v-for="weapon_type in weapon_types">
                    <div class="relative inline-flex items-center">
                      <input
                        class="btn pl-10"
                        type="checkbox"
                        name="frameworks"
                        :aria-label="weapon_type.name"
                      />
                      <img
                        :src="weapon_type.img_url"
                        class="absolute left-2 w-6 h-6 pointer-events-none"
                      />
                    </div>
                  </template>
                </div>
              </div>
              <!--Apply/Reset Button-->
              <div class="flex justify-center items-center gap-10">
                <button
                  class="btn btn-success"
                  @click="getFilteredCharacters"
                  :disabled="!hasActiveFilters"
                >
                  Apply
                </button>
                <button
                  class="btn btn-warning"
                  @click="resetFilters"
                  :disabled="!hasActiveFilters"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </section>
  </main>
</template>

<script setup>
const supabase = useSupabaseClient();

const loading = ref(true);
const error = ref(null);
const isFilterPanelOpen = ref(false);

// Pagination
const scrollTrigger = ref(null);
const paginationLoading = ref(false);
const currentPage = ref(0);
const totalCount = ref(0);
const pageSize = 10;
const noMoreResults = computed(
  () => characters.value.length >= totalCount.value && totalCount.value > 0,
);

// Data
const characters = ref([]);
const visions = ref([]);
const regions = ref([]);
const weapon_types = ref([]);

const CACHE_KEY = "characters_cache";

// Filter
const isFiltered = ref(false);
const filtersWereApplied = ref(false);
const selectedFilters = ref({
  rarity: null,
});

function saveCharactersToCache(characters, totalCount, currentPage) {
  sessionStorage.setItem(
    CACHE_KEY,
    JSON.stringify({
      characters,
      totalCount,
      currentPage,
      timestamp: Date.now(),
    }),
  );
}
function loadCharactersFromCache() {
  const cached = sessionStorage.getItem(CACHE_KEY);
  if (!cached) return null;

  const parsed = JSON.parse(cached);
  const oneHour = 60 * 60 * 1000;

  if (Date.now() - parsed.timestamp > oneHour) {
    sessionStorage.removeItem(CACHE_KEY);
    return null;
  }

  return parsed;
}
function setCache(key, data, ttl = 60 * 60 * 1000) {
  const entry = {
    data,
    expiresAt: Date.now() + ttl,
  };
  sessionStorage.setItem(key, JSON.stringify(entry));
}
function getCache(key) {
  const cachedData = sessionStorage.getItem(key);
  if (!cachedData) return null;

  const entry = JSON.parse(cachedData);

  if (Date.now() > entry.expiresAt) {
    sessionStorage.removeItem(key);
    return null;
  }

  return entry.data;
}

async function getMoreCharacters() {
  if (paginationLoading.value || noMoreResults.value || isFiltered.value)
    return;

  paginationLoading.value = true;
  error.value = null;

  const from = currentPage.value * pageSize;
  const to = from + pageSize - 1;

  try {
    const {
      data,
      count,
      error: fetchError,
    } = await supabase
      .from("characters")
      .select(
        "*, vision(*), weapon_type(id, name), regions:character_region(region(id, name))",
        { count: "exact" },
      )
      .order("release_date", { ascending: false })
      .range(from, to);

    if (fetchError) throw fetchError;
    characters.value.push(...data);
    totalCount.value = count;
    currentPage.value++;
    saveCharactersToCache(
      characters.value,
      totalCount.value,
      currentPage.value,
    );
  } catch (fetchError) {
    error.value = fetchError;
    console.log(fetchError);
  } finally {
    loading.value = false;
    paginationLoading.value = false;
  }
}
async function getAllVisions() {
  try {
    const cached = getCache("visions");
    if (cached) return (visions.value = cached);
    const { data, error: fetchError } = await supabase
      .from("visions")
      .select("*");
    if (fetchError) throw fetchError;
    visions.value = data;
    setCache("visions", data);
  } catch (e) {
    error.value = e;
    console.log(e);
  }
}
async function getAllRegions() {
  try {
    const cached = getCache("regions");
    if (cached) return (regions.value = cached);
    const { data, error: fetchError } = await supabase
      .from("regions")
      .select("*");
    if (fetchError) throw fetchError;
    regions.value = data;
    setCache("regions", data);
  } catch (e) {
    error.value = e;
    console.log(e);
  }
}
async function getAllWeaponTypes() {
  try {
    const cached = getCache("weapon_types");
    if (cached) return (weapon_types.value = cached);
    const { data, error: fetchError } = await supabase
      .from("weapon_types")
      .select("*");
    if (fetchError) throw fetchError;
    weapon_types.value = data;
    setCache("weapon_types", data);
  } catch (e) {
    error.value = e;
    console.log(e);
  }
}

function selectRarity(value) {
  selectedFilters.value.rarity = value;
}
async function getFilteredCharacters() {
  if (!hasActiveFilters.value) return;
  filtersWereApplied.value = true;
  isFiltered.value = true;
  characters.value = [];
  currentPage.value = 0;
  totalCount.value = 0;
  paginationLoading.value = true;
  try {
    let query = supabase
      .from("characters")
      .select(
        "*, vision(*), weapon_type(id, name), regions:character_region(region(id, name))",
      )
      .order("release_date", { ascending: false });

    if (selectedFilters.value.rarity !== null) {
      query = query.eq("rarity", selectedFilters.value.rarity);
    }

    const { data, error: fetchError } = await query;
    if (fetchError) throw fetchError;
    characters.value = data;
  } catch (error) {
    console.log(error);
  } finally {
    isFilterPanelOpen.value = false;
    paginationLoading.value = false;
  }
}
function resetFilters() {
  if (!hasActiveFilters.value) return;
  if (isFiltered.value) {
    characters.value = [];
    currentPage.value = 0;
    totalCount.value = 0;
    sessionStorage.removeItem(CACHE_KEY);
    getMoreCharacters();
  }
  isFiltered.value = false;
  filtersWereApplied.value = false;
  selectedFilters.value = { rarity: null };
  isFilterPanelOpen.value = false;
}
const hasActiveFilters = computed(() => {
  return Object.values(selectedFilters.value).some((v) => v !== null);
});

onMounted(async () => {
  const cached = loadCharactersFromCache();
  if (cached) {
    characters.value = cached.characters;
    totalCount.value = cached.totalCount;
    currentPage.value = cached.currentPage;
    loading.value = false;
  } else {
    await getMoreCharacters();
  }

  getAllVisions();
  getAllRegions();
  getAllWeaponTypes();

  await nextTick();

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) getMoreCharacters();
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
