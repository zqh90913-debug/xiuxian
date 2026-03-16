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

/** 丹药定义：提升大境界突破成功率 +5%；部分为直接使用（增加修为等） */
export const PILLS = {
  'zhuji_dan': { id: 'zhuji_dan', name: '筑基丹', grade: 1, realmIndex: 1 },    // 筑基
  'yuanshen_dan': { id: 'yuanshen_dan', name: '元神丹', grade: 2, realmIndex: 2 }, // 金丹
  'yuanying_dan': { id: 'yuanying_dan', name: '元婴丹', grade: 4, realmIndex: 3 }, // 元婴
  'huashen_dan': { id: 'huashen_dan', name: '化神丹', grade: 5, realmIndex: 4 },  // 化神
  'heti_dan': { id: 'heti_dan', name: '合体丹', grade: 6, realmIndex: 5 },       // 合体
  'dujie_dan': { id: 'dujie_dan', name: '渡劫丹', grade: 7, realmIndex: 6 },     // 渡劫
  'dacheng_dan': { id: 'dacheng_dan', name: '大乘丹', grade: 8, realmIndex: 7 }, // 大乘
  /** 凝气丹：三品，直接使用增加 10000 修为 */
  'ningqi_dan': { id: 'ningqi_dan', name: '凝气丹', grade: 3, directUse: true, cultivationGain: 10000 },
  /** 淬体丹：直接使用增加 5 点血量（限用 50 次） */
  'cuiti_dan': { id: 'cuiti_dan', name: '淬体丹', grade: 1, directUse: true },
  /** 血丹：直接使用增加 2 点攻击（限用 50 次） */
  'xue_dan': { id: 'xue_dan', name: '血丹', grade: 2, directUse: true },
  /** 神行丹：直接使用增加 1 点速度（限用 10 次） */
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
  // 初级
  'an_sha': { id: 'an_sha', name: '暗砂', tier: 1 },
  'bi_yin': { id: 'bi_yin', name: '碧银', tier: 1 },
  'zi_tong': { id: 'zi_tong', name: '紫铜', tier: 1 },
  'wu_shi': { id: 'wu_shi', name: '乌石', tier: 1 },
  'chi_yu': { id: 'chi_yu', name: '赤玉', tier: 1 },
  // 中级
  'gu_lingzhi': { id: 'gu_lingzhi', name: '古灵芝', tier: 2 },
  'di_nvlu': { id: 'di_nvlu', name: '帝女露', tier: 2 },
  'qi_xian_yu': { id: 'qi_xian_yu', name: '七弦玉', tier: 2 },
  'shen_shupi': { id: 'shen_shupi', name: '神树皮', tier: 2 },
  'wan_moyu': { id: 'wan_moyu', name: '万魔玉', tier: 2 },
  'yang_hunhua': { id: 'yang_hunhua', name: '养魂花', tier: 2 },
  'fu_yunguo': { id: 'fu_yunguo', name: '拂云果', tier: 2 },
  // 高级
  'bingxue_ziling_guo': { id: 'bingxue_ziling_guo', name: '冰雪紫灵果', tier: 3 },
  'jinsha_chigui_tong': { id: 'jinsha_chigui_tong', name: '金砂赤鬼铜', tier: 3 },
  'qingjing_shenshen_ye': { id: 'qingjing_shenshen_ye', name: '清净神树叶', tier: 3 },
  'qisha_gumanao': { id: 'qisha_gumanao', name: '七杀古玛瑙', tier: 3 },
  'xisui_wushi': { id: 'xisui_wushi', name: '洗髓乌石', tier: 3 },
  'lingyuan_anjing_yan': { id: 'lingyuan_anjing_yan', name: '灵猿暗精岩', tier: 3 },
  'jinsha_wucao': { id: 'jinsha_wucao', name: '金砂乌草', tier: 3 },
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
  'recipe_zhuji': { id: 'recipe_zhuji', name: '筑基丹方', pillId: 'zhuji_dan' },
  'recipe_yuanshen': { id: 'recipe_yuanshen', name: '元神丹方', pillId: 'yuanshen_dan' },
  'recipe_ningqi': { id: 'recipe_ningqi', name: '凝气丹方', pillId: 'ningqi_dan' },
  'recipe_yuanying': { id: 'recipe_yuanying', name: '元婴丹方', pillId: 'yuanying_dan' },
  'recipe_huashen': { id: 'recipe_huashen', name: '化神丹方', pillId: 'huashen_dan' },
  'recipe_heti': { id: 'recipe_heti', name: '合体丹方', pillId: 'heti_dan' },
  'recipe_dujie': { id: 'recipe_dujie', name: '渡劫丹方', pillId: 'dujie_dan' },
  'recipe_dacheng': { id: 'recipe_dacheng', name: '大乘丹方', pillId: 'dacheng_dan' },
  'recipe_cuiti': { id: 'recipe_cuiti', name: '淬体丹方', pillId: 'cuiti_dan' },
  'recipe_xue': { id: 'recipe_xue', name: '血丹丹方', pillId: 'xue_dan' },
  'recipe_shenxing': { id: 'recipe_shenxing', name: '神行丹方', pillId: 'shenxing_dan' },
}
export const RECIPE_IDS = Object.keys(RECIPE_SCROLLS)
const RECIPE_BUY_PRICES = {
  'recipe_zhuji': 200,
  'recipe_yuanshen': 500,
  'recipe_ningqi': 800,
  'recipe_yuanying': 2000,
  'recipe_huashen': 5000,
  'recipe_heti': 12000,
  'recipe_dujie': 30000,
  'recipe_dacheng': 80000,
  'recipe_cuiti': 500,
  'recipe_xue': 1500,
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

/** 根据目标境界索引获取对应突破丹药 id（1=筑基 2=金丹 ... 7=大乘） */
export function getPillIdForRealm(realmIndex) {
  const entry = Object.entries(PILLS).find(([, p]) => p.realmIndex === realmIndex)
  return entry ? entry[0] : null
}

export function getPill(id) {
  return PILLS[id]
}

/** 直接使用类丹药增加的修为（如凝气丹），无则返回 0 */
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
        const count = slot.count ?? 1
        out[id] = (out[id] ?? 0) + count
      }
    }
    return out
  }
  return typeof inv === 'object' ? inv : {}
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
