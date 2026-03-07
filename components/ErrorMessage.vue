<template>
  <section class="flex flex-col items-center gap-4 text-center mt-10">
    <p class="text-4xl">⚠️</p>
    <h2 class="text-xl font-bold text-red-400">Something went wrong</h2>
    <p class="text-sm text-gray-400">{{ error.message }}</p>
  </section>
</template>

<script setup>
defineProps({
  error: Object,
});
</script>
