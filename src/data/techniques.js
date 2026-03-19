/**
 * 功法数据：凡/黄/玄/地/天 五品
 * 典籍名参考金庸、斗罗大陆、斗破苍穹、凡人修仙传等作品中的常见武学/功法名目
 */

export const TECH_TIERS = ['凡品', '黄品', '玄品', '地品', '天品']

export const TECHNIQUE_MASTERY_STAGES = [
  { id: 'beginner', label: '初窥门径', exp: 0 },
  { id: 'minor', label: '略有小成', exp: 3 },
  { id: 'skilled', label: '登堂入室', exp: 6 },
  { id: 'refined', label: '炉火纯青', exp: 10 },
  { id: 'mastered', label: '融会贯通', exp: 15 },
  { id: 'peak', label: '登峰造极', exp: 21 },
  { id: 'returning', label: '返朴归真', exp: 28 },
  { id: 'divine', label: '出神入化', exp: 36 },
  { id: 'transcendent', label: '超凡脱俗', exp: 45 },
]

export const TECH_TIER_PROFILES = {
  '凡品': { baseMultiplier: 1, growthMultiplier: 1 },
  '黄品': { baseMultiplier: 1.18, growthMultiplier: 1.2 },
  '玄品': { baseMultiplier: 1.42, growthMultiplier: 1.48 },
  '地品': { baseMultiplier: 1.75, growthMultiplier: 1.88 },
  '天品': { baseMultiplier: 2.15, growthMultiplier: 2.35 },
}

function tech(
  id,
  {
    name,
    tier,
    type,
    source,
    desc,
    obtainHint,
    unlockCost = 0,
    bonuses = {},
    growth = {},
  },
) {
  return {
    id,
    name,
    tier,
    type,
    source,
    desc,
    obtainHint,
    unlockCost,
    bonuses: {
      cultivationBonus: bonuses.cultivationBonus ?? 0,
      attackBonus: bonuses.attackBonus ?? 0,
      hpBonus: bonuses.hpBonus ?? 0,
      speedBonus: bonuses.speedBonus ?? 0,
    },
    growth: {
      cultivationBonus: growth.cultivationBonus ?? 0,
      attackBonus: growth.attackBonus ?? 0,
      hpBonus: growth.hpBonus ?? 0,
      speedBonus: growth.speedBonus ?? 0,
    },
  }
}

export const TECHNIQUES = {
  juqi_rumen: tech('juqi_rumen', {
    name: '聚气入门',
    tier: '凡品',
    type: '吐纳心法',
    source: '原创',
    desc: '最基础的吐纳法门，重在引气入体、搬运周天与稳固根基。虽然品阶不高，却胜在中正平和，适合作为初入仙途时的第一本启蒙心法。',
    obtainHint: '初始解锁',
    bonuses: { cultivationBonus: 8 },
    growth: { cultivationBonus: 1 },
  }),
  xuanyu_shou: tech('xuanyu_shou', {
    name: '玄玉手',
    tier: '凡品',
    type: '外门秘技',
    source: '斗罗大陆',
    desc: '以双手淬炼筋骨与掌力的外门秘技，修习之后双掌坚韧如玉，兼具近身攻伐与防御效果。虽属低阶典籍，但对打磨肉身和实战过渡极有帮助。',
    obtainHint: '商店购得 / 奇遇所得',
    unlockCost: 120,
    bonuses: { attackBonus: 4, hpBonus: 8 },
    growth: { attackBonus: 1, hpBonus: 2 },
  }),
  ziji_motong: tech('ziji_motong', {
    name: '紫极魔瞳',
    tier: '凡品',
    type: '瞳术秘法',
    source: '斗罗大陆',
    desc: '偏重神识与观察的秘术，强调凝神、观势与先机捕捉。修成之后可使目力、判断与临战反应更上一层，适合走灵动敏锐路线的修士。',
    obtainHint: '商店购得 / 机遇所得',
    unlockCost: 150,
    bonuses: { speedBonus: 2, cultivationBonus: 4 },
    growth: { speedBonus: 1, cultivationBonus: 1 },
  }),
  guiying_mizong: tech('guiying_mizong', {
    name: '鬼影迷踪',
    tier: '黄品',
    type: '身法',
    source: '斗罗大陆',
    desc: '轻灵诡谲的步法，讲究脚步虚实变化与身形错位，擅长腾挪闪转、拉扯战局与规避正面硬碰。对提升机动性和周旋能力尤为明显。',
    obtainHint: '商店购得 / 奇遇所得',
    unlockCost: 260,
    bonuses: { speedBonus: 5 },
    growth: { speedBonus: 1 },
  }),
  xuantian_gong: tech('xuantian_gong', {
    name: '玄天功',
    tier: '黄品',
    type: '内功心法',
    source: '斗罗大陆',
    desc: '中正平和的内功路数，重视根基、经脉与真气纯度，适合作为长期修炼的基础主功法。前期稳健，中后期也能持续提供可观的修行收益。',
    obtainHint: '商店购得 / 宗门传承 / 奇遇所得',
    unlockCost: 320,
    bonuses: { cultivationBonus: 12, hpBonus: 12 },
    growth: { cultivationBonus: 2, hpBonus: 2 },
  }),
  yiyang_zhi: tech('yiyang_zhi', {
    name: '一阳指',
    tier: '黄品',
    type: '指法',
    source: '金庸小说',
    desc: '将真气凝于指端，以一点破面，兼具点穴、伤敌与截脉之能。此法出手稳准，节奏凌厉，适合偏重单点爆发与精准打击的修士。',
    obtainHint: '商店购得 / 奇遇所得',
    unlockCost: 360,
    bonuses: { attackBonus: 7 },
    growth: { attackBonus: 2 },
  }),
  qingyuan_jianjue: tech('qingyuan_jianjue', {
    name: '青元剑诀',
    tier: '玄品',
    type: '剑诀',
    source: '凡人修仙传',
    desc: '攻守兼备的修仙剑诀，重在真元运转、飞剑御使与连贯剑势的构建。修成之后不但能提高攻伐威能，也能让日常修炼更具体系与效率。',
    obtainHint: '商店购得 / 洞府奇遇',
    unlockCost: 520,
    bonuses: { attackBonus: 8, cultivationBonus: 8 },
    growth: { attackBonus: 2, cultivationBonus: 1 },
  }),
  lingbo_weibu: tech('lingbo_weibu', {
    name: '凌波微步',
    tier: '玄品',
    type: '身法',
    source: '金庸小说',
    desc: '腾挪变化极强的轻功步法，行气与步法彼此相合，施展开来宛若游龙掠水。无论是追击、退避还是拉开距离，都能展现极强的灵动性。',
    obtainHint: '商店购得 / 残卷奇遇',
    unlockCost: 560,
    bonuses: { speedBonus: 8, cultivationBonus: 4 },
    growth: { speedBonus: 1, cultivationBonus: 1 },
  }),
  dalong_shibazhang: tech('dalong_shibazhang', {
    name: '降龙十八掌',
    tier: '玄品',
    type: '掌法',
    source: '金庸小说',
    desc: '刚猛霸道的顶尖掌法，讲究掌势如潮、气血如龙，以堂皇正面的压制力碾碎敌手。每一掌都偏重爆发与威慑，极适合强攻型路线。',
    obtainHint: '商店购得 / 机缘传承',
    unlockCost: 620,
    bonuses: { attackBonus: 11, hpBonus: 10 },
    growth: { attackBonus: 2, hpBonus: 2 },
  }),
  dayan_jue: tech('dayan_jue', {
    name: '大衍诀',
    tier: '玄品',
    type: '神识秘法',
    source: '凡人修仙传',
    desc: '偏重神识与推演的高阶典籍，讲究心神分化、识海稳固与长久积累。并不追求瞬时爆发，却极适合走长期沉淀、厚积薄发的修炼路线。',
    obtainHint: '商店购得 / 上古遗府',
    unlockCost: 700,
    bonuses: { cultivationBonus: 16, speedBonus: 2 },
    growth: { cultivationBonus: 2, speedBonus: 1 },
  }),
  jiuyin_zhenjing: tech('jiuyin_zhenjing', {
    name: '九阴真经',
    tier: '地品',
    type: '经书总纲',
    source: '金庸小说',
    desc: '内功、身法、招式兼备的综合性经书，内容驳杂却体系完备。若能长期参悟，既可提升日常修行效率，也能逐步夯实体魄、攻势与应变能力。',
    obtainHint: '商店购得 / 稀有奇遇',
    unlockCost: 1200,
    bonuses: { cultivationBonus: 18, attackBonus: 8, hpBonus: 16, speedBonus: 2 },
    growth: { cultivationBonus: 2, attackBonus: 1, hpBonus: 2, speedBonus: 1 },
  }),
  qiankun_danuoyi: tech('qiankun_danuoyi', {
    name: '乾坤大挪移',
    tier: '地品',
    type: '挪移秘法',
    source: '金庸小说',
    desc: '善于转卸劲力、牵引真气与临战变化的高阶秘法，越熟练越能体会借力打力、四两拨千斤的奥妙。适合擅长拆招与以弱制强的修士。',
    obtainHint: '商店购得 / 奇遇所得',
    unlockCost: 1450,
    bonuses: { hpBonus: 26, speedBonus: 4 },
    growth: { hpBonus: 3, speedBonus: 1 },
  }),
  fenjue: tech('fenjue', {
    name: '焚诀',
    tier: '地品',
    type: '火系功法',
    source: '斗破苍穹',
    desc: '以火为根的高成长型功法，前期便有不俗爆发，中后期潜力尤为惊人。此法兼顾攻伐威力与修炼成长，极适合追求上限的长期路线。',
    obtainHint: '商店购得 / 异火机缘',
    unlockCost: 1680,
    bonuses: { cultivationBonus: 14, attackBonus: 10 },
    growth: { cultivationBonus: 2, attackBonus: 2 },
  }),
  dugu_jiujian: tech('dugu_jiujian', {
    name: '独孤九剑',
    tier: '天品',
    type: '剑道总纲',
    source: '金庸小说',
    desc: '偏重悟性、洞察与变化的极高阶剑道典籍，不拘泥于固定招式，而重在见招拆招、后发先至。熟练度越高，越能显出其压倒性的剑理优势。',
    obtainHint: '奇遇所得 / 绝顶传承',
    unlockCost: 0,
    bonuses: { attackBonus: 18, speedBonus: 6 },
    growth: { attackBonus: 3, speedBonus: 1 },
  }),
  tai_xuan_jing: tech('tai_xuan_jing', {
    name: '太玄经',
    tier: '天品',
    type: '总纲心法',
    source: '金庸小说',
    desc: '兼具内功与招意的大成典籍，强调以心御气、以意化招，重悟而不重形。此书越到后期越能体现价值，适合作为冲击巅峰的底牌功法。',
    obtainHint: '奇遇所得 / 残碑参悟',
    unlockCost: 0,
    bonuses: { cultivationBonus: 24, attackBonus: 10, hpBonus: 18 },
    growth: { cultivationBonus: 3, attackBonus: 2, hpBonus: 2 },
  }),
  foxing_huasheng_jue: tech('foxing_huasheng_jue', {
    name: '佛怒化生诀',
    tier: '天品',
    type: '火道秘典',
    source: '斗破苍穹 / 灵感整合',
    desc: '以火道爆发与生生不息并行的高阶功法，既追求瞬间摧枯拉朽的杀伤，也追求持续不断的真元运转。属于上限极高、成长性极强的火道典籍。',
    obtainHint: '异火奇遇 / 上古传承',
    unlockCost: 0,
    bonuses: { cultivationBonus: 20, attackBonus: 14, speedBonus: 4 },
    growth: { cultivationBonus: 3, attackBonus: 2, speedBonus: 1 },
  }),
}

export const INITIAL_AVAILABLE_TECHNIQUES = ['juqi_rumen', 'xuanyu_shou', 'ziji_motong']

export function getTechniqueById(id) {
  return TECHNIQUES[id] ?? null
}

export function getTechniqueMasteryExp(masteryMap, techId) {
  return masteryMap?.[techId] ?? 0
}

export function getTechniqueMasteryStage(exp = 0) {
  let current = TECHNIQUE_MASTERY_STAGES[0]
  for (const stage of TECHNIQUE_MASTERY_STAGES) {
    if (exp >= stage.exp) current = stage
  }
  return current
}

export function getTechniqueMasteryStageById(masteryMap, techId) {
  return getTechniqueMasteryStage(getTechniqueMasteryExp(masteryMap, techId))
}

export function getTechniqueNextMasteryStage(exp = 0) {
  return TECHNIQUE_MASTERY_STAGES.find((stage) => stage.exp > exp) ?? null
}

export function getTechniqueEffectiveBonuses(tech, exp = 0) {
  if (!tech) {
    return { cultivationBonus: 0, attackBonus: 0, hpBonus: 0, speedBonus: 0 }
  }
  const stage = getTechniqueMasteryStage(exp)
  const stageIndex = TECHNIQUE_MASTERY_STAGES.findIndex((item) => item.id === stage.id)
  const tierProfile = TECH_TIER_PROFILES[tech.tier] ?? TECH_TIER_PROFILES['凡品']
  return {
    cultivationBonus: Math.round(tech.bonuses.cultivationBonus * tierProfile.baseMultiplier + tech.growth.cultivationBonus * tierProfile.growthMultiplier * stageIndex),
    attackBonus: Math.round(tech.bonuses.attackBonus * tierProfile.baseMultiplier + tech.growth.attackBonus * tierProfile.growthMultiplier * stageIndex),
    hpBonus: Math.round(tech.bonuses.hpBonus * tierProfile.baseMultiplier + tech.growth.hpBonus * tierProfile.growthMultiplier * stageIndex),
    speedBonus: Math.round(tech.bonuses.speedBonus * tierProfile.baseMultiplier + tech.growth.speedBonus * tierProfile.growthMultiplier * stageIndex),
  }
}
