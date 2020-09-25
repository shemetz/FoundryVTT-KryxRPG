// import { setupCompendiums } from "../not_on_git/setup_compendiums.js"

export const NEEDS_MIGRATION_VERSION = "25.35.0-1"; // should be increased to the latest version unless there was a very minor patch
export const COMPATIBLE_MIGRATION_VERSION = "24.4.0-0";

const renamedThemes = [
  ["Protection", "Guardian"],
  ["Marksmanship", "Marksman"],
]

const renamedSkills = [
  ["intimidation", "coercion"],
  // ["acrobatics", "coordination"], // nope!
  ["religion", "divinity"],
  ["nature", "wilderness"],
  ["society", "streetwise"],
  ["coordination", "acrobatics"],
]

export const migrateWorldIfNeeded = async function () {
  // Determine whether a system migration is required and feasible
  const currentVersion = game.settings.get("kryx_rpg", "systemMigrationVersion")
  if (currentVersion === null || currentVersion === "0") {
      game.settings.set("kryx_rpg", "systemMigrationVersion", game.system.data.version);
      return
  }
  const needMigration = compareSemanticVersions(currentVersion, NEEDS_MIGRATION_VERSION) < 0
  if (!needMigration) return

  // Perform the migration
  if (compareSemanticVersions(currentVersion, COMPATIBLE_MIGRATION_VERSION) < 0) {
    ui.notifications.error(`Your Kryx RPG system data is from too old a version (${currentVersion}) and` +
     ` cannot be reliably migrated to the latest version. The process will be attempted, but errors may occur.`, {permanent: true})
  }

  migrateWorld()
}

export const importCompendiumsIfPossible = async function () {
  // WIP - I'm using this for local shenanigans
  return true
  console.info(`Kryx RPG | Importing data into compendiums...`)
  ui.notifications.info("Setting up Kryx RPG compendiums...")
  await setupCompendiums()
  ui.notifications.info("Done setting up Kryx RPG compendiums.")
  console.info(`Kryx RPG | Done importing data into compendiums.`)
}

/**
 * Perform a system migration for the entire World, applying migrations for Actors, Items, and Compendium packs
 * @return {Promise}      A Promise which resolves once the migration is completed
 */
const migrateWorld = async function () {
  ui.notifications.info(`Applying Kryx RPG System Migration for version ${game.system.data.version}. Please be patient and do not close your game or shut down your server.`, {permanent: true});

  // Migrate World Actors
  for (let a of game.actors.entities) {
    try {
      const updateData = migrateActorData(a.data);
      if (!isObjectEmpty(updateData)) {
        console.log(`Migrating Actor entity ${a.name}`);
        await a.update(updateData, {enforceTypes: false});
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Migrate World Items
  for (let i of game.items.entities) {
    try {
      const updateData = migrateItemData(i.data);
      if (!isObjectEmpty(updateData)) {
        console.log(`Migrating Item entity ${i.name}`);
        await i.update(updateData, {enforceTypes: false});
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Migrate Actor Override Tokens
  for (let s of game.scenes.entities) {
    try {
      const updateData = migrateSceneData(s.data);
      if (!isObjectEmpty(updateData)) {
        console.log(`Migrating Scene entity ${s.name}`);
        await s.update(updateData, {enforceTypes: false});
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Migrate World Compendium Packs
  const packs = game.packs.filter(p => {
    return (p.metadata.package === "world") && ["Actor", "Item", "Scene"].includes(p.metadata.entity)
  });
  for (let p of packs) {
    await migrateCompendium(p);
  }

  // Set the migration as complete
  game.settings.set("kryx_rpg", "systemMigrationVersion", game.system.data.version);
  ui.notifications.info(`Kryx RPG System Migration to version ${game.system.data.version} completed!`, {permanent: true});
};

/* -------------------------------------------- */

/**
 * Apply migration rules to all Entities within a single Compendium pack
 * @param pack
 * @return {Promise}
 */
export const migrateCompendium = async function (pack) {
  const entity = pack.metadata.entity;
  if (!["Actor", "Item", "Scene"].includes(entity)) return;

  // Begin by requesting server-side data model migration and get the migrated content
  await pack.migrate();
  const content = await pack.getContent();

  // Iterate over compendium entries - applying fine-tuned migration functions
  for (let ent of content) {
    try {
      let updateData = null;
      if (entity === "Item") updateData = migrateItemData(ent.data);
      else if (entity === "Actor") updateData = migrateActorData(ent.data);
      else if (entity === "Scene") updateData = migrateSceneData(ent.data);
      if (!isObjectEmpty(updateData)) {
        expandObject(updateData);
        updateData["_id"] = ent._id;
        await pack.updateEntity(updateData);
        console.log(`Migrated ${entity} entity ${ent.name} in Compendium ${pack.collection}`);
      }
    } catch (err) {
      console.error(err);
    }
  }
  console.log(`Migrated all ${entity} entities from Compendium ${pack.collection}`);
};

/* -------------------------------------------- */
/*  Entity Type Migration Helpers               */
/* -------------------------------------------- */

/**
 * Migrate a single Actor entity to incorporate latest data model changes
 * Return an Object of updateData to be applied
 * @param {Actor} actor   The actor to Update
 * @return {Object}       The updateData to apply
 */
export const migrateActorData = function (actor) {
  const updateData = {};

  // Actor Data Updates
  _migrateActorBonuses(actor, updateData);

  // Remove deprecated fields
  _migrateRemoveDeprecated(actor, updateData);

  // Migrate Owned Items
  if (!actor.items) return updateData;
  let hasItemUpdates = false;
  const items = actor.items.map(i => {

    // Migrate the Owned Item
    let itemUpdate = migrateItemData(i);

    // Prepared, Equipped, and Proficient for NPC actors
    if (actor.type === "npc") {
      if (getProperty(i.data, "preparation.prepared") === false) itemUpdate["data.preparation.prepared"] = true;
      if (getProperty(i.data, "equipped") === false) itemUpdate["data.equipped"] = true;
      if (getProperty(i.data, "proficient") === false) itemUpdate["data.proficient"] = true;
    }

    // Update the Owned Item
    if (!isObjectEmpty(itemUpdate)) {
      hasItemUpdates = true;
      return mergeObject(i, itemUpdate, {enforceTypes: false, inplace: false});
    } else return i;
  });

  _migrateThemes(actor, updateData)
  _migrateSkills(actor, updateData)
  _migrateMiscCharacter(actor, updateData)

  if (hasItemUpdates) updateData.items = items;
  return updateData;
};

/* -------------------------------------------- */

const _migrateThemes = function (actor, updateData) {
  const actorThemes = actor.data.traits.themes.value
  const renameTheme = function (oldTheme, newTheme) {
    const index = actorThemes.indexOf(oldTheme);
    if (index !== -1) {
      actorThemes.splice(index, 1);
      actorThemes.push(newTheme)
    }
  }
  for (const [oldTheme, newTheme] of renamedThemes) renameTheme(oldTheme, newTheme)
  updateData["data.traits.themes.value"] = actorThemes
}

const _migrateSkills = function (actor, updateData) {
  const dup = actor.data.skills
  const renameSkill = function (oldSkill, newSkill) {
    if (dup[oldSkill]) {
      dup[newSkill] = dup[oldSkill]
      delete dup[oldSkill]
    }
  }
  for (const [oldSkill, newSkill] of renamedSkills) renameSkill(oldSkill, newSkill)
  updateData["data.skills"] = dup
}

const _migrateMiscCharacter = function (actor, updateData) {
  if (typeof (actor.data.class.hitDice) !== undefined) {
    const dup = duplicate(actor.data.class)
    dup.healthDice = dup.hitDice
    dup.healthDiceUsed = dup.hitDiceUsed
    delete dup.hitDice
    delete dup.hitDiceUsed
    updateData["data.class"] = dup
  }

  if (typeof (actor.data.attributes.ac) !== undefined) {
    const dup = duplicate(actor.data.attributes)
    dup.defense = dup.ac
    dup.health = dup.hp
    delete dup.ac
    delete dup.hp
    updateData["data.attributes"] = dup
  }
}


/* -------------------------------------------- */


/**
 * Scrub an Actor's system data, removing all keys which are not explicitly defined in the system template
 * @param {Object} actorData    The data object for an Actor
 * @return {Object}             The scrubbed Actor data
 */
function cleanActorData(actorData) {

  // Scrub system data
  const model = game.system.model.Actor[actorData.type];
  actorData.data = filterObject(actorData.data, model);

  // Scrub system flags
  const allowedFlags = CONFIG.KRYX_RPG.allowedActorFlags.reduce((obj, f) => {
    obj[f] = null;
    return obj;
  }, {});
  if (actorData.flags.kryx_rpg) {
    actorData.flags.kryx_rpg = filterObject(actorData.flags.kryx_rpg, allowedFlags);
  }

  // Return the scrubbed data
  return actorData;
}


/* -------------------------------------------- */

/**
 * Migrate a single Item entity to incorporate latest data model changes
 * @param item
 */
export const migrateItemData = function (item) {
  const updateData = {};

  // Remove deprecated fields
  _migrateRemoveDeprecated(item, updateData);

  if (item.data.themes) {
    const itemThemes = item.data.themes.value
    const renameTheme = function (oldTheme, newTheme) {
      const index = itemThemes.indexOf(oldTheme);
      if (index !== -1) {
        itemThemes.splice(index, 1);
        itemThemes.push(newTheme)
      }
    }
    for (const [oldTheme, newTheme] of renamedThemes) renameTheme(oldTheme, newTheme)
    updateData["data.themes.value"] = itemThemes
  }

  if (item.data.armor && typeof (item.data.armor.dr) !== undefined) {
    const dup = duplicate(item.data.armor)
    dup.soak = dup.dr
    delete dup.dr
    updateData["data.armor"] = dup
  }

  // Return the migrated update data
  return updateData;
};

/* -------------------------------------------- */

/**
 * Migrate a single Scene entity to incorporate changes to the data model of it's actor data overrides
 * Return an Object of updateData to be applied
 * @param {Object} scene  The Scene data to Update
 * @return {Object}       The updateData to apply
 */
export const migrateSceneData = function (scene) {
  const tokens = duplicate(scene.tokens);
  return {
    tokens: tokens.map(t => {
      if (!t.actorId || t.actorLink || !t.actorData.data) {
        t.actorData = {};
        return t;
      }
      const token = new Token(t);
      if (!token.actor) {
        t.actorId = null;
        t.actorData = {};
      } else if (!t.actorLink) {
        const updateData = migrateActorData(token.data.actorData);
        t.actorData = mergeObject(token.data.actorData, updateData);
      }
      return t;
    })
  };
};

/* -------------------------------------------- */

/*  Low level migration utilities
/* -------------------------------------------- */

/**
 * Migrate the actor bonuses object
 * @private
 */
function _migrateActorBonuses(actor, updateData) {
  const b = game.system.model.Actor.character.bonuses;
  const dup = duplicate(actor.data.bonuses)
  for (let k of Object.keys(actor.data.bonuses || {})) {
    if (!(k in b)) {
      delete dup[k]
    }
  }
  updateData["data.bonuses"] = dup
}


/* -------------------------------------------- */


/**
 * A general migration to remove all fields from the data model which are flagged with a _deprecated tag
 * @private
 */
const _migrateRemoveDeprecated = function (ent, updateData) {
  const flat = flattenObject(ent.data);

  // Identify objects to deprecate
  const toDeprecate = Object.entries(flat).filter(e => e[0].endsWith("_deprecated") && (e[1] === true)).map(e => {
    let parent = e[0].split(".");
    parent.pop();
    return parent.join(".");
  });

  // Remove them
  for (let k of toDeprecate) {
    let parts = k.split(".");
    parts[parts.length - 1] = "-=" + parts[parts.length - 1];
    updateData[`data.${parts.join(".")}`] = null;
  }
};

/**
 * Return values:
 * - a number < 0 if a < b
 * - a number > 0 if a > b
 * - 0 if a = b
 */
function compareSemanticVersions(a, b) {
  const regExStrip0 = /(\.0+)+$/;
  const segmentsA = a.replace(regExStrip0, '').split('.');
  const segmentsB = b.replace(regExStrip0, '').split('.');
  const l = Math.min(segmentsA.length, segmentsB.length);

  let diff;
  for (let i = 0; i < l; i++) {
    diff = parseInt(segmentsA[i], 10) - parseInt(segmentsB[i], 10);
    if (diff) {
      return diff;
    }
  }
  return segmentsA.length - segmentsB.length;
}