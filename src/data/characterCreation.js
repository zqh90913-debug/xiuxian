import { getItemById } from './items'

const BASIC_ELEMENTS = [
  { id: 'metal', label: '金', bonuses: { attackBonus: 5 } },
  { id: 'wood', label: '木', bonuses: { hpBonus: 18, cultivationFlatBonus: 1 } },
  { id: 'water', label: '水', bonuses: { cultivationFlatBonus: 3, speedBonus: 1 } },
  { id: 'fire', label: '火', bonuses: { attackBonus: 3, cultivationFlatBonus: 2 } },
  { id: 'earth', label: '土', bonuses: { hpBonus: 12, treasureCostMultiplier: -0.06 } },
]

const EXOTIC_ELEMENTS = [
  {
    id: 'wind',
    label: '风',
    title: '风灵根',
    description: '气机轻灵，身法极快，修行时更易感知天地流动。',
    bonuses: { speedBonus: 6, cultivationFlatBonus: 3, cultivationRateMultiplier: 1.12, treasureCostMultiplier: -0.03 },
  },
  {
    id: 'thunder',
    label: '雷',
    title: '雷灵根',
    description: '灵力暴烈迅猛，斗法时更容易形成压制。',
    bonuses: { attackBonus: 9, speedBonus: 2, cultivationFlatBonus: 2, cultivationRateMultiplier: 1.08 },
  },
  {
    id: 'light',
    label: '光',
    title: '光灵根',
    description: '灵识澄明，悟性极佳，吸纳灵气的效率尤其出众。',
    bonuses: { hpBonus: 10, speedBonus: 2, cultivationFlatBonus: 5, cultivationRateMultiplier: 1.14, treasureCostMultiplier: -0.08 },
  },
  {
    id: 'dark',
    label: '暗',
    title: '暗灵根',
    description: '灵力深沉晦藏，兼具侵略性与韧性，适合后发制人。',
    bonuses: { attackBonus: 6, hpBonus: 26, cultivationFlatBonus: 1, cultivationRateMultiplier: 1.03, treasureCostMultiplier: 0.05 },
  },
]

export const ELEMENT_OPTIONS = [
  ...BASIC_ELEMENTS.map((item) => ({
    id: item.id,
    label: item.label,
    title: `${item.label}系灵气`,
    description: '五行本源之一，可与其他灵气自由组合。',
    type: '五行',
    bonuses: item.bonuses,
    exotic: false,
  })),
  ...EXOTIC_ELEMENTS.map((item) => ({
    id: item.id,
    label: item.label,
    title: item.title,
    description: item.description,
    type: '异灵',
    bonuses: item.bonuses,
    exotic: true,
  })),
]

const ROOT_COUNT_CONFIG = {
  1: { title: '单灵根', description: '灵气专一纯粹，修行最为顺畅。', cultivationRateMultiplier: 1.15, treasureCostMultiplier: 0.9 },
  2: { title: '双灵根', description: '灵气相辅相成，兼具潜力与稳定。', cultivationRateMultiplier: 1.02, treasureCostMultiplier: 1 },
  3: { title: '三灵根', description: '气机略显驳杂，成长开始放缓。', cultivationRateMultiplier: 0.92, treasureCostMultiplier: 1.15 },
  4: { title: '四灵根', description: '杂而不纯，修行速度明显受限。', cultivationRateMultiplier: 0.84, treasureCostMultiplier: 1.3 },
  5: { title: '五灵根', description: '五行俱全却极难精进，后期培养代价最高。', cultivationRateMultiplier: 0.76, treasureCostMultiplier: 1.5 },
}

const FAMILY_BACKGROUND_PRESETS = [
  {
    id: 'imperial',
    label: '帝王之家',
    title: '金阙深宫',
    description: '自幼锦衣玉食，见惯权势与资源，入道时便不缺灵石与护身之物。',
    bonuses: { hpBonus: 8 },
    starting: { spiritStones: 1200, inventory: { yu_jian: 1, jin_jia: 1, shenxing_dan: 1 } },
  },
  {
    id: 'general',
    label: '将相门庭',
    title: '武勋旧府',
    description: '家中尚武，出手便带几分凌厉，体魄根基也更扎实。',
    bonuses: { attackBonus: 5, hpBonus: 20 },
    starting: { spiritStones: 780, inventory: { jin_chui: 1, tie_jia: 1, cuiti_dan: 2 } },
  },
  {
    id: 'sect_clan',
    label: '修真世家',
    title: '祖上留泽',
    description: '祖辈曾有修士坐镇，你接触修行更早，也更懂灵材丹药的用途。',
    bonuses: { cultivationFlatBonus: 2, treasureCostMultiplier: -0.04 },
    starting: { spiritStones: 620, ownedRecipes: ['recipe_yanghun_jing'], inventory: { chi_yu: 12, wu_sha: 12 } },
  },
  {
    id: 'merchant',
    label: '富商大贾',
    title: '四海通财',
    description: '见惯买卖往来，懂得积攒资源与调配物资。',
    bonuses: { cultivationFlatBonus: 1 },
    starting: { spiritStones: 560, ownedFurnaces: ['furnace_2'], inventory: { gu_yin: 14, yun_tie: 10 } },
  },
  {
    id: 'scholar',
    label: '书香门第',
    title: '墨香旧宅',
    description: '幼承诗书，心性沉稳，对功法心诀的理解更快一些。',
    bonuses: { cultivationFlatBonus: 3, speedBonus: 1 },
    starting: { spiritStones: 300, ownedRecipes: ['recipe_cuiti'], inventory: { cuiti_dan: 1 } },
  },
  {
    id: 'farmer',
    label: '农户寒门',
    title: '垄上人家',
    description: '自幼劳作不辍，吃苦耐劳，虽贫却有一副结实体魄。',
    bonuses: { hpBonus: 24 },
    starting: { spiritStones: 120, inventory: { yun_tie: 8, cuiti_dan: 1 } },
  },
  {
    id: 'hunter',
    label: '山野猎户',
    title: '山林长成',
    description: '行山涉险是家常便饭，斗法时更懂得先下手为强。',
    bonuses: { attackBonus: 3, speedBonus: 1, hpBonus: 10 },
    starting: { spiritStones: 140, inventory: { shi_chui: 1, chi_yu: 6 } },
  },
  {
    id: 'wandering',
    label: '江湖游民',
    title: '漂泊四方',
    description: '见惯人情冷暖，善于趋利避害，行动也更灵活。',
    bonuses: { speedBonus: 3 },
    starting: { spiritStones: 90, inventory: { shenxing_dan: 1, wu_sha: 4 } },
  },
  {
    id: 'beggar',
    label: '乞儿出身',
    title: '穷巷残灯',
    description: '从最艰难的日子里活下来，命硬，也更懂得珍惜一切机缘。',
    bonuses: { hpBonus: 16, treasureCostMultiplier: -0.02 },
    starting: { spiritStones: 20, inventory: { cuiti_dan: 1 } },
  },
]

export const GENDER_OPTIONS = [
  { id: 'male', label: '男修', title: '青衫问道', description: '纵入仙途，也仍是此世凡身。' },
  { id: 'female', label: '女修', title: '素衣寻真', description: '一念向道，亦可逆命而行。' },
]

export const BACKGROUND_OPTIONS = FAMILY_BACKGROUND_PRESETS.map((option) => ({
  ...option,
  effectSummary: '',
}))

export const DESTINY_OPTIONS = [
  {
    id: 'river_abandon',
    label: '满月抛江',
    title: '出生机遇',
    description: '你刚满月便被抛入江中，却被路过异人救起，自此命格带上几分劫后余生的锋芒。',
    bonuses: { hpBonus: 18, speedBonus: 1 },
    starting: { spiritStones: 80, inventory: { cuiti_dan: 1, shenxing_dan: 1 } },
  },
  {
    id: 'serious_illness',
    label: '大病一场',
    title: '出生机遇',
    description: '幼时高烧濒死，反倒激出了体内一丝灵觉，往后修行时更能感知气机流转。',
    bonuses: { cultivationFlatBonus: 2 },
    starting: { cultivation: 60, learnedTechs: ['juqi_rumen'] },
  },
  {
    id: 'ring_elder',
    label: '戒指老爷爷',
    title: '少年机遇',
    description: '少年时得到一枚古戒，偶有残魂低声指点，让你在入门阶段少走许多弯路。',
    bonuses: { cultivationFlatBonus: 3, treasureCostMultiplier: -0.04 },
    starting: { learnedTechs: ['juqi_rumen'], ownedRecipes: ['recipe_cuiti'], inventory: { wu_sha: 8, gu_yin: 6 } },
  },
  {
    id: 'hidden_cave',
    label: '误入洞府',
    title: '少年机遇',
    description: '少年时误闯荒山洞府，带走一些丹方、灵材与残留宝物。',
    bonuses: { treasureCostMultiplier: -0.03 },
    starting: { ownedRecipes: ['recipe_yanghun_jing'], inventory: { yanghun_jingdan: 1, chi_yu: 10, gu_yin: 8 } },
  },
  {
    id: 'broken_engagement',
    label: '背负退婚',
    title: '青年机遇',
    description: '青年时受尽羞辱，被迫立誓雪耻，从此心志更坚，修行也多了几分狠劲。',
    bonuses: { attackBonus: 4, cultivationFlatBonus: 2 },
    starting: { spiritStones: 150, inventory: { longli_dan: 2 } },
  },
  {
    id: 'clan_massacre',
    label: '惨遭灭门',
    title: '青年机遇',
    description: '家门被屠后你流亡四方，虽失去一切，却也逼出了更强的求生与复仇执念。',
    bonuses: { speedBonus: 2, hpBonus: 12 },
    starting: { spiritStones: 180, inventory: { shenxing_dan: 1, longli_dan: 1 } },
  },
  {
    id: 'old_master',
    label: '高人点化',
    title: '青年机遇',
    description: '落魄时遇见云游前辈，对方替你点破吐纳关窍，使你真正踏上修行之路。',
    bonuses: { cultivationFlatBonus: 2, hpBonus: 8 },
    starting: { learnedTechs: ['juqi_rumen'], cultivation: 90 },
  },
]

const DEFAULT_IDS = {
  gender: GENDER_OPTIONS[0].id,
  background: BACKGROUND_OPTIONS[0].id,
  destiny: DESTINY_OPTIONS[0].id,
}

function combinations(source, size, start = 0, prefix = [], result = []) {
  if (prefix.length === size) {
    result.push(prefix)
    return result
  }
  for (let i = start; i < source.length; i += 1) {
    combinations(source, size, i + 1, [...prefix, source[i]], result)
  }
  return result
}

function sumBonuses(parts) {
  return parts.reduce((sum, part) => ({
    attackBonus: sum.attackBonus + (part.attackBonus ?? 0),
    hpBonus: sum.hpBonus + (part.hpBonus ?? 0),
    speedBonus: sum.speedBonus + (part.speedBonus ?? 0),
    cultivationFlatBonus: sum.cultivationFlatBonus + (part.cultivationFlatBonus ?? 0),
    cultivationRateMultiplier: sum.cultivationRateMultiplier * (part.cultivationRateMultiplier ?? 1),
    treasureCostMultiplier: sum.treasureCostMultiplier + (part.treasureCostMultiplier ?? 0),
  }), {
    attackBonus: 0,
    hpBonus: 0,
    speedBonus: 0,
    cultivationFlatBonus: 0,
    cultivationRateMultiplier: 1,
    treasureCostMultiplier: 0,
  })
}

function formatMultiplier(value) {
  return `${Math.round(value * 100)}%`
}

function buildEffectSummary(bonuses) {
  const chunks = []
  if (bonuses.attackBonus) chunks.push(`攻击 ${bonuses.attackBonus > 0 ? '+' : ''}${bonuses.attackBonus}`)
  if (bonuses.hpBonus) chunks.push(`血量 ${bonuses.hpBonus > 0 ? '+' : ''}${bonuses.hpBonus}`)
  if (bonuses.speedBonus) chunks.push(`速度 ${bonuses.speedBonus > 0 ? '+' : ''}${bonuses.speedBonus}`)
  if (bonuses.cultivationFlatBonus) chunks.push(`每轮修炼 ${bonuses.cultivationFlatBonus > 0 ? '+' : ''}${bonuses.cultivationFlatBonus}`)
  if (bonuses.cultivationRateMultiplier && Math.abs(bonuses.cultivationRateMultiplier - 1) > 0.001) {
    chunks.push(`修炼效率 ${formatMultiplier(bonuses.cultivationRateMultiplier)}`)
  }
  if (bonuses.treasureCostMultiplier && Math.abs(bonuses.treasureCostMultiplier) > 0.001) {
    chunks.push(`灵材消耗 ${formatMultiplier(1 + bonuses.treasureCostMultiplier)}`)
  }
  return chunks.join('，')
}

function createBasicRootOption(elements) {
  const count = elements.length
  const countConfig = ROOT_COUNT_CONFIG[count]
  const labels = elements.map((item) => item.label)
  const rootLabel = `${labels.join('')}${countConfig.title}`
  const elementBonuses = sumBonuses(elements.map((item) => item.bonuses))
  const finalBonuses = {
    ...elementBonuses,
    cultivationRateMultiplier: (elementBonuses.cultivationRateMultiplier ?? 1) * countConfig.cultivationRateMultiplier,
    treasureCostMultiplier: (elementBonuses.treasureCostMultiplier ?? 0) + (countConfig.treasureCostMultiplier - 1),
  }
  return {
    id: `root_${elements.map((item) => item.id).join('_')}`,
    label: rootLabel,
    title: countConfig.title,
    description: `${countConfig.description} 由${labels.join('、')}灵气共同构成。`,
    elements: labels,
    count,
    type: countConfig.title,
    bonuses: finalBonuses,
    effectSummary: buildEffectSummary(finalBonuses),
  }
}

function createExoticRootOption(root) {
  return {
    id: `root_${root.id}`,
    label: root.title,
    title: '异灵根',
    description: root.description,
    elements: [root.label],
    count: 1,
    type: '异灵根',
    bonuses: root.bonuses,
    effectSummary: buildEffectSummary(root.bonuses),
  }
}

function createDynamicRootOptionByElements(ids) {
  const selected = normalizeSpiritRoot(ids)
    .map((id) => ELEMENT_OPTIONS.find((option) => option.id === id))
    .filter(Boolean)

  if (selected.length === 0) {
    return createDynamicRootOptionByElements(['water'])
  }

  const count = Math.min(5, selected.length)
  const countConfig = ROOT_COUNT_CONFIG[count]
  const labels = selected.map((item) => item.label)
  const exoticCount = selected.filter((item) => item.exotic).length
  const elementBonuses = sumBonuses(selected.map((item) => item.bonuses))
  const finalBonuses = {
    ...elementBonuses,
    cultivationRateMultiplier: (elementBonuses.cultivationRateMultiplier ?? 1) * countConfig.cultivationRateMultiplier,
    treasureCostMultiplier: (elementBonuses.treasureCostMultiplier ?? 0) + (countConfig.treasureCostMultiplier - 1),
  }
  const type = selected.length === 1 && exoticCount === 1 ? '异灵根' : countConfig.title
  const description = selected.length === 1 && exoticCount === 1
    ? `${labels[0]}系灵气极为稀有，天赋与特性都更鲜明。`
    : `${countConfig.description} 当前由${labels.join('、')}灵气组合而成。`

  return {
    id: `root_${selected.map((item) => item.id).join('_')}`,
    label: selected.length === 1 && exoticCount === 1 ? `${labels[0]}灵根` : `${labels.join('')}${type}`,
    title: type,
    description,
    elements: labels,
    count: selected.length,
    type,
    bonuses: finalBonuses,
    effectSummary: buildEffectSummary(finalBonuses),
  }
}

const basicRootOptions = [1, 2, 3, 4, 5]
  .flatMap((size) => combinations(BASIC_ELEMENTS, size).map((combo) => createBasicRootOption(combo)))

const exoticRootOptions = EXOTIC_ELEMENTS.map(createExoticRootOption)

export const SPIRIT_ROOT_OPTIONS = [...basicRootOptions, ...exoticRootOptions]

function withEffectSummary(option) {
  const starting = option.starting ?? {}
  const bonuses = {
    attackBonus: option.bonuses?.attackBonus ?? 0,
    hpBonus: option.bonuses?.hpBonus ?? 0,
    speedBonus: option.bonuses?.speedBonus ?? 0,
    cultivationFlatBonus: option.bonuses?.cultivationFlatBonus ?? 0,
    cultivationRateMultiplier: option.bonuses?.cultivationRateMultiplier ?? 1,
    treasureCostMultiplier: option.bonuses?.treasureCostMultiplier ?? 0,
  }
  const chunks = []
  if (starting.spiritStones) chunks.push(`初始灵石 ${starting.spiritStones}`)
  const invText = Object.entries(starting.inventory ?? {})
    .map(([itemId, count]) => `${getItemById(itemId)?.name ?? itemId} x${count}`)
    .slice(0, 3)
  const recipeText = (starting.ownedRecipes ?? []).slice(0, 2).map((itemId) => getItemById(itemId)?.name ?? itemId)
  const furnaceText = (starting.ownedFurnaces ?? []).slice(0, 2).map((itemId) => getItemById(itemId)?.name ?? itemId)
  if (invText.length > 0) chunks.push(`物资 ${invText.join('、')}`)
  if (recipeText.length > 0) chunks.push(`丹方 ${recipeText.join('、')}`)
  if (furnaceText.length > 0) chunks.push(`丹炉 ${furnaceText.join('、')}`)
  const effectSummary = [buildEffectSummary(bonuses), ...chunks].filter(Boolean).join('，')
  return { ...option, effectSummary }
}

export const ENRICHED_BACKGROUND_OPTIONS = BACKGROUND_OPTIONS.map(withEffectSummary)
export const ENRICHED_DESTINY_OPTIONS = DESTINY_OPTIONS.map(withEffectSummary)

export function getDefaultCharacterProfile() {
  return {
    name: '林清玄',
    gender: DEFAULT_IDS.gender,
    spiritRoot: ['water'],
    background: DEFAULT_IDS.background,
    destiny: DEFAULT_IDS.destiny,
  }
}

function normalizeSpiritRoot(value) {
  if (Array.isArray(value)) {
    const orderMap = new Map(ELEMENT_OPTIONS.map((option, index) => [option.id, index]))
    const normalized = [...new Set(
      value
        .map((id) => String(id))
        .filter((id) => ELEMENT_OPTIONS.some((option) => option.id === id)),
    )]
    if (normalized.length > 0) return normalized.sort((a, b) => (orderMap.get(a) ?? 0) - (orderMap.get(b) ?? 0))
  }

  if (typeof value === 'string') {
    const matched = SPIRIT_ROOT_OPTIONS.find((option) => option.id === value)
    if (matched) {
      return matched.id.replace(/^root_/, '').split('_')
    }
    const single = ELEMENT_OPTIONS.find((option) => option.id === value)
    if (single) return [single.id]
  }

  return ['water']
}

function findOption(options, id) {
  return options.find((option) => option.id === id) ?? options[0]
}

export function getSpiritRootOptionByElements(value) {
  const normalized = normalizeSpiritRoot(value)
  const id = `root_${normalized.join('_')}`
  return SPIRIT_ROOT_OPTIONS.find((option) => option.id === id) ?? createDynamicRootOptionByElements(normalized)
}

export function normalizeCharacterProfile(profile) {
  if (!profile) return null
  return {
    name: String(profile.name ?? '').trim() || '无名散修',
    gender: findOption(GENDER_OPTIONS, profile.gender).id,
    spiritRoot: normalizeSpiritRoot(profile.spiritRoot),
    background: findOption(ENRICHED_BACKGROUND_OPTIONS, profile.background).id,
    destiny: findOption(ENRICHED_DESTINY_OPTIONS, profile.destiny).id,
  }
}

export function getCharacterSelection(profile) {
  const normalized = normalizeCharacterProfile(profile) ?? getDefaultCharacterProfile()
  return {
    gender: findOption(GENDER_OPTIONS, normalized.gender),
    spiritRoot: getSpiritRootOptionByElements(normalized.spiritRoot),
    background: findOption(ENRICHED_BACKGROUND_OPTIONS, normalized.background),
    destiny: findOption(ENRICHED_DESTINY_OPTIONS, normalized.destiny),
  }
}

export function getCharacterBonuses(profile) {
  const { spiritRoot, background, destiny } = getCharacterSelection(profile)
  const merged = sumBonuses([spiritRoot.bonuses, background.bonuses, destiny.bonuses])
  return {
    attackBonus: merged.attackBonus,
    hpBonus: merged.hpBonus,
    speedBonus: merged.speedBonus,
    cultivationFlatBonus: merged.cultivationFlatBonus,
    cultivationRateMultiplier: merged.cultivationRateMultiplier,
    treasureCostMultiplier: Math.max(0.75, 1 + merged.treasureCostMultiplier),
  }
}
