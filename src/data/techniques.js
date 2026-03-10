/**
 * 功法数据：天地玄黄四阶，每阶分上中下品
 */

export const TECH_TIERS = ['黄阶', '玄阶', '地阶', '天阶']

export const TECH_GRADES = ['下品', '中品', '上品']

/**
 * 功法定义
 * cultivationBonus: 每次修炼额外获得的修为
 */
export const TECHNIQUES = {
  // 初始功法：黄阶下品·聚气入门
  'juqi_rumen': {
    id: 'juqi_rumen',
    name: '聚气入门',
    tier: '黄阶',
    grade: '下品',
    desc: '基础聚气心法，每次修炼额外获得 10 点修为。',
    cultivationBonus: 10,
  },
}

// 初始可学习功法列表
export const INITIAL_AVAILABLE_TECHNIQUES = ['juqi_rumen']

export function getTechniqueById(id) {
  return TECHNIQUES[id] ?? null
}

