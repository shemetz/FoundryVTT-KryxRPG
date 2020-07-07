// Namespace Kryx RPG Configuration Values
export const KRYX_RPG = {};

// ASCII Artwork
KRYX_RPG.ASCII = `_______________________________
______      ______ _____ _____ 
|  _  \\___  |  _  \\  ___|  ___|
| | | ( _ ) | | | |___ \\| |__  
| | | / _ \\/\\ | | |   \\ \\  __| 
| |/ / (_>  < |/ //\\__/ / |___ 
|___/ \\___/\\/___/ \\____/\\____/
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

/* -------------------------------------------- */

/**
 * Character alignment options
 * @type {Object}
 */
KRYX_RPG.alignments = {
  'lg': "KRYX_RPG.AlignmentLG",
  'ng': "KRYX_RPG.AlignmentNG",
  'cg': "KRYX_RPG.AlignmentCG",
  'ln': "KRYX_RPG.AlignmentLN",
  'tn': "KRYX_RPG.AlignmentTN",
  'cn': "KRYX_RPG.AlignmentCN",
  'le': "KRYX_RPG.AlignmentLE",
  'ne': "KRYX_RPG.AlignmentNE",
  'ce': "KRYX_RPG.AlignmentCE"
};


KRYX_RPG.weaponProficiencies = {
  "sim": "KRYX_RPG.WeaponSimpleProficiency",
  "mar": "KRYX_RPG.WeaponMartialProficiency"
};

KRYX_RPG.toolProficiencies = {
  "art": "KRYX_RPG.ToolArtisans",
  "disg": "KRYX_RPG.ToolDisguiseKit",
  "forg": "KRYX_RPG.ToolForgeryKit",
  "game": "KRYX_RPG.ToolGamingSet",
  "herb": "KRYX_RPG.ToolHerbalismKit",
  "music": "KRYX_RPG.ToolMusicalInstrument",
  "navg": "KRYX_RPG.ToolNavigators",
  "pois": "KRYX_RPG.ToolPoisonersKit",
  "thief": "KRYX_RPG.ToolThieves",
  "vehicle": "KRYX_RPG.ToolVehicle"
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
  "month": "KRYX_RPG.TimeMonth",
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
  "bonus": "KRYX_RPG.BonusAction",
  "reaction": "KRYX_RPG.Reaction",
  "minute": KRYX_RPG.timePeriods.minute,
  "hour": KRYX_RPG.timePeriods.hour,
  "day": KRYX_RPG.timePeriods.day,
  "special": KRYX_RPG.timePeriods.spec,
  "legendary": "KRYX_RPG.LegAct",
  "lair": "KRYX_RPG.LairAct"
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
  "sm": "KRYX_RPG.SizeSmall",
  "med": "KRYX_RPG.SizeMedium",
  "lg": "KRYX_RPG.SizeLarge",
  "huge": "KRYX_RPG.SizeHuge",
  "grg": "KRYX_RPG.SizeGargantuan"
};

KRYX_RPG.tokenSizes = {
  "tiny": 1,
  "sm": 1,
  "med": 1,
  "lg": 2,
  "huge": 3,
  "grg": 4
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
  "heal": "KRYX_RPG.ActionHeal",
  "abil": "KRYX_RPG.ActionAbil",
  "util": "KRYX_RPG.ActionUtil",
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
  "light": "KRYX_RPG.EquipmentLight",
  "medium": "KRYX_RPG.EquipmentMedium",
  "heavy": "KRYX_RPG.EquipmentHeavy",
  "bonus": "KRYX_RPG.EquipmentBonus",
  "natural": "KRYX_RPG.EquipmentNatural",
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
  "lgt": KRYX_RPG.equipmentTypes.light,
  "med": KRYX_RPG.equipmentTypes.medium,
  "hvy": KRYX_RPG.equipmentTypes.heavy,
  "shl": "KRYX_RPG.EquipmentShieldProficiency"
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
  "ep": "KRYX_RPG.CurrencyEP",
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
  "thunder": "KRYX_RPG.DamageThunder"
};

/* -------------------------------------------- */

KRYX_RPG.distanceUnits = {
  "none": "KRYX_RPG.None",
  "self": "KRYX_RPG.DistSelf",
  "touch": "KRYX_RPG.DistTouch",
  "ft": "KRYX_RPG.DistFt",
  "mi": "KRYX_RPG.DistMi",
  "spec": "KRYX_RPG.Special",
  "any": "KRYX_RPG.DistAny"
};

/* -------------------------------------------- */


/**
 * Configure aspects of encumbrance calculation so that it could be configured by modules
 * @type {Object}
 */
KRYX_RPG.encumbrance = {
  currencyPerWeight: 50,
  strMultiplier: 15
};

/* -------------------------------------------- */

/**
 * This Object defines the types of single or area targets which can be applied in Kryx RPG
 * @type {Object}
 */
KRYX_RPG.targetTypes = {
  "none": "KRYX_RPG.None",
  "self": "KRYX_RPG.TargetSelf",
  "creature": "KRYX_RPG.TargetCreature",
  "ally": "KRYX_RPG.TargetAlly",
  "enemy": "KRYX_RPG.TargetEnemy",
  "object": "KRYX_RPG.TargetObject",
  "space": "KRYX_RPG.TargetSpace",
  "radius": "KRYX_RPG.TargetRadius",
  "sphere": "KRYX_RPG.TargetSphere",
  "cylinder": "KRYX_RPG.TargetCylinder",
  "cone": "KRYX_RPG.TargetCone",
  "square": "KRYX_RPG.TargetSquare",
  "cube": "KRYX_RPG.TargetCube",
  "line": "KRYX_RPG.TargetLine",
  "wall": "KRYX_RPG.TargetWall"
};


/* -------------------------------------------- */


/**
 * Map the subset of target types which produce a template area of effect
 * The keys are KRYX_RPG target types and the values are MeasuredTemplate shape types
 * @type {Object}
 */
KRYX_RPG.areaTargetTypes = {
  cone: "cone",
  cube: "rect",
  cylinder: "circle",
  line: "ray",
  radius: "circle",
  sphere: "circle",
  square: "rect",
  wall: "ray"
};


/* -------------------------------------------- */

// Healing Types
KRYX_RPG.healingTypes = {
  "healing": "KRYX_RPG.Healing",
  "temphp": "KRYX_RPG.HealingTemp"
};


/* -------------------------------------------- */


/**
 * Enumerate the denominations of hit dice which can apply to classes in the Kryx RPG system
 * @type {Array.<string>}
 */
KRYX_RPG.hitDieTypes = ["d6", "d8", "d10", "d12"];


/* -------------------------------------------- */

/**
 * Character senses options
 * @type {Object}
 */
KRYX_RPG.senses = {
  "bs": "KRYX_RPG.SenseBS",
  "dv": "KRYX_RPG.SenseDV",
  "ts": "KRYX_RPG.SenseTS",
  "tr": "KRYX_RPG.SenseTR"
};


/* -------------------------------------------- */

/**
 * The set of skill which can be trained in Kryx RPG
 * @type {Object}
 */
KRYX_RPG.skills = {
  "acr": "KRYX_RPG.SkillAcr",
  "ani": "KRYX_RPG.SkillAni",
  "arc": "KRYX_RPG.SkillArc",
  "ath": "KRYX_RPG.SkillAth",
  "dec": "KRYX_RPG.SkillDec",
  "his": "KRYX_RPG.SkillHis",
  "ins": "KRYX_RPG.SkillIns",
  "itm": "KRYX_RPG.SkillItm",
  "inv": "KRYX_RPG.SkillInv",
  "med": "KRYX_RPG.SkillMed",
  "nat": "KRYX_RPG.SkillNat",
  "prc": "KRYX_RPG.SkillPrc",
  "prf": "KRYX_RPG.SkillPrf",
  "per": "KRYX_RPG.SkillPer",
  "rel": "KRYX_RPG.SkillRel",
  "slt": "KRYX_RPG.SkillSlt",
  "ste": "KRYX_RPG.SkillSte",
  "sur": "KRYX_RPG.SkillSur"
};


/* -------------------------------------------- */

KRYX_RPG.spellPreparationModes = {
  "always": "KRYX_RPG.SpellPrepAlways",
  "atwill": "KRYX_RPG.SpellPrepAtWill",
  "innate": "KRYX_RPG.SpellPrepInnate",
  "pact": "KRYX_RPG.PactMagic",
  "prepared": "KRYX_RPG.SpellPrepPrepared"
};

KRYX_RPG.spellUpcastModes = ["always", "pact", "prepared"];


KRYX_RPG.spellProgression = {
  "none": "KRYX_RPG.SpellNone",
  "full": "KRYX_RPG.SpellProgFull",
  "half": "KRYX_RPG.SpellProgHalf",
  "third": "KRYX_RPG.SpellProgThird",
  "pact": "KRYX_RPG.SpellProgPact",
  "artificer": "KRYX_RPG.SpellProgArt"
};

/* -------------------------------------------- */

/**
 * The available choices for how spell damage scaling may be computed
 * @type {Object}
 */
KRYX_RPG.spellScalingModes = {
  "none": "KRYX_RPG.SpellNone",
  "cantrip": "KRYX_RPG.SpellCantrip",
  "level": "KRYX_RPG.SpellLevel"
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
  "fir": "KRYX_RPG.WeaponPropertiesFir",
  "foc": "KRYX_RPG.WeaponPropertiesFoc",
  "lgt": "KRYX_RPG.WeaponPropertiesLgt",
  "lod": "KRYX_RPG.WeaponPropertiesLod",
  "rch": "KRYX_RPG.WeaponPropertiesRch",
  "rel": "KRYX_RPG.WeaponPropertiesRel",
  "ret": "KRYX_RPG.WeaponPropertiesRet",
  "spc": "KRYX_RPG.WeaponPropertiesSpc",
  "thr": "KRYX_RPG.WeaponPropertiesThr",
  "two": "KRYX_RPG.WeaponPropertiesTwo",
  "ver": "KRYX_RPG.WeaponPropertiesVer"
};


// Spell Components
KRYX_RPG.spellComponents = {
  "V": "KRYX_RPG.ComponentVerbal",
  "S": "KRYX_RPG.ComponentSomatic",
  "M": "KRYX_RPG.ComponentMaterial"
};

// Spell Schools
KRYX_RPG.spellSchools = {
  "abj": "KRYX_RPG.SchoolAbj",
  "con": "KRYX_RPG.SchoolCon",
  "div": "KRYX_RPG.SchoolDiv",
  "enc": "KRYX_RPG.SchoolEnc",
  "evo": "KRYX_RPG.SchoolEvo",
  "ill": "KRYX_RPG.SchoolIll",
  "nec": "KRYX_RPG.SchoolNec",
  "trs": "KRYX_RPG.SchoolTrs"
};

// Spell Levels
KRYX_RPG.spellLevels = {
  0: "KRYX_RPG.SpellLevel0",
  1: "KRYX_RPG.SpellLevel1",
  2: "KRYX_RPG.SpellLevel2",
  3: "KRYX_RPG.SpellLevel3",
  4: "KRYX_RPG.SpellLevel4",
  5: "KRYX_RPG.SpellLevel5",
  6: "KRYX_RPG.SpellLevel6",
  7: "KRYX_RPG.SpellLevel7",
  8: "KRYX_RPG.SpellLevel8",
  9: "KRYX_RPG.SpellLevel9"
};

// Spell Scroll Compendium UUIDs
KRYX_RPG.spellScrollIds = {
  0: 'Compendium.kryx_rpg.items.rQ6sO7HDWzqMhSI3',
  1: 'Compendium.kryx_rpg.items.9GSfMg0VOA2b4uFN',
  2: 'Compendium.kryx_rpg.items.XdDp6CKh9qEvPTuS',
  3: 'Compendium.kryx_rpg.items.hqVKZie7x9w3Kqds',
  4: 'Compendium.kryx_rpg.items.DM7hzgL836ZyUFB1',
  5: 'Compendium.kryx_rpg.items.wa1VF8TXHmkrrR35',
  6: 'Compendium.kryx_rpg.items.tI3rWx4bxefNCexS',
  7: 'Compendium.kryx_rpg.items.mtyw4NS1s7j2EJaD',
  8: 'Compendium.kryx_rpg.items.aOrinPg7yuDZEuWr',
  9: 'Compendium.kryx_rpg.items.O4YbkJkLlnsgUszZ'
};

/**
 * Define the standard slot progression by character level.
 * The entries of this array represent the spell slot progression for a full spell-caster.
 * @type {Array[]}
 */
KRYX_RPG.SPELL_SLOT_TABLE = [
  [2],
  [3],
  [4, 2],
  [4, 3],
  [4, 3, 2],
  [4, 3, 3],
  [4, 3, 3, 1],
  [4, 3, 3, 2],
  [4, 3, 3, 3, 1],
  [4, 3, 3, 3, 2],
  [4, 3, 3, 3, 2, 1],
  [4, 3, 3, 3, 2, 1],
  [4, 3, 3, 3, 2, 1, 1],
  [4, 3, 3, 3, 2, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1, 1],
  [4, 3, 3, 3, 3, 1, 1, 1, 1],
  [4, 3, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 3, 2, 2, 1, 1]
];

/* -------------------------------------------- */

// Polymorph options.
KRYX_RPG.polymorphSettings = {
  keepPhysical: 'KRYX_RPG.PolymorphKeepPhysical',
  keepMental: 'KRYX_RPG.PolymorphKeepMental',
  keepSaves: 'KRYX_RPG.PolymorphKeepSaves',
  keepSkills: 'KRYX_RPG.PolymorphKeepSkills',
  mergeSaves: 'KRYX_RPG.PolymorphMergeSaves',
  mergeSkills: 'KRYX_RPG.PolymorphMergeSkills',
  keepClass: 'KRYX_RPG.PolymorphKeepClass',
  keepFeats: 'KRYX_RPG.PolymorphKeepFeats',
  keepSpells: 'KRYX_RPG.PolymorphKeepSpells',
  keepItems: 'KRYX_RPG.PolymorphKeepItems',
  keepBio: 'KRYX_RPG.PolymorphKeepBio',
  keepVision: 'KRYX_RPG.PolymorphKeepVision'
};

/* -------------------------------------------- */

/**
 * Skill, ability, and tool proficiency levels
 * Each level provides a proficiency multiplier
 * @type {Object}
 */
KRYX_RPG.proficiencyLevels = {
  0: "KRYX_RPG.NotProficient",
  1: "KRYX_RPG.Proficient",
  0.5: "KRYX_RPG.HalfProficient",
  2: "KRYX_RPG.Expertise"
};

/* -------------------------------------------- */


// Condition Types
KRYX_RPG.conditionTypes = {
  "blinded": "KRYX_RPG.ConBlinded",
  "charmed": "KRYX_RPG.ConCharmed",
  "deafened": "KRYX_RPG.ConDeafened",
  "diseased": "KRYX_RPG.ConDiseased",
  "exhaustion": "KRYX_RPG.ConExhaustion",
  "frightened": "KRYX_RPG.ConFrightened",
  "grappled": "KRYX_RPG.ConGrappled",
  "incapacitated": "KRYX_RPG.ConIncapacitated",
  "invisible": "KRYX_RPG.ConInvisible",
  "paralyzed": "KRYX_RPG.ConParalyzed",
  "petrified": "KRYX_RPG.ConPetrified",
  "poisoned": "KRYX_RPG.ConPoisoned",
  "prone": "KRYX_RPG.ConProne",
  "restrained": "KRYX_RPG.ConRestrained",
  "stunned": "KRYX_RPG.ConStunned",
  "unconscious": "KRYX_RPG.ConUnconscious"
};

// Languages
KRYX_RPG.languages = {
  "common": "KRYX_RPG.LanguagesCommon",
  "aarakocra": "KRYX_RPG.LanguagesAarakocra",
  "abyssal": "KRYX_RPG.LanguagesAbyssal",
  "aquan": "KRYX_RPG.LanguagesAquan",
  "auran": "KRYX_RPG.LanguagesAuran",
  "celestial": "KRYX_RPG.LanguagesCelestial",
  "deep": "KRYX_RPG.LanguagesDeepSpeech",
  "draconic": "KRYX_RPG.LanguagesDraconic",
  "druidic": "KRYX_RPG.LanguagesDruidic",
  "dwarvish": "KRYX_RPG.LanguagesDwarvish",
  "elvish": "KRYX_RPG.LanguagesElvish",
  "giant": "KRYX_RPG.LanguagesGiant",
  "gith": "KRYX_RPG.LanguagesGith",
  "gnomish": "KRYX_RPG.LanguagesGnomish",
  "goblin": "KRYX_RPG.LanguagesGoblin",
  "gnoll": "KRYX_RPG.LanguagesGnoll",
  "halfling": "KRYX_RPG.LanguagesHalfling",
  "ignan": "KRYX_RPG.LanguagesIgnan",
  "infernal": "KRYX_RPG.LanguagesInfernal",
  "orc": "KRYX_RPG.LanguagesOrc",
  "primordial": "KRYX_RPG.LanguagesPrimordial",
  "sylvan": "KRYX_RPG.LanguagesSylvan",
  "terran": "KRYX_RPG.LanguagesTerran",
  "cant": "KRYX_RPG.LanguagesThievesCant",
  "undercommon": "KRYX_RPG.LanguagesUndercommon"
};

// Character Level XP Requirements
KRYX_RPG.CHARACTER_EXP_LEVELS =  [
  0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000, 100000,
  120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000]
;

// Challenge Rating XP Levels
KRYX_RPG.CR_EXP_LEVELS = [
  10, 200, 450, 700, 1100, 1800, 2300, 2900, 3900, 5000, 5900, 7200, 8400, 10000, 11500, 13000, 15000, 18000,
  20000, 22000, 25000, 33000, 41000, 50000, 62000, 75000, 90000, 105000, 120000, 135000, 155000
];

// Configure Optional Character Flags
KRYX_RPG.characterFlags = {
  "powerfulBuild": {
    name: "KRYX_RPG.FlagsPowerfulBuild",
    hint: "KRYX_RPG.FlagsPowerfulBuildHint",
    section: "Racial Traits",
    type: Boolean
  },
  "savageAttacks": {
    name: "KRYX_RPG.FlagsSavageAttacks",
    hint: "KRYX_RPG.FlagsSavageAttacksHint",
    section: "Racial Traits",
    type: Boolean
  },
  "elvenAccuracy": {
    name: "KRYX_RPG.FlagsElvenAccuracy",
    hint: "KRYX_RPG.FlagsElvenAccuracyHint",
    section: "Racial Traits",
    type: Boolean
  },
  "halflingLucky": {
    name: "KRYX_RPG.FlagsHalflingLucky",
    hint: "KRYX_RPG.FlagsHalflingLuckyHint",
    section: "Racial Traits",
    type: Boolean
  },
  "initiativeAdv": {
    name: "KRYX_RPG.FlagsInitiativeAdv",
    hint: "KRYX_RPG.FlagsInitiativeAdvHint",
    section: "Feats",
    type: Boolean
  },
  "initiativeAlert": {
    name: "KRYX_RPG.FlagsAlert",
    hint: "KRYX_RPG.FlagsAlertHint",
    section: "Feats",
    type: Boolean
  },
  "jackOfAllTrades": {
    name: "KRYX_RPG.FlagsJOAT",
    hint: "KRYX_RPG.FlagsJOATHint",
    section: "Feats",
    type: Boolean
  },
  "observantFeat": {
    name: "KRYX_RPG.FlagsObservant",
    hint: "KRYX_RPG.FlagsObservantHint",
    skills: ['prc','inv'],
    section: "Feats",
    type: Boolean
  },
  "reliableTalent": {
    name: "KRYX_RPG.FlagsReliableTalent",
    hint: "KRYX_RPG.FlagsReliableTalentHint",
    section: "Feats",
    type: Boolean
  },
  "remarkableAthlete": {
    name: "KRYX_RPG.FlagsRemarkableAthlete",
    hint: "KRYX_RPG.FlagsRemarkableAthleteHint",
    abilities: ['str','dex','con'],
    section: "Feats",
    type: Boolean
  },
  "weaponCriticalThreshold": {
    name: "KRYX_RPG.FlagsCritThreshold",
    hint: "KRYX_RPG.FlagsCritThresholdHint",
    section: "Feats",
    type: Number,
    placeholder: 20
  }
};

// Configure allowed status flags
KRYX_RPG.allowedActorFlags = [
  "isPolymorphed", "originalActor"
].concat(Object.keys(KRYX_RPG.characterFlags));
