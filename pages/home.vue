<template>
  <main class="flex flex-col items-center">
    <!--Loading-->
    <section v-if="loading">
      <div class="flex justify-center items-center">
        <LoadingSpinner />
      </div>
    </section>
    <!--Error-->
    <section v-else-if="error">
      <ErrorMessage :error="error" />
    </section>
    <!--Content-->
    <section
      v-else
      class="flex flex-col justify-center items-center space-y-24"
    >
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
const loading = ref(null);
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
