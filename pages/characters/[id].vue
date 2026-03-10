<template>
  <main>
    <article v-if="character" class="relative">
      <!--Background-->
      <div class="flex justify-center">
        <img class="opacity-15" :src="character.splash_art_url" alt="" />
      </div>
      <section class="absolute top-0 left-0 w-full px-32 py-12 space-y-8">
        <!--Avatar, Tags & Voice Actors-->
        <div class="flex justify-between items-center">
          <!--Avatar & Tags-->
          <div class="flex items-center gap-4">
            <div class="relative w-42 h-42">
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
                class="absolute w-16 -top-5 -left-5 bg-gray-700 rounded-full"
                :src="character.vision.img_url"
                alt=""
              />
            </div>
            <div>
              <h2 class="font-acme">{{ character.name }}</h2>
              <div class="space-x-2">
                <span class="badge badge-primary">{{ character.role }}</span>
                <span class="badge badge-primary">{{
                  character.vision.name
                }}</span>
                <span class="badge badge-primary">{{
                  character.weapon_type.name
                }}</span>
                <span class="badge badge-primary">{{
                  character.main_stat
                }}</span>
              </div>
            </div>
          </div>
          <!--Voice Actors-->
          <div class="space-y-2">
            <div>
              <h5 class="uppercase tracking-wider text-white/60 leading-none">
                Voice Actors
              </h5>
              <span class="text-xs">Click a name to view their page</span>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div
                class="flex items-center gap-2.5 bg-white/5 rounded-lg px-3 py-2.5 border border-white/5"
                v-for="(voices, language) in groupedVoices"
              >
                <span
                  :class="`fi fi-${language} rounded-sm text-base shrink-0`"
                ></span>
                <span class="text-sm text-white/80 flex flex-col">
                  <template v-for="(actor, i) in voices" :key="i">
                    <a
                      :href="actor.link"
                      target="_blank"
                      class="hover:text-accent transition cursor-pointer"
                      >{{ actor.name }}</a
                    >
                    <span
                      v-if="i < voices.length - 1"
                      class="text-white/30 text-xs leading-none"
                      >&</span
                    >
                  </template>
                </span>
              </div>
            </div>
          </div>
        </div>
        <!--Character Info-->
        <div class="grid grid-cols-2 gap-x-24 gap-y-4">
          <!--Rarity-->
          <div
            class="flex justify-between text-2xl font-acme bg-white/5 border border-white/5 rounded-lg px-4 py-2"
          >
            <span class="text-app-muted">Rarity</span>
            <div>
              <span
                v-for="n in character.rarity"
                :key="n"
                class="text-2xl leading-none"
                :class="
                  character.rarity === 5 ? 'text-amber-400' : 'text-purple-400'
                "
                >★</span
              >
            </div>
          </div>
          <!--Cons-->
          <div
            class="flex justify-between text-2xl font-acme bg-white/5 border border-white/5 rounded-lg px-4 py-2"
          >
            <span class="text-app-muted">Constellation</span>
            <span>{{ character.constellation }}</span>
          </div>
          <!--Birthday-->
          <div
            class="flex justify-between text-2xl font-acme bg-white/5 border border-white/5 rounded-lg px-4 py-2"
          >
            <span class="text-app-muted">Birthday</span>
            <span>{{ character.birthday }}</span>
          </div>
          <!--Weapon Type-->
          <div
            class="flex justify-between text-2xl font-acme bg-white/5 border border-white/5 rounded-lg px-4 py-2"
          >
            <span class="text-app-muted">Weapon Type</span>
            <div class="flex gap-2 items-center">
              <span>{{ character.weapon_type.name }}</span>
              <img class="w-8" :src="character.weapon_type.img_url" alt="" />
            </div>
          </div>
          <!--Signature Dish-->
          <div
            class="flex justify-between text-2xl font-acme bg-white/5 border border-white/5 rounded-lg px-4 py-2"
          >
            <span class="text-app-muted">Signature Dish</span>
            <span>{{ character.signature_dish.name }}</span>
          </div>
          <!--Release Date-->
          <div
            class="flex justify-between text-2xl font-acme bg-white/5 border border-white/5 rounded-lg px-4 py-2"
          >
            <span class="text-app-muted">Release Date</span>
            <span>
              {{
                character.release_date
                  ? new Date(character.release_date).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )
                  : "UPCOMING"
              }}
            </span>
          </div>
        </div>
      </section>
    </article>
  </main>
</template>

<script setup>
import "flag-icons/css/flag-icons.min.css";
const route = useRoute();
const { character, error } = await useCharacter(route.params.id);

const languageOrder = ["us", "jp", "cn", "kr"];

const groupedVoices = computed(() => {
  const grouped = character.value.voices.reduce((acc, voice) => {
    if (!acc[voice.language]) acc[voice.language] = [];
    acc[voice.language].push({ name: voice.name, link: voice.link });
    return acc;
  }, {});

  return Object.fromEntries(
    Object.entries(grouped).sort(
      ([a], [b]) => languageOrder.indexOf(a) - languageOrder.indexOf(b),
    ),
  );
});
</script>
