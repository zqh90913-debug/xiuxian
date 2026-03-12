/**
 * 地域探索界面：左侧探索/战斗，右侧文字记录
 */
import { useState, useEffect } from 'react'
import { REGION_NAME_MAP } from '../data/sects'
import { getItemById } from '../data/items'
import './RegionSceneModal.css'

export default function RegionSceneModal({
  show,
  regionId,
  onClose,
  logs = [],
  pendingSect = null,
  exploreRemaining = 0,
  onExplore,
  onJoinSect,
  onDismissSect,
  onBuyExploreChance,
  pendingBandit = null,
  onBanditFight,
  onBanditPay,
  onBanditEscape,
}) {
  const [exploring, setExploring] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!show) {
      setExploring(false)
      setProgress(0)
    }
  }, [show])

  if (!show || !regionId) return null

  const regionName = REGION_NAME_MAP[regionId] ?? '未知地域'

  const handleExploreClick = () => {
    if (!onExplore || exploring) return
    setExploring(true)
    setProgress(0)
    const start = Date.now()
    const duration = 5000
    const tick = () => {
      const elapsed = Date.now() - start
      const p = Math.min(1, elapsed / duration)
      setProgress(p)
      if (p >= 1) {
        setExploring(false)
        setProgress(0)
        onExplore(regionId)
        return
      }
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }

  const renderSectCard = () => {
    if (!pendingSect) return null
    return (
      <div className="region-sect-card gu-panel">
        <h4 className="region-sect-title">
          {pendingSect.name}
          <span className="region-sect-level">（{pendingSect.levelLabel}）</span>
        </h4>
        <p className="region-sect-desc">{pendingSect.desc}</p>
        <div className="region-sect-actions">
          <button
            type="button"
            className="btn-region"
            onClick={onDismissSect}
          >
            离开
          </button>
          <button
            type="button"
            className="btn-region primary"
            onClick={onJoinSect}
          >
            加入宗门
          </button>
        </div>
      </div>
    )
  }

  const renderBanditCard = () => {
    if (!pendingBandit) return null
    return (
      <div className="region-sect-card gu-panel">
        <h4 className="region-sect-title">
          路遇修士拦路打劫
        </h4>
        <p className="region-sect-desc">
          一名来自「{pendingBandit.enemyRealmName}」境界的修士拦住去路，冷声索要灵石。
        </p>
        <div className="region-sect-actions">
          <button
            type="button"
            className="btn-region primary"
            onClick={onBanditFight}
          >
            战斗
          </button>
          <button
            type="button"
            className="btn-region"
            onClick={onBanditPay}
          >
            破财消灾（1000 灵石）
          </button>
          <button
            type="button"
            className="btn-region"
            onClick={onBanditEscape}
          >
            逃跑
          </button>
        </div>
      </div>
    )
  }

  const regionBgUrl = `/region-${regionId}-bg.png`

  return (
    <div
      className="region-overlay"
      onClick={onClose}
      style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.55)), url(${regionBgUrl})` }}
    >
      <div className="region-modal" onClick={(e) => e.stopPropagation()}>
        <div className="region-header">
          <button type="button" className="btn-world-back" onClick={onClose}>
            返回大世界
          </button>
          <h3>{regionName}</h3>
        </div>

        <div className="region-content">
          <div className="region-left">
            <div className="region-explore-panel gu-panel">
              <h4 className="region-panel-title">探索与战斗</h4>
              <p className="region-tip">
                在此地域四处探索，可能会遭遇机缘或危机。
              </p>
              <p className="region-tip">
                本小时剩余探索次数：{exploreRemaining}
              </p>
              <div className="region-explore-actions">
                <button
                  type="button"
                  className="btn-region primary"
                  disabled={exploring}
                  onClick={handleExploreClick}
                >
                  {exploring ? '探索中...' : '探索'}
                </button>
                <button
                  type="button"
                  className="btn-region"
                  onClick={() => onBuyExploreChance?.(regionId)}
                >
                  消耗 20 灵石增加一次探索机会
                </button>
              </div>
              <div className="region-progress-wrap">
                <div
                  className="region-progress-bar"
                  style={{ width: `${progress * 100}%` }}
                />
                {exploring && (
                  <div className="region-progress-text">
                    探索中（{Math.round(progress * 100)}%）
                  </div>
                )}
              </div>
            </div>

            {renderBanditCard()}
            {renderSectCard()}
          </div>

          <div className="region-right gu-panel">
            <h4 className="region-panel-title">探险记录</h4>
            <div className="region-log-list">
              {logs.length === 0 ? (
                <div className="region-log-empty">尚无记录，点击「探索」开始冒险。</div>
              ) : (
                logs.map((line, idx) => (
                  <div key={idx} className="region-log-line">
                    {line}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

