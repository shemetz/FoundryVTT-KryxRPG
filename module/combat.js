/**
 * Override the default Initiative formula to customize special behaviors of the Kryx RPG system.
 * Apply advantage, proficiency, or bonuses where appropriate
 * Apply the dexterity score as a decimal tiebreaker if requested
 * See Combat._getInitiativeFormula for more detail.
 */
export const _getInitiativeFormula = function (combatant) {
  const actor = combatant.actor;
  if (!actor) return "1d20";
  const init = actor.data.data.attributes.init;
  const initBonus = actor.data.data.traits.bonuses.initiative || null
  const parts = ["1d20", init.mod, (init.prof !== 0) ? init.prof : null, initBonus];
  if (actor.getFlag("kryx_rpg", "initiativeAdv")) parts[0] = "2d20kh";
  if (CONFIG.Combat.initiative.tiebreaker) parts.push(actor.data.data.abilities.dex.value / 100);
  return parts.filter(p => p !== null).join(" + ");
};
