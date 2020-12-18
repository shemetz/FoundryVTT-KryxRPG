// Namespace Kryx RPG Configuration Values
export const KRYX_RPG = {};

// ASCII Artwork
KRYX_RPG.ASCII = `_______________________________
 _  __                  _____  _____   _____ 
| |/ /                 |  __ \\|  __ \\ / ____|
| ' / _ __ _   ___  __ | |__) | |__) | |  __ 
|  < | '__| | | \\ \\/ / |  _  /|  ___/| | |_ |
| . \\| |  | |_| |>  <  | | \\ \\| |    | |__| |
|_|\\_\\_|   \\__, /_/\\_\\ |_|  \\_\\_|     \\_____|
            __/ |                            
           |___/                             
_______________________________`;


/**
 * The set of Ability Scores used within the system
 * @type {Object}
 */
KRYX_RPG.abilities = {
  "str": "KRYX_RPG.AbilityStr",
  "dex": "KRYX_RPG.AbilityDex",
  "con": "KRYX_RPG.AbilityCon",
  "int": "KRYX_RPG.AbilityInt",
  "wis": "KRYX_RPG.AbilityWis",
  "cha": "KRYX_RPG.AbilityCha"
};

KRYX_RPG.saves = {
  "fortitude": "KRYX_RPG.SaveFortitude",
  "reflex": "KRYX_RPG.SaveReflex",
  "will": "KRYX_RPG.SaveWill",
};

KRYX_RPG.shortenedAbility = {
  "Strength": "KRYX_RPG.AbilityStrShort",
  "Dexterity": "KRYX_RPG.AbilityDexShort",
  "Constitution": "KRYX_RPG.AbilityConShort",
  "Intelligence": "KRYX_RPG.AbilityIntShort",
  "Wisdom": "KRYX_RPG.AbilityWisShort",
  "Charisma": "KRYX_RPG.AbilityChaShort",
};

/* -------------------------------------------- */

KRYX_RPG.weaponProficiencies = {
  "sim": "KRYX_RPG.WeaponSimpleProficiency",
  "mar": "KRYX_RPG.WeaponMartialProficiency"
};

/* -------------------------------------------- */

/**
 * This Object defines the various lengths of time which can occur in Kryx RPG
 * @type {Object}
 */
KRYX_RPG.timePeriods = {
  "inst": "KRYX_RPG.TimeInst",
  "turn": "KRYX_RPG.TimeTurn",
  "round": "KRYX_RPG.TimeRound",
  "minute": "KRYX_RPG.TimeMinute",
  "hour": "KRYX_RPG.TimeHour",
  "day": "KRYX_RPG.TimeDay",
  "year": "KRYX_RPG.TimeYear",
  "perm": "KRYX_RPG.TimePerm",
  "spec": "KRYX_RPG.Special"
};

/* -------------------------------------------- */

/**
 * This describes the ways that an ability can be activated
 * @type {Object}
 */
KRYX_RPG.abilityActivationTypes = {
  "none": "KRYX_RPG.None",
  "action": "KRYX_RPG.Action",
  "2 actions": "KRYX_RPG.TwoActions",
  "attack": "KRYX_RPG.Attack",
  "reaction": "KRYX_RPG.Reaction",
  "1 minute": "1 minute",
  "10 minutes": "10 minutes",
  "1 hour": "1 hour",
  "special": KRYX_RPG.timePeriods.spec,
  "legendary": "KRYX_RPG.LegAct",
  "lair": "KRYX_RPG.LairAct",
  "free": "KRYX_RPG.FreeAction",
  "triggered": "KRYX_RPG.Triggered",
};

/* -------------------------------------------- */

KRYX_RPG.abilityConsumptionTypes = {
  "ammo": "KRYX_RPG.ConsumeAmmunition",
  "attribute": "KRYX_RPG.ConsumeAttribute",
  "material": "KRYX_RPG.ConsumeMaterial",
  "charges": "KRYX_RPG.ConsumeCharges"
};

/* -------------------------------------------- */

// Creature Sizes
KRYX_RPG.actorSizes = {
  "tiny": "KRYX_RPG.SizeTiny",
  "small": "KRYX_RPG.SizeSmall",
  "medium": "KRYX_RPG.SizeMedium",
  "large": "KRYX_RPG.SizeLarge",
  "huge": "KRYX_RPG.SizeHuge",
  "gargantuan": "KRYX_RPG.SizeGargantuan"
};

KRYX_RPG.tokenSizes = {
  "tiny": 1,
  "small": 1,
  "medium": 1,
  "large": 2,
  "huge": 3,
  "gargantuan": 4
};

/* -------------------------------------------- */

/**
 * Classification types for item action types
 * @type {Object}
 */
KRYX_RPG.itemActionTypes = {
  "mwak": "KRYX_RPG.ActionMWAK",
  "rwak": "KRYX_RPG.ActionRWAK",
  "msak": "KRYX_RPG.ActionMSAK",
  "rsak": "KRYX_RPG.ActionRSAK",
  "save": "KRYX_RPG.ActionSave",
  "autodmg": "KRYX_RPG.ActionAutoDamage",
  "heal": "KRYX_RPG.ActionHeal",
  "abil": "KRYX_RPG.ActionAbil",
  "util": "KRYX_RPG.ActionUtil",
  "affhp": "KRYX_RPG.ActionAffectHealth", // deprecated?
  "other": "KRYX_RPG.ActionOther"
};

/* -------------------------------------------- */

KRYX_RPG.itemCapacityTypes = {
  "items": "KRYX_RPG.ItemContainerCapacityItems",
  "weight": "KRYX_RPG.ItemContainerCapacityWeight"
};

/* -------------------------------------------- */

/**
 * Enumerate the lengths of time over which an item can have limited use ability
 * @type {Object}
 */
KRYX_RPG.limitedUsePeriods = {
  "sr": "KRYX_RPG.ShortRest",
  "lr": "KRYX_RPG.LongRest",
  "day": "KRYX_RPG.Day",
  "charges": "KRYX_RPG.Charges"
};

/* -------------------------------------------- */

/**
 * The set of equipment types for armor, clothing, and other objects which can ber worn by the character
 * @type {Object}
 */
KRYX_RPG.equipmentTypes = {
  "leather": "KRYX_RPG.EquipmentArmorLeather",
  "hide": "KRYX_RPG.EquipmentArmorHide",
  "chain": "KRYX_RPG.EquipmentArmorChain",
  "scale": "KRYX_RPG.EquipmentArmorScale",
  "plate": "KRYX_RPG.EquipmentArmorPlate",
  "bonus": "KRYX_RPG.EquipmentBonus",
  "natural": "KRYX_RPG.EquipmentNaturalArmor",
  "shield": "KRYX_RPG.EquipmentShield",
  "clothing": "KRYX_RPG.EquipmentClothing",
  "trinket": "KRYX_RPG.EquipmentTrinket"
};

/* -------------------------------------------- */

/**
 * The set of Armor Proficiencies which a character may have
 * @type {Object}
 */
KRYX_RPG.armorProficiencies = {
  "leather": KRYX_RPG.equipmentTypes.leather,
  "hide": KRYX_RPG.equipmentTypes.hide,
  "chain": KRYX_RPG.equipmentTypes.chain,
  "scale": KRYX_RPG.equipmentTypes.scale,
  "plate": KRYX_RPG.equipmentTypes.plate,
  "shield": KRYX_RPG.equipmentTypes.shield,
};

// special workaround so that armors can be shown in order
KRYX_RPG["data.traits.armorProf.ordering"] = {
  "leather": 1,
  "hide": 2,
  "chain": 3,
  "scale": 4,
  "plate": 5,
  "shield": 6,
};

/* -------------------------------------------- */

/**
 * Enumerate the valid consumable types which are recognized by the system
 * @type {Object}
 */
KRYX_RPG.consumableTypes = {
  "ammo": "KRYX_RPG.ConsumableAmmunition",
  "potion": "KRYX_RPG.ConsumablePotion",
  "poison": "KRYX_RPG.ConsumablePoison",
  "food": "KRYX_RPG.ConsumableFood",
  "scroll": "KRYX_RPG.ConsumableScroll",
  "wand": "KRYX_RPG.ConsumableWand",
  "rod": "KRYX_RPG.ConsumableRod",
  "trinket": "KRYX_RPG.ConsumableTrinket"
};

/* -------------------------------------------- */

/**
 * The valid currency denominations supported by the Kryx RPG system
 * @type {Object}
 */
KRYX_RPG.currencies = {
  "pp": "KRYX_RPG.CurrencyPP",
  "gp": "KRYX_RPG.CurrencyGP",
  "sp": "KRYX_RPG.CurrencySP",
  "cp": "KRYX_RPG.CurrencyCP",
};

/* -------------------------------------------- */


// Damage Types
KRYX_RPG.damageTypes = {
  "acid": "KRYX_RPG.DamageAcid",
  "bludgeoning": "KRYX_RPG.DamageBludgeoning",
  "cold": "KRYX_RPG.DamageCold",
  "fire": "KRYX_RPG.DamageFire",
  "force": "KRYX_RPG.DamageForce",
  "lightning": "KRYX_RPG.DamageLightning",
  "necrotic": "KRYX_RPG.DamageNecrotic",
  "piercing": "KRYX_RPG.DamagePiercing",
  "poison": "KRYX_RPG.DamagePoison",
  "psychic": "KRYX_RPG.DamagePsychic",
  "radiant": "KRYX_RPG.DamageRadiant",
  "slashing": "KRYX_RPG.DamageSlashing",
  "concussion": "KRYX_RPG.DamageConcussion",
  "healing": "KRYX_RPG.DamageHealing",
  "temphp": "KRYX_RPG.DamageTempHp",
  "totalhp": "KRYX_RPG.DamageTotalHp",
  "same": "KRYX_RPG.DamageSame",
  "chaos": "KRYX_RPG.DamageChaos",
};

/* -------------------------------------------- */

KRYX_RPG.distanceUnits = {
  "none": "KRYX_RPG.None",
  "self": "KRYX_RPG.DistSelf",
  "touch": "KRYX_RPG.DistTouch",
  "ft": "KRYX_RPG.DistFt",
  "mi": "KRYX_RPG.DistMi",
  "spec": "KRYX_RPG.Special",
  "sight": "KRYX_RPG.DistSight",
  "any": "KRYX_RPG.DistAny"
};

/* -------------------------------------------- */


/**
 * Configure aspects of encumbrance calculation so that it could be configured by modules
 * @type {Object}
 */
KRYX_RPG.encumbrance = {
  currencyPerWeight: 50,
  base: 150,
  strMultiplier: 30
};

/* -------------------------------------------- */

/**
 * This Object defines the types of single or area targets which can be applied in Kryx RPG.
 *
 * All of these are standard sizes, unless they are "Double" (= twice as big as normal) or a nonstandard area
 * @type {Object}
 */
KRYX_RPG.targetTypes = {
  "none": "KRYX_RPG.None",
  "self": "KRYX_RPG.TargetSelf",
  "creature": "KRYX_RPG.TargetCreature", // includes "creature or object"
  "object": "KRYX_RPG.TargetObject",
  "space": "KRYX_RPG.TargetSpace",
  "area": "KRYX_RPG.TargetArea",
  "radiusCreatures": "KRYX_RPG.TargetRadiusCreatures",
  "radiusSense": "KRYX_RPG.TargetRadiusSense",
  "sphere": "KRYX_RPG.TargetSphere",
  "sphereDouble": "KRYX_RPG.TargetSphereDouble",
  "nearPoint": "KRYX_RPG.TargetNearPoint",
  "cylinder": "KRYX_RPG.TargetCylinder",
  "cylinderDouble": "KRYX_RPG.TargetCylinderDouble",
  "cone": "KRYX_RPG.TargetCone",
  "line": "KRYX_RPG.TargetLine",
  "coneOrLine": "KRYX_RPG.TargetConeOrLine",
  "wall": "KRYX_RPG.TargetWall",
  "wallDouble": "KRYX_RPG.TargetWallDouble",
  "special": "KRYX_RPG.TargetSpecial",
};

/* -------------------------------------------- */

/**
 * Many AoEs have size that depends on amount of mana (or other resource) used, a.k.a "augment sizes".
 * Usually effects will either say "a sphere" or "a sphere twice as big as normal", for example.
 */
KRYX_RPG.areaScalingStandardSizes = {
  "cone": 15,
  "coneOrLine": 15,
  "line": 15,
  "sphere": 5,
  "cylinder": 5,
  "wall": 15,
  "sphereDouble": 10,
  "cylinderDouble": 10,
  "wallDouble": 30,
}

/* -------------------------------------------- */


/**
 * Map the subset of target types which produce a template area of effect
 * The keys are Kryx RPG target types and the values are MeasuredTemplate shape types
 * @type {Object}
 */
KRYX_RPG.areaTargetTypes = {
  cone: "cone",
  cylinder: "circle",
  line: "ray",
  radiusCreatures: "circle",
  sphere: "circle",
  wall: "line",
  coneOrLine: "", //exists here just to allow it as area type
  cylinderDouble: "circle",
  sphereDouble: "circle",
  wallDouble: "line",
};


/* -------------------------------------------- */


/* -------------------------------------------- */

/**
 * Character senses options
 * @type {Object}
 */
KRYX_RPG.senses = {
  "blindsight": "KRYX_RPG.SenseBlindsight",
  "darkvision": "KRYX_RPG.SenseDarkvision",
  "truesight": "KRYX_RPG.SenseTruesight",
  "tremorsense": "KRYX_RPG.SenseTremorsense"
};


/* -------------------------------------------- */

/**
 * The set of skill which can be trained in Kryx RPG
 * @type {Object}
 */
KRYX_RPG.skills = {
  "alchemy": "KRYX_RPG.SkillAlchemy",
  "arcana": "KRYX_RPG.SkillArcana",
  "athletics": "KRYX_RPG.SkillAthletics",
  "brawn": "KRYX_RPG.SkillBrawn",
  "coercion": "KRYX_RPG.SkillCoercion",
  "acrobatics": "KRYX_RPG.SkillAcrobatics",
  "deception": "KRYX_RPG.SkillDeception",
  "divinity": "KRYX_RPG.SkillDivinity",
  "engineering": "KRYX_RPG.SkillEngineering",
  "insight": "KRYX_RPG.SkillInsight",
  "medicine": "KRYX_RPG.SkillMedicine",
  "occult": "KRYX_RPG.SkillOccult",
  "perception": "KRYX_RPG.SkillPerception",
  "performance": "KRYX_RPG.SkillPerformance",
  "persuasion": "KRYX_RPG.SkillPersuasion",
  "primal": "KRYX_RPG.SkillPrimal",
  "psionics": "KRYX_RPG.SkillPsionics",
  "skulduggery": "KRYX_RPG.SkillSkulduggery",
  "stealth": "KRYX_RPG.SkillStealth",
  "streetwise": "KRYX_RPG.SkillStreetwise",
  "wilderness": "KRYX_RPG.SkillWilderness",
};


/* -------------------------------------------- */

KRYX_RPG.superpowerAvailability = {
  "known": "KRYX_RPG.SuperpowerAvailabilityKnown", // most superpowers are like this
  "atwill": "KRYX_RPG.SuperpowerAvailabilityAtWill", // e.g. if given by the Barkskinned feat
  "limited": "KRYX_RPG.SuperpowerAvailabilityLimited", // e.g. if given by the Divine Bearer feature (Celestial Suffused)
  "spellbook": "KRYX_RPG.SuperpowerAvailabilitySpellbook", // in spellbook and not currently known (Wizard, Mage)
};

KRYX_RPG.featureTypes = {
  "classFeature": "KRYX_RPG.FeatureTypeClassFeature",
  "feat": "KRYX_RPG.FeatureTypeFeat",
  "speciesTrait": "KRYX_RPG.FeatureTypeSpeciesTrait",
  "fightingStyle": "KRYX_RPG.FeatureTypeFightingStyle",
  "boon": "KRYX_RPG.FeatureTypeBoon",
  // others will likely be added here
};

/**
 * The available choices for how superpower damage scaling may be computed
 * @type {Object}
 */
KRYX_RPG.superpowerScalingModes = {
  "none": "KRYX_RPG.ScalingNone", // does not scale
  "cantrip": "KRYX_RPG.ScalingCantrip", // scales at levels 5, 9, 13, 17
  "augment": "KRYX_RPG.ScalingAugment", // scales when augmented
  "enhance": "KRYX_RPG.ScalingEnhance", // scales when enhanced (identical to augment)
};

/* -------------------------------------------- */


/**
 * Define the set of types which a weapon item can take
 * @type {Object}
 */
KRYX_RPG.weaponTypes = {
  "simpleM": "KRYX_RPG.WeaponSimpleM",
  "simpleR": "KRYX_RPG.WeaponSimpleR",
  "martialM": "KRYX_RPG.WeaponMartialM",
  "martialR": "KRYX_RPG.WeaponMartialR",
  "natural": "KRYX_RPG.WeaponNatural",
  "improv": "KRYX_RPG.WeaponImprov"
};


/* -------------------------------------------- */

/**
 * Define the set of weapon property flags which can exist on a weapon
 * @type {Object}
 */
KRYX_RPG.weaponProperties = {
  "amm": "KRYX_RPG.WeaponPropertiesAmm",
  "hvy": "KRYX_RPG.WeaponPropertiesHvy",
  "fin": "KRYX_RPG.WeaponPropertiesFin",
  "lgt": "KRYX_RPG.WeaponPropertiesLgt",
  "lod": "KRYX_RPG.WeaponPropertiesLod",
  "rch": "KRYX_RPG.WeaponPropertiesRch",
  "spc": "KRYX_RPG.WeaponPropertiesSpc",
  "thr": "KRYX_RPG.WeaponPropertiesThr",
  "two": "KRYX_RPG.WeaponPropertiesTwo",
  "ver": "KRYX_RPG.WeaponPropertiesVer",
  "sil": "KRYX_RPG.WeaponPropertiesSil",
};

// Themes
KRYX_RPG.themes = {
  "Acid": "KRYX_RPG.ThemeAcid",
  "Air": "KRYX_RPG.ThemeAir",
  "Alteration": "KRYX_RPG.ThemeAlteration",
  "Antimagic": "KRYX_RPG.ThemeAntimagic",
  "Beast": "KRYX_RPG.ThemeBeast",
  "Blood": "KRYX_RPG.ThemeBlood",
  "Chaos": "KRYX_RPG.ThemeChaos",
  "Charm": "KRYX_RPG.ThemeCharm",
  "Courage": "KRYX_RPG.ThemeCourage",
  "Creation": "KRYX_RPG.ThemeCreation",
  "Death": "KRYX_RPG.ThemeDeath",
  "Deceit": "KRYX_RPG.ThemeDeceit",
  "Divination": "KRYX_RPG.ThemeDivination",
  "Earth": "KRYX_RPG.ThemeEarth",
  "Fate": "KRYX_RPG.ThemeFate",
  "Fear": "KRYX_RPG.ThemeFear",
  "Fire": "KRYX_RPG.ThemeFire",
  "Force": "KRYX_RPG.ThemeForce",
  "Gravity": "KRYX_RPG.ThemeGravity",
  "Guardian": "KRYX_RPG.ThemeGuardian",
  "Holy": "KRYX_RPG.ThemeHoly",
  "Ice": "KRYX_RPG.ThemeIce",
  "Life": "KRYX_RPG.ThemeLife",
  "Light": "KRYX_RPG.ThemeLight",
  "Marksman": "KRYX_RPG.ThemeMarksman",
  "Madness": "KRYX_RPG.ThemeMadness",
  "Mind": "KRYX_RPG.ThemeMind",
  "Planes": "KRYX_RPG.ThemePlanes",
  "Plants": "KRYX_RPG.ThemePlants",
  "Poison": "KRYX_RPG.ThemePoison",
  "Sand": "KRYX_RPG.ThemeSand",
  "Sentinel": "KRYX_RPG.ThemeSentinel",
  "Shadow": "KRYX_RPG.ThemeShadow",
  "Skirmish": "KRYX_RPG.ThemeSkirmish",
  "Spirit": "KRYX_RPG.ThemeSpirit",
  "Storm": "KRYX_RPG.ThemeStorm",
  "Telekinesis": "KRYX_RPG.ThemeTelekinesis",
  "Teleportation": "KRYX_RPG.ThemeTeleportation",
  "Time": "KRYX_RPG.ThemeTime",
  "Undeath": "KRYX_RPG.ThemeUndeath",
  "Unholy": "KRYX_RPG.ThemeUnholy",
  "Vanguard": "KRYX_RPG.ThemeVanguard",
  "Water": "KRYX_RPG.ThemeWater",
};

KRYX_RPG.powerSources = {
  "arcane": "KRYX_RPG.PowerSourceArcane",
  "divine": "KRYX_RPG.PowerSourceDivine",
  "occult": "KRYX_RPG.PowerSourceOccult",
  "primal": "KRYX_RPG.PowerSourcePrimal",
  "psionic": "KRYX_RPG.PowerSourcePsionic"
};

/* -------------------------------------------- */

/**
 * Skill, ability, and save proficiency levels
 * Each level provides a proficiency multiplier
 * @type {Object}
 */
KRYX_RPG.proficiencyLevels = {
  "0": "KRYX_RPG.NotProficient",
  "0.5": "KRYX_RPG.Capable",
  "1": "KRYX_RPG.Proficient",
  "1.5": "KRYX_RPG.Expertise", // removed in KryxRPG 25.28.0, for player characters
};

KRYX_RPG.PROFICIENCY_LEVELS = [
  0.0,
  0.5,
  1.0,
];

KRYX_RPG.PROFICIENCY_LEVELS_FOR_NPC = [
  0.0,
  0.5,
  1.0,
  1.5,
];

/* -------------------------------------------- */


// Condition types (that characters can be immune to)
KRYX_RPG.conditionTypes = {
  "blinded": "KRYX_RPG.ConBlinded",
  "burning": "KRYX_RPG.ConBurning",
  "charmed": "KRYX_RPG.ConCharmed",
  "confused": "KRYX_RPG.ConConfused",
  "deafened": "KRYX_RPG.ConDeafened",
  "diseased": "KRYX_RPG.ConDiseased",
  "exhausted": "KRYX_RPG.ConExhausted",
  "frightened": "KRYX_RPG.ConFrightened",
  "grappled": "KRYX_RPG.ConGrappled",
  "hasted": "KRYX_RPG.ConHasted",
  "incapacitated": "KRYX_RPG.ConIncapacitated",
  "invisible": "KRYX_RPG.ConInvisible",
  "paralyzed": "KRYX_RPG.ConParalyzed",
  "petrified": "KRYX_RPG.ConPetrified",
  "poisoned": "KRYX_RPG.ConPoisoned",
  "prone": "KRYX_RPG.ConProne",
  "restrained": "KRYX_RPG.ConRestrained",
  "slowed": "KRYX_RPG.ConSlowed",
  "staggered": "KRYX_RPG.ConStaggered",
  "stunned": "KRYX_RPG.ConStunned",
  "unconscious": "KRYX_RPG.ConUnconscious"
};

KRYX_RPG.languages = {
  "abyssal": "KRYX_RPG.LanguagesAbyssal",
  "aklo": "KRYX_RPG.LanguagesAklo",
  "aquan": "KRYX_RPG.LanguagesAquan",
  "auran": "KRYX_RPG.LanguagesAuran",
  "celestial": "KRYX_RPG.LanguagesCelestial",
  "common": "KRYX_RPG.LanguagesCommon",
  "draconic": "KRYX_RPG.LanguagesDraconic",
  "dwarven": "KRYX_RPG.LanguagesDwarven",
  "elvish": "KRYX_RPG.LanguagesElvish",
  "gith": "KRYX_RPG.LanguagesGith",
  "gnomish": "KRYX_RPG.LanguagesGnomish",
  "goblin": "KRYX_RPG.LanguagesGoblin",
  "halfling": "KRYX_RPG.LanguagesHalfling",
  "ignan": "KRYX_RPG.LanguagesIgnan",
  "infernal": "KRYX_RPG.LanguagesInfernal",
  "jotun": "KRYX_RPG.LanguagesJotun",
  "orcish": "KRYX_RPG.LanguagesOrcish",
  "sylvan": "KRYX_RPG.LanguagesSylvan",
  "terran": "KRYX_RPG.LanguagesTerran",
  "undercommon": "KRYX_RPG.LanguagesUndercommon"
};

// TODO - EXP - remove?
// Character Level XP Requirements
KRYX_RPG.CHARACTER_EXP_LEVELS = [
  0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000, 100000,
  120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000]
;

// Challenge Rating XP Levels
KRYX_RPG.CR_EXP_LEVELS = [
  10, 200, 450, 700, 1100, 1800, 2300, 2900, 3900, 5000, 5900, 7200, 8400, 10000, 11500, 13000, 15000, 18000,
  20000, 22000, 25000, 33000, 41000, 50000, 62000, 75000, 90000, 105000, 120000, 135000, 155000
];

KRYX_RPG.resourceProgression = {
  "fullCaster": "KRYX_RPG.ResourceProgressionFullCaster",
  "gishSpells": "KRYX_RPG.ResourceProgressionGishSpells",
  "gishHalfHalf": "KRYX_RPG.ResourceProgressionGishHalfHalf",
  "gishManeuvers": "KRYX_RPG.ResourceProgressionGishManeuvers",
  "fullMartial": "KRYX_RPG.ResourceProgressionFullMartial",
  "none": "KRYX_RPG.ResourceProgressionNone",
};

/**
 * see https://docs.google.com/spreadsheets/d/1sGvcz9vbq9yk4kRBEY6ZYGWhGO6-t7CWudznQcWPk74
 */
KRYX_RPG.RESOURCE_PROGRESSION_MULTIPLIERS = {
  "fullCaster": {
    mana: 1.5,
    manaLimit: 0.25,
    stamina: 0,
    staminaLimit: 0,
  },
  "gishSpells": {
    mana: 0.75,
    manaLimit: 0.125,
    stamina: 0,
    staminaLimit: 0,
  },
  "gishHalfHalf": {
    mana: 0.375, // minimum 1, at 1st level
    manaLimit: 0.125,
    stamina: 1.125,
    staminaLimit: 0.25,
  },
  "gishManeuvers": {
    mana: 0,
    manaLimit: 0,
    stamina: 2.25,
    staminaLimit: 0.25,
  },
  "fullMartial": {
    mana: 0,
    manaLimit: 0,
    stamina: 2.25,
    staminaLimit: 0.25,
  },
  "none": {
    mana: 0,
    manaLimit: 0,
    stamina: 0,
    staminaLimit: 0,
  },
};

// "Arsenal" is the current temporary name of "The spells, maneuvers, and concoctions that a character is able to use".
KRYX_RPG.ARSENAL_ORDERING = {
  "atwill_spell": 1, // includes cantrips
  "limited_spell": 2,
  "known_spell": 3,
  "spellbook_spell": 4,
  "atwill_maneuver": 11,
  "limited_maneuver": 12,
  "known_maneuver": 13,
}

// Used for items
KRYX_RPG.mainResourceByPowerType = {
  "spell": {
    "remaining": 0,
    "max": 0,
    "limit": 0,
    "dc": 0,
    "name": "mana",
    "nameSingular": "mana",
    "nameOfEffect": "spell",
    "nameOfUse": "cast",
  },
  "maneuver": {
    "remaining": 0,
    "max": 0,
    "limit": 0,
    "dc": 0,
    "name": "stamina",
    "nameSingular": "stamina",
    "nameOfEffect": "maneuver",
    "nameOfUse": "use",
  },
  "concoction": {
    "remaining": 0,
    "max": 0,
    "limit": 0,
    "dc": 0,
    "name": "catalysts",
    "nameSingular": "catalyst",
    "nameOfEffect": "concoction",
    "nameOfUse": "craft",
  },
}

// Configure Optional Character Flags
KRYX_RPG.characterFlags = {
  "savageAttacker": {
    name: "KRYX_RPG.FlagsSavageAttacker",
    hint: "KRYX_RPG.FlagsSavageAttackerHint",
    section: "Features",
    type: Boolean
  },
  "halflingLucky": {
    name: "KRYX_RPG.FlagsHalflingLucky",
    hint: "KRYX_RPG.FlagsHalflingLuckyHint",
    section: "Features",
    type: Boolean
  },
  "reliableTalent": {
    name: "KRYX_RPG.FlagsReliableTalent",
    hint: "KRYX_RPG.FlagsReliableTalentHint",
    section: "Features",
    type: Boolean
  },
  "earForDeceit": {
    name: "KRYX_RPG.FlagsEarForDeceit",
    hint: "KRYX_RPG.FlagsEarForDeceitHint",
    section: "Features",
    type: Boolean
  },
  "carryingCapacityMultiplier": {
    name: "KRYX_RPG.FlagsCarryingCapacityMultiplier",
    hint: "KRYX_RPG.FlagsCarryingCapacityMultiplierHint",
    section: "Miscellaneous",
    type: Number,
    placeholder: 1
  },
  "initiativeAdv": {
    name: "KRYX_RPG.FlagsInitiativeAdv",
    hint: "KRYX_RPG.FlagsInitiativeAdvHint",
    section: "Miscellaneous",
    type: Boolean
  },
  "allowPickingUnknownThemes": {
    name: "KRYX_RPG.FlagsAllowPickingUnknownThemes",
    hint: "KRYX_RPG.FlagsAllowPickingUnknownThemesHint",
    section: "Miscellaneous",
    type: Boolean
  },
  "showDamageImmunityAndSuch": {
    name: "KRYX_RPG.FlagsShowDamageImmunityAndSuch",
    hint: "KRYX_RPG.FlagsShowDamageImmunityAndSuchHint",
    section: "Miscellaneous",
    type: Boolean
  },
  "onlyCountEquippedItemWeight": {
    name: "KRYX_RPG.FlagsOnlyCountEquippedItemWeight",
    hint: "KRYX_RPG.FlagsOnlyCountEquippedItemWeight",
    section: "Miscellaneous",
    type: Boolean
  },
};

// Configure allowed status flags
KRYX_RPG.allowedActorFlags = Object.keys(KRYX_RPG.characterFlags)

KRYX_RPG.systemData = {
  classes: {
    "Acolyte": {
      "archetypes": {
        "Priest": {"healthDice": "d6", "progressionChoiceType": "caster"},
        "Paladin": {"healthDice": "d10", "progressionChoiceType": "gish"},
        "Avenger": {"healthDice": "d8", "progressionChoiceType": "gish"},
        "Sacred Fist": {"healthDice": "d8", "progressionChoiceType": "gish"},
      },
      "subclassName": "Divine Domain",
    },
    "Alchemist": {
      "archetypes": {
        "Chemist": {"healthDice": "d6", "progressionChoiceType": "caster"},
        "Mutant": {"healthDice": "d8", "progressionChoiceType": "spellgish"},
      },
      "subclassName": "Alchemical Discipline",
    },
    "Mage": {
      "archetypes": {
        "Wizard": {"healthDice": "d6", "progressionChoiceType": "caster"},
        "Magus": {"healthDice": "d8", "progressionChoiceType": "spellgish"},
      },
      "subclassName": "Arcane Tradition",
    },
    "Naturalist": {
      "archetypes": {
        "Druid": {"healthDice": "d6", "progressionChoiceType": "caster"},
        "Ranger": {"healthDice": "d8", "progressionChoiceType": "gish"},
        "Warden": {"healthDice": "d10", "progressionChoiceType": "gish"},
      },
      "subclassName": "Circle",
    },
    "Psionicist": {
      "archetypes": {
        "Psion": {"healthDice": "d6", "progressionChoiceType": "caster"},
        "Soulknife": {"healthDice": "d10", "progressionChoiceType": "psiongish"},
        "Monk": {"healthDice": "d8", "progressionChoiceType": "psiongish"},
      },
      "subclassName": "Psychic Order",
    },
    "Rogue": {
      "archetypes": {
        "Infiltrator": {"healthDice": "d8", "progressionChoiceType": "gish"},
        "Spellthief": {"healthDice": "d8", "progressionChoiceType": "spellgish"},
        "Blood Hunter": {"healthDice": "d8", "progressionChoiceType": "gish"},
      },
      "subclassName": "Roguish Subclass",
    },
    "Suffused": {
      "archetypes": {
        // Splitting Sorcerer/Witch/Warlock just because players would probably want to just show one name
        "Sorcerer": {"healthDice": "d6", "progressionChoiceType": "caster"},
        "Witch": {"healthDice": "d6", "progressionChoiceType": "caster"},
        "Warlock": {"healthDice": "d6", "progressionChoiceType": "caster"},
        "Bloodrager": {"healthDice": "d10", "progressionChoiceType": "spellgish"},
        "Infuser": {"healthDice": "d8", "progressionChoiceType": "spellgish"},
      },
      "subclassName": "Origin",
    },
    "Warrior": {
      "archetypes": {
        "Battlemaster": {"healthDice": "d10", "progressionChoiceType": "martial"},
        "Berserker": {"healthDice": "d10", "progressionChoiceType": "martial"}
      },
      "subclassName": "Martial Specialization",
    },
    // used for some monsters like the frog
    "None": {
      "archetypes": {
        "Nothing": {"healthDice": "d4", "progressionChoiceType": "none"},
      },
      "subclassName": 'Special "subclass"',
    },
  },
  classProgressionChoiceTypes: {
    // no choice will be shown for these:
    "caster": ["fullCaster"],
    "martial": ["fullMartial"],
    "psiongish": ["gishSpells"],
    // for these, there are several options for progression
    "gish": ["gishSpells", "gishHalfHalf", "gishManeuvers"],
    "spellgish": ["gishSpells", "gishHalfHalf"],
    // used for some monsters like the frog
    "none": ["none"],
  },
  archetypesThatHaveConcoctions: ["Chemist", "Mutant", "Infiltrator", "Blood Hunter"],
  spellcastingAbilities: ["int", "wis", "cha"],
  maneuverAbilities: ["str", "dex"],
  skillAbilities: {
    "alchemy": "int",
    "arcana": "int",
    "athletics": "str",
    "brawn": "str",
    "coercion": "cha",
    "acrobatics": "dex",
    "deception": "cha",
    "divinity": "wis",
    "engineering": "int",
    "insight": "wis",
    "medicine": "wis",
    "occult": "int",
    "perception": "wis",
    "performance": "cha",
    "persuasion": "cha",
    "primal": "wis",
    "psionics": "int",
    "skulduggery": "dex",
    "stealth": "dex",
    "streetwise": "cha",
    "wilderness": "wis",
  }
}