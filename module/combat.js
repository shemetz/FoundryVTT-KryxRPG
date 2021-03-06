/**
 * Override the default Initiative formula to customize special behaviors of the Kryx RPG system.
 * Apply advantage, proficiency, or bonuses where appropriate
 * Apply the dexterity score as a decimal tiebreaker if requested
 * See Combat._getInitiativeFormula for more detail.
 */
export const _getInitiativeFormula = function (combatant) {
  const actor = combatant.actor;
  const basicDiceRoll = game.settings.get('kryx_rpg', 'basicDiceRoll')
  if (!actor) return basicDiceRoll;
  const init = actor.data.data.attributes.init;
  const initBonus = actor.data.data.bonuses.initiative || null
  let formula = basicDiceRoll

  if (actor.getFlag("kryx_rpg", "initiativeAdv")) {
    // 2d10
    if (basicDiceRoll === '2d10') formula = '3d10kh2'
    // 1d20
    else formula = '2d20kh1'
  }
  if (actor.getFlag("kryx_rpg", "halflingLucky")) {
    if (basicDiceRoll === '2d10') formula += "[Halfling_Lucky_not_supported_for_2d10]";
    else formula += "r1=1";
  }

  const parts = [formula, init.mod, (init.prof !== 0) ? init.prof : null, (init.bonus !== 0) ? init.bonus : null, initBonus];

  // Optionally apply Dexterity tiebreaker
  const tiebreaker = game.settings.get("kryx_rpg", "initiativeDexTiebreaker");
  if (tiebreaker) parts.push(actor.data.data.abilities.dex.value / 100);
  return parts.filter(p => p !== null).join(" + ");
};
