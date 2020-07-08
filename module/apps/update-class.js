/**
 * Allows the user to edit an actor's class details (including level).
 *
 * @return {Promise}              A Promise which resolves once the class update workflow has completed
 */
import {KRYX_RPG} from "../config.js";

export async function showUpdateClassDialog(actor) {
  const actorClassName = actor.data.data.class.name || "Acolyte"
  const actorArchetype = actor.data.data.class.archetype || "Paladin"
  const actorProgression = actor.data.data.class.progression || "gishHalfHalf"
  const actorSubclass = actor.data.data.class.subclass || ""

  // Render modal dialog
  const template = "systems/kryx_rpg/templates/apps/update-class.html";
  let dialogData = {
    classProgressions: CONFIG.KRYX_RPG.resourceProgression,
    data: actor.data.data,
    config: CONFIG.KRYX_RPG, // I guess this is for localization?
  };
  const html = await renderTemplate(template, dialogData);

  // Set a hook for code that will be called after the dialog is rendered (relevant: https://gitlab.com/foundrynet/foundryvtt/-/issues/3046)
  Hooks.once("renderDialog", function () {
    // Set to current archetype
    $(`select[name=className]`)[0].value = actorClassName
    $(`select[name=classArchetype]`)[0].value = actorArchetype
    $(`select[name=classProgression]`)[0].value = actorProgression
    // Limit archetypes and progressions to allowed choices, and change to viable ones if class changes
    onMainClassUpdated(actorClassName)
    onArchetypeUpdated(actorArchetype)
    limitSuperpowerAbilities()
    $(`select[name=className]`).change(e => onMainClassUpdated(e.target.value))
    $(`select[name=classArchetype]`).change(e => onArchetypeUpdated(e.target.value))
    // This just fixes the fact that the subclass is wiped when onMainClassUpdated() is called
    $(`input[name=classSubclass]`)[0].value = actorSubclass
  })

  // Create the Dialog window
  return new Promise(resolve => {
    new Dialog({
      title: game.i18n.localize("KRYX_RPG.UpdateClass"),
      content: html,
      buttons: {
        submit: {
          label: game.i18n.localize("KRYX_RPG.Save"),
          callback: $html => {
            const className = $html.find("[name=className]")[0].value
            const classArchetype = $html.find("[name=classArchetype]")[0].value
            actor.update({
              "data.class.name": className,
              "data.class.archetype": classArchetype,
              "data.class.subclass": $html.find("[name=classSubclass]")[0].value,
              "data.class.progression": $html.find("[name=classProgression]")[0].value,
              "data.class.level": $html.find("[name=classLevel]")[0].value,
              "data.class.hitDice": KRYX_RPG.systemData.classes[className].archetypes[classArchetype]["hitDice"],
              "data.attributes.spellcastingAbility": $html.find("[name=spellcastingAbility]")[0].value,
              "data.attributes.maneuverAbility": $html.find("[name=maneuverAbility]")[0].value,
            })
            // TODO - call actor computeResourceProgression (or something bigger) to update stuff like mana/psi name
          }
        },
        cancel: {
          label: game.i18n.localize("KRYX_RPG.Cancel"),
          callback: () => resolve(false)
        }
      },
      default: "submit",
      close: () => {
        resolve(false)
      }
    }, {}).render(true);
  })
}

function onMainClassUpdated(className) {
  // Delete subclass (because it's probably irrelevant)
  $(`input[name=classSubclass]`)[0].value = ""
  // Limit archetype by class
  const allowedArchetypes = Object.keys(KRYX_RPG.systemData.classes[className].archetypes)
  let firstAvailableArchetypeChoice = ""
  $(`select[name=classArchetype] > option`).each((i, option) => {
    if (allowedArchetypes.includes(option.value)) {
      firstAvailableArchetypeChoice = firstAvailableArchetypeChoice || option.value
      $(option).show()
    } else {
      $(option).hide()
    }
  })
  const selectedArchetype = $(`select[name=classArchetype] :selected`)[0].value
  if (!allowedArchetypes.includes(selectedArchetype)) {
    $(`select[name=classArchetype]`)[0].value = firstAvailableArchetypeChoice
    onArchetypeUpdated(firstAvailableArchetypeChoice)
  }
  $(`label.subclassLabel`)[0].textContent = KRYX_RPG.systemData.classes[className].subclassName
}

function onArchetypeUpdated(archetype) {
  // reverse-find class name by archetype (because I couldn't be bothered with sending class name as a parameter)
  let className;
  for (const possibleClassName in KRYX_RPG.systemData.classes)
    if (KRYX_RPG.systemData.classes[possibleClassName].archetypes[archetype]) {
      className = possibleClassName
      break
    }
  // Limit progression by archetype
  const progressionChoiceType = KRYX_RPG.systemData.classes[className].archetypes[archetype]["progressionChoiceType"]
  const allowedProgressions = KRYX_RPG.systemData.classProgressionChoiceTypes[progressionChoiceType]
  const classProgressionSelection = $(`select[name=classProgression]`)
  if (allowedProgressions.length === 1) {
    // Only one option!
    classProgressionSelection.hide()
  } else {
    classProgressionSelection.show()
  }
  let firstAvailableProgressionChoice = ""
  $(`select[name=classProgression] > option`).each((i, option) => {
    if (allowedProgressions.includes(option.value)) {
      firstAvailableProgressionChoice = firstAvailableProgressionChoice || option.value
      $(option).show()
    } else {
      $(option).hide()
    }
    // Special case for alchemist
    if (KRYX_RPG.systemData.archetypesThatHaveConcoctions.includes(archetype)) {
      option.text = option.text.replace("Spells", "Concoctions")
    } else {
      option.text = option.text.replace("Concoctions", "Spells")
    }
  })
  let selectedProgression = $(`select[name=classProgression] :selected`)[0].value
  if (!allowedProgressions.includes(selectedProgression)) {
    classProgressionSelection[0].value = firstAvailableProgressionChoice
    selectedProgression = firstAvailableProgressionChoice
  }

  // Spellcasting/Maneuver ability
  const splAblSelect = $(`div.spellcasting-ability`)
  const manAblSelect = $(`div.maneuver-ability`)
  switch (selectedProgression) {
    case "fullCaster":
      splAblSelect.show()
      if (className === "Psionicist") {
        manAblSelect.show()
      } else {
        manAblSelect.hide()
      }
      break
    case "fullMartial":
    case "gishManeuvers":
      splAblSelect.hide()
      manAblSelect.show()
      break
    case "gishSpells":
    case "gishHalfHalf":
      splAblSelect.show()
      manAblSelect.show()
      break
  }
  if (KRYX_RPG.systemData.archetypesThatHaveConcoctions.includes(archetype)) {
    $(`label.spellcasting-ability-label`).hide()
    $(`label.alchemical-ability-label`).show()
  } else {
    $(`label.spellcasting-ability-label`).show()
    $(`label.alchemical-ability-label`).hide()
  }

}

function limitSuperpowerAbilities() {
  // Limit allowed spellcasting/maneuver abilities (by config)
  const spellcastingAbilitySelection = $(`select[name=spellcastingAbility]`)
  let firstAvailableSpellcastingAbilityChoice = ""
  $(`select[name=spellcastingAbility] > option`).each((i, option) => {
    if (KRYX_RPG.systemData.spellcastingAbilities.includes(option.value)) {
      firstAvailableSpellcastingAbilityChoice = firstAvailableSpellcastingAbilityChoice || option.value
      $(option).show()
    } else {
      $(option).hide()
    }
  })
  const selectedSpellcastingAbility = $(`select[name=spellcastingAbility] :selected`)[0].value
  if (!KRYX_RPG.systemData.spellcastingAbilities.includes(selectedSpellcastingAbility)) {
    spellcastingAbilitySelection[0].value = firstAvailableSpellcastingAbilityChoice
  }
  const maneuverAbilitySelection = $(`select[name=maneuverAbility]`)
  let firstAvailableManeuverAbilityChoice = ""
  $(`select[name=maneuverAbility] > option`).each((i, option) => {
    if (KRYX_RPG.systemData.maneuverAbilities.includes(option.value)) {
      firstAvailableManeuverAbilityChoice = firstAvailableManeuverAbilityChoice || option.value
      $(option).show()
    } else {
      $(option).hide()
    }
  })
  const selectedManeuverAbility = $(`select[name=maneuverAbility] :selected`)[0].value
  if (!KRYX_RPG.systemData.maneuverAbilities.includes(selectedManeuverAbility)) {
    maneuverAbilitySelection[0].value = firstAvailableManeuverAbilityChoice
  }
}