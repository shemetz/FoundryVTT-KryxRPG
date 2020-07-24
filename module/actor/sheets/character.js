import ActorSheetKryx from "./base.js";
import {KRYX_RPG} from "../../config.js";
import {showUpdateClassDialog} from "../../apps/update-class.js";

/**
 * An Actor sheet for player character type actors in the Kryx RPG system.
 * Extends the base ActorSheetKryx class.
 * @type {ActorSheetKryx}
 */
export default class ActorSheetKryxCharacter extends ActorSheetKryx {

  /**
   * Define default rendering options for the NPC sheet
   * @return {Object}
   */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["kryx_rpg", "sheet", "actor", "character"],
      width: 720,
      height: 680
    });
  }

  /* -------------------------------------------- */
  /*  Rendering                                   */

  /* -------------------------------------------- */

  /**
   * Get the correct HTML template path to use for rendering this particular sheet
   * @type {String}
   */
  get template() {
    if (!game.user.isGM && this.actor.limited) return "systems/kryx_rpg/templates/actors/limited-sheet.html";
    return "systems/kryx_rpg/templates/actors/character-sheet.html";
  }

  /* -------------------------------------------- */

  /**
   * Add some extra data when rendering the sheet to reduce the amount of logic required within the template.
   */
  getData() {
    const sheetData = super.getData();

    // Temporary Health
    let health = sheetData.data.attributes.health;
    if (health.temp === 0) delete health.temp;
    if (health.tempmax === 0) delete health.tempmax;

    // Resources (not mana/stamina)
    sheetData["resources"] = ["primary", "secondary", "tertiary"].reduce((arr, r) => {
      const res = sheetData.data.resources[r] || {};
      res.name = r;
      res.placeholder = game.i18n.localize("KRYX_RPG.Resource" + r.titleCase());
      if (res && res.value === 0) delete res.value;
      if (res && res.max === 0) delete res.max;
      return arr.concat([res]);
    }, []);

    // Experience Tracking
    sheetData["disableExperience"] = game.settings.get("kryx_rpg", "disableExperienceTracking");

    // Class name (will be archetype, e.g. "Paladin" instead of "Acolyte")
    sheetData["className"] = this.actor.data.data.class.archetype

    // Return data for rendering
    return sheetData;
  }

  /* -------------------------------------------- */

  /**
   * Organize and classify Owned Items for Character sheets
   * @private
   */
  _prepareItems(data) {

    // Categorize items as inventory, superpowers, feats/features. TODO - maybe split feats and features?
    const inventory = {
      weapon: {label: "KRYX_RPG.ItemTypeWeaponPl", items: [], dataset: {type: "weapon"}},
      equipment: {label: "KRYX_RPG.ItemTypeEquipmentPl", items: [], dataset: {type: "equipment"}},
      consumable: {label: "KRYX_RPG.ItemTypeConsumablePl", items: [], dataset: {type: "consumable"}},
      tool: {label: "KRYX_RPG.ItemTypeToolPl", items: [], dataset: {type: "tool"}},
      backpack: {label: "KRYX_RPG.ItemTypeContainerPl", items: [], dataset: {type: "backpack"}},
      loot: {label: "KRYX_RPG.ItemTypeLootPl", items: [], dataset: {type: "loot"}}
    };

    // Partition items by category
    let [inventoryItems, superpowers, featuresItems] = data.items.reduce((arr, item) => {

      // Item details
      item.img = item.img || DEFAULT_TOKEN;
      item.isStack = item.data.quantity ? item.data.quantity > 1 : false;

      // Item usage
      item.hasUses = item.data.uses && (item.data.uses.max > 0);
      item.isOnCooldown = item.data.recharge && !!item.data.recharge.value && (item.data.recharge.charged === false);
      item.isDepleted = item.isOnCooldown && (item.data.uses.per && (item.data.uses.value > 0));
      item.hasTarget = !!item.data.target && !(["none", ""].includes(item.data.target.type));

      // Item toggle state
      this._prepareItemToggleState(item);

      // Classify items into types
      if (item.type === "superpower") arr[1].push(item);
      else if (item.type === "feature") arr[2].push(item);
      else if (Object.keys(inventory).includes(item.type)) arr[0].push(item);
      else console.error("KryxRPG | Unfamiliar item type: " + item.type)
      return arr;
    }, [[], [], [], []]);

    // Apply active item filters
    inventoryItems = this._filterItems(inventoryItems, this._filters.inventory);
    superpowers = this._filterItems(superpowers, this._filters.arsenal);
    const features = this._filterItems(featuresItems, this._filters.features);

    // Organize Arsenal (available superpowers)
    const arsenal = this._prepareArsenalTab(data, superpowers);

    // Organize Inventory
    let totalWeight = 0;
    for (let i of inventoryItems) {
      i.data.quantity = i.data.quantity || 0;
      i.data.weight = i.data.weight || 0;
      i.totalWeight = Math.round(i.data.quantity * i.data.weight * 10) / 10;
      inventory[i.type].items.push(i);
      totalWeight += i.totalWeight;
    }
    data.data.attributes.encumbrance = this._computeEncumbrance(totalWeight, data);

    // Organize Features
    const features_tab = {
      active: {
        label: "KRYX_RPG.FeatureActive",
        items: [],
        hasActions: true,
        dataset: {type: "feature", "activation.type": "action", type_name: "Feature"}
      },
      passive: {
        label: "KRYX_RPG.FeaturePassive",
        items: [],
        hasActions: false,
        dataset: {type: "feature", type_name: "Feature"}
      }
    };
    for (let f of features) {
      if (f.data.activation.type) features_tab.active.items.push(f);
      else features_tab.passive.items.push(f);
    }

    // Assign and return
    data.inventory = Object.values(inventory);
    data.arsenal = arsenal;
    data.features = Object.values(features_tab);
  }

  /* -------------------------------------------- */

  /**
   * A helper method to establish the displayed preparation state for an item
   * @param {Item} item
   * @private
   */
  _prepareItemToggleState(item) {
    if (item.type === "superpower") {
      item.toggleClass = item.data.availability !== "spellbook" ? "fixed" : "";
      item.toggleTitle = game.i18n.localize(KRYX_RPG.superpowerAvailability[item.data.availability]);
    } else if (item.type === "feature") {
      const isActive = getProperty(item.data, "isActivated");
      item.toggleClass = isActive ? "active" : "";
      item.toggleTitle = game.i18n.localize(isActive ? "KRYX_RPG.FeatureIsActivated" : "KRYX_RPG.FeatureIsNotActivated")
    } else {
      const isActive = getProperty(item.data, "equipped");
      item.toggleClass = isActive ? "active" : "";
      item.toggleTitle = game.i18n.localize(isActive ? "KRYX_RPG.Equipped" : "KRYX_RPG.Unequipped");
    }
  }

  /* -------------------------------------------- */

  /**
   * Compute the level and percentage of encumbrance for an Actor.
   *
   * Optionally include the weight of carried currency across all denominations by applying the standard rule
   * from the PHB pg. 143
   *
   * @param {Number} totalWeight    The cumulative item weight from inventory items
   * @param {Object} actorData      The data object for the Actor being rendered
   * @return {Object}               An object describing the character's encumbrance level
   * @private
   */
  _computeEncumbrance(totalWeight, actorData) {

    // Encumbrance classes
    let mod = {
      tiny: 0.5,
      sm: 1,
      med: 1,
      lg: 2,
      huge: 4,
      grg: 8
    }[actorData.data.traits.size] || 1;

    const carryingCapacityMultiplier = this.actor.getFlag("kryx_rpg", "carryingCapacityMultiplier")
    if (carryingCapacityMultiplier) mod *= carryingCapacityMultiplier

    // Add Currency Weight
    if (game.settings.get("kryx_rpg", "currencyWeight")) {
      const currency = actorData.data.currency;
      const numCoins = Object.values(currency).reduce((val, denom) => val += denom, 0);
      totalWeight += numCoins / KRYX_RPG.encumbrance.currencyPerWeight;
    }

    // Compute Encumbrance percentage
    const enc = {
      max: actorData.data.abilities.str.value * KRYX_RPG.encumbrance.strMultiplier * mod,
      value: Math.round(totalWeight * 10) / 10,
    };
    enc.pct = Math.min(enc.value * 100 / enc.max, 99);
    enc.encumbered = enc.pct > (2 / 3);
    return enc;
  }

  /* -------------------------------------------- */

  /*  Event Listeners and Handlers
  /* -------------------------------------------- */

  /**
   * Activate event listeners using the prepared sheet HTML
   * @param html {HTML}   The prepared HTML object ready to be rendered into the DOM
   */
  activateListeners(html) {
    super.activateListeners(html);
    if (!this.options.editable) return;

    // Class and level
    html.find(".charlevel").click(this._onUpdateClass.bind(this));

    // Inventory Functions
    html.find(".currency-convert").click(this._onConvertCurrency.bind(this));

    // Item State Toggling
    html.find('.item-toggle').click(this._onToggleItem.bind(this));

    // Short and Long Rest
    html.find('.second-wind').click(this._onSecondWind.bind(this));
    html.find('.short-rest').click(this._onShortRest.bind(this));
    html.find('.long-rest').click(this._onLongRest.bind(this));

    // Death saving throws
    html.find('.death-save').click(this._onDeathSave.bind(this));
  }

  /* -------------------------------------------- */

  /**
   * Handle rolling a death saving throw for the Character
   * @param {MouseEvent} event    The originating click event
   * @private
   */
  _onDeathSave(event) {
    event.preventDefault();
    return this.actor.rollDeathSave({event: event});
  }

  /* -------------------------------------------- */


  /**
   * Handle toggling the state of an Owned Item within the Actor
   * @param {Event} event   The triggering click event
   * @private
   */
  _onToggleItem(event) {
    event.preventDefault();
    const itemId = event.currentTarget.closest(".item").dataset.itemId;
    const item = this.actor.getOwnedItem(itemId);
    let attr
    if (item.data.type === "superpower")
      attr = "data.preparation.prepared"
    else if (item.data.type === "feature")
      attr = "data.isActivated"
    else attr = "data.equipped"
    return item.update({[attr]: !getProperty(item.data, attr)});
  }

  /* -------------------------------------------- */

  /**
   * Use a second wind, calling the relevant function on the Actor instance
   * @param {Event} event   The triggering click event
   * @private
   */
  async _onSecondWind(event) {
    event.preventDefault();
    await this._onSubmit(event);
    return this.actor.secondWind();
  }

  /* -------------------------------------------- */

  /**
   * Take a short rest, calling the relevant function on the Actor instance
   * @param {Event} event   The triggering click event
   * @private
   */
  async _onShortRest(event) {
    event.preventDefault();
    await this._onSubmit(event);
    return this.actor.shortRest();
  }

  /* -------------------------------------------- */

  /**
   * Take a long rest, calling the relevant function on the Actor instance
   * @param {Event} event   The triggering click event
   * @private
   */
  async _onLongRest(event) {
    event.preventDefault();
    await this._onSubmit(event);
    return this.actor.longRest();
  }

  /* -------------------------------------------- */

  /**
   * Handle mouse click events to convert currency to the highest possible denomination
   * @param {MouseEvent} event    The originating click event
   * @private
   */
  async _onConvertCurrency(event) {
    event.preventDefault();
    return Dialog.confirm({
      title: `${game.i18n.localize("KRYX_RPG.CurrencyConvert")}`,
      content: `<p>${game.i18n.localize("KRYX_RPG.CurrencyConvertHint")}</p>`,
      yes: () => this.actor.convertCurrency()
    });
  }

  /* -------------------------------------------- */

  /**
   * Handle mouse click events to convert currency to the highest possible denomination
   * @param {MouseEvent} event    The originating click event
   * @private
   */
  async _onUpdateClass(event) {
    event.preventDefault();
    return showUpdateClassDialog(this.actor)
  }
}
