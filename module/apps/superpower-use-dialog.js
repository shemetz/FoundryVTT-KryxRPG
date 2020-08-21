/**
 * A specialized Dialog subclass for configuring how you cast a spell, use a maneuver, or create/use a concoction
 * @extends {Dialog}
 */
export default class SuperpowerUseDialog extends Dialog {
  constructor(actor, superpowerItem, dialogData = {}, options = {}) {
    super(dialogData, options);
    this.options.classes = ["kryx_rpg", "dialog"];

    /**
     * Store a reference to the Actor entity which is using the superpower
     * @type {ActorKryx}
     */
    this.actor = actor;

    /**
     * Store a reference to the Item entity which is the superpower being used
     * @type {ItemKryx}
     */
    this.superpower = superpowerItem;
  }

  /* -------------------------------------------- */
  /*  Rendering                                   */

  /* -------------------------------------------- */

  /**
   * A constructor function which displays the Superpower Use Dialog app for a given Actor and Item (superpower).
   * Returns a Promise which resolves to the dialog FormData once the workflow has been completed.
   * @param {ActorKryx} actor
   * @param {ItemKryx} superpower
   * @return {Promise}
   */
  static async create(actor, superpower) {
    const actorData = actor.data.data;
    const superpowerData = superpower.data.data;

    const hasCost = superpowerData.cost > 0
    const canAugment = hasCost && (
      ["augment", "enhance"].includes(superpowerData.scaling.mode)
      || superpowerData.target.isScaling
      || superpowerData.duration.isScaling
    )
    const resource = superpower.isManeuver ? actorData.mainResources.stamina : actorData.mainResources.mana
    const hasPlaceableTemplate = superpower.hasAreaTarget && game.user.can("TEMPLATE_CREATE")
    const canChooseTargetType = hasPlaceableTemplate && superpowerData.target.type === "coneOrLine"
    const icon = superpower.isManeuver
      ? '<i class="fas fa-fist-raised"></i>'
      : superpower.isConcoction
        ? '<i class="fas fa-flask"></i>' // vial also looks nice
        // : superpower.isSpell ? (obviously it's a spell if it's not the other two. I'm just slightly paranoid)
        : '<i class="fas fa-magic"></i>'
    const resourceName = superpowerData.cost > 1 ? resource.name : resource.nameSingular
    const canCast = hasCost && superpowerData.cost <= resource.remaining
    const hintText1 = SuperpowerUseDialog.replaceTerms("KRYX_RPG.SuperpowerCastHint1", resource)
    const superpowerName = superpower.data.name
    const hintText2 = SuperpowerUseDialog.replaceTerms("KRYX_RPG.SuperpowerCastHint2", resource)
    let castConsumeText = SuperpowerUseDialog.replaceTerms("KRYX_RPG.SuperpowerCastConsume", resource)
    let spendHowMuchText = SuperpowerUseDialog.replaceTerms("KRYX_RPG.SuperpowerCastSpendHowMuch", resource)
    let noAvailableResourceText = SuperpowerUseDialog.replaceTerms("KRYX_RPG.SuperpowerCastNoResourcesSpell", resource)
    if (superpower.isConcoction && superpowerData.cost > 1) {
      castConsumeText = castConsumeText.replace("catalyst", "catalysts")
      spendHowMuchText = spendHowMuchText.replace("much catalyst", "many catalysts")
      noAvailableResourceText = noAvailableResourceText.replace("catalyst", "catalysts")
    }

    // Render the superpower use template
    const html = await renderTemplate("systems/kryx_rpg/templates/apps/superpower-use-dialog.html", {
      superpowerData,
      hasCost,
      canAugment,
      resourceName,
      canCast,
      hasPlaceableTemplate,
      canChooseTargetType,
      hintText1,
      superpowerName,
      hintText2,
      castConsumeText,
      spendHowMuchText,
      noAvailableResourceText,
    });

    // Create the Dialog and return as a Promise
    return new Promise((resolve) => {
      const dlg = new this(actor, superpower, {
        title: `${superpower.name}: ${resource.nameOfEffect.capitalize()} Configuration`,
        content: html,
        buttons: {
          use: {
            icon: icon,
            label: resource.nameOfUse.capitalize(),
            callback: html => resolve(new FormData(html[0].querySelector("#superpower-config-form")))
          }
        },
        default: "use",
        close: () => resolve(null)
      });
      dlg.render(true);
    });
  }

  static replaceTerms(stringId, resource) {
    return game.i18n.localize(stringId)
      .replace("MANA", resource.name)
      .replace("CAST", resource.nameOfUse)
      .replace("SPELL", resource.nameOfEffect)
  }
}
