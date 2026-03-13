<template>
  <main class="min-h-[93vh]">
    <!--Loading-->
    <article v-if="loading">
      <div class="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    </article>
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
    <article v-else>
      <!--Images-->
      <div class="md:px-32 pt-8 md:pt-16">
        <div class="grid grid-cols-5 gap-4 px-4">
          <img
            class="w-32 rarity-5 rounded-2xl"
            :src="artifact.flower_img_url"
            :alt="artifact.name"
            fetchpriority="high"
          />
          <img
            class="w-32 rarity-5 rounded-2xl"
            :src="artifact.plume_img_url"
            :alt="artifact.name"
            fetchpriority="high"
          />
          <img
            class="w-32 rarity-5 rounded-2xl"
            :src="artifact.sands_img_url"
            :alt="artifact.name"
            fetchpriority="high"
          />
          <img
            class="w-32 rarity-5 rounded-2xl"
            :src="artifact.goblet_img_url"
            :alt="artifact.name"
            fetchpriority="high"
          />
          <img
            class="w-32 rarity-5 rounded-2xl"
            :src="artifact.circlet_img_url"
            :alt="artifact.name"
            fetchpriority="high"
          />
        </div>
      </div>
      <!--Name-->
      <div class="my-8 md:px-32">
        <h3 class="text-center leading-none font-acme">{{ artifact.name }}</h3>
      </div>
      <!--Two Piece effect-->
      <div class="mt-8 px-2 md:px-32">
        <h4 class="divider divider-start uppercase font-freeman">
          Two Piece Effect
        </h4>
        <div class="bg-white/10 border border-white/25 p-4 rounded-xl">
          <p>{{ artifact.two_piece_effect.name }}</p>
        </div>
      </div>
      <!--Four Piece effect-->
      <div class="mt-8 px-2 md:px-32">
        <h4 class="divider divider-start uppercase font-freeman">
          Four Piece Effect
        </h4>
        <div class="bg-white/10 border border-white/25 p-4 rounded-xl">
          <p>{{ artifact.four_piece_effect }}</p>
        </div>
      </div>
      <!--Related Characters-->
      <div class="mt-16 px-2 md:px-32">
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
const supabase = useSupabaseClient();
const route = useRoute();
const loading = ref(true);
const artifact = ref(null);
const relatedCharacters = ref([]);
const error = ref(null);

async function getArtifactById() {
  try {
    const { data, error: fetchError } = await supabase
      .from("artifacts")
      .select("*, two_piece_effect(*)")
      .eq("id", route.params.id)
      .single();
    if (fetchError) throw fetchError;
    artifact.value = data;
  } catch (fetchError) {
    error.value = fetchError;
    console.log(error);
  } finally {
    loading.value = false;
  }
}

async function getRelatedCharacters() {
  try {
    const { data, error: fetchError } = await supabase
      .from("character_artifact")
      .select("*, character(*)")
      .eq("artifact", route.params.id);
    if (fetchError) throw fetchError;
    relatedCharacters.value = data.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.character.id === item.character.id),
    );
  } catch (fetchError) {
    error.value = fetchError;
    console.log(fetchError);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  getArtifactById();
  getRelatedCharacters();
});
</script>
