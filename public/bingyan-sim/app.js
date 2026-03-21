/**
 * 兵演演武页（嵌入修仙）：仅角色卡池，界面不展示星级，只显示姓名。
 * 战斗数值仍按原五星档位计算。
 */

// ===== 战斗数值（沿用原高阶卡档位）=====
const STATS_BY_RARITY = {
  5: { atk: 30, hp: 125 },
};

function getCardStats(rarity) {
  const s = STATS_BY_RARITY[rarity] || STATS_BY_RARITY[5];
  return s ? { atk: s.atk, hp: s.hp } : { atk: 30, hp: 125 };
}

// 五星角色技能说明（图鉴预览用，游戏风格）
const SKILL_DESC = {
  "莉莉丝": "【双重奏】轮到己方行动时，可连续行动两次，对敌人造成双重打击。",
  "织田信长": "【天下布武】攻击结束后，对敌方全体进行炮击，每人受到 8～12 点伤害。",
  "提亚马特": "【创世】攻击结束后，恢复自身 20 点生命，并随机为一名队友恢复 10 点生命。",
  "阿尔托莉雅·卡斯特": "【领袖气质】战斗开始时，令己方随机一名角色攻击力翻倍，持续整场。",
  "冲田总司〔Alter〕": "【无明三段突】第二次轮到己方行动时，对攻击目标发动必杀一击。",
  "太公望": "【封神】战斗开始时发动一次，令敌方两名角色无法行动。",
  "福尔摩斯": "【推演】己方全体锁定攻击敌方当前血量最低的角色；血量相同时从 1 号位起锁定。",
  "赫拉克勒斯": "【十二试炼】死亡后复活并恢复 1 点生命，最多触发 3 次；复活时触发特效。",
  "摩根": "【女王裁断】行动前发动一次：己方除自己外随机一名角色血量归零，自己获得该角色攻击力双倍的攻击力加成。",
  "太空伊什塔尔": "【星之吐息】攻击仅造成 50% 伤害，但可随机攻击 4 个目标；原地连续发射 4 道紫色激光。",
  "始皇帝": "【不朽之躯】无法攻击，攻击机会直接移交给下一顺位己方角色；基础血量增加 120。",
  "U－奥尔加玛丽": "【异星神】发动一次：己方全体扣除 20 HP，对敌方全体造成 50 点伤害。",
  "贞德": "【吾主在此】强制敌方全部角色只能攻击自己；自己受到双倍伤害；攻击自己的敌人在该次攻击结束后攻击力永久减半。",
  "Kingprotea": "【成长】每次自己行动时，增加 20 点血量上限并回复 10～15 点生命。",
};

function getSkillDesc(name) {
  for (const key of Object.keys(SKILL_DESC)) {
    if (name.includes(key)) return SKILL_DESC[key];
  }
  return null;
}

// ===== 角色池（仅演武角色，姓名不含星级；图片 URL 仅演示）=====
const POOL = {
  5: [
    { name: "莉莉丝", url: "https://media.fgo.wiki/e/e6/%E8%8E%89%E8%8E%89%E4%B8%9D%E5%88%9D%E5%A7%8B.png" },
    { name: "织田信长", url: "https://media.fgo.wiki/6/62/%E4%BF%A1%E9%95%BF%E7%81%B5%E5%9F%BA%E5%86%8D%E4%B8%B4I.png" },
    { name: "提亚马特", url: "https://media.fgo.wiki/b/bf/%E5%B9%BC%E4%BD%93%EF%BC%8F%E6%8F%90%E4%BA%9A%E9%A9%AC%E7%89%B9%E5%88%9D%E5%A7%8B.png" },
    { name: "阿尔托莉雅·卡斯特", url: "https://media.fgo.wiki/1/10/%E9%98%BF%E5%B0%94%E6%89%98%E8%8E%89%E9%9B%85%C2%B7%E5%8D%A1%E6%96%AF%E7%89%B9%E5%88%9D%E5%A7%8B.png" },
    { name: "冲田总司〔Alter〕", url: "https://media.fgo.wiki/5/51/%E5%86%B2%E7%94%B0%E6%80%BB%E5%8F%B8%E3%80%94Alter%E3%80%95%28Saber%29%E5%88%9D%E5%A7%8B.png" },
    { name: "太公望", url: "https://media.fgo.wiki/3/3d/%E5%A4%AA%E5%85%AC%E6%9C%9B%E4%B8%89%E7%A0%B4.png" },
    { name: "福尔摩斯", url: "https://media.fgo.wiki/8/8a/Svt173P2.png" },
    { name: "赫拉克勒斯", url: "https://media.fgo.wiki/1/17/Herc2.png" },
    { name: "摩根", url: "https://media.fgo.wiki/b/b7/%E3%83%A2%E3%83%AB%E3%82%AC%E3%83%B3%E4%B8%89%E7%A0%B4.png" },
    { name: "太空伊什塔尔", url: "https://media.fgo.wiki/5/57/%E5%A4%AA%E7%A9%BA%E4%BC%8A%E4%BB%80%E5%A1%94%E5%B0%94%E4%B8%89%E7%A0%B4.png" },
    { name: "始皇帝", url: "https://media.fgo.wiki/5/50/%E7%A7%A6%E5%A7%8B%E7%9A%87_%E4%B8%89%E7%A0%B4.png" },
    { name: "U－奥尔加玛丽", url: "https://media.fgo.wiki/1/19/U%EF%BC%8D%E5%A5%A5%E5%B0%94%E5%8A%A0%E7%8E%9B%E4%B8%BD%E7%81%B5%E8%A1%A311%E5%8D%A1%E9%9D%A2.png" },
    { name: "贞德", url: "https://media.fgo.wiki/6/6b/%E8%B4%9E%E5%BE%B7-%E5%8D%A1%E9%9D%A21.png" },
    { name: "Kingprotea", url: "https://media.fgo.wiki/7/77/%E5%B8%9D%E7%8E%8B%E8%8A%B1_charagragh_3.png" },
  ],
};

// ===== DOM =====
const grid = document.getElementById("resultsGrid");
const hint = document.getElementById("hint");
const btnSingle = document.getElementById("btnSingle");
const btnTen = document.getElementById("btnTen");
const btnClear = document.getElementById("btnClear");

const statTotal = document.getElementById("statTotal");
const stat3 = document.getElementById("stat3");
const stat4 = document.getElementById("stat4");
const stat5 = document.getElementById("stat5");

// ===== 图鉴 DOM =====
const btnInventory = document.getElementById("btnInventory");
const inventoryModal = document.getElementById("inventoryModal");
const btnInventoryClose = document.getElementById("btnInventoryClose");
const invItems = document.getElementById("invItems");
const invHint = document.getElementById("invHint");
const previewEmpty = document.getElementById("previewEmpty");
const previewWrap = document.getElementById("previewWrap");

// ===== 战斗 DOM =====
const btnBattle = document.getElementById("btnBattle");
const battleModal = document.getElementById("battleModal");
const btnBattleClose = document.getElementById("btnBattleClose");
const battleTitle = document.getElementById("battleTitle");
const battleSelectPhase = document.getElementById("battleSelectPhase");
const battleFightPhase = document.getElementById("battleFightPhase");
const battleDeckHint = document.getElementById("battleDeckHint");
const battleDeckList = document.getElementById("battleDeckList");
const btnStartBattle = document.getElementById("btnStartBattle");
const battleInvItems = document.getElementById("battleInvItems");
const enemySlots = document.getElementById("enemySlots");
const playerSlots = document.getElementById("playerSlots");
const btnBattleNext = document.getElementById("btnBattleNext");
const battleSettleOverlay = document.getElementById("battleSettleOverlay");
const battleSettleTitle = document.getElementById("battleSettleTitle");
const btnBattleSettleOk = document.getElementById("btnBattleSettleOk");

// ===== 弹球娱乐模式 DOM =====
const btnBall = document.getElementById("btnBall");
const ballModal = document.getElementById("ballModal");
const btnBallClose = document.getElementById("btnBallClose");
const ballTitle = document.getElementById("ballTitle");
const ballSelectPhase = document.getElementById("ballSelectPhase");
const ballModePhase = document.getElementById("ballModePhase");
const ballGamePhase = document.getElementById("ballGamePhase");
const ballCardList = document.getElementById("ballCardList");
const btnBallNextMode = document.getElementById("btnBallNextMode");
const btnBallMode60 = document.getElementById("btnBallMode60");
const btnBallModeInfinite = document.getElementById("btnBallModeInfinite");
const btnBallStart = document.getElementById("btnBallStart");
const ballGameArena = document.getElementById("ballGameArena");
const ballGameCard = document.getElementById("ballGameCard");
const ballGameBalls = document.getElementById("ballGameBalls");
const ballTimer = document.getElementById("ballTimer");
const ballBallsCount = document.getElementById("ballBallsCount");
const ballResult = document.getElementById("ballResult");
const ballResultText = document.getElementById("ballResultText");
const btnBallAgain = document.getElementById("btnBallAgain");

// ===== 统计 =====
const stats = {
  total: 0,
  3: 0,
  4: 0,
  5: 0,
};

// ===== 图鉴数据（每位角色一条，无持有数量）=====
// key: `${rarity}|${name}` => { rarity, name, url }
const inventory = new Map();
/** 同一角色名在队伍中最多上阵人数 */
const MAX_SAME_ROLE_ON_TEAM = 1;

function seedCatalog() {
  inventory.clear();
  for (const c of POOL[5] || []) {
    inventory.set(`5|${c.name}`, { rarity: 5, name: c.name, url: c.url });
  }
}
seedCatalog();
let selectedKey = null;

// ===== 战斗数据 =====
// 已选上场队伍（最多 6 张，每项 { rarity, name, url, atk, hp, maxHp }）
let battleDeck = [];
// 战斗中己方/敌方单位，固定 6 槽位，死亡不移除（hp<=0 表示阵亡）
let playerUnits = [];
let enemyUnits = [];
/** 己方/敌方各自的下一次行动从哪号槽起算（找下一个存活）；每拍各推进一次，保证每方每回合各有一人出手 */
let playerBattleIndex = 0;
let enemyBattleIndex = 0;
/** 本局是否已弹出结算（防止重复弹窗） */
let battleSettled = false;

function rarityOrderDesc(a, b) {
  return a.name.localeCompare(b.name, "zh-Hans-CN");
}

function renderInventoryItem(entry, key) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className =
    "invItem invItemNameOnly" + (selectedKey === key ? " invItemSelected" : "");
  btn.setAttribute("aria-label", `查阅 ${entry.name}`);
  btn.addEventListener("click", () => {
    selectedKey = key;
    renderPreview(entry);
    renderInventory();
  });
  const name = document.createElement("span");
  name.className = "invItemName";
  name.textContent = entry.name;
  btn.appendChild(name);
  return btn;
}

function renderInventory() {
  const entries = Array.from(inventory.entries()).map(([key, v]) => ({ key, ...v }));
  entries.sort((a, b) => rarityOrderDesc(a, b));

  invItems.innerHTML = "";
  if (entries.length === 0) {
    invHint.textContent = "图鉴暂无角色。";
  } else {
    invHint.textContent = `图鉴共 ${entries.length} 位，点选姓名查阅立绘与神通`;
  }

  const frag = document.createDocumentFragment();
  for (const e of entries) {
    frag.appendChild(renderInventoryItem(e, e.key));
  }
  invItems.appendChild(frag);
}

function renderPreview(entry) {
  previewEmpty.classList.add("hidden");
  previewWrap.classList.remove("hidden");
  previewWrap.innerHTML = "";
  previewWrap.appendChild(
    renderCard({ name: entry.name, url: entry.url })
  );
  const stats = getCardStats(entry.rarity);
  const statsEl = document.createElement("div");
  statsEl.className = "previewStats";
  statsEl.innerHTML = `<span class="previewStat">攻击力：<strong>${stats.atk}</strong></span><span class="previewStat">气血：<strong>${stats.hp}</strong></span>`;
  previewWrap.appendChild(statsEl);
  const skillText = getSkillDesc(entry.name);
  if (skillText) {
    const skillEl = document.createElement("div");
    skillEl.className = "previewSkill";
    skillEl.innerHTML = `<span class="previewSkillLabel">神通</span><p class="previewSkillDesc">${skillText}</p>`;
    previewWrap.appendChild(skillEl);
  }
}

function clearPreview() {
  selectedKey = null;
  previewWrap.innerHTML = "";
  previewWrap.classList.add("hidden");
  previewEmpty.classList.remove("hidden");
}

function addToInventory(result) {
  const key = `${result.rarity}|${result.name}`;
  if (!inventory.has(key)) {
    inventory.set(key, {
      rarity: result.rarity,
      name: result.name,
      url: result.url,
    });
  }
}

// ===== 战斗：选卡与战斗逻辑 =====
// 在基础数值上随机增减（攻击 ±3，血量 ±5），最小为 1
function createBattleUnit(entry) {
  const base = getCardStats(entry.rarity);
  const atk = Math.max(1, base.atk + randInt(7) - 3);
  const hp = entry.name.includes("始皇帝")
    ? Math.max(1, base.hp + 120)
    : Math.max(1, base.hp + randInt(11) - 5);
  return {
    rarity: entry.rarity,
    name: entry.name,
    url: entry.url,
    atk,
    atkBase: atk,
    hp,
    maxHp: hp,
    actionCount: 0,
    skipNextTurn: 0,
    reviveCount: 0,
    morganSkillUsed: false,
    olgaSkillUsed: false,
  };
}

function getDeckKey(unit) {
  return `${unit.rarity}|${unit.name}`;
}

function countInBattleDeck(key) {
  return battleDeck.filter((u) => getDeckKey(u) === key).length;
}

function addToBattleDeck(entry) {
  if (battleDeck.length >= 6) return;
  const key = `${entry.rarity}|${entry.name}`;
  if (countInBattleDeck(key) >= MAX_SAME_ROLE_ON_TEAM) return;
  battleDeck.push(createBattleUnit(entry));
  renderBattleSelectPhase();
  renderBattleInvItems();
}

function removeFromBattleDeck(index) {
  battleDeck.splice(index, 1);
  renderBattleSelectPhase();
  renderBattleInvItems();
}

function renderBattleSelectPhase() {
  battleDeckHint.textContent = `已选 ${battleDeck.length}/6 人；下图鉴点姓名上阵，每名角色仅可上阵 1 人`;
  battleDeckList.innerHTML = "";
  battleDeck.forEach((u, i) => {
    const wrap = document.createElement("div");
    wrap.className = "battleDeckNameRow";
    const nameSpan = document.createElement("span");
    nameSpan.className = "battleDeckName";
    nameSpan.textContent = u.name;
    const rm = document.createElement("button");
    rm.type = "button";
    rm.className = "btn ghost small battleDeckRemove";
    rm.textContent = "移除";
    rm.addEventListener("click", () => removeFromBattleDeck(i));
    wrap.appendChild(nameSpan);
    wrap.appendChild(rm);
    battleDeckList.appendChild(wrap);
  });
  btnStartBattle.disabled = battleDeck.length !== 6;
}

function renderBattleInvItems() {
  const entries = Array.from(inventory.entries()).map(([key, v]) => ({ key, ...v }));
  entries.sort((a, b) => rarityOrderDesc(a, b));
  battleInvItems.innerHTML = "";
  const frag = document.createDocumentFragment();
  for (const e of entries) {
    const inDeck = countInBattleDeck(e.key);
    const canAdd = battleDeck.length < 6 && inDeck < MAX_SAME_ROLE_ON_TEAM;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "battleInvNameRow";
    btn.disabled = !canAdd;
    btn.setAttribute(
      "aria-label",
      inDeck >= MAX_SAME_ROLE_ON_TEAM
        ? `无法重复上阵：${e.name}（本阵已有该角色）`
        : `加入战斗：${e.name}（本阵尚未上阵该角色）`
    );
    btn.addEventListener("click", () => addToBattleDeck(e));
    const nameSpan = document.createElement("span");
    nameSpan.className = "battleInvName";
    nameSpan.textContent = e.name;
    const sub = document.createElement("span");
    sub.className = "battleInvSub";
    const countText = document.createElement("span");
    countText.className = "battleInvCount";
    countText.textContent = inDeck > 0 ? "已上阵" : "点选上阵";
    sub.appendChild(countText);
    btn.appendChild(nameSpan);
    btn.appendChild(sub);
    frag.appendChild(btn);
  }
  battleInvItems.appendChild(frag);
}

function getAllPoolCards() {
  const list = [];
  const arr = POOL[5];
  if (arr) for (const c of arr) list.push({ rarity: 5, ...c });
  return list;
}

function generateEnemyDeck() {
  const allCards = getAllPoolCards();
  if (allCards.length === 0) return [];
  const shuffled = [...allCards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = randInt(i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const need = Math.min(6, shuffled.length);
  const picked = shuffled.slice(0, need);
  const units = picked.map((c) => createBattleUnit(c));
  // 卡池不足 6 人时补位（允许重复，避免空槽）
  while (units.length < 6 && allCards.length > 0) {
    const c = allCards[randInt(allCards.length)];
    units.push(createBattleUnit(c));
  }
  for (let i = units.length - 1; i > 0; i--) {
    const j = randInt(i + 1);
    [units[i], units[j]] = [units[j], units[i]];
  }
  return units;
}

function renderBattleUnitSlot(unit, isPlayer, slotIndex) {
  const div = document.createElement("div");
  const dead = unit.hp <= 0;
  const buffed = unit.buffedByCaster === true;
  const isLockTarget = !dead && (
    (isPlayer && hasAliveHolmes(enemyUnits) && getLockedTargetPlayerIndex() === slotIndex) ||
    (!isPlayer && hasAliveHolmes(playerUnits) && getLockedTargetEnemyIndex() === slotIndex)
  );
  const hasLightning = !dead && (unit.skipNextTurn || 0) > 0;
  div.className = `battleSlot ${rarityClass(unit.rarity)}${dead ? " battleSlotDead" : ""}${buffed ? " has-caster-buff" : ""}${hasLightning ? " skill-skip-lightning" : ""}`;
  const cardFace = document.createElement("div");
  cardFace.className = "battleSlotFace";
  if (buffed) {
    const sword = document.createElement("div");
    sword.className = "skill-buff-sword";
    sword.setAttribute("aria-hidden", "true");
    cardFace.appendChild(sword);
  }
  if (isLockTarget) {
    const arrow = document.createElement("div");
    arrow.className = "skill-lock-arrow";
    arrow.setAttribute("aria-hidden", "true");
    cardFace.appendChild(arrow);
  }
  const img = document.createElement("img");
  img.alt = unit.name;
  img.referrerPolicy = "no-referrer";
  img.src = unit.url;
  img.onerror = () => {
    img.onerror = null;
    img.src = "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";
  };
  cardFace.appendChild(img);
  const info = document.createElement("div");
  info.className = "battleSlotInfo";
  const nameEl = document.createElement("div");
  nameEl.className = "battleSlotName";
  nameEl.textContent = unit.name;
  const hpBar = document.createElement("div");
  hpBar.className = "battleHpBar";
  const hpFill = document.createElement("div");
  hpFill.className = "battleHpFill";
  const pct = dead ? 0 : Math.max(0, (unit.hp / unit.maxHp) * 100);
  hpFill.style.width = pct + "%";
  hpBar.appendChild(hpFill);
  const text = document.createElement("div");
  text.className = "battleSlotText";
  text.textContent = dead ? "阵亡" : `ATK ${unit.atk} · HP ${unit.hp}/${unit.maxHp}`;
  info.appendChild(nameEl);
  info.appendChild(hpBar);
  info.appendChild(text);
  div.appendChild(cardFace);
  div.appendChild(info);
  return div;
}

function renderBattleArena() {
  playerSlots.innerHTML = "";
  enemySlots.innerHTML = "";
  for (let i = 0; i < 6; i++) {
    playerSlots.appendChild(renderBattleUnitSlot(playerUnits[i], true, i));
    enemySlots.appendChild(renderBattleUnitSlot(enemyUnits[i], false, i));
  }
}

function getAliveEnemyIndices() {
  return enemyUnits.map((u, i) => (u.hp > 0 ? i : -1)).filter((i) => i >= 0);
}

function getAlivePlayerIndices() {
  return playerUnits.map((u, i) => (u.hp > 0 ? i : -1)).filter((i) => i >= 0);
}

// 从 start 起顺位找下一个存活槽位（含 wrap）；仅用于始皇帝「移交下一顺位」等，不可用作全局回合指针
function getNextAlivePlayerSlot(start) {
  for (let k = 0; k < 6; k++) {
    const i = (start + k) % 6;
    if (playerUnits[i].hp > 0) return i;
  }
  return -1;
}

function getNextAliveEnemySlot(start) {
  for (let k = 0; k < 6; k++) {
    const i = (start + k) % 6;
    if (enemyUnits[i].hp > 0) return i;
  }
  return -1;
}

/** 仅判断胜负状态，不操作 DOM（结算统一在回合结束 finally 里处理） */
function getBattleOutcome() {
  if (getAliveEnemyIndices().length === 0) return "win";
  if (getAlivePlayerIndices().length === 0) return "lose";
  return null;
}

function hideBattleSettlement() {
  if (battleSettleOverlay) {
    battleSettleOverlay.classList.add("hidden");
    battleSettleOverlay.setAttribute("aria-hidden", "true");
  }
}

function showBattleSettlement(isWin) {
  if (battleSettled || !battleSettleTitle || !battleSettleOverlay) return;
  battleSettled = true;
  battleSettleTitle.textContent = isWin ? "战斗胜利！" : "战斗失败…";
  battleSettleTitle.classList.toggle("isWin", isWin);
  battleSettleTitle.classList.toggle("isLose", !isWin);
  battleSettleOverlay.classList.remove("hidden");
  battleSettleOverlay.setAttribute("aria-hidden", "false");
}

// 福尔摩斯：锁定攻击血量最低的敌人；同血量从 1 号位（最小索引）起
function getLockedTargetEnemyIndex() {
  const alive = getAliveEnemyIndices();
  if (alive.length === 0) return -1;
  let minHp = enemyUnits[alive[0]].hp;
  for (const i of alive) {
    if (enemyUnits[i].hp < minHp) minHp = enemyUnits[i].hp;
  }
  for (let i = 0; i < 6; i++) {
    if (enemyUnits[i].hp > 0 && enemyUnits[i].hp === minHp) return i;
  }
  return alive[0];
}

// 福尔摩斯：锁定攻击血量最低的己方；同血量从 1 号位起
function getLockedTargetPlayerIndex() {
  const alive = getAlivePlayerIndices();
  if (alive.length === 0) return -1;
  let minHp = playerUnits[alive[0]].hp;
  for (const i of alive) {
    if (playerUnits[i].hp < minHp) minHp = playerUnits[i].hp;
  }
  for (let i = 0; i < 6; i++) {
    if (playerUnits[i].hp > 0 && playerUnits[i].hp === minHp) return i;
  }
  return alive[0];
}

// 己方是否有存活的福尔摩斯（用于锁定目标）
function hasAliveHolmes(units) {
  return units.some((u) => u.hp > 0 && u.name.includes("福尔摩斯"));
}

// 贞德：若存在存活贞德则返回其槽位索引，否则 -1（用于强制攻击目标）
function getJeanneSlot(units) {
  for (let i = 0; i < 6; i++) {
    if (units[i] && units[i].hp > 0 && units[i].name.includes("贞德")) return i;
  }
  return -1;
}

// 攻击者攻击力永久减半（贞德技能：攻击贞德后触发）
function halveAttackerAtk(attacker) {
  if (!attacker) return;
  const prev = attacker.atk;
  attacker.atk = Math.max(1, Math.floor(attacker.atk / 2));
  attacker.atkBase = Math.max(1, Math.floor((attacker.atkBase ?? prev) / 2));
}

// 赫拉克勒斯：受伤后若死亡则尝试复活（1 血，最多 3 次）；复活时等待特效播完
async function applyDamageWithRevive(unit, damage, slotEl, unitLabel) {
  unit.hp -= damage;
  if (unit.hp <= 0 && unit.name.includes("赫拉克勒斯") && (unit.reviveCount || 0) < 3) {
    unit.reviveCount = (unit.reviveCount || 0) + 1;
    unit.hp = 1;
    appendLog(`${unitLabel} 发动技能复活！剩余 ${3 - unit.reviveCount} 次。`);
    await runReviveAnimation(slotEl);
    return "revived"; // 复活后可正常行动；轮换由 doOneTurn 的 playerBattleIndex / enemyBattleIndex 控制
  }
  if (unit.hp <= 0) {
    appendLog(`${unitLabel}已阵亡。`);
    return "dead";
  }
  return null;
}

function runReviveAnimation(slotEl) {
  if (!slotEl) return Promise.resolve();
  slotEl.classList.add("skill-revive");
  return new Promise((resolve) => {
    setTimeout(() => {
      slotEl.classList.remove("skill-revive");
      resolve();
    }, 800);
  });
}

function appendLog(_msg) {
  /* 战报栏已移除，保留调用以兼容技能文案逻辑 */
}

// 计算从攻击者中心到目标中心的像素偏移，用于攻击飞行动画
function getAttackDelta(attackerEl, targetEl) {
  const a = attackerEl.getBoundingClientRect();
  const t = targetEl.getBoundingClientRect();
  const dx = t.left + t.width / 2 - (a.left + a.width / 2);
  const dy = t.top + t.height / 2 - (a.top + a.height / 2);
  return { dx, dy };
}

// 播放一次攻击特效：攻击方飞向目标、斩击晃动、归位；被击方受击晃动。返回 Promise（带超时兜底，防止 animationend 未触发）
function runAttackAnimation(attackerEl, targetEl) {
  const { dx, dy } = getAttackDelta(attackerEl, targetEl);
  attackerEl.style.setProperty("--attack-dx", dx + "px");
  attackerEl.style.setProperty("--attack-dy", dy + "px");
  attackerEl.classList.add("attack-fly");
  targetEl.classList.add("attack-hit");
  const ANIM_DURATION_MS = 1200;
  return new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      try {
        attackerEl.removeEventListener("animationend", onEnd);
        attackerEl.classList.remove("attack-fly");
        targetEl.classList.remove("attack-hit");
        attackerEl.style.removeProperty("--attack-dx");
        attackerEl.style.removeProperty("--attack-dy");
      } catch (_) {}
      resolve();
    };
    const onEnd = () => finish();
    attackerEl.addEventListener("animationend", onEnd);
    setTimeout(finish, ANIM_DURATION_MS);
  });
}

// 摩根：发动技能时自身亮一下蓝光
function runMorganSkillFlash(slotEl) {
  if (!slotEl) return Promise.resolve();
  slotEl.classList.add("skill-morgan-flash");
  return new Promise((resolve) => {
    setTimeout(() => {
      slotEl.classList.remove("skill-morgan-flash");
      resolve();
    }, 480);
  });
}

// 冲田总司〔Alter〕：即死命中时在被即死目标槽位上播放黑色闪亮特效
function runOkitaKillFlash(slotEl) {
  if (!slotEl) return Promise.resolve();
  slotEl.classList.add("skill-okita-kill-flash");
  return new Promise((resolve) => {
    setTimeout(() => {
      slotEl.classList.remove("skill-okita-kill-flash");
      resolve();
    }, 520);
  });
}

// 太空伊什塔尔：原地连续发射 4 道紫色激光射向多个目标（不移动攻击者）
function runSpaceIshtarLasers(attackerEl, targetEls) {
  if (!attackerEl || !targetEls || targetEls.length === 0) return Promise.resolve();
  const a = attackerEl.getBoundingClientRect();
  const ax = a.left + a.width / 2;
  const ay = a.top + a.height / 2;

  function shootOne(targetEl) {
    return new Promise((resolve) => {
      const t = targetEl.getBoundingClientRect();
      const tx = t.left + t.width / 2;
      const ty = t.top + t.height / 2;
      const dx = tx - ax;
      const dy = ty - ay;
      const dist = Math.hypot(dx, dy) || 1;
      const angle = Math.atan2(dy, dx);

      const beam = document.createElement("div");
      beam.className = "skill-laser-beam";
      beam.style.left = ax + "px";
      beam.style.top = ay + "px";
      beam.style.width = dist + "px";
      beam.style.setProperty("--laser-angle", angle + "rad");
      document.body.appendChild(beam);

      requestAnimationFrame(() => {
        beam.classList.add("skill-laser-beam-shoot");
      });
      setTimeout(() => {
        beam.remove();
        resolve();
      }, 280);
    });
  }

  let p = Promise.resolve();
  const maxThree = targetEls.slice(0, 4);
  for (let i = 0; i < maxThree.length; i++) {
    p = p.then(() => shootOne(maxThree[i])).then(() => new Promise((r) => setTimeout(r, 120)));
  }
  return p;
}

// U－奥尔加玛丽：己方扣血红色光效（对若干槽位添加 class 后延时移除）
function runOlgaAllyDamageEffect(slotElements) {
  slotElements.forEach((el) => el.classList.add("skill-olga-ally-damage"));
  return new Promise((resolve) => {
    setTimeout(() => {
      slotElements.forEach((el) => el.classList.remove("skill-olga-ally-damage"));
      resolve();
    }, 480);
  });
}
// U－奥尔加玛丽：敌方受击金色光效（由调用方先 add，此函数延时后移除）
function runOlgaEnemyHitEffect(slotElements) {
  return new Promise((resolve) => {
    setTimeout(() => {
      slotElements.forEach((el) => el.classList.remove("skill-olga-enemy-hit"));
      resolve();
    }, 450);
  });
}

// 织田信长：射击特效射向每个敌方（对每个敌方槽位播放命中动画）
function runShootToEnemies(attackerSlot, enemySlotElements) {
  const duration = 0.35;
  const total = duration * 1000 * enemySlotElements.length + 200;
  enemySlotElements.forEach((el, i) => {
    el.style.animationDelay = i * (duration * 0.4) + "s";
    el.classList.add("skill-shoot-hit");
  });
  return new Promise((resolve) => {
    setTimeout(() => {
      enemySlotElements.forEach((el) => {
        el.classList.remove("skill-shoot-hit");
        el.style.animationDelay = "";
      });
      resolve();
    }, total);
  });
}

// 提亚马特：绿色回复光效（己方若干槽位）
function runHealAnimation(slotElements) {
  slotElements.forEach((el) => el.classList.add("skill-heal"));
  return new Promise((resolve) => {
    setTimeout(() => {
      slotElements.forEach((el) => el.classList.remove("skill-heal"));
      resolve();
    }, 650);
  });
}

async function doOneTurn() {
  if (getBattleOutcome()) return;
  btnBattleNext.disabled = true;
  try {
    let playerConsumedSlot = null;
    let enemyConsumedSlot = null;

    const playerActSlot = getNextAlivePlayerSlot(playerBattleIndex);
    const me = playerActSlot >= 0 ? playerUnits[playerActSlot] : null;
    const playerSlotAct = me ? playerSlots.children[playerActSlot] : null;

    // 己方：从 playerBattleIndex 起找下一个存活；出手后指针 = (出手槽+1)%6，避免同人连动且每拍必有一人出手（该侧尚有人时）
    if (playerActSlot >= 0) {
      if ((me.skipNextTurn || 0) > 0) {
        me.skipNextTurn = 0;
        appendLog(`己方「${me.name}」无法行动。`);
        playerConsumedSlot = playerActSlot;
      } else {
    // 始皇帝：无法攻击，攻击机会移交给下一顺位己方角色
    let actSlot = playerActSlot;
    let actingMe = me;
    let actingSlotEl = playerSlotAct;
    if (me.name.includes("始皇帝")) {
      const nextSlot = getNextAlivePlayerSlot((playerActSlot + 1) % 6);
      if (nextSlot >= 0 && nextSlot !== playerActSlot) {
        actSlot = nextSlot;
        actingMe = playerUnits[nextSlot];
        actingSlotEl = playerSlots.children[nextSlot];
        appendLog(`始皇帝 将攻击机会移交给下一顺位己方「${actingMe.name}」。`);
      } else {
        appendLog(`己方「始皇帝」无法攻击，无下一顺位可移交。`);
        actingMe = null;
      }
    }
    if (actingMe) {
      playerConsumedSlot = actSlot;
    // U－奥尔加玛丽：只能使用一次，己方全体 -20 HP（红色光效），敌方全体 50 伤害（金色光效）
    if (actingMe.name.includes("U－奥尔加玛丽") && !actingMe.olgaSkillUsed) {
      const allySlots = [];
      for (let i = 0; i < 6; i++) {
        if (playerUnits[i].hp > 0) {
          playerUnits[i].hp = Math.max(0, playerUnits[i].hp - 20);
          allySlots.push(playerSlots.children[i]);
        }
      }
      if (allySlots.length > 0) await runOlgaAllyDamageEffect(allySlots);
      appendLog(`U－奥尔加玛丽 发动技能：己方全体扣除 20 HP。`);
      renderBattleArena();
      if (getBattleOutcome()) return;
      const enemySlotsToHit = [];
      for (let i = 0; i < 6; i++) {
        if (enemyUnits[i].hp > 0) enemySlotsToHit.push(enemySlots.children[i]);
      }
      enemySlotsToHit.forEach((el) => el.classList.add("skill-olga-enemy-hit"));
      let hitJeanneOlgaP = false;
      for (let i = 0; i < 6; i++) {
        if (enemyUnits[i].hp > 0) {
          const dmg = enemyUnits[i].name.includes("贞德") ? 100 : 50;
          if (enemyUnits[i].name.includes("贞德")) hitJeanneOlgaP = true;
          await applyDamageWithRevive(enemyUnits[i], dmg, enemySlots.children[i], `敌方「${enemyUnits[i].name}」`);
        }
        if (getBattleOutcome()) break;
      }
      if (hitJeanneOlgaP) halveAttackerAtk(actingMe);
      await runOlgaEnemyHitEffect(enemySlotsToHit);
      actingMe.olgaSkillUsed = true;
      appendLog(`U－奥尔加玛丽 发动技能：对敌方全体造成 50 点伤害。`);
      renderBattleArena();
      if (getBattleOutcome()) return;
    } else {
    // 摩根：行动前发动一次，牺牲己方除自己外随机一名角色，获得其攻击力双倍加成
    if (actingMe.name.includes("摩根") && !actingMe.morganSkillUsed) {
      const otherAlive = getAlivePlayerIndices().filter((i) => i !== actSlot);
      if (otherAlive.length > 0) {
        const sacrificeIdx = otherAlive[randInt(otherAlive.length)];
        const sacrifice = playerUnits[sacrificeIdx];
        const bonus = 2 * (sacrifice.atkBase ?? sacrifice.atk);
        sacrifice.hp = 0;
        actingMe.atk = (actingMe.atkBase ?? actingMe.atk) + bonus;
        actingMe.morganSkillUsed = true;
        await runMorganSkillFlash(actingSlotEl);
        appendLog(`摩根 发动技能：己方「${sacrifice.name}」血量归零，摩根获得 ${bonus} 点攻击力加成！`);
        renderBattleArena();
        if (getBattleOutcome()) return;
      }
    }

    actingMe.actionCount = (actingMe.actionCount || 0) + 1;
    const isOkitaAlterSecond = actingMe.name.includes("冲田总司〔Alter〕") && actingMe.actionCount === 2;
    const isSpaceIshtar = actingMe.name.includes("太空伊什塔尔");
    const damage = isOkitaAlterSecond ? 999 : actingMe.atk;

    const aliveEnemy = getAliveEnemyIndices();
    const jeanneEnemySlot = getJeanneSlot(enemyUnits);
    if (isSpaceIshtar) {
      const shuffled = aliveEnemy.slice();
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = randInt(i + 1);
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      const targetIndices = shuffled.slice(0, 4);
      const damagePer = Math.max(1, Math.floor(actingMe.atk * 0.5));
      const targetSlots = targetIndices.map((i) => enemySlots.children[i]);
      await runSpaceIshtarLasers(actingSlotEl, targetSlots);
      let hitJeanne = false;
      const names = [];
      for (let i = 0; i < targetIndices.length; i++) {
        const idx = targetIndices[i];
        const foe = enemyUnits[idx];
        const slot = enemySlots.children[idx];
        if (foe.hp > 0) {
          slot.classList.add("skill-laser-hit");
          setTimeout(() => slot.classList.remove("skill-laser-hit"), 320);
          const d = foe.name.includes("贞德") ? damagePer * 2 : damagePer;
          await applyDamageWithRevive(foe, d, slot, `敌方「${foe.name}」`);
          if (foe.name.includes("贞德")) hitJeanne = true;
          names.push(foe.name);
        }
        if (getBattleOutcome()) break;
      }
      if (hitJeanne) halveAttackerAtk(actingMe);
      appendLog(`己方「${actingMe.name}」发动技能：对 ${names.length} 个目标各造成 ${damagePer} 点伤害（50%）。`);
    } else {
      const foeIndex = aliveEnemy.length > 0
        ? (jeanneEnemySlot >= 0 ? jeanneEnemySlot : (hasAliveHolmes(playerUnits) ? getLockedTargetEnemyIndex() : aliveEnemy[randInt(aliveEnemy.length)]))
        : -1;
      if (foeIndex >= 0) {
        const foe = enemyUnits[foeIndex];
        const enemySlotFoe = enemySlots.children[foeIndex];
        await runAttackAnimation(actingSlotEl, enemySlotFoe);
        if (isOkitaAlterSecond) {
          appendLog(`己方「${actingMe.name}」发动技能：秒杀！`);
          await runOkitaKillFlash(enemySlotFoe);
        } else {
          appendLog(`己方「${actingMe.name}」攻击敌方「${foe.name}」，造成 ${actingMe.atk} 点伤害。`);
        }
        const d = foe.name.includes("贞德") ? damage * 2 : damage;
        await applyDamageWithRevive(foe, d, enemySlotFoe, `敌方「${foe.name}」`);
        if (foe.name.includes("贞德")) halveAttackerAtk(actingMe);
      }
    }
    if (getBattleOutcome()) return;
    renderBattleArena();

    if (actingMe.name.includes("织田信长")) {
      const enemySlotList = Array.from(enemySlots.children);
      await runShootToEnemies(actingSlotEl, enemySlotList);
      let hitJeanne = false;
      for (let i = 0; i < 6; i++) {
        if (enemyUnits[i].hp > 0) {
          let dmg = 8 + randInt(5);
          if (enemyUnits[i].name.includes("贞德")) { dmg *= 2; hitJeanne = true; }
          appendLog(`织田信长 技能：敌方「${enemyUnits[i].name}」受到 ${dmg} 点射击伤害。`);
          await applyDamageWithRevive(enemyUnits[i], dmg, enemySlots.children[i], `敌方「${enemyUnits[i].name}」`);
        }
      }
      if (hitJeanne) halveAttackerAtk(actingMe);
      if (getBattleOutcome()) return;
      renderBattleArena();
    }

    if (actingMe.name.includes("提亚马特")) {
      actingMe.hp = Math.min(actingMe.maxHp, actingMe.hp + 20);
      const alivePlayer = getAlivePlayerIndices().filter((i) => i !== actSlot);
      if (alivePlayer.length > 0) {
        const allyIdx = alivePlayer[randInt(alivePlayer.length)];
        const ally = playerUnits[allyIdx];
        ally.hp = Math.min(ally.maxHp, ally.hp + 10);
        await runHealAnimation([actingSlotEl, playerSlots.children[allyIdx]]);
        appendLog(`提亚马特 技能：自身回复 20 HP，己方「${ally.name}」回复 10 HP。`);
      } else {
        await runHealAnimation([actingSlotEl]);
        appendLog(`提亚马特 技能：自身回复 20 HP。`);
      }
      renderBattleArena();
    }

    if (actingMe.name.includes("莉莉丝")) {
      const aliveEnemy2 = getAliveEnemyIndices();
      const jeanneEnemySlot2 = getJeanneSlot(enemyUnits);
      const foeIndex2 = aliveEnemy2.length > 0
        ? (jeanneEnemySlot2 >= 0 ? jeanneEnemySlot2 : (hasAliveHolmes(playerUnits) ? getLockedTargetEnemyIndex() : aliveEnemy2[randInt(aliveEnemy2.length)]))
        : -1;
      if (foeIndex2 >= 0) {
        const foe2 = enemyUnits[foeIndex2];
        await runAttackAnimation(playerSlots.children[actSlot], enemySlots.children[foeIndex2]);
        appendLog(`莉莉丝 技能：再次攻击敌方「${foe2.name}」，造成 ${actingMe.atk} 点伤害。`);
        const d2 = foe2.name.includes("贞德") ? actingMe.atk * 2 : actingMe.atk;
        await applyDamageWithRevive(foe2, d2, enemySlots.children[foeIndex2], `敌方「${foe2.name}」`);
        if (foe2.name.includes("贞德")) halveAttackerAtk(actingMe);
      }
      if (getBattleOutcome()) return;
      renderBattleArena();
    }

    if (actingMe.name.includes("Kingprotea")) {
      actingMe.maxHp += 20;
      const heal = 10 + randInt(6);
      actingMe.hp = Math.min(actingMe.maxHp, actingMe.hp + heal);
      await runHealAnimation([actingSlotEl]);
      appendLog(`Kingprotea 技能：血量上限 +20，回复 ${heal} HP。`);
      renderBattleArena();
    }

    }
    } else {
      playerConsumedSlot = playerActSlot;
    }
      }
    }

  const enemyActSlot = getNextAliveEnemySlot(enemyBattleIndex);
  const foeActor = enemyActSlot >= 0 ? enemyUnits[enemyActSlot] : null;

  // 敌方：同己方，独立指针 enemyBattleIndex
  if (enemyActSlot >= 0) {
    if ((foeActor.skipNextTurn || 0) > 0) {
      foeActor.skipNextTurn = 0;
      appendLog(`敌方「${foeActor.name}」无法行动。`);
      enemyConsumedSlot = enemyActSlot;
    } else {
    let actEnemySlot = enemyActSlot;
    let actFoe = foeActor;
    let actEnemyEl = enemySlots.children[enemyActSlot];
    // 敌方始皇帝：无法攻击，攻击机会移交给下一顺位
    if (foeActor.name.includes("始皇帝")) {
      const nextSlot = getNextAliveEnemySlot((enemyActSlot + 1) % 6);
      if (nextSlot >= 0 && nextSlot !== enemyActSlot) {
        actEnemySlot = nextSlot;
        actFoe = enemyUnits[nextSlot];
        actEnemyEl = enemySlots.children[nextSlot];
        appendLog(`敌方 始皇帝 将攻击机会移交给下一顺位敌方「${actFoe.name}」。`);
      } else {
        appendLog(`敌方「始皇帝」无法攻击，无下一顺位可移交。`);
        actFoe = null;
      }
    }
    if (actFoe) {
      enemyConsumedSlot = actEnemySlot;
    // 敌方 U－奥尔加玛丽：只能使用一次，己方（敌方阵营）全体 -20 HP（红色），敌方（己方阵营）全体 50 伤害（金色）
    if (actFoe.name.includes("U－奥尔加玛丽") && !actFoe.olgaSkillUsed) {
      const allySlotsEnemy = [];
      for (let i = 0; i < 6; i++) {
        if (enemyUnits[i].hp > 0) {
          enemyUnits[i].hp = Math.max(0, enemyUnits[i].hp - 20);
          allySlotsEnemy.push(enemySlots.children[i]);
        }
      }
      if (allySlotsEnemy.length > 0) await runOlgaAllyDamageEffect(allySlotsEnemy);
      appendLog(`敌方 U－奥尔加玛丽 发动技能：敌方全体扣除 20 HP。`);
      renderBattleArena();
      if (getBattleOutcome()) return;
      const playerSlotsToHit = [];
      for (let i = 0; i < 6; i++) {
        if (playerUnits[i].hp > 0) playerSlotsToHit.push(playerSlots.children[i]);
      }
      playerSlotsToHit.forEach((el) => el.classList.add("skill-olga-enemy-hit"));
      let hitJeanneOlga = false;
      for (let i = 0; i < 6; i++) {
        if (playerUnits[i].hp > 0) {
          const dmg = playerUnits[i].name.includes("贞德") ? 100 : 50;
          if (playerUnits[i].name.includes("贞德")) hitJeanneOlga = true;
          await applyDamageWithRevive(playerUnits[i], dmg, playerSlots.children[i], `己方「${playerUnits[i].name}」`);
        }
        if (getBattleOutcome()) break;
      }
      if (hitJeanneOlga) halveAttackerAtk(actFoe);
      await runOlgaEnemyHitEffect(playerSlotsToHit);
      actFoe.olgaSkillUsed = true;
      appendLog(`敌方 U－奥尔加玛丽 发动技能：对己方全体造成 50 点伤害。`);
      renderBattleArena();
      if (getBattleOutcome()) return;
    } else {
    // 敌方摩根：行动前发动一次
    if (actFoe.name.includes("摩根") && !actFoe.morganSkillUsed) {
      const otherAlive = getAliveEnemyIndices().filter((i) => i !== actEnemySlot);
      if (otherAlive.length > 0) {
        const sacrificeIdx = otherAlive[randInt(otherAlive.length)];
        const sacrifice = enemyUnits[sacrificeIdx];
        const bonus = 2 * (sacrifice.atkBase ?? sacrifice.atk);
        sacrifice.hp = 0;
        actFoe.atk = (actFoe.atkBase ?? actFoe.atk) + bonus;
        actFoe.morganSkillUsed = true;
        await runMorganSkillFlash(actEnemyEl);
        appendLog(`敌方 摩根 发动技能：敌方「${sacrifice.name}」血量归零，摩根获得 ${bonus} 点攻击力加成！`);
        renderBattleArena();
        if (getBattleOutcome()) return;
      }
    }

    actFoe.actionCount = (actFoe.actionCount || 0) + 1;
    const isEnemyOkitaSecond = actFoe.name.includes("冲田总司〔Alter〕") && actFoe.actionCount === 2;
    const isEnemySpaceIshtar = actFoe.name.includes("太空伊什塔尔");
    const enemyDamage = isEnemyOkitaSecond ? 999 : actFoe.atk;
    const alivePlayer = getAlivePlayerIndices();
    const jeannePlayerSlot = getJeanneSlot(playerUnits);
    if (isEnemySpaceIshtar) {
      const damagePer = Math.max(1, Math.floor(actFoe.atk * 0.5));
      const shuffled = alivePlayer.slice();
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = randInt(i + 1);
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      const targetIndices = shuffled.slice(0, 4);
      const targetSlots = targetIndices.map((i) => playerSlots.children[i]);
      await runSpaceIshtarLasers(actEnemyEl, targetSlots);
      let hitJeanne = false;
      const names = [];
      for (let i = 0; i < targetIndices.length; i++) {
        const idx = targetIndices[i];
        const me2 = playerUnits[idx];
        const slot = playerSlots.children[idx];
        if (me2.hp > 0) {
          slot.classList.add("skill-laser-hit");
          setTimeout(() => slot.classList.remove("skill-laser-hit"), 320);
          const d = me2.name.includes("贞德") ? damagePer * 2 : damagePer;
          await applyDamageWithRevive(me2, d, slot, `己方「${me2.name}」`);
          if (me2.name.includes("贞德")) hitJeanne = true;
          names.push(me2.name);
        }
        if (getBattleOutcome()) break;
      }
      if (hitJeanne) halveAttackerAtk(actFoe);
      appendLog(`敌方「${actFoe.name}」发动技能：对 ${names.length} 个目标各造成 ${damagePer} 点伤害（50%）。`);
    } else {
      const meTargetIndex = alivePlayer.length > 0
        ? (jeannePlayerSlot >= 0 ? jeannePlayerSlot : (hasAliveHolmes(enemyUnits) ? getLockedTargetPlayerIndex() : alivePlayer[randInt(alivePlayer.length)]))
        : -1;
      if (meTargetIndex >= 0) {
        const me2 = playerUnits[meTargetIndex];
        const playerTargetSlotNow = playerSlots.children[meTargetIndex];
        await runAttackAnimation(actEnemyEl, playerTargetSlotNow);
        if (isEnemyOkitaSecond) {
          appendLog(`敌方「${actFoe.name}」发动技能：秒杀！`);
          await runOkitaKillFlash(playerTargetSlotNow);
        } else {
          appendLog(`敌方「${actFoe.name}」攻击己方「${me2.name}」，造成 ${actFoe.atk} 点伤害。`);
        }
        const d = me2.name.includes("贞德") ? enemyDamage * 2 : enemyDamage;
        await applyDamageWithRevive(me2, d, playerTargetSlotNow, `己方「${me2.name}」`);
        if (me2.name.includes("贞德")) halveAttackerAtk(actFoe);
      }
    }
    if (getBattleOutcome()) return;
    renderBattleArena();

    if (actFoe.name.includes("织田信长")) {
      const playerSlotList = Array.from(playerSlots.children);
      await runShootToEnemies(actEnemyEl, playerSlotList);
      let hitJeanne = false;
      const shootTargets = [0, 1, 2, 3, 4, 5];
      for (const i of shootTargets) {
        if (playerUnits[i].hp > 0) {
          let dmg = 8 + randInt(5);
          if (playerUnits[i].name.includes("贞德")) { dmg *= 2; hitJeanne = true; }
          appendLog(`敌方 织田信长 技能：己方「${playerUnits[i].name}」受到 ${dmg} 点射击伤害。`);
          await applyDamageWithRevive(playerUnits[i], dmg, playerSlots.children[i], `己方「${playerUnits[i].name}」`);
        }
        if (getBattleOutcome()) return;
      }
      if (hitJeanne) halveAttackerAtk(actFoe);
      if (getBattleOutcome()) return;
      renderBattleArena();
    }

    if (actFoe.name.includes("提亚马特")) {
      actFoe.hp = Math.min(actFoe.maxHp, actFoe.hp + 20);
      const aliveEnemyForHeal = getAliveEnemyIndices().filter((i) => i !== actEnemySlot);
      if (aliveEnemyForHeal.length > 0) {
        const allyIdx = aliveEnemyForHeal[randInt(aliveEnemyForHeal.length)];
        const ally = enemyUnits[allyIdx];
        ally.hp = Math.min(ally.maxHp, ally.hp + 10);
        await runHealAnimation([actEnemyEl, enemySlots.children[allyIdx]]);
        appendLog(`敌方 提亚马特 技能：自身回复 20 HP，敌方「${ally.name}」回复 10 HP。`);
      } else {
        await runHealAnimation([actEnemyEl]);
        appendLog(`敌方 提亚马特 技能：自身回复 20 HP。`);
      }
      renderBattleArena();
    }

    if (actFoe.name.includes("莉莉丝")) {
      const alivePlayer2 = getAlivePlayerIndices();
      const jeannePlayerSlot2 = getJeanneSlot(playerUnits);
      const meTargetIndex2 = alivePlayer2.length > 0
        ? (jeannePlayerSlot2 >= 0 ? jeannePlayerSlot2 : (hasAliveHolmes(enemyUnits) ? getLockedTargetPlayerIndex() : alivePlayer2[randInt(alivePlayer2.length)]))
        : -1;
      if (meTargetIndex2 >= 0) {
        const me2 = playerUnits[meTargetIndex2];
        await runAttackAnimation(enemySlots.children[actEnemySlot], playerSlots.children[meTargetIndex2]);
        appendLog(`敌方 莉莉丝 技能：再次攻击己方「${me2.name}」，造成 ${actFoe.atk} 点伤害。`);
        const d2 = me2.name.includes("贞德") ? actFoe.atk * 2 : actFoe.atk;
        await applyDamageWithRevive(me2, d2, playerSlots.children[meTargetIndex2], `己方「${me2.name}」`);
        if (me2.name.includes("贞德")) halveAttackerAtk(actFoe);
      }
      if (getBattleOutcome()) return;
      renderBattleArena();
    }

    if (actFoe.name.includes("Kingprotea")) {
      actFoe.maxHp += 20;
      const heal = 10 + randInt(6);
      actFoe.hp = Math.min(actFoe.maxHp, actFoe.hp + heal);
      await runHealAnimation([actEnemyEl]);
      appendLog(`敌方 Kingprotea 技能：血量上限 +20，回复 ${heal} HP。`);
      renderBattleArena();
    }

    }
    } else {
      enemyConsumedSlot = enemyActSlot;
    }
    }
  }

  if (playerConsumedSlot !== null) {
    playerBattleIndex = (playerConsumedSlot + 1) % 6;
  }
  if (enemyConsumedSlot !== null) {
    enemyBattleIndex = (enemyConsumedSlot + 1) % 6;
  }
    renderBattleArena();
  } finally {
    renderBattleArena();
    const outcome = getBattleOutcome();
    if (outcome && !battleSettled) {
      showBattleSettlement(outcome === "win");
    }
    if (!outcome) {
      btnBattleNext.disabled = false;
    }
  }
}

function startBattle() {
  if (battleDeck.length !== 6) return;
  playerUnits = battleDeck.map((u) => ({
    ...u,
    hp: u.maxHp,
    actionCount: 0,
  }));
  enemyUnits = generateEnemyDeck();
  playerBattleIndex = 0;
  enemyBattleIndex = 0;
  battleSelectPhase.classList.add("hidden");
  battleFightPhase.classList.remove("hidden");
  battleTitle.textContent = "战斗";
  battleSettled = false;
  hideBattleSettlement();
  btnBattleNext.disabled = false;
  renderBattleArena();
  appendLog("战斗开始！");
  const caster = playerUnits.find((u) => u.name.includes("阿尔托莉雅·卡斯特"));
  if (caster) {
    const idx = randInt(6);
    const target = playerUnits[idx];
    target.atk = (target.atkBase || target.atk) * 2;
    target.buffedByCaster = true;
    appendLog(`阿尔托莉雅·卡斯特 发动技能：己方「${target.name}」攻击力翻倍！`);
    renderBattleArena();
  }
  const enemyCaster = enemyUnits.find((u) => u.name.includes("阿尔托莉雅·卡斯特"));
  if (enemyCaster) {
    const idx = randInt(6);
    const target = enemyUnits[idx];
    target.atk = (target.atkBase || target.atk) * 2;
    target.buffedByCaster = true;
    appendLog(`敌方 阿尔托莉雅·卡斯特 发动技能：敌方「${target.name}」攻击力翻倍！`);
    renderBattleArena();
  }
  const taigong = playerUnits.find((u) => u.name.includes("太公望"));
  if (taigong) {
    const idxs = [0, 1, 2, 3, 4, 5];
    if (idxs.length >= 2) {
      const i1 = randInt(idxs.length);
      let i2 = randInt(idxs.length);
      while (i2 === i1) i2 = randInt(idxs.length);
      const a = idxs[i1], b = idxs[i2];
      enemyUnits[a].skipNextTurn = 1;
      enemyUnits[b].skipNextTurn = 1;
      appendLog(`太公望 技能：敌方「${enemyUnits[a].name}」「${enemyUnits[b].name}」无法行动（闪电缠绕）。`);
    }
    renderBattleArena();
  }
  const enemyTaigong = enemyUnits.find((u) => u.name.includes("太公望"));
  if (enemyTaigong) {
    const idxs = [0, 1, 2, 3, 4, 5];
    if (idxs.length >= 2) {
      const i1 = randInt(idxs.length);
      let i2 = randInt(idxs.length);
      while (i2 === i1) i2 = randInt(idxs.length);
      const a = idxs[i1], b = idxs[i2];
      playerUnits[a].skipNextTurn = 1;
      playerUnits[b].skipNextTurn = 1;
      appendLog(`敌方 太公望 技能：己方「${playerUnits[a].name}」「${playerUnits[b].name}」无法行动（闪电缠绕）。`);
    }
    renderBattleArena();
  }
}

function openBattle() {
  battleDeck = [];
  battleSelectPhase.classList.remove("hidden");
  battleFightPhase.classList.add("hidden");
  battleTitle.textContent = "选择六人上阵（每名角色仅 1 人）";
  battleSettled = false;
  hideBattleSettlement();
  renderBattleSelectPhase();
  renderBattleInvItems();
  battleModal.classList.remove("hidden");
}

function closeBattle() {
  hideBattleSettlement();
  battleModal.classList.add("hidden");
}

function updateStatsUI() {
  statTotal.textContent = String(stats.total);
  stat3.textContent = String(stats[3]);
  stat4.textContent = String(stats[4]);
  stat5.textContent = String(stats[5]);
}

function clearUI() {
  grid.innerHTML = "";
  hint.style.display = "block";
}

function clearAll() {
  stats.total = 0;
  stats[3] = 0;
  stats[4] = 0;
  stats[5] = 0;
  updateStatsUI();
  clearUI();

  seedCatalog();
  renderInventory();
  clearPreview();
}

// ===== 抽卡逻辑 =====
function randInt(maxExclusive) {
  return Math.floor(Math.random() * maxExclusive);
}

function chooseRarity() {
  return 5;
}

function pickFromPool(rarity) {
  const arr = POOL[rarity];
  if (!arr || arr.length === 0) {
    return { name: "（空卡池）", url: "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg" };
  }
  return arr[randInt(arr.length)];
}

/** 界面用卡面样式（不区分星级展示） */
function rarityClass() {
  return "hero";
}

function renderCard({ name, url }) {
  const card = document.createElement("article");
  card.className = `card ${rarityClass()}`;

  const glow = document.createElement("div");
  glow.className = "glow";
  card.appendChild(glow);

  const imgWrap = document.createElement("div");
  imgWrap.className = "imgWrap";

  const img = document.createElement("img");
  img.alt = name;
  img.loading = "lazy";
  img.referrerPolicy = "no-referrer";
  img.src = url;
  img.onerror = () => {
    img.onerror = null;
    img.src = "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";
  };

  imgWrap.appendChild(img);
  card.appendChild(imgWrap);

  const meta = document.createElement("div");
  meta.className = "meta";
  const n = document.createElement("div");
  n.className = "name";
  n.textContent = name;
  meta.appendChild(n);
  card.appendChild(meta);

  return card;
}

function drawOnce() {
  const rarity = chooseRarity();
  const picked = pickFromPool(rarity);
  return { rarity, ...picked };
}

const MAX_DISPLAY_CARDS = 10; // 抽卡界面只显示最近 10 次结果

function applyResults(results) {
  hint.style.display = "none";
  // 新的一次抽卡放到最前面（最近结果在前）
  const fragment = document.createDocumentFragment();
  for (const r of results) fragment.appendChild(renderCard(r));
  grid.prepend(fragment);
  // 只保留前 10 张展示，超出部分移除
  while (grid.children.length > MAX_DISPLAY_CARDS) {
    grid.lastElementChild.remove();
  }

  for (const r of results) {
    stats.total += 1;
    stats[r.rarity] += 1;
    addToInventory(r);
  }
  updateStatsUI();
  renderInventory();
}

// ===== 交互 =====
let drawing = false;
function withLock(fn) {
  return async () => {
    if (drawing) return;
    drawing = true;
    btnSingle.disabled = true;
    btnTen.disabled = true;
    try {
      await fn();
    } finally {
      drawing = false;
      btnSingle.disabled = false;
      btnTen.disabled = false;
    }
  };
}

btnSingle.addEventListener(
  "click",
  withLock(async () => {
    applyResults([drawOnce()]);
  })
);

btnTen.addEventListener(
  "click",
  withLock(async () => {
    // 十连：逐张出卡，让动画更有“开包感”
    const results = [];
    for (let i = 0; i < 10; i++) {
      results.push(drawOnce());
    }
    applyResults(results);
  })
);

btnClear.addEventListener("click", clearAll);

function openInventory() {
  inventoryModal.classList.remove("hidden");
  renderInventory();
  // 如果当前有选中项，保持预览；否则显示空态
  if (selectedKey && inventory.has(selectedKey)) {
    renderPreview(inventory.get(selectedKey));
  } else {
    clearPreview();
  }
}

function closeInventory() {
  inventoryModal.classList.add("hidden");
}

// ===== 弹球娱乐模式 =====
let selectedBallCard = null; // { name, url }
let ballGameMode = "60"; // "60" | "infinite"
let ballGameLoopId = null;
let ballGameStartTime = 0;
let ballKeys = { ArrowLeft: false, ArrowRight: false, ArrowUp: false, ArrowDown: false };
const BALL_CARD_W = 84;
const BALL_CARD_H = 112;
const BALL_CARD_SPEED = 8;
const BALL_RADIUS = 18;
const BALL_BASE_SPEED = 3.6;

function openBallGame() {
  selectedBallCard = null;
  ballSelectPhase.classList.remove("hidden");
  ballModePhase.classList.add("hidden");
  ballGamePhase.classList.add("hidden");
  ballResult.classList.add("hidden");
  renderBallCardList();
  btnBallNextMode.disabled = true;
  ballModal.classList.remove("hidden");
}

function closeBallGame() {
  stopBallGameLoop();
  ballModal.classList.add("hidden");
}

function renderBallCardList() {
  ballCardList.innerHTML = "";
  const entries = Array.from(inventory.entries()).map(([key, v]) => ({ key, ...v }));
  entries.sort((a, b) => rarityOrderDesc(a, b));
  for (const e of entries) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "ballCardOption";
    btn.setAttribute("aria-label", e.name);
    const img = document.createElement("img");
    img.alt = e.name;
    img.referrerPolicy = "no-referrer";
    img.src = e.url;
    img.onerror = () => { img.onerror = null; img.src = "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"; };
    btn.appendChild(img);
    btn.addEventListener("click", () => {
      selectedBallCard = { name: e.name, url: e.url };
      ballCardList.querySelectorAll(".ballCardOption").forEach((el) => el.classList.remove("selected"));
      btn.classList.add("selected");
      btnBallNextMode.disabled = false;
    });
    ballCardList.appendChild(btn);
  }
}

function ballSelectMode() {
  ballSelectPhase.classList.add("hidden");
  ballModePhase.classList.remove("hidden");
}

function ballStartGame() {
  ballModePhase.classList.add("hidden");
  ballGamePhase.classList.remove("hidden");
  ballResult.classList.add("hidden");
  const arena = ballGameArena;
  const cardEl = ballGameCard;
  const ballsEl = ballGameBalls;
  ballsEl.innerHTML = "";
  cardEl.innerHTML = "";
  const img = document.createElement("img");
  img.alt = selectedBallCard.name;
  img.src = selectedBallCard.url;
  img.referrerPolicy = "no-referrer";
  cardEl.appendChild(img);

  const arenaW = ballGameArena.clientWidth || 680;
  const arenaH = ballGameArena.clientHeight || 380;
  let cardX = (arenaW - BALL_CARD_W) / 2;
  let cardY = arenaH - BALL_CARD_H - 20;
  const balls = [{ x: arenaW / 2, y: arenaH / 2, vx: BALL_BASE_SPEED * (Math.random() > 0.5 ? 1 : -1), vy: BALL_BASE_SPEED * (Math.random() > 0.5 ? 1 : -1), r: BALL_RADIUS, el: null }];
  ballGameStartTime = Date.now();

  function createBallEl(x, y, r) {
    const d = document.createElement("div");
    d.className = "ballGameBall";
    d.style.width = r * 2 + "px";
    d.style.height = r * 2 + "px";
    d.style.left = x + "px";
    d.style.top = y + "px";
    ballsEl.appendChild(d);
    return d;
  }
  balls.forEach((b) => { b.el = createBallEl(b.x, b.y, b.r); });

  function addNewBall() {
    const r = BALL_RADIUS;
    const margin = 50;
    let x, y;
    for (let try_ = 0; try_ < 30; try_++) {
      x = r + margin + Math.random() * (arenaW - 2 * (r + margin));
      y = r + margin + Math.random() * (arenaH - 2 * (r + margin));
      const cx = cardX + BALL_CARD_W / 2, cy = cardY + BALL_CARD_H / 2;
      const dist = Math.hypot(x - cx, y - cy);
      if (dist > BALL_CARD_W + BALL_CARD_H / 2 + r + 30) break;
    }
    const vx = (Math.random() - 0.5) * 2 * BALL_BASE_SPEED;
    const vy = (Math.random() - 0.5) * 2 * BALL_BASE_SPEED;
    const b = { x, y, vx, vy, r, el: null };
    b.el = createBallEl(b.x, b.y, b.r);
    balls.push(b);
  }

  function clampCard() {
    cardX = Math.max(0, Math.min(arenaW - BALL_CARD_W, cardX));
    cardY = Math.max(0, Math.min(arenaH - BALL_CARD_H, cardY));
  }

  function circleRectCollision(cx, cy, cr, rx, ry, rw, rh) {
    const px = Math.max(rx, Math.min(rx + rw, cx));
    const py = Math.max(ry, Math.min(ry + rh, cy));
    const distSq = (cx - px) ** 2 + (cy - py) ** 2;
    return distSq <= cr * cr;
  }

  function gameOver(won, elapsed) {
    stopBallGameLoop();
    ballResult.classList.remove("hidden");
    ballResultText.classList.remove("win", "lose");
    if (won) {
      ballResultText.textContent = "胜利！坚持了 60 秒！";
      ballResultText.classList.add("win");
    } else {
      ballResultText.textContent = `失败！坚持了 ${elapsed.toFixed(1)} 秒`;
      ballResultText.classList.add("lose");
    }
  }

  function tick() {
    const elapsed = (Date.now() - ballGameStartTime) / 1000;
    cardX += (ballKeys.ArrowRight ? BALL_CARD_SPEED : 0) - (ballKeys.ArrowLeft ? BALL_CARD_SPEED : 0);
    cardY += (ballKeys.ArrowDown ? BALL_CARD_SPEED : 0) - (ballKeys.ArrowUp ? BALL_CARD_SPEED : 0);
    clampCard();
    cardEl.style.left = cardX + "px";
    cardEl.style.top = cardY + "px";

    if (ballGameMode === "60" && elapsed >= 60) {
      gameOver(true, 60);
      return;
    }
    if (ballGameMode === "infinite") {
      const shouldHave = 1 + Math.floor(elapsed / 30);
      while (balls.length < shouldHave) addNewBall();
    }

    for (const b of balls) {
      b.x += b.vx;
      b.y += b.vy;
      if (b.x - b.r <= 0 || b.x + b.r >= arenaW) b.vx *= -1;
      if (b.y - b.r <= 0 || b.y + b.r >= arenaH) b.vy *= -1;
      b.x = Math.max(b.r, Math.min(arenaW - b.r, b.x));
      b.y = Math.max(b.r, Math.min(arenaH - b.r, b.y));
      if (b.el) {
        b.el.style.left = b.x + "px";
        b.el.style.top = b.y + "px";
      }
      if (circleRectCollision(b.x, b.y, b.r, cardX, cardY, BALL_CARD_W, BALL_CARD_H)) {
        gameOver(false, elapsed);
        return;
      }
    }

    ballTimer.textContent = elapsed.toFixed(1) + " 秒";
    ballBallsCount.textContent = ballGameMode === "infinite" ? `光球数：${balls.length}` : "";
  }

  ballGameLoopId = setInterval(tick, 1000 / 60);
  arena.focus();
}

function stopBallGameLoop() {
  if (ballGameLoopId != null) {
    clearInterval(ballGameLoopId);
    ballGameLoopId = null;
  }
}

function ballAgain() {
  ballResult.classList.add("hidden");
  ballGamePhase.classList.add("hidden");
  ballModePhase.classList.remove("hidden");
}

btnBall.addEventListener("click", openBallGame);
btnBallClose.addEventListener("click", closeBallGame);
document.addEventListener("keydown", (e) => {
  if (!ballModal || ballModal.classList.contains("hidden") || ballGamePhase.classList.contains("hidden")) return;
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
    ballKeys[e.key] = true;
    e.preventDefault();
  }
});
document.addEventListener("keyup", (e) => {
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) ballKeys[e.key] = false;
});
ballModal.addEventListener("click", (e) => {
  const t = e.target;
  if (t && t.getAttribute && t.getAttribute("data-close") === "ball") closeBallGame();
});
btnBallNextMode.addEventListener("click", ballSelectMode);
btnBallMode60.addEventListener("click", () => { ballGameMode = "60"; });
btnBallModeInfinite.addEventListener("click", () => { ballGameMode = "infinite"; });
btnBallStart.addEventListener("click", () => { if (selectedBallCard) ballStartGame(); });
btnBallAgain.addEventListener("click", ballAgain);

btnInventory.addEventListener("click", openInventory);
btnInventoryClose.addEventListener("click", closeInventory);

inventoryModal.addEventListener("click", (e) => {
  const t = e.target;
  if (t && t.getAttribute && t.getAttribute("data-close") === "1") closeInventory();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !inventoryModal.classList.contains("hidden")) closeInventory();
  if (e.key === "Escape" && !battleModal.classList.contains("hidden")) closeBattle();
  if (e.key === "Escape" && ballModal && !ballModal.classList.contains("hidden")) closeBallGame();
});

// 战斗
btnBattle.addEventListener("click", openBattle);
btnBattleClose.addEventListener("click", closeBattle);
battleModal.addEventListener("click", (e) => {
  const t = e.target;
  if (t && t.getAttribute && t.getAttribute("data-close") === "battle") closeBattle();
});
btnStartBattle.addEventListener("click", startBattle);
btnBattleNext.addEventListener("click", doOneTurn);
if (btnBattleSettleOk) {
  btnBattleSettleOk.addEventListener("click", () => closeBattle());
}

// init
updateStatsUI();
renderInventory();

