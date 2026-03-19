/**
 * 修仙境界配置
 * 不同阶段拥有不同的小境界层数与显示方式
 */

const PHASE_LABELS = ['初期', '中期', '后期', '圆满']
const CHINESE_NUMERALS = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
const BIG_REALM_STAGE_NAMES = new Set(['练气', '筑基', '金丹', '元婴', '化神', '合体', '合灵', '合魂', '空冥', '寂灭', '问鼎'])

export const STAGE_REALMS = [
  { groupName: '练气期', stageName: '练皮', maxLevel: 1, levelType: 'single' },
  { groupName: '练气期', stageName: '练肉', maxLevel: 1, levelType: 'single' },
  { groupName: '练气期', stageName: '练骨', maxLevel: 1, levelType: 'single' },
  { groupName: '练气期', stageName: '炼脏', maxLevel: 1, levelType: 'single' },
  { groupName: '练气期', stageName: '练血', maxLevel: 1, levelType: 'single' },
  { groupName: '练气期', stageName: '后天', maxLevel: 1, levelType: 'single' },
  { groupName: '练气期', stageName: '先天', maxLevel: 1, levelType: 'single' },
  { groupName: '练气期', stageName: '辟谷', maxLevel: 1, levelType: 'single' },
  { groupName: '练气期', stageName: '引气', maxLevel: 1, levelType: 'single' },
  { groupName: '练气期', stageName: '聚气', maxLevel: 1, levelType: 'single' },
  { groupName: '练气期', stageName: '凝气', maxLevel: 1, levelType: 'single' },
  { groupName: '练气期', stageName: '化气', maxLevel: 1, levelType: 'single' },
  { groupName: '练气期', stageName: '练气', maxLevel: 1, levelType: 'single', isBigRealm: true },
  { groupName: '筑基期', stageName: '聚元', maxLevel: 1, levelType: 'single' },
  { groupName: '筑基期', stageName: '凝元', maxLevel: 1, levelType: 'single' },
  { groupName: '筑基期', stageName: '筑元', maxLevel: 1, levelType: 'single' },
  { groupName: '筑基期', stageName: '旋照', maxLevel: 1, levelType: 'single' },
  { groupName: '筑基期', stageName: '筑基', maxLevel: 1, levelType: 'single', isBigRealm: true },
  { groupName: '金丹期', stageName: '灵动', maxLevel: 1, levelType: 'single' },
  { groupName: '金丹期', stageName: '灵虚', maxLevel: 1, levelType: 'single' },
  { groupName: '金丹期', stageName: '灵寂', maxLevel: 1, levelType: 'single' },
  { groupName: '金丹期', stageName: '开光', maxLevel: 1, levelType: 'single' },
  { groupName: '金丹期', stageName: '融合', maxLevel: 1, levelType: 'single' },
  { groupName: '金丹期', stageName: '心动', maxLevel: 1, levelType: 'single' },
  { groupName: '金丹期', stageName: '聚丹', maxLevel: 1, levelType: 'single' },
  { groupName: '金丹期', stageName: '凝丹', maxLevel: 1, levelType: 'single' },
  { groupName: '金丹期', stageName: '孕丹', maxLevel: 1, levelType: 'single' },
  { groupName: '金丹期', stageName: '结丹', maxLevel: 1, levelType: 'single' },
  { groupName: '金丹期', stageName: '金丹', maxLevel: 1, levelType: 'single', isBigRealm: true },
  { groupName: '元婴期', stageName: '聚婴', maxLevel: 1, levelType: 'single' },
  { groupName: '元婴期', stageName: '凝婴', maxLevel: 1, levelType: 'single' },
  { groupName: '元婴期', stageName: '结婴', maxLevel: 1, levelType: 'single' },
  { groupName: '元婴期', stageName: '元婴', maxLevel: 1, levelType: 'single', isBigRealm: true },
  { groupName: '化神期', stageName: '婴变', maxLevel: 1, levelType: 'single' },
  { groupName: '化神期', stageName: '出窍', maxLevel: 1, levelType: 'single' },
  { groupName: '化神期', stageName: '元神', maxLevel: 1, levelType: 'single' },
  { groupName: '化神期', stageName: '分神', maxLevel: 1, levelType: 'single' },
  { groupName: '化神期', stageName: '化神', maxLevel: 1, levelType: 'single', isBigRealm: true },
  { groupName: '合体期', stageName: '练虚', maxLevel: 1, levelType: 'single' },
  { groupName: '合体期', stageName: '冻虚', maxLevel: 1, levelType: 'single' },
  { groupName: '合体期', stageName: '化虚', maxLevel: 1, levelType: 'single' },
  { groupName: '合体期', stageName: '返虚', maxLevel: 1, levelType: 'single' },
  { groupName: '合体期', stageName: '合体', maxLevel: 10, levelType: 'layer', isBigRealm: true },
  { groupName: '合灵期', stageName: '合灵', maxLevel: 10, levelType: 'pin', isBigRealm: true },
  { groupName: '合魂期', stageName: '合魂', maxLevel: 10, levelType: 'zhuan', isBigRealm: true },
  { groupName: '空冥期', stageName: '空冥', maxLevel: 4, levelType: 'phase', isBigRealm: true },
  { groupName: '寂灭期', stageName: '寂灭', maxLevel: 4, levelType: 'phase', isBigRealm: true },
  { groupName: '问鼎期', stageName: '问鼎', maxLevel: 4, levelType: 'phase', isBigRealm: true },
  { groupName: '飞升期', stageName: '闻道', maxLevel: 1, levelType: 'single', requiresOpportunity: true },
  { groupName: '飞升期', stageName: '大乘', maxLevel: 1, levelType: 'single', requiresOpportunity: true },
  { groupName: '飞升期', stageName: '渡劫', maxLevel: 1, levelType: 'single', requiresOpportunity: true },
  { groupName: '飞升期', stageName: '化羽', maxLevel: 1, levelType: 'single', requiresOpportunity: true },
  { groupName: '飞升期', stageName: '飞升', maxLevel: 1, levelType: 'single', requiresOpportunity: true },
]

export const REALMS = STAGE_REALMS.map((item) => `${item.groupName}·${item.stageName}`)
export const TOTAL_STAGES = STAGE_REALMS.reduce((sum, item) => sum + item.maxLevel, 0)

export const MAJOR_REALM_START_INDEX = {
  lianti: 12,
  zhuji: 17,
  jindan: 28,
  yuanying: 32,
  huashen: 37,
  heti: 42,
  heling: 43,
  hehun: 44,
  kongming: 45,
  jimie: 46,
  wending: 47,
  feisheng: 48,
}

export const BASE_CULTIVATION_GAIN = 10
export const CULTIVATION_GAIN_MULTIPLIER = 1.06
export const SMALL_REALM_GAIN_MULTIPLIER = 1.12
export const BIG_REALM_GAIN_MULTIPLIER = 1.38
export const BREAKTHROUGH_BASE = 60
export const SMALL_BREAKTHROUGH_MULTIPLIER = 1.12
export const SMALL_REALM_BREAKTHROUGH_MULTIPLIER = 1.16
export const BIG_REALM_BREAKTHROUGH_MULTIPLIER = 1.62
export const BASE_ATTACK = 10
export const BASE_HP = 100
export const BASE_SPEED = 5
export const ATTACK_STEP_MULTIPLIER = 1.08
export const ATTACK_SMALL_REALM_MULTIPLIER = 1.12
export const ATTACK_BIG_REALM_MULTIPLIER = 1.3
export const HP_STEP_MULTIPLIER = 1.09
export const HP_SMALL_REALM_MULTIPLIER = 1.14
export const HP_BIG_REALM_MULTIPLIER = 1.34
export const SPEED_STEP_MULTIPLIER = 1.03
export const SPEED_SMALL_REALM_MULTIPLIER = 1.05
export const SPEED_BIG_REALM_MULTIPLIER = 1.12

const CUMULATIVE_LEVELS = STAGE_REALMS.reduce((acc, item, index) => {
  const prev = acc[index - 1] ?? 0
  acc.push(prev + item.maxLevel)
  return acc
}, [])

function getLevelSuffix(levelType, level) {
  const chinese = CHINESE_NUMERALS[level - 1] ?? String(level)
  if (levelType === 'layer') return `${chinese}层`
  if (levelType === 'pin') return `${chinese}品`
  if (levelType === 'zhuan') return `${chinese}转`
  if (levelType === 'phase') return PHASE_LABELS[level - 1] ?? ''
  return ''
}

export function getRealmLayerCount(realmIndex) {
  return STAGE_REALMS[realmIndex]?.maxLevel ?? 1
}

export function getRealmGroupName(realmIndex) {
  return STAGE_REALMS[realmIndex]?.groupName ?? '未知境界'
}

export function getRealmStageName(realmIndex) {
  return STAGE_REALMS[realmIndex]?.stageName ?? '未知阶段'
}

export function getTotalStageIndex(realmIndex, layer) {
  const stage = STAGE_REALMS[realmIndex]
  if (!stage) return 1
  const prevTotal = CUMULATIVE_LEVELS[realmIndex - 1] ?? 0
  const normalizedLayer = Math.max(1, Math.min(layer, stage.maxLevel))
  return prevTotal + normalizedLayer
}

export function parseRealmLayer(totalLayer) {
  const normalized = Math.max(1, totalLayer)
  let realmIndex = 0
  while (realmIndex < CUMULATIVE_LEVELS.length && normalized > CUMULATIVE_LEVELS[realmIndex]) {
    realmIndex += 1
  }
  const prevTotal = CUMULATIVE_LEVELS[realmIndex - 1] ?? 0
  return { realmIndex, layer: normalized - prevTotal }
}

export function isLastLayerInRealm(realmIndex, layer) {
  return layer >= getRealmLayerCount(realmIndex)
}

export function getNextRealmLayer(realmIndex, layer, options = {}) {
  const stage = STAGE_REALMS[realmIndex]
  if (!stage) return null
  if (layer < stage.maxLevel) return { realmIndex, layer: layer + 1 }
  const next = STAGE_REALMS[realmIndex + 1]
  if (!next) return null
  if (next.requiresOpportunity && !options.feishengUnlocked) return null
  return { realmIndex: realmIndex + 1, layer: 1 }
}

export function isMajorRealmBreak(realmIndex, layer, options = {}) {
  if (!isLastLayerInRealm(realmIndex, layer)) return false
  const next = getNextRealmLayer(realmIndex, layer, options)
  if (!next) return false
  return BIG_REALM_STAGE_NAMES.has(STAGE_REALMS[next.realmIndex]?.stageName)
}

const REQUIREMENTS = []
const CULTIVATION_GAINS = []
const ATTACK_VALUES = []
const HP_VALUES = []
const SPEED_VALUES = []
for (let realmIndex = 0; realmIndex < STAGE_REALMS.length; realmIndex += 1) {
  for (let layer = 1; layer <= STAGE_REALMS[realmIndex].maxLevel; layer += 1) {
    const totalIndex = getTotalStageIndex(realmIndex, layer)
    if (totalIndex === 1) {
      REQUIREMENTS.push(BREAKTHROUGH_BASE)
      CULTIVATION_GAINS.push(BASE_CULTIVATION_GAIN)
      ATTACK_VALUES.push(BASE_ATTACK)
      HP_VALUES.push(BASE_HP)
      SPEED_VALUES.push(BASE_SPEED)
      continue
    }

    const currentStage = STAGE_REALMS[realmIndex]
    const previous = parseRealmLayer(totalIndex - 1)
    const previousStage = STAGE_REALMS[previous.realmIndex]
    const prev = REQUIREMENTS[REQUIREMENTS.length - 1]
    const prevGain = CULTIVATION_GAINS[CULTIVATION_GAINS.length - 1]
    const prevAttack = ATTACK_VALUES[ATTACK_VALUES.length - 1]
    const prevHp = HP_VALUES[HP_VALUES.length - 1]
    const prevSpeed = SPEED_VALUES[SPEED_VALUES.length - 1]
    const isBigRealmStep = currentStage.isBigRealm && layer === 1
    const sameStageInnerStep = previous.realmIndex === realmIndex
    const sameGroupStep = previousStage?.groupName === currentStage.groupName

    let multiplier = SMALL_BREAKTHROUGH_MULTIPLIER
    if (isBigRealmStep) {
      multiplier = BIG_REALM_BREAKTHROUGH_MULTIPLIER + realmIndex * 0.01
    } else if (sameStageInnerStep) {
      multiplier = SMALL_BREAKTHROUGH_MULTIPLIER + (layer - 1) * 0.01
    } else if (sameGroupStep) {
      multiplier = SMALL_REALM_BREAKTHROUGH_MULTIPLIER
    }

    REQUIREMENTS.push(Math.max(prev + 1, Math.floor(prev * multiplier)))

    let gainMultiplier = CULTIVATION_GAIN_MULTIPLIER
    if (isBigRealmStep) {
      gainMultiplier = BIG_REALM_GAIN_MULTIPLIER + realmIndex * 0.004
    } else if (sameStageInnerStep) {
      gainMultiplier = CULTIVATION_GAIN_MULTIPLIER + (layer - 1) * 0.015
    } else if (sameGroupStep) {
      gainMultiplier = SMALL_REALM_GAIN_MULTIPLIER
    }

    CULTIVATION_GAINS.push(Math.max(prevGain + 1, Math.floor(prevGain * gainMultiplier)))

    let attackMultiplier = ATTACK_STEP_MULTIPLIER
    let hpMultiplier = HP_STEP_MULTIPLIER
    let speedMultiplier = SPEED_STEP_MULTIPLIER
    if (isBigRealmStep) {
      attackMultiplier = ATTACK_BIG_REALM_MULTIPLIER + realmIndex * 0.004
      hpMultiplier = HP_BIG_REALM_MULTIPLIER + realmIndex * 0.004
      speedMultiplier = SPEED_BIG_REALM_MULTIPLIER + realmIndex * 0.002
    } else if (sameGroupStep && !sameStageInnerStep) {
      attackMultiplier = ATTACK_SMALL_REALM_MULTIPLIER
      hpMultiplier = HP_SMALL_REALM_MULTIPLIER
      speedMultiplier = SPEED_SMALL_REALM_MULTIPLIER
    } else if (sameStageInnerStep) {
      attackMultiplier = ATTACK_STEP_MULTIPLIER + (layer - 1) * 0.01
      hpMultiplier = HP_STEP_MULTIPLIER + (layer - 1) * 0.01
      speedMultiplier = SPEED_STEP_MULTIPLIER + (layer - 1) * 0.004
    }

    ATTACK_VALUES.push(Math.max(prevAttack + 1, Math.floor(prevAttack * attackMultiplier)))
    HP_VALUES.push(Math.max(prevHp + 1, Math.floor(prevHp * hpMultiplier)))
    SPEED_VALUES.push(Math.max(prevSpeed + 1, Math.floor(prevSpeed * speedMultiplier)))
  }
}

export function getCultivationGain(realmIndex, layer) {
  const totalLayers = getTotalStageIndex(realmIndex, layer)
  return CULTIVATION_GAINS[totalLayers - 1] ?? BASE_CULTIVATION_GAIN
}

export function getBreakthroughRequired(realmIndex, layer) {
  const totalIndex = getTotalStageIndex(realmIndex, layer)
  return REQUIREMENTS[totalIndex - 1]
}

export function getRealmDisplayName(realmIndex, layer) {
  const realm = STAGE_REALMS[realmIndex]
  if (!realm) return '未知境界'
  const suffix = getLevelSuffix(realm.levelType, layer)
  return suffix ? `${realm.stageName}期${suffix}` : `${realm.stageName}期`
}

export function isFeishengStage(realmIndex) {
  return Boolean(STAGE_REALMS[realmIndex]?.requiresOpportunity)
}

export function getBaseAttack(realmIndex, layer) {
  const totalLayers = getTotalStageIndex(realmIndex, layer)
  return ATTACK_VALUES[totalLayers - 1] ?? BASE_ATTACK
}

export function getAttack(realmIndex, layer, equipmentAttackBonus = 0) {
  return getBaseAttack(realmIndex, layer) + equipmentAttackBonus
}

export function getHp(realmIndex, layer) {
  const totalLayers = getTotalStageIndex(realmIndex, layer)
  return HP_VALUES[totalLayers - 1] ?? BASE_HP
}

export function getBaseSpeed(realmIndex, layer) {
  const totalLayers = getTotalStageIndex(realmIndex, layer)
  return SPEED_VALUES[totalLayers - 1] ?? BASE_SPEED
}

export function getSpeed(realmIndex, layer, equipmentSpeedBonus = 0) {
  return getBaseSpeed(realmIndex, layer) + equipmentSpeedBonus
}
