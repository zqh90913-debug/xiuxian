import { getAttack, getRealmDisplayName, getRealmLayerCount } from './cultivation'

const BEAST_NAMES = [
  '黑灵蜥蜴', '赤古雕', '腾蛇', '应龙', '穷奇', '饕餮', '梼杌', '混沌',
  '青龙', '白虎', '朱雀', '玄武', '三足金乌', '冰雪龙蝎', '九彩噬天蛟', '荒古龙',
  '玄甲犀', '吞月金蟾', '谛听', '幽冥蝶', '光明蝶', '鬼面魔蛛', '苍冥狼王', '冰晶凤凰',
  '八岐大蛇', '九尾狐', '暗金狮王', '血翼虎', '堕落魔豹', '海渊龙', '骨龙', '提亚马特',
  '狮鹫', '曼陀罗蟒', '噩梦蝙蝠', '迦楼罗', '摩罗', '提丰', '九头蜈蚣', '炽焰白象',
  '幻梦狐', '嗜血魔蚊', '千钧蚁', '凌光兽', '遮天鲲鹏',
]

const ENCOUNTER_OFFSETS = [0, -1, 1, -2, 2, -3, 3]
const ENCOUNTER_WEIGHTS = [0.42, 0.18, 0.18, 0.08, 0.08, 0.03, 0.03]
const ACTIVE_SKILL_POOL = ['devour', 'stun', 'rampage', 'confuse', 'chain']
const PASSIVE_SKILL_POOL = ['speedBoost', 'hpBoost', 'attackBoost', 'reviveOnce', 'shieldOnce', 'executeBoost', 'lastStand', 'regen']

function pickWeightedOffset() {
  const roll = Math.random()
  let acc = 0
  for (let i = 0; i < ENCOUNTER_OFFSETS.length; i += 1) {
    acc += ENCOUNTER_WEIGHTS[i]
    if (roll <= acc) return ENCOUNTER_OFFSETS[i]
  }
  return 0
}

function inferBeastDescription(name) {
  if (/龙|蛟|鲲鹏/.test(name)) return `${name}生来就带着横压山海的气象，鳞甲与骨血中都蕴着极强威压，一旦出手便有吞云裂岳之势。`
  if (/虎|狼|豹|狮/.test(name)) return `${name}凶性极重，最擅长贴身扑杀与撕咬追击，越是陷入恶战，越能激起它骨子里的暴烈本能。`
  if (/蝶|狐|蝠/.test(name)) return `${name}身形灵诡，常在光影与幻意之间挪转身位，真正危险之处往往藏在看似轻柔的一击之后。`
  if (/蛛|蜈蚣|蟒|蛇/.test(name)) return `${name}行动阴冷而缠绵，最擅长借毒息、束缚与持续压迫慢慢蚕食对手，是极难缠的异兽之一。`
  if (/龟|玄武|犀|象|金蟾/.test(name)) return `${name}体魄雄厚，防御惊人，平日不显锋芒，一旦真正发力，往往能以厚重气血硬顶强敌。`
  if (/乌|雀|雕|凤凰|迦楼罗/.test(name)) return `${name}天生亲近高空与炽焰，身法极快，爆发时如天火掠空，常能在短瞬之间撕开敌阵。`
  return `${name}是罕见异兽，兼具古老血脉与凶悍灵性，在大世界深处游荡时常引得修士侧目。`
}

function pickRandomFrom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function buildActiveSkill(skillType) {
  switch (skillType) {
    case 'devour':
      return {
        type: 'devour',
        name: '吞天噬地',
        effect: '自己的攻击可以为主角回复等同于造成伤害一半的血量。',
      }
    case 'stun':
      return {
        type: 'stun',
        name: '镇岳重击',
        effect: '自己的攻击有概率造成眩晕一回合的效果。',
      }
    case 'rampage':
      return {
        type: 'rampage',
        name: '凶威扑杀',
        effect: '本次战斗中，自己攻击后可以增加自身攻击力20%。',
      }
    case 'confuse':
      return {
        type: 'confuse',
        name: '幻境妄想',
        effect: '攻击后有10%的概率让敌方下次攻击改为攻击自身。',
      }
    case 'chain':
    default:
      return {
        type: 'chain',
        name: '连锁践踏',
        effect: '攻击后有40%的概率可以再次行动，只限异兽。',
      }
  }
}

function buildPassiveSkill(skillType, attackValue) {
  switch (skillType) {
    case 'speedBoost':
      return {
        type: 'speedBoost',
        name: '轻灵护主',
        effect: `上阵后为主角提供 ${Math.max(2, Math.floor(attackValue * 0.02))} 点速度加成。`,
        value: Math.max(2, Math.floor(attackValue * 0.02)),
      }
    case 'hpBoost':
      return {
        type: 'hpBoost',
        name: '厚土护身',
        effect: `上阵后为主角提供 ${Math.max(40, Math.floor(attackValue * 0.35))} 点血量加成。`,
        value: Math.max(40, Math.floor(attackValue * 0.35)),
      }
    case 'attackBoost':
      return {
        type: 'attackBoost',
        name: '凶性共鸣',
        effect: `上阵后为主角提供 ${Math.max(8, Math.floor(attackValue * 0.12))} 点攻击加成。`,
        value: Math.max(8, Math.floor(attackValue * 0.12)),
      }
    case 'reviveOnce':
      return {
        type: 'reviveOnce',
        name: '枯树逢春',
        effect: '可以让主角在第一次死亡后复活，并恢复主角10%最大血量，只能使用一次。',
      }
    case 'shieldOnce':
      return {
        type: 'shieldOnce',
        name: '无敌金身',
        effect: '为主角提供一次免疫伤害的护盾，第一次受到伤害时改为0。',
      }
    case 'executeBoost':
      return {
        type: 'executeBoost',
        name: '乘胜追击',
        effect: '当敌方血量低于50%时，主角和异兽造成的伤害提高30%。',
      }
    case 'lastStand':
      return {
        type: 'lastStand',
        name: '破釜沉舟',
        effect: '当主角血量低于30%时，主角攻击力提高40%。',
      }
    case 'regen':
    default:
      return {
        type: 'regen',
        name: '生生不息',
        effect: '每回合为主角回复10%最大血量。',
      }
  }
}

function assignSkillSet(attackValue) {
  return {
    activeSkill: buildActiveSkill(pickRandomFrom(ACTIVE_SKILL_POOL)),
    passiveSkill: buildPassiveSkill(pickRandomFrom(PASSIVE_SKILL_POOL), attackValue),
  }
}

export function createEncounterBeast(playerRealmIndex, playerLayer = 1) {
  const offset = pickWeightedOffset()
  const realmIndex = Math.max(0, Math.min(playerRealmIndex + offset, 52))
  const layerCap = getRealmLayerCount(realmIndex)
  const layer = Math.max(1, Math.min(playerLayer, layerCap))
  const name = BEAST_NAMES[Math.floor(Math.random() * BEAST_NAMES.length)]
  const baseAttack = Math.max(12, Math.floor(getAttack(realmIndex, layer, 0) * (0.82 + Math.random() * 0.34)))
  const skillSet = assignSkillSet(baseAttack)

  return {
    id: `beast_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name,
    realmIndex,
    layer,
    realmName: getRealmDisplayName(realmIndex, layer),
    attack: baseAttack,
    desc: inferBeastDescription(name),
    activeSkill: skillSet.activeSkill,
    passiveSkill: skillSet.passiveSkill,
  }
}

export function tameBeast(beast) {
  if (!beast) return null
  const tamedAttack = Math.max(1, Math.floor((beast.attack ?? 0) * 0.5))
  const passiveType = beast.passiveSkill?.type ?? pickRandomFrom(PASSIVE_SKILL_POOL)
  const activeType = beast.activeSkill?.type ?? pickRandomFrom(ACTIVE_SKILL_POOL)
  return {
    ...beast,
    attack: tamedAttack,
    activeSkill: buildActiveSkill(activeType),
    passiveSkill: buildPassiveSkill(passiveType, tamedAttack),
  }
}

export function getBeastBattleBonuses(beast) {
  if (!beast) {
    return { attackBonus: 0, hpBonus: 0, speedBonus: 0 }
  }
  const passive = beast.passiveSkill ?? {}
  return {
    attackBonus: passive.type === 'attackBoost' ? (passive.value ?? 0) : 0,
    hpBonus: passive.type === 'hpBoost' ? (passive.value ?? 0) : 0,
    speedBonus: passive.type === 'speedBoost' ? (passive.value ?? 0) : 0,
  }
}
