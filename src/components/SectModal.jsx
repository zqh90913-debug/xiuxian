/**
 * 宗门信息界面：宗门介绍、宗门宝库、宗门任务、宗门职位
 */
import { useState, useEffect, useRef } from 'react'
import { SECT_RANKS, getSectRankById } from '../data/sects'
import { getTreasuryLayersForSect, SECT_ITEM_TYPES } from '../data/sectTreasury'
import { getTechniqueById } from '../data/techniques'
import { getItemById } from '../data/items'
import './SectModal.css'

export default function SectModal({
  show,
  onClose,
  sect,
  onLeaveSect,
  sectContribution = 0,
  sectRankIndex = 0,
  learnedTechs = [],
  inventory = {},
  onAddContribution,
  onUpgradeRank,
  onBuyTreasuryItem,
}) {
  const [subView, setSubView] = useState(null)
  const [runningMissionIndex, setRunningMissionIndex] = useState(null)
  const [missionProgress, setMissionProgress] = useState(0)
  const missionStartTimeRef = useRef(0)
  const intervalRef = useRef(null)

  // 任务时长至少 1 分钟，奖励与时长成正比：贡献 = 时长(秒) / 6 四舍五入
  const formatDuration = (sec) =>
    sec >= 60 ? `${Math.floor(sec / 60)}分${sec % 60 ? sec % 60 + '秒' : ''}` : `${sec}秒`

  const sectMissions = [
    { name: '采集灵草', durationSec: 60 },
    { name: '打扫山门', durationSec: 75 },
    { name: '照看灵田', durationSec: 90 },
    { name: '护送商队', durationSec: 120 },
    { name: '清剿妖兽', durationSec: 150 },
    { name: '镇守矿脉', durationSec: 180 },
    { name: '外派传信', durationSec: 210 },
    { name: '探索秘境', durationSec: 240 },
    { name: '护送重要物资', durationSec: 270 },
    { name: '诛杀叛徒', durationSec: 300 },
  ].map((m) => ({
    ...m,
    contribution: Math.round(m.durationSec / 6),
  }))

  useEffect(() => {
    if (runningMissionIndex == null) return
    const m = sectMissions[runningMissionIndex]
    if (!m) return
    const durationMs = (m.durationSec ?? 60) * 1000
    missionStartTimeRef.current = Date.now()
    setMissionProgress(0)
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - missionStartTimeRef.current
      const p = Math.min(1, elapsed / durationMs)
      setMissionProgress(p)
      if (p >= 1 && intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }, 100)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [runningMissionIndex])

  if (!show || !sect) return null

  const currentRank = getSectRankById(sectRankIndex)
  const nextRank = SECT_RANKS[sectRankIndex + 1]
  const upgradeCost = nextRank ? nextRank.upgradeCost : 0
  const canUpgrade = nextRank && sectContribution >= upgradeCost

  const treasuryLayers = getTreasuryLayersForSect(sect, sectRankIndex)
  const hasTechnique = (id) => learnedTechs.includes(id)
  const hasItem = (id) => (inventory[id] ?? 0) > 0

  const renderMain = () => (
    <>
      {sect.leader?.portrait && (
        <div className="sect-leader-hero">
          <img src={sect.leader.portrait} alt={`${sect.leader.name}立绘`} className="sect-leader-portrait" />
          <div className="sect-leader-copy">
            <h4 className="sect-name">
              {sect.name}
              <span className="sect-level">（{sect.levelLabel}）</span>
            </h4>
            <p className="sect-desc">
              宗主：{sect.leader.name} · {sect.leader.title}
            </p>
            <p className="sect-desc">{sect.desc}</p>
          </div>
        </div>
      )}
      {!sect.leader?.portrait && (
        <>
          <div className="sect-leader-empty">宗主立绘待添加</div>
          <h4 className="sect-name">
            {sect.name}
            <span className="sect-level">（{sect.levelLabel}）</span>
          </h4>
          {sect.leader && (
            <p className="sect-desc">
              宗主：{sect.leader.name} · {sect.leader.title}
            </p>
          )}
          <p className="sect-desc">{sect.desc}</p>
        </>
      )}
      <p className="sect-contribution">贡献点：{sectContribution}</p>
      <p className="sect-rank">当前职位：{currentRank.name}</p>
      <div className="sect-buttons">
        <button type="button" className="btn-sect-sub" onClick={() => setSubView('treasury')}>
          宗门宝库
        </button>
        <button type="button" className="btn-sect-sub" onClick={() => setSubView('missions')}>
          宗门任务
        </button>
        <button type="button" className="btn-sect-sub" onClick={() => setSubView('rank')}>
          宗门职位
        </button>
      </div>
      <div className="sect-actions">
        <button type="button" className="btn-world-back" onClick={onLeaveSect}>
          退出宗门
        </button>
      </div>
    </>
  )

  const renderTreasury = () => (
    <>
      <div className="sect-sub-header">
        <button type="button" className="btn-world-back" onClick={() => setSubView(null)}>
          返回
        </button>
        <h4>宗门宝库</h4>
      </div>
      <p className="sect-tip">宝库分三层，职位越高可解锁越高层；使用贡献点兑换物品。</p>
      <p className="sect-contribution">当前贡献点：{sectContribution}</p>
      <div className="sect-treasury-layers">
        {treasuryLayers.map((layer) => (
          <div key={layer.layerIndex} className={`sect-treasury-layer ${layer.unlocked ? 'unlocked' : 'locked'}`}>
            <h5 className="sect-layer-title">
              {layer.name}
              {layer.unlocked ? null : <span className="sect-layer-lock">（未解锁）</span>}
            </h5>
            {!layer.unlocked ? (
              <p className="sect-layer-desc">{layer.desc}</p>
            ) : layer.items.length === 0 ? (
              <p className="sect-layer-empty">暂无兑换物品</p>
            ) : (
              <div className="sect-treasury-list">
                {layer.items.map((item, idx) => {
                  const owned = item.type === SECT_ITEM_TYPES.TECHNIQUE ? hasTechnique(item.id) : hasItem(item.id)
                  const canBuy = !owned && sectContribution >= item.cost
                  const label =
                    item.type === SECT_ITEM_TYPES.TECHNIQUE
                      ? (getTechniqueById(item.id)?.name ?? item.id)
                      : (getItemById(item.id)?.name ?? item.id)
                  const typeLabel = item.type === SECT_ITEM_TYPES.TECHNIQUE ? '功法' : item.type === SECT_ITEM_TYPES.WEAPON ? '法器' : '防具'
                  return (
                    <div key={idx} className="sect-treasury-row">
                      <span className="sect-treasury-name">[{typeLabel}] {label}</span>
                      <span className="sect-treasury-cost">{item.cost} 贡献</span>
                      {owned ? (
                        <span className="sect-treasury-owned">已拥有</span>
                      ) : (
                        <button
                          type="button"
                          className="btn-sect-buy"
                          disabled={!canBuy}
                          onClick={() => onBuyTreasuryItem?.(item.type, item.id, item.cost)}
                        >
                          兑换
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  )

  const renderMissions = () => (
    <>
      <div className="sect-sub-header">
        <button type="button" className="btn-world-back" onClick={() => setSubView(null)}>
          返回
        </button>
        <h4>宗门任务</h4>
      </div>
      <p className="sect-tip">点击「开始」进行任务，读条完成后可领取贡献点；可随时「取消」任务。退出本界面后读条会继续进行。</p>
      <p className="sect-contribution">当前贡献点：{sectContribution}</p>
      <div className="sect-missions-list">
        {sectMissions.map((m, idx) => {
          const isRunning = runningMissionIndex === idx
          const isDone = isRunning && missionProgress >= 1
          const canStart = runningMissionIndex == null
          return (
            <div key={idx} className="sect-mission-row">
              <span className="sect-mission-name">{m.name}</span>
              <span className="sect-mission-reward">+{m.contribution} 贡献</span>
              <span className="sect-mission-time">（{formatDuration(m.durationSec)}）</span>
              {!isRunning ? (
                <button
                  type="button"
                  className="btn-sect-start"
                  disabled={!canStart}
                  onClick={() => setRunningMissionIndex(idx)}
                >
                  开始
                </button>
              ) : !isDone ? (
                <>
                  <div className="sect-mission-progress-wrap">
                    <div
                      className="sect-mission-progress-bar"
                      style={{ width: `${missionProgress * 100}%` }}
                    />
                    <span className="sect-mission-progress-text">进行中 {Math.round(missionProgress * 100)}%</span>
                  </div>
                  <button
                    type="button"
                    className="btn-sect-cancel"
                    onClick={() => setRunningMissionIndex(null)}
                  >
                    取消
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="btn-sect-complete"
                  onClick={() => {
                    onAddContribution?.(m.contribution)
                    setRunningMissionIndex(null)
                  }}
                >
                  领取
                </button>
              )}
            </div>
          )
        })}
      </div>
    </>
  )

  const renderRank = () => (
    <>
      <div className="sect-sub-header">
        <button type="button" className="btn-world-back" onClick={() => setSubView(null)}>
          返回
        </button>
        <h4>宗门职位</h4>
      </div>
      <p className="sect-tip">消耗贡献点可晋升职位。</p>
      <p className="sect-contribution">当前贡献点：{sectContribution}</p>
      <div className="sect-rank-list">
        {SECT_RANKS.map((r) => (
          <div
            key={r.id}
            className={`sect-rank-row ${r.id === sectRankIndex ? 'current' : ''} ${r.id < sectRankIndex ? 'passed' : ''}`}
          >
            <span className="sect-rank-name">{r.name}</span>
            {r.id === sectRankIndex ? (
              <span className="sect-rank-badge">当前</span>
            ) : r.id < sectRankIndex ? (
              <span className="sect-rank-badge">已晋升</span>
            ) : r.id === sectRankIndex + 1 ? (
              <>
                <span className="sect-rank-cost">{r.upgradeCost} 贡献</span>
                <button
                  type="button"
                  className="btn-sect-upgrade"
                  disabled={!canUpgrade}
                  onClick={() => onUpgradeRank?.()}
                >
                  晋升
                </button>
              </>
            ) : (
              <span className="sect-rank-cost">{r.upgradeCost} 贡献</span>
            )}
          </div>
        ))}
      </div>
    </>
  )

  return (
    <div className="sect-overlay" onClick={onClose}>
      <div className="sect-modal" onClick={(e) => e.stopPropagation()}>
        <div className="sect-header">
          <button type="button" className="btn-world-back" onClick={subView ? () => setSubView(null) : onClose}>
            {subView ? '返回' : '返回'}
          </button>
          <h3>{subView === 'treasury' ? '宗门宝库' : subView === 'missions' ? '宗门任务' : subView === 'rank' ? '宗门职位' : '宗门'}</h3>
        </div>
        <div className="sect-content gu-panel">
          {subView === 'treasury' && renderTreasury()}
          {subView === 'missions' && renderMissions()}
          {subView === 'rank' && renderRank()}
          {!subView && renderMain()}
        </div>
      </div>
    </div>
  )
}
