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
    <section v-else>
      <header class="relative flex justify-center items-center mt-8">
        <div class="relative w-[800px] h-[100px] overflow-hidden rounded-xl">
          <img
            class="w-full h-full object-cover object-center"
            src="https://act-upload.hoyoverse.com/event-ugc-hoyowiki/2024/06/13/237301566/f3ca1b7fa11e370118b63bf80513e0c7_6565987184341339932.png?x-oss-process=image%2Fformat%2Cwebp"
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
      <div class="divider px-32"></div>
      <article class="px-32">
        <!--Weapon Card-->
        <div class="grid grid-cols-4 gap-8">
          <template v-for="weapon in weapons">
            <div
              class="flex flex-col justify-center items-center bg-white/10 h-72 rounded-xl space-y-2"
            >
              <div
                class="rounded-2xl"
                :class="{
                  'rarity-5': weapon.rarity === 5,
                  'rarity-4': weapon.rarity === 4,
                }"
              >
                <img class="w-36" :src="weapon.img_url" alt="" />
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
</template>

<script setup>
const supabase = useSupabaseClient();

const loading = ref(false);
const error = ref(null);

const paginationLoading = ref(false);
const currentPage = ref(0);
const totalCount = ref(0);
const pageSize = 20;
const scrollTrigger = ref(null);
const noMoreResults = computed(
  () => weapons.value.length >= totalCount.value && totalCount.value > 0,
);

const weapons = ref([]);

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
      .range(from, to);
    if (fetchError) throw fetchError;
    weapons.value.push(...data);
    totalCount.value = count;
    currentPage.value++;
  } catch (fetchError) {
    error.value = fetchError;
    console.log(fetchError);
  } finally {
    loading.value = false;
    paginationLoading.value = false;
  }
}

onMounted(async () => {
  await getMoreWeapons();
  await nextTick();
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) getMoreWeapons();
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
