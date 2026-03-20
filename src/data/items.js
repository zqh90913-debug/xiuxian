/**
 * 道具类别与丹药定义
 */

export const ITEM_TYPES = {
  WEAPON: 'weapon',
  ARMOR: 'armor',
  PILL: 'pill',
  MATERIAL: 'material',
  FURNACE: 'furnace',
  RECIPE: 'recipe',
}

export const EQUIPMENT_SLOTS = {
  WEAPON: Array(4).fill(null).map((_, i) => ({ slotIndex: i, type: ITEM_TYPES.WEAPON })),
  ARMOR: Array(4).fill(null).map((_, i) => ({ slotIndex: i, type: ITEM_TYPES.ARMOR })),
}

/** 丹药品级颜色 一品~九品 */
export const PILL_GRADE_COLORS = {
  1: '#9e9e9e',   // 灰
  2: '#8d6e63',   // 棕
  3: '#ff8a65',   // 橙
  4: '#ffd54f',   // 黄
  5: '#81c784',   // 绿
  6: '#4fc3f7',   // 蓝
  7: '#9575cd',   // 紫
  8: '#f06292',   // 粉
  9: '#ffeb3b',   // 金
  10: '#ef5350',
  11: '#26a69a',
}

/** 丹药基础价格：品级 -> [收购价, 售价] */
const GRADE_PRICES = {
  1: [50, 100],
  2: [100, 200],
  3: [200, 400],
  4: [400, 800],
  5: [800, 1600],
  6: [1600, 3200],
  7: [3200, 6400],
  8: [6400, 12800],
  9: [12800, 25600],
  10: [25600, 51200],
  11: [51200, 102400],
}

/** 丹药定义：大境界突破使用破境丹；部分为直接使用（增加修为等） */
export const PILLS = {
  'pojing_dan_1': { id: 'pojing_dan_1', name: '一阶破境丹', grade: 2, realmIndex: 12 },
  'pojing_dan_2': { id: 'pojing_dan_2', name: '二阶破境丹', grade: 3, realmIndex: 17 },
  'pojing_dan_3': { id: 'pojing_dan_3', name: '三阶破境丹', grade: 4, realmIndex: 28 },
  'pojing_dan_4': { id: 'pojing_dan_4', name: '四阶破境丹', grade: 5, realmIndex: 32 },
  'pojing_dan_5': { id: 'pojing_dan_5', name: '五阶破境丹', grade: 6, realmIndex: 37 },
  'pojing_dan_6': { id: 'pojing_dan_6', name: '六阶破境丹', grade: 6, realmIndex: 42 },
  'pojing_dan_7': { id: 'pojing_dan_7', name: '七阶破境丹', grade: 7, realmIndex: 43 },
  'pojing_dan_8': { id: 'pojing_dan_8', name: '八阶破境丹', grade: 7, realmIndex: 44 },
  'pojing_dan_9': { id: 'pojing_dan_9', name: '九阶破境丹', grade: 8, realmIndex: 45 },
  'pojing_dan_10': { id: 'pojing_dan_10', name: '十阶破境丹', grade: 8, realmIndex: 46 },
  'pojing_dan_11': { id: 'pojing_dan_11', name: '十一阶破境丹', grade: 9, realmIndex: 47 },
  'yanghun_dan': { id: 'yanghun_dan', name: '养魂丹', grade: 1, directUse: true, cultivationGain: 500 },
  'yanghun_jingdan': { id: 'yanghun_jingdan', name: '养魂精丹', grade: 3, directUse: true, cultivationGain: 5000 },
  'dahuan_dan': { id: 'dahuan_dan', name: '大还丹', grade: 5, directUse: true, cultivationGain: 50000 },
  'puti_dahuan_dan': { id: 'puti_dahuan_dan', name: '菩提大还丹', grade: 7, directUse: true, cultivationGain: 500000 },
  'qiankun_zaohua_dan': { id: 'qiankun_zaohua_dan', name: '乾坤造化丹', grade: 9, directUse: true, fillCurrentRealm: true },
  'cuiti_dan': { id: 'cuiti_dan', name: '淬体丹', grade: 1, directUse: true },
  'longli_dan': { id: 'longli_dan', name: '龙力丹', grade: 2, directUse: true },
  'shenxing_dan': { id: 'shenxing_dan', name: '神行丹', grade: 2, directUse: true },
}

export const PILL_IDS = Object.keys(PILLS)

export const EQUIPMENT_QUALITY_LABELS = {
  1: '黄品',
  2: '玄品',
  3: '地品',
  4: '天品',
  5: '帝品',
}

export const EQUIPMENT_QUALITY_COLORS = {
  1: '#d4af37',
  2: '#5b8ff9',
  3: '#2bb673',
  4: '#d96cff',
  5: '#ff4d4f',
}

/** 法器定义：按黄玄地天帝五个品质划分，增加攻击 */
export const WEAPONS = {
  'baoyu_lihua_zhen': { id: 'baoyu_lihua_zhen', name: '暴雨梨花针', qualityRank: 1, qualityLabel: '黄品', attackBonus: 108 },
  'zhugelian_nu': { id: 'zhugelian_nu', name: '诸葛连弩', qualityRank: 1, qualityLabel: '黄品', attackBonus: 118 },
  'guding_dao': { id: 'guding_dao', name: '古锭刀', qualityRank: 1, qualityLabel: '黄品', attackBonus: 126 },
  'hanbing_jian': { id: 'hanbing_jian', name: '寒冰剑', qualityRank: 1, qualityLabel: '黄品', attackBonus: 134 },
  'longxu_zhen': { id: 'longxu_zhen', name: '龙须针', qualityRank: 1, qualityLabel: '黄品', attackBonus: 142 },
  'wujin_gun': { id: 'wujin_gun', name: '乌金棍', qualityRank: 1, qualityLabel: '黄品', attackBonus: 150 },
  'yintan_jingong': { id: 'yintan_jingong', name: '银弹金弓', qualityRank: 1, qualityLabel: '黄品', attackBonus: 162 },
  'zijin_qin': { id: 'zijin_qin', name: '紫金琴', qualityRank: 1, qualityLabel: '黄品', attackBonus: 172 },
  'chigu_shan': { id: 'chigu_shan', name: '赤骨扇', qualityRank: 1, qualityLabel: '黄品', attackBonus: 182 },
  'bijin_jian': { id: 'bijin_jian', name: '碧金剑', qualityRank: 1, qualityLabel: '黄品', attackBonus: 192 },
  'shuangjian': { id: 'shuangjian', name: '双锏', qualityRank: 1, qualityLabel: '黄品', attackBonus: 202 },
  'bawang_qiang': { id: 'bawang_qiang', name: '霸王枪', qualityRank: 1, qualityLabel: '黄品', attackBonus: 212 },
  'qimen_moding': { id: 'qimen_moding', name: '奇门魔钉', qualityRank: 1, qualityLabel: '黄品', attackBonus: 222 },
  'taizu_jingong': { id: 'taizu_jingong', name: '太祖精弓', qualityRank: 1, qualityLabel: '黄品', attackBonus: 232 },
  'liangyin_qiang': { id: 'liangyin_qiang', name: '亮银枪', qualityRank: 1, qualityLabel: '黄品', attackBonus: 242 },
  'huagan_fangtian_ji': { id: 'huagan_fangtian_ji', name: '画杆方天戟', qualityRank: 1, qualityLabel: '黄品', attackBonus: 252 },
  'jianxian_duanjian': { id: 'jianxian_duanjian', name: '剑仙断剑', qualityRank: 1, qualityLabel: '黄品', attackBonus: 262 },
  'baihu_bi': { id: 'baihu_bi', name: '白虎匕', qualityRank: 1, qualityLabel: '黄品', attackBonus: 272 },
  'bagua_lingdao': { id: 'bagua_lingdao', name: '八卦灵刀', qualityRank: 1, qualityLabel: '黄品', attackBonus: 284 },
  'jiangmo_chu': { id: 'jiangmo_chu', name: '降魔杵', qualityRank: 1, qualityLabel: '黄品', attackBonus: 298 },

  'yaodao_cunzheng': { id: 'yaodao_cunzheng', name: '妖刀村正', qualityRank: 2, qualityLabel: '玄品', attackBonus: 420 },
  'wanhun_fan': { id: 'wanhun_fan', name: '万魂幡', qualityRank: 2, qualityLabel: '玄品', attackBonus: 480 },
  'xuanyuan': { id: 'xuanyuan', name: '轩辕', qualityRank: 2, qualityLabel: '玄品', attackBonus: 560 },
  'zhanlu': { id: 'zhanlu', name: '湛卢', qualityRank: 2, qualityLabel: '玄品', attackBonus: 620 },
  'chixiao': { id: 'chixiao', name: '赤霄', qualityRank: 2, qualityLabel: '玄品', attackBonus: 690 },
  'taie': { id: 'taie', name: '太阿', qualityRank: 2, qualityLabel: '玄品', attackBonus: 760 },
  'qixing_longyuan': { id: 'qixing_longyuan', name: '七星龙渊', qualityRank: 2, qualityLabel: '玄品', attackBonus: 840 },
  'ganjiang': { id: 'ganjiang', name: '干将', qualityRank: 2, qualityLabel: '玄品', attackBonus: 920 },
  'moye': { id: 'moye', name: '莫邪', qualityRank: 2, qualityLabel: '玄品', attackBonus: 1000 },
  'yuchang': { id: 'yuchang', name: '鱼肠', qualityRank: 2, qualityLabel: '玄品', attackBonus: 1080 },
  'chunjun': { id: 'chunjun', name: '纯钧', qualityRank: 2, qualityLabel: '玄品', attackBonus: 1160 },
  'chengying': { id: 'chengying', name: '承影', qualityRank: 2, qualityLabel: '玄品', attackBonus: 1240 },
  'jinguang_yuyi': { id: 'jinguang_yuyi', name: '金光羽翼', qualityRank: 2, qualityLabel: '玄品', attackBonus: 1320 },
  'wuji_xinghuang_qi': { id: 'wuji_xinghuang_qi', name: '戊己杏黄旗', qualityRank: 2, qualityLabel: '玄品', attackBonus: 1400 },
  'qinglian_baose_qi': { id: 'qinglian_baose_qi', name: '青莲宝色旗', qualityRank: 2, qualityLabel: '玄品', attackBonus: 1480 },
  'lidi_yanguang_qi': { id: 'lidi_yanguang_qi', name: '离地焰光旗', qualityRank: 2, qualityLabel: '玄品', attackBonus: 1560 },
  'suse_yunjie_qi': { id: 'suse_yunjie_qi', name: '素色云界旗', qualityRank: 2, qualityLabel: '玄品', attackBonus: 1640 },
  'xuanyuan_kongshui_qi': { id: 'xuanyuan_kongshui_qi', name: '玄元控水旗', qualityRank: 2, qualityLabel: '玄品', attackBonus: 1720 },
  'jiulian_xuanshan': { id: 'jiulian_xuanshan', name: '九炼玄扇', qualityRank: 2, qualityLabel: '玄品', attackBonus: 1780 },
  'hunyuan_jindou': { id: 'hunyuan_jindou', name: '混元金斗', qualityRank: 2, qualityLabel: '玄品', attackBonus: 1840 },
  'dayan_xianjian': { id: 'dayan_xianjian', name: '大衍仙剑', qualityRank: 2, qualityLabel: '玄品', attackBonus: 1900 },
  'hunshi_lingchi': { id: 'hunshi_lingchi', name: '混世灵尺', qualityRank: 2, qualityLabel: '玄品', attackBonus: 1960 },
  'dinv_miyu': { id: 'dinv_miyu', name: '帝女秘羽', qualityRank: 2, qualityLabel: '玄品', attackBonus: 1500 },
  'xingluo_qipan': { id: 'xingluo_qipan', name: '星罗棋盘', qualityRank: 2, qualityLabel: '玄品', attackBonus: 1680 },
  'xiuluo_suo': { id: 'xiuluo_suo', name: '修罗锁', qualityRank: 2, qualityLabel: '玄品', attackBonus: 1760 },
  'liuyin_gugou': { id: 'liuyin_gugou', name: '六阴古钩', qualityRank: 2, qualityLabel: '玄品', attackBonus: 1880 },

  'haishen_sanchaji': { id: 'haishen_sanchaji', name: '海神三叉戟', qualityRank: 3, qualityLabel: '地品', attackBonus: 2400 },
  'dinghai_shenzhen': { id: 'dinghai_shenzhen', name: '定海神针', qualityRank: 3, qualityLabel: '地品', attackBonus: 3200 },
  'tongtian_lu': { id: 'tongtian_lu', name: '通天箓', qualityRank: 3, qualityLabel: '地品', attackBonus: 4100 },
  'chuanguo_yuxi': { id: 'chuanguo_yuxi', name: '传国玉玺', qualityRank: 3, qualityLabel: '地品', attackBonus: 5000 },
  'zhuxian_jian': { id: 'zhuxian_jian', name: '诛仙剑', qualityRank: 3, qualityLabel: '地品', attackBonus: 6200 },
  'luxian_jian': { id: 'luxian_jian', name: '戮仙剑', qualityRank: 3, qualityLabel: '地品', attackBonus: 6700 },
  'xianxian_jian': { id: 'xianxian_jian', name: '陷仙剑', qualityRank: 3, qualityLabel: '地品', attackBonus: 7200 },
  'juexian_jian': { id: 'juexian_jian', name: '绝仙剑', qualityRank: 3, qualityLabel: '地品', attackBonus: 7800 },
  'fantian_yin': { id: 'fantian_yin', name: '翻天印', qualityRank: 3, qualityLabel: '地品', attackBonus: 8800 },

  'kaitian_yue': { id: 'kaitian_yue', name: '开天钺', qualityRank: 4, qualityLabel: '天品', attackBonus: 12000 },
  'shishen_zhiqiang': { id: 'shishen_zhiqiang', name: '弑神之枪', qualityRank: 4, qualityLabel: '天品', attackBonus: 19800 },
  'renhuang_qi': { id: 'renhuang_qi', name: '人皇旗', qualityRank: 4, qualityLabel: '天品', attackBonus: 28600 },

  'jidao_dibing': { id: 'jidao_dibing', name: '极道帝兵', qualityRank: 5, qualityLabel: '帝品', attackBonus: 50000, specialKillChance: 0.9 },
}

export const WEAPON_IDS = Object.keys(WEAPONS)
export const SHOP_WEAPON_IDS = WEAPON_IDS.filter((id) => (WEAPONS[id].qualityRank ?? 0) <= 2)
export const WEAPON_IDS_BY_QUALITY = Object.fromEntries(
  Object.keys(EQUIPMENT_QUALITY_LABELS).map((rank) => [rank, WEAPON_IDS.filter((id) => WEAPONS[id].qualityRank === Number(rank))]),
)

/** 防具定义：按黄玄地天划分，增加血量 */
export const ARMORS = {
  'wugu_pai': { id: 'wugu_pai', name: '乌骨牌', qualityRank: 1, qualityLabel: '黄品', hpBonus: 112 },
  'hunyuan_zhenzhu_san': { id: 'hunyuan_zhenzhu_san', name: '浑元珍珠伞', qualityRank: 1, qualityLabel: '黄品', hpBonus: 156 },
  'ganlu_kuijia': { id: 'ganlu_kuijia', name: '甘露盔甲', qualityRank: 1, qualityLabel: '黄品', hpBonus: 204 },
  'wuhua_jia': { id: 'wuhua_jia', name: '五花甲', qualityRank: 1, qualityLabel: '黄品', hpBonus: 246 },
  'disha_mojia': { id: 'disha_mojia', name: '地煞魔甲', qualityRank: 1, qualityLabel: '黄品', hpBonus: 298 },

  'liuli_xi': { id: 'liuli_xi', name: '琉璃玺', qualityRank: 2, qualityLabel: '玄品', hpBonus: 480 },
  'jingang_ling': { id: 'jingang_ling', name: '金刚铃', qualityRank: 2, qualityLabel: '玄品', hpBonus: 760 },
  'duobao_ta': { id: 'duobao_ta', name: '多宝塔', qualityRank: 2, qualityLabel: '玄品', hpBonus: 1180 },
  'bawang_ding': { id: 'bawang_ding', name: '霸王鼎', qualityRank: 2, qualityLabel: '玄品', hpBonus: 1820 },

  'shengbei': { id: 'shengbei', name: '圣杯', qualityRank: 3, qualityLabel: '地品', hpBonus: 2600 },
  'jinzita': { id: 'jinzita', name: '金字塔', qualityRank: 3, qualityLabel: '地品', hpBonus: 4200 },
  'xiao_kui': { id: 'xiao_kui', name: '虓傀', qualityRank: 3, qualityLabel: '地品', hpBonus: 5600 },
  'due_wangzuo': { id: 'due_wangzuo', name: '度厄王座', qualityRank: 3, qualityLabel: '地品', hpBonus: 7400 },
  'wuzi_xianbei': { id: 'wuzi_xianbei', name: '无字仙碑', qualityRank: 3, qualityLabel: '地品', hpBonus: 9600 },

  'shanhe_shejitu': { id: 'shanhe_shejitu', name: '山河社稷图', qualityRank: 4, qualityLabel: '天品', hpBonus: 12800 },
  'donghuang_zhong': { id: 'donghuang_zhong', name: '东皇钟', qualityRank: 4, qualityLabel: '天品', hpBonus: 17600 },
  'kunlun_jing': { id: 'kunlun_jing', name: '昆仑镜', qualityRank: 4, qualityLabel: '天品', hpBonus: 21400 },
  'wanli_changcheng': { id: 'wanli_changcheng', name: '万里长城', qualityRank: 4, qualityLabel: '天品', hpBonus: 25200 },
  'xingchen_ta': { id: 'xingchen_ta', name: '星辰塔', qualityRank: 4, qualityLabel: '天品', hpBonus: 29800 },
}

const EQUIPMENT_DESCRIPTIONS = {
  baoyu_lihua_zhen: '针匣机括繁密，一经催发便如暴雨倾盆，最擅长在短瞬之间封死对手退路。',
  zhugelian_nu: '连弩槽中暗藏连环灵矢，扣弦不断则箭势不绝，适合以持续压制逼乱敌阵。',
  guding_dao: '刀身厚沉古拙，挥动时自有旧战场的肃杀余韵，讲究一刀定胜负的直截狠劲。',
  hanbing_jian: '寒气沿剑脊缓缓流转，出鞘如霜潮扑面，能让每一道斩击都带着冻结经脉的冷意。',
  longxu_zhen: '细针轻若无物，却能钻筋透骨，最适合藏在袖间骤然发难，专破护体薄弱之处。',
  wujin_gun: '乌金铸成的棍身韧沉兼备，抡砸之间如黑蛟翻江，走的是堂皇霸烈的刚猛路子。',
  yintan_jingong: '弓臂镶金裹银，拉满时弦音如裂帛，擅长远距离一箭穿透层层灵障。',
  zijin_qin: '琴弦一振便有肃杀音波荡开，既能乱敌心神，也能将无形杀机藏在清越弦声之后。',
  chigu_shan: '扇骨以赤髓妖骨打磨而成，开合之间热浪翻卷，最宜配合身法近中距离缠斗。',
  bijin_jian: '剑锋细长，金碧交映，走的是灵巧锋锐的路数，适合连环快攻与破绽追击。',
  shuangjian: '双锏厚重稳实，左右齐出时如山门齐闭，兼具砸击与震荡灵力的压迫感。',
  bawang_qiang: '枪杆修长，枪意霸烈，突刺时如怒龙出渊，最重一往无前的正面冲阵。',
  qimen_moding: '魔钉细小而歹毒，专擅钻入气机缝隙，令敌人体内灵力运转变得滞涩紊乱。',
  taizu_jingong: '弓势雄浑沉稳，射出的每一道箭芒都带着军阵威压，适合中远程稳杀。',
  liangyin_qiang: '枪身映雪，银芒清亮，讲究快、准、狠三字，连环点刺之下极难招架。',
  huagan_fangtian_ji: '方天戟刃宽长，横扫时如烈风裂空，最擅长一器压住群敌正面气势。',
  jianxian_duanjian: '半截残锋之中仍藏旧日剑仙余意，剑势虽短，却偏偏更适合贴身绝命一击。',
  baihu_bi: '匕身轻薄锐利，白虎凶气暗藏其间，最适合伺机而动，在近身瞬间致命封喉。',
  bagua_lingdao: '刀路暗合八卦转势，进退之间变化频出，能在乱战里不断改换出刀方位。',
  jiangmo_chu: '杵身刻满镇魔纹路，砸落时有沉重法意压下，对邪祟与护体罡气尤为克制。',

  yaodao_cunzheng: '妖意附于刀身，越是饮血越显锋鸣，刀路偏执凶险，极善在鏖战中反噬对手心神。',
  wanhun_fan: '幡面翻卷时似有万魂哀嚎，既能侵扰神识，也能把战场化作阴煞翻腾的死地。',
  xuanyuan: '古剑威仪自生，握之如执王道，剑气厚重而不失堂皇，适合正面对决中的压制。',
  zhanlu: '剑锋黑沉如秋水，杀机内敛却一触即发，出手时往往先静后烈，令人难防。',
  chixiao: '赤色剑芒长于破势，一剑斩出如云霞裂日，擅长在僵持中强行开出缺口。',
  taie: '太阿之势重在天成锋锐，攻来时无须花巧，往往凭一股正锋之气直接压断招架。',
  qixing_longyuan: '剑光如星河倒悬，七点寒芒彼此呼应，最适合连环追击与多段绞杀。',
  ganjiang: '阳刚剑意灼烈刚正，每一次挥斩都像铁火出炉，长于正面斩破坚甲硬盾。',
  moye: '剑身灵秀阴柔，招路飘忽中暗藏绝险，最擅长在看似无害时忽然割开命门。',
  yuchang: '短剑诡秘狠辣，专走险招与暗袭，贴近之后往往只需一线寒光便可定输赢。',
  chunjun: '剑势贵在圆融雍容，看似不急不躁，实则每一招都稳稳锁住对手后路。',
  chengying: '剑影若有若无，连锋线都难以捕捉，最适合以虚实难辨的剑路消磨敌人判断。',
  jinguang_yuyi: '羽翼舒展时金辉如潮，既能急速掠空，也能借俯冲之势将攻伐威能一并放大。',
  wuji_xinghuang_qi: '杏黄旗面一卷便有厚土灵辉沉落，进可镇压攻势，退可扰乱敌人行气。',
  qinglian_baose_qi: '旗上青莲灵光流转，挥动时自成净域，最善以柔克刚，层层化解杀伐之气。',
  lidi_yanguang_qi: '焰光腾卷，旗势如火海升空，适合大范围焚压与持续炙烤式的斗法。',
  suse_yunjie_qi: '云气缭绕其上，一经祭起便似界幕垂落，能够把混乱战局切成自己熟悉的节奏。',
  xuanyuan_kongshui_qi: '黑水玄旗沉重森寒，旗影翻覆时如怒潮倒灌，极擅长拖慢敌势后再一举反扑。',
  jiulian_xuanshan: '九炼火息潜伏扇骨之内，每一次扇动都像把积蓄已久的灼浪重新掀起。',
  hunyuan_jindou: '斗内自成吞纳之势，既能卷走术法余威，也能把乱流灵机反炼成自己的攻势。',
  dayan_xianjian: '剑路大开大合，却暗合推演变化之理，越战越能逼近最有效的杀伐轨迹。',
  hunshi_lingchi: '灵尺一落如裁断山河，招路不以花巧取胜，而是依仗层层叠叠的镇压之力。',
  dinv_miyu: '羽刃轻灵如梦，却暗藏帝裔余威，最适合高速穿梭间洒下连绵不绝的锐袭。',
  xingluo_qipan: '棋盘展开便似星阵落地，攻守之间皆可借位布势，把局面拖入自己的推演之中。',
  xiuluo_suo: '锁链甩动时杀气森沉，一旦缠住目标便如修罗攫命，越挣扎越难脱身。',
  liuyin_gugou: '古钩阴寒刁钻，擅长斜勾侧锁与突然回扯，常在敌人收势的一瞬间掀起杀机。',

  haishen_sanchaji: '戟尖似可分浪裂海，祭起时总伴着潮汐轰鸣，攻来便有重海压城之势。',
  dinghai_shenzhen: '神针既可镇海亦可擎天，举重若轻之间蕴着难以想象的恐怖份量。',
  tongtian_lu: '符箓未展时已隐约生出天威，一旦催动便像诸般法则同时落下追缚敌身。',
  chuanguo_yuxi: '玉玺承帝运而成，印落之处自带镇国威压，最适合以绝对气势碾碎僵局。',
  zhuxian_jian: '诛仙剑锋意直指杀伐本源，出招不留回旋余地，讲究一剑既出便要分生死。',
  luxian_jian: '此剑杀机更偏凌厉暴烈，斩势如血雷坠地，擅长在短时内爆出极重伤害。',
  xianxian_jian: '陷仙剑善于困与杀并行，剑气交织后会形成逼仄险域，让敌手越战越难施展。',
  juexian_jian: '绝仙剑最重决绝之意，锋芒一转便似斩断退路，常常逼得对手只能硬接。',
  fantian_yin: '大印翻掌而落如天幕倾覆，最可怕的不是锋锐，而是那种无处可逃的镇压感。',

  kaitian_yue: '钺光开阖之间仿佛能把混沌劈出缝隙，是极少数以纯粹蛮横便足以破万法的重器。',
  shishen_zhiqiang: '枪锋裹挟弑神凶名而来，刺出时既快且狠，专为撕裂顶尖强敌的护身法域而生。',
  renhuang_qi: '旗势浩荡如人道长河席卷，既有统御众生的威严，也带着镇压邪祟的恢弘正气。',

  jidao_dibing: '帝兵一动，万法皆喑，其上残存的极道意志只需轻轻垂落，往往便足以终结战局。',

  wugu_pai: '牌面乌沉厚实，最擅长硬抗正面冲击，把第一波最凶的杀势稳稳接下。',
  hunyuan_zhenzhu_san: '伞开时珠光流转成幕，能将杂乱攻势层层卸去，最适合拖入持久消耗。',
  ganlu_kuijia: '甲片之中自蕴柔和灵泽，受创时能缓冲大半震荡，让穿戴者更易稳住阵脚。',
  wuhua_jia: '甲身由多重灵纹叠接而成，抗压极稳，最适合在混战之中硬生生顶住围攻。',
  disha_mojia: '魔甲煞气深沉，受击时会反震出阴冷戾息，是以凶煞护身的邪门重铠。',

  liuli_xi: '琉璃宝玺看似玲珑，实则护体光幕坚韧非常，适合在关键时刻硬挡致命杀招。',
  jingang_ling: '铃声一响，周身便似覆上一层金刚真意，不但能护体，还可稳住自身神魂。',
  duobao_ta: '宝塔镇在身侧时层层佛光垂下，最适合抵御绵密多段式的持续轰击。',
  bawang_ding: '鼎壁厚重如山，立在身前便像多了一座小型山岳，专克大开大合的强攻。',

  shengbei: '圣杯所生的护持之力极为温润，却绵长不绝，越是拖入持久战越显其稳固可怕。',
  jinzita: '金字塔形制古老诡秘，护罩立起后棱角分明，常能把来袭劲力层层折散。',
  xiao_kui: '虓傀并非寻常甲具，更像一尊护身凶傀，临敌时会替主人分去大半正面压力。',
  due_wangzuo: '王座一成，四周便自化镇厄领域，最适合在强敌压境时为自身争出喘息空间。',
  wuzi_xianbei: '碑面无字，却自有古仙道痕护持，任何强攻落上去都像先撞上了一层岁月厚壁。',

  shanhe_shejitu: '图卷展开便有山河虚影环身，把四面八方的来敌都拖入自己主导的疆域。',
  donghuang_zhong: '钟鸣一起，时空都像被压得慢了一瞬，防御之强并不只在硬抗，更在统御全局。',
  kunlun_jing: '镜光一照，来袭杀势会被层层折返削弱，是少有兼具护身与反制意味的至宝。',
  wanli_changcheng: '城影横亘于身前，防线绵延不绝，越是大范围冲击越能显出它稳如山海的韧性。',
  xingchen_ta: '塔身引落周天星辉护体，星芒越盛，防线越厚，最适合在高强度鏖战中屹立不倒。',
}

export const ARMOR_IDS = Object.keys(ARMORS)
export const SHOP_ARMOR_IDS = ARMOR_IDS.filter((id) => (ARMORS[id].qualityRank ?? 0) <= 2)
export const ARMOR_IDS_BY_QUALITY = Object.fromEntries(
  Object.keys(EQUIPMENT_QUALITY_LABELS).map((rank) => [rank, ARMOR_IDS.filter((id) => ARMORS[id].qualityRank === Number(rank))]),
)

/** 炼丹材料：tier 1 初级(1-3品丹) tier 2 中级(4-6品) tier 3 高级(7-9品)；商店刷新为 10 个/次 */
const MATERIAL_TIER_PRICES = {
  1: [3, 30],   // [单件收购价, 10件售价]
  2: [10, 100],
  3: [35, 350],
}
export const MATERIALS = {
  // 低级
  'wu_sha': { id: 'wu_sha', name: '钨砂', tier: 1 },
  'chi_yu': { id: 'chi_yu', name: '赤玉', tier: 1 },
  'zi_tong': { id: 'zi_tong', name: '紫铜', tier: 1 },
  'yun_tie': { id: 'yun_tie', name: '陨铁', tier: 1 },
  'gu_yin': { id: 'gu_yin', name: '古银', tier: 1 },
  'mi_yu': { id: 'mi_yu', name: '秘玉', tier: 1 },
  'wu_jing': { id: 'wu_jing', name: '乌晶', tier: 1 },
  'xuan_tie': { id: 'xuan_tie', name: '玄铁', tier: 1 },
  'ling_shui': { id: 'ling_shui', name: '灵水', tier: 1 },
  // 中级
  'chi_mo_tie': { id: 'chi_mo_tie', name: '赤魔铁', tier: 2 },
  'zi_xuan_shi': { id: 'zi_xuan_shi', name: '紫玄石', tier: 2 },
  'an_jing_tie': { id: 'an_jing_tie', name: '暗精铁', tier: 2 },
  'chi_gui_jin': { id: 'chi_gui_jin', name: '赤鬼金', tier: 2 },
  'qing_gu_sha': { id: 'qing_gu_sha', name: '青古砂', tier: 2 },
  'yang_hun_hua': { id: 'yang_hun_hua', name: '养魂花', tier: 2 },
  'fu_yun_guo': { id: 'fu_yun_guo', name: '拂云果', tier: 2 },
  'di_nv_lu': { id: 'di_nv_lu', name: '帝女露', tier: 2 },
  'wu_gu_xu': { id: 'wu_gu_xu', name: '乌古须', tier: 2 },
  // 高级
  'xuan_yin_chi_gui_jin': { id: 'xuan_yin_chi_gui_jin', name: '玄阴赤鬼金', tier: 3 },
  'jin_sha_tong': { id: 'jin_sha_tong', name: '金砂铜', tier: 3 },
  'qi_sha_gu_ma_nao': { id: 'qi_sha_gu_ma_nao', name: '七杀古玛瑙', tier: 3 },
  'xi_sui_wu_shi': { id: 'xi_sui_wu_shi', name: '洗髓乌石', tier: 3 },
  'yun_yu_bi_zhen_mu': { id: 'yun_yu_bi_zhen_mu', name: '陨玉碧真木', tier: 3 },
  'wu_ding_bi_bao_shen': { id: 'wu_ding_bi_bao_shen', name: '无定碧宝参', tier: 3 },
  'qi_qiao_wu_mi_shui_jing': { id: 'qi_qiao_wu_mi_shui_jing', name: '七巧乌秘水晶', tier: 3 },
  // 顶级机缘物
  'wudao_tea': { id: 'wudao_tea', name: '悟道茶', tier: 9, breakthroughAid: true, breakthroughBonus: 5 },
  'busi_pantao': { id: 'busi_pantao', name: '不死蟠桃', tier: 9, breakthroughAid: true, breakthroughBonus: 5 },
  'world_tree_branch': { id: 'world_tree_branch', name: '世界树枝丫', tier: 9, breakthroughAid: true, breakthroughBonus: 5 },
}
export const MATERIAL_IDS = Object.keys(MATERIALS)
export const SPECIAL_BREAKTHROUGH_MATERIAL_IDS = ['wudao_tea', 'busi_pantao', 'world_tree_branch']

/** 丹炉 1-9 品：一品 +5% 炼制成功率，每升一品 +3%；可在商店刷新 */
const FURNACE_GRADE_PRICES = {
  1: [20, 80],
  2: [80, 250],
  3: [200, 600],
  4: [500, 1500],
  5: [1200, 3600],
  6: [3000, 9000],
  7: [7500, 22000],
  8: [18000, 55000],
  9: [45000, 130000],
}
export const FURNACES = {
  'furnace_1': { id: 'furnace_1', name: '一品丹炉', grade: 1, successBonus: 5 },
  'furnace_2': { id: 'furnace_2', name: '二品丹炉', grade: 2, successBonus: 8 },
  'furnace_3': { id: 'furnace_3', name: '三品丹炉', grade: 3, successBonus: 11 },
  'furnace_4': { id: 'furnace_4', name: '四品丹炉', grade: 4, successBonus: 14 },
  'furnace_5': { id: 'furnace_5', name: '五品丹炉', grade: 5, successBonus: 17 },
  'furnace_6': { id: 'furnace_6', name: '六品丹炉', grade: 6, successBonus: 20 },
  'furnace_7': { id: 'furnace_7', name: '七品丹炉', grade: 7, successBonus: 23 },
  'furnace_8': { id: 'furnace_8', name: '八品丹炉', grade: 8, successBonus: 26 },
  'furnace_9': { id: 'furnace_9', name: '九品丹炉', grade: 9, successBonus: 29 },
}
export const FURNACE_IDS = Object.keys(FURNACES)

/** 丹方：使用后解锁对应丹药的炼制；可在商店刷新 */
export const RECIPE_SCROLLS = {
  'recipe_pojing_1': { id: 'recipe_pojing_1', name: '一阶破境丹方', pillId: 'pojing_dan_1' },
  'recipe_pojing_2': { id: 'recipe_pojing_2', name: '二阶破境丹方', pillId: 'pojing_dan_2' },
  'recipe_pojing_3': { id: 'recipe_pojing_3', name: '三阶破境丹方', pillId: 'pojing_dan_3' },
  'recipe_pojing_4': { id: 'recipe_pojing_4', name: '四阶破境丹方', pillId: 'pojing_dan_4' },
  'recipe_pojing_5': { id: 'recipe_pojing_5', name: '五阶破境丹方', pillId: 'pojing_dan_5' },
  'recipe_pojing_6': { id: 'recipe_pojing_6', name: '六阶破境丹方', pillId: 'pojing_dan_6' },
  'recipe_pojing_7': { id: 'recipe_pojing_7', name: '七阶破境丹方', pillId: 'pojing_dan_7' },
  'recipe_pojing_8': { id: 'recipe_pojing_8', name: '八阶破境丹方', pillId: 'pojing_dan_8' },
  'recipe_pojing_9': { id: 'recipe_pojing_9', name: '九阶破境丹方', pillId: 'pojing_dan_9' },
  'recipe_pojing_10': { id: 'recipe_pojing_10', name: '十阶破境丹方', pillId: 'pojing_dan_10' },
  'recipe_pojing_11': { id: 'recipe_pojing_11', name: '十一阶破境丹方', pillId: 'pojing_dan_11' },
  'recipe_yanghun': { id: 'recipe_yanghun', name: '养魂丹方', pillId: 'yanghun_dan' },
  'recipe_yanghun_jing': { id: 'recipe_yanghun_jing', name: '养魂精丹方', pillId: 'yanghun_jingdan' },
  'recipe_dahuan': { id: 'recipe_dahuan', name: '大还丹方', pillId: 'dahuan_dan' },
  'recipe_puti_dahuan': { id: 'recipe_puti_dahuan', name: '菩提大还丹方', pillId: 'puti_dahuan_dan' },
  'recipe_qiankun_zaohua': { id: 'recipe_qiankun_zaohua', name: '乾坤造化丹方', pillId: 'qiankun_zaohua_dan' },
  'recipe_cuiti': { id: 'recipe_cuiti', name: '淬体丹方', pillId: 'cuiti_dan' },
  'recipe_longli': { id: 'recipe_longli', name: '龙力丹方', pillId: 'longli_dan' },
  'recipe_shenxing': { id: 'recipe_shenxing', name: '神行丹方', pillId: 'shenxing_dan' },
}
export const RECIPE_IDS = Object.keys(RECIPE_SCROLLS)
const RECIPE_BUY_PRICES = {
  'recipe_pojing_1': 200,
  'recipe_pojing_2': 500,
  'recipe_pojing_3': 1200,
  'recipe_pojing_4': 2600,
  'recipe_pojing_5': 5200,
  'recipe_pojing_6': 11000,
  'recipe_pojing_7': 22000,
  'recipe_pojing_8': 45000,
  'recipe_pojing_9': 90000,
  'recipe_pojing_10': 180000,
  'recipe_pojing_11': 360000,
  'recipe_yanghun': 300,
  'recipe_yanghun_jing': 800,
  'recipe_dahuan': 5000,
  'recipe_puti_dahuan': 30000,
  'recipe_qiankun_zaohua': 120000,
  'recipe_cuiti': 500,
  'recipe_longli': 1500,
  'recipe_shenxing': 1500,
}
export function getRecipeScrollBuyPrice(itemId) {
  return RECIPE_BUY_PRICES[itemId] ?? 0
}

export function getMaterialBuyPrice(itemId) {
  const m = MATERIALS[itemId]
  if (!m) return 0
  return MATERIAL_TIER_PRICES[m.tier]?.[1] ?? 0
}
export function getMaterialSellPrice(itemId) {
  const m = MATERIALS[itemId]
  if (!m) return 0
  return MATERIAL_TIER_PRICES[m.tier]?.[0] ?? 0
}
export function getFurnaceBuyPrice(itemId) {
  const f = FURNACES[itemId]
  if (!f) return 0
  return FURNACE_GRADE_PRICES[f.grade]?.[1] ?? 0
}
export function getFurnaceSellPrice(itemId) {
  const f = FURNACES[itemId]
  if (!f) return 0
  return FURNACE_GRADE_PRICES[f.grade]?.[0] ?? 0
}
/** 商店购买材料时一次获得的个数 */
export const MATERIAL_SHOP_COUNT = 10

const EQUIPMENT_QUALITY_PRICES = {
  1: [100, 200],
  2: [200, 400],
  3: [400, 800],
  4: [800, 1600],
  5: [1600, 3200],
}

export function getArmor(id) {
  return ARMORS[id]
}

export function getArmorHpBonus(armorOrId) {
  const a = typeof armorOrId === 'string' ? ARMORS[armorOrId] : armorOrId
  return a?.hpBonus ?? 0
}

export function getArmorSellPrice(itemId) {
  const a = ARMORS[itemId]
  if (!a) return 0
  return EQUIPMENT_QUALITY_PRICES[a.qualityRank]?.[0] ?? 0
}

export function getArmorBuyPrice(itemId) {
  const a = ARMORS[itemId]
  if (!a) return 0
  return EQUIPMENT_QUALITY_PRICES[a.qualityRank]?.[1] ?? 0
}

/** 藏宝阁可刷新出的所有商品 id（仅丹方、法宝、防具、材料、丹炉；不包含丹药） */
export const SHOP_ITEM_IDS = [...SHOP_WEAPON_IDS, ...SHOP_ARMOR_IDS, ...MATERIAL_IDS, ...FURNACE_IDS, ...RECIPE_IDS]

/** 任意商品的购买价（材料为 10 件价格） */
export function getItemBuyPrice(itemId) {
  return getPillBuyPrice(itemId) || getWeaponBuyPrice(itemId) || getArmorBuyPrice(itemId) || getMaterialBuyPrice(itemId) || getFurnaceBuyPrice(itemId) || getRecipeScrollBuyPrice(itemId)
}

export function getWeapon(id) {
  return WEAPONS[id]
}

export function getWeaponAttackBonus(weaponOrId) {
  const w = typeof weaponOrId === 'string' ? WEAPONS[weaponOrId] : weaponOrId
  return w?.attackBonus ?? 0
}

export function getWeaponSellPrice(itemId) {
  const w = WEAPONS[itemId]
  if (!w) return 0
  return EQUIPMENT_QUALITY_PRICES[w.qualityRank]?.[0] ?? 0
}

export function getWeaponBuyPrice(itemId) {
  const w = WEAPONS[itemId]
  if (!w) return 0
  return EQUIPMENT_QUALITY_PRICES[w.qualityRank]?.[1] ?? 0
}

export function getPillIdForRealm(realmIndex) {
  const entry = Object.entries(PILLS).find(([, p]) => p.realmIndex === realmIndex)
  return entry ? entry[0] : null
}

export function getPill(id) {
  return PILLS[id]
}

/** 直接使用类丹药增加的修为（如养魂丹），无则返回 0 */
export function getPillCultivationGain(itemId) {
  const p = PILLS[itemId]
  return (p && p.directUse && p.cultivationGain) ? p.cultivationGain : 0
}

export function getItemById(itemId) {
  if (PILLS[itemId]) return { ...PILLS[itemId], type: ITEM_TYPES.PILL }
  if (WEAPONS[itemId]) return { ...WEAPONS[itemId], type: ITEM_TYPES.WEAPON, desc: EQUIPMENT_DESCRIPTIONS[itemId] ?? '' }
  if (ARMORS[itemId]) return { ...ARMORS[itemId], type: ITEM_TYPES.ARMOR, desc: EQUIPMENT_DESCRIPTIONS[itemId] ?? '' }
  if (MATERIALS[itemId]) return { ...MATERIALS[itemId], type: ITEM_TYPES.MATERIAL }
  if (FURNACES[itemId]) return { ...FURNACES[itemId], type: ITEM_TYPES.FURNACE }
  if (RECIPE_SCROLLS[itemId]) return { ...RECIPE_SCROLLS[itemId], type: ITEM_TYPES.RECIPE }
  return null
}

/** 获取展示用品级文字，如「一品」「二品」 */
export function getGradeLabel(grade) {
  switch (grade) {
    case 1: return '一品'
    case 2: return '二品'
    case 3: return '三品'
    case 4: return '四品'
    case 5: return '五品'
    case 6: return '六品'
    case 7: return '七品'
    case 8: return '八品'
    case 9: return '九品'
    case 10: return '十品'
    case 11: return '十一品'
    default: return ''
  }
}

export function getEquipmentQualityLabel(qualityRank) {
  return EQUIPMENT_QUALITY_LABELS[qualityRank] ?? ''
}

export function getEquipmentQualityColor(qualityRank) {
  return EQUIPMENT_QUALITY_COLORS[qualityRank] ?? '#9e9e9e'
}

export function getItemDisplayGradeLabel(item) {
  if (!item) return ''
  if ((item.type === ITEM_TYPES.WEAPON || item.type === ITEM_TYPES.ARMOR) && item.qualityRank != null) {
    return getEquipmentQualityLabel(item.qualityRank)
  }
  if (item.grade != null) return getGradeLabel(item.grade)
  return ''
}

export function getItemAccentColor(item) {
  if (!item) return '#9e9e9e'
  if ((item.type === ITEM_TYPES.WEAPON || item.type === ITEM_TYPES.ARMOR) && item.qualityRank != null) {
    return getEquipmentQualityColor(item.qualityRank)
  }
  if (item.grade != null) return getPillGradeColor(item.grade)
  if (item.tier != null) return getPillGradeColor(item.tier)
  if (item.pillId) {
    const pill = getItemById(item.pillId)
    if (pill?.grade != null) return getPillGradeColor(pill.grade)
  }
  return '#9e9e9e'
}

export function getPillGradeColor(grade) {
  return PILL_GRADE_COLORS[grade] ?? '#9e9e9e'
}

export function getPillSellPrice(itemId) {
  const pill = PILLS[itemId]
  if (!pill) return 0
  return GRADE_PRICES[pill.grade]?.[0] ?? 0
}

export function getPillBuyPrice(itemId) {
  const pill = PILLS[itemId]
  if (!pill) return 0
  return GRADE_PRICES[pill.grade]?.[1] ?? 0
}

export function getItemSellPrice(itemOrId) {
  if (typeof itemOrId === 'string') {
    return getPillSellPrice(itemOrId) || getWeaponSellPrice(itemOrId) || getArmorSellPrice(itemOrId) || getMaterialSellPrice(itemOrId) || getFurnaceSellPrice(itemOrId)
  }
  return itemOrId?.sellPrice ?? getPillSellPrice(itemOrId?.id) ?? getWeaponSellPrice(itemOrId?.id) ?? getArmorSellPrice(itemOrId?.id) ?? getMaterialSellPrice(itemOrId?.id) ?? getFurnaceSellPrice(itemOrId?.id) ?? 0
}

/** 背包格式：{ [itemId]: count } 或 兼容旧格式 */
export function normalizeInventory(inv) {
  if (!inv) return {}
  if (Array.isArray(inv)) {
    const out = {}
    for (const slot of inv) {
      if (slot && (slot.id || slot.itemId)) {
        const id = slot.id ?? slot.itemId
        if (!getItemById(id)) continue
        const count = slot.count ?? 1
        out[id] = (out[id] ?? 0) + count
      }
    }
    return out
  }
  if (typeof inv !== 'object') return {}
  return Object.fromEntries(
    Object.entries(inv).filter(([itemId, count]) => count > 0 && getItemById(itemId)),
  )
}

const TYPE_ORDER = {
  [ITEM_TYPES.PILL]: 0,
  [ITEM_TYPES.WEAPON]: 1,
  [ITEM_TYPES.ARMOR]: 2,
  [ITEM_TYPES.MATERIAL]: 3,
  [ITEM_TYPES.FURNACE]: 4,
  [ITEM_TYPES.RECIPE]: 5,
}

function getSortInfo(itemId) {
  const item = getItemById(itemId)
  const type = item?.type
  const typeRank = TYPE_ORDER[type] ?? 99
  let grade = 0
  if (item) {
    if ((type === ITEM_TYPES.WEAPON || type === ITEM_TYPES.ARMOR) && item.qualityRank != null) {
      grade = item.qualityRank
    } else if (item.grade != null) {
      grade = item.grade
    } else if (type === ITEM_TYPES.MATERIAL && item.tier != null) {
      grade = item.tier
    } else if (type === ITEM_TYPES.RECIPE && item.pillId) {
      const pill = getItemById(item.pillId)
      if (pill?.grade != null) grade = pill.grade
    }
  }
  return { typeRank, grade, itemId }
}

/** 转换为展示用的数组 [{ itemId, count }]，按类别与品级排序 */
export function inventoryToStacks(inv) {
  const normalized = normalizeInventory(inv)
  return Object.entries(normalized)
    .filter(([, c]) => c > 0)
    .map(([itemId, count]) => ({ itemId, count }))
    .sort((a, b) => {
      const sa = getSortInfo(a.itemId)
      const sb = getSortInfo(b.itemId)
      if (sa.typeRank !== sb.typeRank) return sa.typeRank - sb.typeRank
      if (sa.grade !== sb.grade) return sb.grade - sa.grade
      return sa.itemId.localeCompare(sb.itemId)
    })
}

const MAX_INVENTORY_SLOTS = 600

/** 添加道具到背包，返回新背包。同种道具堆叠 */
export function addToInventory(inv, itemId, count = 1) {
  const cur = normalizeInventory(inv)
  const stacks = inventoryToStacks(cur)
  if (stacks.length >= MAX_INVENTORY_SLOTS && !cur[itemId]) return cur
  return { ...cur, [itemId]: (cur[itemId] ?? 0) + count }
}

/** 从背包移除道具 */
export function removeFromInventory(inv, itemId, count = 1) {
  const cur = normalizeInventory(inv)
  const now = (cur[itemId] ?? 0) - count
  if (now <= 0) {
    const next = { ...cur }
    delete next[itemId]
    return next
  }
  return { ...cur, [itemId]: now }
}
