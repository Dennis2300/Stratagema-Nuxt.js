<template>
  <main>
    <!--Loading-->
    <article v-if="loading">
      <div class="flex justify-center items-center min-h-[92vh]">
        <LoadingSpinner />
      </div>
    </article>
    <!--Error-->
    <article v-else-if="error">
      <div class="flex justify-center items-center h-64">
        <ErrorMessage :error="error" />
      </div>
    </article>
    <!--Character By Id-->
    <article v-else-if="character" class="relative">
      <!--Background-->
      <div
        class="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
      >
        <img
          class="opacity-10 pointer-events-none"
          :src="character.splash_art_url"
          :alt="character.name"
          loading="lazy"
        />
      </div>
      <!--Content-->
      <section
        class="w-full px-2 py-6 md:px-32 md:py-12 space-y-6 md:space-y-12"
      >
        <!--Avatar, Tags & Voice Actors-->
        <div
          class="flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <!--Avatar & Tags-->
          <div class="flex items-center gap-4">
            <div class="relative w-32 h-32 md:w-42 md:h-42">
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
                  :alt="character.name"
                  loading="lazy"
                />
              </div>
              <img
                class="absolute w-8 h-8 -top-1.5 -left-1.5 md:w-16 md:h-16 md:-top-5 md:-left-5 bg-gray-700 border border-white/25 rounded-full"
                :src="character.vision.img_url"
                :alt="character.vision.name"
                loading="lazy"
              />
            </div>
            <div>
              <h2 class="font-acme">{{ character?.name }}</h2>
              <div class="flex flex-wrap gap-2">
                <span class="badge badge-primary" v-if="character.role">{{
                  character.role
                }}</span>
                <span
                  class="badge badge-primary"
                  v-if="character.vision?.name"
                  >{{ character.vision?.name }}</span
                >
                <span
                  class="badge badge-primary"
                  v-if="character.weapon_type?.name"
                  >{{ character.weapon_type?.name }}</span
                >
                <span class="badge badge-primary" v-if="character.main_stat">{{
                  character.main_stat
                }}</span>
              </div>
            </div>
          </div>
          <!--Voice Actors-->
          <div class="space-y-2 z-10">
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
                <span :class="`fi fi-${language}`"></span>
                <span class="text-sm text-white/80 flex flex-col">
                  <template v-for="(actor, i) in voices" :key="i">
                    <a
                      :href="actor.link"
                      target="_blank"
                      class="hover:text-accent transition cursor-pointer w-32 truncate"
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
        <div class="grid grid-cols-2 gap-x-3 md:gap-x-20 gap-y-4">
          <!--Rarity-->
          <div
            class="flex flex-col md:flex-row justify-between md:text-2xl font-acme bg-white/10 border border-white/25 rounded-lg px-4 py-2"
          >
            <span class="text-white/75">Rarity</span>
            <div>
              <span
                v-for="n in character.rarity"
                :key="n"
                class="md:text-2xl leading-none text-yellow-500"
                >★</span
              >
            </div>
          </div>
          <!--Cons-->
          <div
            class="flex flex-col md:flex-row justify-between md:text-2xl font-acme bg-white/10 border border-white/25 rounded-lg px-4 py-2"
          >
            <span class="text-white/75">Constellation</span>
            <span class="italic">{{ character.constellation }}</span>
          </div>
          <!--Birthday-->
          <div
            class="flex flex-col md:flex-row justify-between md:text-2xl font-acme bg-white/10 border border-white/25 rounded-lg px-4 py-2"
          >
            <span class="text-white/75">Birthday</span>
            <span>{{ character.birthday }}</span>
          </div>
          <!--Weapon Type-->
          <div
            class="flex flex-col md:flex-row justify-between md:text-2xl font-acme bg-white/10 border border-white/25 rounded-lg px-4 py-2"
          >
            <span class="text-white/75">Weapon Type</span>
            <div class="flex gap-2 items-center">
              <span>{{ character.weapon_type?.name }}</span>
              <img
                class="w-6 md:w-8"
                :src="character.weapon_type.img_url"
                :alt="character.weapon_type.name"
                loading="lazy"
              />
            </div>
          </div>
          <!--Signature Dish-->
          <div
            class="flex flex-col md:flex-row justify-between md:text-2xl font-acme bg-white/10 border border-white/25 rounded-lg px-4 py-2"
          >
            <span class="text-white/75">Signature Dish</span>
            <span v-if="character.signature_dish">{{
              character.signature_dish?.name
            }}</span>
            <span v-else class="text-error">N/A</span>
          </div>
          <!--Release Date-->
          <div
            class="flex flex-col md:flex-row justify-between md:text-2xl font-acme bg-white/10 border border-white/25 rounded-lg px-4 py-2"
          >
            <span class="text-white/75">Release Date</span>
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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-4">
          <!--Weapons-->
          <div
            class="bg-white/10 border border-white/25 rounded-lg px-4 pt-2 pb-4 h-fit"
            v-if="character.weapons?.length > 0"
          >
            <h4 class="divider font-freeman">Best Weapons</h4>
            <div class="space-y-6">
              <template v-for="a in character.weapons">
                <div class="flex justify-between items-center">
                  <NuxtLink
                    :to="`/weapons/${a.weapon.id}?name=${encodeURIComponent(a.weapon?.name)}`"
                    target="_blank"
                    class="flex gap-4 items-center group"
                  >
                    <div
                      class="rounded-xl"
                      :class="{
                        'rarity-5': a.weapon.rarity === 5,
                        'rarity-4': a.weapon.rarity === 4,
                      }"
                    >
                      <img
                        class="w-12 h-12 md:w-20 md:h-20"
                        :src="a.weapon.img_url"
                        :alt="a.weapon.name"
                        loading="lazy"
                      />
                    </div>
                    <div class="space-y-1">
                      <p class="group-hover:underline">{{ a.weapon?.name }}</p>
                      <div class="flex gap-2">
                        <p
                          class="badge badge-outline badge-secondary hidden md:block"
                        >
                          Base Attack: {{ a.weapon.base_attack }}
                        </p>
                        <p
                          class="badge badge-outline badge-accent hidden md:block"
                        >
                          {{ a.weapon.bonus_effect_type }}:
                          {{ a.weapon.bonus_effect_value }}
                        </p>
                      </div>
                    </div>
                  </NuxtLink>
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
                    <NuxtLink
                      v-for="a in artifacts"
                      :key="a.artifact?.name"
                      :to="`/artifacts/${a.artifact.id}?name=${encodeURIComponent(a.artifact?.name)}`"
                      target="_blank"
                      class="flex gap-4 items-center group"
                    >
                      <div class="rounded-xl rarity-5">
                        <img
                          class="w-12 h-12 md:w-20 md:h-20"
                          :src="a.artifact.flower_img_url"
                          :alt="a.artifact.name"
                          loading="lazy"
                        />
                      </div>
                      <div class="flex flex-col space-y-3">
                        <div class="flex flex-col gap-1">
                          <p class="leading-none text-xs text-info">
                            {{
                              artifacts.length > 1
                                ? "2 Piece Effect"
                                : "4 Piece Effect"
                            }}
                          </p>
                          <p
                            class="leading-none max-w-52 md:max-w-none truncate group-hover:underline"
                          >
                            {{ a.artifact?.name }}
                          </p>
                        </div>
                        <p
                          class="badge badge-warning badge-outline max-w-88 truncate hidden md:block"
                        >
                          {{ a.artifact.two_piece_effect?.name }}
                        </p>
                      </div>
                    </NuxtLink>
                  </div>
                  <span class="badge badge-primary">#{{ rank }}</span>
                </div>
              </template>
            </div>
          </div>
        </div>
        <!--Builds-->
        <div
          class="bg-white/10 border border-white/25 rounded-lg p-2 md:p-4"
          v-if="character?.builds?.length > 0"
        >
          <template v-for="build in character.builds">
            <h4 class="divider font-freeman tracking-wide mb-8">
              {{ build.title }}
            </h4>
            <div class="space-y-4">
              <!--Main & Sub Stats-->
              <div class="grid grid-cols-2 gap-x-2 md:gap-x-20">
                <!--Main Stats-->
                <div class="space-y-3">
                  <div
                    class="flex flex-col md:flex-row justify-between bg-app-secondary/75 rounded-lg py-2 px-3 border border-white/15"
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
                    class="flex flex-col md:flex-row justify-between bg-app-secondary/75 rounded-lg py-2 px-3 border border-white/15"
                    v-for="stat in getSubstats(build.stat)"
                    :key="stat.slot"
                  >
                    <span class="text-right block md:hidden"
                      >#{{ stat.rank }}</span
                    >
                    <span class="text-app-accent">{{ stat.stat }}</span>
                    <span class="hidden md:block">#{{ stat.rank }}</span>
                  </div>
                </div>
              </div>
              <!--Build Details-->
              <div class="p-2 md:p-0">
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
          v-if="teams.length > 0"
          class="grid grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-x-32 md:gap-y-8"
        >
          <div
            v-for="team in teams"
            class="bg-white/10 border border-white/50 rounded-lg px-2 pb-2 md:px-4"
          >
            <h5 class="divider divider-start font-freeman">
              {{ character.name }} - {{ team.name }}
            </h5>
            <div class="flex justify-around">
              <!--Primary Character-->
              <div class="space-y-1">
                <div
                  class="w-16 h-16 md:w-24 md:h-24 rounded-xl overflow-hidden"
                  :class="{
                    'rarity-5': character.rarity === 5,
                    'rarity-4': character.rarity === 4,
                  }"
                >
                  <img
                    class="w-full h-full object-cover object-center"
                    :src="character.img_url"
                    :alt="character.name"
                    fetchpriority="high"
                  />
                </div>
                <p class="w-16 md:w-24 text-center overflow-hidden truncate">
                  <span class="font-acme tracking-wide">{{
                    character.name
                  }}</span>
                </p>
              </div>
              <!--Team Characters-->
              <div class="space-y-1" v-for="member in team.character_team">
                <div
                  class="w-16 h-16 md:w-24 md:h-24 rounded-xl overflow-hidden"
                  :class="{
                    'rarity-5': member.character.rarity === 5,
                    'rarity-4': member.character.rarity === 4,
                  }"
                >
                  <img
                    class="w-full h-full object-cover object-center"
                    :src="member.character.img_url"
                    :alt="member.character.name"
                    loading="lazy"
                  />
                </div>
                <p class="w-16 md:w-24 text-center overflow-hidden truncate">
                  <span class="font-freeman tracking-wide">{{
                    member.character.name
                  }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <!--Materials-->
        <div class="bg-white/10 border border-white/25 rounded-lg p-4">
          <h4 class="font-acme divider">{{ character.name }} Materials</h4>
          <p class="text-center text-gray-500 text-xs md:text-base">
            This is all the materials needed for Character level 90 and max out
            all Talents to level 10
          </p>
          <div class="space-y-8">
            <!--Ascenstion-->
            <article class="space-y-2">
              <h4 class="text-tertiary">Ascension</h4>
              <div class="space-y-4 md:grid md:grid-cols-4">
                <template v-for="a in sortedAscensions">
                  <div class="flex items-center gap-2">
                    <img
                      class="w-20 bg-app-muted rounded-xl"
                      :src="a.material_ascension.img_url"
                      :alt="a.material_ascension.name"
                      loading="lazy"
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
                    alt="Crown of Insight"
                    loading="lazy"
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
                      :alt="a.material_talents.name"
                      loading="lazy"
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
                      :alt="a.material_enhancements.name"
                      loading="lazy"
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
                      class="w-20 h-20 bg-app-muted rounded-xl"
                      v-if="a.level_up_material.img_url"
                      :src="a.level_up_material.img_url"
                      :alt="a.level_up_material.name"
                      loading="lazy"
                    />
                    <img
                      class="w-20 h-20 bg-app-muted rounded-xl"
                      v-else
                      src="https://placehold.co/80x80?text=N/A"
                      alt=""
                    />
                    <div class="flex flex-col gap-2">
                      <span
                        class="w-54 flex items-center gap-1 overflow-hidden"
                      >
                        <span class="truncate">
                          {{ a.level_up_material.name }}
                        </span>

                        <span
                          v-if="a.level_up_material.is_new"
                          class="text-warning shrink-0"
                        >
                          (NEW)
                        </span>
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
                      class="w-20 h-20 bg-app-muted rounded-xl"
                      v-if="a.local_specialty.img_url"
                      :src="a.local_specialty.img_url"
                      :alt="a.local_specialty.name"
                      loading="lazy"
                    />
                    <img
                      class="w-20 h-20 bg-app-muted rounded-xl"
                      v-else
                      src="https://placehold.co/80x80?text=N/A"
                      alt=""
                    />
                    <div class="flex flex-col gap-2">
                      <span
                        class="w-54 flex items-center gap-1 overflow-hidden"
                      >
                        <span class="truncate">
                          {{ a.local_specialty.name }}
                        </span>

                        <span
                          v-if="a.local_specialty.is_new"
                          class="text-warning shrink-0"
                        >
                          (NEW)
                        </span>
                      </span>
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
                    alt="Mora"
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
const supabase = useSupabaseClient();

const languageOrder = ["us", "jp", "cn", "kr"];

const loading = ref(true);
const character = ref();
const teams = ref([]);
const error = ref(false);

async function getCharacterById() {
  const CHARACTER_SELECT = `
  *,
  vision(name, img_url),
  weapon_type(name, img_url),
  regions:character_region(region(name)),
  affiliations:character_affiliation(affiliation(name)),
  voices:voice_actors(language, name, link),
  signature_dish:signature_dish(*),
  artifacts:character_artifact(artifact(*, two_piece_effect(name)), rank),
  weapons:character_weapon(weapon(id, name, rarity, base_attack, bonus_effect_type, bonus_effect_value, img_url), rank),
  builds:builds(character, details, title, stat:build_stat(build, slot, stat, rank)),
  ascensions:character_ascension(material_ascension(*), amount),
  enhancements:character_enhancement(material_enhancements(*), amount),
  talents:character_talent(material_talents(*), amount),
  local_specialty:character_local_specialty(local_specialty(*)),
  level_up_material:character_level_up_material(level_up_material(*), amount)
`;
  try {
    const { data, error: fetchError } = await supabase
      .from("characters")
      .select(CHARACTER_SELECT)
      .eq("id", route.params.id)
      .single();
    if (fetchError) throw fetchError;
    character.value = data;
  } catch (error) {
    error.value = fetchError;
    console.log(fetchError);
  } finally {
    loading.value = false;
  }
}

async function getCharacterTeams() {
  try {
    const { data, error: fetchError } = await supabase
      .from("teams")
      .select("*, character_team(*, character(id, name, img_url, rarity))")
      .eq("primary_character", route.params.id)
      .order("slot", { referencedTable: "character_team", ascending: true });
    if (fetchError) throw fetchError;
    teams.value = data;
    teams.value = teams.value.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    error.value = error;
    console.log(error);
  } finally {
    console.log(teams.value);
    loading.value = false;
  }
}

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

onMounted(() => {
  getCharacterById();
  getCharacterTeams();
});
</script>
