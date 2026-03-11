<template>
  <main class="min-h-screen pb-10">
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
      <!--Content-->
      <article>
        <div class="grid grid-cols-5 gap-8 px-32">
          <div
            v-for="artifact in artifacts"
            class="flex flex-col justify-center items-center aspect-square bg-white/10 border border-white/15 rounded-xl"
          >
            <img
              class="w-2/3"
              :src="artifact.flower_img_url"
              :alt="artifact.name"
              loading="lazy"
            />
            <span class="w-full truncate text-center px-4">{{
              artifact.name
            }}</span>
          </div>
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

async function getAllArtifacts() {
  // Cache check
  const cached = sessionStorage.getItem(CACHE_KEY);
  if (cached) {
    artifacts.value = JSON.parse(cached);
    loading.value = false;
    return;
  }
  // Fetch from DB
  try {
    const { data, error: fetchError } = await supabase
      .from("artifacts")
      .select("*");
    if (fetchError) throw fetchError;
    artifacts.value = data;
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
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
