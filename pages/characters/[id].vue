<template>
  <template>
    <main>
      <ErrorMessage v-if="error" :error="error" />
      <template v-else-if="character">
        <div>
          <img :src="character.img_url" alt="" />
          {{ character.name }}
        </div>
      </template>
      <NoCharacterFound v-else />
    </main>
  </template>
</template>

<script setup>
const route = useRoute();
const { character, error } = await useCharacter(route.params.id);
</script>
