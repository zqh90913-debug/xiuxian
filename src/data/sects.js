/**
 * 大世界地域与宗门数据
 */

export const REGIONS = [
  { id: 'east', name: '东域' },
  { id: 'west', name: '西域' },
  { id: 'south', name: '南域' },
  { id: 'north', name: '北域' },
  { id: 'center', name: '中域' },
]

export const REGION_NAME_MAP = REGIONS.reduce((acc, region) => {
  acc[region.id] = region.name
  return acc
}, {})

export const SECT_LEVEL_LABEL = {
  1: '一品宗门',
  2: '二品宗门',
  3: '三品宗门',
  4: '四品宗门',
  5: '五品宗门',
  6: '圣地',
}

export const SECT_FACTIONS = {
  RIGHTEOUS: '正道',
  EVIL: '邪道',
  NEUTRAL: '圣地',
}

/** 宗门职位（所有宗门统一）：从低到高 */
export const SECT_RANKS = [
  { id: 0, name: '记名弟子', upgradeCost: 0 },
  { id: 1, name: '外门弟子', upgradeCost: 80 },
  { id: 2, name: '内门弟子', upgradeCost: 200 },
  { id: 3, name: '真传弟子', upgradeCost: 450 },
  { id: 4, name: '执事', upgradeCost: 800 },
  { id: 5, name: '堂主', upgradeCost: 1300 },
  { id: 6, name: '长老', upgradeCost: 2000 },
  { id: 7, name: '大长老', upgradeCost: 3000 },
  { id: 8, name: '宗主', upgradeCost: 5000 },
]

export function getSectRankById(id) {
  return SECT_RANKS.find((rank) => rank.id === id) ?? SECT_RANKS[0]
}

// 对应当前境界索引：练气、筑基、金丹、元婴、化神、问鼎
export const SECT_LEVEL_MIN_REALM_INDEX = {
  1: 0,
  2: 0,
  3: 0,
  4: 28,
  5: 32,
  6: null,
}

function buildSectDesc(name, faction, regionName, levelLabel) {
  if (faction === SECT_FACTIONS.NEUTRAL) {
    return `「${name}」坐落于${regionName}，为不涉正邪对立的${levelLabel}，传承古老，门中底蕴深不可测。`
  }
  return `「${name}」位于${regionName}，属${faction}势力，在当地以${levelLabel}之名立足，门风鲜明，势力不容小觑。`
}

function getSectLeader(sect) {
  if (sect.level === 6) {
    return { name: '待定', title: '圣地主事', portrait: null }
  }
  if (sect.faction === SECT_FACTIONS.EVIL) {
    return { name: '待定', title: '宗主', portrait: null }
  }
  return { name: '待定', title: '掌教', portrait: null }
}

function createSect(id, regionId, level, name, faction) {
  const regionName = REGION_NAME_MAP[regionId] ?? '未知地域'
  const levelLabel = SECT_LEVEL_LABEL[level]
  const minRealmIndex = SECT_LEVEL_MIN_REALM_INDEX[level]
  const requiresTrial = level === 6
  return {
    id,
    regionId,
    level,
    levelLabel,
    faction,
    minRealmIndex,
    requiresTrial,
    name,
    desc: buildSectDesc(name, faction, regionName, levelLabel),
    leader: getSectLeader({ regionId, level, name, faction }),
  }
}

const REGION_SECT_CONFIG = {
  east: [
    [1, '五光山', SECT_FACTIONS.RIGHTEOUS],
    [1, '扫霞宗', SECT_FACTIONS.RIGHTEOUS],
    [1, '飞燕山', SECT_FACTIONS.RIGHTEOUS],
    [1, '黑石帮', SECT_FACTIONS.EVIL],
    [2, '浮光山', SECT_FACTIONS.RIGHTEOUS],
    [2, '莲花山', SECT_FACTIONS.RIGHTEOUS],
    [2, '震岳崖', SECT_FACTIONS.RIGHTEOUS],
    [2, '百毒洞', SECT_FACTIONS.EVIL],
    [3, '冥河山', SECT_FACTIONS.EVIL],
    [3, '万花崖', SECT_FACTIONS.RIGHTEOUS],
    [3, '地煞盟', SECT_FACTIONS.EVIL],
    [4, '归一山', SECT_FACTIONS.RIGHTEOUS],
    [4, '叱灵山', SECT_FACTIONS.EVIL],
    [4, '重明塔', SECT_FACTIONS.RIGHTEOUS],
    [5, '东华书院', SECT_FACTIONS.RIGHTEOUS],
    [5, '幽冥窟', SECT_FACTIONS.EVIL],
    [6, '东帝圣地', SECT_FACTIONS.NEUTRAL],
  ],
  west: [
    [1, '黄沙门', SECT_FACTIONS.EVIL],
    [1, '定风阁', SECT_FACTIONS.RIGHTEOUS],
    [1, '蚀骨堂', SECT_FACTIONS.EVIL],
    [1, '石漠谷', SECT_FACTIONS.RIGHTEOUS],
    [2, '血砂教', SECT_FACTIONS.EVIL],
    [2, '狂沙寨', SECT_FACTIONS.EVIL],
    [2, '清风宗', SECT_FACTIONS.RIGHTEOUS],
    [2, '安澜宗', SECT_FACTIONS.RIGHTEOUS],
    [3, '赤岩山', SECT_FACTIONS.RIGHTEOUS],
    [3, '魔蝎宗', SECT_FACTIONS.EVIL],
    [3, '埋骨渊', SECT_FACTIONS.EVIL],
    [4, '大荒宗', SECT_FACTIONS.RIGHTEOUS],
    [4, '黑石盟', SECT_FACTIONS.EVIL],
    [4, '困天教', SECT_FACTIONS.EVIL],
    [5, '焚沙魔域', SECT_FACTIONS.EVIL],
    [5, '定宇府', SECT_FACTIONS.RIGHTEOUS],
    [6, '太古圣地', SECT_FACTIONS.NEUTRAL],
  ],
  south: [
    [1, '六合塔', SECT_FACTIONS.RIGHTEOUS],
    [1, '白云山', SECT_FACTIONS.RIGHTEOUS],
    [1, '噬魂宗', SECT_FACTIONS.EVIL],
    [1, '九阴刹', SECT_FACTIONS.EVIL],
    [2, '戮神狱', SECT_FACTIONS.EVIL],
    [2, '哀牢寨', SECT_FACTIONS.EVIL],
    [2, '混世教', SECT_FACTIONS.EVIL],
    [2, '八方楼', SECT_FACTIONS.RIGHTEOUS],
    [3, '百花谷', SECT_FACTIONS.RIGHTEOUS],
    [3, '绝天殿', SECT_FACTIONS.EVIL],
    [3, '遁甲楼', SECT_FACTIONS.RIGHTEOUS],
    [4, '万毒渊', SECT_FACTIONS.EVIL],
    [4, '彩云山', SECT_FACTIONS.RIGHTEOUS],
    [4, '七杀阁', SECT_FACTIONS.EVIL],
    [5, '古魂殿', SECT_FACTIONS.EVIL],
    [5, '昆仑宫', SECT_FACTIONS.RIGHTEOUS],
    [6, '山海圣地', SECT_FACTIONS.NEUTRAL],
  ],
  north: [
    [1, '寒狱堡', SECT_FACTIONS.EVIL],
    [1, '雪宁府', SECT_FACTIONS.RIGHTEOUS],
    [1, '玄冰宗', SECT_FACTIONS.RIGHTEOUS],
    [1, '绝寒门', SECT_FACTIONS.RIGHTEOUS],
    [2, '寒阴宫', SECT_FACTIONS.EVIL],
    [2, '天梦宫', SECT_FACTIONS.RIGHTEOUS],
    [2, '雪熊宗', SECT_FACTIONS.EVIL],
    [2, '雪魔宗', SECT_FACTIONS.EVIL],
    [3, '浩冬殿', SECT_FACTIONS.RIGHTEOUS],
    [3, '思冬堂', SECT_FACTIONS.RIGHTEOUS],
    [3, '念冬阁', SECT_FACTIONS.RIGHTEOUS],
    [4, '雪舞宗', SECT_FACTIONS.RIGHTEOUS],
    [4, '冻魂殿', SECT_FACTIONS.EVIL],
    [4, '绝冰魔府', SECT_FACTIONS.EVIL],
    [5, '素银山脉', SECT_FACTIONS.RIGHTEOUS],
    [5, '冰碧渊', SECT_FACTIONS.EVIL],
    [6, '冰月圣地', SECT_FACTIONS.NEUTRAL],
  ],
  center: [
    [1, '云岚宗', SECT_FACTIONS.RIGHTEOUS],
    [1, '七彩琉璃宗', SECT_FACTIONS.RIGHTEOUS],
    [1, '黑龙殿', SECT_FACTIONS.EVIL],
    [1, '素心门', SECT_FACTIONS.RIGHTEOUS],
    [2, '青云宗', SECT_FACTIONS.RIGHTEOUS],
    [2, '剑冢', SECT_FACTIONS.RIGHTEOUS],
    [2, '正阳书院', SECT_FACTIONS.RIGHTEOUS],
    [2, '寒姝阁', SECT_FACTIONS.EVIL],
    [3, '合欢宗', SECT_FACTIONS.EVIL],
    [3, '天玉宗', SECT_FACTIONS.RIGHTEOUS],
    [3, '地魄门', SECT_FACTIONS.RIGHTEOUS],
    [3, '人道宗', SECT_FACTIONS.RIGHTEOUS],
    [4, '四象门', SECT_FACTIONS.RIGHTEOUS],
    [4, '四凶殿', SECT_FACTIONS.EVIL],
    [4, '凌霄殿', SECT_FACTIONS.RIGHTEOUS],
    [4, '暗裳宗', SECT_FACTIONS.EVIL],
    [5, '鸿盟', SECT_FACTIONS.RIGHTEOUS],
    [5, '邪灵教', SECT_FACTIONS.EVIL],
    [6, '羲和圣地', SECT_FACTIONS.NEUTRAL],
    [6, '星辰圣地', SECT_FACTIONS.NEUTRAL],
  ],
}

export const SECTS = Object.entries(REGION_SECT_CONFIG).flatMap(([regionId, items]) =>
  items.map(([level, name, faction], index) => createSect(`${regionId}_${level}_${index}`, regionId, level, name, faction)),
)

export const SECTS_BY_REGION = SECTS.reduce((acc, sect) => {
  if (!acc[sect.regionId]) acc[sect.regionId] = []
  acc[sect.regionId].push(sect)
  return acc
}, {})

export function getRandomSectForRegion(regionId) {
  const list = SECTS_BY_REGION[regionId] ?? []
  if (!list.length) return null
  const index = Math.floor(Math.random() * list.length)
  return list[index]
}
