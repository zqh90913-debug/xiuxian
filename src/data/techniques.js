/**
 * 功法数据：凡/黄/玄/地/天 五品
 * 典籍名参考金庸、斗罗大陆、斗破苍穹、凡人修仙传等作品中的常见武学/功法名目
 */

export const TECH_TIERS = ['凡品', '黄品', '玄品', '地品', '天品']
export const TECH_TIER_UNLOCK_COSTS = {
  '凡品': 100,
  '黄品': 200,
  '玄品': 400,
  '地品': 800,
  '天品': 1600,
}

export const TECHNIQUE_MASTERY_STAGES = [
  { id: 'beginner', label: '初窥门径', exp: 0 },
  { id: 'minor', label: '略有小成', exp: 3 },
  { id: 'skilled', label: '登堂入室', exp: 6 },
  { id: 'refined', label: '炉火纯青', exp: 9 },
  { id: 'mastered', label: '融会贯通', exp: 12 },
  { id: 'peak', label: '登峰造极', exp: 15 },
  { id: 'returning', label: '返朴归真', exp: 18 },
  { id: 'divine', label: '出神入化', exp: 21 },
  { id: 'transcendent', label: '超凡脱俗', exp: 24 },
]

export const TECHNIQUE_MAX_MASTERY_EXP = TECHNIQUE_MASTERY_STAGES[TECHNIQUE_MASTERY_STAGES.length - 1].exp

/** 功法感悟单次读条时长（毫秒），按典籍品级 */
export const TECHNIQUE_CONTEMPLATE_DURATION_MS = {
  凡品: 30_000,
  黄品: 30_000,
  玄品: 30_000,
  地品: 60_000,
  天品: 300_000,
}

export const TECH_TIER_PROFILES = {
  '凡品': { baseMultiplier: 1, growthMultiplier: 1 },
  '黄品': { baseMultiplier: 1, growthMultiplier: 1.18 },
  '玄品': { baseMultiplier: 1, growthMultiplier: 1.36 },
  '地品': { baseMultiplier: 1, growthMultiplier: 1.66 },
  '天品': { baseMultiplier: 1, growthMultiplier: 2.02 },
}

const TECH_TIER_BASE_TOTALS = {
  '凡品': 100,
  '黄品': 400,
  '玄品': 1000,
  '地品': 3000,
  '天品': 6000,
}

const TECH_TIER_GROWTH_RATES = {
  '凡品': 0.04,
  '黄品': 0.035,
  '玄品': 0.03,
  '地品': 0.028,
  '天品': 0.025,
}

const TECHNIQUE_SPEED_WEIGHT_MULTIPLIER = 0.6
const TECHNIQUE_SPEED_EFFECTIVE_MULTIPLIER = 0.58

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

function inferGeneratedType(name) {
  if (/剑/.test(name)) return '剑法'
  if (/拳/.test(name)) return '拳法'
  if (/掌|手/.test(name)) return '掌法'
  if (/指/.test(name)) return '指法'
  if (/遁术|轻功|纵跃|乘风|身/.test(name)) return '身法'
  if (/咒|真言|神通|门/.test(name)) return '神通'
  if (/诀|心诀|心法/.test(name)) return '心法'
  if (/功/.test(name)) return '功法'
  if (/术/.test(name)) return '秘术'
  if (/劲|崩/.test(name)) return '劲法'
  return '秘法'
}

function distributeAttributeTotal(total, weights) {
  const keys = ['cultivationBonus', 'attackBonus', 'hpBonus', 'speedBonus']
  const safeWeights = Object.fromEntries(keys.map((key) => [key, Math.max(0, weights[key] ?? 0)]))
  const weightSum = keys.reduce((sum, key) => sum + safeWeights[key], 0) || keys.length
  const rawEntries = keys.map((key) => {
    const raw = total * (safeWeights[key] / weightSum)
    return { key, value: Math.floor(raw), remainder: raw - Math.floor(raw) }
  })

  let assigned = rawEntries.reduce((sum, entry) => sum + entry.value, 0)
  rawEntries
    .sort((a, b) => b.remainder - a.remainder)
    .forEach((entry) => {
      if (assigned >= total) return
      entry.value += 1
      assigned += 1
    })

  return Object.fromEntries(rawEntries.map((entry) => [entry.key, entry.value]))
}

function getTechniqueSeed(text = '') {
  return Array.from(text).reduce((sum, char, index) => sum + char.charCodeAt(0) * (index + 1), 0)
}

function inferTechniqueAttributeWeights(tech) {
  const text = `${tech.name} ${tech.type ?? ''}`
  const seed = getTechniqueSeed(text)
  const weights = {
    cultivationBonus: 1,
    attackBonus: 1,
    hpBonus: 1,
    speedBonus: 1,
  }

  if (/诀|经|心法|心诀|玄功|功|吐纳|导引|源流|洞观|真言|长生|枯荣|太玄|圣贤/.test(text)) {
    weights.cultivationBonus += 6
  }
  if (/剑|刀|枪|戟|拳|掌|指|手|劲|崩|印|灭神|诛神|掌法|指法|剑诀|剑法/.test(text)) {
    weights.attackBonus += 6
  }
  if (/身法|轻功|遁术|遁甲|迷踪|凌波|纵跃|乘风|步|缥缈|星辰|瞳/.test(text)) {
    weights.speedBonus += 5
  }
  if (/金刚|龟|龙象|炼体|护体|玄玉|忘情|般若|大挪移|山海|度厄|肉身/.test(text)) {
    weights.hpBonus += 5
  }

  if (/火|雷|诛神|灭神|黄泉|毒|魔/.test(text)) {
    weights.attackBonus += 3
  }
  if (/冰|寒|阴/.test(text)) {
    weights.attackBonus += 1
    weights.hpBonus += 2
  }
  if (/魂|瞳|神识|真言|洞观|拘灵/.test(text)) {
    weights.cultivationBonus += 3
    weights.speedBonus += 2
  }
  if (/导引|吐纳|素问|长生|养|聚气|炼气/.test(text)) {
    weights.cultivationBonus += 3
    weights.hpBonus += 2
  }
  if (/金蛇|灵猴|鬼影|凌波|落英/.test(text)) {
    weights.speedBonus += 3
    weights.attackBonus += 1
  }
  if (/乾坤|两仪|太古|东帝|帝印|寰宇|天仙|大品|九阴|真武|玄天/.test(text)) {
    weights.cultivationBonus += 2
    weights.attackBonus += 2
    weights.hpBonus += 2
    weights.speedBonus += 1
  }
  if (/降龙|困龙|霸王|开碑|翻天|大荒/.test(text)) {
    weights.attackBonus += 3
    weights.hpBonus += 2
  }

  const nudge = [
    ['cultivationBonus', (seed % 3) + 1],
    ['attackBonus', (Math.floor(seed / 3) % 3) + 1],
    ['hpBonus', (Math.floor(seed / 5) % 3) + 1],
    ['speedBonus', (Math.floor(seed / 7) % 3) + 1],
  ]
  nudge.forEach(([key, value], index) => {
    weights[key] += value
    if ((seed + index) % 4 === 0) {
      weights[key] += 1
    }
  })

  weights.speedBonus = Math.max(1, Math.round(weights.speedBonus * TECHNIQUE_SPEED_WEIGHT_MULTIPLIER))

  return weights
}

const GENERATED_TECHNIQUE_DESCS = {
  yunyu_jin: '以陨玉碎纹为引的劲法，发力时讲究先沉后炸，常能在对掌一瞬把暗劲打进对手骨缝。',
  youshen_jin: '重在活肩松胯与游走卸力，修成后身形像水蛇贴地，最适合边退边打的缠斗路数。',
  lianqi_jue: '最朴素的炼气法门，专教人如何引外气入丹田，胜在路子平稳，不容易练岔经脉。',
  xuantian_gong: '以清正绵长见长的基础内功，修习时真气运转如细流归海，适合慢慢养出厚实根基。',
  dulong_gong: '将毒息裹入周身经络的阴狠法门，出手不求一击毙命，却擅长让伤势越拖越重。',
  qianji_beng: '崩劲重在寸距爆发，脚下只要踩稳地脉，拳肘肩背都能瞬间拧出石破天惊的一震。',
  kunlong_quan: '拳势如锁，讲究先封步位再打中宫，一旦被缠住节奏，往往很难再从拳影里脱身。',
  daoyin_shu: '古修士遗下的引导术，偏重梳理呼吸与经络温养，适合作为每日调息打底的辅助法门。',
  kaibei_shou: '掌缘如斧，出手时专劈筋骨节点，若被正面拍中，往往有种石碑迎头砸下的沉重感。',
  chengfeng_xinjue: '借风行气的轻灵心诀，真元沿经络流过时细而快，最适合提升身法与腾挪时的续力。',
  liehuo_zhang: '掌心蓄热，出掌时仿佛火炭贴骨，招式不繁，却胜在一掌一掌烧得敌人难以近身。',
  konghe_jin: '原理在借力牵引，能把迎面而来的劲道顺势拨偏，再反手还给对面，极考验手眼配合。',
  manjianghong: '一门越战越烈的血气法，运行时胸中鼓荡如潮，打到兴起时气势会节节攀升。',
  jinshe_qinggong: '步法斜折诡变，去路看似散乱，实则处处藏着逼近角度，最适合短距突袭和绕背。',
  xuanyin_jianfa: '剑路阴柔含煞，剑尖总往经脉窍穴上挑，若不熟悉这套路数，很容易在拆招时中寒气。',
  canglang_jin: '劲法取苍狼扑猎之意，起手并不华丽，却极擅长连续扑压，把人一步步逼进死角。',
  wanren_jianfa: '招式大开大合，重在以量叠势，舞到兴起时像成百上千道锋芒一齐压落。',
  lianshan_jianfa: '剑势层层推进，如山峦相叠，一剑未尽一剑又起，最适合稳稳吞掉对手的反击空间。',
  sanfen_jianfa: '讲究三分虚实、三分快慢、三分攻守，真正厉害处不在一剑，而在变化交错时的出其不意。',
  jiuhua_zhang: '掌路看似端正秀雅，实则藏着九重后劲，硬接第一掌的人往往会在后面连吃暗亏。',
  qimen_dunshu: '偏门遁术不走正统身法路线，擅长借地形、烟尘与视线死角突然换位消失。',
  shuangquanshou: '双手同修，一手救人一手伤敌，练到高深时可在护体与制敌之间几乎无缝切换。',
  linghou_zongyue_gong: '专练腿脚筋膜与腾挪爆发，起落之间轻灵迅疾，特别适合屋檐林间这种复杂地形。',
  jinguang_zhou: '咒成则周身泛起淡淡金辉，既能稳神定胆，也能在危急时硬扛几分迎面杀势。',
  nandou_zhi: '指南斗杀机而创，指路狠准短促，最擅长在近身换招的刹那封住要害穴位。',
  due_gong: '以消灾化厄为意的护身功法，平日修炼不显山露水，关键时却很能替人顶住伤势反噬。',

  xiaojile_jin: '劲力行走奇经，打中人后并不立刻炸开，而是像细针一样顺着血脉慢慢扩散开来。',
  baishou_xuangong: '模仿百兽搏杀所创的杂糅功法，拳脚身法俱带兽性，越是混战越容易打出凶蛮压迫。',
  jiuhua_jue: '真气九转九收，修炼时极耗耐心，一旦练成，灵力凝练程度远胜同阶寻常法诀。',
  jingang_piaomiao_shentong: '表面刚猛如金刚，真正高明处却在身形飘忽，能把沉重招式打出难测轨迹。',
  huagu_shentong: '邪门法门，最擅长腐骨蚀肉，出招时往往不见血光，等痛意发作时伤势已深入骨髓。',
  suwen_xinfa: '走医理养身一路，擅长调和脏腑与气海，使修士在长期闭关中更少遭遇气机反噬。',
  wuyi_xinfa: '讲究山岳稳、泉流长，修炼节奏不快，却能让体内真气像层层山脉一样越积越厚。',
  niepan_shou: '此手法最妙处在破后而立，越是重伤之后越能逼出潜藏掌力，带着一种浴火翻生的狠劲。',
  shengui_tuna_shu: '呼吸法缓慢深长，如老龟伏息，最适合磨耐性、养元气，把气海一点点养到浑厚无比。',
  chansi_jin: '劲力绵缠不断，一旦贴住对手就如蛛丝裹身，能把敌人的每一次发力都拖得迟滞变形。',
  luoying_jianfa: '剑势轻灵纷散，像落花漫天一般难辨主次，真正的杀招往往藏在最柔软的那一片花影里。',
  liangyi_jue: '以阴阳相生相克推演气机，最擅长在进退、刚柔、攻守之间反复转换，不给人抓准节奏。',
  dinghui_shentong: '修神定念的法门，临敌时可强行压住心绪波动，不管外界多乱，出手都能保持稳定清明。',
  xiaoxiang_qi: '气机清寒绵长，像秋水夜雾一样悄悄侵入四肢百骸，最适合拖长回合慢慢磨死对手。',

  changsheng_jin: '劲法中自带养生意味，运劲时不但伤人，还能反过来温养自身气血，是少见的攻养合一之术。',
  wuji_xuangong: '法门恢弘平正，不偏寒热，不拘阴阳，真气越练越圆满，最适合作为中期主修根本功。',
  fenglong_gong: '传闻参照锁龙之意创出，真元一旦缠住目标，能让对手的爆发被强行压低数分。',
  hehuan_qixianggong: '香气入骨、幻意扰心，既有魅惑神识的阴柔，也有蚀人心防的狠毒，最擅长乱人道心。',
  jiuzi_zhenyan: '言出成势，每一个真言都能引动不同的气机变化，真正厉害之处在临阵应变无穷无尽。',
  dahuang_kuntian_zhi: '这一指不是求快，而是求重，点出时像荒原古岳一同压来，让人连提气都显艰难。',
  zhaixing_shou: '手法高远凌厉，专取上三路命门，传说练到深处真有探手摘星般的神异姿态。',
  ziwei_xinjue: '取紫微帝星之意入法，修炼时强调中宫稳固与统摄百脉，最适合压住躁进根性。',
  kurong_gong: '枯与荣在体内反复轮转，能把衰败死气转成新生之机，是一门危险却潜力极高的异功。',
  zhenwu_zhang: '掌势厚正雄浑，每一招都像大江拍岸，不求奇诡，只求把人硬生生震退三步。',
  yunv_suxin_jianfa: '双意相济、柔中藏锋，剑路细腻精确，一旦节奏对上，往往越打越显玲珑难破。',
  juling_qianjiang: '可牵引游离灵体与残留意念为己所用，真正交手时常会出现令人意想不到的诡变辅助。',
  nisheng_wuchong: '逆炼血肉筋骨的偏门法，痛苦极大，却能把本该衰弱的躯壳再次逼出惊人生命力。',
  shenji_qianlian: '心念与器物相合，擅长把灵材反复千炼，练到精深时连举手投足都带着机关算尽的精巧。',
  baku_xianzei: '重在吞纳与掠夺，能把外来精气转为自身补益，越是资源丰厚之地越能显出可怕成长性。',
  huitu_zhuansheng: '禁忌秘术，借死气逆推生机，虽然邪异，却能在绝境时把败局硬生生拖回一线。',
  lunhui_chuangsheng: '法门高远诡奇，讲究在毁灭与新生之间重塑气机，一旦施展，往往伴随着近乎违逆常理的恢复力。',
  liuzhong_luoshengmen: '门门相叠，防中藏杀，每开一重都像把战场再锁死一层，极适合正面迎压强敌。',
  bamen_dunjia: '激发体魄潜能的极端法门，开门越多越强，也越容易把自己逼到生死边缘。',
  zhenwu_shentong: '融拳掌身法为一炉的真武大道，攻守转换大气浑成，一旦起势便有压人心魄的宗师气象。',

  fenghuang_wuse_jin: '五色真劲交融轮转，打出去时层层相生相克，既有凤凰涅槃之生意，也有焚尽万邪的霸道。',
  chiling_zhushen_jue: '叱灵之声一出，神魂先乱三分，再以诛神杀意直斩识海，是一门专攻元神层面的狠诀。',
  daluo_dongguan: '此法不以蛮力取胜，真正强在洞观万象、先见后手，常能在出招前就看透整场斗法脉络。',
  tiangang_zhengshuo_wulei_juefa: '以天罡正朔统御五雷，法势一成便有天威垂落，最适合大开大阖地镇杀邪祟与强敌。',

  dongzhen_mieshen_jue: '专走灭神绝路，真元一旦运转便直指神魂本源，是那种听名字就知道不能轻易硬接的上乘杀诀。',
  yijian_kaitianmen: '剑意纯到极处，讲究把所有气机都压进一线锋芒，出手时真有劈开天门般的决绝气魄。',
  qitiyuanliu: '此法近乎返本归元，能把纷乱气机重新梳成一脉源流，越练越显大道归一的气象。',
  dapin_tianxian_jue: '仙家正统中的高位法门，修炼时如登层天玉阶，既养神魂又壮真元，是冲击顶峰的正宗大道。'
}

function buildGeneratedTechnique(id, name, tier) {
  const type = inferGeneratedType(name)
  const obtainHint = tier === '天品' ? '奇遇所得 / 宗门传承' : '商店购得 / 奇遇所得'
  return tech(id, {
    name,
    tier,
    type,
    source: '新增功法',
    desc: GENERATED_TECHNIQUE_DESCS[id] ?? `${name}为${tier}${type}，重在凝练真元、打磨招式与实战运转。修至高深处，可显著提升修炼效率与临阵斗法时的对应能力，是一门兼顾成长与实战的正统法门。`,
    obtainHint,
    unlockCost: tier === '天品' ? 0 : TECH_TIER_UNLOCK_COSTS[tier],
  })
}

const GENERATED_TECHNIQUE_CONFIGS = [
  ['yunyu_jin', '陨玉劲', '凡品'],
  ['youshen_jin', '游身劲', '凡品'],
  ['lianqi_jue', '炼气诀', '凡品'],
  ['xuantian_gong', '玄天功', '凡品'],
  ['dulong_gong', '毒龙功', '凡品'],
  ['qianji_beng', '千极崩', '凡品'],
  ['kunlong_quan', '困龙拳', '凡品'],
  ['daoyin_shu', '导引术', '凡品'],
  ['kaibei_shou', '开碑手', '凡品'],
  ['chengfeng_xinjue', '乘风心诀', '凡品'],
  ['liehuo_zhang', '烈火掌', '凡品'],
  ['konghe_jin', '控鹤劲', '凡品'],
  ['manjianghong', '满江红', '凡品'],
  ['jinshe_qinggong', '金蛇轻功', '凡品'],
  ['xuanyin_jianfa', '玄阴剑法', '凡品'],
  ['canglang_jin', '苍狼劲', '凡品'],
  ['wanren_jianfa', '万刃剑法', '凡品'],
  ['lianshan_jianfa', '连山剑法', '凡品'],
  ['sanfen_jianfa', '三分剑法', '凡品'],
  ['jiuhua_zhang', '九华掌', '凡品'],
  ['qimen_dunshu', '奇门遁术', '凡品'],
  ['shuangquanshou', '双全手', '凡品'],
  ['linghou_zongyue_gong', '灵猴纵跃功', '凡品'],
  ['jinguang_zhou', '金光咒', '凡品'],
  ['nandou_zhi', '南斗指', '凡品'],
  ['due_gong', '度厄功', '凡品'],

  ['xiaojile_jin', '小极乐劲', '黄品'],
  ['baishou_xuangong', '百兽玄功', '黄品'],
  ['jiuhua_jue', '九华诀', '黄品'],
  ['jingang_piaomiao_shentong', '金刚缥缈神通', '黄品'],
  ['huagu_shentong', '化骨神通', '黄品'],
  ['suwen_xinfa', '素问心法', '黄品'],
  ['wuyi_xinfa', '武夷心法', '黄品'],
  ['niepan_shou', '涅槃手', '黄品'],
  ['shengui_tuna_shu', '神龟吐纳术', '黄品'],
  ['chansi_jin', '缠丝劲', '黄品'],
  ['luoying_jianfa', '落英剑法', '黄品'],
  ['liangyi_jue', '两仪诀', '黄品'],
  ['dinghui_shentong', '定慧神通', '黄品'],
  ['xiaoxiang_qi', '潇湘气', '黄品'],

  ['changsheng_jin', '长生劲', '玄品'],
  ['wuji_xuangong', '无极玄功', '玄品'],
  ['fenglong_gong', '封龙功', '玄品'],
  ['hehuan_qixianggong', '合欢七香功', '玄品'],
  ['jiuzi_zhenyan', '九字真言', '玄品'],
  ['dahuang_kuntian_zhi', '大荒困天指', '玄品'],
  ['zhaixing_shou', '摘星手', '玄品'],
  ['ziwei_xinjue', '紫微心诀', '玄品'],
  ['kurong_gong', '枯荣功', '玄品'],
  ['zhenwu_zhang', '真武掌', '玄品'],
  ['yunv_suxin_jianfa', '玉女素心剑法', '玄品'],
  ['juling_qianjiang', '拘灵遣将', '玄品'],
  ['nisheng_wuchong', '逆生五重', '玄品'],
  ['shenji_qianlian', '神机千炼', '玄品'],
  ['baku_xianzei', '八库仙贼', '玄品'],
  ['huitu_zhuansheng', '秽土转世', '玄品'],
  ['lunhui_chuangsheng', '轮回创生', '玄品'],
  ['liuzhong_luoshengmen', '六重罗生门', '玄品'],
  ['bamen_dunjia', '八门遁甲', '玄品'],
  ['zhenwu_shentong', '真武神通', '玄品'],

  ['fenghuang_wuse_jin', '凤凰五色劲', '地品'],
  ['chiling_zhushen_jue', '叱灵诛神诀', '地品'],
  ['daluo_dongguan', '大罗洞观', '地品'],
  ['tiangang_zhengshuo_wulei_juefa', '天罡正朔五雷诀法', '地品'],

  ['dongzhen_mieshen_jue', '洞真灭神诀', '天品'],
  ['yijian_kaitianmen', '一剑开天门', '天品'],
  ['qitiyuanliu', '气体源流', '天品'],
  ['dapin_tianxian_jue', '大品天仙诀', '天品'],
]

const GENERATED_TECHNIQUES = Object.fromEntries(
  GENERATED_TECHNIQUE_CONFIGS.map(([id, name, tier]) => [id, buildGeneratedTechnique(id, name, tier)]),
)

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
  shengxian_xinfa: tech('shengxian_xinfa', {
    name: '圣贤心法',
    tier: '天品',
    type: '儒门心法',
    source: '东华书院宗门秘法',
    desc: '东华书院代代相传的正道心法，以浩然养气、明心见性为根本，修到深处可使神思清明、真元绵长，最擅长稳固根基与长久修行。',
    obtainHint: '东华书院宝库第三层',
    bonuses: { cultivationBonus: 22, hpBonus: 18 },
    growth: { cultivationBonus: 3, hpBonus: 2 },
  }),
  huangquan_zhi: tech('huangquan_zhi', {
    name: '黄泉指',
    tier: '天品',
    type: '指法',
    source: '幽冥窟宗门秘法',
    desc: '幽冥窟以阴寒死气淬炼而成的邪门指法，出手无声，专破护体灵光与经脉命门，指力阴狠诡异，越是近身越显凶威。',
    obtainHint: '幽冥窟宝库第三层',
    bonuses: { attackBonus: 18, speedBonus: 5 },
    growth: { attackBonus: 3, speedBonus: 1 },
  }),
  dongdi_jue: tech('dongdi_jue', {
    name: '东帝诀',
    tier: '天品',
    type: '圣地传承',
    source: '东帝圣地秘传',
    desc: '东帝圣地压箱底的镇世法门，兼修帝气、神魂与肉身，修炼时宛若引东极紫气灌体，既能精进修为，也能大幅提升整体战力。',
    obtainHint: '东帝圣地宝库第三层',
    bonuses: { cultivationBonus: 24, attackBonus: 10, hpBonus: 14 },
    growth: { cultivationBonus: 3, attackBonus: 2, hpBonus: 2 },
  }),
  huangsha_putian_jue: tech('huangsha_putian_jue', {
    name: '黄沙铺天诀',
    tier: '天品',
    type: '沙域魔功',
    source: '焚沙魔域宗门秘法',
    desc: '焚沙魔域以风沙煞气凝成的霸道魔诀，一经施展，如黄沙漫天蔽日，擅长正面压制与持续蚕食，攻伐之势最为凶悍。',
    obtainHint: '焚沙魔域宝库第三层',
    bonuses: { attackBonus: 20, hpBonus: 10 },
    growth: { attackBonus: 3, hpBonus: 2 },
  }),
  bajiu_xuangong: tech('bajiu_xuangong', {
    name: '八九玄功',
    tier: '天品',
    type: '炼体玄功',
    source: '定宇府宗门秘法',
    desc: '定宇府珍藏的上乘玄功，主修筋骨皮膜与内景真元，讲究外炼肉身、内固元神，修成之后攻守兼备，气血如洪。',
    obtainHint: '定宇府宝库第三层',
    bonuses: { attackBonus: 12, hpBonus: 24 },
    growth: { attackBonus: 2, hpBonus: 3 },
  }),
  taigu_yin: tech('taigu_yin', {
    name: '太古印',
    tier: '天品',
    type: '圣地印诀',
    source: '太古圣地秘传',
    desc: '以太古道纹为根的印诀传承，重在镇封、压制与破阵，凝印之时似有荒古气象降临，可在战局中形成近乎碾压的威慑。',
    obtainHint: '太古圣地宝库第三层',
    bonuses: { attackBonus: 16, hpBonus: 16, cultivationBonus: 12 },
    growth: { attackBonus: 2, hpBonus: 2, cultivationBonus: 2 },
  }),
  taiyi_hunjue: tech('taiyi_hunjue', {
    name: '太一魂诀',
    tier: '天品',
    type: '魂道秘法',
    source: '古魂殿宗门秘法',
    desc: '古魂殿独有的魂修法门，擅长壮大神魂、侵蚀识海与压迫心神，修至深处可令神识如潮，令人未战先怯。',
    obtainHint: '古魂殿宝库第三层',
    bonuses: { cultivationBonus: 18, attackBonus: 12, speedBonus: 4 },
    growth: { cultivationBonus: 3, attackBonus: 2, speedBonus: 1 },
  }),
  longxiang_bore_gong: tech('longxiang_bore_gong', {
    name: '龙象般若功',
    tier: '天品',
    type: '炼体神功',
    source: '昆仑宫宗门秘法',
    desc: '昆仑宫镇宫炼体法门，讲究龙象巨力、筋骨齐鸣，修习者肉身如洪炉，既能大幅拔升血气，也能让举手投足皆具重岳之势。',
    obtainHint: '昆仑宫宝库第三层',
    bonuses: { attackBonus: 14, hpBonus: 26 },
    growth: { attackBonus: 2, hpBonus: 3 },
  }),
  shanhai_jing: tech('shanhai_jing', {
    name: '山海经',
    tier: '天品',
    type: '圣地总纲',
    source: '山海圣地秘传',
    desc: '山海圣地传承总纲，包罗异兽、山川、奇门与古篆之道，悟得皮毛便足以受益终身，若能贯通则攻守修行皆可齐头并进。',
    obtainHint: '山海圣地宝库第三层',
    bonuses: { cultivationBonus: 22, attackBonus: 10, hpBonus: 12, speedBonus: 4 },
    growth: { cultivationBonus: 3, attackBonus: 2, hpBonus: 2, speedBonus: 1 },
  }),
  taishang_wangqing_jing: tech('taishang_wangqing_jing', {
    name: '太上忘情经',
    tier: '天品',
    type: '冰心道经',
    source: '素银山脉宗门秘法',
    desc: '素银山脉奉为圭臬的冰心道经，主张忘情守一、澄澈本心，以极静化极强，最适合用来稳固心境、提升修炼与防御底蕴。',
    obtainHint: '素银山脉宝库第三层',
    bonuses: { cultivationBonus: 20, hpBonus: 20 },
    growth: { cultivationBonus: 3, hpBonus: 2 },
  }),
  bingdi_xinfa: tech('bingdi_xinfa', {
    name: '冰帝心法',
    tier: '天品',
    type: '寒道心法',
    source: '冰碧渊宗门秘法',
    desc: '冰碧渊深处流传的极寒心法，真元运转之时寒意入骨，擅长以冰寒之势迟滞、冻结并碾压对手，在邪道法门中也属顶尖。',
    obtainHint: '冰碧渊宝库第三层',
    bonuses: { attackBonus: 16, hpBonus: 16, speedBonus: 5 },
    growth: { attackBonus: 2, hpBonus: 2, speedBonus: 1 },
  }),
  beichen_qijian: tech('beichen_qijian', {
    name: '北辰七剑',
    tier: '天品',
    type: '剑道传承',
    source: '冰月圣地秘传',
    desc: '冰月圣地以北辰星辉推演出的七式剑道，剑势凌厉而清绝，既能斩敌，也能借星辰寒辉护持己身，是攻守一体的上乘圣地剑诀。',
    obtainHint: '冰月圣地宝库第三层',
    bonuses: { attackBonus: 18, speedBonus: 6, hpBonus: 10 },
    growth: { attackBonus: 3, speedBonus: 1, hpBonus: 2 },
  }),
  xuandu_zhi: tech('xuandu_zhi', {
    name: '玄都指',
    tier: '天品',
    type: '指法',
    source: '玄都城宗门秘法',
    desc: '玄都城一脉相承的玄门指法，气机沉凝，出手却快若雷霆，擅长以一点破万法，直指对手气海与命门，是极重火候的杀伐秘技。',
    obtainHint: '玄都城宝库第三层',
    bonuses: { attackBonus: 19, speedBonus: 4 },
    growth: { attackBonus: 3, speedBonus: 1 },
  }),
  hundun_mogong: tech('hundun_mogong', {
    name: '混沌魔功',
    tier: '天品',
    type: '魔道总纲',
    source: '邪灵教宗门秘法',
    desc: '邪灵教镇教魔功，讲究混沌吞纳、魔气反哺与以战养战，修行者越战越勇，越乱越强，极适合正面搏杀与持续压迫。',
    obtainHint: '邪灵教宝库第三层',
    bonuses: { cultivationBonus: 18, attackBonus: 16, hpBonus: 12 },
    growth: { cultivationBonus: 2, attackBonus: 3, hpBonus: 2 },
  }),
  diyin_jue: tech('diyin_jue', {
    name: '帝印诀',
    tier: '天品',
    type: '圣地印法',
    source: '羲和圣地秘传',
    desc: '羲和圣地的帝道印诀，印出则光焰如日，势若天倾，兼具镇压、护体与攻伐三重妙用，是极少数可以统御全局的圣地大术。',
    obtainHint: '羲和圣地宝库第三层',
    bonuses: { cultivationBonus: 20, attackBonus: 14, hpBonus: 14 },
    growth: { cultivationBonus: 3, attackBonus: 2, hpBonus: 2 },
  }),
  huanyu_xingchen_gong: tech('huanyu_xingchen_gong', {
    name: '寰宇星辰功',
    tier: '天品',
    type: '星辰功法',
    source: '星辰圣地秘传',
    desc: '星辰圣地以周天星斗推衍而出的核心传承，可纳星辉入体、借星辰运转淬炼周身，修至高深处攻速兼备，修行效率亦远胜常法。',
    obtainHint: '星辰圣地宝库第三层',
    bonuses: { cultivationBonus: 22, attackBonus: 12, speedBonus: 6 },
    growth: { cultivationBonus: 3, attackBonus: 2, speedBonus: 1 },
  }),
  ...GENERATED_TECHNIQUES,
}

Object.values(TECHNIQUES).forEach((item) => {
  if ((item.unlockCost ?? 0) > 0) {
    item.unlockCost = TECH_TIER_UNLOCK_COSTS[item.tier] ?? item.unlockCost
  }

  const baseTotal = TECH_TIER_BASE_TOTALS[item.tier] ?? TECH_TIER_BASE_TOTALS['凡品']
  const growthTotal = Math.max(4, Math.round(baseTotal * (TECH_TIER_GROWTH_RATES[item.tier] ?? 0.03)))
  const weights = inferTechniqueAttributeWeights(item)

  item.bonuses = distributeAttributeTotal(baseTotal, weights)
  item.growth = distributeAttributeTotal(growthTotal, weights)
})

export const INITIAL_AVAILABLE_TECHNIQUES = ['juqi_rumen', 'xuanyu_shou', 'ziji_motong']
export const SHOP_TECHNIQUE_IDS = Object.values(TECHNIQUES)
  .filter((tech) => tech.tier === '凡品' || tech.tier === '黄品')
  .map((tech) => tech.id)

export function getTechniqueById(id) {
  return TECHNIQUES[id] ?? null
}

export function getTechniqueBuyPrice(id) {
  return TECHNIQUES[id]?.unlockCost ?? 0
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
  const smoothStep = exp * 0.34
  const majorStep = stageIndex * 1.12
  const growthFactor = smoothStep + majorStep
  return {
    cultivationBonus: Math.round(tech.bonuses.cultivationBonus * tierProfile.baseMultiplier + tech.growth.cultivationBonus * tierProfile.growthMultiplier * growthFactor + exp * 0.6 + stageIndex * 1.5),
    attackBonus: Math.round(tech.bonuses.attackBonus * tierProfile.baseMultiplier + tech.growth.attackBonus * tierProfile.growthMultiplier * growthFactor + exp * 0.45 + stageIndex * 1.2),
    hpBonus: Math.round(tech.bonuses.hpBonus * tierProfile.baseMultiplier + tech.growth.hpBonus * tierProfile.growthMultiplier * growthFactor + exp * 0.9 + stageIndex * 2.1),
    speedBonus: Math.round((tech.bonuses.speedBonus * tierProfile.baseMultiplier + tech.growth.speedBonus * tierProfile.growthMultiplier * growthFactor + exp * 0.22 + stageIndex * 0.65) * TECHNIQUE_SPEED_EFFECTIVE_MULTIPLIER),
  }
}
