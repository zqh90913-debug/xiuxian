/**
 * 功法阁：区分已习得 / 已解锁 / 未解锁，并通过感悟读条提升熟练度
 */
import { useEffect, useMemo, useState } from 'react'
import {
  getTechniqueEffectiveBonuses,
  getTechniqueMasteryExp,
  getTechniqueMasteryStageById,
  getTechniqueNextMasteryStage,
  TECHNIQUE_CONTEMPLATE_DURATION_MS,
  TECHNIQUE_MAX_MASTERY_EXP,
  TECHNIQUES,
  TECH_TIERS,
} from '../data/techniques'
import './TechniquePavilionModal.css'

const TIER_ORDER = Object.fromEntries(TECH_TIERS.map((tier, index) => [tier, index]))
const sortByTier = (a, b) => (TIER_ORDER[b.tier] - TIER_ORDER[a.tier]) || a.name.localeCompare(b.name, 'zh-CN')

function formatContemplateDuration(ms) {
  if (ms >= 60_000) return `${Math.round(ms / 60_000)}分钟`
  return `${Math.round(ms / 1000)}秒`
}

function TechniqueCard({
  tech,
  mastery,
  mode,
  onContemplate,
  contemplatingTechId,
  contemplateProgress = 0,
}) {
  const exp = getTechniqueMasteryExp(mastery, tech.id)
  const masteryStage = getTechniqueMasteryStageById(mastery, tech.id)
  const nextStage = getTechniqueNextMasteryStage(exp)
  const bonuses = getTechniqueEffectiveBonuses(tech, exp)
  const isContemplating = contemplatingTechId === tech.id
  const isMasteryMaxed = exp >= TECHNIQUE_MAX_MASTERY_EXP
  const durationText = formatContemplateDuration(TECHNIQUE_CONTEMPLATE_DURATION_MS[tech.tier] ?? 30_000)

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

      <div className="tech-card-body">
        <p className="tech-desc">{tech.desc}</p>

        <div className="tech-card-middle">
          {mode === 'learned' ? (
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
            </>
          ) : (
            <div className="tech-card-placeholder" aria-hidden="true">
              <div className="tech-mastery-block tech-mastery-block-placeholder" />
              <div className="tech-effects tech-effects-placeholder" />
            </div>
          )}
        </div>

        <div className="tech-card-footer">
          {mode === 'learned' && (
            <>
              <div className="tech-actions-row">
                <button
                  type="button"
                  className="btn-insight"
                  disabled={Boolean(contemplatingTechId) || isMasteryMaxed}
                  onClick={() => onContemplate?.(tech)}
                >
                  {isContemplating ? '感悟中...' : isMasteryMaxed ? '已圆满' : `感悟（${durationText}）`}
                </button>
              </div>
              {isContemplating && (
                <div className="tech-progress-wrap">
                  <div className="tech-progress-bar" style={{ width: `${contemplateProgress * 100}%` }} />
                  <span className="tech-progress-text">感悟中 {Math.round(contemplateProgress * 100)}%</span>
                </div>
              )}
            </>
          )}

          {mode === 'unlocked' && (
            <>
              <div className="tech-actions-row">
                <button
                  type="button"
                  className="btn-learn"
                  disabled={Boolean(contemplatingTechId)}
                  onClick={() => onContemplate?.(tech)}
                >
                  {isContemplating ? '感悟中...' : `感悟入门（${durationText}）`}
                </button>
              </div>
              {isContemplating && (
                <div className="tech-progress-wrap">
                  <div className="tech-progress-bar" style={{ width: `${contemplateProgress * 100}%` }} />
                  <span className="tech-progress-text">感悟中 {Math.round(contemplateProgress * 100)}%</span>
                </div>
              )}
            </>
          )}

          {mode === 'locked' && (
            <div className="tech-locked-footer">
              <span className="tech-lock-state">未解锁</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function TechniquePavilionModal({
  show,
  onClose,
  learned = [],
  available = [],
  mastery = {},
  /** 由 App 维护：关闭功法阁后读条仍继续 */
  contemplatingTechId = null,
  contemplateProgress = 0,
  onBeginContemplation,
}) {
  const [techToContemplate, setTechToContemplate] = useState(null)
  const [activeTier, setActiveTier] = useState(TECH_TIERS[0])

  useEffect(() => {
    if (!show) {
      setTechToContemplate(null)
    }
  }, [show])

  const learnedSet = new Set(learned)
  const availableSet = new Set(available)
  const allTechs = useMemo(() => Object.values(TECHNIQUES).sort(sortByTier), [])
  const tierTechs = allTechs.filter((tech) => tech.tier === activeTier)
  const learnedTechs = tierTechs.filter((tech) => learnedSet.has(tech.id))
  const unlockedTechs = tierTechs.filter((tech) => availableSet.has(tech.id) && !learnedSet.has(tech.id))
  const lockedTechs = tierTechs.filter((tech) => !availableSet.has(tech.id) && !learnedSet.has(tech.id))

  if (!show) return null

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
                  onContemplate={setTechToContemplate}
                  contemplatingTechId={contemplatingTechId}
                  contemplateProgress={contemplateProgress}
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
                  onContemplate={setTechToContemplate}
                  contemplatingTechId={contemplatingTechId}
                  contemplateProgress={contemplateProgress}
                />
              ))}
            </div>
          )}
        </div>

        <div className="tech-section tech-section-scroll gu-panel">
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

      </div>

      {techToContemplate && (
        <div className="tech-confirm-overlay" onClick={() => setTechToContemplate(null)}>
          <div className="tech-confirm-modal gu-panel" onClick={(e) => e.stopPropagation()}>
            <p className="tech-learn-prompt">
              确定感悟《{techToContemplate.name}》吗？
              {!learnedSet.has(techToContemplate.id) ? ' 感悟完成后将列入已习得功法。' : ' 感悟完成后会提升熟练度。'}
            </p>
            <div className="tech-learn-actions">
              <button type="button" className="btn-cancel" onClick={() => setTechToContemplate(null)}>取消</button>
              <button
                type="button"
                className="btn-confirm-learn"
                onClick={() => {
                  onBeginContemplation?.(techToContemplate)
                  setTechToContemplate(null)
                }}
              >
                开始感悟
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
