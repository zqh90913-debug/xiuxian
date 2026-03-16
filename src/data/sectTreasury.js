/**
 * 宗门宝库：三层结构，按职位解锁
 * 第一层：记名弟子、外门弟子可兑换
 * 第二层：内门弟子、真传弟子解锁
 * 第三层：执事、堂主解锁
 * 层级越高物品越高级，目前仅逻辑，不配置具体物品
 */

/** 类型 */
export const SECT_ITEM_TYPES = { TECHNIQUE: 'technique', WEAPON: 'weapon', ARMOR: 'armor' }

/** 宝库三层配置：minRankIndex 为可访问该层的最低职位 id（>= 即解锁） */
export const SECT_TREASURY_LAYERS = [
  { layerIndex: 1, name: '第一层', minRankIndex: 0, desc: '记名弟子、外门弟子可兑换' },
  { layerIndex: 2, name: '第二层', minRankIndex: 2, desc: '内门弟子、真传弟子解锁' },
  { layerIndex: 3, name: '第三层', minRankIndex: 4, desc: '执事、堂主解锁' },
]

/**
 * 当前职位是否可访问该层
 * @param {number} sectRankIndex 玩家当前职位 id
 * @param {number} minRankIndex 该层要求的最低职位 id
 */
export function canAccessTreasuryLayer(sectRankIndex, minRankIndex) {
  return sectRankIndex >= minRankIndex
}

/**
 * 根据宗门与层索引获取该层可兑换物品列表（后续可按 sect.level 区分内容，目前为空）
 * @param {object} sect 宗门对象
 * @param {number} layerIndex 层 1/2/3
 * @returns {Array<{ type, id, cost }>}
 */
export function getTreasuryItemsForLayer(sect, layerIndex) {
  if (!sect || !layerIndex) return []
  // 后续可在此按 sect.level 与 layerIndex 返回不同物品，例如：
  // const key = `${sect.level}_${layerIndex}`; return SECT_LAYER_ITEMS[key] ?? [];
  return []
}

/**
 * 获取宗门宝库的三层结构（含每层是否解锁、物品列表）
 * @param {object} sect 宗门对象
 * @param {number} sectRankIndex 玩家当前职位 id
 */
export function getTreasuryLayersForSect(sect, sectRankIndex) {
  if (!sect) return []
  return SECT_TREASURY_LAYERS.map((layer) => {
    const unlocked = canAccessTreasuryLayer(sectRankIndex, layer.minRankIndex)
    const items = unlocked ? getTreasuryItemsForLayer(sect, layer.layerIndex) : []
    return {
      ...layer,
      unlocked,
      items,
    }
  })
}

/** @deprecated 保留兼容，返回空数组；请使用 getTreasuryLayersForSect */
export function getTreasuryForSect(sect) {
  if (!sect) return []
  return []
}
