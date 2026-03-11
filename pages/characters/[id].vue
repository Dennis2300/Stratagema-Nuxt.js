<template>
  <main>
    <article v-if="character" class="relative">
      <!--Background-->
      <div class="absolute top-0 left-1/2 -translate-x-1/2">
        <img class="opacity-10" :src="character.splash_art_url" alt="" />
      </div>
      <!--Content-->
      <section class="w-full px-32 py-12 space-y-8">
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
                class="absolute w-16 -top-5 -left-5 bg-gray-700 border border-white/25 rounded-full"
                :src="character.vision.img_url"
                alt=""
              />
            </div>
            <div>
              <h2 class="font-acme">{{ character?.name }}</h2>
              <div class="space-x-2">
                <span class="badge badge-primary">{{ character.role }}</span>
                <span class="badge badge-primary">{{
                  character.vision?.name
                }}</span>
                <span class="badge badge-primary">{{
                  character.weapon_type?.name
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
                class="flex items-center gap-2.5 bg-white/10 rounded-lg px-3 py-2.5 border border-white/25"
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
                      >{{ actor?.name }}</a
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
        <div class="grid grid-cols-2 gap-x-20 gap-y-4">
          <!--Rarity-->
          <div
            class="flex justify-between text-2xl font-acme bg-white/10 border border-white/25 rounded-lg px-4 py-2"
          >
            <span>Rarity</span>
            <div>
              <span
                v-for="n in character.rarity"
                :key="n"
                class="text-2xl leading-none text-yellow-500"
                >★</span
              >
            </div>
          </div>
          <!--Cons-->
          <div
            class="flex justify-between text-2xl font-acme bg-white/10 border border-white/25 rounded-lg px-4 py-2"
          >
            <span>Constellation</span>
            <span>{{ character.constellation }}</span>
          </div>
          <!--Birthday-->
          <div
            class="flex justify-between text-2xl font-acme bg-white/10 border border-white/25 rounded-lg px-4 py-2"
          >
            <span>Birthday</span>
            <span>{{ character.birthday }}</span>
          </div>
          <!--Weapon Type-->
          <div
            class="flex justify-between text-2xl font-acme bg-white/10 border border-white/25 rounded-lg px-4 py-2"
          >
            <span>Weapon Type</span>
            <div class="flex gap-2 items-center">
              <span>{{ character.weapon_type?.name }}</span>
              <img class="w-8" :src="character.weapon_type.img_url" alt="" />
            </div>
          </div>
          <!--Signature Dish-->
          <div
            class="flex justify-between text-2xl font-acme bg-white/10 border border-white/25 rounded-lg px-4 py-2"
          >
            <span>Signature Dish</span>
            <span v-if="character.signature_dish">{{
              character.signature_dish?.name
            }}</span>
            <span v-else class="text-error">N/A</span>
          </div>
          <!--Release Date-->
          <div
            class="flex justify-between text-2xl font-acme bg-white/10 border border-white/25 rounded-lg px-4 py-2"
          >
            <span>Release Date</span>
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
        <!--Weapons & Artifacts-->
        <div class="grid grid-cols-2 gap-x-20 gap-y-4">
          <!--Weapons-->
          <div
            class="bg-white/10 border border-white/25 rounded-lg px-4 pt-2 pb-4 h-fit"
            v-if="character.weapons?.length > 0"
          >
            <h4 class="divider font-freeman">Best Weapons</h4>
            <div class="space-y-6">
              <template v-for="a in character.weapons">
                <div class="flex justify-between items-center">
                  <div class="flex gap-4 items-center">
                    <div
                      class="rounded-xl"
                      :class="{
                        'rarity-5': a.weapon.rarity === 5,
                        'rarity-4': a.weapon.rarity === 4,
                      }"
                    >
                      <img class="w-20 h-20" :src="a.weapon.img_url" alt="" />
                    </div>
                    <div class="space-y-1">
                      <h6>{{ a.weapon?.name }}</h6>
                      <div class="flex gap-2">
                        <span class="badge badge-outline badge-secondary"
                          >Base Attack: {{ a.weapon.base_attack }}</span
                        >
                        <span class="badge badge-outline badge-accent"
                          >{{ a.weapon.bonus_effect_type }}:
                          {{ a.weapon.bonus_effect_value }}</span
                        >
                      </div>
                    </div>
                  </div>
                  <span class="badge badge-primary">#{{ a.rank }}</span>
                </div>
              </template>
            </div>
          </div>
          <!--Artifacts-->
          <div
            class="bg-white/10 border border-white/25 rounded-lg px-4 pt-2 pb-4 h-fit"
            v-if="character.artifacts?.length > 0"
          >
            <h4 class="divider font-freeman">Best Artifacts</h4>
            <div class="space-y-6">
              <template
                v-for="(artifacts, rank) in groupedArtifacts"
                :key="rank"
              >
                <div class="flex justify-between items-center">
                  <div class="flex flex-col gap-3">
                    <div
                      v-for="a in artifacts"
                      :key="a.artifact?.name"
                      class="flex gap-4 items-center"
                    >
                      <div class="rounded-xl rarity-5">
                        <img
                          class="w-20 h-20"
                          :src="a.artifact.flower_img_url"
                          alt=""
                        />
                      </div>
                      <div class="flex flex-col space-y-3">
                        <div>
                          <span class="leading-none text-xs text-info">
                            {{
                              artifacts.length > 1
                                ? "2 Piece Effect"
                                : "4 Piece Effect"
                            }}
                          </span>
                          <h6 class="leading-none">{{ a.artifact?.name }}</h6>
                        </div>
                        <span class="badge badge-warning badge-outline">{{
                          a.artifact.two_piece_effect?.name
                        }}</span>
                      </div>
                    </div>
                  </div>
                  <span class="badge badge-primary">#{{ rank }}</span>
                </div>
              </template>
            </div>
          </div>
        </div>
        <!--Builds-->
        <div
          class="bg-white/10 border border-white/25 rounded-lg p-4"
          v-if="character?.builds?.length > 0"
        >
          <template v-for="build in character.builds">
            <h4 class="divider font-freeman tracking-wide mb-8">
              {{ build.title }}
            </h4>
            <div class="space-y-4">
              <!--Main & Sub Stats-->
              <div class="grid grid-cols-2 gap-x-20">
                <!--Main Stats-->
                <div class="space-y-3">
                  <div
                    class="flex justify-between bg-app-secondary/75 rounded-lg py-2 px-3 border border-white/15"
                    v-for="stat in getMainStats(build.stat)"
                    :key="stat.slot"
                  >
                    <span class="capitalize">{{ stat.slot }}</span>
                    <span class="text-app-accent" v-html="stat.stat"></span>
                  </div>
                </div>
                <!--Sub Stats-->
                <div class="space-y-3">
                  <div
                    class="flex justify-between bg-app-secondary/75 rounded-lg py-2 px-3 border border-white/15"
                    v-for="stat in getSubstats(build.stat)"
                    :key="stat.slot"
                  >
                    <span class="text-app-accent">{{ stat.stat }}</span>
                    <span>#{{ stat.rank }}</span>
                  </div>
                </div>
              </div>
              <!--Build Details-->
              <div>
                <h3 class="font-freeman text-app-accent">Build Details</h3>
                <MarkdownRender v-if="build.details" :content="build.details" />
                <p v-else class="text-red-500 text-center">
                  Come back later for the build details.
                </p>
              </div>
            </div>
          </template>
        </div>
        <!--Teams-->
        <div
          class="bg-white/10 border border-white/25 rounded-lg p-4"
          v-if="teams.length > 0"
        >
          <h4 class="divider font-freeman tracking-wide mb-8">
            {{ character.name }} Teams
          </h4>
          <div class="grid grid-cols-2 gap-x-20 gap-y-10">
            <template v-for="team in teams">
              <div class="space-y-4">
                <h6 class="divider px-32 font-freeman tracking-wide">
                  {{ team.name }}
                </h6>
                <div class="flex justify-center gap-8">
                  <template v-for="member in team.members">
                    <NuxtLink
                      :class="{
                        'pointer-events-none':
                          member.character.id === character.id,
                      }"
                      :to="`/characters/${member.character.id}`"
                      target="_blank"
                    >
                      <div
                        class="flex flex-col justify-center items-center group"
                      >
                        <img
                          class="w-20 rounded-xl"
                          :class="{
                            'rarity-5': member.character.rarity === 5,
                            'rarity-4': member.character.rarity === 4,
                          }"
                          :src="member.character.img_url"
                          alt=""
                        />
                        <div class="w-20 mt-1 truncate text-center">
                          <span class="group-hover:text-info transition">{{
                            member.character.name
                          }}</span>
                        </div>
                      </div>
                    </NuxtLink>
                  </template>
                </div>
              </div>
            </template>
          </div>
        </div>
        <!--Materials-->
        <div class="bg-white/10 border border-white/25 rounded-lg p-4">
          <h4 class="font-acme divider">{{ character.name }} Materials</h4>
          <p class="text-center text-gray-500">
            This is all the materials needed for Character level 90 and max out
            all Talents to level 10
          </p>
          <div class="space-y-8">
            <!--Ascenstion-->
            <article class="space-y-2">
              <h4 class="text-tertiary">Ascension</h4>
              <div class="grid grid-cols-4">
                <template v-for="a in sortedAscensions">
                  <div class="flex items-center gap-2">
                    <img
                      class="w-20 bg-app-muted rounded-xl"
                      :src="a.material_ascension.img_url"
                      alt=""
                    />
                    <div class="flex flex-col">
                      <span>{{ a.material_ascension.name }}</span>
                      <strong class="text-accent">x{{ a.amount }}</strong>
                    </div>
                  </div>
                </template>
              </div>
            </article>
            <!--Talents-->
            <article class="space-y-2">
              <h4 class="text-tertiary">Talents</h4>
              <div class="space-y-4 md:grid md:grid-cols-4">
                <div class="flex items-center gap-3">
                  <img
                    class="w-20 bg-app-muted rounded-xl"
                    src="https://wiki.hoyolab.com/_ipx/f_webp/https://bbs.hoyolab.com/hoyowiki/picture/object/Crown%2520of%2520Insight_icon.png"
                    alt=""
                  />
                  <div class="flex flex-col gap-2">
                    <span>Crown Of Insight</span>
                    <strong class="text-accent">x3</strong>
                  </div>
                </div>
                <template
                  v-for="a in sortedTalents"
                  :key="a.material_talents.id"
                >
                  <div class="flex items-center gap-3">
                    <img
                      class="w-20 bg-app-muted rounded-xl"
                      :src="a.material_talents.img_url"
                      alt=""
                    />
                    <div class="flex flex-col gap-2">
                      <span>{{ a.material_talents.name }}</span>
                      <strong class="text-accent">x{{ a.amount }}</strong>
                    </div>
                  </div>
                </template>
              </div>
            </article>
            <!--Enhancement-->
            <article class="space-y-2">
              <h4 class="text-tertiary">Enhancement</h4>
              <div class="space-y-4 md:space-y-0 md:grid md:grid-cols-4">
                <template
                  v-for="a in sortedEnhancements"
                  :key="a.material_enhancements.id"
                >
                  <div class="flex items-center gap-3">
                    <img
                      class="w-20 bg-app-muted rounded-xl"
                      :src="a.material_enhancements.img_url"
                      alt=""
                    />
                    <div class="flex flex-col gap-2">
                      <span>{{ a.material_enhancements.name }}</span>
                      <strong class="text-accent">x{{ a.amount }}</strong>
                    </div>
                  </div>
                </template>
              </div>
            </article>
            <!--Level Up-->
            <article class="space-y-2">
              <h4 class="text-tertiary">Level Up</h4>
              <div class="space-y-4 md:space-y-0 md:grid md:grid-cols-4">
                <template v-for="a in character.level_up_material">
                  <div class="flex items-center gap-3">
                    <img
                      class="w-20 bg-app-muted rounded-xl"
                      :src="a.level_up_material.img_url"
                      alt=""
                    />
                    <div class="flex flex-col gap-2">
                      <span class="w-56 truncate">
                        {{ a.level_up_material.name }}
                        <span
                          v-if="a.level_up_material.is_new"
                          class="text-warning"
                          >(NEW)</span
                        >
                      </span>
                      <strong class="text-accent">x{{ a.amount }}</strong>
                    </div>
                  </div>
                </template>
              </div>
            </article>
            <!--Local Specialty-->
            <article class="space-y-2">
              <h4 class="text-tertiary">Local Specialty</h4>
              <div class="space-y-4 md:space-y-0 md:grid md:grid-cols-4">
                <template v-for="a in character.local_specialty">
                  <div class="flex items-center gap-3">
                    <img
                      class="w-20 bg-app-muted rounded-xl"
                      :src="a.local_specialty.img_url"
                      alt=""
                    />
                    <div class="flex flex-col gap-2">
                      <span>{{ a.local_specialty.name }}</span>
                      <strong class="text-accent">x168</strong>
                    </div>
                  </div>
                </template>
              </div>
            </article>
            <!--Cost-->
            <article class="space-y-2">
              <h4 class="text-tertiary">Cost</h4>
              <div class="space-y-4 md:space-y-0 md:grid md:grid-cols-4">
                <div class="flex items-center gap-3">
                  <img
                    class="w-20 bg-app-muted rounded-xl"
                    src="https://wiki.hoyolab.com/_ipx/f_webp/https://bbs.hoyolab.com/hoyowiki/picture/object/Mora_icon.png"
                    alt=""
                  />
                  <div class="flex flex-col gap-2">
                    <span>Mora</span>
                    <strong class="text-accent">7,050,100</strong>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </article>
    <Footer />
  </main>
</template>

<script setup>
import "flag-icons/css/flag-icons.min.css";
const route = useRoute();
const { character, error } = await useCharacter(route.params.id);
const { teams } = await useCharacterTeams(route.params.id);
const languageOrder = ["us", "jp", "cn", "kr"];

function getMainStats(stats) {
  const mainStats = stats.filter((stat) => stat.slot !== "substat");
  return joinMainStats(mainStats);
}

function joinMainStats(mainStats) {
  const slotOrder = ["sands", "goblet", "circlet"];

  const grouped = mainStats.reduce((acc, stat) => {
    if (!acc[stat.slot]) {
      acc[stat.slot] = [];
    }
    acc[stat.slot].push(stat.stat);
    return acc;
  }, {});

  return Object.entries(grouped)
    .sort(([a], [b]) => slotOrder.indexOf(a) - slotOrder.indexOf(b))
    .map(([slot, statValues]) => ({
      slot,
      stat:
        statValues.length >= 2
          ? statValues.join(' <span class="text-text">or</span> ')
          : statValues[0],
    }));
}

function getSubstats(stats) {
  return stats
    .filter((stat) => stat.slot === "substat")
    .sort((a, b) => a.rank - b.rank);
}

const sortByMaterialId = (items, getMaterialId) => {
  if (!items) return [];
  return [...items].sort((a, b) => getMaterialId(a) - getMaterialId(b));
};

const sortedAscensions = computed(() => {
  return sortByMaterialId(
    character.value?.ascensions,
    (item) => item.material_ascension.id,
  );
});

const sortedEnhancements = computed(() => {
  return sortByMaterialId(
    character.value?.enhancements,
    (item) => item.material_enhancements.id,
  );
});

const sortedTalents = computed(() => {
  return sortByMaterialId(
    character.value?.talents,
    (item) => item.material_talents.id,
  );
});

const groupedVoices = computed(() => {
  const grouped = character.value.voices.reduce((acc, voice) => {
    if (!acc[voice.language]) acc[voice.language] = [];
    acc[voice.language].push({ name: voice?.name, link: voice.link });
    return acc;
  }, {});

  return Object.fromEntries(
    Object.entries(grouped).sort(
      ([a], [b]) => languageOrder.indexOf(a) - languageOrder.indexOf(b),
    ),
  );
});
const groupedArtifacts = computed(() => {
  return character.value.artifacts.reduce((acc, a) => {
    if (!acc[a.rank]) acc[a.rank] = [];
    acc[a.rank].push(a);
    return acc;
  }, {});
});
</script>
