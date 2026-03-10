/**
 * 功法阁：上半部分显示已学功法，下半部分显示可学习功法；学习前需确认
 */
import { useState } from 'react'
import { getTechniqueById, TECH_TIERS, TECH_GRADES } from '../data/techniques'
import './TechniquePavilionModal.css'

const TIER_ORDER = Object.fromEntries(TECH_TIERS.map((t, i) => [t, i]))
const GRADE_ORDER = Object.fromEntries(TECH_GRADES.map((g, i) => [g, i]))
const sortByTierGrade = (a, b) => (TIER_ORDER[b.tier] - TIER_ORDER[a.tier]) || (GRADE_ORDER[b.grade] - GRADE_ORDER[a.grade])

export default function TechniquePavilionModal({
  show,
  onClose,
  learned = [],
  available = [],
  onLearn,
}) {
  const [techToLearn, setTechToLearn] = useState(null)

  if (!show) return null

  const learnedTechs = learned
    .map(getTechniqueById)
    .filter(Boolean)
    .sort(sortByTierGrade)
  const availableTechs = available
    .map(getTechniqueById)
    .filter(Boolean)
    .filter((t) => !learned.includes(t.id))
    .sort(sortByTierGrade)

  const renderBadge = (tech) => (
    <span className="tech-badge">
      <span className="tier">{tech.tier}</span>
      <span className="grade">{tech.grade}</span>
    </span>
  )

  return (
    <div className="tech-modal-overlay">
      <div className="tech-modal">
        <div className="tech-modal-header">
          <button className="btn-close" onClick={onClose}>返回</button>
          <h3>功法阁</h3>
        </div>

        <div className="tech-section learned gu-panel">
          <h4>已学功法</h4>
          {learnedTechs.length === 0 ? (
            <div className="tech-empty">尚未学会任何功法。</div>
          ) : (
            <div className="tech-list">
              {learnedTechs.map((tech) => (
                <div key={tech.id} className="tech-card">
                  <div className="tech-card-header">
                    <span className="tech-name">{tech.name}</span>
                    {renderBadge(tech)}
                  </div>
                  <p className="tech-desc">{tech.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="tech-section available gu-panel">
          <h4>可学习功法</h4>
          {availableTechs.length === 0 ? (
            <div className="tech-empty">暂无可学习功法。</div>
          ) : (
            <div className="tech-scroll">
              {availableTechs.map((tech) => (
                <div key={tech.id} className="tech-card selectable">
                  <div className="tech-card-header">
                    <span className="tech-name">{tech.name}</span>
                    {renderBadge(tech)}
                  </div>
                  <p className="tech-desc">{tech.desc}</p>
                  <button
                    className="btn-learn"
                    type="button"
                    onClick={() => setTechToLearn(tech)}
                  >
                    学习
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {techToLearn && (
          <div className="tech-learn-confirm gu-panel">
            <p className="tech-learn-prompt">
              确定学习《{techToLearn.name}》吗？
            </p>
            <div className="tech-learn-actions">
              <button type="button" className="btn-cancel" onClick={() => setTechToLearn(null)}>
                取消
              </button>
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

