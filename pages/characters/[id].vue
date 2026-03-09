<template>
  <main>
    <article v-if="character" class="relative">
      <!--Background-->
      <div class="flex justify-center">
        <img class="opacity-15" :src="character.splash_art_url" alt="" />
      </div>
      <section class="absolute top-0 left-0 w-full px-32 py-10">
        <!--Avatar & Tags-->
        <div class="flex items-center gap-4">
          <div class="relative w-32 h-32">
            <div
              class="rounded-full overflow-hidden"
              :class="{
                'rarity-5': character.rarity === 5,
                'rarity-4': character.rarity === 4,
              }"
            >
              <img
                class="w-full h-full object-cover object-center"
                :src="character.img_url"
                alt=""
              />
            </div>
            <img
              class="absolute w-12 -top-3 -left-3 bg-gray-700 rounded-full"
              :src="character.vision.img_url"
              alt=""
            />
          </div>
          <div>
            <h2 class="font-acme">{{ character.name }}</h2>
            <div class="space-x-4">
              <span class="badge badge-primary">{{ character.role }}</span>
              <span class="badge badge-primary">{{
                character.vision.name
              }}</span>
              <span class="badge badge-primary">{{
                character.weapon_type.name
              }}</span>
              <span class="badge badge-primary">{{ character.main_stat }}</span>
            </div>
          </div>
        </div>
      </section>
    </article>
  </main>
</template>

<script setup>
const route = useRoute();
const { character, error } = await useCharacter(route.params.id);
</script>
