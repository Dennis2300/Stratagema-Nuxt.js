<template>
  <main v-if="error" class="mt-8">
    <NoCharacterFound />
  </main>
  <main v-else-if="character">
    <img :src="character.img_url" alt="">
    {{ character.name }}
  </main>
</template>

<script setup>
const route = useRoute();
const { character, error } = await useCharacter(route.params.id);
</script>
