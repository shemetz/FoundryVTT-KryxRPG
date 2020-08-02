import {d20Roll, damageRoll} from "../dice.js";
import AbilityUseDialog from "../apps/ability-use-dialog.js";
import AbilityTemplate from "../pixi/ability-template.js";

/**
 * Override and extend the basic :class:`Item` implementation
 */
export default class ItemKryx extends Item {

  /* -------------------------------------------- */
  /*  Item Properties                             */

  /* -------------------------------------------- */

  /**
   * @returns {boolean} true = spell, false = maneuver/concoction
   */
  get isSpell() {
    if (this.data.type !== "superpower") throw new Error("Do not check if a non-superpower item is a spell!")
    return this.data.data.powerType === "spell"
  }

  /**
   * @returns {boolean} true = concoction, false = spell/maneuver
   */
  get isConcoction() {
    if (this.data.type !== "superpower") throw new Error("Do not check if a non-superpower item is a concoction!")
    return this.data.data.powerType === "concoction"
  }

  /**
   * @returns {boolean} true = maneuver, false = spell/concoction
   */
  get isManeuver() {
    if (this.data.type !== "superpower") throw new Error("Do not check if a non-superpower item is a maneuver!")
    return this.data.data.powerType === "maneuver"
  }

  /**
   * Determine which ability score modifier is used by this item
   * @type {string|null}
   */
  get abilityMod() {
    const itemData = this.data.data;
    if (!("ability" in itemData)) return null;

    // Case 1 - defined directly by the item
    if (itemData.ability) return itemData.ability;

    // Case 2 - inferred from a parent actor
    else if (this.actor) {
      const actorData = this.actor.data.data;

      // Spells - Use Actor spellcasting modifier
      if (this.data.type === "superpower") {
        if (this.isManeuver) {
          return actorData.attributes.maneuverAbility
        } else {
          return actorData.attributes.spellcastingAbility
        }
      }

      // Tools - default to Intelligence
      else if (this.data.type === "tool") return "int";

      // Weapons
      else if (this.data.type === "weapon") {
        const wt = itemData.weaponType;

        // Melee weapons - Str or Dex if Finesse (PHB pg. 147)
        if (["simpleM", "martialM"].includes(wt)) {
          if (itemData.properties.fin === true) {   // Finesse weapons
            return (actorData.abilities.dex.value >= actorData.abilities.str.value) ? "dex" : "str";
          }
          return "str";
        }

        // Ranged weapons - Dex (PH p.194)
        else if (["simpleR", "martialR"].includes(wt)) return "dex";
      }
      return "str";
    }

    // Case 3 - unknown
    return null
  }

  /* -------------------------------------------- */

  /**
   * Does the Item implement an attack roll as part of its usage
   * @type {boolean}
   */
  get hasAttack() {
    return ["mwak", "rwak", "msak", "rsak"].includes(this.data.data.actionType);
  }

  /* -------------------------------------------- */

  /**
   * Does the Item implement a damage roll as part of its usage
   * @type {boolean}
   */
  get hasDamage() {
    return !!(this.data.data.damage && this.data.data.damage.parts.length);
  }

  /* -------------------------------------------- */

  /**
   * Does the Item implement a versatile damage roll as part of its usage
   * @type {boolean}
   */
  get isVersatile() {
    return !!(this.hasDamage && this.data.data.damage.versatile);
  }

  /* -------------------------------------------- */

  /**
   * Does the item provide an amount of healing instead of conventional damage?
   * @return {boolean}
   */
  get isHealing() {
    return (this.data.data.actionType === "heal") && this.data.data.damage.parts.length;
  }

  /* -------------------------------------------- */

  /**
   * Does the Item implement a saving throw as part of its usage
   * @type {boolean}
   */
  get hasSave() {
    return !!(this.data.data.save && this.data.data.save.ability);
  }

  /* -------------------------------------------- */

  /**
   * Does the Item have a target
   * @type {boolean}
   */
  get hasTarget() {
    const target = this.data.data.target;
    return target && !["none", ""].includes(target.type);
  }

  /* -------------------------------------------- */

  /**
   * Does the Item have an area of effect target
   * @type {boolean}
   */
  get hasAreaTarget() {
    const target = this.data.data.target;
    return target && (target.type in CONFIG.KRYX_RPG.areaTargetTypes);
  }

  /* -------------------------------------------- */

  /**
   * Does the Item have an area of effect target that scales with mana/stamina/catalysts
   * @type {boolean}
   */
  get isAreaScaling() {
    const target = this.data.data.target
    return target && target.isScaling
  }

  /* -------------------------------------------- */

  /**
   * Returns an object similar to an actor's main resource (mana/stamina/catalysts), or null if this is
   * not a superpower type item.
   * @type {Object}
   */
  get mainResource() {
    if (this.data.type !== "superpower") return null
    return CONFIG.KRYX_RPG.mainResourceByPowerType[this.data.data.powerType]
  }


  /* -------------------------------------------- */

  /**
   * - Returns 1 if this is a standard-scaling AoE (e.g. Fireball).
   * - Returns 2 if this is a double-scaling AoE (e.g. Ash Fall)
   * - Returns 0 if this is not standard-scaling
   * @type {number}
   */
  get checkScalingMode() {
    const target = this.data.data.target
    if (!target || !target.isScaling) return 0
    const expectedScaling = CONFIG.KRYX_RPG.areaScalingStandardSizes[target.type]
    // will be undefined if someone's using "more creatures per mana" scaling for example
    if (!expectedScaling) return 0
    let value = parseFloat(target.value)
    if (target.units !== "ft" && target.units !== "") return 0 // you can add more code to support metric if you want!
    if (value === expectedScaling) return 1
    if (value === expectedScaling * 2) return 2
    return 0
  }

  /* -------------------------------------------- */
  /*	Data Preparation														*/

  /* -------------------------------------------- */

  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData() {
    super.prepareData();

    // Get the Item's data
    const itemType = this.data.type;
    const data = this.data.data;
    const C = CONFIG.KRYX_RPG;
    const labels = {};

    // Superpower - components
    const resource = this.mainResource
    if (itemType === "superpower") {
      const spentCost = data.spentCost || data.cost
      const resourceName = spentCost > 1 ? resource.name : resource.nameSingular
      labels.cost = `${spentCost} ${resourceName}`
      if (spentCost !== data.cost) { // if enhanced/augmented
        const verb = game.i18n.localize(this.isManeuver ? "KRYX_RPG.LowercaseEnhanced" : "KRYX_RPG.LowercaseAugmented")
        labels.cost += `, ${verb} from ${data.cost}`
      }
      labels.isConcoction = this.isConcoction
      labels.themes = data.themes.value.join(", ") || "(Theme?)"
      labels.theme = data.themes.value.join(", ") || ""
      labels.components = Object.entries(data.components).reduce((arr, c) => {
        if (c[1] !== true) return arr;
        let letter = c[0].titleCase().slice(0, 1)
        if (this.isConcoction && letter === "C")
          letter = "U" // unstable concoction
        arr.push(letter);
        return arr;
      }, []);
      labels.typeNameCapitalized = resource.nameOfEffect.capitalize()
      labels.concentration = game.i18n.localize(
        this.isConcoction ? "KRYX_RPG.ConcentrationConcoction" : "KRYX_RPG.ConcentrationSpell"
      )
      labels.costNameCapitalized = data.cost === 1 ? resource.nameSingular.capitalize() : resource.name.capitalize()
    }

    // Feature Items
    else if (itemType === "feature") {
      labels.themes = data.themes.value.join(", ") || "(No Theme)"
      labels.featureTypeName = CONFIG.KRYX_RPG.featureTypes[data.featureType]
    }

    // Equipment Items
    else if (itemType === "equipment") {
      const armorText = []
      if (data.armor.value) armorText.push(`${data.armor.value} Defense`)
      if (data.armor.soak) armorText.push(`${data.armor.soak} Soak`)
      labels.armor = armorText.join(", ")
    }

    // Activated Items
    if (data.hasOwnProperty("activation")) {
      // Ability Activation Label
      let act = data.activation || {};
      if (act) labels.activation = [act.cost, C.abilityActivationTypes[act.type]].filterJoin(" ");

      // Target Label
      let tgt = data.target || {};
      if (["none", "touch", "self"].includes(tgt.units)) tgt.value = null;
      if (["none", "self"].includes(tgt.type)) {
        tgt.value = null;
        tgt.units = null;
      }
      let tgtVal = tgt.value
      if (tgt.isScaling) {
        const resourceName = resource.nameSingular.capitalize()
        tgtVal = `${tgt.value}/${resourceName}`
      }
      labels.target = [tgtVal, C.distanceUnits[tgt.units], C.targetTypes[tgt.type]].filterJoin(" ")
      // simplified scaling for KryxRPG superpowers - most of them have standardized sizes.
      // instead of "15/mana Feet Cone" (Burning Hands) it will say "Cone"
      // instead of "10/mana Feet Cylinder" (Ash Fall) it will say "Large Cylinder"
      const scalingMode = this.checkScalingMode
      if (scalingMode === 1)
        labels.target = `${C.targetTypes[tgt.type]}`
      if (scalingMode === 2)
        labels.target = `Large ${C.targetTypes[tgt.type]}`
      if (!tgt.value && tgt.isScaling && C.areaScalingStandardSizes.hasOwnProperty(tgt.type)) {
        // When user is lazy and inputs effect shape without a number, we'll update it to be the standard size
        tgt.value = C.areaScalingStandardSizes[tgt.type]
        tgt.units = "ft"
        this.update({"data.target.value": tgt.value, "data.target.units": tgt.units})
      }

      // Range Label
      let rng = data.range || {};
      if (["none", "touch", "self"].includes(rng.units) || (rng.value === 0)) {
        rng.value = null;
        rng.long = null;
      }
      labels.range = [rng.value, rng.long ? `/ ${rng.long}` : null, C.distanceUnits[rng.units]].filterJoin(" ");

      // Duration Label
      let dur = data.duration || {};
      if (["inst", "perm"].includes(dur.units)) dur.value = null;
      let durUnits = C.timePeriods[dur.units]
      if (durUnits) {
        if (durUnits.endsWith("s") && dur.value === 1) {
          //"1 hours" -> "1 hour"
          durUnits = durUnits.substr(0, durUnits.length - 1)
        }
        if (dur.isScaling) {
          const resourceName = resource.nameSingular.capitalize()
          durUnits = `${durUnits}/${resourceName}`
        }
      }
      labels.duration = [dur.value, durUnits].filterJoin(" ");

      // Recharge Label
      let chg = data.recharge || {};
      labels.recharge = `Recharge [${chg.value}${parseInt(chg.value) < 6 ? "+" : ""}]`;
      labels.canBeActivated = !!dur.value || !!dur.units
    }

    // Item Actions
    if (data.hasOwnProperty("actionType")) {
      // Save DC
      let save = data.save || {};
      if (!save.type) save.dc = null;
      else if (this.isOwned) { // Actor owned items
        if (save.scaling === "spell_dc") save.dc = this.actor.getSpellDC();
        else if (save.scaling === "alchemical_dc") save.dc = this.actor.getSpellDC();
        else if (save.scaling === "maneuver_dc") save.dc = this.actor.getManeuverDC();
        else if (save.scaling === "flat_dc") save.dc = +save.dc
        else save.dc = null
      } else { // Un-owned items
        if (save.scaling !== "flat_dc") save.dc = null;
      }
      labels.save = save.type ? `DC ${save.dc || ""} ${C.saves[save.type]}` : "";

      // Damage
      let dam = data.damage || {};
      if (dam.parts) {
        labels.damage = dam.parts.map(d => d[0]).join(" + ").replace(/\+ -/g, "- ");
        labels.damageTypes = dam.parts.map(d => C.damageTypes[d[1]]).join(", ");
      }
    }

    // Assign labels
    this.labels = labels;
  }

  /* -------------------------------------------- */

  /**
   * Roll the item to Chat, creating a chat card which contains follow up attack or damage roll options
   * @return {Promise}
   */
  async roll({configureDialog = true} = {}) {

    // Basic template rendering data
    const token = this.actor.token;
    const templateData = {
      actor: this.actor,
      tokenId: token ? `${token.scene._id}.${token.id}` : null,
      item: this.data,
      data: this.getChatData(),
      labels: this.labels,
      hasAttack: this.hasAttack,
      isHealing: this.isHealing,
      hasDamage: this.hasDamage,
      isVersatile: this.isVersatile,
      isSuperpower: this.data.type === "superpower",
      hasSave: this.hasSave,
      hasAreaTarget: this.hasAreaTarget,
      spentCost: this.data.data.spentCost || null,
    };

    // For feature items, optionally show an ability usage dialog
    if (this.data.type === "feature") {
      let configured = await this._rollFeature(configureDialog);
      if (configured === false) return;
    } else if (this.data.type === "consumable") {
      let configured = await this._rollConsumable(configureDialog);
      if (configured === false) return;
    }

    // For items which consume a resource, handle that here
    const allowed = await this._handleResourceConsumption({isCard: true, isAttack: false});
    if (allowed === false) return;

    // Render the chat card template
    const templateType = ["tool"].includes(this.data.type) ? this.data.type : "item";
    const template = `systems/kryx_rpg/templates/chat/${templateType}-card.html`;
    const html = await renderTemplate(template, templateData);

    // Basic chat message data
    const chatData = {
      user: game.user._id,
      type: CONST.CHAT_MESSAGE_TYPES.OTHER,
      content: html,
      speaker: {
        actor: this.actor._id,
        token: this.actor.token,
        alias: this.actor.name
      }
    };

    // Toggle default roll mode
    let rollMode = game.settings.get("core", "rollMode");
    if (["gmroll", "blindroll"].includes(rollMode)) chatData["whisper"] = ChatMessage.getWhisperRecipients("GM");
    if (rollMode === "blindroll") chatData["blind"] = true;

    // Create the chat message
    return ChatMessage.create(chatData);
  }

  /* -------------------------------------------- */

  /**
   * For items which consume a resource, handle the consumption of that resource when the item is used.
   * There are four types of ability consumptions which are handled:
   * 1. Ammunition (on attack rolls)
   * 2. Attributes (on card usage)
   * 3. Materials (on card usage)
   * 4. Item Charges (on card usage)
   *
   * @param {boolean} isCard      Is the item card being played?
   * @param {boolean} isAttack    Is an attack roll being made?
   * @return {Promise<boolean>}   Can the item card or attack roll be allowed to proceed?
   * @private
   */
  async _handleResourceConsumption({isCard = false, isAttack = false} = {}) {
    const consume = this.data.data.consume || {};
    if (!consume.type) return true;
    const actor = this.actor;
    const typeLabel = CONFIG.KRYX_RPG.abilityConsumptionTypes[consume.type];
    const amount = parseInt(consume.amount || 1);

    // Only handle certain types for certain actions
    if (((consume.type === "ammo") && !isAttack) || ((consume.type !== "ammo") && !isCard)) return true;

    // No consumed target set
    if (!consume.target) {
      ui.notifications.warn(game.i18n.format("KRYX_RPG.ConsumeWarningNoResource", {name: this.name, type: typeLabel}));
      return false;
    }

    // Identify the consumed resource and it's quantity
    let consumed = null;
    let quantity = 0;
    switch (consume.type) {
      case "attribute":
        consumed = getProperty(actor.data.data, consume.target);
        quantity = consumed || 0;
        break;
      case "ammo":
      case "material":
        consumed = actor.items.get(consume.target);
        quantity = consumed ? consumed.data.data.quantity : 0;
        break;
      case "charges":
        consumed = actor.items.get(consume.target);
        quantity = consumed ? consumed.data.data.uses.value : 0;
        break;
    }

    // Verify that the consumed resource is available
    if (consumed === null || typeof consumed === "undefined") {
      ui.notifications.warn(game.i18n.format("KRYX_RPG.ConsumeWarningNoSource", {name: this.name, type: typeLabel}));
      return false;
    }
    if (quantity - amount < 0) {
      ui.notifications.warn(game.i18n.format("KRYX_RPG.ConsumeWarningNoQuantity", {
        name: this.name, type: typeLabel, quantity, amount, charname: actor.name
      }));
      return false;
    }

    // Update the consumed resource
    const remaining = Math.max(quantity - amount, 0);
    switch (consume.type) {
      case "attribute":
        await this.actor.update({[`data.${consume.target}`]: remaining});
        break;
      case "ammo":
      case "material":
        await consumed.update({"data.quantity": remaining});
        break;
      case "charges":
        await consumed.update({"data.uses.value": remaining});
    }
    return true;
  }

  /* -------------------------------------------- */

  /**
   * Additional rolling steps when rolling a feature item
   * @param {boolean} configureDialog    Should an ability use dialog be shown?
   * @private
   * @return {boolean} whether the roll should be prevented
   */
  async _rollFeature(configureDialog) {
    if (this.data.type !== "feature") throw new Error("Wrong Item type");

    // Configure whether to consume a limited use or to place a template
    const usesRecharge = !!this.data.data.recharge.value;
    const uses = this.data.data.uses;
    let usesCharges = !!uses.per && (uses.max > 0) && !!this.data.data.consume.amount;
    let placeTemplate = false;
    let consume = usesRecharge || usesCharges;

    // Determine whether the feat uses charges
    configureDialog = configureDialog && (consume || this.hasAreaTarget);
    if (configureDialog) {
      const usage = await AbilityUseDialog.create(this);
      if (usage === null) return false;
      consume = Boolean(usage.get("consume"));
      placeTemplate = Boolean(usage.get("placeTemplate"));
    }

    // Update Item data
    const current = getProperty(this.data, "data.uses.value") || 0;
    if (consume && usesRecharge) {
      await this.update({"data.recharge.charged": false});
    } else if (consume && usesCharges) {
      await this.update({"data.uses.value": Math.max(current - 1, 0)});
    }

    // Maybe initiate template placement workflow
    if (this.hasAreaTarget && placeTemplate) {
      const template = AbilityTemplate.fromItem(this);
      if (template) template.drawPreview(event);
      if (this.owner && this.owner.sheet) this.owner.sheet.minimize();
    }
    return true;
  }

  /* -------------------------------------------- */
  /*  Chat Cards																	*/

  /* -------------------------------------------- */

  /**
   * Prepare an object of chat data used to display a card for the Item in the chat log
   * @param {Object} htmlOptions    Options used by the TextEditor.enrichHTML function
   * @return {Object}               An object of chat data to render
   */
  getChatData(htmlOptions = undefined) {
    const data = duplicate(this.data.data);
    const labels = this.labels;

    // Rich text description
    data.description.value = TextEditor.enrichHTML(data.description.value, htmlOptions);

    // Item type specific properties
    const props = [];
    let fn = {
      "equipment": this._equipmentChatData,
      "weapon": this._weaponChatData,
      "consumable": this._consumableChatData,
      "loot": this._lootChatData,
      "superpower": this._superpowerChatData,
      "feature": this._featureChatData,
    }[this.data.type]
    if (!fn) console.error(`unexpected item data type: ${this.data.type}`)
    if (fn) fn.bind(this)(data, labels, props);

    // General equipment properties
    if (data.hasOwnProperty("equipped") && !["loot", "tool"].includes(this.data.type)) {
      props.push(
        data.equipped ? "Equipped" : "Not Equipped",
        data.proficient ? "Proficient" : "Not Proficient",
      );
    }

    // Ability activation properties
    if (data.hasOwnProperty("activation")) {
      props.push(
        labels.target,
        labels.activation,
        labels.range,
        labels.duration
      );
    }

    // Filter properties and return
    data.properties = props.filter(p => !!p);
    return data;
  }

  /* -------------------------------------------- */

  /**
   * Prepare chat card data for equipment type items
   * @private
   */
  _equipmentChatData(data, labels, props) {
    props.push(
      CONFIG.KRYX_RPG.equipmentTypes[data.armor.type],
      labels.armor || null,
      data.stealth.value ? "Stealth Disadvantage" : null,
    );
  }

  /* -------------------------------------------- */

  /**
   * Prepare chat card data for weapon type items
   * @private
   */
  _weaponChatData(data, labels, props) {
    props.push(
      CONFIG.KRYX_RPG.weaponTypes[data.weaponType],
    );
  }

  /* -------------------------------------------- */

  /**
   * Prepare chat card data for consumable type items
   * @private
   */
  _consumableChatData(data, labels, props) {
    props.push(
      CONFIG.KRYX_RPG.consumableTypes[data.consumableType],
      data.uses.value + "/" + data.uses.max + " Charges"
    );
    data.hasCharges = data.uses.value >= 0;
  }

  /* -------------------------------------------- */

  /**
   * Prepare chat card data for tool type items
   * @private
   */
  _lootChatData(data, labels, props) {
    props.push(
      "Loot",
      data.weight ? data.weight + " lbs." : null
    );
  }

  /* -------------------------------------------- */

  /**
   * Render a chat card for spell/concoction/maneuver
   * @return {Object}
   * @private
   */
  _superpowerChatData(data, labels, props) {
    props.push(
      labels.cost,
      data.themes.value.join(", ") || null,
    );
  }

  /* -------------------------------------------- */

  /**
   * Prepare chat card data for items of the Feature type
   * @private
   */
  _featureChatData(data, labels, props) {
    props.push(
      CONFIG.KRYX_RPG.featureTypes[data.featureType],
      data.source || null,
      data.themes.value.join(", ") || null
    );
  }

  /* -------------------------------------------- */
  /*  Item Rolls - Attack, Damage, Saves, Checks  */

  /* -------------------------------------------- */

  /**
   * Place an attack roll using an item (weapon, feat, spell, or equipment)
   * Rely upon the d20Roll logic for the core implementation
   *
   * @return {Promise.<Roll|null>}   A Promise which resolves to the created Roll instance
   */
  async rollAttack(options = {}) {
    const itemData = this.data.data;
    const actorData = this.actor.data.data;
    const flags = this.actor.data.flags.kryx_rpg || {};
    if (!this.hasAttack) {
      throw new Error("You may not place an Attack Roll with this Item.");
    }
    const rollData = this.getRollData();

    // Define Roll bonuses
    const parts = [`@mod`];
    if ((this.data.type !== "weapon") || itemData.proficient) {
      parts.push("@prof");
    }

    // Attack Bonus
    const actorBonus = actorData.bonuses[itemData.actionType] || {};
    if (itemData.attackBonus || actorBonus.attack) {
      parts.push("@atk");
      rollData["atk"] = [itemData.attackBonus, actorBonus.attack].filterJoin(" + ");
    }

    // Compose roll options
    const rollConfig = {
      event: options.event,
      parts: parts,
      actor: this.actor,
      data: rollData,
      title: `${this.name} - Attack Roll`,
      speaker: ChatMessage.getSpeaker({actor: this.actor}),
      dialogOptions: {
        width: 400,
        top: options.event ? options.event.clientY - 80 : null,
        left: window.innerWidth - 710
      }
    };

    // Expanded weapon critical threshold
    if ((this.data.type === "weapon") && flags.weaponCriticalThreshold) {
      rollConfig.critical = parseInt(flags.weaponCriticalThreshold);
    }

    // Apply Halfling Lucky
    if (flags.halflingLucky) rollConfig.halflingLucky = true;


    // Invoke the d20 roll helper
    const roll = await d20Roll(rollConfig);
    if (roll === false) return null;

    // Handle resource consumption if the attack roll was made
    const allowed = await this._handleResourceConsumption({isCard: false, isAttack: true});
    if (allowed === false) return null;
    return roll;
  }

  /* -------------------------------------------- */

  /**
   * Place a damage roll using an item (weapon, feat, spell, or equipment)
   * Rely upon the damageRoll logic for the core implementation
   *
   * @return {Promise.<Roll>}   A Promise which resolves to the created Roll instance
   */
  rollDamage({event, augmentedCost = null, versatile = false} = {}) {
    const itemData = this.data.data;
    const actorData = this.actor.data.data;
    if (!this.hasDamage) {
      throw new Error("You may not make a Damage Roll with this Item.");
    }
    const rollData = this.getRollData();
    rollData.item.effectiveCost = augmentedCost || rollData.item.cost
    let fastForward = false

    // Define Roll parts
    const parts = itemData.damage.parts.map(d => d[0]);
    if (versatile && itemData.damage.versatile) parts[0] = itemData.damage.versatile;
    if (this.data.type === "superpower") {
      if (!itemData.attack) fastForward = true
      const scalingMode = itemData.scaling.mode
      if (scalingMode === "none") {
        // do nothing
      } else if (scalingMode === "cantrip") {
        this._scaleCantripDamage(parts, actorData.class.level, itemData.scaling.formula);
      } else if (scalingMode === "augment" || scalingMode === "enhance") {
        if (augmentedCost !== null && augmentedCost !== itemData.cost) {
          this._scaleSpellDamage(parts, itemData.cost, rollData.item.effectiveCost, itemData.scaling.formula);
        }
      } else {
        ui.notifications.error(`Unexpected scaling mode: ${scalingMode}`)
      }
    }

    // Define Roll Data
    const actorBonus = actorData.bonuses[itemData.actionType] || {};
    if (actorBonus.damage && parseInt(actorBonus.damage) !== 0) {
      parts.push("@dmg");
      rollData["dmg"] = actorBonus.damage;
    }

    // Call the roll helper utility
    const title = `${this.name} - Damage Roll`;
    const flavor = this.labels.damageTypes.length ? `${title} (${this.labels.damageTypes})` : title;
    return damageRoll({
      event: event,
      parts: parts,
      actor: this.actor,
      data: rollData,
      title: title,
      flavor: flavor,
      speaker: ChatMessage.getSpeaker({actor: this.actor}),
      fastForward: fastForward,
      dialogOptions: {
        width: 400,
        top: event ? event.clientY - 80 : null,
        left: window.innerWidth - 710
      }
    });
  }

  /* -------------------------------------------- */

  /**
   * Adjust a cantrip damage formula to scale it for higher level characters and monsters
   * @private
   */
  _scaleCantripDamage(parts, level, scale) {
    const add = Math.ceil(level / 4);
    if (add === 0) return;
    if (scale && (scale !== parts[0])) {
      parts[0] = parts[0] + " + " + scale.replace(new RegExp(Roll.diceRgx, "g"), (match, nd, d) => `${add}d${d}`);
    } else {
      parts[0] = parts[0].replace(new RegExp(Roll.diceRgx, "g"), (match, nd, d) => `${parseInt(nd) + add}d${d}`);
    }
  }

  /* -------------------------------------------- */

  /**
   * Adjust the superpower damage formula to scale it for augmenting/enhancing
   * @param {Array} parts         The original damage parts
   * @param {number} baseCost    The default (minimum) cost)
   * @param {number} effectiveCost   The amount of mana/stamina/psi/catalysts spent, or base cost if none were spent
   * @param {string} formula      The scaling formula
   * @private
   */
  _scaleSpellDamage(parts, baseCost, effectiveCost, formula) {
    const upcastLevels = Math.max(effectiveCost - baseCost, 0);
    if (upcastLevels === 0) return parts;
    const bonus = new Roll(formula).alter(0, upcastLevels);
    parts.push(bonus.formula);
    return parts;
  }

  /* -------------------------------------------- */

  /**
   * Place an attack roll using an item (weapon, feat, superpower, or equipment)
   * Rely upon the d20Roll logic for the core implementation
   *
   * @return {Promise.<Roll>}   A Promise which resolves to the created Roll instance
   */
  async rollFormula() {
    if (!this.data.data.formula) {
      throw new Error("This Item does not have a formula to roll!");
    }

    // Define Roll Data
    const rollData = this.getRollData();
    const title = `${this.name} - Other Formula`;

    // Invoke the roll and submit it to chat
    const roll = new Roll(rollData.item.formula, rollData).roll();
    roll.toMessage({
      speaker: ChatMessage.getSpeaker({actor: this.actor}),
      flavor: this.data.data.chatFlavor || title,
      rollMode: game.settings.get("core", "rollMode")
    });
    return roll;
  }

  /* -------------------------------------------- */

  /**
   * Use a consumable item, deducting from the quantity or charges of the item.
   * @param {boolean} configureDialog   Whether to show a configuration dialog
   * @return {boolean}                  Whether further execution should be prevented
   * @private
   */
  async _rollConsumable(configureDialog) {
    if (this.data.type !== "consumable") throw new Error("Wrong Item type");
    const itemData = this.data.data;

    // Determine whether to deduct uses of the item
    const uses = itemData.uses || {};
    const autoDestroy = uses.autoDestroy;
    let usesCharges = !!uses.per && (uses.max > 0);
    const recharge = itemData.recharge || {};
    const usesRecharge = !!recharge.value;

    // Display a configuration dialog to confirm the usage
    let placeTemplate = false;
    let consume = uses.autoUse || true;
    if (configureDialog) {
      const usage = await AbilityUseDialog.create(this);
      if (usage === null) return false;
      consume = Boolean(usage.get("consume"));
      placeTemplate = Boolean(usage.get("placeTemplate"));
    }

    // Update Item data
    if (consume) {
      const current = uses.value || 0;
      const remaining = usesCharges ? Math.max(current - 1, 0) : current;
      if (usesRecharge) await this.update({"data.recharge.charged": false});
      else {
        const q = itemData.quantity;
        // Case 1, reduce charges
        if (remaining) {
          await this.update({"data.uses.value": remaining});
        }
        // Case 2, reduce quantity
        else if (q > 1) {
          await this.update({"data.quantity": q - 1, "data.uses.value": uses.max || 0});
        }
        // Case 3, destroy the item
        else if ((q <= 1) && autoDestroy) {
          await this.actor.deleteOwnedItem(this.id);
        }
        // Case 4, reduce item to 0 quantity and 0 charges
        else if ((q === 1)) {
          await this.update({"data.quantity": q - 1, "data.uses.value": 0});
        }
        // Case 5, item unusable, display warning and do nothing
        else {
          ui.notifications.warn(game.i18n.format("KRYX_RPG.ItemNoUses", {name: this.name}));
        }
      }
    }

    // Maybe initiate template placement workflow
    if (this.hasAreaTarget && placeTemplate) {
      const template = AbilityTemplate.fromItem(this);
      if (template) template.drawPreview(event);
      if (this.owner && this.owner.sheet) this.owner.sheet.minimize();
    }
    return true;
  }

  /* -------------------------------------------- */

  /**
   * Perform an ability recharge test for an item which uses the d6 recharge mechanic
   * @prarm {Object} options
   *
   * @return {Promise.<Roll>}   A Promise which resolves to the created Roll instance
   */
  async rollRecharge() {
    const data = this.data.data;
    if (!data.recharge.value) return Promise.reject("No recharge value for this item");

    // Roll the check
    const roll = new Roll("1d6").roll();
    const success = roll.total >= parseInt(data.recharge.value);

    // Display a Chat Message
    const promises = [roll.toMessage({
      flavor: `${this.name} recharge check - ${success ? "success!" : "failure!"}`,
      speaker: ChatMessage.getSpeaker({actor: this.actor, token: this.actor.token})
    })];

    // Update the Item data
    if (success) promises.push(this.update({"data.recharge.charged": true}));
    return Promise.all(promises).then(() => roll);
  }

  /* -------------------------------------------- */

  /**
   * Roll a Tool Check
   * Rely upon the d20Roll logic for the core implementation
   *
   * @return {Promise.<Roll>}   A Promise which resolves to the created Roll instance
   */
  rollToolCheck(options = {}) {
    if (this.type !== "tool") throw "Wrong item type!";

    // Prepare roll data
    let rollData = this.getRollData();
    const parts = [`@mod`, "@prof"];
    const title = `${this.name} - Tool Check`;

    // Call the roll helper utility
    return d20Roll({
      event: options.event,
      parts: parts,
      data: rollData,
      template: "systems/kryx_rpg/templates/chat/tool-roll-dialog.html",
      title: title,
      speaker: ChatMessage.getSpeaker({actor: this.actor}),
      flavor: `${this.name} - Tool Check`,
      dialogOptions: {
        width: 400,
        top: options.event ? options.event.clientY - 80 : null,
        left: window.innerWidth - 710,
      },
      halflingLucky: this.actor.getFlag("kryx_rpg", "halflingLucky") || false
    });
  }

  /* -------------------------------------------- */

  /**
   * Prepare a data object which is passed to any Roll formulas which are created related to this Item
   * @private
   */
  getRollData() {
    if (!this.actor) return null;
    const rollData = this.actor.getRollData();
    rollData.item = duplicate(this.data.data);

    // Include an ability score modifier if one exists
    const abl = this.abilityMod;
    if (abl) {
      const ability = rollData.abilities[abl];
      rollData["mod"] = ability.value || 0;
    }

    // Include a proficiency score
    const prof = "proficient" in rollData.item ? (rollData.item.proficient || 0) : 1;
    rollData["prof"] = Math.floor(prof * rollData.attributes.prof);
    return rollData;
  }

  /* -------------------------------------------- */
  /*  Chat Message Helpers                        */

  /* -------------------------------------------- */

  static chatListeners(html) {
    html.on('click', '.card-buttons button', this._onChatCardAction.bind(this));
    html.on('click', '.item-name', this._onChatCardToggleContent.bind(this));
  }

  /* -------------------------------------------- */

  /**
   * Handle execution of a chat card action via a click event on one of the card buttons
   * @param {Event} event       The originating click event
   * @returns {Promise}         A promise which resolves once the handler workflow is complete
   * @private
   */
  static async _onChatCardAction(event) {
    event.preventDefault();

    // Extract card data
    const button = event.currentTarget;
    button.disabled = true;
    const card = button.closest(".chat-card");
    const messageId = card.closest(".message").dataset.messageId;
    const message = game.messages.get(messageId);
    const action = button.dataset.action;

    // Validate permission to proceed with the roll
    const isTargeted = action === "save";
    if (!(isTargeted || game.user.isGM || message.isAuthor)) return;

    // Get the Actor from a synthetic Token
    const actor = this._getChatCardActor(card);
    if (!actor) return;

    // Get the Item
    const item = actor.getOwnedItem(card.dataset.itemId);
    if (!item) {
      return ui.notifications.error(`The requested item ${card.dataset.itemId} no longer exists on Actor ${actor.name}`)
    }
    if (!(item instanceof ItemKryx)) {
      return ui.notifications.error(`Item ${card.dataset.itemId} should be an ItemKryx`)
    }
    const augmentedCost = parseInt(card.dataset.spentCost) || null;

    // Get card targets
    let targets = [];
    if (isTargeted) {
      targets = this._getChatCardTargets(card);
      if (!targets.length) {
        ui.notifications.warn(`You must have one or more controlled Tokens in order to use this option.`);
        return button.disabled = false;
      }
    }

    // Attack and Damage Rolls
    if (action === "attack") await item.rollAttack({event});
    else if (action === "damage") await item.rollDamage({event, augmentedCost});
    else if (action === "formula") await item.rollFormula();

    // Saving Throws for card targets
    else if (action === "save") {
      for (let t of targets) {
        await t.rollSavingThrow(button.dataset.save, {event});
      }
    }

    // Tool usage
    else if (action === "toolCheck") await item.rollToolCheck({event});

    // Spell Template Creation
    else if (action === "placeTemplate") {
      const template = AbilityTemplate.fromItem(item);
      if (template) template.drawPreview(event);
    }

    // Re-enable the button
    button.disabled = false;
  }

  /* -------------------------------------------- */

  /**
   * Handle toggling the visibility of chat card content when the name is clicked
   * @param {Event} event   The originating click event
   * @private
   */
  static _onChatCardToggleContent(event) {
    event.preventDefault();
    const header = event.currentTarget;
    const card = header.closest(".chat-card");
    const content = card.querySelector(".card-content");
    content.style.display = content.style.display === "none" ? "block" : "none";
  }

  /* -------------------------------------------- */

  /**
   * Get the Actor which is the author of a chat card
   * @param {HTMLElement} card    The chat card being used
   * @return {Actor|null}         The Actor entity or null
   * @private
   */
  static _getChatCardActor(card) {

    // Case 1 - a synthetic actor from a Token
    const tokenKey = card.dataset.tokenId;
    if (tokenKey) {
      const [sceneId, tokenId] = tokenKey.split(".");
      const scene = game.scenes.get(sceneId);
      if (!scene) return null;
      const tokenData = scene.getEmbeddedEntity("Token", tokenId);
      if (!tokenData) return null;
      const token = new Token(tokenData);
      return token.actor;
    }

    // Case 2 - use Actor ID directory
    const actorId = card.dataset.actorId;
    return game.actors.get(actorId) || null;
  }

  /* -------------------------------------------- */

  /**
   * Get the Actor which is the author of a chat card
   * @param {HTMLElement} card    The chat card being used
   * @return {Array.<Actor>}      An Array of Actor entities, if any
   * @private
   */
  static _getChatCardTargets(card) {
    const character = game.user.character;
    const controlled = canvas.tokens.controlled;
    const targets = controlled.reduce((arr, t) => t.actor ? arr.concat([t.actor]) : arr, []);
    if (character && (controlled.length === 0)) targets.push(character);
    return targets;
  }

  /* -------------------------------------------- */
  /*  Factory Methods                             */

  /* -------------------------------------------- */

  /**
   * Create a consumable spell scroll Item from a spell Item.
   * @param {ItemKryx} spell      The spell to be made into a scroll
   * @return {ItemKryx}           The created scroll consumable item
   * @private
   */
  static async createScrollFromSpell(spell) {
    //TODO rewrite some of this

    // Get spell data
    const itemData = spell instanceof ItemKryx ? spell.data : spell;
    const {actionType, description, source, activation, duration, target, range, damage, save, level} = itemData.data;

    // Get scroll data
    const scrollUuid = CONFIG.KRYX_RPG.spellScrollIds[level];
    const scrollItem = await fromUuid(scrollUuid);
    const scrollData = scrollItem.data;
    delete scrollData._id;

    // Split the scroll description into an intro paragraph and the remaining details
    const scrollDescription = scrollData.data.description.value;
    const pdel = '</p>';
    const scrollIntroEnd = scrollDescription.indexOf(pdel);
    const scrollIntro = scrollDescription.slice(0, scrollIntroEnd + pdel.length);
    const scrollDetails = scrollDescription.slice(scrollIntroEnd + pdel.length);

    // Create a composite description from the scroll description and the spell details
    const desc = `${scrollIntro}<hr/><h3>${itemData.name} (Level ${level})</h3><hr/>${description.value}<hr/><h3>Scroll Details</h3><hr/>${scrollDetails}`;

    // Create the spell scroll data
    const spellScrollData = mergeObject(scrollData, {
      name: `${game.i18n.localize("KRYX_RPG.SpellScroll")}: ${itemData.name}`,
      img: itemData.img,
      data: {
        "description.value": desc.trim(),
        source,
        actionType,
        activation,
        duration,
        target,
        range,
        damage,
        save,
        level
      }
    });
    return new this(spellScrollData);
  }
}
