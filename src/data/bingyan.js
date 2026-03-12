/**
 * 兵演 · 道心争锋：原创卡牌规则。
 * 无费用、无场面。每回合双方各出一张牌，按「品级」与「三才」克制结算道心伤害，道心归零即败。
 */

export const BINGYAN_FACTIONS = [
  { id: 'fomen', name: '佛门', color: '#c4956a', dark: '#5c4632' },
  { id: 'mozong', name: '魔宗', color: '#8b5a9b', dark: '#3d2942' },
  { id: 'huangchao', name: '皇朝', color: '#c9a227', dark: '#5c4a1a' },
]

/** 三才：天、地、人。天克地，地克人，人克天 */
export const TALENTS = [
  { id: 'tian', name: '天' },
  { id: 'di', name: '地' },
  { id: 'ren', name: '人' },
]

const TALENT_ORDER = { tian: 0, di: 1, ren: 2 }
const BEATS = { tian: 'di', di: 'ren', ren: 'tian' }

function card(factionId, id, name, grade, talent) {
  return { id: `${factionId}_${id}`, name, factionId, grade, talent }
}

// 品级 1~5，三才 天/地/人
const FOMEN_CARDS = [
  card('fomen', 'c1', '禅心', 1, 'tian'),
  card('fomen', 'c2', '莲华', 1, 'di'),
  card('fomen', 'c3', '渡世', 2, 'ren'),
  card('fomen', 'c4', '金刚咒', 2, 'tian'),
  card('fomen', 'c5', '净土', 2, 'di'),
  card('fomen', 'c6', '般若', 3, 'ren'),
  card('fomen', 'c7', '罗汉意', 3, 'tian'),
  card('fomen', 'c8', '轮回', 3, 'di'),
  card('fomen', 'c9', '明王念', 4, 'ren'),
  card('fomen', 'c10', '菩萨愿', 4, 'tian'),
  card('fomen', 'c11', '菩提', 5, 'di'),
  card('fomen', 'c12', '涅槃', 5, 'ren'),
]

const MOZONG_CARDS = [
  card('mozong', 'c1', '血噬', 1, 'ren'),
  card('mozong', 'c2', '魔种', 1, 'tian'),
  card('mozong', 'c3', '咒怨', 2, 'di'),
  card('mozong', 'c4', '煞气', 2, 'ren'),
  card('mozong', 'c5', '魔焰', 2, 'tian'),
  card('mozong', 'c6', '噬魂', 3, 'di'),
  card('mozong', 'c7', '血尊印', 3, 'ren'),
  card('mozong', 'c8', '玄火', 3, 'tian'),
  card('mozong', 'c9', '夺魄', 4, 'di'),
  card('mozong', 'c10', '魔渊', 4, 'ren'),
  card('mozong', 'c11', '血海', 5, 'tian'),
  card('mozong', 'c12', '灭世', 5, 'di'),
]

const HUANGCHAO_CARDS = [
  card('huangchao', 'c1', '号令', 1, 'di'),
  card('huangchao', 'c2', '龙气', 1, 'ren'),
  card('huangchao', 'c3', '军阵', 2, 'tian'),
  card('huangchao', 'c4', '御驾', 2, 'di'),
  card('huangchao', 'c5', '国运', 2, 'ren'),
  card('huangchao', 'c6', '天子剑', 3, 'tian'),
  card('huangchao', 'c7', '征伐', 3, 'di'),
  card('huangchao', 'c8', '圣旨', 3, 'ren'),
  card('huangchao', 'c9', '龙旗', 4, 'tian'),
  card('huangchao', 'c10', '镇国', 4, 'di'),
  card('huangchao', 'c11', '天命', 5, 'ren'),
  card('huangchao', 'c12', '中州', 5, 'tian'),
]

const POOLS = {
  fomen: FOMEN_CARDS,
  mozong: MOZONG_CARDS,
  huangchao: HUANGCHAO_CARDS,
}

/** 构建牌库：阵营内随机 15 张（可重复），洗牌 */
export function buildDeck(factionId) {
  const pool = POOLS[factionId] || []
  const deck = []
  for (let i = 0; i < 15; i++) {
    deck.push(pool[Math.floor(Math.random() * pool.length)])
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

/**
 * 结算本回合：双方各出一张牌（或不出）。
 * 不出：无伤害。
 * 出牌：若 A 克 B，则 B 道心 - A品级；若 B 克 A，则 A 道心 - B品级；若同才，则品级高者对低者造成 (高-低) 伤害。
 * 返回 { playerDamage, opponentDamage }（本回合玩家与对方各自受到的伤害）
 */
export function resolveRound(playerCard, opponentCard) {
  if (!playerCard && !opponentCard) return { playerDamage: 0, opponentDamage: 0 }
  if (!playerCard) return { playerDamage: opponentCard.grade ?? 0, opponentDamage: 0 }
  if (!opponentCard) return { playerDamage: 0, opponentDamage: playerCard.grade ?? 0 }
  const pT = playerCard.talent
  const oT = opponentCard.talent
  const pG = playerCard.grade ?? 0
  const oG = opponentCard.grade ?? 0
  const playerBeats = BEATS[pT] === oT
  const opponentBeats = BEATS[oT] === pT
  if (playerBeats && !opponentBeats) return { playerDamage: 0, opponentDamage: pG }
  if (opponentBeats && !playerBeats) return { playerDamage: oG, opponentDamage: 0 }
  if (pG > oG) return { playerDamage: 0, opponentDamage: pG - oG }
  if (oG > pG) return { playerDamage: oG - pG, opponentDamage: 0 }
  return { playerDamage: 0, opponentDamage: 0 }
}

export function getTalentName(talentId) {
  return TALENTS.find((t) => t.id === talentId)?.name ?? talentId
}

export function getEffectText(card) {
  if (!card) return ''
  return getTalentName(card.talent)
}
