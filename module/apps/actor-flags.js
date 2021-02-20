/**
 * An application class which provides advanced configuration for special character flags which modify an Actor
 * @implements {BaseEntitySheet}
 */
export default class ActorSheetFlags extends BaseEntitySheet {
  static get defaultOptions() {
    const options = super.defaultOptions;
    return mergeObject(options, {
      id: "actor-flags",
      classes: ["kryx_rpg"],
      template: "systems/kryx_rpg/templates/apps/actor-flags.html",
      width: 500,
      closeOnSubmit: true
    });
  }

  /* -------------------------------------------- */

  /** @override */
  get title() {
    return `${game.i18n.localize('KRYX_RPG.FlagsTitle')}: ${this.object.name}`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = {};
    data.actor = this.object;
    data.flags = this._getFlags();
    data.bonuses = this._getBonuses();
    return data;
  }

  /* -------------------------------------------- */

  /**
   * Prepare an object of flags data which groups flags by section
   * Add some additional data for rendering
   * @return {object}
   */
  _getFlags() {
    const flags = {};
    const baseData = this.entity._data;
    for (let [k, v] of Object.entries(CONFIG.KRYX_RPG.characterFlags)) {
      if (!flags.hasOwnProperty(v.section)) flags[v.section] = {};
      let flag = duplicate(v);
      flag.type = v.type.name;
      flag.isCheckbox = v.type === Boolean;
      flag.isSelect = v.hasOwnProperty('choices');
      flag.value = getProperty(baseData.flags, `kryx_rpg.${k}`);
      flags[v.section][`flags.kryx_rpg.${k}`] = flag;
    }
    return flags;
  }

  /* -------------------------------------------- */

  /**
   * Get the bonuses fields and their localization strings
   * @return {Array<object>}
   * @private
   */
  _getBonuses() {
    const bonuses1 = [
      {name: "data.bonuses.mwak.attack", label: "KRYX_RPG.BonusMWAttack"},
      {name: "data.bonuses.mwak.damage", label: "KRYX_RPG.BonusMWDamage"},
      {name: "data.bonuses.rwak.attack", label: "KRYX_RPG.BonusRWAttack"},
      {name: "data.bonuses.rwak.damage", label: "KRYX_RPG.BonusRWDamage"},
      {name: "data.bonuses.msak.attack", label: "KRYX_RPG.BonusMSAttack"},
      {name: "data.bonuses.msak.damage", label: "KRYX_RPG.BonusMSDamage"},
      {name: "data.bonuses.rsak.attack", label: "KRYX_RPG.BonusRSAttack"},
      {name: "data.bonuses.rsak.damage", label: "KRYX_RPG.BonusRSDamage"},
    ]
    const bonuses2 = [
      {name: "data.bonuses.initiative", label: "KRYX_RPG.BonusInitiative"},
      {name: "data.bonuses.abilities.check", label: "KRYX_RPG.BonusAbilityCheck"},
      {name: "data.bonuses.abilities.save", label: "KRYX_RPG.BonusAbilitySave"},
      {name: "data.bonuses.abilities.skill", label: "KRYX_RPG.BonusAbilitySkill"},
      {name: "data.bonuses.spell_dc", label: "KRYX_RPG.BonusSpellDC"},
      {name: "data.bonuses.maneuver_dc", label: "KRYX_RPG.BonusManeuverDC"},
    ]
    const showBonuses1 = this.entity.getFlag("kryx_rpg", "showDamageImmunityAndSuch")
    let bonuses = showBonuses1 ? bonuses1 : []
    bonuses = bonuses.concat(bonuses2)
    for (let b of bonuses) {
      b.value = getProperty(this.object._data, b.name) || "";
    }
    return bonuses;
  }

  /* -------------------------------------------- */

  /**
   * Update the Actor using the configured flags
   * Remove/unset any flags which are no longer configured
   */
  async _updateObject(event, formData) {
    const actor = this.object;
    const updateData = expandObject(formData);

    // Unset any flags which are "false"
    let unset = false;
    const flags = updateData.flags.kryx_rpg;
    for (let [k, v] of Object.entries(flags)) {
      if ([undefined, null, "", false, 0].includes(v)) {
        delete flags[k];
        if (hasProperty(actor._data.flags, `kryx_rpg.${k}`)) {
          unset = true;
          flags[`-=${k}`] = null;
        }
      }
    }

    // Clear any bonuses which are whitespace only
    for ( let b of Object.values(updateData.data.bonuses ) ) {
      for ( let [k, v] of Object.entries(b) ) {
        b[k] = v.trim();
      }
    }

    // Diff the data against any applied overrides and apply
    await actor.update(updateData, {diff: false});
  }
}
