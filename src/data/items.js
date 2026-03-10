/**
 * 道具类别与丹药定义
 */

export const ITEM_TYPES = {
  WEAPON: 'weapon',
  ARMOR: 'armor',
  PILL: 'pill',
}

export const EQUIPMENT_SLOTS = {
  WEAPON: Array(5).fill(null).map((_, i) => ({ slotIndex: i, type: ITEM_TYPES.WEAPON })),
  ARMOR: Array(5).fill(null).map((_, i) => ({ slotIndex: i, type: ITEM_TYPES.ARMOR })),
}

/** 丹药品级颜色 一品~九品 */
export const PILL_GRADE_COLORS = {
  1: '#9e9e9e',   // 灰
  2: '#8d6e63',   // 棕
  3: '#ff8a65',   // 橙
  4: '#ffd54f',   // 黄
  5: '#81c784',   // 绿
  6: '#4fc3f7',   // 蓝
  7: '#9575cd',   // 紫
  8: '#f06292',   // 粉
  9: '#ffeb3b',   // 金
}

/** 丹药基础价格：品级 -> [收购价, 售价] */
const GRADE_PRICES = {
  1: [50, 100],
  2: [200, 400],
  3: [800, 1600],
  4: [3200, 6400],
  5: [12800, 25600],
  6: [51200, 102400],
  7: [204800, 409600],
  8: [819200, 1638400],
  9: [3276800, 6553600],
}

/** 丹药定义：提升大境界突破成功率 +5% */
export const PILLS = {
  'zhuji_dan': { id: 'zhuji_dan', name: '筑基丹', grade: 1, realmIndex: 1 },    // 筑基
  'yuanshen_dan': { id: 'yuanshen_dan', name: '元神丹', grade: 2, realmIndex: 2 }, // 金丹
  'yuanying_dan': { id: 'yuanying_dan', name: '元婴丹', grade: 4, realmIndex: 3 }, // 元婴
  'huashen_dan': { id: 'huashen_dan', name: '化神丹', grade: 5, realmIndex: 4 },  // 化神
  'heti_dan': { id: 'heti_dan', name: '合体丹', grade: 6, realmIndex: 5 },       // 合体
  'dujie_dan': { id: 'dujie_dan', name: '渡劫丹', grade: 7, realmIndex: 6 },     // 渡劫
  'dacheng_dan': { id: 'dacheng_dan', name: '大乘丹', grade: 8, realmIndex: 7 }, // 大乘
}

export const PILL_IDS = Object.keys(PILLS)

/** 法宝定义：品级 1-9，攻击加成，高品可附加特殊属性（1-2品暂无） */
export const WEAPONS = {
  'shuijing_biao': { id: 'shuijing_biao', name: '水晶镖', grade: 1, attackBonus: 8 },
  'shuijing_bian': { id: 'shuijing_bian', name: '水晶鞭', grade: 2, attackBonus: 15 },
  'jin_chui': { id: 'jin_chui', name: '金锤', grade: 1, attackBonus: 12 },
  'yu_mao': { id: 'yu_mao', name: '玉矛', grade: 2, attackBonus: 18 },
  'yu_zhao': { id: 'yu_zhao', name: '玉爪', grade: 1, attackBonus: 6 },
  'gu_qiang': { id: 'gu_qiang', name: '骨枪', grade: 1, attackBonus: 10 },
  'tie_zhao': { id: 'tie_zhao', name: '铁爪', grade: 1, attackBonus: 7 },
  'shi_chui': { id: 'shi_chui', name: '石锤', grade: 1, attackBonus: 11 },
  'yu_jian': { id: 'yu_jian', name: '玉剑', grade: 2, attackBonus: 16 },
  'shuijing_dao': { id: 'shuijing_dao', name: '水晶刀', grade: 2, attackBonus: 14 },
}

export const WEAPON_IDS = Object.keys(WEAPONS)

/** 防具定义：品级 1-9，血量加成 */
const ARMOR_GRADE_PRICES = {
  1: [25, 60],
  2: [100, 250],
}

export const ARMORS = {
  'bu_yi': { id: 'bu_yi', name: '布衣', grade: 1, hpBonus: 20 },
  'pi_jia': { id: 'pi_jia', name: '皮甲', grade: 1, hpBonus: 35 },
  'tie_jia': { id: 'tie_jia', name: '铁甲', grade: 2, hpBonus: 55 },
  'yu_yi': { id: 'yu_yi', name: '玉衣', grade: 2, hpBonus: 50 },
  'shuijing_jia': { id: 'shuijing_jia', name: '水晶甲', grade: 2, hpBonus: 60 },
}

export const ARMOR_IDS = Object.keys(ARMORS)

export function getArmor(id) {
  return ARMORS[id]
}

export function getArmorHpBonus(armorOrId) {
  const a = typeof armorOrId === 'string' ? ARMORS[armorOrId] : armorOrId
  return a?.hpBonus ?? 0
}

export function getArmorSellPrice(itemId) {
  const a = ARMORS[itemId]
  if (!a) return 0
  return ARMOR_GRADE_PRICES[a.grade]?.[0] ?? 0
}

export function getArmorBuyPrice(itemId) {
  const a = ARMORS[itemId]
  if (!a) return 0
  return ARMOR_GRADE_PRICES[a.grade]?.[1] ?? 0
}

/** 藏宝阁可刷新出的所有商品 id（丹药+法宝+防具） */
export const SHOP_ITEM_IDS = [...PILL_IDS, ...WEAPON_IDS, ...ARMOR_IDS]

/** 任意商品的购买价 */
export function getItemBuyPrice(itemId) {
  return getPillBuyPrice(itemId) || getWeaponBuyPrice(itemId) || getArmorBuyPrice(itemId)
}

/** 法宝收购/售价（按品级） */
const WEAPON_GRADE_PRICES = {
  1: [30, 80],
  2: [120, 300],
}

export function getWeapon(id) {
  return WEAPONS[id]
}

export function getWeaponAttackBonus(weaponOrId) {
  const w = typeof weaponOrId === 'string' ? WEAPONS[weaponOrId] : weaponOrId
  return w?.attackBonus ?? 0
}

export function getWeaponSellPrice(itemId) {
  const w = WEAPONS[itemId]
  if (!w) return 0
  return WEAPON_GRADE_PRICES[w.grade]?.[0] ?? 0
}

export function getWeaponBuyPrice(itemId) {
  const w = WEAPONS[itemId]
  if (!w) return 0
  return WEAPON_GRADE_PRICES[w.grade]?.[1] ?? 0
}

/** 根据目标境界索引获取对应突破丹药 id（1=筑基 2=金丹 ... 7=大乘） */
export function getPillIdForRealm(realmIndex) {
  const entry = Object.entries(PILLS).find(([, p]) => p.realmIndex === realmIndex)
  return entry ? entry[0] : null
}

export function getPill(id) {
  return PILLS[id]
}

export function getItemById(itemId) {
  if (PILLS[itemId]) return { ...PILLS[itemId], type: ITEM_TYPES.PILL }
  if (WEAPONS[itemId]) return { ...WEAPONS[itemId], type: ITEM_TYPES.WEAPON }
  if (ARMORS[itemId]) return { ...ARMORS[itemId], type: ITEM_TYPES.ARMOR }
  return null
}

export function getPillGradeColor(grade) {
  return PILL_GRADE_COLORS[grade] ?? '#9e9e9e'
}

export function getPillSellPrice(itemId) {
  const pill = PILLS[itemId]
  if (!pill) return 0
  return GRADE_PRICES[pill.grade]?.[0] ?? 0
}

export function getPillBuyPrice(itemId) {
  const pill = PILLS[itemId]
  if (!pill) return 0
  return GRADE_PRICES[pill.grade]?.[1] ?? 0
}

export function getItemSellPrice(itemOrId) {
  if (typeof itemOrId === 'string') {
    return getPillSellPrice(itemOrId) || getWeaponSellPrice(itemOrId) || getArmorSellPrice(itemOrId)
  }
  return itemOrId?.sellPrice ?? getPillSellPrice(itemOrId?.id) ?? getWeaponSellPrice(itemOrId?.id) ?? getArmorSellPrice(itemOrId?.id) ?? 0
}

/** 背包格式：{ [itemId]: count } 或 兼容旧格式 */
export function normalizeInventory(inv) {
  if (!inv) return {}
  if (Array.isArray(inv)) {
    const out = {}
    for (const slot of inv) {
      if (slot && (slot.id || slot.itemId)) {
        const id = slot.id ?? slot.itemId
        const count = slot.count ?? 1
        out[id] = (out[id] ?? 0) + count
      }
    }
    return out
  }
  return typeof inv === 'object' ? inv : {}
}

/** 转换为展示用的数组 [{ itemId, count }]，按 itemId 排序保证分页稳定 */
export function inventoryToStacks(inv) {
  const normalized = normalizeInventory(inv)
  return Object.entries(normalized)
    .filter(([, c]) => c > 0)
    .map(([itemId, count]) => ({ itemId, count }))
    .sort((a, b) => a.itemId.localeCompare(b.itemId))
}

const MAX_INVENTORY_SLOTS = 600

/** 添加道具到背包，返回新背包。同种道具堆叠 */
export function addToInventory(inv, itemId, count = 1) {
  const cur = normalizeInventory(inv)
  const stacks = inventoryToStacks(cur)
  if (stacks.length >= MAX_INVENTORY_SLOTS && !cur[itemId]) return cur
  return { ...cur, [itemId]: (cur[itemId] ?? 0) + count }
}

/** 从背包移除道具 */
export function removeFromInventory(inv, itemId, count = 1) {
  const cur = normalizeInventory(inv)
  const now = (cur[itemId] ?? 0) - count
  if (now <= 0) {
    const next = { ...cur }
    delete next[itemId]
    return next
  }
  return { ...cur, [itemId]: now }
}
