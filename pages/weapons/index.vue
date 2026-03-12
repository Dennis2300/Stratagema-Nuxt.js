<template>
  <main class="min-h-screen">
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
    <section v-else>
      <header class="relative flex justify-center items-center my-8">
        <div class="relative w-[800px] h-[100px] overflow-hidden rounded-xl">
          <img
            class="w-full h-full object-cover object-center"
            src="https://act-upload.hoyoverse.com/event-ugc-hoyowiki/2024/06/13/237301566/f3ca1b7fa11e370118b63bf80513e0c7_6565987184341339932.png?x-oss-process=image%2Fformat%2Cwebp"
            alt="Weapon Archive"
          />
          <!-- dark overlay -->
          <div class="absolute inset-0 bg-black/60"></div>
        </div>
        <h2
          class="absolute inset-0 flex items-center justify-center font-rubik-dirt tracking-wide"
        >
          Weapons Archive
        </h2>
      </header>
      <!--Filter-->
      <div class="flex flex-col gap-3 px-32">
        <!-- Rarity -->
        <div class="flex items-center gap-2 flex-wrap">
          <span
            class="text-xs text-gray-400 uppercase tracking-widest w-20 shrink-0"
            >Rarity</span
          >
          <p
            v-for="star in [5, 4, 3]"
            :key="star"
            @click="toggleFilter('rarity', star)"
            :class="
              selectedFilters.rarity === star
                ? 'bg-white/25 border-white/25'
                : 'bg-white/5 border-white/25'
            "
            class="cursor-pointer border px-3 py-1 rounded-lg transition-all"
          >
            {{ star }} Star
          </p>
        </div>
        <!-- Weapon Types -->
        <div class="flex items-center gap-2 flex-wrap">
          <span
            class="text-xs text-gray-400 uppercase tracking-widest w-20 shrink-0"
            >Type</span
          >
          <div class="flex gap-2 flex-wrap">
            <p
              v-for="type in weapon_types"
              :key="type.id"
              @click="toggleFilter('weapon_type', type.id)"
              :class="
                selectedFilters.weapon_type === type.id
                  ? 'bg-white/25 border-white/25'
                  : 'bg-white/5 border-white/25'
              "
              class="cursor-pointer border px-3 py-1 rounded-lg transition-all"
            >
              {{ type.name }}
            </p>
          </div>
        </div>
        <!-- Bonus Effects -->
        <div class="flex items-center flex-wrap justify-between">
          <div class="flex items-center gap-2 flex-wrap">
            <span
              class="text-xs text-gray-400 uppercase tracking-widest w-20 shrink-0"
              >Effect</span
            >
            <p
              v-for="weapon_effect in weapon_bonus_effect_types"
              :key="weapon_effect"
              @click="toggleFilter('bonus_effect', weapon_effect)"
              :class="
                selectedFilters.bonus_effect === weapon_effect
                  ? 'bg-white/25 border-white/25'
                  : 'bg-white/5 border-white/25'
              "
              class="cursor-pointer border px-3 py-1 rounded-lg transition-all hover:bg-white/25"
            >
              {{ weapon_effect }}
            </p>
          </div>
          <div class="space-x-4">
            <button
              class="btn btn-success"
              @click="applyFilters"
              :disabled="!hasSelectedFilters"
            >
              Apply
            </button>
            <button
              class="btn btn-warning"
              @click="resetFilters"
              :disabled="!isFiltered"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
      <div class="divider px-32"></div>
      <!--Content-->
      <article class="px-32">
        <!--Weapon Card-->
        <div class="grid grid-cols-4 gap-8">
          <template v-for="weapon in weapons">
            <div
              class="flex flex-col justify-center items-center bg-white/10 h-72 rounded-xl space-y-2 border border-white/15"
            >
              <div
                class="rounded-2xl"
                :class="{
                  'rarity-5': weapon.rarity === 5,
                  'rarity-4': weapon.rarity === 4,
                  'rarity-3': weapon.rarity === 3,
                }"
              >
                <img
                  class="w-36"
                  :src="weapon.img_url"
                  :alt="weapon.name"
                  loading="lazy"
                />
              </div>
              <h6 class="font-acme tracking-wide">{{ weapon.name }}</h6>
              <span class="badge badge-info badge-outline"
                >Base Attack: {{ weapon.base_attack }}</span
              >
              <span class="badge badge-secondary badge-outline"
                >{{ weapon.bonus_effect_type }}:
                {{ weapon.bonus_effect_value }}</span
              >
            </div>
          </template>
        </div>
        <!--Loading Infinite-->
        <div class="flex justify-center py-4">
          <span
            v-if="paginationLoading"
            class="loading loading-spinner loading-md"
          ></span>
          <span v-else-if="noMoreResults" class="text-gray-400"
            >No more characters</span
          >
        </div>
        <!--Scroll Trigger-->
        <div ref="scrollTrigger"></div>
      </article>
    </section>
  </main>
  <Footer />
</template>

<script setup>
const supabase = useSupabaseClient();
const loading = ref(false);
const error = ref(null);
const paginationLoading = ref(false);
const currentPage = ref(0);
const totalCount = ref(0);
const pageSize = 12;
const scrollTrigger = ref(null);
const CACHE_KEY = "weapons_cache";
const weapons = ref([]);
const { weapon_types, fetchWeaponTypes } = useWeaponTypes();
const isFiltered = ref(false);

const weapon_bonus_effect_types = [
  "ATK%",
  "DEF%",
  "HP%",
  "CRIT Rate",
  "CRIT DMG",
  "Energy Recharge",
  "Elemental Mastery",
  "Physical DMG Bonus",
];
const selectedFilters = ref({
  rarity: null,
  weapon_type: null,
  bonus_effect: null,
});

const hasSelectedFilters = computed(() =>
  Object.values(selectedFilters.value).some((v) => v !== null),
);
const noMoreResults = computed(
  () => weapons.value.length >= totalCount.value && totalCount.value > 0,
);

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

function toggleFilter(key, value) {
  selectedFilters.value[key] =
    selectedFilters.value[key] === value ? null : value;
}

function applyFilters() {
  isFiltered.value = true;
  weapons.value = [];
  getFilteredWeapons();
}

function resetFilters() {
  sessionStorage.removeItem(CACHE_KEY);
  isFiltered.value = false;
  selectedFilters.value = {
    rarity: null,
    weapon_type: null,
    bonus_effect: null,
  };
  weapons.value = [];
  currentPage.value = 0;
  getMoreWeapons();
}

async function getMoreWeapons() {
  if (paginationLoading.value || noMoreResults.value) return;
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
      .from("weapons")
      .select("*", { count: "exact" })
      .order("name")
      .range(from, to);

    if (fetchError) throw fetchError;

    weapons.value.push(...data);
    totalCount.value = count;
    currentPage.value++;

    setCache(CACHE_KEY, {
      weapons: weapons.value,
      totalCount: totalCount.value,
      currentPage: currentPage.value,
    });
  } catch (fetchError) {
    error.value = fetchError;
    console.log(fetchError);
  } finally {
    loading.value = false;
    paginationLoading.value = false;
  }
}

async function getFilteredWeapons() {
  paginationLoading.value = true;
  try {
    let query = supabase.from("weapons").select("*").order("name");

    if (selectedFilters.value.rarity)
      query = query.eq("rarity", selectedFilters.value.rarity);

    if (selectedFilters.value.weapon_type)
      query = query.eq("type", selectedFilters.value.weapon_type);

    if (selectedFilters.value.bonus_effect)
      query = query.eq("bonus_effect_type", selectedFilters.value.bonus_effect);

    const { data, error: fetchError } = await query;
    if (fetchError) throw fetchError;

    weapons.value = data;
  } catch (e) {
    error.value = e;
  } finally {
    paginationLoading.value = false;
  }
}

onMounted(async () => {
  fetchWeaponTypes();

  const cached = getCache(CACHE_KEY);
  if (cached) {
    weapons.value = cached.weapons;
    totalCount.value = cached.totalCount;
    currentPage.value = cached.currentPage;
  } else {
    await getMoreWeapons();
  }

  await nextTick();

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !isFiltered.value) getMoreWeapons();
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
