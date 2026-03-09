export function useCharacter(id) {
  const supabase = useSupabaseClient();

  const { data, error: fetchError } = useAsyncData(`character-${id}`, () =>
    supabase
      .from("characters")
      .select(
        "*, vision(*), weapon_type(id, name), regions:character_region(region(id, name))",
      )
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error) throw error;
        return data;
      }),
  );

  const character = computed(() => data.value);
  const error = computed(() => fetchError.value);

  return { character, error };
}
