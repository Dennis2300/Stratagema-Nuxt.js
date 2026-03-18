<template>
  <main class="min-h-screen pb-10">
    <section>
      <header class="relative flex justify-center items-center mb-8 md:my-8">
        <div class="relative w-[800px] h-[100px] overflow-hidden rounded-xl">
          <img
            class="w-full h-full object-cover object-center flex justify-center items-center"
            src="https://upload-static.hoyoverse.com/hoyolab-wiki/2023/06/07/77454259/7bd0679652002b6cb47945eb61db7407_7959825444362231913.png?x-oss-process=image%2Fformat%2Cwebp"
            alt="Stratagema - Character Archive"
            loading="lazy"
          />
          <!-- dark overlay -->
          <div class="absolute inset-0 bg-black/60"></div>
        </div>
        <h2
          class="absolute inset-0 flex items-center justify-center font-rubik-dirt tracking-wide"
        >
          Artifacts Archive
        </h2>
      </header>
      <!--Search Filter-->
      <div class="flex justify-center">
        <input
          v-model="search"
          type="text"
          placeholder="Search Artifacts..."
          class="input"
        />
      </div>
      <div class="divider px-32"></div>
      <!--Loading-->
      <article v-if="loading">
        <div class="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </article>
      <!--Error-->
      <article v-else-if="error">
        <div class="flex justify-center items-center h-64">
          <ErrorMessage :error="error" />
        </div>
      </article>
      <!--Content-->
      <article>
        <div class="grid grid-cols-2 md:grid-cols-6 gap-8 px-4 md:px-32">
          <NuxtLink
            v-for="artifact in artifacts"
            :to="`/artifacts/${artifact.id}`"
            class="flex flex-col justify-center items-center aspect-square bg-white/10 border border-white/15 rounded-xl"
          >
            <img
              class="w-32"
              :src="artifact.flower_img_url"
              :alt="artifact.name"
              loading="lazy"
            />
            <span class="w-full truncate text-center px-4">{{
              artifact.name
            }}</span>
          </NuxtLink>
        </div>
      </article>
    </section>
  </main>
  <Footer />
</template>

<script setup>
const supabase = useSupabaseClient();
const loading = ref(true);
const error = ref(null);
const artifacts = ref([]);
const search = ref("");

const CACHE_KEY = "artifacts_cache";
const CACHE_DURATION = 60 * 60 * 1000;

function setCache(data) {
  sessionStorage.setItem(
    CACHE_KEY,
    JSON.stringify({
      data,
      timestamp: Date.now(),
    }),
  );
}

function getCache() {
  const cached = sessionStorage.getItem(CACHE_KEY);
  if (!cached) return null;

  const { data, timestamp } = JSON.parse(cached);
  const isExpired = Date.now() - timestamp > CACHE_DURATION;

  if (isExpired) {
    sessionStorage.removeItem(CACHE_KEY);
    return null;
  }
  return data;
}

async function getAllArtifacts() {
  const cached = getCache();
  if (cached) {
    artifacts.value = cached;
    loading.value = false;
    return;
  }

  try {
    const { data, error: fetchError } = await supabase
      .from("artifacts")
      .select("*");
    if (fetchError) throw fetchError;

    artifacts.value = data;
    setCache(data);
  } catch (e) {
    error.value = e;
    console.log(e);
  } finally {
    loading.value = false;
  }
}

function searchArtifacts() {
  const cached = sessionStorage.getItem(CACHE_KEY);
  const source = cached ? JSON.parse(cached) : [];
  const query = search.value.trim().toLowerCase();

  artifacts.value = query
    ? source.filter((a) => a.name?.toLowerCase().includes(query))
    : source;
}

watch(search, searchArtifacts);

onMounted(() => {
  getAllArtifacts();
});
</script>
