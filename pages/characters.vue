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
    <section v-else class="flex flex-col items-center mt-8">
      <header class="relative">
        <div class="relative w-[800px] h-[150px] overflow-hidden rounded-xl">
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
      <article>
        <div v-for="character in characters">
          <p>{{ character.name }}</p>
        </div>
      </article>
    </section>
  </main>
</template>

<script setup>
const loading = ref(null);
const error = ref(null);
const supabase = useSupabaseClient();

const characters = ref([]);

async function getAllCharacters() {
  try {
    const { data, err } = await supabase
      .from("characters")
      .select("name");
    if (err) throw err;
    characters.value = data;
  } catch (e) {
    error.value = e;
    console.log(e);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  getAllCharacters();
});
</script>
