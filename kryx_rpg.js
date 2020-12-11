/**
 * Author: Shem
 *
 * Based on the Dungeons & Dragons 5th Edition game system for Foundry Virtual Tabletop
 * (Author: Atropos)
 * Software License: GNU GPLv3
 * Content License: https://media.wizards.com/2016/downloads/DND/SRD-OGL_V5.1.pdf
 * Repository: https://gitlab.com/foundrynet/dnd5e
 */

// Import Modules
import {KRYX_RPG} from "./module/config.js";
import {registerSystemSettings} from "./module/settings.js";
import {preloadHandlebarsTemplates} from "./module/templates.js";
import {_getInitiativeFormula} from "./module/combat.js";
import {measureDistances, getBarAttribute} from "./module/canvas.js";

// Import Entities
import ActorKryx from "./module/actor/entity.js";
import ItemKryx from "./module/item/entity.js";

// Import Applications
import AbilityTemplate from "./module/pixi/ability-template.js";
import ActorSheetFlags from "./module/apps/actor-flags.js";
import ActorSheetKryxCharacter from "./module/actor/sheets/character.js";
import ActorSheetKryxNPC from "./module/actor/sheets/npc.js";
import ItemSheetKryx from "./module/item/sheet.js";
import ShortRestDialog from "./module/apps/short-rest.js";
import SuperpowerUseDialog from "./module/apps/superpower-use-dialog.js";
import TraitSelector from "./module/apps/trait-selector.js";

// Import Helpers
import * as chat from "./module/chat.js";
import * as dice from "./module/dice.js";
import * as macros from "./module/macros.js";
import * as migrations from "./module/migration.js";
import "./module/utils.js";

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

Hooks.once("init", function () {
  console.log(`Kryx RPG | Initializing Kryx RPG System\n${KRYX_RPG.ASCII}`);

  // Create a Kryx RPG namespace within the game global
  game.kryx_rpg = {
    applications: {
      ActorSheetFlags,
      ActorSheetKryxCharacter,
      ActorSheetKryxNPC,
      ItemSheetKryx,
      ShortRestDialog,
      SuperpowerUseDialog,
      TraitSelector
    },
    canvas: {
      AbilityTemplate
    },
    config: KRYX_RPG,
    dice: dice,
    entities: {
      ActorKryx,
      ItemKryx,
    },
    macros: macros,
    migrations: migrations,
    rollItemMacro: macros.rollItemMacro
  };

  // Record Configuration Values
  CONFIG.KRYX_RPG = KRYX_RPG;
  CONFIG.Actor.entityClass = ActorKryx;
  CONFIG.Item.entityClass = ItemKryx;

  // Register System Settings
  registerSystemSettings();

  // Patch Core Functions
  Combat.prototype._getInitiativeFormula = _getInitiativeFormula;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("kryx_rpg", ActorSheetKryxCharacter, {types: ["character"], makeDefault: true});
  Actors.registerSheet("kryx_rpg", ActorSheetKryxNPC, {types: ["npc"], makeDefault: true});
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("kryx_rpg", ItemSheetKryx, {makeDefault: true});

  // Preload Handlebars Templates
  preloadHandlebarsTemplates();
});


/* -------------------------------------------- */
/*  Foundry VTT Setup                           */
/* -------------------------------------------- */

/**
 * This function runs after game data has been requested and loaded from the servers, so entities exist
 */
Hooks.once("setup", function () {

  // Localize CONFIG objects once up-front
  const toLocalize = Object.keys(KRYX_RPG);

  // Exclude some from sorting where the default order matters
  const noSort = [
    "abilities", "currencies", "distanceUnits", "itemActionTypes", "proficiencyLevels",
    "limitedUsePeriods", "spellComponents", "spellLevels", "weaponTypes"
  ];

  // Localize and sort CONFIG objects
  for (let o of toLocalize) {
    if (typeof CONFIG.KRYX_RPG[o] !== "object") continue
    if (Array.isArray(CONFIG.KRYX_RPG[o])) continue
    const localized = Object.entries(CONFIG.KRYX_RPG[o]).map(e => {
      if (typeof e[1] !== "string") return e
      return [e[0], game.i18n.localize(e[1])];
    });
    if (!noSort.includes(o) && typeof localized[0][1] === "string")
      localized.sort((a, b) => a[1].localeCompare(b[1]));
    CONFIG.KRYX_RPG[o] = localized.reduce((obj, e) => {
      obj[e[0]] = e[1];
      return obj;
    }, {});
  }
});

/* -------------------------------------------- */

/**
 * Once the entire VTT framework is initialized, check to see if we should perform a data migration
 */
Hooks.once("ready", function () {

  if (game.user.isGM) {
    migrations.migrateWorldIfNeeded()
    migrations.importCompendiumsIfPossible()
  }

  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on("hotbarDrop", (bar, data, slot) => macros.createKryxMacro(data, slot));
});

/* -------------------------------------------- */
/*  Canvas Initialization                       */
/* -------------------------------------------- */

Hooks.on("canvasInit", function () {

  // Extend Diagonal Measurement
  canvas.grid.diagonalRule = game.settings.get("kryx_rpg", "diagonalMovement");
  SquareGrid.prototype.measureDistances = measureDistances;

  // Extend Token Resource Bars
  Token.prototype.getBarAttribute = getBarAttribute;
});


/* -------------------------------------------- */
/*  Other Hooks                                 */
/* -------------------------------------------- */

Hooks.on("renderChatMessage", (app, html, data) => {

  // Display action buttons
  chat.displayChatActionButtons(app, html, data);

  // Highlight critical success or failure die
  chat.highlightCriticalSuccessFailure(app, html, data);

  // Optionally collapse the content
  if (game.settings.get("kryx_rpg", "autoCollapseItemCards")) html.find(".card-content").hide();
});
Hooks.on("getChatLogEntryContext", chat.addChatMessageContextOptions);
Hooks.on("renderChatLog", (app, html, data) => ItemKryx.chatListeners(html));


for (const [id, skl] of Object.entries(KRYX_RPG.skills)) {
  if (!KRYX_RPG.systemData.skillAbilities[id]) {
    console.error(`hey shem, you forgot to update the KRYX_RPG.systemData.skillAbilities object for the ${id} skill.`)
  }
}