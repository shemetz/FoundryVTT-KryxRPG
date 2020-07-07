export const registerSystemSettings = function () {

  /**
   * Track the system version upon which point a migration was last applied
   */
  game.settings.register("kryx_rpg", "systemMigrationVersion", {
    name: "System Migration Version",
    scope: "world",
    config: false,
    type: Number,
    default: 0
  });

  /**
   * Register resting variants
   */
  game.settings.register("kryx_rpg", "restVariant", {
    name: "SETTINGS.KryxRpgRestN",
    hint: "SETTINGS.KryxRpgRestL",
    scope: "world",
    config: true,
    default: "normal",
    type: String,
    choices: {
      "normal": "SETTINGS.KryxRpgRestPHB",
      "gritty": "SETTINGS.KryxRpgRestGritty",
      "epic": "SETTINGS.KryxRpgRestEpic",
    }
  });

  /**
   * Register diagonal movement rule setting
   */
  game.settings.register("kryx_rpg", "diagonalMovement", {
    name: "SETTINGS.KryxRpgDiagN",
    hint: "SETTINGS.KryxRpgDiagL",
    scope: "world",
    config: true,
    default: "555",
    type: String,
    choices: {
      "555": "SETTINGS.KryxRpgDiagPHB",
      "5105": "SETTINGS.KryxRpgDiagDMG",
      "EUCL": "SETTINGS.KryxRpgDiagEuclidean",
    },
    onChange: rule => canvas.grid.diagonalRule = rule
  });

  /**
   * Register Initiative formula setting
   */
  function _setKryxInitiative(tiebreaker) {
    CONFIG.Combat.initiative.tiebreaker = tiebreaker;
    CONFIG.Combat.initiative.decimals = tiebreaker ? 2 : 0;
    if (ui.combat && ui.combat._rendered) ui.combat.render();
  }

  game.settings.register("kryx_rpg", "initiativeDexTiebreaker", {
    name: "SETTINGS.KryxRpgInitTBN",
    hint: "SETTINGS.KryxRpgInitTBL",
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
    onChange: enable => _setKryxInitiative(enable)
  });
  _setKryxInitiative(game.settings.get("kryx_rpg", "initiativeDexTiebreaker"));

  /**
   * Require Currency Carrying Weight
   */
  game.settings.register("kryx_rpg", "currencyWeight", {
    name: "SETTINGS.KryxRpgCurWtN",
    hint: "SETTINGS.KryxRpgCurWtL",
    scope: "world",
    config: true,
    default: true,
    type: Boolean
  });

  /**
   * Option to disable XP bar for session-based or story-based advancement.
   */
  game.settings.register("kryx_rpg", "disableExperienceTracking", {
    name: "SETTINGS.KryxRpgNoExpN",
    hint: "SETTINGS.KryxRpgNoExpL",
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });

  /**
   * Option to automatically create Spell Measured Template on roll
   */
  game.settings.register("kryx_rpg", "alwaysPlaceSpellTemplate", {
    name: "SETTINGS.KryxRpgAutoSpellTemplateN",
    hint: "SETTINGS.KryxRpgAutoSpellTemplateL",
    scope: "client",
    config: true,
    default: false,
    type: Boolean
  });

  /**
   * Option to automatically collapse Item Card descriptions
   */
  game.settings.register("kryx_rpg", "autoCollapseItemCards", {
    name: "SETTINGS.KryxRpgAutoCollapseCardN",
    hint: "SETTINGS.KryxRpgAutoCollapseCardL",
    scope: "client",
    config: true,
    default: false,
    type: Boolean,
    onChange: s => {
      ui.chat.render();
    }
  });

  /**
   * Option to allow GMs to restrict polymorphing to GMs only.
   */
  game.settings.register('kryx_rpg', 'allowPolymorphing', {
    name: 'SETTINGS.KryxRpgAllowPolymorphingN',
    hint: 'SETTINGS.KryxRpgAllowPolymorphingL',
    scope: 'world',
    config: true,
    default: false,
    type: Boolean
  });

  /**
   * Remember last-used polymorph settings.
   */
  game.settings.register('kryx_rpg', 'polymorphSettings', {
    scope: 'client',
    default: {
      keepPhysical: false,
      keepMental: false,
      keepSaves: false,
      keepSkills: false,
      mergeSaves: false,
      mergeSkills: false,
      keepClass: false,
      keepFeats: false,
      keepSpells: false,
      keepItems: false,
      keepBio: false,
      keepVision: true,
      transformTokens: true
    }
  });
};
