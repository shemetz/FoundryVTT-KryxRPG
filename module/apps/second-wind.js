/**
 * A helper Dialog subclass for rolling Health Dice on a second wind
 * @extends {Dialog}
 */
export default class SecondWindDialog extends Dialog {
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
      template: "systems/kryx_rpg/templates/apps/second-wind.html",
      classes: ["kryx_rpg", "dialog"]
    });
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = super.getData();

    // Determine Health Dice
    data.healthDiceSize = this.actor.data.data.class.healthDice
    data.healthDiceAmount = this.actor.data.data.class.level - this.actor.data.data.class.healthDiceUsed
    data.canRoll = this.actor.data.data.attributes.secondWindAvailable;
    return data;
  }

  /* -------------------------------------------- */


  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    let btn = html.find("#roll-hd");
    btn.click(this._onRollHealthDie.bind(this));
    super.activateListeners(html);
  }

  /* -------------------------------------------- */

  /**
   * Handle rolling a Health Die as part of a Second Wind action
   * @param {Event} event     The triggering click event
   * @private
   */
  async _onRollHealthDie(event) {
    event.preventDefault();
    await this.actor.rollHealthDie(this.actor.data.data.class.heathDice);
    this.render();
  }

  /* -------------------------------------------- */

  /**
   * A helper constructor function which displays the Second Wind dialog and returns a Promise once it's workflow has
   * been resolved.
   * @param {ActorKryx} actor
   * @return {Promise}
   */
  static async secondWindDialog({actor} = {}) {
    return new Promise((resolve, reject) => {
      const dlg = new this(actor, {
        title: game.i18n.localize("KRYX_RPG.RestSecondWind"),
        buttons: {
          heal: {
            icon: '<i class="fas fa-medkit"></i>',
            label: "Done",
            callback: html => {
              resolve(true);
            }
          },
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: "Cancel",
            callback: () => resolve(false)
          }
        },
        close: () => resolve(false)
      });
      dlg.render(true);
    });
  }
}
