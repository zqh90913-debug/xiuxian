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
  pendingSects = [],
  exploreRemaining = 0,
  onExplore,
  onExploreTen,
  onJoinSect,
  onDismissSect,
  onChallengeSect,
  onBuyExploreChance,
  pendingBandits = [],
  pendingBeasts = [],
  onBanditFight,
  onBanditPay,
  onBanditEscape,
  onBeastFight,
  onDismissBeast,
  battleState = null,
  onBattleNextTurn,
}) {
  const [exploring, setExploring] = useState(false)
  const [progress, setProgress] = useState(0)
  const [confirmBeastId, setConfirmBeastId] = useState(null)

  useEffect(() => {
    if (!show) {
      setExploring(false)
      setProgress(0)
      setConfirmBeastId(null)
    }
  }, [show])

  useEffect(() => {
    if (battleState) {
      setConfirmBeastId(null)
    }
  }, [battleState])

  if (!show || !regionId) return null

  const regionName = REGION_NAME_MAP[regionId] ?? '未知地域'
  const confirmBeast = pendingBeasts.find((item) => item.id === confirmBeastId) ?? null

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

  const handleExploreTenClick = () => {
    if (!onExploreTen || exploring) return
    setExploring(true)
    setProgress(0)
    const start = Date.now()
    const duration = 2600
    const tick = () => {
      const elapsed = Date.now() - start
      const p = Math.min(1, elapsed / duration)
      setProgress(p)
      if (p >= 1) {
        setExploring(false)
        setProgress(0)
        onExploreTen(regionId)
        return
      }
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }

  const renderSectCards = () => {
    if (!pendingSects.length) return null
    return pendingSects.map((sect) => (
      <div key={sect.id} className="region-sect-card gu-panel">
        <div className="region-sect-layout">
          {sect.leader?.portrait ? (
            <img src={sect.leader.portrait} alt={`${sect.leader.name}立绘`} className="region-sect-portrait" />
          ) : (
            <div className="region-sect-portrait region-sect-portrait-empty">立绘待添加</div>
          )}
          <div className="region-sect-copy">
            <h4 className="region-sect-title">
              {sect.name}
              <span className="region-sect-level">（{sect.levelLabel}）</span>
            </h4>
            {sect.leader && (
              <p className="region-sect-desc">宗主：{sect.leader.name} · {sect.leader.title}</p>
            )}
            <p className="region-sect-desc">{sect.desc}</p>
          </div>
        </div>
        <div className="region-sect-actions">
          <button
            type="button"
            className="btn-region"
            onClick={() => onDismissSect?.(sect.id)}
          >
            不加入
          </button>
          <button
            type="button"
            className="btn-region primary"
            onClick={() => onJoinSect?.(sect)}
          >
            加入宗门
          </button>
        </div>
      </div>
    ))
  }

  const renderBanditCard = () => {
    if (!pendingBandits.length) return null
    return pendingBandits.map((pendingBandit) => (
      <div key={pendingBandit.id} className="region-sect-card gu-panel">
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
            onClick={() => onBanditFight?.(pendingBandit)}
          >
            战斗
          </button>
          <button
            type="button"
            className="btn-region"
            onClick={() => onBanditPay?.(pendingBandit)}
          >
            破财消灾（1000 灵石）
          </button>
          <button
            type="button"
            className="btn-region"
            onClick={() => onBanditEscape?.(pendingBandit)}
          >
            逃跑
          </button>
        </div>
      </div>
    ))
  }

  const renderBeastCard = () => {
    if (!pendingBeasts.length) return null
    return pendingBeasts.map((pendingBeast) => {
      const beast = pendingBeast?.beast
      if (!beast) return null
      return (
      <div key={pendingBeast.id} className="region-sect-card gu-panel">
        <h4 className="region-sect-title">路遇异兽</h4>
        <p className="region-sect-desc">你遭遇了一头「{beast.realmName}」的{beast.name}。</p>
        <p className="region-sect-desc">{beast.desc}</p>
        <p className="region-sect-desc region-sect-desc-muted">主动技能：{beast.activeSkill?.name} · {beast.activeSkill?.effect}</p>
        <p className="region-sect-desc region-sect-desc-muted">被动技能：{beast.passiveSkill?.name} · {beast.passiveSkill?.effect}</p>
        <div className="region-sect-actions">
          <button
            type="button"
            className="btn-region"
            onClick={() => {
              setConfirmBeastId(null)
              onDismissBeast?.(pendingBeast)
            }}
          >
            逃跑
          </button>
          <button
            type="button"
            className="btn-region primary"
            onClick={() => setConfirmBeastId(pendingBeast.id)}
          >
            战斗
          </button>
        </div>
      </div>
      )
    })
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
                  disabled={exploring}
                  onClick={handleExploreTenClick}
                >
                  {exploring ? '连续探索中...' : '一键探索十次'}
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

            {!battleState && renderBanditCard()}
            {!battleState && renderBeastCard()}
            {renderSectCards()}

            {battleState && (
              <div className="region-battle-panel gu-panel">
                <h4 className="region-panel-title">战斗</h4>
                <div className="region-battle-layout">
                  <div className="battle-side enemy">
                    <div className="battle-avatar enemy-avatar">
                      <div className="battle-hp-bar">
                        <div
                          className="battle-hp-fill enemy"
                          style={{ width: `${(battleState.enemyHp / battleState.enemyHpMax) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="battle-name">敌方：{battleState.enemyName}</div>
                  </div>
                  <div className="battle-center">
                    <button
                      type="button"
                      className="btn-region primary"
                      disabled={battleState.finished}
                      onClick={onBattleNextTurn}
                    >
                      {battleState.finished ? '战斗结束' : (battleState.turn === 'player' ? '出手攻击' : battleState.turn === 'beast' ? '异兽追击' : '承受攻击')}
                    </button>
                    <div className="battle-turn">
                      当前回合：{battleState.turn === 'player' ? '你' : battleState.turn === 'beast' ? '异兽' : '对方'}
                    </div>
                  </div>
                  <div className="battle-side player">
                    <div className="battle-avatar player-avatar">
                      <img src="/main-character.png" alt="主角" className="battle-player-image" />
                      <div className="battle-hp-bar">
                        <div
                          className="battle-hp-fill player"
                          style={{ width: `${(battleState.playerHp / battleState.playerHpMax) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="battle-name">我方</div>
                  </div>
                </div>
                <div className="battle-log">
                  {(battleState.log ?? []).slice(-4).map((line, idx) => (
                    <div key={idx} className="battle-log-line">
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            )}
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

      {confirmBeast && !battleState && (
        <div className="region-confirm-overlay" onClick={() => setConfirmBeastId(null)}>
          <div className="region-confirm-modal gu-panel" onClick={(e) => e.stopPropagation()}>
            <h4 className="region-confirm-title">确认战斗</h4>
            <p className="region-confirm-text">
              你确定要与这头「{confirmBeast.beast?.realmName}」的{confirmBeast.beast?.name}交战吗？
            </p>
            <div className="region-confirm-actions">
              <button
                type="button"
                className="btn-region"
                onClick={() => setConfirmBeastId(null)}
              >
                取消
              </button>
              <button
                type="button"
                className="btn-region"
                onClick={() => {
                  setConfirmBeastId(null)
                  onDismissBeast?.(confirmBeast)
                }}
              >
                逃跑
              </button>
              <button
                type="button"
                className="btn-region primary"
                onClick={() => {
                  setConfirmBeastId(null)
                  onBeastFight?.(confirmBeast)
                }}
              >
                确定战斗
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
