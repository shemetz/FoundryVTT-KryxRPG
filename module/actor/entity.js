import {d20Roll, damageRoll} from "../dice.js";
import ShortRestDialog from "../apps/short-rest.js";
import LongRestDialog from "../apps/long-rest.js";
import SuperpowerUseDialog from "../apps/superpower-use-dialog.js";
import AbilityTemplate from "../pixi/ability-template.js";
import {KRYX_RPG} from '../config.js';
import SecondWindDialog from '../apps/second-wind.js';

/**
 * Extend the base Actor class to implement additional logic specialized for Kryx RPG.
 */
export default class ActorKryx extends Actor {

  static signedValue(number) {
    return (number >= 0 ? "+" : "") + number;
  }

  /* -------------------------------------------- */

  /**
   * Augment the basic actor data with additional dynamic data.
   */
  prepareData() {
    super.prepareData();

    // Get the Actor's data object
    const actorData = this.data;
    const data = actorData.data;
    const flags = actorData.flags.kryx_rpg || {};

    // Prepare Character data
    if (actorData.type === "character") this._prepareCharacterData(actorData);
    else if (actorData.type === "npc") this._prepareNPCData(actorData);

    // Prepare saves
    this._prepareSaves(actorData)

    // Adding signed values
    for (const [id, abl] of Object.entries(data.abilities)) {
      abl.signedValue = ActorKryx.signedValue(abl.value)
      abl.label = KRYX_RPG.abilities[id]
    }
    for (const [id, sav] of Object.entries(data.saves)) {
      sav.signedValue = ActorKryx.signedValue(sav.value)
      sav.label = KRYX_RPG.saves[id]
    }

    // Skill modifiers
    for (const [id, skl] of Object.entries(data.skills)) {
      if (!KRYX_RPG.systemData.skillAbilities.hasOwnProperty(id)) {
        console.warn(`deprecated skill was not deleted from ${this.data.name}: ${id}`)
        continue
      }
      skl.mod = data.abilities[KRYX_RPG.systemData.skillAbilities[id]].value;
      skl.prof = Math.floor(skl.proficiency * data.attributes.prof);
      skl.total = skl.mod + skl.prof;
      skl.signedValue = ActorKryx.signedValue(skl.total);
      skl.passive = 10 + skl.total;
    }

    // Determine Initiative Modifier
    const init = {};
    init.mod = data.abilities.dex.value;
    init.prof = 0;
    init.bonus = new Roll(data.bonuses.initiative.value || "0", this.getRollData()).roll().total;
    init.total = init.mod + init.prof + init.bonus;
    data.attributes.init = init

    // Update soak (damage reduction) from items
    // NOTE: not calculating AC/Defense. This is left for other modules, like DynamicEffects.
    let soak = 0
    for (const item of this.data.items) {
      const itemData = item.data
      if (item.type !== "equipment" || !itemData.armor || !itemData.equipped || !itemData.armor.soak) continue
      soak += itemData.armor.soak
    }
    data.attributes.defense.soak = soak

    if (actorData.items) {
      this._computeResourceProgression();
    }
  }

  /* -------------------------------------------- */

  _prepareSaves(actorData) {
    const data = actorData.data
    const prof = data.attributes.prof
    const a = {}
    Object.entries(actorData.data.abilities).forEach(([abl, ability]) => {
      a[abl] = ability.value
    })
    data.saves.fortitude.value = prof * data.saves.fortitude.proficiency + a["con"]
    data.saves.reflex.value = prof * data.saves.reflex.proficiency + Math.floor((a["str"] + a["dex"]) / 2)
    data.saves.will.value = prof * data.saves.will.proficiency + Math.floor(
      ((a["int"] + a["cha"] + a["wis"]) - Math.min(a["int"], a["cha"], a["wis"])) / 2
    )
  }

  /* -------------------------------------------- */

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    const data = actorData.data;

    const level = data.class.level
    const hdRemaining = level - data.class.healthDiceUsed
    data.details.level = level;
    data.attributes.healthDiceRemaining = hdRemaining;
    data.attributes.tier = Math.floor(level / 5) + 1;
    data.attributes.prof = data.attributes.tier + 1;

    // Experience required for next level
    const exp = data.details.exp;
    exp.max = this.getLevelExp(level);
    const prior = this.getLevelExp(level - 1);
    const required = exp.max - prior;
    const pct = Math.round((exp.value - prior) * 100 / required);
    exp.pct = Math.clamped(pct, 0, 100);
  }

  /* -------------------------------------------- */

  /**
   * Prepare NPC type specific data
   */
  _prepareNPCData(actorData) {
    const data = actorData.data;

    // Kill Experience
    data.details.exp.value = this.getCRExp(data.details.cr);

    // Proficiency
    data.attributes.prof = Math.floor((Math.max(data.details.cr, 1) + 7) / 4);

    // Spellcaster Level
    if (data.attributes.spellcasting && !data.details.spellLevel) {
      data.details.spellLevel = Math.max(data.details.cr, 1);
    }
  }

  /* -------------------------------------------- */

  /**
   * Prepare data related to the superpower capabilities/resources of the Actor
   * @private
   */
  _computeResourceProgression() {
    if (this.data.type === 'npc') {
      // NPC resource maximum and limit are already part of its data
      return
    }

    const data = this.data.data
    const classData = data.class
    const level = classData.level
    const isPsionicist = classData.name === "Psionicist"
    const isAlchemist = KRYX_RPG.systemData.archetypesThatHaveConcoctions.includes(classData.archetype)
    const progression = KRYX_RPG.RESOURCE_PROGRESSION_MULTIPLIERS[classData.progression]
    let manaMax = Math.round(progression.mana * level)
    let staminaMax = Math.round(progression.stamina * level)
    let manaLimit = Math.ceil(progression.manaLimit * level)
    let staminaLimit = Math.ceil(progression.staminaLimit * level)
    let manaName = game.i18n.localize("KRYX_RPG.MainResourceMana")
    const staminaName = game.i18n.localize("KRYX_RPG.MainResourceStamina")
    let manaEffectName = game.i18n.localize("KRYX_RPG.MainResourceManaEffect")
    const staminaEffectName = game.i18n.localize("KRYX_RPG.MainResourceStaminaEffect")
    let manaNameSingular = manaName
    const staminaNameSingular = staminaName
    let manaUseName = game.i18n.localize("KRYX_RPG.MainResourceManaUse")
    const staminaUseName = game.i18n.localize("KRYX_RPG.MainResourceStaminaUse")

    // EXCEPTION: half-half gish at level 1
    if (level === 1 && classData.progression === "gishHalfHalf") {
      manaMax = 1  // instead of 0
    }

    // EXCEPTION: psi
    if (isPsionicist) {
      manaName = game.i18n.localize("KRYX_RPG.MainResourceManaNamedPsi")
      if (classData.progression === "gishSpells") {
        // Soulknife or Monk; can turn psi into stamina and use maneuvers
        staminaLimit = Math.ceil(0.25 * level)
      }
    }

    // EXCEPTION: alchemy
    if (isAlchemist) {
      manaName = game.i18n.localize("KRYX_RPG.MainResourceManaNamedCatalysts")
      manaNameSingular = game.i18n.localize("KRYX_RPG.MainResourceManaNamedCatalystsSingular")
      manaEffectName = game.i18n.localize("KRYX_RPG.MainResourceManaNamedCatalystsEffect")
      manaUseName = game.i18n.localize("KRYX_RPG.MainResourceManaNamedCatalystsUse")
    }

    data.mainResources = {
      mana: {
        remaining: this.data.data.mainResources.mana.remaining,
        max: manaMax,
        limit: manaLimit,
        dc: this.getSpellDC(),
        name: manaName,
        nameSingular: manaNameSingular,
        nameOfEffect: manaEffectName,
        nameOfUse: manaUseName,
      },
      stamina: {
        remaining: this.data.data.mainResources.stamina.remaining,
        max: staminaMax,
        limit: staminaLimit,
        dc: this.getManeuverDC(),
        name: staminaName,
        nameSingular: staminaNameSingular,
        nameOfEffect: staminaEffectName,
        nameOfUse: staminaUseName,
      }
    }
  }

  /* -------------------------------------------- */

  /**
   * Return the amount of experience required to gain a certain character level.
   * @param level {Number}  The desired level
   * @return {Number}       The XP required
   */
  getLevelExp(level) {
    const levels = CONFIG.KRYX_RPG.CHARACTER_EXP_LEVELS;
    return levels[Math.min(level, levels.length - 1)];
  }

  /* -------------------------------------------- */

  /**
   * Return the amount of experience granted by killing a creature of a certain CR.
   * @param cr {Number}     The creature's challenge rating
   * @return {Number}       The amount of experience granted per kill
   */
  getCRExp(cr) {
    if (cr < 1.0) return Math.max(200 * cr, 10);
    return CONFIG.KRYX_RPG.CR_EXP_LEVELS[cr];
  }

  /* -------------------------------------------- */

  /**
   * Return the superpower DC for this actor using a certain ability score
   * @param {string} ability    The ability score, i.e. "str"
   * @param {number} bonus      An optional bonus to the DC
   * @return {number}           The superpower DC
   */
  getSuperpowerDC(ability, bonus) {
    const actorData = this.data.data;
    const abilityValue = actorData.abilities[ability].value;
    const prof = actorData.attributes.prof;
    return 8 + abilityValue + prof + bonus;
  }

  getSpellDC() {
    return this.getSuperpowerDC(
      this.data.data.attributes.spellcastingAbility,
      parseInt(this.data.data.bonuses.spell_dc) || 0
    )
  }

  getManeuverDC() {
    return this.getSuperpowerDC(
      this.data.data.attributes.maneuverAbility,
      parseInt(this.data.data.bonuses.maneuver_dc) || 0
    )
  }

  /* -------------------------------------------- */

  /** @override */
  getRollData() {
    const data = super.getRollData();
    data.class = this.data.class
    data.prof = this.data.data.attributes.prof;
    return data;
  }

  /* -------------------------------------------- */

  /*  Socket Listeners and Handlers
  /* -------------------------------------------- */

  /** @override */
  static async create(data, options = {}) {
    data.token = data.token || {};
    if (data.type === "character") {
      mergeObject(data.token, {
        vision: true,
        dimSight: 30,
        brightSight: 0,
        actorLink: true,
        disposition: 1
      }, {overwrite: false});
    }
    return super.create(data, options);
  }

  /* -------------------------------------------- */

  /** @override */
  async update(data, options = {}) {

    // Apply changes in Actor size to Token width/height
    const newSize = data["data.traits.size"];
    if (newSize && (newSize !== getProperty(this.data, "data.traits.size"))) {
      let size = CONFIG.KRYX_RPG.tokenSizes[newSize];
      if (this.isToken) this.token.update({height: size, width: size});
      else if (!data["token.width"] && !hasProperty(data, "token.width")) {
        data["token.height"] = size;
        data["token.width"] = size;
      }
    }
    return super.update(data, options);
  }

  /* -------------------------------------------- */

  /** @override */
  async createOwnedItem(itemData, options) {

    // Assume NPCs are always proficient with weapons
    if (!this.isPC) {
      let t = itemData.type;
      let initial = {};
      if (t === "weapon") initial["data.proficient"] = true;
      if (["weapon", "equipment"].includes(t)) initial["data.equipped"] = true;
      mergeObject(itemData, initial);
    }
    return super.createOwnedItem(itemData, options);
  }

  /* -------------------------------------------- */

  /** @override */
  async modifyTokenAttribute(attribute, value, isDelta, isBar) {
    if (attribute !== "attributes.health") return super.modifyTokenAttribute(attribute, value, isDelta, isBar);

    // Get current and delta Health
    const health = getProperty(this.data.data, attribute);
    const tmp = parseInt(health.temp) || 0;
    const current = health.value + tmp;
    const max = health.max + (parseInt(health.tempmax) || 0);
    const delta = isDelta ? value : value - current;

    // For negative changes, deduct from temp health
    let dtmp = delta < 0 ? Math.max(-1 * tmp, delta) : 0;
    let deltaHealth = delta - dtmp;
    return this.update({
      "data.attributes.health.temp": tmp + dtmp,
      "data.attributes.health.value": Math.clamped(health.value + deltaHealth, 0, max)
    });
  }

  /* -------------------------------------------- */
  /*  Gameplay Mechanics                          */

  /* -------------------------------------------- */

  /**
   * Apply a certain amount of damage or healing to the health pool for Actor
   * @param {number} amount       An amount of damage (positive) or healing (negative) to sustain
   * @param {number} multiplier   A multiplier which allows for resistance, vulnerability, or healing
   * @return {Promise<Actor>}     A Promise which resolves once the damage has been applied
   */
  async applyDamage(amount = 0, multiplier = 1) {
    amount = Math.floor(parseInt(amount) * multiplier);
    const health = this.data.data.attributes.health;

    // Deduct damage from temp health first
    const tmp = parseInt(health.temp) || 0;
    const dt = amount > 0 ? Math.min(tmp, amount) : 0;

    // Remaining goes to health
    const tmpMax = parseInt(health.tempmax) || 0;
    const dh = Math.clamped(health.value - (amount - dt), 0, health.max + tmpMax);

    // Update the Actor
    return this.update({
      "data.attributes.health.temp": tmp - dt,
      "data.attributes.health.value": dh
    });
  }

  /* -------------------------------------------- */

  /**
   * Cast a Spell, consuming a spell slot of a certain level
   * @param {ItemKryx} item   The spell being cast by the actor
   * @param {boolean} configureDialog   whether or not to show the configure dialog, e.g. for augmenting a spell
   */
  async useSuperpower(item, {configureDialog = true} = {}) {
    if (item.data.type !== "superpower") throw new Error(`Wrong Item type - ${item.data.name} is ${item.data.type}`);
    const itemData = item.data.data;

    const limitedUses = !!itemData.uses.per;

    // Show a dialog (for configuring measured template, augment/enhance, and how many resources to spend)
    let shouldPlaceTemplate = false;
    let paidCost = itemData.cost
    let shouldConsumeResources = true
    let canAugment = false
    if (itemData.scaling.mode === "augment" && item.cost < this.data.data.mainResources.mana.limit)
      canAugment = true
    if (itemData.scaling.mode === "enhance" && item.cost < this.data.data.mainResources.stamina.limit)
      canAugment = true
    const hasReasonToConfigureDialog = item.hasAreaTarget || canAugment
    if (configureDialog && hasReasonToConfigureDialog) {
      const spellFormData = await SuperpowerUseDialog.create(this, item);
      if (spellFormData === null) {
        // user clicked X on the dialog, canceling the superpower usage.
        return
      }
      paidCost = parseInt(spellFormData.get("paidCost"));
      shouldConsumeResources = parseInt(spellFormData.get("shouldConsumeResources"));
      shouldPlaceTemplate = Boolean(spellFormData.get("shouldPlaceTemplate"));
    }

    // Update Actor data
    if (shouldConsumeResources && paidCost) {
      const resource = item.isManeuver ? "stamina" : "mana"
      await this.update({
        [`data.mainResources.${resource}.remaining`]: Math.max(this.data.data.mainResources[resource].remaining - paidCost, 0)
      });
    }

    // Update Item data
    if (shouldConsumeResources && limitedUses) {
      const uses = parseInt(itemData.uses.value || 0);
      if (uses <= 0) ui.notifications.warn(game.i18n.format("KRYX_RPG.ItemNoUses", {name: item.name}));
      await item.update({"data.uses.value": Math.max(parseInt(item.data.data.uses.value || 0) - 1, 0)})
    }

    // Initiate ability template placement workflow if selected
    if (shouldPlaceTemplate && item.hasAreaTarget) {
      const template = AbilityTemplate.fromItem(item);
      if (template) template.drawPreview(event);
      if (this.sheet.rendered) this.sheet.minimize();
    }

    // Invoke the Item roll
    return item.roll();
  }

  /* -------------------------------------------- */

  /**
   * Roll a Skill Check
   * Prompt the user for input regarding Advantage/Disadvantage and any Situational Bonus
   * @param {string} skillId      The skill id (e.g. "ins")
   * @param {Object} options      Options which configure how the skill check is rolled
   * @return {Promise.<Roll>}   A Promise which resolves to the created Roll instance
   */
  rollSkill(skillId, options = {}) {
    const skl = this.data.data.skills[skillId];
    const bonuses = getProperty(this.data.data, "bonuses.abilities") || {};

    // Compose roll parts and data
    const parts = ["@mod"];
    const data = {mod: skl.mod + skl.prof};

    // Ability test bonus
    if (bonuses.check) {
      data["checkBonus"] = bonuses.check;
      parts.push("@checkBonus");
    }

    // Skill check bonus
    if (bonuses.skill) {
      data["skillBonus"] = bonuses.skill;
      parts.push("@skillBonus");
    }

    // Reliable Talent applies to any skill check we have full or better proficiency in
    const reliableTalent = (skl.proficiency >= 1 && this.getFlag("kryx_rpg", "reliableTalent"));

    // Roll and return
    return d20Roll(mergeObject(options, {
      parts: parts,
      data: data,
      title: game.i18n.format("KRYX_RPG.PromptSkillTitle", {skill: CONFIG.KRYX_RPG.skills[skillId]}),
      speaker: ChatMessage.getSpeaker({actor: this}),
      halflingLucky: this.getFlag("kryx_rpg", "halflingLucky"),
      reliableTalent: reliableTalent
    }));
  }

  /* -------------------------------------------- */

  /**
   * Roll an Ability Test
   * Prompt the user for input regarding Advantage/Disadvantage and any Situational Bonus
   * @param {String} abilityId    The ability ID (e.g. "str")
   * @param {Object} options      Options which configure how ability tests are rolled
   * @return {Promise<Roll>}      A Promise which resolves to the created Roll instance
   */
  rollAbilityTest(abilityId, options = {}) {
    const label = CONFIG.KRYX_RPG.abilities[abilityId];
    const abl = this.data.data.abilities[abilityId];

    // Construct parts
    const parts = ["@mod"];
    const data = {mod: abl.value};

    // Add global actor bonus
    const bonuses = getProperty(this.data.data, "bonuses.abilities") || {};
    if (bonuses.check) {
      parts.push("@checkBonus");
      data.checkBonus = bonuses.check;
    }

    // Roll and return
    return d20Roll(mergeObject(options, {
      parts: parts,
      data: data,
      title: game.i18n.format("KRYX_RPG.AbilityPromptTitle", {ability: label}),
      speaker: ChatMessage.getSpeaker({actor: this}),
      halflingLucky: this.getFlag("kryx_rpg", "halflingLucky")
    }));
  }

  /* -------------------------------------------- */

  /**
   * Roll a Saving Throw
   * Prompt the user for input regarding Advantage/Disadvantage and any Situational Bonus
   * @param {String} saveId       The save ID (e.g. "reflex")
   * @param {Object} options      Options which configure how save tests are rolled
   * @return {Promise<Roll>}      A Promise which resolves to the created Roll instance
   */
  rollSavingThrow(saveId, options = {}) {
    const label = CONFIG.KRYX_RPG.saves[saveId];
    const save = this.data.data.saves[saveId];

    // Construct parts
    const parts = ["@mod"];
    const data = {mod: save.value};

    // Include proficiency bonus
    if (save.prof > 0) {
      parts.push("@prof");
      data.prof = save.prof;
    }

    // Include a global actor ability save bonus
    const bonuses = getProperty(this.data.data, "bonuses.saves") || {};
    if (bonuses.save) {
      parts.push("@saveBonus");
      data.saveBonus = bonuses.save;
    }

    // Roll and return
    return d20Roll(mergeObject(options, {
      parts: parts,
      data: data,
      title: game.i18n.format("KRYX_RPG.SavePromptTitle", {save: label}),
      speaker: ChatMessage.getSpeaker({actor: this}),
      halflingLucky: this.getFlag("kryx_rpg", "halflingLucky")
    }));
  }

  /* -------------------------------------------- */

  /**
   * Perform a death saving throw, rolling a d20 plus any global save bonuses
   * @param {Object} options        Additional options which modify the roll
   * @return {Promise<Roll|null>}   A Promise which resolves to the Roll instance
   */
  async rollDeathSave(options = {}) {
    // TODO updated to new Dying system (e.g. crits don't put you back at 1)
    // Evaluate a global saving throw bonus
    const speaker = ChatMessage.getSpeaker({actor: this});
    const parts = [];
    const data = {};

    // Include a global actor ability save bonus
    const bonuses = getProperty(this.data.data, "bonuses.abilities") || {};
    if (bonuses.save) {
      parts.push("@saveBonus");
      data.saveBonus = bonuses.save;
    }

    // Evaluate the roll
    const roll = await d20Roll(mergeObject(options, {
      parts: parts,
      data: data,
      title: game.i18n.localize("KRYX_RPG.DeathSavingThrow"),
      speaker: speaker,
      halflingLucky: this.getFlag("kryx_rpg", "halflingLucky"),
      targetValue: 10
    }));
    if (!roll) return null;

    // Take action depending on the result
    const success = roll.total >= 10;
    const death = this.data.data.attributes.death;

    // Save success
    if (success) {
      let successes = (death.success || 0) + 1;

      // Critical Success = revive with 1 health
      if (roll.total === 20) {
        await this.update({
          "data.attributes.death.success": 0,
          "data.attributes.death.failure": 0,
          "data.attributes.health.value": 1
        });
        await ChatMessage.create({
          content: game.i18n.format("KRYX_RPG.DeathSaveCriticalSuccess", {name: this.name}),
          speaker
        });
      }

      // 3 Successes = survive and reset checks
      else if (successes === 3) {
        await this.update({
          "data.attributes.death.success": 0,
          "data.attributes.death.failure": 0
        });
        await ChatMessage.create({content: game.i18n.format("KRYX_RPG.DeathSaveSuccess", {name: this.name}), speaker});
      }

      // Increment successes
      else await this.update({"data.attributes.death.success": Math.clamped(successes, 0, 3)});
    }

    // Save failure
    else {
      let failures = (death.failure || 0) + (roll.total === 1 ? 2 : 1);

      // 3 Failures = death
      if (failures >= 3) {
        await this.update({
          "data.attributes.death.success": 0,
          "data.attributes.death.failure": 0
        });
        await ChatMessage.create({content: game.i18n.format("KRYX_RPG.DeathSaveFailure", {name: this.name}), speaker});
      }

      // Increment failures
      else await this.update({"data.attributes.death.failure": Math.clamped(failures, 0, 3)});
    }

    // Return the rolled result
    return roll;
  }

  /* -------------------------------------------- */

  /**
   * Roll a health die of the appropriate type, gaining health equal to the die roll plus your CON modifier
   * @param {string} denomination    The denomination of health die to roll. Example "d8"
   */
  async rollHealthDie(denomination) {
    // Prepare roll data
    const parts = [`1${denomination}`, "@abilities.con.value"];
    const title = game.i18n.localize("KRYX_RPG.HealthDiceRoll");
    const rollData = duplicate(this.data.data);

    // Call the roll helper utility
    const roll = await damageRoll({
      event: new Event("hitDie"), // TODO - keep or rename? maybe useful for modules
      parts: parts,
      data: rollData,
      title: title,
      speaker: ChatMessage.getSpeaker({actor: this}),
      allowcritical: false,
      fastForward: true,
      dialogOptions: {width: 350}
    });
    if (!roll) return;

    // Adjust actor data
    await this.update({"data.class.healthDiceUsed": this.data.data.class.healthDiceUsed + 1});
    const health = this.data.data.attributes.health;
    const delta = Math.min(health.max - health.value, roll.total);
    return this.update({"data.attributes.health.value": health.value + delta});
  }

  /* -------------------------------------------- */

  /**
   * Cause this Actor to take a Short Rest
   * During a Short Rest resources and limited item uses may be recovered
   * @param {boolean} dialog  Present a dialog window which allows for rolling health dice as part of the Short Rest
   * @param {boolean} chat    Summarize the results of the rest workflow as a chat message
   * @return {Promise}        A Promise which resolves once the short rest workflow has completed
   */
  async shortRest({dialog = true, chat = true} = {}) {
    const data = this.data.data;

    // Take note of the initial health and number of health dice the Actor has
    const hd0 = data.class.level - data.class.healthDiceUsed;
    const health0 = data.attributes.health.value;

    // Display a Dialog for rolling health dice
    let newDay = false;
    if (dialog) {
      try {
        newDay = await ShortRestDialog.shortRestDialog({actor: this, canRoll: hd0 > 0});
      } catch (err) {
        return;
      }
    }

    // Note the change in Health and HD which occurred
    const dhd = data.class.level - data.class.healthDiceUsed - hd0;
    const deltaHealth = data.attributes.health.value - health0;

    // Recover character resources
    const updateData = {};
    for (let [k, r] of Object.entries(data.resources)) {
      if (r.max && r.sr) {
        updateData[`data.resources.${k}.value`] = r.max;
      }
    }

    // Recover item uses
    const recovery = newDay ? ["sr", "day"] : ["sr"];
    const items = this.items.filter(item => item.data.data.uses && recovery.includes(item.data.data.uses.per));
    const updateItems = items.map(item => {
      return {
        _id: item._id,
        "data.uses.value": item.data.data.uses.max
      };
    });
    await this.updateEmbeddedEntity("OwnedItem", updateItems);

    // Display a Chat Message summarizing the rest effects
    let restFlavor;
    switch (game.settings.get("kryx_rpg", "restVariant")) {
      case 'normal':
        restFlavor = game.i18n.localize("KRYX_RPG.ShortRestNormal");
        break;
      case 'gritty':
        restFlavor = game.i18n.localize(newDay ? "KRYX_RPG.ShortRestOvernight" : "KRYX_RPG.ShortRestGritty");
        break;
      case 'epic':
        restFlavor = game.i18n.localize("KRYX_RPG.ShortRestEpic");
        break;
    }

    if (chat) {
      ChatMessage.create({
        user: game.user._id,
        speaker: {actor: this, alias: this.name},
        flavor: restFlavor,
        content: game.i18n.format("KRYX_RPG.ShortRestResult", {name: this.name, dice: -dhd, health: deltaHealth})
      });
    }

    // Return data summarizing the rest effects
    return {
      dhd: dhd,
      deltaHealth: deltaHealth,
      updateData: updateData,
      updateItems: updateItems,
      newDay: newDay
    }
  }


  /* -------------------------------------------- */

  /**
   * Cause this Actor to spend a Second Wind
   * During a Second Wind health dice are spent to regain health
   * @param {boolean} chat    Summarize the results of the rest workflow as a chat message
   * @return {Promise}        A Promise which resolves once the short rest workflow has completed
   */
  async secondWind({chat = true} = {}) {
    const data = this.data.data;
    if (!data.attributes.secondWindAvailable) {
      ui.notifications.warn(`${this.data.name} already used a Second Wind! It will be regained when ${this.data.name} gets a long rest.`)
      return
    }

    // Take note of the initial health and number of health dice the Actor has
    const hd0 = data.class.level - data.class.healthDiceUsed;
    const health0 = data.attributes.health.value;

    // Display a Dialog for using a second wind
    const winded = await SecondWindDialog.secondWindDialog({actor: this});

    // Note the change in Health and HD which occurred
    const dhd = data.class.level - data.class.healthDiceUsed - hd0;
    const deltaHealth = data.attributes.health.value - health0;

    // Display a Chat Message summarizing the rest effects
    let restFlavor = game.i18n.localize("KRYX_RPG.SecondWindFlavorAction")

    // Warriors can use Second Wind as a bonus action
    if (data.class.name === "Warrior" && data.class.level >= 2) {
      restFlavor = game.i18n.localize("KRYX_RPG.SecondWindFlavorBonusAction")
    }

    if (!winded && deltaHealth === 0) return

    const stringId = (!winded && deltaHealth !== 0) ? "KRYX_RPG.SecondWindCanceledResult" : "KRYX_RPG.SecondWindResult"

    if (chat) {
      ChatMessage.create({
        user: game.user._id,
        speaker: {actor: this, alias: this.name},
        flavor: restFlavor,
        content: game.i18n.format(stringId, {name: this.name, dice: -dhd, health: deltaHealth})
      });
    }

    this.update({"data.attributes.secondWindAvailable": false})

    // Return data summarizing the rest effects
    return {
      dhd: dhd,
      deltaHealth: deltaHealth,
    }
  }

  /* -------------------------------------------- */

  /**
   * Take a long rest, recovering Health, HD, resources, and spell slots
   * @param {boolean} dialog  Present a confirmation dialog window whether or not to take a long rest
   * @param {boolean} chat    Summarize the results of the rest workflow as a chat message
   * @return {Promise}        A Promise which resolves once the long rest workflow has completed
   */
  async longRest({dialog = true, chat = true} = {}) {
    const data = this.data.data;

    // Maybe present a confirmation dialog
    let newDay = false;
    if (dialog) {
      try {
        newDay = await LongRestDialog.longRestDialog(this);
      } catch (err) {
        return;
      }
    }

    // Recover health to full, and eliminate any existing temporary Health
    const deltaHealth = data.attributes.health.max - data.attributes.health.value;
    const updateData = {
      "data.attributes.health.value": data.attributes.health.max,
      "data.attributes.health.temp": 0,
      "data.attributes.health.tempmax": 0
    };

    // Recover character resources
    for (let [k, r] of Object.entries(data.resources)) {
      if (r.max && (r.sr || r.lr)) {
        updateData[`data.resources.${k}.value`] = r.max;
      }
    }

    updateData["data.attributes.secondWindAvailable"] = true

    // Recover mana and stamina
    updateData[`data.mainResources.mana.remaining`] = data.mainResources.mana.max;
    updateData[`data.mainResources.stamina.remaining`] = data.mainResources.stamina.max;

    // Determine the number of health dice which may be recovered (half your level rounded up; at least 1; no more than total spent)
    const healthDiceAllowedToRecover = Math.ceil(data.class.level / 2)
    const healthDiceRecovered = Math.min(Math.max(healthDiceAllowedToRecover, 1), data.class.healthDiceUsed);
    updateData['data.class.healthDiceUsed'] = data.class.healthDiceUsed - healthDiceRecovered

    // Iterate over owned items, restoring uses per day and recovering Health Dice
    const updateItems = []
    const recovery = newDay ? ["sr", "lr", "day"] : ["sr", "lr"];
    for (let item of this.items) {
      const d = item.data.data;
      if (d.uses && recovery.includes(d.uses.per)) {
        updateItems.push({_id: item.id, "data.uses.value": d.uses.max});
      } else if (d.recharge && d.recharge.value) {
        updateItems.push({_id: item.id, "data.recharge.charged": true});
      }
    }

    // Perform the updates
    await this.update(updateData);
    if (updateItems.length) await this.updateEmbeddedEntity("OwnedItem", updateItems);

    // Display a Chat Message summarizing the rest effects
    let restFlavor;
    switch (game.settings.get("kryx_rpg", "restVariant")) {
      case 'normal':
        restFlavor = game.i18n.localize(newDay ? "KRYX_RPG.LongRestOvernight" : "KRYX_RPG.LongRestNormal");
        break;
      case 'gritty':
        restFlavor = game.i18n.localize("KRYX_RPG.LongRestGritty");
        break;
      case 'epic':
        restFlavor = game.i18n.localize("KRYX_RPG.LongRestEpic");
        break;
    }

    if (chat) {
      ChatMessage.create({
        user: game.user._id,
        speaker: {actor: this, alias: this.name},
        flavor: restFlavor,
        content: game.i18n.format("KRYX_RPG.LongRestResult", {
          name: this.name,
          health: deltaHealth,
          dice: healthDiceRecovered
        })
      });
    }

    // Return data summarizing the rest effects
    return {
      dhd: healthDiceRecovered,
      deltaHealth: deltaHealth,
      updateData: updateData,
      updateItems: updateItems,
      newDay: newDay
    }
  }

  /* -------------------------------------------- */

  /**
   * Convert all carried currency to the highest possible denomination to reduce the number of raw coins being
   * carried by an Actor.
   * @return {Promise<ActorKryx>}
   */
  convertCurrency() {
    const curr = duplicate(this.data.data.currency);
    const convert = {
      cp: {into: "sp", each: 10},
      sp: {into: "gp", each: 10},
      gp: {into: "pp", each: 10}
    };
    for (let [c, t] of Object.entries(convert)) {
      let change = Math.floor(curr[c] / t.each);
      curr[c] -= (change * t.each);
      curr[t.into] += change;
    }
    return this.update({"data.currency": curr});
  }
}
