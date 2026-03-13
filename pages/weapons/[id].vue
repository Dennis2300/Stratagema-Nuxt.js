<template>
  <main class="min-h-[93vh]">
    <!--Loading-->
    <section v-if="loading">
      <div class="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    </section>
    <!--Error-->
    <article v-else-if="error">
      <div class="flex flex-col items-center mt-12 gap-4">
        <img
          class="rounded-full w-42"
          src="https://act-upload.hoyoverse.com/event-ugc-hoyowiki/2025/02/23/151578876/6778b9ab915cd5c7791a4e565189305e_9109751496005555445.png?x-oss-process=image%2Fformat%2Cwebp"
          alt=""
        />
        <div class="text-center">
          <h4 class="leading-none text-white/50">404</h4>
          <h2 class="text-center m-0 leading-none">No Weapon Found!</h2>
          <p>
            The weapon you're looking for doesn't exist or has been removed from
            the armory.
          </p>
        </div>
      </div>
    </article>
    <!--Content-->
    <article v-else class="md:px-32 py-4 md:py-12 space-y-8">
      <!--Weapon img, name % rarity-->
      <div class="flex items-start gap-4">
        <div
          class="w-32 h-32 rounded-xl shrink-0"
          :class="{
            'rarity-5': weapon.rarity === 5,
            'rarity-4': weapon.rarity === 4,
            'rarity-3': weapon.rarity === 3,
          }"
        >
          <img
            class="w-full h-full object-cover"
            :src="weapon.img_url"
            :alt="weapon.name"
            fetchpriority="high"
          />
        </div>
        <div class="flex flex-col">
          <span class="text-4xl leading-none">{{ weapon.name }}</span>
          <div class="space-x-2 flex items-center mt-1">
            <span class="badge badge-primary">{{ weapon.type.name }}</span>
            <span>
              <span
                v-for="n in weapon.rarity"
                :key="n"
                class="text-2xl leading-none text-yellow-500"
                >★</span
              >
            </span>
          </div>
          <p class="mt-2 text-white/66 hidden md:block">
            {{ weapon.description }}
          </p>
        </div>
      </div>
      <!--Weapon Stats-->
      <div>
        <h4 class="divider divider-start font-freeman uppercase mt-6 md:mb-0">
          Weapon Stats
        </h4>
        <p class="text-center mb-2 text-white/50">
          All weapon stats shown at max level (Lv. 90)
        </p>
        <div class="grid grid-cols-2 gap-3 mb-4">
          <div class="bg-white/10 border border-white/25 rounded-lg p-4">
            <p class="text-xs text-base-content/60 mb-1">Base Attack</p>
            <p class="text-2xl font-medium">{{ weapon.base_attack }}</p>
          </div>
          <div class="bg-white/10 border border-white/25 rounded-lg p-4">
            <p class="text-xs text-base-content/60 mb-1">
              {{ weapon.bonus_effect_type }}
            </p>
            <p class="text-2xl font-medium">{{ formattedValue }}</p>
          </div>
        </div>
        <div class="bg-white/10 border border-white/25 rounded-xl p-4">
          <p
            class="text-xs font-medium text-base-content/50 uppercase tracking-wider mb-2"
          >
            Passive
          </p>
          <MarkdownRender :content="weapon.attribute" />
        </div>
      </div>
      <!--Related Characters-->
      <div>
        <h4 class="divider divider-start font-freeman uppercase my-6">
          Related Character(s)
        </h4>
        <div class="bg-white/10 border border-white/25 rounded-xl px-4">
          <div class="flex flex-wrap justify-center md:justify-start gap-6">
            <div
              v-for="related in relatedCharacters"
              :key="related.id"
              class="my-4 hover:-translate-y-1 transition"
            >
              <NuxtLink
                :to="`/characters/${related.character.id}`"
                target="_blank"
              >
                <img
                  class="w-24 rounded-xl border border-white/75"
                  :class="{
                    'rarity-5': related.character.rarity === 5,
                    'rarity-4': related.character.rarity === 4,
                    'rarity-3': related.character.rarity === 3,
                  }"
                  :src="related.character.img_url"
                  alt=""
                />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </article>
  </main>
  <Footer />
</template>

<script setup>
const route = useRoute();
const loading = ref(true);
const weapon = ref(null);
const error = ref(null);
const relatedCharacters = ref([]);
const supabase = useSupabaseClient();

const nonPercentageTypes = ["Elemental Mastery"];

const formattedValue = computed(() => {
  const isPercent = !nonPercentageTypes.includes(
    weapon.value?.bonus_effect_type,
  );
  return `${weapon.value?.bonus_effect_value}${isPercent ? "%" : ""}`;
});

async function getWeaponById() {
  try {
    const { data, error: fetchError } = await supabase
      .from("weapons")
      .select("*, type(name)")
      .eq("id", route.params.id)
      .single();
    if (fetchError) throw fetchError;
    weapon.value = data;
  } catch (error) {
    error.value = error;
    console.log(error);
  } finally {
    loading.value = false;
  }
}

async function getRelatedCharacters() {
  try {
    const { data, error: fetchError } = await supabase
      .from("character_weapon")
      .select("*, character(*)")
      .eq("weapon", route.params.id);
    if (fetchError) throw fetchError;
    relatedCharacters.value = data;
  } catch (error) {
    error.value = error;
    console.log(error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  getWeaponById();
  getRelatedCharacters();
});
</script>
