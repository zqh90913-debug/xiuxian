/**
 * 功法阁：区分已习得 / 已解锁 / 未解锁，并支持修习与感悟提升熟练度
 */
import { useState } from 'react'
import {
  getTechniqueById,
  getTechniqueEffectiveBonuses,
  getTechniqueMasteryExp,
  getTechniqueMasteryStageById,
  getTechniqueNextMasteryStage,
  TECHNIQUES,
  TECH_TIERS,
} from '../data/techniques'
import './TechniquePavilionModal.css'

const TIER_ORDER = Object.fromEntries(TECH_TIERS.map((tier, index) => [tier, index]))
const sortByTier = (a, b) => (TIER_ORDER[b.tier] - TIER_ORDER[a.tier]) || a.name.localeCompare(b.name, 'zh-CN')

function TechniqueCard({
  tech,
  mastery,
  mode,
  onLearn,
  onPractice,
  onInsight,
}) {
  const exp = getTechniqueMasteryExp(mastery, tech.id)
  const masteryStage = getTechniqueMasteryStageById(mastery, tech.id)
  const nextStage = getTechniqueNextMasteryStage(exp)
  const bonuses = getTechniqueEffectiveBonuses(tech, exp)

  return (
    <div className={`tech-card ${mode !== 'locked' ? 'selectable' : ''}`}>
      <div className="tech-card-header">
        <div>
          <div className="tech-name-row">
            <span className="tech-name">{tech.name}</span>
          </div>
        </div>
        <span className="tech-badge">{tech.tier}</span>
      </div>

      <p className="tech-desc">{tech.desc}</p>

      {mode === 'learned' && (
        <>
          <div className="tech-mastery-block">
            <div className="tech-mastery-row">
              <span>熟练度</span>
              <span>{masteryStage.label}</span>
            </div>
            <div className="tech-mastery-row">
              <span>当前感悟</span>
              <span>{exp}</span>
            </div>
            <div className="tech-mastery-row">
              <span>下一阶段</span>
              <span>{nextStage ? `${nextStage.label}（${nextStage.exp}）` : '已圆满'}</span>
            </div>
          </div>
          <div className="tech-effects">
            <span>修为+{bonuses.cultivationBonus}</span>
            <span>攻击+{bonuses.attackBonus}</span>
            <span>血量+{bonuses.hpBonus}</span>
            <span>速度+{bonuses.speedBonus}</span>
          </div>
          <div className="tech-actions-row">
            <button type="button" className="btn-practice" onClick={() => onPractice?.(tech.id)}>修习</button>
            <button type="button" className="btn-insight" onClick={() => onInsight?.(tech.id)}>感悟</button>
          </div>
        </>
      )}

      {mode === 'unlocked' && (
        <div className="tech-actions-row">
          <button type="button" className="btn-learn" onClick={() => onLearn?.(tech)}>
            学习
          </button>
        </div>
      )}

      {mode === 'locked' && (
        <div className="tech-locked-footer">
          <span className="tech-lock-state">未解锁</span>
        </div>
      )}
    </div>
  )
}

export default function TechniquePavilionModal({
  show,
  onClose,
  learned = [],
  available = [],
  mastery = {},
  onLearn,
  onPractice,
  onInsight,
}) {
  const [techToLearn, setTechToLearn] = useState(null)
  const [activeTier, setActiveTier] = useState(TECH_TIERS[0])

  if (!show) return null

  const learnedSet = new Set(learned)
  const availableSet = new Set(available)
  const allTechs = Object.values(TECHNIQUES).sort(sortByTier)
  const tierTechs = allTechs.filter((tech) => tech.tier === activeTier)
  const learnedTechs = tierTechs.filter((tech) => learnedSet.has(tech.id))
  const unlockedTechs = tierTechs.filter((tech) => availableSet.has(tech.id) && !learnedSet.has(tech.id))
  const lockedTechs = tierTechs.filter((tech) => !availableSet.has(tech.id) && !learnedSet.has(tech.id))

  return (
    <div className="tech-modal-overlay">
      <div className="tech-modal">
        <div className="tech-modal-header">
          <button className="btn-close" onClick={onClose}>返回</button>
          <h3>功法阁</h3>
        </div>

        <div className="tech-tier-tabs gu-panel">
          {TECH_TIERS.map((tier) => (
            <button
              key={tier}
              type="button"
              className={`tech-tier-tab ${tier === activeTier ? 'tech-tier-tab-active' : ''}`}
              onClick={() => setActiveTier(tier)}
            >
              {tier}
            </button>
          ))}
        </div>

        <div className="tech-section gu-panel">
          <h4>{activeTier} · 已习得功法</h4>
          {learnedTechs.length === 0 ? (
            <div className="tech-empty">该品级下尚未学会任何功法。</div>
          ) : (
            <div className="tech-grid">
              {learnedTechs.map((tech) => (
                <TechniqueCard
                  key={tech.id}
                  tech={tech}
                  mastery={mastery}
                  mode="learned"
                  onPractice={onPractice}
                  onInsight={onInsight}
                />
              ))}
            </div>
          )}
        </div>

        <div className="tech-section gu-panel">
          <h4>{activeTier} · 已解锁典籍</h4>
          {unlockedTechs.length === 0 ? (
            <div className="tech-empty">该品级下暂无待学习的已解锁功法。</div>
          ) : (
            <div className="tech-grid">
              {unlockedTechs.map((tech) => (
                <TechniqueCard
                  key={tech.id}
                  tech={tech}
                  mastery={mastery}
                  mode="unlocked"
                  onLearn={setTechToLearn}
                />
              ))}
            </div>
          )}
        </div>

        <div className="tech-section gu-panel">
          <h4>{activeTier} · 未解锁典籍</h4>
          {lockedTechs.length === 0 ? (
            <div className="tech-empty">该品级下暂无未解锁典籍。</div>
          ) : (
            <div className="tech-grid">
              {lockedTechs.map((tech) => (
                <TechniqueCard
                  key={tech.id}
                  tech={tech}
                  mastery={mastery}
                  mode="locked"
                />
              ))}
            </div>
          )}
        </div>

        {techToLearn && (
          <div className="tech-learn-confirm gu-panel">
            <p className="tech-learn-prompt">确定学习《{techToLearn.name}》吗？</p>
            <div className="tech-learn-actions">
              <button type="button" className="btn-cancel" onClick={() => setTechToLearn(null)}>取消</button>
              <button
                type="button"
                className="btn-confirm-learn"
                onClick={() => {
                  onLearn?.(techToLearn.id)
                  setTechToLearn(null)
                }}
              >
                确定学习
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
