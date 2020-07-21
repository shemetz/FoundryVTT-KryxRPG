export const NEEDS_MIGRATION_VERSION = "24.9.0-1";
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

/**
 * Perform a system migration for the entire World, applying migrations for Actors, Items, and Compendium packs
 * @return {Promise}      A Promise which resolves once the migration is completed
 */
export const migrateWorld = async function () {
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
  const actorSkills = actor.data.skills
  const updateDataSkills = {}
  const renameSkill = function (oldSkill, newSkill) {
    if (actorSkills[oldSkill]) {
      updateDataSkills[newSkill] = actorSkills[oldSkill]
      updateDataSkills[`-=${oldSkill}`] = null
    }
  }
  for (const [oldSkill, newSkill] of renamedSkills) renameSkill(oldSkill, newSkill)
  updateData["data.skills"] = updateDataSkills
}

const _migrateMiscCharacter = function (actor, updateData) {
  if (typeof(actor.data.class.hitDice) !== undefined) {
    const updateDataClass = {}
    updateDataClass['-=hitDice'] = null
    updateDataClass['-=hitDiceUsed'] = null
    updateDataClass['healthDice'] = actor.data.class.hitDice
    updateDataClass['healthDiceUsed'] = actor.data.class.hitDiceUsed
    updateData["data.class"] = updateDataClass
  }

  if (typeof(actor.data.attributes.ac) !== undefined) {
    const updateDataAttributes = {}
    updateDataAttributes['-=ac'] = null
    updateDataAttributes['-=hp'] = null
    updateDataAttributes['defense'] = actor.data.attributes.ac
    updateDataAttributes['health'] = actor.data.attributes.hp
    updateData["data.attributes"] = updateDataAttributes
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

  if (item.data.armor && typeof(item.data.armor.dr) !== undefined) {
    updateData["data.armor"] = {
      "-=dr": null,
      "soak": item.armor.dr,
    }
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
  for (let k of Object.keys(actor.data.bonuses || {})) {
    if (k in b) updateData[`data.bonuses.${k}`] = b[k];
    else updateData[`data.bonuses.-=${k}`] = null;
  }
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
