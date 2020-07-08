import LongRestDialog from "./long-rest.js";

/**
 * A helper Dialog subclass for rolling Hit Dice on short rest
 * @extends {Dialog}
 */
export default class ShortRestDialog extends Dialog {
  constructor(actor, dialogData = {}, options = {}) {
    super(dialogData, options);

    /**
     * Store a reference to the Actor entity which is resting
     * @type {Actor}
     */
    this.actor = actor;
  }

  /* -------------------------------------------- */

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template: "systems/kryx_rpg/templates/apps/short-rest.html",
      classes: ["kryx_rpg", "dialog"]
    });
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = super.getData();

    // Determine Hit Dice
    data.hitDiceSize = this.actor.data.data.class.hitDice
    data.hitDiceAmount = this.actor.data.data.class.level - this.actor.data.data.class.hitDiceUsed
    data.canRoll = data.hitDiceAmount > 0;

    // Determine rest type
    const variant = game.settings.get("kryx_rpg", "restVariant");
    data.promptNewDay = variant !== "epic";     // It's never a new day when only resting 1 minute
    data.newDay = false;                        // It may be a new day, but not by default
    return data;
  }

  /* -------------------------------------------- */


  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    let btn = html.find("#roll-hd");
    btn.click(this._onRollHitDie.bind(this));
    super.activateListeners(html);
  }

  /* -------------------------------------------- */

  /**
   * Handle rolling a Hit Die as part of a Short Rest action
   * @param {Event} event     The triggering click event
   * @private
   */
  async _onRollHitDie(event) {
    event.preventDefault();
    await this.actor.rollHitDie(this.actor.data.data.class.hitDice);
    this.render();
  }

  /* -------------------------------------------- */

  /**
   * A helper constructor function which displays the Short Rest dialog and returns a Promise once it's workflow has
   * been resolved.
   * @param {ActorKryx} actor
   * @return {Promise}
   */
  static async shortRestDialog({actor} = {}) {
    return new Promise((resolve, reject) => {
      const dlg = new this(actor, {
        title: "Short Rest",
        buttons: {
          rest: {
            icon: '<i class="fas fa-bed"></i>',
            label: "Rest",
            callback: html => {
              let newDay = false;
              if (game.settings.get("kryx_rpg", "restVariant") === "gritty")
                newDay = html.find('input[name="newDay"]')[0].checked;
              resolve(newDay);
            }
          },
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: "Cancel",
            callback: reject
          }
        },
        close: reject
      });
      dlg.render(true);
    });
  }
}
