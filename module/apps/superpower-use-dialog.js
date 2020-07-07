/**
 * A specialized Dialog subclass for casting a spell item at a certain level
 * @extends {Dialog}
 */
export default class SuperpowerUseDialog extends Dialog {
  constructor(actor, item, dialogData = {}, options = {}) {
    super(dialogData, options);
    this.options.classes = ["kryx_rpg", "dialog"];

    /**
     * Store a reference to the Actor entity which is casting the spell
     * @type {ActorKryx}
     */
    this.actor = actor;

    /**
     * Store a reference to the Item entity which is the spell being cast
     * @type {ItemKryx}
     */
    this.item = item;
  }

  /* -------------------------------------------- */
  /*  Rendering                                   */

  /* -------------------------------------------- */

  /**
   * A constructor function which displays the Spell Cast Dialog app for a given Actor and Item.
   * Returns a Promise which resolves to the dialog FormData once the workflow has been completed.
   * @param {ActorKryx} actor
   * @param {ItemKryx} item
   * @return {Promise}
   */
  static async create(actor, item) {
    const ad = actor.data.data;
    const id = item.data.data;

    // Determine whether the spell may be upcast
    const lvl = id.level;
    const canUpcast = (lvl > 0) && CONFIG.KRYX_RPG.spellUpcastModes.includes(id.preparation.mode);

    // Determine the levels which are feasible
    let lmax = 0;
    const spellLevels = Array.fromRange(10).reduce((arr, i) => {
      if (i < lvl) return arr;
      const l = ad.spells["spell" + i] || {max: 0, override: null};
      let max = parseInt(l.override || l.max || 0);
      let slots = Math.clamped(parseInt(l.value || 0), 0, max);
      if (max > 0) lmax = i;
      arr.push({
        level: i,
        label: i > 0 ? `${CONFIG.KRYX_RPG.spellLevels[i]} (${slots} Slots)` : CONFIG.KRYX_RPG.spellLevels[i],
        canCast: canUpcast && (max > 0),
        hasSlots: slots > 0
      });
      return arr;
    }, []).filter(sl => sl.level <= lmax);

    const pact = ad.spells.pact;
    if (pact.level >= lvl) {
      // If this character has pact slots, present them as an option for
      // casting the spell.
      spellLevels.push({
        level: 'pact',
        label: game.i18n.localize('KRYX_RPG.SpellLevelPact')
          + ` (${game.i18n.localize('KRYX_RPG.Level')} ${pact.level}) `
          + `(${pact.value} ${game.i18n.localize('KRYX_RPG.Slots')})`,
        canCast: canUpcast,
        hasSlots: pact.value > 0
      });
    }
    const canCast = spellLevels.some(l => l.hasSlots);

    // Render the Spell casting template
    const html = await renderTemplate("systems/kryx_rpg/templates/apps/superpower-use.html", {
      item: item.data,
      canCast: canCast,
      canUpcast: canUpcast,
      spellLevels,
      hasPlaceableTemplate: game.user.can("TEMPLATE_CREATE") && item.hasAreaTarget
    });

    // Create the Dialog and return as a Promise
    return new Promise((resolve, reject) => {
      const dlg = new this(actor, item, {
        title: `${item.name}: Spell Configuration`,
        content: html,
        buttons: {
          cast: {
            icon: '<i class="fas fa-magic"></i>',
            label: "Cast",
            callback: html => resolve(new FormData(html[0].querySelector("#spell-config-form")))
          }
        },
        default: "cast",
        close: reject
      });
      dlg.render(true);
    });
  }
}
