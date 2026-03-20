/**
 * 宗门宝库：三层结构，按职位解锁
 * 第一层：记名弟子、外门弟子可兑换
 * 第二层：内门弟子、真传弟子解锁
 * 第三层：执事、堂主解锁
 * 层级越高物品越高级，目前仅逻辑，不配置具体物品
 */
import { ARMOR_IDS_BY_QUALITY, WEAPON_IDS_BY_QUALITY } from './items'

/** 类型 */
export const SECT_ITEM_TYPES = { TECHNIQUE: 'technique', WEAPON: 'weapon', ARMOR: 'armor' }

/** 宝库三层配置：minRankIndex 为可访问该层的最低职位 id（>= 即解锁） */
export const SECT_TREASURY_LAYERS = [
  { layerIndex: 1, name: '第一层', minRankIndex: 0, desc: '记名弟子、外门弟子可兑换' },
  { layerIndex: 2, name: '第二层', minRankIndex: 2, desc: '内门弟子、真传弟子解锁' },
  { layerIndex: 3, name: '第三层', minRankIndex: 4, desc: '执事、堂主解锁' },
]

const SECT_SECRET_TECHNIQUES = {
  东华书院: [{ id: 'shengxian_xinfa', cost: 18000 }],
  幽冥窟: [{ id: 'huangquan_zhi', cost: 18000 }],
  东帝圣地: [{ id: 'dongdi_jue', cost: 30000 }],
  焚沙魔域: [{ id: 'huangsha_putian_jue', cost: 18000 }],
  定宇府: [{ id: 'bajiu_xuangong', cost: 18000 }],
  太古圣地: [{ id: 'taigu_yin', cost: 30000 }],
  古魂殿: [{ id: 'taiyi_hunjue', cost: 18000 }],
  昆仑宫: [{ id: 'longxiang_bore_gong', cost: 18000 }],
  山海圣地: [{ id: 'shanhai_jing', cost: 30000 }],
  素银山脉: [{ id: 'taishang_wangqing_jing', cost: 18000 }],
  冰碧渊: [{ id: 'bingdi_xinfa', cost: 18000 }],
  冰月圣地: [{ id: 'beichen_qijian', cost: 30000 }],
  玄都城: [{ id: 'xuandu_zhi', cost: 18000 }],
  邪灵教: [{ id: 'hundun_mogong', cost: 18000 }],
  羲和圣地: [{ id: 'diyin_jue', cost: 30000 }],
  星辰圣地: [{ id: 'huanyu_xingchen_gong', cost: 30000 }],
}

function hashString(value = '') {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 131 + value.charCodeAt(i)) >>> 0
  }
  return hash
}

function pickStableRandomItems(items = [], count, seedKey) {
  const arr = [...items]
  let seed = hashString(seedKey)
  for (let i = arr.length - 1; i > 0; i -= 1) {
    seed = (seed * 1664525 + 1013904223) >>> 0
    const j = seed % (i + 1)
    const tmp = arr[i]
    arr[i] = arr[j]
    arr[j] = tmp
  }
  return arr.slice(0, Math.min(count, arr.length))
}

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
  if (layerIndex === 3) {
    return (SECT_SECRET_TECHNIQUES[sect.name] ?? []).map((item) => ({
      type: SECT_ITEM_TYPES.TECHNIQUE,
      id: item.id,
      cost: item.cost,
    }))
  }
  if (layerIndex !== 1) return []

  const items = []
  const pushGroup = (type, ids = [], baseCost) => {
    ids.forEach((id, index) => {
      items.push({
        type,
        id,
        cost: baseCost + index * Math.max(40, Math.floor(baseCost * 0.08)),
      })
    })
  }

  if (sect.level >= 1 && sect.level <= 5) {
    pushGroup(SECT_ITEM_TYPES.WEAPON, WEAPON_IDS_BY_QUALITY[2], 900)
    pushGroup(SECT_ITEM_TYPES.ARMOR, ARMOR_IDS_BY_QUALITY[2], 960)
    pushGroup(SECT_ITEM_TYPES.WEAPON, WEAPON_IDS_BY_QUALITY[3], 4200)
    pushGroup(SECT_ITEM_TYPES.ARMOR, ARMOR_IDS_BY_QUALITY[3], 4600)
  }

  if (sect.level >= 5) {
    pushGroup(SECT_ITEM_TYPES.WEAPON, WEAPON_IDS_BY_QUALITY[4], 16000)
    pushGroup(SECT_ITEM_TYPES.ARMOR, ARMOR_IDS_BY_QUALITY[4], 17500)
  }

  return pickStableRandomItems(items, 5, `${sect.id}-layer-${layerIndex}`)
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
