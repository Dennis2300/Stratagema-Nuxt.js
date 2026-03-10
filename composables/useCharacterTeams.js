export function useCharacterTeams(characterId) {
  const supabase = useSupabaseClient();

  const CHARACTER_TEAM_SELECT = `
    slot,
    team(
      id, name, detail,
      members:character_team(
        slot,
        character:characters(id, name, img_url, rarity)
      )
    )
  `;

  const { data, error } = useAsyncData(`character-teams-${characterId}`, () =>
    supabase
      .from("character_team")
      .select(CHARACTER_TEAM_SELECT)
      .eq("character", characterId)
      .eq("is_primary", true)
      .then(({ data, error }) => {
        if (error) throw error;
        return data.map((row) => {
          row.team.members.sort((a, b) => a.slot - b.slot);
          return row.team;
        });
      })
  );

  const teams = computed(() => data.value ?? []);

  return { teams, error };
}