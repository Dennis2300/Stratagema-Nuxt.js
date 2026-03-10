export function useWeaponTypes() {
  const supabase = useSupabaseClient();
  const weapon_types = ref([]);
  const error = ref(null);
  const loading = ref(false);

  async function fetchWeaponTypes() {
    const cached = getCache("weapon_types");
    if (cached) return (weapon_types.value = cached);

    loading.value = true;
    try {
      const { data, error: fetchError } = await supabase
        .from("weapon_types")
        .select("*");

      if (fetchError) throw fetchError;

      weapon_types.value = data;
      setCache("weapon_types", data);
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }
  
  return { weapon_types, error, loading, fetchWeaponTypes };
}

function setCache(key, data, ttl = 60 * 60 * 1000) {
  const entry = {
    data,
    expiresAt: Date.now() + ttl,
  };
  sessionStorage.setItem(key, JSON.stringify(entry));
}
function getCache(key) {
  const cachedData = sessionStorage.getItem(key);
  if (!cachedData) return null;

  const entry = JSON.parse(cachedData);

  if (Date.now() > entry.expiresAt) {
    sessionStorage.removeItem(key);
    return null;
  }

  return entry.data;
}