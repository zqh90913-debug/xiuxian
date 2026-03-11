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

export const REGION_NAME_MAP = REGIONS.reduce((acc, r) => {
  acc[r.id] = r.name
  return acc
}, {})

export const SECT_LEVEL_LABEL = {
  1: '一阶宗门',
  2: '二阶宗门',
  3: '三阶宗门',
  4: '四阶宗门',
  5: '五阶宗门',
}

// 简单设置：一阶~五阶宗门需要的最低大境界索引（0=练气，1=筑基，2=金丹，3=元婴，4=化神）
export const SECT_LEVEL_MIN_REALM_INDEX = {
  1: 0,
  2: 1,
  3: 2,
  4: 3,
  5: 4,
}

function sect(id, regionId, level, name, desc) {
  return {
    id,
    regionId,
    level,
    levelLabel: SECT_LEVEL_LABEL[level],
    minRealmIndex: SECT_LEVEL_MIN_REALM_INDEX[level],
    name,
    desc,
  }
}

// 为每个地域生成：一阶 5 个，二阶 5 个，三阶 3 个，四阶 3 个，五阶 1 个
export const SECTS = [
  // 东域
  sect('east_1_lingyun', 'east', 1, '凌云剑堂', '东域边陲的小剑修宗门，以基础剑法闻名。'),
  sect('east_1_qinghe', 'east', 1, '清河书院', '以讲道授业为主，适合初入修行之人。'),
  sect('east_1_chishan', 'east', 1, '赤山拳宗', '炼体为主，门人多出身凡俗武者。'),
  sect('east_1_yunshui', 'east', 1, '云水宗', '擅长水属性功法，行事低调。'),
  sect('east_1_muqing', 'east', 1, '暮青门', '修行木灵之术，善种灵田。'),
  sect('east_2_tianjian', 'east', 2, '天剑宗', '中型剑修宗门，遁光如电，剑势如虹。'),
  sect('east_2_feixia', 'east', 2, '飞霞宫', '善御飞剑与飞舟，往来东域诸国之间。'),
  sect('east_2_luoyun', 'east', 2, '落云观', '以占星推演著称，预知吉凶。'),
  sect('east_2_xuanling', 'east', 2, '玄灵门', '精于灵符与法阵，门人遍布商旅。'),
  sect('east_2_chiyang', 'east', 2, '炽阳道院', '修习火道术法，攻伐之术不弱。'),
  sect('east_3_cangxue', 'east', 3, '苍雪山庄', '盘踞雪山之巅，剑气如寒霜。'),
  sect('east_3_qingmiao', 'east', 3, '青妙仙阁', '广收散修，善炼丹与贩售丹药。'),
  sect('east_3_yaohai', 'east', 3, '瑶海仙门', '临海而建，门中多水灵根弟子。'),
  sect('east_4_feilong', 'east', 4, '飞龙道宗', '龙气盘旋，道统绵长，为东域老牌强宗之一。'),
  sect('east_4_taihe', 'east', 4, '太和圣地', '讲求内外双修，以和合之道镇压东域风云。'),
  sect('east_4_zixiao', 'east', 4, '紫宵剑域', '剑修圣地，出剑必见血光，威名赫赫。'),
  sect('east_5_donghuang', 'east', 5, '东荒仙庭', '传说中的仙庭遗脉，真正屹立东域巅峰的无上宗门。'),

  // 西域
  sect('west_1_huangsha', 'west', 1, '黄沙堡', '立于沙海深处，护送商队往来。'),
  sect('west_1_luosun', 'west', 1, '落日楼', '以弓弩与远程神通著称。'),
  sect('west_1_shamo', 'west', 1, '沙漠行馆', '信奉行走与历练之道，门人足迹遍布大漠。'),
  sect('west_1_qingshi', 'west', 1, '青石寺', '苦修寺庙，讲求戒律与心性。'),
  sect('west_1_hanlu', 'west', 1, '寒露谷', '善于采集奇花异草，炼制疗伤灵药。'),
  sect('west_2_luoyan', 'west', 2, '落雁宫', '轻功身法冠绝西域，擅长暗中刺杀。'),
  sect('west_2_shacheng', 'west', 2, '沙城门', '以阵法守城，镇压沙盗与妖兽。'),
  sect('west_2_yanmo', 'west', 2, '焰魔堂', '修习炽烈魔火，出手狠辣。'),
  sect('west_2_qingfeng', 'west', 2, '清风观', '以风道身法闻名，来去如风。'),
  sect('west_2_mingyao', 'west', 2, '冥曜宗', '修冥火与夜战之术，常于黑夜出手。'),
  sect('west_3_baisha', 'west', 3, '白沙仙城', '大漠中心的修士集散地，宗门如城池。'),
  sect('west_3_xuanhuo', 'west', 3, '玄火圣门', '以多种异火炼兵炼丹，声名远播。'),
  sect('west_3_luanyan', 'west', 3, '乱焰魔窟', '魔修聚集之地，强者如云。'),
  sect('west_4_tianhuang', 'west', 4, '天荒古宗', '从上古延续至今的远古宗脉，底蕴深不可测。'),
  sect('west_4_shenzhou', 'west', 4, '神舟阁', '掌控多条跨域商路，财力雄浑。'),
  sect('west_4_dusha', 'west', 4, '毒沙天宫', '精通万千剧毒，令人谈之色变。'),
  sect('west_5_xiyao', 'west', 5, '西曜神朝', '以王朝之躯行宗门之实，据说手握上古帝兵。'),

  // 南域
  sect('south_1_manglin', 'south', 1, '莽林寨', '栖身于蛮荒密林，门人多为猎手出身。'),
  sect('south_1_cuiling', 'south', 1, '翠岭宗', '善用藤蔓与木灵之术困敌。'),
  sect('south_1_yanze', 'south', 1, '炎泽堡', '依附火山而建，护送行人穿越火泽。'),
  sect('south_1_xiwu', 'south', 1, '溪雾居', '隐于山涧云雾间，门人行踪飘忽。'),
  sect('south_1_hupan', 'south', 1, '湖畔堂', '以养鱼驭妖闻名，常与水中凶兽打交道。'),
  sect('south_2_muyu', 'south', 2, '牧雨阁', '操纵风雨雷霆，掌控南域丰歉。'),
  sect('south_2_caoze', 'south', 2, '草泽门', '与妖兽缔结契约，共同作战。'),
  sect('south_2_lingwu', 'south', 2, '灵巫社', '擅长蛊术与咒印，被世人忌惮。'),
  sect('south_2_qingjiao', 'south', 2, '青蛟堂', '奉蛟龙为图腾，以水遁与蛟形拳而成名。'),
  sect('south_2_nanyu', 'south', 2, '南渔宗', '掌控南域沿海渔港，水修众多。'),
  sect('south_3_wanlin', 'south', 3, '万林古宗', '占据大片原始森林，拥有极多灵木秘藏。'),
  sect('south_3_hongze', 'south', 3, '洪泽妖庭', '由一族妖修建立，与人族保持微妙平衡。'),
  sect('south_3_chiling', 'south', 3, '赤鳞仙宗', '门中擅长血脉秘术，战力不俗。'),
  sect('south_4_longmiao', 'south', 4, '龙苗圣地', '相传与真龙一脉有古老约定，族中强者如云。'),
  sect('south_4_shengze', 'south', 4, '圣泽道宫', '以治愈与守护著称，南域修士多仰其名。'),
  sect('south_4_yaoguang', 'south', 4, '曜光法域', '修习奇异光系术法，善于封禁与驱逐。'),
  sect('south_5_nanhuang', 'south', 5, '南荒天宗', '统御南域大片疆土的至高宗门，传说坐镇者为化神巅峰老祖。'),

  // 北域
  sect('north_1_xuelin', 'north', 1, '雪林堡', '坐落于雪林边缘，擅长御寒与野外求生。'),
  sect('north_1_hanxue', 'north', 1, '寒雪堂', '以冰刃与霜矛作战的小宗门。'),
  sect('north_1_qingyan', 'north', 1, '青岩寨', '矿脉附近的修士聚落，兼采矿与修行。'),
  sect('north_1_bingshan', 'north', 1, '冰山居', '隐居于冰川深处，门人多为散修出身。'),
  sect('north_1_xueren', 'north', 1, '雪人宗', '以炼体抗寒著称，力大无穷。'),
  sect('north_2_xuanbing', 'north', 2, '玄冰宫', '操纵极寒之气，可封江冻海。'),
  sect('north_2_heiyuan', 'north', 2, '黑渊观', '盘踞于深渊边缘，专研诡秘法门。'),
  sect('north_2_tielin', 'north', 2, '铁岭堡', '炼器之地，兵器品质在北域颇负盛名。'),
  sect('north_2_xueling', 'north', 2, '雪灵堂', '善引雪灵入体，增强术法威力。'),
  sect('north_2_baihu', 'north', 2, '白狐崖', '妖修与人修共处的小宗门，行事飘忽难测。'),
  sect('north_3_haixue', 'north', 3, '海雪仙宫', '连接冰洋与雪山的仙门，商旅必经。'),
  sect('north_3_beihao', 'north', 3, '北皓剑宗', '北域剑修代表之一，剑势如破晓晨光。'),
  sect('north_3_hanming', 'north', 3, '寒冥教', '以阴寒鬼道闻名，令人忌惮。'),
  sect('north_4_beiyuan', 'north', 4, '北原圣宗', '镇压北原妖兽的强大宗门，守护一方安宁。'),
  sect('north_4_xuangu', 'north', 4, '玄骨天殿', '以炼骨秘术淬炼肉身，实力可怕。'),
  sect('north_4_lanxue', 'north', 4, '蓝雪仙族', '雪灵一族的栖居地，拥有强大血脉之力。'),
  sect('north_5_beihao_tianling', 'north', 5, '北霄天庭', '高悬北天之上的仙宫遗脉，据说掌控极北天象。'),

  // 中域
  sect('center_1_pingyuan', 'center', 1, '平原宗', '位居中原平野，兼修农事与灵田之术。'),
  sect('center_1_changliu', 'center', 1, '长流馆', '记录天下见闻的修士学馆。'),
  sect('center_1_lanyun', 'center', 1, '澜云门', '擅长御云飞行，常为商队护航。'),
  sect('center_1_guangming', 'center', 1, '光明堂', '以疗愈术法著称，收治伤者众多.'),
  sect('center_1_fenglin', 'center', 1, '风林山舍', '散修聚居之地，门规宽松。'),
  sect('center_2_cangyun', 'center', 2, '沧云宗', '中域有名的中型宗门，门人遍布各地。'),
  sect('center_2_tianxin', 'center', 2, '天心宫', '专研心法与神识之术。'),
  sect('center_2_xuanhe', 'center', 2, '玄河道院', '以水道与剑术并重，声名日盛。'),
  sect('center_2_luoyue', 'center', 2, '落月楼', '经营情报与货物，两不偏废。'),
  sect('center_2_yanyu', 'center', 2, '烟雨宗', '常年烟雨缭绕，内藏诸多秘境。'),
  sect('center_3_zhongtian', 'center', 3, '中天仙宗', '中域一流大宗，统御数十附庸。'),
  sect('center_3_tianji', 'center', 3, '天机阁', '精通推演与占卜，可窥天机一角。'),
  sect('center_3_lingxiao', 'center', 3, '凌霄剑宫', '剑修汇聚之地，剑意冲霄。'),
  sect('center_4_shenghuang', 'center', 4, '圣皇道庭', '与凡俗王朝关系密切，掌控广袤疆土。'),
  sect('center_4_xuantian', 'center', 4, '玄天圣地', '中域最古老的道统之一，底蕴深厚。'),
  sect('center_4_cangsheng', 'center', 4, '苍生仙阙', '自称护佑苍生，门风庄严肃穆。'),
  sect('center_5_zhongzhou', 'center', 5, '中州仙廷', '传说中统御五域的最高势力，本体隐匿虚空之中。'),
]

export const SECTS_BY_REGION = SECTS.reduce((acc, s) => {
  if (!acc[s.regionId]) acc[s.regionId] = []
  acc[s.regionId].push(s)
  return acc
}, {})

export function getRandomSectForRegion(regionId) {
  const list = SECTS_BY_REGION[regionId] ?? []
  if (!list.length) return null
  const idx = Math.floor(Math.random() * list.length)
  return list[idx]
}

