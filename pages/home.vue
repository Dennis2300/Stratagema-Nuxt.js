<template>
  <section class="min-h-screen flex flex-col justify-center items-center">
    <!--Loading-->
    <div v-if="loading">
      <l-trefoil
        size="160"
        stroke="12"
        stroke-length="0.15"
        bg-opacity="0.1"
        speed="1.4"
        color="white"
        scale="5"
      />
    </div>
    <!--Error-->
    <div v-else-if="error" class="flex flex-col items-center gap-4 text-center">
      <p class="text-4xl">⚠️</p>
      <h2 class="text-xl font-bold text-red-400">Something went wrong</h2>
      <p class="text-sm text-gray-400">{{ error.message }}</p>
      <button class="btn btn-soft btn-error" @click="getAllUpdates">
        Try again
      </button>
    </div>
    <!--Content-->
    <div v-else>
      <div>Navigation</div>
      <div>Current Banner</div>
      <div>
        <h1>Notice Board</h1>
        <div v-for="update in updates">
          <h2>{{ update.title }}</h2>
        </div>
      </div>
    </div>
  </section>
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
