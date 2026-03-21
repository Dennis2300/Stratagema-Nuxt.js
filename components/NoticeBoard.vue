<template>
  <article class="space-y-8">
    <h1 class="divider md:px-32 font-freeman">Notice Board</h1>
    <section class="md:px-32" v-for="update in updates">
      <div class="bg-white/10 border border-white/25 p-4 rounded-xl">
        <div class="flex justify-between">
          <div>
            <h4 class="leading-none text-app-accent">{{ update.title }}</h4>
            <span class="text-white/25">{{ update.slug }}</span>
          </div>
          <div>
            <span class="text-white/25">Posted: </span>
            <span class="text-app-accent">
              {{ formatDate(update.published_at) }}</span
            >
          </div>
        </div>
        <div class="divider mt-0 mb-2"></div>
        <p class="text-app-text">{{ update.content }}</p>
      </div>
    </section>
  </article>
</template>

<script setup>
import { ref, onMounted } from "vue";

const supabase = useSupabaseClient();
const updates = ref([]);

async function fetchUpdates() {
  try {
    const { data, error } = await supabase
      .from("updates")
      .select("*")
      .order("published_at", { ascending: false })
      .limit(3);

    if (error) throw error;

    updates.value = data;
  } catch (err) {
    console.error("Error fetching updates:", err);
  }
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

onMounted(() => {
  fetchUpdates();
});
</script>
