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
    </section>
    <!--Content-->
    <section v-else class="flex flex-col justify-center items-center space-y-16">
      <!--Navigation Cards-->
      <HomePageNavigation />
      <!-- Current Banner characters-->
      <CurrentBanner />
      <!--Notice Boards-->
      <NoticeBoard />
    </section>
  </main>
</template>

<script setup>
const supabase = useSupabaseClient();
const loading = ref(false);
const error = ref(null);
const updates = ref([]);

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

onMounted(() => {
  getAllUpdates();
});
</script>
