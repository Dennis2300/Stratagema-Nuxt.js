export function useCharacter(id) {
  const supabase = useSupabaseClient();

  const CHARACTER_SELECT = `
  *,
  vision(name, img_url),
  weapon_type(name, img_url),
  regions:character_region(region(name)),
  affiliations:character_affiliation(affiliation(name)),
  voices:voice_actors(language, name, link),
  signature_dish:signature_dish(*),
  artifacts:character_artifact(artifact(*, two_piece_effect(name)), rank),
  weapons:character_weapon(weapon(name, rarity, base_attack, bonus_effect_type, bonus_effect_value, img_url), rank),
  builds:builds(character, details, title, stat:build_stat(build, slot, stat, rank)),
  ascensions:character_ascension(material_ascension(*), amount),
  enhancements:character_enhancement(material_enhancements(*), amount),
  talents:character_talent(material_talents(*), amount),
  local_specialty:character_local_specialty(local_specialty(*)),
  level_up_material:character_level_up_material(level_up_material(*), amount)
`;

  const { data, error: fetchError } = useAsyncData(`character-${id}`, () =>
    supabase
      .from("characters")
      .select(CHARACTER_SELECT)
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
