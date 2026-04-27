const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const minimap = document.querySelector("#minimap");
const minimapCtx = minimap.getContext("2d");

const els = {
  hpText: document.querySelector("#hpText"),
  hpBar: document.querySelector("#hpBar"),
  xpText: document.querySelector("#xpText"),
  xpBar: document.querySelector("#xpBar"),
  timer: document.querySelector("#timer"),
  coins: document.querySelector("#coins"),
  kills: document.querySelector("#kills"),
  abilityBar: document.querySelector("#abilityBar"),
  objectiveTitle: document.querySelector("#objectiveTitle"),
  objectiveText: document.querySelector("#objectiveText"),
  runSummary: document.querySelector("#runSummary"),
  summaryTitle: document.querySelector("#summaryTitle"),
  summaryStats: document.querySelector("#summaryStats"),
  summaryClose: document.querySelector("#summaryClose"),
  campScreen: document.querySelector("#campScreen"),
  campStartBtn: document.querySelector("#campStartBtn"),
  campCloseBtn: document.querySelector("#campCloseBtn"),
  campSubtitle: document.querySelector("#campSubtitle"),
  playerNameInput: document.querySelector("#playerNameInput"),
  campClassSelect: document.querySelector("#campClassSelect"),
  campCharacterPanel: document.querySelector("#campCharacterPanel"),
  campLootPanel: document.querySelector("#campLootPanel"),
  leaderboardPanel: document.querySelector("#leaderboardPanel"),
  startBtn: document.querySelector("#startBtn"),
  resetBtn: document.querySelector("#resetBtn"),
  dailyMod: document.querySelector("#dailyMod"),
  dailyQuests: document.querySelector("#dailyQuests"),
  metaStats: document.querySelector("#metaStats"),
  lootLog: document.querySelector("#lootLog"),
  characterPanel: document.querySelector("#characterPanel"),
  shopPanel: document.querySelector("#shopPanel"),
  inventoryPanel: document.querySelector("#inventoryPanel"),
  classSelect: document.querySelector("#classSelect"),
  mightCost: document.querySelector("#mightCost"),
  vigorCost: document.querySelector("#vigorCost"),
  swiftCost: document.querySelector("#swiftCost"),
  choiceModal: document.querySelector("#choiceModal"),
  choices: document.querySelector("#choices"),
};

const storeKey = "dungeon-shift-save-v2";
const keys = new Set();
const worldSize = { w: 2400, h: 1700 };
const mouse = { screenX: canvas.width / 2, screenY: canvas.height / 2, x: canvas.width / 2, y: canvas.height / 2, down: false };

const sprites = {
  heroes: {
    knight: [
      "assets/sprites/heroes/knight_0.png",
      "assets/sprites/heroes/knight_1.png",
      "assets/sprites/heroes/knight_2.png",
      "assets/sprites/heroes/knight_3.png",
      "assets/sprites/heroes/knight_4.png",
      "assets/sprites/heroes/knight_5.png",
    ],
    elf: [
      "assets/sprites/heroes/elf_0.png",
      "assets/sprites/heroes/elf_1.png",
      "assets/sprites/heroes/elf_2.png",
      "assets/sprites/heroes/elf_3.png",
      "assets/sprites/heroes/elf_4.png",
      "assets/sprites/heroes/elf_5.png",
    ],
    mage: [
      "assets/sprites/heroes/mage_0.png",
      "assets/sprites/heroes/mage_1.png",
      "assets/sprites/heroes/mage_2.png",
      "assets/sprites/heroes/mage_3.png",
    ],
  },
  monsters: {
    goblin: [
      "assets/sprites/monsters/goblin_0.png",
      "assets/sprites/monsters/goblin_1.png",
      "assets/sprites/monsters/goblin_2.png",
      "assets/sprites/monsters/goblin_3.png",
    ],
    shade: [
      "assets/sprites/monsters/shade_0.png",
      "assets/sprites/monsters/shade_1.png",
      "assets/sprites/monsters/shade_2.png",
    ],
    brute: [
      "assets/sprites/monsters/brute_0.png",
      "assets/sprites/monsters/brute_1.png",
      "assets/sprites/monsters/brute_2.png",
    ],
    skeleton: [
      "assets/sprites/monsters/skeleton_0.png",
      "assets/sprites/monsters/skeleton_1.png",
      "assets/sprites/monsters/skeleton_2.png",
    ],
    spitter: [
      "assets/sprites/monsters/spitter_0.png",
      "assets/sprites/monsters/spitter_1.png",
      "assets/sprites/monsters/spitter_2.png",
    ],
    demon: [
      "assets/sprites/monsters/demon_0.png",
      "assets/sprites/monsters/demon_1.png",
    ],
    hellhound: [
      "assets/sprites/monsters/hellhound_0.png",
      "assets/sprites/monsters/hellhound_1.png",
    ],
    boss: [
      "assets/sprites/monsters/boss_0.png",
    ],
  },
  projectiles: {
    knight: "assets/sprites/projectiles/knight.png",
    mage: "assets/sprites/projectiles/mage.png",
    elf: "assets/sprites/projectiles/elf.png",
    hostile: "assets/sprites/projectiles/hostile.png",
    boss: "assets/sprites/projectiles/boss.png",
    fireball: "assets/sprites/projectiles/mage.png",
    ice: "assets/sprites/projectiles/elf.png",
    holy: "assets/sprites/projectiles/boss.png",
  },
  pickups: {
    shard: "assets/sprites/pickups/shard.png",
    xp: "assets/sprites/pickups/xp.png",
    loot: "assets/sprites/pickups/loot.png",
  },
  chests: {
    blue: "assets/sprites/chests/silver.png",
    green: "assets/sprites/chests/wood.png",
    gold: "assets/sprites/chests/gold.png",
    purple: "assets/sprites/chests/purple.png",
    red: "assets/sprites/chests/red.png",
  },
  map: {
    background: "assets/map/backgrounds/dark_forest.png",
    decor: {
      treePine0: "assets/map/decor/tree_pine_0.png",
      treePine1: "assets/map/decor/tree_pine_1.png",
      deadTree: "assets/map/decor/dead_tree.png",
      rocks0: "assets/map/decor/rocks_0.png",
      stump: "assets/map/decor/stump.png",
      barrel: "assets/map/decor/barrel.png",
      crate: "assets/map/decor/crate.png",
      ruinTower: "assets/map/decor/ruin_tower.png",
      tent: "assets/map/decor/tent.png",
      torch: "assets/map/decor/torch.png",
      purpleCrystal: "assets/map/decor/purple_crystal.png",
      portal: "assets/map/decor/portal.png",
      altar: "assets/map/decor/altar.png",
      bannerRed: "assets/map/decor/banner_red.png",
      bannerBlue: "assets/map/decor/banner_blue.png",
    },
  },
  skills: {
    knight: {
      swordSlash: "assets/skills/knight/sword_slash.png",
      dashSlash: "assets/skills/knight/dash_slash.png",
      shieldBash: "assets/skills/knight/shield_bash.png",
      holyStrike: "assets/skills/knight/holy_strike.png",
    },
    mage: {
      fireball: "assets/skills/mage/fireball.png",
      iceShard: "assets/skills/mage/ice_shard.png",
      lightningBolt: "assets/skills/mage/lightning_bolt.png",
      arcaneBolt: "assets/skills/mage/arcane_bolt.png",
    },
    elf: {
      arrowShot: "assets/skills/elf/arrow_shot.png",
      multishot: "assets/skills/elf/multishot.png",
      piercingArrow: "assets/skills/elf/piercing_arrow.png",
      spinningLeaf: "assets/skills/elf/spinning_leaf.png",
    },
  },
  skillEffects: {
    swordSlash: "assets/skill-effects/knight/sword_slash.png",
    dashSlash: "assets/skill-effects/knight/dash_slash.png",
    shieldBash: "assets/skill-effects/knight/shield_bash.png",
    holyStrike: "assets/skill-effects/knight/holy_strike.png",
    fireball: "assets/skill-effects/mage/fireball.png",
    iceShard: "assets/skill-effects/mage/ice_shard.png",
    lightningBolt: "assets/skill-effects/mage/lightning_bolt.png",
    arcaneBolt: "assets/skill-effects/mage/arcane_bolt.png",
    arrowShot: "assets/skill-effects/elf/arrow_shot.png",
    multishot: "assets/skill-effects/elf/multishot.png",
    piercingArrow: "assets/skill-effects/elf/piercing_arrow.png",
    spinningLeaf: "assets/skill-effects/elf/spinning_leaf.png",
  },
  tiles: [
    "assets/sprites/tiles/stone_0.png",
    "assets/sprites/tiles/stone_1.png",
    "assets/sprites/tiles/grass.png",
    "assets/sprites/tiles/lava.png",
  ],
};

const abilityIcons = {
  attack: {
    knight: "assets/skills/knight/sword_slash.png",
    mage: "assets/skills/mage/fireball.png",
    elf: "assets/skills/elf/arrow_shot.png",
  },
  dashSlash: "assets/skills/knight/dash_slash.png",
  shieldBash: "assets/skills/knight/shield_bash.png",
  holyStrike: "assets/skills/knight/holy_strike.png",
  iceShard: "assets/skills/mage/ice_shard.png",
  lightningBolt: "assets/skills/mage/lightning_bolt.png",
  arcaneBolt: "assets/skills/mage/arcane_bolt.png",
  multishot: "assets/skills/elf/multishot.png",
  piercingArrow: "assets/skills/elf/piercing_arrow.png",
  spinningLeaf: "assets/skills/elf/spinning_leaf.png",
};

const classAbilities = {
  knight: [
    { key: "q", id: "dashSlash", name: "Dash Slash", cooldown: 4.0 },
    { key: "e", id: "shieldBash", name: "Shield Bash", cooldown: 6.2 },
    { key: "r", id: "holyStrike", name: "Holy Strike", cooldown: 10.5 },
  ],
  mage: [
    { key: "q", id: "iceShard", name: "Ice Shard", cooldown: 3.0 },
    { key: "e", id: "lightningBolt", name: "Lightning Bolt", cooldown: 6.0 },
    { key: "r", id: "arcaneBolt", name: "Arcane Bolt", cooldown: 8.5 },
  ],
  elf: [
    { key: "q", id: "multishot", name: "Multishot", cooldown: 3.0 },
    { key: "e", id: "piercingArrow", name: "Piercing Arrow", cooldown: 5.8 },
    { key: "r", id: "spinningLeaf", name: "Spinning Leaf", cooldown: 8.0 },
  ],
};

const animations = {
  heroes: {
    knight: { idle: [1], walk: [1, 4], attack: [2, 5], speed: 520 },
    elf: { idle: [1], walk: [1, 4], attack: [2, 5], speed: 500 },
    mage: { idle: [1], walk: [1, 3], attack: [0, 2], speed: 560 },
  },
  monsters: {
    goblin: { idle: [1], walk: [1], speed: 520 },
    skeleton: { idle: [1], walk: [1], speed: 560 },
    shade: { idle: [1], walk: [1], speed: 640 },
    spitter: { idle: [1], walk: [1], attack: [2], speed: 620 },
    brute: { idle: [0], walk: [0], speed: 700 },
    hellhound: { idle: [0], walk: [0], speed: 380 },
    demon: { idle: [0], walk: [0], speed: 760 },
  },
};

const spriteImages = new Map();
let spritesReady = false;
let showObstacleDebug = false;
preloadSprites();

const classes = {
  knight: {
    name: "Knight",
    icon: "K",
    desc: "Veel HP, korte cooldown, brede zwaardgolf.",
    color: "#65a8ff",
    hp: 135,
    speed: 178,
    damage: 13,
    fireDelay: .39,
    dashDelay: 1.12,
    shots: 1,
    pierce: 1,
  },
  mage: {
    name: "Mage",
    icon: "M",
    desc: "Hoge schade, magische projectielen, kwetsbaarder.",
    color: "#c989ff",
    hp: 88,
    speed: 188,
    damage: 18,
    fireDelay: .46,
    dashDelay: 1.22,
    shots: 1,
    pierce: 0,
  },
  elf: {
    name: "Elf",
    icon: "E",
    desc: "Snel, extra projectiel, sterk in kiten.",
    color: "#50d48c",
    hp: 102,
    speed: 220,
    damage: 10,
    fireDelay: .32,
    dashDelay: .95,
    shots: 2,
    pierce: 0,
  },
};

const monsterTypes = [
  { kind: "goblin", hp: 22, speed: 104, touch: 9, xp: 4, shard: 1 },
  { kind: "skeleton", hp: 25, speed: 98, touch: 10, xp: 5, shard: 1 },
  { kind: "shade", hp: 30, speed: 86, touch: 8, xp: 7, shard: 2 },
  { kind: "spitter", hp: 36, speed: 78, touch: 8, xp: 8, shard: 2 },
  { kind: "brute", hp: 70, speed: 65, touch: 18, xp: 11, shard: 3 },
  { kind: "hellhound", hp: 44, speed: 144, touch: 15, xp: 11, shard: 3 },
  { kind: "demon", hp: 110, speed: 72, touch: 23, xp: 18, shard: 5 },
];

const dailyMods = [
  { name: "Blood Moon", text: "Monsters zijn sneller, maar laten 30% meer shards vallen.", speed: 1.16, shard: 1.3 },
  { name: "Iron Echo", text: "Monsters hebben meer HP, maar XP komt sneller binnen.", hp: 1.25, xp: 1.35 },
  { name: "Wild Sparks", text: "Je aanval vuurt sneller, maar dash laadt trager op.", fire: .82, dash: 1.25 },
  { name: "Green Tide", text: "Meer monsters, meer kansen op progressie.", spawn: .72, shard: 1.12 },
];

const runUpgrades = [
  { title: "Twin Edge", desc: "+1 projectiel per aanval", apply: () => state.player.shots++ },
  { title: "Sharp Steel", desc: "+4 aanvalsschade", apply: () => state.player.damage += 4 },
  { title: "Quick Hands", desc: "20% sneller aanvallen", apply: () => state.player.fireDelay *= .8 },
  { title: "Second Wind", desc: "+35 HP genezen en +15 max HP", apply: () => { state.player.maxHp += 15; state.player.hp = Math.min(state.player.maxHp, state.player.hp + 35); } },
  { title: "Long Step", desc: "Dash laadt 25% sneller op", apply: () => state.player.dashDelay *= .75 },
  { title: "Magnet Core", desc: "Grotere pickup radius", apply: () => state.player.magnet += 35 },
  { title: "Piercing Rune", desc: "+1 vijand raken per projectiel", apply: () => state.player.pierce++ },
  { title: "Focused Casting", desc: "Abilities laden 15% sneller op", apply: () => state.player.cooldownRate *= 1.15 },
  { title: "Power Surge", desc: "Abilities doen 18% meer schade", apply: () => state.player.skillPower *= 1.18 },
];

const rarityInfo = {
  common: { color: "#aab7bd", salvage: 2, mult: 1 },
  rare: { color: "#73b7ff", salvage: 5, mult: 1.35 },
  epic: { color: "#c989ff", salvage: 12, mult: 1.8 },
  legendary: { color: "#f5c15f", salvage: 28, mult: 2.45 },
};

const lootTable = [
  { base: "Ashen Blade", slot: "weapon", stat: "damage", value: 5 },
  { base: "Moonbow", slot: "weapon", stat: "damage", value: 4 },
  { base: "Runed Staff", slot: "weapon", stat: "skillPower", value: .16 },
  { base: "Crypt Plate", slot: "armor", stat: "maxHp", value: 24 },
  { base: "Wanderer Cloak", slot: "armor", stat: "speed", value: .06 },
  { base: "Ember Ring", slot: "ring", stat: "damage", value: 3 },
  { base: "Vampire Ring", slot: "ring", stat: "maxHp", value: 16 },
  { base: "Ancient Amulet", slot: "amulet", stat: "cooldownRate", value: .12 },
  { base: "Storm Charm", slot: "amulet", stat: "skillPower", value: .18 },
];

let save = loadSave();
let state = freshState();
let pausedForChoice = false;
let lastTime = performance.now();

function loadSave() {
  const fallback = {
    shards: 0,
    totalShards: 0,
    might: 0,
    vigor: 0,
    swift: 0,
    bestKills: 0,
    selectedClass: "knight",
    playerName: "",
    loot: [],
    lastRunLoot: [],
    leaderboard: [],
    inventory: [],
    equipped: { weapon: null, armor: null, ring: null, amulet: null },
    daily: { date: "", completed: [] },
  };
  try {
    const parsed = JSON.parse(localStorage.getItem(storeKey)) || {};
    return {
      ...fallback,
      ...parsed,
      daily: { ...fallback.daily, ...(parsed.daily || {}) },
      loot: Array.isArray(parsed.loot) ? parsed.loot : fallback.loot,
      lastRunLoot: Array.isArray(parsed.lastRunLoot) ? parsed.lastRunLoot : fallback.lastRunLoot,
      leaderboard: Array.isArray(parsed.leaderboard) ? parsed.leaderboard : fallback.leaderboard,
      inventory: Array.isArray(parsed.inventory) ? parsed.inventory : fallback.inventory,
      equipped: { ...fallback.equipped, ...(parsed.equipped || {}) },
    };
  } catch {
    return fallback;
  }
}

function preloadSprites() {
  const paths = collectSpritePaths(sprites);
  let loaded = 0;
  for (const path of paths) {
    const img = new Image();
    img.src = path;
    img.addEventListener("load", () => {
      loaded++;
      spritesReady = loaded === paths.length;
    });
    img.addEventListener("error", () => {
      loaded++;
      spritesReady = loaded === paths.length;
    });
    spriteImages.set(path, img);
  }
}

function collectSpritePaths(value) {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectSpritePaths);
  return Object.values(value).flatMap(collectSpritePaths);
}

function persist() {
  localStorage.setItem(storeKey, JSON.stringify(save));
  renderMeta();
}

function todayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

function todayMod() {
  const seed = Number(todayKey().replaceAll("-", ""));
  return dailyMods[seed % dailyMods.length];
}

function dailyQuests() {
  return [
    { id: "slayer", title: "Monster Slayer", goal: 35, reward: 8, progress: () => state.kills, label: "kills" },
    { id: "collector", title: "Shard Hunter", goal: 20, reward: 10, progress: () => state.shards, label: "shards" },
    { id: "survivor", title: "Hold the Line", goal: 90, reward: 9, progress: () => Math.floor(180 - state.timeLeft), label: "sec" },
    { id: "boss", title: "Break the Alpha", goal: 1, reward: 18, progress: () => state.bossDefeated ? 1 : 0, label: "boss" },
  ];
}

function normalizeDaily() {
  const date = todayKey();
  if (!save.daily || save.daily.date !== date) {
    save.daily = { date, completed: [] };
    localStorage.setItem(storeKey, JSON.stringify(save));
  }
}

function equipmentBonus() {
  const bonus = { damage: 0, maxHp: 0, speed: 0, skillPower: 0, cooldownRate: 0 };
  for (const id of Object.values(save.equipped || {})) {
    const item = save.inventory.find(entry => entry.id === id);
    if (!item) continue;
    bonus[item.stat] += item.value;
  }
  return bonus;
}

function createLootItem(guaranteed = false) {
  const template = lootTable[Math.floor(Math.random() * lootTable.length)];
  const roll = guaranteed === "legendary" ? .985 : guaranteed === "rare" ? .72 : Math.random();
  const rarity = guaranteed === true || guaranteed === "legendary" || roll > .965 ? "legendary" : roll > .84 ? "epic" : roll > .48 ? "rare" : "common";
  const info = rarityInfo[rarity];
  const value = template.stat === "damage" || template.stat === "maxHp"
    ? Math.ceil(template.value * info.mult)
    : Number((template.value * info.mult).toFixed(2));
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: `${rarity === "legendary" ? "Ancient" : rarity === "epic" ? "Eldritch" : rarity === "rare" ? "Runed" : "Worn"} ${template.base}`,
    slot: template.slot,
    stat: template.stat,
    value,
    rarity,
    color: info.color,
  };
}

function itemStatText(item) {
  const labels = { damage: "damage", maxHp: "max HP", speed: "speed", skillPower: "skill power", cooldownRate: "cooldown" };
  const value = item.stat === "damage" || item.stat === "maxHp" ? `+${item.value}` : `+${Math.round(item.value * 100)}%`;
  return `${value} ${labels[item.stat]}`;
}

function slotIcon(slot) {
  return { weapon: "W", armor: "A", ring: "R", amulet: "M" }[slot] || "?";
}

function itemTooltip(item) {
  return `
    <div class="item-tooltip">
      <strong style="color:${item.color}">${item.name}</strong>
      <small>${item.rarity.toUpperCase()} ${item.slot}</small>
      <small>${itemStatText(item)}</small>
      <small>Salvage: ${rarityInfo[item.rarity].salvage} shards</small>
    </div>
  `;
}

function cleanPlayerName(name) {
  const cleaned = String(name || "").trim().replace(/[^\w .-]/g, "").slice(0, 18);
  return cleaned || "Anonymous";
}

function createDungeon() {
  const rooms = [
    { id: "start", x: 820, y: 760, w: 360, h: 260, name: "Old Trail" },
    { id: "gate", x: 135, y: 35, w: 430, h: 340, name: "Violet Gate" },
    { id: "camp", x: 1620, y: 65, w: 430, h: 330, name: "Hunter Camp" },
    { id: "swamp", x: 130, y: 865, w: 520, h: 360, name: "Drowned Pier" },
    { id: "ruins", x: 1540, y: 1030, w: 470, h: 360, name: "Broken Watch" },
    { id: "boss", x: 980, y: 220, w: 440, h: 360, name: "Ritual Circle", boss: true },
  ];
  const corridors = [
    rectBetween(rooms[0], rooms[1]),
    rectBetween(rooms[1], rooms[2]),
    rectBetween(rooms[0], rooms[3]),
    rectBetween(rooms[3], rooms[4]),
    rectBetween(rooms[4], rooms[5]),
    rectBetween(rooms[2], rooms[5]),
  ];
  return {
    rooms,
    corridors,
    chests: [
      { x: 1510, y: 620, id: "trail", opened: false, rarity: "blue" },
      { x: 420, y: 980, id: "swamp", opened: false, rarity: "green" },
      { x: 1800, y: 1245, id: "ruins", opened: false, rarity: "gold" },
      { x: 1315, y: 470, id: "boss", opened: false, rarity: "red" },
    ],
    decor: createMapDecor(),
    obstacles: createMapObstacles(),
  };
}

function createMapDecor() {
  return [
    { sprite: "ruinTower", x: 235, y: 120, s: 1.6 },
    { sprite: "portal", x: 1220, y: 240, s: 1.15 },
    { sprite: "tent", x: 1740, y: 210, s: 1.55 },
    { sprite: "altar", x: 1185, y: 365, s: 1.25 },
    { sprite: "bannerRed", x: 985, y: 350, s: 1.0 },
    { sprite: "bannerBlue", x: 1410, y: 310, s: 1.0 },
    { sprite: "torch", x: 980, y: 455, s: 1.0 },
    { sprite: "torch", x: 1415, y: 455, s: 1.0 },
    { sprite: "purpleCrystal", x: 315, y: 245, s: 1.1 },
    { sprite: "treePine0", x: 310, y: 760, s: 1.2 },
    { sprite: "treePine1", x: 1820, y: 760, s: 1.2 },
    { sprite: "deadTree", x: 650, y: 650, s: 1.1 },
    { sprite: "deadTree", x: 1650, y: 890, s: 1.05 },
    { sprite: "rocks0", x: 560, y: 520, s: 1.0 },
    { sprite: "rocks0", x: 1530, y: 1090, s: 1.2 },
    { sprite: "stump", x: 1740, y: 650, s: 1.0 },
    { sprite: "barrel", x: 1810, y: 300, s: 1.0 },
    { sprite: "crate", x: 1865, y: 320, s: 1.0 },
  ];
}

function createMapObstacles() {
  return [
    { x: 250, y: 125, r: 92 },
    { x: 112, y: 650, r: 70 },
    { x: 210, y: 1135, r: 115 },
    { x: 485, y: 1195, r: 72 },
    { x: 1745, y: 210, r: 110 },
    { x: 1815, y: 405, r: 76 },
    { x: 1795, y: 635, r: 94 },
    { x: 1870, y: 1440, r: 128 },
    { x: 2105, y: 965, r: 92 },
    { x: 1120, y: 230, r: 74 },
    { x: 650, y: 650, r: 54 },
    { x: 1530, y: 1090, r: 62 },
    { x: 880, y: 1300, r: 62 },
  ];
}

function roomCenter(room) {
  return { x: room.x + room.w / 2, y: room.y + room.h / 2 };
}

function rectBetween(a, b) {
  const ac = roomCenter(a);
  const bc = roomCenter(b);
  if (Math.abs(ac.x - bc.x) > Math.abs(ac.y - bc.y)) {
    const x = Math.min(ac.x, bc.x);
    return { x, y: ac.y - 44, w: Math.abs(ac.x - bc.x), h: 88 };
  }
  const y = Math.min(ac.y, bc.y);
  return { x: ac.x - 44, y, w: 88, h: Math.abs(ac.y - bc.y) };
}

function freshState() {
  normalizeDaily();
  const mod = todayMod();
  const classKey = classes[save.selectedClass] ? save.selectedClass : "knight";
  const hero = classes[classKey];
  const gear = equipmentBonus();
  const dungeon = createDungeon();
  const start = roomCenter(dungeon.rooms[0]);
  return {
    running: false,
    ended: false,
    timeLeft: 180,
    spawnClock: 0,
    attackClock: 0,
    dashClock: 0,
    bossSpawned: false,
    bossDefeated: false,
    kills: 0,
    shards: 0,
    xp: 0,
    level: 1,
    xpNeed: 18,
    shake: 0,
    lootFound: [],
    world: dungeon,
    camera: { x: 0, y: 0 },
    player: {
      classKey,
      x: start.x,
      y: start.y,
      r: 16,
      hp: hero.hp + save.vigor * 8 + gear.maxHp,
      maxHp: hero.hp + save.vigor * 8 + gear.maxHp,
      speed: hero.speed * (1 + save.swift * .02 + gear.speed),
      damage: hero.damage + save.might + gear.damage,
      shots: hero.shots,
      fireDelay: hero.fireDelay * (mod.fire || 1),
      dashDelay: hero.dashDelay * (mod.dash || 1),
      pierce: hero.pierce,
      magnet: 86,
      color: hero.color,
      attackAnim: 0,
      facing: 0,
      skillPower: 1 + gear.skillPower,
      cooldownRate: 1 + gear.cooldownRate,
      abilityCooldowns: Object.fromEntries(classAbilities[classKey].map(ability => [ability.id, 0])),
    },
    enemies: [],
    bullets: [],
    hazards: [],
    bursts: [],
    chests: dungeon.chests,
    pickups: [],
    floaters: [],
    mod,
  };
}

function startRun() {
  state = freshState();
  updateCamera();
  updateMouseWorld();
  state.running = true;
  els.campScreen.classList.add("hidden");
  els.runSummary.classList.add("hidden");
  els.startBtn.textContent = "Run bezig";
  els.startBtn.disabled = true;
  renderClasses();
}

function endRun(message) {
  if (state.ended) return;
  state.running = false;
  state.ended = true;
  checkDailyQuests(true);
  save.shards += state.shards;
  save.totalShards += state.shards;
  save.bestKills = Math.max(save.bestKills, state.kills);
  save.loot = [...state.lootFound, ...(save.loot || [])].slice(0, 8);
  save.lastRunLoot = [...state.lootFound];
  recordLeaderboard(message);
  persist();
  addFloater(state.player.x, state.player.y - 60, `${message} +${state.shards} shards`, "#f5c15f", 2.6);
  els.startBtn.textContent = "Nieuwe Run";
  els.startBtn.disabled = false;
  renderClasses();
  showRunSummary(message);
}

function showRunSummary(message) {
  els.summaryTitle.textContent = message;
  els.summaryStats.innerHTML = `
    <div><strong>${state.kills}</strong><span>kills</span></div>
    <div><strong>${state.shards}</strong><span>shards</span></div>
    <div><strong>${state.level}</strong><span>level</span></div>
  `;
  if (state.lootFound.length) {
    els.summaryStats.innerHTML += `<div style="grid-column:1/-1"><strong>${state.lootFound.length}</strong><span>${state.lootFound.slice(0, 3).join(" | ")}</span></div>`;
  }
  els.runSummary.classList.remove("hidden");
}

function recordLeaderboard(message) {
  const score = state.kills * 10 + state.level * 25 + state.shards + (state.bossDefeated ? 500 : 0);
  const entry = {
    date: new Date().toLocaleDateString(),
    playerName: cleanPlayerName(save.playerName),
    className: classes[state.player.classKey].name,
    result: message,
    kills: state.kills,
    level: state.level,
    shards: state.shards,
    boss: state.bossDefeated,
    score,
  };
  save.leaderboard = [entry, ...(save.leaderboard || [])]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
  submitOnlineScore(entry);
}

async function submitOnlineScore(entry) {
  const leaderboard = window.DungeonShiftLeaderboard;
  if (!leaderboard?.submitScore) return;
  try {
    await leaderboard.submitScore(entry);
    await loadOnlineLeaderboard();
  } catch {
    // Local leaderboard remains the fallback when offline or unconfigured.
  }
}

async function loadOnlineLeaderboard() {
  const leaderboard = window.DungeonShiftLeaderboard;
  if (!leaderboard?.loadLeaderboard) return;
  try {
    const rows = await leaderboard.loadLeaderboard(10);
    if (rows.length) {
      save.leaderboard = rows;
      localStorage.setItem(storeKey, JSON.stringify(save));
      renderLeaderboard();
    }
  } catch {
    // Keep local scores when Supabase is unavailable or the table is missing.
  }
}

function spawnEnemy(forceKind) {
  const p = state.player;
  const angle = Math.random() * Math.PI * 2;
  const distance = rand(330, 520);
  const x = clamp(p.x + Math.cos(angle) * distance, 48, worldSize.w - 48);
  const y = clamp(p.y + Math.sin(angle) * distance, 48, worldSize.h - 48);
  const pool = state.kills < 10 ? monsterTypes.slice(0, 2) : monsterTypes;
  const base = forceKind ? monsterTypes.find(m => m.kind === forceKind) : pool[Math.floor(Math.random() * pool.length)];
  const elite = Math.random() < Math.min(.05 + state.level * .007, .16);
  const hpScale = (elite ? 1.75 : 1) * (state.mod.hp || 1) * (1 + state.level * .08);
  state.enemies.push({
    ...base,
    x,
    y,
    r: elite ? 19 : base.kind === "brute" ? 18 : 14,
    hp: base.hp * hpScale,
    maxHp: base.hp * hpScale,
    speed: base.speed * (state.mod.speed || 1) * (1 + state.level * .014),
    elite,
    boss: false,
    attackClock: rand(1.0, 1.8),
    animPhase: rand(0, 800),
    attackAnim: 0,
    hitFlash: 0,
  });
}

function spawnBoss() {
  state.bossSpawned = true;
  const bossRoom = state.world.rooms.find(room => room.boss);
  const center = roomCenter(bossRoom);
  state.enemies.push({
    kind: "boss",
    x: center.x,
    y: center.y,
    r: 34,
    hp: 520 * (state.mod.hp || 1),
    maxHp: 520 * (state.mod.hp || 1),
    speed: 54,
    touch: 28,
    xp: 60,
    shard: 20,
    elite: true,
    boss: true,
    attackClock: 1.2,
    animPhase: 0,
    attackAnim: 0,
    hitFlash: 0,
  });
  addFloater(center.x, center.y - 110, "BOSS: The Hollow Alpha", "#f5c15f", 2.2);
}

function attack() {
  const p = state.player;
  p.attackAnim = .18;
  const baseAngle = Math.atan2(mouse.y - p.y, mouse.x - p.x);
  p.facing = baseAngle;
  const spread = p.shots === 1 ? 0 : .15;
  for (let i = 0; i < p.shots; i++) {
    const offset = (i - (p.shots - 1) / 2) * spread;
    state.bullets.push({
      x: p.x,
      y: p.y,
      vx: Math.cos(baseAngle + offset) * 540,
      vy: Math.sin(baseAngle + offset) * 540,
      r: p.classKey === "mage" ? 7 : 5,
      life: .76,
      damage: p.damage,
      pierceLeft: p.pierce,
      skill: "attack",
      effect: p.classKey === "mage" ? "fireball" : p.classKey === "elf" ? "arrowShot" : "swordSlash",
      color: p.classKey === "mage" ? "#c989ff" : p.classKey === "elf" ? "#8ff5c0" : "#b8dcff",
      explosive: p.classKey === "mage" ? 46 : 0,
    });
  }
}

function useAbility(id) {
  if (!state.running || pausedForChoice) return;
  const p = state.player;
  if ((p.abilityCooldowns[id] || 0) > 0) return;
  const ability = classAbilities[p.classKey]?.find(item => item.id === id);
  if (!ability) return;
  p.abilityCooldowns[id] = ability.cooldown / p.cooldownRate;
  p.attackAnim = .28;
  p.facing = Math.atan2(mouse.y - p.y, mouse.x - p.x);

  if (id === "dashSlash") castDashSlash();
  if (id === "shieldBash") castShieldBash();
  if (id === "holyStrike") castHolyStrike();
  if (id === "iceShard") castIceShard();
  if (id === "lightningBolt") castLightningBolt();
  if (id === "arcaneBolt") castArcaneBolt();
  if (id === "multishot") castMultishot();
  if (id === "piercingArrow") castPiercingArrow();
  if (id === "spinningLeaf") castSpinningLeaf();
}

function castDashSlash() {
  const p = state.player;
  movePlayer(Math.cos(p.facing) * 115, Math.sin(p.facing) * 115);
  state.bursts.push({ x: p.x, y: p.y, r: 105, maxR: 105, life: .25, maxLife: .25, color: "#dfe8ef", arc: p.facing, width: 1.25, effect: "dashSlash", angle: p.facing, scale: .68 });
  damageEnemiesInArc(p.x, p.y, 112, p.facing, 1.25, p.damage * 2.4 * p.skillPower, "dash");
}

function castShieldBash() {
  const p = state.player;
  state.bursts.push({ x: p.x, y: p.y, r: 98, maxR: 98, life: .34, maxLife: .34, color: "#f5c15f", arc: p.facing, width: 1.85, effect: "shieldBash", angle: p.facing, scale: .62 });
  damageEnemiesInArc(p.x, p.y, 110, p.facing, 1.85, p.damage * 2.0 * p.skillPower, "bash");
  for (const enemy of state.enemies) {
    if (Math.hypot(enemy.x - p.x, enemy.y - p.y) <= 118) {
      enemy.x += Math.cos(p.facing) * 34;
      enemy.y += Math.sin(p.facing) * 34;
      enemy.slow = 1.0;
      enemy.slowFactor = .35;
    }
  }
}

function castHolyStrike() {
  const p = state.player;
  const target = { x: mouse.x, y: mouse.y };
  state.bursts.push({ x: target.x, y: target.y, r: 28, maxR: 28, life: .35, maxLife: .35, color: "#f5c15f", marker: true });
  setTimeout(() => {
    if (!state.running) return;
    state.bursts.push({ x: target.x, y: target.y, r: 125, maxR: 125, life: .5, maxLife: .5, color: "#f5c15f", effect: "holyStrike", scale: .78 });
    damageEnemiesInRadius(target.x, target.y, 125, p.damage * 3.0 * p.skillPower, "holy");
    p.hp = Math.min(p.maxHp, p.hp + 20);
    state.shake = .12;
  }, 260);
}

function castIceShard() {
  const p = state.player;
  state.bullets.push({
    x: p.x,
    y: p.y,
    vx: Math.cos(p.facing) * 620,
    vy: Math.sin(p.facing) * 620,
    r: 7,
    life: .9,
    damage: p.damage * 1.45 * p.skillPower,
    pierceLeft: 2,
    slowOnHit: 1.6,
    skill: "iceShard",
    effect: "iceShard",
    color: "#73b7ff",
  });
}

function castLightningBolt() {
  const p = state.player;
  state.bursts.push({ x: p.x + Math.cos(p.facing) * 105, y: p.y + Math.sin(p.facing) * 105, r: 180, maxR: 180, life: .3, maxLife: .3, color: "#f5c15f", arc: p.facing, width: .55, effect: "lightningBolt", angle: p.facing, scale: .72 });
  let chained = 0;
  for (const enemy of [...state.enemies].sort((a, b) => dist(a, p) - dist(b, p))) {
    if (chained >= 4) break;
    const angleToEnemy = Math.atan2(enemy.y - p.y, enemy.x - p.x);
    if (Math.abs(angleDelta(p.facing, angleToEnemy)) <= .42 && dist(enemy, p) <= 360) {
      enemy.hp -= p.damage * 1.9 * p.skillPower;
      enemy.hitFlash = .16;
      addFloater(enemy.x, enemy.y - 14, "zap", "#f5c15f", .7);
      chained++;
    }
  }
}

function castArcaneBolt() {
  const p = state.player;
  state.bullets.push({
    x: p.x,
    y: p.y,
    vx: Math.cos(p.facing) * 430,
    vy: Math.sin(p.facing) * 430,
    r: 11,
    life: 1.35,
    damage: p.damage * 1.8 * p.skillPower,
    pierceLeft: 0,
    explosive: 95,
    skill: "arcaneBolt",
    effect: "arcaneBolt",
    color: "#c989ff",
  });
}

function castMultishot() {
  const p = state.player;
  for (let i = 0; i < 7; i++) {
    const angle = p.facing + (i - 3) * .13;
    state.bullets.push({
      x: p.x,
      y: p.y,
      vx: Math.cos(angle) * 620,
      vy: Math.sin(angle) * 620,
      r: 5,
      life: .9,
      damage: p.damage * 1.05 * p.skillPower,
      pierceLeft: 1,
      skill: "multishot",
      effect: "multishot",
      color: "#8ff5c0",
    });
  }
}

function castPiercingArrow() {
  const p = state.player;
  state.bullets.push({
    x: p.x,
    y: p.y,
    vx: Math.cos(p.facing) * 700,
    vy: Math.sin(p.facing) * 700,
    r: 6,
    life: 1.0,
    damage: p.damage * 2.1 * p.skillPower,
    pierceLeft: 6,
    skill: "piercingArrow",
    effect: "piercingArrow",
    color: "#9ef04b",
  });
}

function castSpinningLeaf() {
  const p = state.player;
  state.hazards.push({ x: p.x, y: p.y, r: 122, life: 4.0, tick: 0, damage: p.damage * .45 * p.skillPower, color: "#7edc38", followPlayer: true, effect: "spinningLeaf" });
  state.bursts.push({ x: p.x, y: p.y, r: 122, maxR: 122, life: .65, maxLife: .65, color: "#7edc38", effect: "spinningLeaf", scale: .72 });
}

function enemyCast(enemy) {
  if (enemy.kind !== "spitter" && !enemy.boss) return;
  enemy.attackAnim = .28;
  const p = state.player;
  const angle = Math.atan2(p.y - enemy.y, p.x - enemy.x);
  const count = enemy.boss ? 5 : 1;
  for (let i = 0; i < count; i++) {
    const offset = (i - (count - 1) / 2) * .18;
    state.bullets.push({
      x: enemy.x,
      y: enemy.y,
      vx: Math.cos(angle + offset) * (enemy.boss ? 235 : 260),
      vy: Math.sin(angle + offset) * (enemy.boss ? 235 : 260),
      r: enemy.boss ? 7 : 5,
      life: enemy.boss ? 2.2 : 1.7,
      damage: enemy.boss ? 15 : 8,
      hostile: true,
      color: enemy.boss ? "#f26a6a" : "#a0ff73",
    });
  }
}

function dash() {
  if (state.dashClock > 0) return;
  const p = state.player;
  const dx = (keys.has("d") || keys.has("arrowright") ? 1 : 0) - (keys.has("a") || keys.has("arrowleft") ? 1 : 0);
  const dy = (keys.has("s") || keys.has("arrowdown") ? 1 : 0) - (keys.has("w") || keys.has("arrowup") ? 1 : 0);
  const len = Math.hypot(dx, dy) || 1;
  movePlayer((dx / len) * 100, (dy / len) * 100);
  state.dashClock = p.dashDelay;
  state.shake = .08;
}

function update(dt) {
  if (!state.running || pausedForChoice) return;
  const p = state.player;
  updateMouseWorld();
  state.timeLeft -= dt;
  state.spawnClock -= dt;
  state.attackClock -= dt;
  state.dashClock = Math.max(0, state.dashClock - dt);
  state.shake = Math.max(0, state.shake - dt);
  p.attackAnim = Math.max(0, p.attackAnim - dt);
  for (const id of Object.keys(p.abilityCooldowns)) {
    p.abilityCooldowns[id] = Math.max(0, p.abilityCooldowns[id] - dt);
  }

  if (state.timeLeft <= 0) {
    endRun("Dungeon voltooid");
    return;
  }

  if (!state.bossSpawned && (state.timeLeft <= 60 || state.kills >= 45)) spawnBoss();

  const dx = (keys.has("d") || keys.has("arrowright") ? 1 : 0) - (keys.has("a") || keys.has("arrowleft") ? 1 : 0);
  const dy = (keys.has("s") || keys.has("arrowdown") ? 1 : 0) - (keys.has("w") || keys.has("arrowup") ? 1 : 0);
  const len = Math.hypot(dx, dy) || 1;
  movePlayer((dx / len) * p.speed * dt, (dy / len) * p.speed * dt);
  updateCamera();
  updateMouseWorld();

  if (mouse.down && state.attackClock <= 0) {
    attack();
    state.attackClock = p.fireDelay;
  }

  const spawnDelay = Math.max(.16, (.92 - state.level * .032) * (state.mod.spawn || 1));
  if (state.spawnClock <= 0) {
    spawnEnemy();
    if (state.kills > 18 && Math.random() < .3) spawnEnemy();
    state.spawnClock = spawnDelay;
  }

  for (const bullet of state.bullets) {
    bullet.x += bullet.vx * dt;
    bullet.y += bullet.vy * dt;
    bullet.life -= dt;
  }

  for (const enemy of state.enemies) {
    const angle = Math.atan2(p.y - enemy.y, p.x - enemy.x);
    const keepDistance = enemy.kind === "spitter" ? 115 : 0;
    const distance = dist(enemy, p);
    const moveDir = keepDistance && distance < keepDistance ? -1 : 1;
    const speedFactor = enemy.slow > 0 ? enemy.slowFactor || .65 : 1;
    enemy.x += Math.cos(angle) * enemy.speed * speedFactor * dt * moveDir;
    enemy.y += Math.sin(angle) * enemy.speed * speedFactor * dt * moveDir;
    enemy.attackClock -= dt;
    enemy.attackAnim = Math.max(0, enemy.attackAnim - dt);
    enemy.hitFlash = Math.max(0, (enemy.hitFlash || 0) - dt);
    enemy.slow = Math.max(0, (enemy.slow || 0) - dt);
    if (enemy.attackClock <= 0) {
      enemyCast(enemy);
      enemy.attackClock = enemy.boss ? 1.8 : rand(1.4, 2.3);
      if (enemy.boss && Math.random() < .5) spawnEnemy("shade");
    }

    if (distance < enemy.r + p.r) {
      p.hp -= enemy.touch * dt;
      state.shake = .06;
      if (p.hp <= 0) {
        endRun("Verslagen");
        return;
      }
    }
  }

  resolveProjectiles();
  updateHazards(dt);
  updateBursts(dt);
  updateChests();
  collectKills();
  collectPickups(dt);
  updateFloaters(dt);
  checkDailyQuests(false);
}

function updateHazards(dt) {
  for (const hazard of state.hazards) {
    if (hazard.followPlayer) {
      hazard.x = state.player.x;
      hazard.y = state.player.y;
    }
    hazard.life -= dt;
    hazard.tick -= dt;
    if (hazard.tick <= 0) {
      hazard.tick = .35;
      for (const enemy of state.enemies) {
        if (dist(enemy, hazard) <= hazard.r + enemy.r) {
          enemy.hp -= hazard.damage;
          enemy.hitFlash = .08;
          enemy.slow = .55;
          enemy.slowFactor = .72;
        }
      }
    }
  }
  state.hazards = state.hazards.filter(h => h.life > 0);
}

function updateBursts(dt) {
  for (const burst of state.bursts) burst.life -= dt;
  state.bursts = state.bursts.filter(b => b.life > 0);
}

function resolveProjectiles() {
  const p = state.player;
  for (const bullet of state.bullets) {
    if (bullet.hostile) {
      if (dist(bullet, p) < bullet.r + p.r) {
        p.hp -= bullet.damage;
        bullet.life = 0;
        state.shake = .08;
        if (p.hp <= 0) {
          endRun("Verslagen");
          return;
        }
      }
      continue;
    }

    for (const enemy of state.enemies) {
      if (dist(bullet, enemy) < bullet.r + enemy.r) {
        enemy.hp -= bullet.damage;
        enemy.hitFlash = .12;
        if (bullet.slowOnHit) {
          enemy.slow = bullet.slowOnHit;
          enemy.slowFactor = .45;
        }
        addFloater(enemy.x, enemy.y - 10, Math.round(bullet.damage), "#edf3f4", .55);
        if (bullet.explosive) {
          state.bursts.push({ x: bullet.x, y: bullet.y, r: bullet.explosive, maxR: bullet.explosive, life: .35, maxLife: .35, color: bullet.effect === "arcaneBolt" ? "#c989ff" : "#ff8a2f", effect: bullet.effect, scale: bullet.effect === "arcaneBolt" ? .5 : .38 });
          damageEnemiesInRadius(bullet.x, bullet.y, bullet.explosive, bullet.damage * .85, "boom", enemy);
          state.shake = .08;
        }
        if (bullet.pierceLeft > 0) bullet.pierceLeft--;
        else bullet.life = 0;
        break;
      }
    }
  }
  state.bullets = state.bullets.filter(b => b.life > 0 && b.x > -80 && b.y > -80 && b.x < worldSize.w + 80 && b.y < worldSize.h + 80);
}

function updateChests() {
  for (const chest of state.chests) {
    if (chest.opened || dist(chest, state.player) > 76) continue;
    chest.opened = true;
    const bonus = chest.rarity === "red" ? 18 : chest.rarity === "gold" ? 12 : 7;
    state.shards += bonus;
    state.pickups.push({ x: chest.x + 22, y: chest.y, r: 8, type: "loot", value: createLootItem(chest.rarity === "red" || chest.rarity === "gold") });
    addFloater(chest.x, chest.y - 28, `Chest +${bonus}`, "#f5c15f", 1.3);
  }
}

function movePlayer(dx, dy) {
  const p = state.player;
  const nextX = clamp(p.x + dx, 18, worldSize.w - 18);
  if (!hitsObstacle(nextX, p.y, p.r)) p.x = nextX;
  const nextY = clamp(p.y + dy, 18, worldSize.h - 18);
  if (!hitsObstacle(p.x, nextY, p.r)) p.y = nextY;
}

function hitsObstacle(x, y, radius) {
  return state.world.obstacles.some(obstacle => {
    if (obstacle.r) return Math.hypot(x - obstacle.x, y - obstacle.y) < radius + obstacle.r;
    return circleRectOverlap(x, y, radius, obstacle);
  });
}

function circleRectOverlap(cx, cy, radius, rect) {
  const closestX = clamp(cx, rect.x, rect.x + rect.w);
  const closestY = clamp(cy, rect.y, rect.y + rect.h);
  return Math.hypot(cx - closestX, cy - closestY) < radius;
}

function damageEnemiesInRadius(x, y, radius, damage, label, except) {
  for (const enemy of state.enemies) {
    if (enemy === except) continue;
    if (Math.hypot(enemy.x - x, enemy.y - y) <= radius + enemy.r) {
      enemy.hp -= damage;
      enemy.hitFlash = .12;
      addFloater(enemy.x, enemy.y - 10, label, "#f5c15f", .62);
    }
  }
}

function damageEnemiesInArc(x, y, radius, angle, width, damage, label) {
  for (const enemy of state.enemies) {
    const dx = enemy.x - x;
    const dy = enemy.y - y;
    const d = Math.hypot(dx, dy);
    const enemyAngle = Math.atan2(dy, dx);
    if (d <= radius + enemy.r && Math.abs(angleDelta(angle, enemyAngle)) <= width / 2) {
      enemy.hp -= damage;
      enemy.hitFlash = .12;
      addFloater(enemy.x, enemy.y - 10, label, "#edf3f4", .62);
    }
  }
}

function collectKills() {
  const killed = state.enemies.filter(e => e.hp <= 0);
  state.enemies = state.enemies.filter(e => e.hp > 0);
  for (const enemy of killed) {
    state.kills++;
    if (enemy.boss) state.bossDefeated = true;
    const shardValue = Math.ceil(enemy.shard * (enemy.boss ? 1 : state.mod.shard || 1));
    state.pickups.push({ x: enemy.x, y: enemy.y, r: 5, type: "shard", value: shardValue });
    state.pickups.push({ x: enemy.x + rand(-10, 10), y: enemy.y + rand(-10, 10), r: 5, type: "xp", value: Math.ceil(enemy.xp * (state.mod.xp || 1)) });
    if (enemy.boss || enemy.elite || Math.random() < .055) dropLoot(enemy.x, enemy.y, enemy.boss);
  }
}

function dropLoot(x, y, guaranteed) {
  if (!guaranteed && Math.random() > .7) return;
  const loot = createLootItem(guaranteed);
  state.pickups.push({ x: x + rand(-12, 12), y: y + rand(-12, 12), r: 8, type: "loot", value: loot });
}

function collectPickups(dt) {
  const p = state.player;
  for (const item of state.pickups) {
    const d = dist(item, p);
    if (d < p.magnet) {
      item.x += ((p.x - item.x) / Math.max(d, 1)) * 350 * dt;
      item.y += ((p.y - item.y) / Math.max(d, 1)) * 350 * dt;
    }
    if (d < p.r + item.r + 5) {
      item.dead = true;
      if (item.type === "shard") state.shards += item.value;
      if (item.type === "xp") gainXp(item.value);
      if (item.type === "loot") {
        save.inventory.unshift(item.value);
        save.inventory = save.inventory.slice(0, 24);
        state.lootFound.unshift(`${item.value.rarity}: ${item.value.name}`);
        persist();
        addFloater(p.x, p.y - 28, item.value.name, item.value.color, 1.4);
      }
    }
  }
  state.pickups = state.pickups.filter(i => !i.dead);
}

function updateFloaters(dt) {
  for (const floater of state.floaters) {
    floater.y -= 24 * dt;
    floater.life -= dt;
  }
  state.floaters = state.floaters.filter(f => f.life > 0);
}

function gainXp(amount) {
  state.xp += amount;
  while (state.xp >= state.xpNeed) {
    state.xp -= state.xpNeed;
    state.level++;
    state.xpNeed = Math.floor(state.xpNeed * 1.28 + 8);
    openUpgradeChoice();
  }
}

function checkDailyQuests(forceRender) {
  let changed = false;
  for (const quest of dailyQuests()) {
    if (!save.daily.completed.includes(quest.id) && quest.progress() >= quest.goal) {
      save.daily.completed.push(quest.id);
      state.shards += quest.reward;
      addFloater(state.player.x, state.player.y - 54 - save.daily.completed.length * 18, `Quest voltooid: +${quest.reward}`, "#f5c15f", 1.8);
      changed = true;
    }
  }
  if (changed) persist();
  else if (forceRender) renderMeta();
}

function openUpgradeChoice() {
  pausedForChoice = true;
  els.choices.innerHTML = "";
  const options = [...runUpgrades].sort(() => Math.random() - .5).slice(0, 3);
  for (const option of options) {
    const btn = document.createElement("button");
    btn.innerHTML = `<span>${option.title}</span><small>${option.desc}</small>`;
    btn.addEventListener("click", () => {
      option.apply();
      pausedForChoice = false;
      els.choiceModal.classList.add("hidden");
    });
    els.choices.appendChild(btn);
  }
  els.choiceModal.classList.remove("hidden");
}

function draw() {
  ctx.save();
  if (state.shake > 0) ctx.translate(rand(-4, 4), rand(-4, 4));
  ctx.translate(-state.camera.x, -state.camera.y);
  drawArena();
  for (const chest of state.chests) drawChest(chest);
  for (const item of state.pickups) drawPickup(item);
  for (const hazard of state.hazards) drawHazard(hazard);
  for (const burst of state.bursts) drawBurst(burst);
  for (const bullet of state.bullets) drawProjectile(bullet);
  const actors = [...state.enemies, state.player].sort((a, b) => a.y - b.y);
  for (const actor of actors) {
    if (actor === state.player) drawHero();
    else drawMonster(actor);
  }
  for (const floater of state.floaters) drawFloater(floater);
  ctx.restore();
  drawScreenVignette();
  if (!state.running && !state.ended) drawCenterText("Kies je held en start de run");
  renderHud();
  renderMinimap();
}

function drawHazard(hazard) {
  if (hazard.effect && spritesReady) {
    const sprite = sprites.skillEffects[hazard.effect];
    drawRotatedSprite(sprite, hazard.x, hazard.y, .7 + Math.sin(performance.now() / 240) * .04, performance.now() / 520);
  }
  const alpha = clamp(hazard.life / 4.2, 0, 1) * .32;
  drawCircle(hazard.x, hazard.y, hazard.r, hexToRgba(hazard.color, alpha));
  ctx.strokeStyle = hexToRgba(hazard.color, .65);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(hazard.x, hazard.y, hazard.r, 0, Math.PI * 2);
  ctx.stroke();
}

function drawBurst(burst) {
  const t = 1 - burst.life / burst.maxLife;
  if (burst.effect && spritesReady) {
    const sprite = sprites.skillEffects[burst.effect];
    const scale = (burst.scale || .7) * (burst.marker ? 1 : .85 + t * .25);
    drawRotatedSprite(sprite, burst.x, burst.y, scale, burst.angle || 0);
  }
  const radius = burst.marker ? burst.r * (1 + t * .2) : burst.r * (.25 + t * .85);
  const alpha = burst.marker ? .45 : Math.max(0, 1 - t) * .55;
  if (burst.arc !== undefined) {
    ctx.strokeStyle = hexToRgba(burst.color, alpha);
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.arc(burst.x, burst.y, radius, burst.arc - burst.width / 2, burst.arc + burst.width / 2);
    ctx.stroke();
    return;
  }
  drawCircle(burst.x, burst.y, radius, hexToRgba(burst.color, alpha * .35));
  ctx.strokeStyle = hexToRgba(burst.color, alpha);
  ctx.lineWidth = burst.marker ? 3 : 5;
  ctx.beginPath();
  ctx.arc(burst.x, burst.y, radius, 0, Math.PI * 2);
  ctx.stroke();
}

function drawArena() {
  if (spritesReady && spriteImages.get(sprites.map.background)?.complete) {
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(spriteImages.get(sprites.map.background), 0, 0, worldSize.w, worldSize.h);
  } else {
    ctx.fillStyle = "#171b1d";
    ctx.fillRect(0, 0, worldSize.w, worldSize.h);
  }

  if (spritesReady && !spriteImages.get(sprites.map.background)?.complete) {
    const stoneA = spriteImages.get(sprites.tiles[0]);
    const stoneB = spriteImages.get(sprites.tiles[1]);
    const tileW = 86;
    const tileH = 80;
    for (let y = 0; y < worldSize.h; y += tileH) {
      for (let x = 0; x < worldSize.w; x += tileW) {
        const tile = (Math.floor(x / tileW) + Math.floor(y / tileH)) % 3 === 0 ? stoneB : stoneA;
        ctx.globalAlpha = .96;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(tile, x, y, tileW, tileH);
      }
    }
    ctx.globalAlpha = 1;
  }

  drawBossAreaHint();
  for (const decor of state.world.decor) drawMapDecor(decor);
  if (showObstacleDebug) drawObstacleDebug();

  ctx.strokeStyle = "#3a4854";
  ctx.lineWidth = 3;
  ctx.strokeRect(16, 16, worldSize.w - 32, worldSize.h - 32);
}

function drawBossAreaHint() {
  if (!state.bossSpawned || state.bossDefeated) return;
  const room = state.world.rooms.find(item => item.boss);
  if (!room) return;
  const center = roomCenter(room);
  ctx.strokeStyle = "rgba(197,90,174,.28)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(center.x, center.y, 175 + Math.sin(performance.now() / 420) * 4, 0, Math.PI * 2);
  ctx.stroke();
}

function drawObstacleDebug() {
  ctx.save();
  ctx.strokeStyle = "rgba(242,106,106,.75)";
  ctx.fillStyle = "rgba(242,106,106,.14)";
  ctx.lineWidth = 2;
  for (const obstacle of state.world.obstacles) {
    ctx.beginPath();
    if (obstacle.r) {
      ctx.arc(obstacle.x, obstacle.y, obstacle.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.rect(obstacle.x, obstacle.y, obstacle.w, obstacle.h);
      ctx.fill();
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawMapDecor(decor) {
  const path = sprites.map.decor[decor.sprite];
  const img = spriteImages.get(path);
  if (!img?.complete) return;
  drawSpriteCentered(path, decor.x, decor.y, decor.s || 1);
}

function drawScreenVignette() {
  const vignette = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 80, canvas.width / 2, canvas.height / 2, 560);
  vignette.addColorStop(0, "rgba(255,255,255,.02)");
  vignette.addColorStop(1, "rgba(0,0,0,.34)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawHero() {
  const p = state.player;
  const angle = Math.atan2(mouse.y - p.y, mouse.x - p.x);
  if (spritesReady) {
    const frames = sprites.heroes[p.classKey] || sprites.heroes.knight;
    const anim = animations.heroes[p.classKey] || animations.heroes.knight;
    const moving = isPlayerMoving();
    const mode = p.attackAnim > 0 ? "attack" : moving ? "walk" : "idle";
    const frame = pickFrame(frames, anim[mode] || anim.idle, anim.speed);
    const bob = moving ? Math.sin(performance.now() / 180) * 2 : Math.sin(performance.now() / 520) * 1;
    drawCircle(p.x, p.y + 13, 19, "rgba(0,0,0,.28)");
    drawCircle(p.x, p.y, p.r + 9, hexToRgba(p.color, .15));
    drawSpriteBottom(frame, p.x, p.y + 22 + bob, p.classKey === "mage" ? 1.08 : 1.18);
    ctx.strokeStyle = p.color;
    ctx.lineWidth = p.attackAnim > 0 ? 5 : 3;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y - 2);
    ctx.lineTo(p.x + Math.cos(angle) * (p.attackAnim > 0 ? 42 : 30), p.y - 2 + Math.sin(angle) * (p.attackAnim > 0 ? 42 : 30));
    ctx.stroke();
    return;
  }

  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(angle);
  drawCircle(0, 0, p.r + 6, hexToRgba(p.color, .18));

  if (p.classKey === "knight") drawKnight(p.color);
  if (p.classKey === "mage") drawMage(p.color);
  if (p.classKey === "elf") drawElf(p.color);
  ctx.restore();
}

function drawKnight(color) {
  drawCircle(0, 0, 15, color);
  ctx.fillStyle = "#dfe8ef";
  ctx.fillRect(-7, -12, 14, 18);
  ctx.fillStyle = "#28323a";
  ctx.fillRect(8, -10, 7, 20);
  ctx.fillStyle = "#f5c15f";
  ctx.fillRect(4, -3, 24, 6);
  ctx.fillStyle = "#101318";
  ctx.fillRect(3, -6, 7, 12);
}

function drawMage(color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(18, 0);
  ctx.lineTo(-12, -17);
  ctx.lineTo(-7, 0);
  ctx.lineTo(-12, 17);
  ctx.closePath();
  ctx.fill();
  drawCircle(-1, 0, 10, "#efe6ff");
  ctx.fillStyle = "#f5c15f";
  ctx.fillRect(9, -3, 22, 5);
  drawCircle(32, 0, 5, "#c989ff");
}

function drawElf(color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(19, 0);
  ctx.lineTo(-11, -14);
  ctx.lineTo(-5, 0);
  ctx.lineTo(-11, 14);
  ctx.closePath();
  ctx.fill();
  drawCircle(-2, 0, 10, "#e9f6dc");
  ctx.strokeStyle = "#f5c15f";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(8, 0, 16, -.8, .8);
  ctx.stroke();
  ctx.fillStyle = "#8ff5c0";
  ctx.fillRect(12, -2, 17, 4);
}

function drawMonster(enemy) {
  if (enemy.kind === "boss") {
    drawBoss(enemy);
    return;
  }

  if (spritesReady) {
    const frames = sprites.monsters[enemy.kind] || sprites.monsters.goblin;
    const anim = animations.monsters[enemy.kind] || animations.monsters.goblin;
    const mode = enemy.attackAnim > 0 && anim.attack ? "attack" : "walk";
    const frame = pickFrame(frames, anim[mode] || anim.idle, anim.speed, enemy.animPhase);
    const scale = enemy.elite ? 1.35 : enemy.kind === "demon" ? 1.12 : enemy.kind === "brute" ? 1.0 : 1.18;
    const speedMood = enemy.kind === "hellhound" ? 190 : enemy.kind === "brute" || enemy.kind === "demon" ? 520 : 330;
    const bobAmount = enemy.kind === "hellhound" ? 3.2 : enemy.kind === "brute" || enemy.kind === "demon" ? 1.1 : 2.1;
    const bob = Math.sin((performance.now() + enemy.animPhase) / speedMood) * bobAmount;
    drawCircle(enemy.x, enemy.y + enemy.r * .9, enemy.r * .95, "rgba(0,0,0,.25)");
    drawAnimatedSpriteBottom(frame, enemy.x, enemy.y + enemy.r + 7, scale, {
      flipX: state.player.x < enemy.x,
      bob,
      tilt: Math.sin((performance.now() + enemy.animPhase) / speedMood) * (enemy.kind === "brute" || enemy.kind === "demon" ? .018 : .045),
      squash: enemy.attackAnim > 0 ? .92 : 1 + Math.sin((performance.now() + enemy.animPhase) / 260) * .025,
      stretch: enemy.attackAnim > 0 ? 1.12 : 1 + Math.cos((performance.now() + enemy.animPhase) / 310) * .018,
      lunge: enemy.attackAnim > 0 ? 8 : 0,
      angle: Math.atan2(state.player.y - enemy.y, state.player.x - enemy.x),
      flash: enemy.hitFlash > 0,
    });
    if (enemy.hitFlash > 0) {
      ctx.globalAlpha = .45;
      drawCircle(enemy.x, enemy.y - 8, enemy.r + 12, "#ffffff");
      ctx.globalAlpha = 1;
    }
    if (enemy.elite) {
      ctx.strokeStyle = "#f5c15f";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y - 4, enemy.r + 10, 0, Math.PI * 2);
      ctx.stroke();
    }
    drawEnemyBar(enemy);
    return;
  }

  ctx.save();
  ctx.translate(enemy.x, enemy.y);
  const wobble = Math.sin(performance.now() / 160 + enemy.x) * 2;
  ctx.rotate(wobble * .02);
  const scale = enemy.elite ? 1.18 : 1;
  ctx.scale(scale, scale);

  if (enemy.kind === "goblin") drawGoblin(enemy);
  if (enemy.kind === "skeleton") drawGoblin(enemy);
  if (enemy.kind === "hellhound") drawShade(enemy);
  if (enemy.kind === "demon") drawBrute(enemy);
  if (enemy.kind === "shade") drawShade(enemy);
  if (enemy.kind === "brute") drawBrute(enemy);
  if (enemy.kind === "spitter") drawSpitter(enemy);
  ctx.restore();
  drawEnemyBar(enemy);
}

function drawGoblin() {
  ctx.fillStyle = "#7acb68";
  ctx.beginPath();
  ctx.moveTo(-14, -8);
  ctx.lineTo(-22, -18);
  ctx.lineTo(-8, -13);
  ctx.lineTo(0, -15);
  ctx.lineTo(8, -13);
  ctx.lineTo(22, -18);
  ctx.lineTo(14, -8);
  ctx.lineTo(12, 13);
  ctx.lineTo(-12, 13);
  ctx.closePath();
  ctx.fill();
  monsterEyes("#101318");
}

function drawShade() {
  ctx.fillStyle = "#5f6ac9";
  ctx.beginPath();
  ctx.moveTo(0, -18);
  ctx.bezierCurveTo(18, -12, 18, 15, 0, 20);
  ctx.bezierCurveTo(-18, 15, -18, -12, 0, -18);
  ctx.fill();
  ctx.fillStyle = "#11171d";
  ctx.fillRect(-9, -3, 6, 4);
  ctx.fillRect(3, -3, 6, 4);
}

function drawBrute() {
  ctx.fillStyle = "#b76154";
  ctx.fillRect(-17, -15, 34, 30);
  ctx.fillStyle = "#f5c15f";
  ctx.beginPath();
  ctx.moveTo(-13, -15);
  ctx.lineTo(-22, -25);
  ctx.lineTo(-5, -17);
  ctx.moveTo(13, -15);
  ctx.lineTo(22, -25);
  ctx.lineTo(5, -17);
  ctx.fill();
  monsterEyes("#101318");
}

function drawSpitter() {
  ctx.fillStyle = "#95ce57";
  ctx.beginPath();
  ctx.ellipse(0, 0, 17, 13, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#263126";
  ctx.beginPath();
  ctx.arc(10, 0, 7, 0, Math.PI * 2);
  ctx.fill();
  monsterEyes("#101318");
}

function drawBoss(enemy) {
  if (spritesReady) {
    const frame = sprites.monsters.boss[0];
    drawCircle(enemy.x, enemy.y + 28, 46, "rgba(0,0,0,.32)");
    drawCircle(enemy.x, enemy.y, 54, "rgba(242,106,106,.18)");
    drawSpriteBottom(frame, enemy.x, enemy.y + 52, .75);
    drawEnemyBar(enemy, 104);
    return;
  }

  ctx.save();
  ctx.translate(enemy.x, enemy.y);
  drawCircle(0, 0, 42, "rgba(242,106,106,.2)");
  ctx.fillStyle = "#3b2530";
  ctx.beginPath();
  ctx.moveTo(0, -42);
  ctx.lineTo(38, -18);
  ctx.lineTo(28, 28);
  ctx.lineTo(0, 42);
  ctx.lineTo(-28, 28);
  ctx.lineTo(-38, -18);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#f26a6a";
  ctx.fillRect(-22, -7, 12, 7);
  ctx.fillRect(10, -7, 12, 7);
  ctx.fillStyle = "#f5c15f";
  ctx.beginPath();
  ctx.moveTo(-22, -32);
  ctx.lineTo(-40, -54);
  ctx.lineTo(-10, -38);
  ctx.moveTo(22, -32);
  ctx.lineTo(40, -54);
  ctx.lineTo(10, -38);
  ctx.fill();
  ctx.restore();
  drawEnemyBar(enemy, 52);
}

function monsterEyes(color) {
  ctx.fillStyle = color;
  ctx.fillRect(-8, -4, 5, 4);
  ctx.fillRect(3, -4, 5, 4);
}

function drawEnemyBar(enemy, width = enemy.r * 2) {
  ctx.fillStyle = "rgba(0,0,0,.38)";
  ctx.fillRect(enemy.x - width / 2, enemy.y - enemy.r - 12, width, 4);
  ctx.fillStyle = enemy.boss ? "#f5c15f" : "#edf3f4";
  ctx.fillRect(enemy.x - width / 2, enemy.y - enemy.r - 12, width * (enemy.hp / enemy.maxHp), 4);
}

function drawProjectile(bullet) {
  if (spritesReady && bullet.effect && sprites.skillEffects[bullet.effect]) {
    const sprite = sprites.skillEffects[bullet.effect];
    const angle = Math.atan2(bullet.vy, bullet.vx);
    const scale = bullet.effect === "fireball" || bullet.effect === "arcaneBolt" ? .34 : bullet.effect === "multishot" ? .26 : .3;
    drawRotatedSprite(sprite, bullet.x, bullet.y, scale, angle);
    return;
  }
  if (spritesReady) {
    const sprite = bullet.hostile ? (bullet.damage > 10 ? sprites.projectiles.boss : sprites.projectiles.hostile) : sprites.projectiles[state.player.classKey];
    const angle = Math.atan2(bullet.vy, bullet.vx);
    drawRotatedSprite(sprite, bullet.x, bullet.y, bullet.hostile ? .28 : .34, angle);
    return;
  }
  drawCircle(bullet.x, bullet.y, bullet.r + 3, hexToRgba(bullet.color, .18));
  drawCircle(bullet.x, bullet.y, bullet.r, bullet.color);
}

function drawPickup(item) {
  if (spritesReady) {
    const sprite = item.type === "loot" ? sprites.pickups.loot : item.type === "xp" ? sprites.pickups.xp : sprites.pickups.shard;
    const bob = Math.sin(performance.now() / 180 + item.x) * 2;
    drawSpriteCentered(sprite, item.x, item.y + bob, item.type === "loot" ? .62 : .48);
    return;
  }
  if (item.type === "loot") {
    ctx.save();
    ctx.translate(item.x, item.y);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = item.value.color;
    ctx.fillRect(-7, -7, 14, 14);
    ctx.restore();
    return;
  }
  drawCircle(item.x, item.y, item.r, item.type === "shard" ? "#f5c15f" : "#73b7ff");
}

function drawChest(chest) {
  const sprite = sprites.chests[chest.rarity] || sprites.chests.blue;
  ctx.fillStyle = "rgba(0,0,0,.24)";
  ctx.beginPath();
  ctx.ellipse(chest.x, chest.y + 22, 24, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  if (spritesReady) {
    ctx.globalAlpha = chest.opened ? .55 : 1;
    drawSpriteBottom(sprite, chest.x, chest.y + 24, chest.opened ? .72 : .82);
    ctx.globalAlpha = 1;
  } else {
    ctx.fillStyle = chest.opened ? "#444" : "#b87931";
    ctx.fillRect(chest.x - 18, chest.y - 14, 36, 28);
  }
}

function drawFloater(floater) {
  ctx.globalAlpha = Math.max(0, floater.life);
  ctx.fillStyle = floater.color;
  ctx.font = "800 14px Segoe UI";
  ctx.textAlign = "center";
  ctx.fillText(floater.text, floater.x, floater.y);
  ctx.globalAlpha = 1;
}

function drawCenterText(text) {
  ctx.fillStyle = "rgba(0,0,0,.42)";
  ctx.fillRect(canvas.width / 2 - 190, canvas.height / 2 - 32, 380, 64);
  ctx.fillStyle = "#edf3f4";
  ctx.font = "800 24px Segoe UI";
  ctx.textAlign = "center";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 8);
}

function drawSpriteCentered(sprite, x, y, scale = 1) {
  const img = typeof sprite === "string" ? spriteImages.get(sprite) : sprite;
  if (!img || !img.complete) return;
  const w = img.naturalWidth * scale;
  const h = img.naturalHeight * scale;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, x - w / 2, y - h / 2, w, h);
}

function drawSpriteBottom(sprite, x, groundY, scale = 1, flipX = false) {
  const img = typeof sprite === "string" ? spriteImages.get(sprite) : sprite;
  if (!img || !img.complete) return;
  const w = img.naturalWidth * scale;
  const h = img.naturalHeight * scale;
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.translate(x, groundY);
  if (flipX) ctx.scale(-1, 1);
  ctx.drawImage(img, -w / 2, -h, w, h);
  ctx.restore();
}

function drawAnimatedSpriteBottom(sprite, x, groundY, scale = 1, options = {}) {
  const img = typeof sprite === "string" ? spriteImages.get(sprite) : sprite;
  if (!img || !img.complete) return;
  const lungeX = Math.cos(options.angle || 0) * (options.lunge || 0);
  const lungeY = Math.sin(options.angle || 0) * (options.lunge || 0);
  const w = img.naturalWidth * scale;
  const h = img.naturalHeight * scale;
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.translate(x + lungeX, groundY + (options.bob || 0) + lungeY);
  ctx.rotate(options.tilt || 0);
  ctx.scale(options.flipX ? -1 : 1, 1);
  ctx.scale(options.squash || 1, options.stretch || 1);
  ctx.drawImage(img, -w / 2, -h, w, h);
  if (options.flash) {
    ctx.globalCompositeOperation = "source-atop";
    ctx.globalAlpha = .35;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(-w / 2, -h, w, h);
  }
  ctx.restore();
}

function drawRotatedSprite(sprite, x, y, scale = 1, angle = 0) {
  const img = typeof sprite === "string" ? spriteImages.get(sprite) : sprite;
  if (!img || !img.complete) return;
  const w = img.naturalWidth * scale;
  const h = img.naturalHeight * scale;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, -w / 2, -h / 2, w, h);
  ctx.restore();
}

function pickFrame(frames, indexes, frameMs = 500, phase = 0) {
  const safeIndexes = indexes?.length ? indexes : [0];
  const idx = safeIndexes[Math.floor((performance.now() + phase) / frameMs) % safeIndexes.length];
  return frames[idx] || frames[0];
}

function isPlayerMoving() {
  return keys.has("w") || keys.has("a") || keys.has("s") || keys.has("d") ||
    keys.has("arrowup") || keys.has("arrowleft") || keys.has("arrowdown") || keys.has("arrowright");
}

function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function renderHud() {
  const p = state.player;
  els.hpText.textContent = `HP ${Math.ceil(Math.max(0, p.hp))}/${p.maxHp}`;
  els.hpBar.style.width = `${clamp((p.hp / p.maxHp) * 100, 0, 100)}%`;
  els.xpText.textContent = `Level ${state.level}`;
  els.xpBar.style.width = `${clamp((state.xp / state.xpNeed) * 100, 0, 100)}%`;
  els.timer.textContent = formatTime(state.timeLeft);
  els.coins.textContent = `${state.shards} shards`;
  els.kills.textContent = `${state.kills} kills`;
  renderAbilityBar();
  renderObjective();
}

function renderObjective() {
  if (!state.running) {
    els.objectiveTitle.textContent = "Ready";
    els.objectiveText.textContent = "Kies je held en start een run";
    return;
  }
  if (!state.bossSpawned) {
    els.objectiveTitle.textContent = "Hunt";
    els.objectiveText.textContent = `${Math.max(0, 45 - state.kills)} kills tot de boss verschijnt`;
    return;
  }
  if (!state.bossDefeated) {
    els.objectiveTitle.textContent = "Boss";
    els.objectiveText.textContent = "Versla The Hollow Alpha";
    return;
  }
  els.objectiveTitle.textContent = "Escape";
  els.objectiveText.textContent = "Overleef tot de timer eindigt";
}

function renderMinimap() {
  const w = minimap.width;
  const h = minimap.height;
  minimapCtx.clearRect(0, 0, w, h);
  minimapCtx.fillStyle = "rgba(8,11,14,.9)";
  minimapCtx.fillRect(0, 0, w, h);
  const sx = w / worldSize.w;
  const sy = h / worldSize.h;

  minimapCtx.fillStyle = "rgba(80,212,140,.12)";
  for (const room of state.world.rooms) {
    minimapCtx.fillRect(room.x * sx, room.y * sy, room.w * sx, room.h * sy);
  }
  minimapCtx.strokeStyle = "rgba(245,193,95,.6)";
  minimapCtx.strokeRect(state.camera.x * sx, state.camera.y * sy, canvas.width * sx, canvas.height * sy);

  for (const chest of state.chests) {
    if (chest.opened) continue;
    minimapCtx.fillStyle = "#f5c15f";
    minimapCtx.fillRect(chest.x * sx - 1, chest.y * sy - 1, 3, 3);
  }

  if (state.bossSpawned && !state.bossDefeated) {
    const boss = state.enemies.find(enemy => enemy.boss);
    if (boss) {
      minimapCtx.fillStyle = "#f26a6a";
      minimapCtx.beginPath();
      minimapCtx.arc(boss.x * sx, boss.y * sy, 4, 0, Math.PI * 2);
      minimapCtx.fill();
    }
  }

  minimapCtx.fillStyle = "#50d48c";
  minimapCtx.beginPath();
  minimapCtx.arc(state.player.x * sx, state.player.y * sy, 3, 0, Math.PI * 2);
  minimapCtx.fill();
}

function renderAbilityBar() {
  const p = state.player;
  const attackIcon = abilityIcons.attack[p.classKey];
  const basicNames = { knight: "Sword Slash", mage: "Fireball", elf: "Arrow Shot" };
  const abilities = [{ key: "LMB", id: "attack", name: basicNames[p.classKey] || "Basic", cooldown: state.attackClock || 0, max: p.fireDelay, icon: attackIcon }]
    .concat((classAbilities[p.classKey] || []).map(ability => ({
      ...ability,
      cooldown: p.abilityCooldowns[ability.id] || 0,
      max: ability.cooldown,
      icon: abilityIcons[ability.id],
    })));

  els.abilityBar.innerHTML = "";
  for (const ability of abilities) {
    const slot = document.createElement("div");
    slot.className = `ability-slot ${ability.cooldown <= 0 ? "ready" : ""}`;
    slot.title = ability.name;
    const cdText = ability.cooldown > 0 ? `<div class="ability-cd">${ability.cooldown < 1 ? ability.cooldown.toFixed(1) : Math.ceil(ability.cooldown)}</div>` : "";
    slot.innerHTML = `<img src="${ability.icon}" alt=""><span class="ability-key">${ability.key.toUpperCase()}</span>${cdText}`;
    els.abilityBar.appendChild(slot);
  }
}

function renderMeta() {
  normalizeDaily();
  els.dailyMod.textContent = `${todayMod().name}: ${todayMod().text}`;
  els.metaStats.textContent = `${save.shards} shards beschikbaar | ${save.totalShards} totaal | beste run ${save.bestKills} kills`;
  els.mightCost.textContent = cost("might");
  els.vigorCost.textContent = cost("vigor");
  els.swiftCost.textContent = cost("swift");
  els.lootLog.textContent = save.loot?.length ? save.loot.slice(0, 4).join(" | ") : "Nog geen bijzondere vondsten.";
  renderQuests();
  renderCharacter();
  renderInventory();
  renderCamp();
  renderLeaderboard();
}

function renderCamp() {
  els.campSubtitle.textContent = `${save.shards} shards beschikbaar | beste run ${save.bestKills} kills`;
  if (document.activeElement !== els.playerNameInput) {
    els.playerNameInput.value = save.playerName || "";
  }
  renderClassButtons(els.campClassSelect);
  renderCharacterInto(els.campCharacterPanel);
  renderLastRunLoot();
}

function renderLastRunLoot() {
  els.campLootPanel.innerHTML = "";
  const names = save.lastRunLoot || [];
  if (!names.length) {
    const empty = document.createElement("div");
    empty.className = "equipment-slot";
    empty.innerHTML = "<span class=\"item-icon\">?</span><span>Nog geen loot</span><small>Start een run en open chests.</small>";
    els.campLootPanel.appendChild(empty);
    return;
  }
  for (const name of names.slice(0, 6)) {
    const div = document.createElement("div");
    div.className = "equipment-slot";
    div.innerHTML = `<span class="item-icon">L</span><span>${name}</span><small>Gevonden in je laatste run</small>`;
    els.campLootPanel.appendChild(div);
  }
}

function renderLeaderboard() {
  els.leaderboardPanel.innerHTML = "";
  const rows = save.leaderboard || [];
  if (!rows.length) {
    els.leaderboardPanel.innerHTML = "<div class=\"leaderboard-row\"><strong>-</strong><span>Nog geen runs</span><small>0</small></div>";
    return;
  }
  rows.slice(0, 8).forEach((row, index) => {
    const div = document.createElement("div");
    div.className = "leaderboard-row";
    div.innerHTML = `<strong>${index + 1}</strong><span>${row.playerName || row.player_name || "Anonymous"} | ${row.className} | ${row.kills} kills | Lv ${row.level}${row.boss ? " | Boss" : ""}</span><small>${row.score}</small>`;
    els.leaderboardPanel.appendChild(div);
  });
}

function renderCharacter() {
  renderCharacterInto(els.characterPanel);
}

function renderCharacterInto(target) {
  const slots = ["weapon", "armor", "ring", "amulet"];
  const gear = equipmentBonus();
  target.innerHTML = `
    <div class="character-card">
      <div class="stat-grid">
        <div class="stat-pill"><strong>${gear.damage}</strong><small>bonus damage</small></div>
        <div class="stat-pill"><strong>${gear.maxHp}</strong><small>bonus HP</small></div>
        <div class="stat-pill"><strong>${Math.round(gear.speed * 100)}%</strong><small>speed</small></div>
        <div class="stat-pill"><strong>${Math.round(gear.skillPower * 100)}%</strong><small>skill power</small></div>
      </div>
    </div>
  `;
  for (const slot of slots) {
    const item = save.inventory.find(entry => entry.id === save.equipped?.[slot]);
    const div = document.createElement("div");
    div.className = "equipment-slot";
    div.innerHTML = item
      ? `<span class="item-icon" style="color:${item.color}">${slotIcon(item.slot)}</span><span>${slot.toUpperCase()}: ${item.name}</span><small style="color:${item.color}">${itemStatText(item)}</small>${itemTooltip(item)}`
      : `<span class="item-icon">${slotIcon(slot)}</span><span>${slot.toUpperCase()}: leeg</span><small>Geen item uitgerust</small>`;
    target.appendChild(div);
  }
}

function renderInventory() {
  els.inventoryPanel.innerHTML = "";
  const items = save.inventory.slice(0, 12);
  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "equipment-slot";
    empty.innerHTML = "<span>Geen items</span><small>Open chests of versla elites voor loot.</small>";
    els.inventoryPanel.appendChild(empty);
    return;
  }
  for (const item of items) {
    const equipped = save.equipped?.[item.slot] === item.id;
    const div = document.createElement("div");
    div.className = "inventory-item";
    div.dataset.rarity = item.rarity;
    div.innerHTML = `
      <span class="item-icon" style="color:${item.color}">${slotIcon(item.slot)}</span>
      <span>${equipped ? "E " : ""}${item.name}</span>
      <small style="color:${item.color}">${item.slot} | ${itemStatText(item)}</small>
      <div class="item-actions">
        <button data-equip="${item.id}" title="Draag item">Draag</button>
        <button data-salvage="${item.id}" title="Sloop item voor shards">Sloop</button>
      </div>
      ${itemTooltip(item)}
    `;
    els.inventoryPanel.appendChild(div);
  }
}

function equipItem(id) {
  if (state.running) return;
  const item = save.inventory.find(entry => entry.id === id);
  if (!item) return;
  save.equipped[item.slot] = item.id;
  persist();
  state = freshState();
}

function salvageItem(id) {
  if (state.running) return;
  const item = save.inventory.find(entry => entry.id === id);
  if (!item) return;
  if (save.equipped[item.slot] === id) save.equipped[item.slot] = null;
  save.inventory = save.inventory.filter(entry => entry.id !== id);
  save.shards += rarityInfo[item.rarity].salvage;
  persist();
  state = freshState();
}

function buyShopItem(kind) {
  if (state.running) return;
  const offers = {
    "common-cache": { cost: 18, guarantee: false },
    "rare-cache": { cost: 45, guarantee: "rare" },
    "legendary-cache": { cost: 120, guarantee: "legendary" },
  };
  const offer = offers[kind];
  if (!offer || save.shards < offer.cost) return;
  save.shards -= offer.cost;
  const item = createLootItem(offer.guarantee);
  save.inventory.unshift(item);
  save.inventory = save.inventory.slice(0, 24);
  save.loot = [`shop: ${item.name}`, ...(save.loot || [])].slice(0, 8);
  persist();
  state = freshState();
}

function renderClasses() {
  renderClassButtons(els.classSelect);
}

function renderClassButtons(target) {
  target.innerHTML = "";
  for (const [key, hero] of Object.entries(classes)) {
    const button = document.createElement("button");
    button.dataset.icon = hero.icon;
    button.className = key === save.selectedClass ? "active" : "";
    button.disabled = state.running;
    button.innerHTML = `<span>${hero.name}</span><small>${hero.desc}</small>`;
    button.addEventListener("click", () => {
      if (state.running) return;
      save.selectedClass = key;
      persist();
      state = freshState();
      renderClasses();
    });
    target.appendChild(button);
  }
}

function renderQuests() {
  els.dailyQuests.innerHTML = "";
  for (const quest of dailyQuests()) {
    const done = save.daily.completed.includes(quest.id);
    const progress = clamp(quest.progress(), 0, quest.goal);
    const item = document.createElement("div");
    item.className = "quest";
    item.innerHTML = `<strong>${quest.title}</strong><em>${done ? "klaar" : `+${quest.reward}`}</em><small>${progress}/${quest.goal} ${quest.label}</small>`;
    els.dailyQuests.appendChild(item);
  }
}

function cost(type) {
  const base = { might: 10, vigor: 12, swift: 14 }[type];
  return Math.floor(base * Math.pow(1.45, save[type]));
}

function buy(type) {
  const price = cost(type);
  if (save.shards < price || state.running) return;
  save.shards -= price;
  save[type]++;
  persist();
  state = freshState();
}

function addFloater(x, y, text, color, life = .9) {
  state.floaters.push({ x, y, text, color, life });
}

function updateCamera() {
  state.camera.x = clamp(state.player.x - canvas.width / 2, 0, worldSize.w - canvas.width);
  state.camera.y = clamp(state.player.y - canvas.height / 2, 0, worldSize.h - canvas.height);
}

function updateMouseWorld() {
  mouse.x = mouse.screenX + state.camera.x;
  mouse.y = mouse.screenY + state.camera.y;
}

function frame(now) {
  const dt = Math.min((now - lastTime) / 1000, .033);
  lastTime = now;
  update(dt);
  draw();
  requestAnimationFrame(frame);
}

function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function hexToRgba(hex, alpha) {
  const clean = hex.replace("#", "");
  const value = parseInt(clean, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

function angleDelta(a, b) {
  return Math.atan2(Math.sin(b - a), Math.cos(b - a));
}

function formatTime(value) {
  const safe = Math.max(0, Math.ceil(value));
  const min = Math.floor(safe / 60).toString().padStart(2, "0");
  const sec = (safe % 60).toString().padStart(2, "0");
  return `${min}:${sec}`;
}

window.addEventListener("keydown", event => {
  const key = event.key.toLowerCase();
  if (["w", "a", "s", "d", "arrowup", "arrowleft", "arrowdown", "arrowright", " ", "q", "e", "r"].includes(key)) {
    event.preventDefault();
  }
  keys.add(event.key.toLowerCase());
  if (event.code === "Space" && state.running && !pausedForChoice) {
    dash();
  }
  if (["q", "e", "r"].includes(key)) {
    const ability = classAbilities[state.player.classKey]?.find(item => item.key === key);
    if (ability) {
      event.preventDefault();
      useAbility(ability.id);
    }
  }
  if (key === "o") {
    showObstacleDebug = !showObstacleDebug;
  }
});

window.addEventListener("keyup", event => keys.delete(event.key.toLowerCase()));

canvas.addEventListener("pointermove", event => {
  const rect = canvas.getBoundingClientRect();
  mouse.screenX = ((event.clientX - rect.left) / rect.width) * canvas.width;
  mouse.screenY = ((event.clientY - rect.top) / rect.height) * canvas.height;
  updateMouseWorld();
});

canvas.addEventListener("pointerdown", event => {
  mouse.down = true;
  canvas.setPointerCapture?.(event.pointerId);
});

window.addEventListener("pointerup", () => {
  mouse.down = false;
});

els.startBtn.addEventListener("click", startRun);
els.summaryClose.addEventListener("click", () => {
  els.runSummary.classList.add("hidden");
  els.campScreen.classList.remove("hidden");
  renderCamp();
});
els.campStartBtn.addEventListener("click", startRun);
els.campCloseBtn.addEventListener("click", () => {
  els.campScreen.classList.add("hidden");
});
els.playerNameInput.addEventListener("input", () => {
  save.playerName = cleanPlayerName(els.playerNameInput.value);
  localStorage.setItem(storeKey, JSON.stringify(save));
});
els.resetBtn.addEventListener("click", () => {
  localStorage.removeItem(storeKey);
  save = loadSave();
  state = freshState();
  persist();
  renderClasses();
  els.startBtn.textContent = "Start Run";
  els.startBtn.disabled = false;
});

document.querySelectorAll("[data-upgrade]").forEach(button => {
  button.addEventListener("click", () => buy(button.dataset.upgrade));
});

els.inventoryPanel.addEventListener("click", event => {
  const equip = event.target.closest("[data-equip]");
  const salvage = event.target.closest("[data-salvage]");
  if (equip) equipItem(equip.dataset.equip);
  if (salvage) salvageItem(salvage.dataset.salvage);
});

els.shopPanel.addEventListener("click", event => {
  const button = event.target.closest("[data-shop]");
  if (button) buyShopItem(button.dataset.shop);
});

renderMeta();
renderClasses();
loadOnlineLeaderboard();
requestAnimationFrame(frame);
