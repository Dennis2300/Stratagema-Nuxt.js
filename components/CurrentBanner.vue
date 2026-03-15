<template>
  <article class="space-y-8">
    <h3 class="divider md:px-32 font-freeman">Current Banner</h3>
    <div class="md:px-32 space-y-4">
      <!--Countdown-->
      <div
        class="grid auto-cols-max grid-flow-col gap-5 text-center justify-center"
      >
        <div v-if="countdownValues.days > 0" class="flex flex-col">
          <span class="countdown font-mono text-5xl">
            <span
              :style="`--value:${countdownValues.days};`"
              aria-live="polite"
              :aria-label="countdownValues.days"
            >
              {{ countdownValues.days }}
            </span>
          </span>
          days
        </div>
        <div class="flex flex-col">
          <span class="countdown font-mono text-5xl">
            <span
              :style="`--value:${countdownValues.hours};`"
              aria-live="polite"
              :aria-label="countdownValues.hours"
            >
              {{ countdownValues.hours }}
            </span>
          </span>
          hours
        </div>
        <div class="flex flex-col">
          <span class="countdown font-mono text-5xl">
            <span
              :style="`--value:${countdownValues.minutes};`"
              aria-live="polite"
              :aria-label="countdownValues.minutes"
            >
              {{ countdownValues.minutes }}
            </span>
          </span>
          min
        </div>
        <div class="flex flex-col">
          <span class="countdown font-mono text-5xl">
            <span
              :style="`--value:${countdownValues.seconds};`"
              aria-live="polite"
              :aria-label="countdownValues.seconds"
            >
              {{ countdownValues.seconds }}
            </span>
          </span>
          sec
        </div>
      </div>
      <!--Characters-->
      <div class="flex flex-col md:flex-row justify-center gap-10 md:gap-20">
        <div v-for="a in currentBannerCharacters" :key="a.character.id">
          <NuxtLink
            :to="`/characters/${a.character.id}?name=${encodeURIComponent(
              a.character?.name,
            )}`"
            target="_blank"
            class="flex flex-col items-center gap-2 no-underline text-text group"
          >
            <div
              class="w-32 h-32 rounded-2xl overflow-hidden transition-transform duration-200 ease-out group-hover:-translate-y-1"
              :class="{
                'rarity-5': a.character.rarity === 5,
                'rarity-4': a.character.rarity === 4,
              }"
            >
              <img
                class="w-full h-full object-cover object-center rounded-2xl transition-transform duration-300 ease-out group-hover:scale-105"
                :src="a.character.img_url"
                :alt="a.character.name"
                fetchpriority="high"
              />
            </div>

            <h6 class="font-acme tracking-wide">
              {{ a.character?.name }}
            </h6>
          </NuxtLink>
        </div>
      </div>
      <!--End Date-->
      <div class="text-center">
        <p class="opacity-70">Ends: {{ formattedEndDate }}</p>
      </div>
    </div>
  </article>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed } from "vue";

const supabase = useSupabaseClient();
const currentBannerCharacters = ref([]);
const currentTime = ref(Date.now());
let countdownInterval = null;
const loading = ref(false);
const error = ref(false);

const CACHE_KEY = "banner_characters_cache";
const CACHE_DURATION = 15 * 60 * 1000;

const countdownValues = computed(() => {
  if (!currentBannerCharacters.value.length) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const endDate = currentBannerCharacters.value[0].banner.end_date;
  const end = new Date(endDate).getTime();
  const now = currentTime.value;
  const difference = end - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
});

const formattedEndDate = computed(() => {
  if (!currentBannerCharacters.value.length) return "";

  const endDate = new Date(currentBannerCharacters.value[0].banner.end_date);
  return endDate.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
});

async function fetchCurrentBannerCharacters() {
  const cached = sessionStorage.getItem(CACHE_KEY);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    const isExpired = Date.now() - timestamp > CACHE_DURATION;
    if (!isExpired) {
      currentBannerCharacters.value = data;
      return;
    }
  }
  loading.value = true;
  try {
    let query = supabase
      .from("character_banner")
      .select(
        "*, banner(start_date, end_date), character(id, name, img_url, rarity)",
      );
    const { data, error } = await query;
    if (error) throw error;
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        data,
        timestamp: Date.now(),
      }),
    );
    currentBannerCharacters.value = data;
  } catch (err) {
    console.error("Error fetching Current Banners");
    error.value = true;
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchCurrentBannerCharacters();
  countdownInterval = setInterval(() => {
    currentTime.value = Date.now();
  }, 1000);
});

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
});
</script>
