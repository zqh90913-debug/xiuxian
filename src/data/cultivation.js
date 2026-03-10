/**
 * 修仙境界配置
 * 练气→筑基→金丹→元婴→化神→合体→渡劫→大乘
 * 每个境界 1-10 层
 */

export const REALMS = [
  '练气期', '筑基期', '金丹期', '元婴期', '化神期', '合体期', '渡劫期', '大乘期'
]

export const LAYERS_PER_REALM = 10

// 基础修为：每完成一次修行获得的修为（练气一层基准）
export const BASE_CULTIVATION_GAIN = 10

// 每层境界的修为 gain 倍率（突破后修炼更快）
export const CULTIVATION_GAIN_MULTIPLIER = 1.15

// 突破到下一层所需修为的基数
export const BREAKTHROUGH_BASE = 100

// 突破倍率：每提升一层，所需修为大幅增加
export const BREAKTHROUGH_MULTIPLIER = 2.2

/**
 * 计算当前层级的修炼获得修为
 * @param {number} realmIndex 境界索引 0-7
 * @param {number} layer 当前层 1-10
 * @returns {number}
 */
export function getCultivationGain(realmIndex, layer) {
  const totalLayers = realmIndex * LAYERS_PER_REALM + layer
  return Math.floor(BASE_CULTIVATION_GAIN * Math.pow(CULTIVATION_GAIN_MULTIPLIER, totalLayers - 1))
}

/**
 * 计算突破到下一层所需的修为
 * @param {number} realmIndex 境界索引 0-7
 * @param {number} layer 当前层 1-10（突破后变成的层）
 * @returns {number}
 */
export function getBreakthroughRequired(realmIndex, layer) {
  const totalLayers = realmIndex * LAYERS_PER_REALM + layer
  return Math.floor(BREAKTHROUGH_BASE * Math.pow(BREAKTHROUGH_MULTIPLIER, totalLayers))
}

/**
 * 从总层数解析境界和层数
 * @param {number} totalLayer 总层数 1-80
 */
export function parseRealmLayer(totalLayer) {
  const realmIndex = Math.floor((totalLayer - 1) / LAYERS_PER_REALM)
  const layer = ((totalLayer - 1) % LAYERS_PER_REALM) + 1
  return { realmIndex, layer }
}

/**
 * 获取境界显示名称
 */
export function getRealmDisplayName(realmIndex, layer) {
  return `${REALMS[realmIndex]} 第${layer}层`
}

/**
 * 基础属性：攻击、血量
 * 升小境界（同境界内层数+1）小幅提升，升大境界（跨境界）大幅提升
 */
export const BASE_ATTACK = 10
export const BASE_HP = 100

// 每升一层小境界，攻击和血量的倍率
export const LAYER_STAT_MULTIPLIER = 1.08

// 每升一个大境界，攻击和血量的额外倍率
export const REALM_STAT_MULTIPLIER = 2.5

/**
 * 根据境界计算基础攻击力
 */
export function getBaseAttack(realmIndex, layer) {
  const totalLayers = realmIndex * LAYERS_PER_REALM + layer
  const layerBonus = Math.pow(LAYER_STAT_MULTIPLIER, totalLayers - 1)
  const realmBonus = Math.pow(REALM_STAT_MULTIPLIER, realmIndex)
  return Math.floor(BASE_ATTACK * layerBonus * realmBonus)
}

/**
 * 计算总攻击力（基础 + 装备加成，装备加成由调用方传入）
 */
export function getAttack(realmIndex, layer, equipmentAttackBonus = 0) {
  const base = getBaseAttack(realmIndex, layer)
  return base + equipmentAttackBonus
}

/**
 * 根据境界计算血量
 */
export function getHp(realmIndex, layer) {
  const totalLayers = realmIndex * LAYERS_PER_REALM + layer
  const layerBonus = Math.pow(LAYER_STAT_MULTIPLIER, totalLayers - 1)
  const realmBonus = Math.pow(REALM_STAT_MULTIPLIER, realmIndex)
  return Math.floor(BASE_HP * layerBonus * realmBonus)
}
