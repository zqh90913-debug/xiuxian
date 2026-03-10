/**
 * 炼丹房：丹方、丹炉、炼制成功率、炼制材料消耗
 */
import { PILLS, FURNACES, RECIPE_SCROLLS } from './items'

/** 丹方：与 items 中 RECIPE_SCROLLS 一致，使用后解锁对应丹药的炼制 */
export const RECIPES = RECIPE_SCROLLS

/** 初始拥有丹方（空） */
export const INITIAL_OWNED_RECIPES = []

/** 炼制配方：pillId -> { materials: { materialId: count } }，品级越高消耗总量越多 */
export const CRAFT_RECIPES = {
  zhuji_dan: { materials: { an_sha: 2, bi_yin: 1 } },
  yuanshen_dan: { materials: { zi_tong: 2, wu_shi: 2 } },
  ningqi_dan: { materials: { chi_yu: 2, an_sha: 2, wu_shi: 3 } },
  yuanying_dan: { materials: { gu_lingzhi: 4, di_nvlu: 3, shen_shupi: 3, yang_hunhua: 2 } },
  huashen_dan: { materials: { wan_moyu: 3, yang_hunhua: 3, fu_yunguo: 4, qi_xian_yu: 5 } },
  heti_dan: { materials: { gu_lingzhi: 4, di_nvlu: 4, shen_shupi: 4, wan_moyu: 3, yang_hunhua: 3 } },
  dujie_dan: { materials: { bingxue_ziling_guo: 4, jinsha_chigui_tong: 4, qingjing_shenshen_ye: 4, qisha_gumanao: 5, xisui_wushi: 5 } },
  dacheng_dan: { materials: { lingyuan_anjing_yan: 5, jinsha_wucao: 6, bingxue_ziling_guo: 5, jinsha_chigui_tong: 5, qingjing_shenshen_ye: 5 } },
}

export { FURNACES }

/** 初始拥有的一品丹炉 */
export const INITIAL_OWNED_FURNACES = ['furnace_1']

/** 获取某丹药炼制所需材料 { materialId: count } */
export function getCraftRecipeMaterials(pillId) {
  return CRAFT_RECIPES[pillId]?.materials ?? {}
}

/** 检查背包材料是否满足炼制 */
export function canCraftWithInventory(pillId, inventory) {
  const materials = getCraftRecipeMaterials(pillId)
  for (const [mid, need] of Object.entries(materials)) {
    if ((inventory?.[mid] ?? 0) < need) return false
  }
  return true
}

/** 扣除炼制消耗的材料，返回新背包（调用方需已通过 canCraftWithInventory） */
export function deductCraftMaterials(inventory, pillId) {
  const materials = getCraftRecipeMaterials(pillId)
  let inv = { ...(inventory ?? {}) }
  for (const [mid, count] of Object.entries(materials)) {
    const cur = inv[mid] ?? 0
    const next = cur - count
    if (next <= 0) delete inv[mid]
    else inv[mid] = next
  }
  return inv
}

export const CRAFT_DURATION_MS = 10000
export const CRAFT_MIN_COUNT = 3
export const CRAFT_MAX_COUNT = 10

/** 炼制基础成功率：品级越高越低，最低 15% */
export function getBaseCraftSuccessRate(pillGrade) {
  const rate = 100 - (pillGrade ?? 1) * 8
  return Math.max(15, Math.min(95, rate))
}

/** 装备丹炉的加成（0 表示未装备） */
export function getFurnaceBonus(furnaceId) {
  if (!furnaceId) return 0
  const f = FURNACES[furnaceId]
  return f?.successBonus ?? 0
}

/** 最终炼制成功率（基础 + 丹炉），上限 100% */
export function getCraftSuccessRate(pillId, equippedFurnaceId) {
  const pill = PILLS[pillId]
  const grade = pill?.grade ?? 1
  const base = getBaseCraftSuccessRate(grade)
  const bonus = getFurnaceBonus(equippedFurnaceId)
  return Math.min(100, base + bonus)
}

/** 成功时获得数量 [3, 10] 随机 */
export function getCraftResultCount() {
  return CRAFT_MIN_COUNT + Math.floor(Math.random() * (CRAFT_MAX_COUNT - CRAFT_MIN_COUNT + 1))
}

export function getRecipe(id) {
  return RECIPE_SCROLLS[id] ?? null
}

export function getFurnace(id) {
  return FURNACES[id] ?? null
}
