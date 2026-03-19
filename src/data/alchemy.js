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
  cuiti_dan: { materials: { wu_sha: 2, yun_tie: 3, ling_shui: 2 } },
  yanghun_dan: { materials: { mi_yu: 2, gu_yin: 2, ling_shui: 3 } },
  longli_dan: { materials: { chi_yu: 3, zi_tong: 2, xuan_tie: 2 } },
  shenxing_dan: { materials: { wu_sha: 2, wu_jing: 2, ling_shui: 2 } },
  pojing_dan_1: { materials: { chi_yu: 3, zi_tong: 3, gu_yin: 2 } },
  pojing_dan_2: { materials: { mi_yu: 3, xuan_tie: 2, ling_shui: 4 } },
  yanghun_jingdan: { materials: { wu_jing: 3, mi_yu: 3, ling_shui: 4 } },
  pojing_dan_3: { materials: { chi_mo_tie: 3, qing_gu_sha: 4, di_nv_lu: 2 } },
  pojing_dan_4: { materials: { zi_xuan_shi: 4, yang_hun_hua: 3, fu_yun_guo: 3 } },
  dahuan_dan: { materials: { chi_mo_tie: 4, yang_hun_hua: 4, di_nv_lu: 3 } },
  pojing_dan_5: { materials: { an_jing_tie: 4, chi_gui_jin: 3, wu_gu_xu: 3 } },
  pojing_dan_6: { materials: { qing_gu_sha: 4, di_nv_lu: 3, fu_yun_guo: 4 } },
  pojing_dan_7: { materials: { xuan_yin_chi_gui_jin: 3, jin_sha_tong: 3, qi_sha_gu_ma_nao: 2 } },
  puti_dahuan_dan: { materials: { qi_sha_gu_ma_nao: 3, wu_ding_bi_bao_shen: 2, qi_qiao_wu_mi_shui_jing: 2 } },
  pojing_dan_8: { materials: { yun_yu_bi_zhen_mu: 3, qi_qiao_wu_mi_shui_jing: 2, xi_sui_wu_shi: 2 } },
  pojing_dan_9: { materials: { qi_sha_gu_ma_nao: 3, wu_ding_bi_bao_shen: 3, jin_sha_tong: 3 } },
  pojing_dan_10: { materials: { xuan_yin_chi_gui_jin: 4, yun_yu_bi_zhen_mu: 3, qi_qiao_wu_mi_shui_jing: 3 } },
  pojing_dan_11: { materials: { qi_sha_gu_ma_nao: 4, xi_sui_wu_shi: 4, wu_ding_bi_bao_shen: 4 } },
  qiankun_zaohua_dan: { materials: { xuan_yin_chi_gui_jin: 4, qi_sha_gu_ma_nao: 4, qi_qiao_wu_mi_shui_jing: 3 } },
}

export { FURNACES }

/** 初始拥有的一品丹炉 */
export const INITIAL_OWNED_FURNACES = ['furnace_1']

/** 获取某丹药炼制所需材料 { materialId: count } */
export function getCraftRecipeMaterials(pillId) {
  return CRAFT_RECIPES[pillId]?.materials ?? {}
}

export function getScaledCraftRecipeMaterials(pillId, materialCostMultiplier = 1) {
  const materials = getCraftRecipeMaterials(pillId)
  return Object.fromEntries(
    Object.entries(materials).map(([mid, need]) => [mid, Math.max(1, Math.ceil(need * materialCostMultiplier))]),
  )
}

/** 检查背包材料是否满足炼制 */
export function canCraftWithInventory(pillId, inventory, materialCostMultiplier = 1) {
  const materials = getScaledCraftRecipeMaterials(pillId, materialCostMultiplier)
  for (const [mid, need] of Object.entries(materials)) {
    if ((inventory?.[mid] ?? 0) < need) return false
  }
  return true
}

/** 扣除炼制消耗的材料，返回新背包（调用方需已通过 canCraftWithInventory） */
export function deductCraftMaterials(inventory, pillId, materialCostMultiplier = 1) {
  const materials = getScaledCraftRecipeMaterials(pillId, materialCostMultiplier)
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
/** 炼制基础成功率：整体偏低，品级越高越低 */
export function getBaseCraftSuccessRate(pillGrade) {
  // 一品基础约 55%，九品基础约  -? 取下限 10%
  const grade = pillGrade ?? 1
  const rate = 70 - grade * 7
  return Math.max(10, Math.min(80, rate))
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

/** 成功时获得数量：1-3品 7-10 枚，4-6品 3-5 枚，7-9品 1-3 枚 */
export function getCraftResultCount(pillId) {
  const grade = PILLS[pillId]?.grade ?? 1
  if (grade <= 3) return 7 + Math.floor(Math.random() * 4)
  if (grade <= 6) return 3 + Math.floor(Math.random() * 3)
  return 1 + Math.floor(Math.random() * 3)
}

export function getRecipe(id) {
  return RECIPE_SCROLLS[id] ?? null
}

export function getFurnace(id) {
  return FURNACES[id] ?? null
}
