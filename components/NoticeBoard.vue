<template>
  <article class="w-2/3 space-y-8">
    <h1 class="divider w-full pb-6 text-quaternary">Notice Board</h1>
    <div class="flex flex-col items-center gap-10">
      <template v-for="update in updates">
        <div class="bg-app-tertiary rounded-xl p-4 w-2/3">
          <div
            class="flex flex-col md:flex-row items-start justify-between gap-4 mb-2"
          >
            <h6 class="text-warning leading-snug">
              {{ update.title }}
            </h6>
            <span
              class="text-xs text-gray-400 whitespace-nowrap mt-0.5 font-mono"
            >
              {{ update.slug }}
            </span>
          </div>
          <p class="text-sm text-text leading-relaxed">
            {{ update.content }}
          </p>
        </div>
      </template>
    </div>
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

onMounted(() => {
  fetchUpdates();
});
</script>
