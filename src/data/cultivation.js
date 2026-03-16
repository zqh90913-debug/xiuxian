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

// 突破到下一层所需修为的基数（练气一层）
export const BREAKTHROUGH_BASE = 100

// 小境界突破倍率：同一大境界内，每升一层修为需求略微提升
export const SMALL_BREAKTHROUGH_MULTIPLIER = 1.3

// 大境界突破倍率：每提升一个大境界，所需修为大幅提升
export const REALM_BREAKTHROUGH_MULTIPLIER = 8

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
  // 大境界基数：随境界跃迁成倍增加
  const realmBase = BREAKTHROUGH_BASE * Math.pow(REALM_BREAKTHROUGH_MULTIPLIER, realmIndex)
  // 小境界：同一境界内，每层只做小幅增加
  const layerMul = Math.pow(SMALL_BREAKTHROUGH_MULTIPLIER, layer - 1)
  return Math.floor(realmBase * layerMul)
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
 * 基础属性：攻击、血量、速度
 * 升小境界（同境界内层数+1）小幅提升，升大境界（跨境界）大幅提升
 */
export const BASE_ATTACK = 10
export const BASE_HP = 100
// 速度基数比攻击更低，整体控制在几十到几百
export const BASE_SPEED = 5

// 每升一层小境界，属性倍率
export const LAYER_STAT_MULTIPLIER = 1.08

// 每升一个大境界，属性额外倍率
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

/**
 * 根据境界计算基础速度
 */
export function getBaseSpeed(realmIndex, layer) {
  const totalLayers = realmIndex * LAYERS_PER_REALM + layer
  // 速度随层数增长比攻击/血量更缓和
  const layerBonus = Math.pow(1.03, totalLayers - 1)
  const realmBonus = Math.pow(1.6, realmIndex)
  return Math.floor(BASE_SPEED * layerBonus * realmBonus)
}

/**
 * 计算总速度（目前无装备加成，预留参数）
 */
export function getSpeed(realmIndex, layer, equipmentSpeedBonus = 0) {
  const base = getBaseSpeed(realmIndex, layer)
  return base + equipmentSpeedBonus
}
