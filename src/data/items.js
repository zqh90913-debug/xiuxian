/**
 * 道具类别与丹药定义
 */

export const ITEM_TYPES = {
  WEAPON: 'weapon',
  ARMOR: 'armor',
  PILL: 'pill',
  MATERIAL: 'material',
  FURNACE: 'furnace',
  RECIPE: 'recipe',
}

export const EQUIPMENT_SLOTS = {
  WEAPON: Array(4).fill(null).map((_, i) => ({ slotIndex: i, type: ITEM_TYPES.WEAPON })),
  ARMOR: Array(4).fill(null).map((_, i) => ({ slotIndex: i, type: ITEM_TYPES.ARMOR })),
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
  10: '#ef5350',
  11: '#26a69a',
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
  10: [13107200, 26214400],
  11: [52428800, 104857600],
}

/** 丹药定义：大境界突破使用破境丹；部分为直接使用（增加修为等） */
export const PILLS = {
  'pojing_dan_1': { id: 'pojing_dan_1', name: '一阶破境丹', grade: 2, realmIndex: 12 },
  'pojing_dan_2': { id: 'pojing_dan_2', name: '二阶破境丹', grade: 3, realmIndex: 17 },
  'pojing_dan_3': { id: 'pojing_dan_3', name: '三阶破境丹', grade: 4, realmIndex: 28 },
  'pojing_dan_4': { id: 'pojing_dan_4', name: '四阶破境丹', grade: 5, realmIndex: 32 },
  'pojing_dan_5': { id: 'pojing_dan_5', name: '五阶破境丹', grade: 6, realmIndex: 37 },
  'pojing_dan_6': { id: 'pojing_dan_6', name: '六阶破境丹', grade: 6, realmIndex: 42 },
  'pojing_dan_7': { id: 'pojing_dan_7', name: '七阶破境丹', grade: 7, realmIndex: 43 },
  'pojing_dan_8': { id: 'pojing_dan_8', name: '八阶破境丹', grade: 7, realmIndex: 44 },
  'pojing_dan_9': { id: 'pojing_dan_9', name: '九阶破境丹', grade: 8, realmIndex: 45 },
  'pojing_dan_10': { id: 'pojing_dan_10', name: '十阶破境丹', grade: 8, realmIndex: 46 },
  'pojing_dan_11': { id: 'pojing_dan_11', name: '十一阶破境丹', grade: 9, realmIndex: 47 },
  'yanghun_dan': { id: 'yanghun_dan', name: '养魂丹', grade: 1, directUse: true, cultivationGain: 500 },
  'yanghun_jingdan': { id: 'yanghun_jingdan', name: '养魂精丹', grade: 3, directUse: true, cultivationGain: 5000 },
  'dahuan_dan': { id: 'dahuan_dan', name: '大还丹', grade: 5, directUse: true, cultivationGain: 50000 },
  'puti_dahuan_dan': { id: 'puti_dahuan_dan', name: '菩提大还丹', grade: 7, directUse: true, cultivationGain: 500000 },
  'qiankun_zaohua_dan': { id: 'qiankun_zaohua_dan', name: '乾坤造化丹', grade: 9, directUse: true, fillCurrentRealm: true },
  'cuiti_dan': { id: 'cuiti_dan', name: '淬体丹', grade: 1, directUse: true },
  'longli_dan': { id: 'longli_dan', name: '龙力丹', grade: 2, directUse: true },
  'shenxing_dan': { id: 'shenxing_dan', name: '神行丹', grade: 2, directUse: true },
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
  1: [40, 90],
  2: [150, 320],
}

/** 防具：仅增加血量，品级越高加成越多；随机分配具体数值 */
export const ARMORS = {
  // 一品
  'yin_jia': { id: 'yin_jia', name: '银甲', grade: 1, hpBonus: 48 },
  'shi_jia': { id: 'shi_jia', name: '石甲', grade: 1, hpBonus: 62 },
  'mu_jia': { id: 'mu_jia', name: '木甲', grade: 1, hpBonus: 55 },
  // 二品（高于一品）
  'liuli_jia': { id: 'liuli_jia', name: '琉璃甲', grade: 2, hpBonus: 98 },
  'tie_jia': { id: 'tie_jia', name: '铁甲', grade: 2, hpBonus: 115 },
  'jin_jia': { id: 'jin_jia', name: '金甲', grade: 2, hpBonus: 128 },
}

export const ARMOR_IDS = Object.keys(ARMORS)

/** 炼丹材料：tier 1 初级(1-3品丹) tier 2 中级(4-6品) tier 3 高级(7-9品)；商店刷新为 10 个/次 */
const MATERIAL_TIER_PRICES = {
  1: [3, 30],   // [单件收购价, 10件售价]
  2: [10, 100],
  3: [35, 350],
}
export const MATERIALS = {
  // 低级
  'wu_sha': { id: 'wu_sha', name: '钨砂', tier: 1 },
  'chi_yu': { id: 'chi_yu', name: '赤玉', tier: 1 },
  'zi_tong': { id: 'zi_tong', name: '紫铜', tier: 1 },
  'yun_tie': { id: 'yun_tie', name: '陨铁', tier: 1 },
  'gu_yin': { id: 'gu_yin', name: '古银', tier: 1 },
  'mi_yu': { id: 'mi_yu', name: '秘玉', tier: 1 },
  'wu_jing': { id: 'wu_jing', name: '乌晶', tier: 1 },
  'xuan_tie': { id: 'xuan_tie', name: '玄铁', tier: 1 },
  'ling_shui': { id: 'ling_shui', name: '灵水', tier: 1 },
  // 中级
  'chi_mo_tie': { id: 'chi_mo_tie', name: '赤魔铁', tier: 2 },
  'zi_xuan_shi': { id: 'zi_xuan_shi', name: '紫玄石', tier: 2 },
  'an_jing_tie': { id: 'an_jing_tie', name: '暗精铁', tier: 2 },
  'chi_gui_jin': { id: 'chi_gui_jin', name: '赤鬼金', tier: 2 },
  'qing_gu_sha': { id: 'qing_gu_sha', name: '青古砂', tier: 2 },
  'yang_hun_hua': { id: 'yang_hun_hua', name: '养魂花', tier: 2 },
  'fu_yun_guo': { id: 'fu_yun_guo', name: '拂云果', tier: 2 },
  'di_nv_lu': { id: 'di_nv_lu', name: '帝女露', tier: 2 },
  'wu_gu_xu': { id: 'wu_gu_xu', name: '乌古须', tier: 2 },
  // 高级
  'xuan_yin_chi_gui_jin': { id: 'xuan_yin_chi_gui_jin', name: '玄阴赤鬼金', tier: 3 },
  'jin_sha_tong': { id: 'jin_sha_tong', name: '金砂铜', tier: 3 },
  'qi_sha_gu_ma_nao': { id: 'qi_sha_gu_ma_nao', name: '七杀古玛瑙', tier: 3 },
  'xi_sui_wu_shi': { id: 'xi_sui_wu_shi', name: '洗髓乌石', tier: 3 },
  'yun_yu_bi_zhen_mu': { id: 'yun_yu_bi_zhen_mu', name: '陨玉碧真木', tier: 3 },
  'wu_ding_bi_bao_shen': { id: 'wu_ding_bi_bao_shen', name: '无定碧宝参', tier: 3 },
  'qi_qiao_wu_mi_shui_jing': { id: 'qi_qiao_wu_mi_shui_jing', name: '七巧乌秘水晶', tier: 3 },
}
export const MATERIAL_IDS = Object.keys(MATERIALS)

/** 丹炉 1-9 品：一品 +5% 炼制成功率，每升一品 +3%；可在商店刷新 */
const FURNACE_GRADE_PRICES = {
  1: [20, 80],
  2: [80, 250],
  3: [200, 600],
  4: [500, 1500],
  5: [1200, 3600],
  6: [3000, 9000],
  7: [7500, 22000],
  8: [18000, 55000],
  9: [45000, 130000],
}
export const FURNACES = {
  'furnace_1': { id: 'furnace_1', name: '一品丹炉', grade: 1, successBonus: 5 },
  'furnace_2': { id: 'furnace_2', name: '二品丹炉', grade: 2, successBonus: 8 },
  'furnace_3': { id: 'furnace_3', name: '三品丹炉', grade: 3, successBonus: 11 },
  'furnace_4': { id: 'furnace_4', name: '四品丹炉', grade: 4, successBonus: 14 },
  'furnace_5': { id: 'furnace_5', name: '五品丹炉', grade: 5, successBonus: 17 },
  'furnace_6': { id: 'furnace_6', name: '六品丹炉', grade: 6, successBonus: 20 },
  'furnace_7': { id: 'furnace_7', name: '七品丹炉', grade: 7, successBonus: 23 },
  'furnace_8': { id: 'furnace_8', name: '八品丹炉', grade: 8, successBonus: 26 },
  'furnace_9': { id: 'furnace_9', name: '九品丹炉', grade: 9, successBonus: 29 },
}
export const FURNACE_IDS = Object.keys(FURNACES)

/** 丹方：使用后解锁对应丹药的炼制；可在商店刷新 */
export const RECIPE_SCROLLS = {
  'recipe_pojing_1': { id: 'recipe_pojing_1', name: '一阶破境丹方', pillId: 'pojing_dan_1' },
  'recipe_pojing_2': { id: 'recipe_pojing_2', name: '二阶破境丹方', pillId: 'pojing_dan_2' },
  'recipe_pojing_3': { id: 'recipe_pojing_3', name: '三阶破境丹方', pillId: 'pojing_dan_3' },
  'recipe_pojing_4': { id: 'recipe_pojing_4', name: '四阶破境丹方', pillId: 'pojing_dan_4' },
  'recipe_pojing_5': { id: 'recipe_pojing_5', name: '五阶破境丹方', pillId: 'pojing_dan_5' },
  'recipe_pojing_6': { id: 'recipe_pojing_6', name: '六阶破境丹方', pillId: 'pojing_dan_6' },
  'recipe_pojing_7': { id: 'recipe_pojing_7', name: '七阶破境丹方', pillId: 'pojing_dan_7' },
  'recipe_pojing_8': { id: 'recipe_pojing_8', name: '八阶破境丹方', pillId: 'pojing_dan_8' },
  'recipe_pojing_9': { id: 'recipe_pojing_9', name: '九阶破境丹方', pillId: 'pojing_dan_9' },
  'recipe_pojing_10': { id: 'recipe_pojing_10', name: '十阶破境丹方', pillId: 'pojing_dan_10' },
  'recipe_pojing_11': { id: 'recipe_pojing_11', name: '十一阶破境丹方', pillId: 'pojing_dan_11' },
  'recipe_yanghun': { id: 'recipe_yanghun', name: '养魂丹方', pillId: 'yanghun_dan' },
  'recipe_yanghun_jing': { id: 'recipe_yanghun_jing', name: '养魂精丹方', pillId: 'yanghun_jingdan' },
  'recipe_dahuan': { id: 'recipe_dahuan', name: '大还丹方', pillId: 'dahuan_dan' },
  'recipe_puti_dahuan': { id: 'recipe_puti_dahuan', name: '菩提大还丹方', pillId: 'puti_dahuan_dan' },
  'recipe_qiankun_zaohua': { id: 'recipe_qiankun_zaohua', name: '乾坤造化丹方', pillId: 'qiankun_zaohua_dan' },
  'recipe_cuiti': { id: 'recipe_cuiti', name: '淬体丹方', pillId: 'cuiti_dan' },
  'recipe_longli': { id: 'recipe_longli', name: '龙力丹方', pillId: 'longli_dan' },
  'recipe_shenxing': { id: 'recipe_shenxing', name: '神行丹方', pillId: 'shenxing_dan' },
}
export const RECIPE_IDS = Object.keys(RECIPE_SCROLLS)
const RECIPE_BUY_PRICES = {
  'recipe_pojing_1': 200,
  'recipe_pojing_2': 500,
  'recipe_pojing_3': 1200,
  'recipe_pojing_4': 2600,
  'recipe_pojing_5': 5200,
  'recipe_pojing_6': 11000,
  'recipe_pojing_7': 22000,
  'recipe_pojing_8': 45000,
  'recipe_pojing_9': 90000,
  'recipe_pojing_10': 180000,
  'recipe_pojing_11': 360000,
  'recipe_yanghun': 300,
  'recipe_yanghun_jing': 800,
  'recipe_dahuan': 5000,
  'recipe_puti_dahuan': 30000,
  'recipe_qiankun_zaohua': 120000,
  'recipe_cuiti': 500,
  'recipe_longli': 1500,
  'recipe_shenxing': 1500,
}
export function getRecipeScrollBuyPrice(itemId) {
  return RECIPE_BUY_PRICES[itemId] ?? 0
}

export function getMaterialBuyPrice(itemId) {
  const m = MATERIALS[itemId]
  if (!m) return 0
  return MATERIAL_TIER_PRICES[m.tier]?.[1] ?? 0
}
export function getMaterialSellPrice(itemId) {
  const m = MATERIALS[itemId]
  if (!m) return 0
  return MATERIAL_TIER_PRICES[m.tier]?.[0] ?? 0
}
export function getFurnaceBuyPrice(itemId) {
  const f = FURNACES[itemId]
  if (!f) return 0
  return FURNACE_GRADE_PRICES[f.grade]?.[1] ?? 0
}
export function getFurnaceSellPrice(itemId) {
  const f = FURNACES[itemId]
  if (!f) return 0
  return FURNACE_GRADE_PRICES[f.grade]?.[0] ?? 0
}
/** 商店购买材料时一次获得的个数 */
export const MATERIAL_SHOP_COUNT = 10

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

/** 藏宝阁可刷新出的所有商品 id（仅丹方、法宝、防具、材料、丹炉；不包含丹药） */
export const SHOP_ITEM_IDS = [...WEAPON_IDS, ...ARMOR_IDS, ...MATERIAL_IDS, ...FURNACE_IDS, ...RECIPE_IDS]

/** 任意商品的购买价（材料为 10 件价格） */
export function getItemBuyPrice(itemId) {
  return getPillBuyPrice(itemId) || getWeaponBuyPrice(itemId) || getArmorBuyPrice(itemId) || getMaterialBuyPrice(itemId) || getFurnaceBuyPrice(itemId) || getRecipeScrollBuyPrice(itemId)
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

export function getPillIdForRealm(realmIndex) {
  const entry = Object.entries(PILLS).find(([, p]) => p.realmIndex === realmIndex)
  return entry ? entry[0] : null
}

export function getPill(id) {
  return PILLS[id]
}

/** 直接使用类丹药增加的修为（如养魂丹），无则返回 0 */
export function getPillCultivationGain(itemId) {
  const p = PILLS[itemId]
  return (p && p.directUse && p.cultivationGain) ? p.cultivationGain : 0
}

export function getItemById(itemId) {
  if (PILLS[itemId]) return { ...PILLS[itemId], type: ITEM_TYPES.PILL }
  if (WEAPONS[itemId]) return { ...WEAPONS[itemId], type: ITEM_TYPES.WEAPON }
  if (ARMORS[itemId]) return { ...ARMORS[itemId], type: ITEM_TYPES.ARMOR }
  if (MATERIALS[itemId]) return { ...MATERIALS[itemId], type: ITEM_TYPES.MATERIAL }
  if (FURNACES[itemId]) return { ...FURNACES[itemId], type: ITEM_TYPES.FURNACE }
  if (RECIPE_SCROLLS[itemId]) return { ...RECIPE_SCROLLS[itemId], type: ITEM_TYPES.RECIPE }
  return null
}

/** 获取展示用品级文字，如「一品」「二品」 */
export function getGradeLabel(grade) {
  switch (grade) {
    case 1: return '一品'
    case 2: return '二品'
    case 3: return '三品'
    case 4: return '四品'
    case 5: return '五品'
    case 6: return '六品'
    case 7: return '七品'
    case 8: return '八品'
    case 9: return '九品'
    case 10: return '十品'
    case 11: return '十一品'
    default: return ''
  }
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
    return getPillSellPrice(itemOrId) || getWeaponSellPrice(itemOrId) || getArmorSellPrice(itemOrId) || getMaterialSellPrice(itemOrId) || getFurnaceSellPrice(itemOrId)
  }
  return itemOrId?.sellPrice ?? getPillSellPrice(itemOrId?.id) ?? getWeaponSellPrice(itemOrId?.id) ?? getArmorSellPrice(itemOrId?.id) ?? getMaterialSellPrice(itemOrId?.id) ?? getFurnaceSellPrice(itemOrId?.id) ?? 0
}

/** 背包格式：{ [itemId]: count } 或 兼容旧格式 */
export function normalizeInventory(inv) {
  if (!inv) return {}
  if (Array.isArray(inv)) {
    const out = {}
    for (const slot of inv) {
      if (slot && (slot.id || slot.itemId)) {
        const id = slot.id ?? slot.itemId
        if (!getItemById(id)) continue
        const count = slot.count ?? 1
        out[id] = (out[id] ?? 0) + count
      }
    }
    return out
  }
  if (typeof inv !== 'object') return {}
  return Object.fromEntries(
    Object.entries(inv).filter(([itemId, count]) => count > 0 && getItemById(itemId)),
  )
}

const TYPE_ORDER = {
  [ITEM_TYPES.PILL]: 0,
  [ITEM_TYPES.WEAPON]: 1,
  [ITEM_TYPES.ARMOR]: 2,
  [ITEM_TYPES.MATERIAL]: 3,
  [ITEM_TYPES.FURNACE]: 4,
  [ITEM_TYPES.RECIPE]: 5,
}

function getSortInfo(itemId) {
  const item = getItemById(itemId)
  const type = item?.type
  const typeRank = TYPE_ORDER[type] ?? 99
  let grade = 0
  if (item) {
    if (item.grade != null) {
      grade = item.grade
    } else if (type === ITEM_TYPES.MATERIAL && item.tier != null) {
      grade = item.tier
    } else if (type === ITEM_TYPES.RECIPE && item.pillId) {
      const pill = getItemById(item.pillId)
      if (pill?.grade != null) grade = pill.grade
    }
  }
  return { typeRank, grade, itemId }
}

/** 转换为展示用的数组 [{ itemId, count }]，按类别与品级排序 */
export function inventoryToStacks(inv) {
  const normalized = normalizeInventory(inv)
  return Object.entries(normalized)
    .filter(([, c]) => c > 0)
    .map(([itemId, count]) => ({ itemId, count }))
    .sort((a, b) => {
      const sa = getSortInfo(a.itemId)
      const sb = getSortInfo(b.itemId)
      if (sa.typeRank !== sb.typeRank) return sa.typeRank - sb.typeRank
      if (sa.grade !== sb.grade) return sb.grade - sa.grade
      return sa.itemId.localeCompare(sb.itemId)
    })
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
