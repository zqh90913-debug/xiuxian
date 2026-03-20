/**
 * 异兽园：左侧上阵区，右侧异兽背包
 * 当前仅提供界面结构，异兽详细信息后续补充
 */
import { useState } from 'react'
import './BeastGardenModal.css'

export default function BeastGardenModal({
  show,
  onClose,
  activeBeasts = [],
  beastInventory = [],
  onDeployBeast,
  onUndeployBeast,
  onReleaseBeast,
}) {
  const activeBeast = activeBeasts[0] ?? null
  const [selectedBeast, setSelectedBeast] = useState(null)
  if (!show) return null

  return (
    <div className="beast-garden-overlay" onClick={onClose}>
      <div className="beast-garden-modal" onClick={(e) => e.stopPropagation()}>
        <div className="beast-garden-header">
          <button type="button" className="btn-beast-back" onClick={onClose}>返回</button>
          <h3>异兽园</h3>
        </div>

        <div className="beast-garden-content">
          <section className="beast-garden-panel gu-panel">
            <h4>上阵异兽</h4>
            <div className="beast-active-wrap">
              <div className={`beast-slot beast-slot-large ${activeBeast ? 'filled' : ''}`}>
                {activeBeast ? `${activeBeast.name} · ${activeBeast.realmName}` : '空位'}
              </div>
              {activeBeast && (
                <div className="beast-active-actions">
                  <button type="button" className="btn-beast-back" onClick={onUndeployBeast}>
                    下场异兽
                  </button>
                </div>
              )}
              <div className="beast-active-stats">
                <span>攻击：{activeBeast?.attack ?? 0}</span>
              </div>
              <p className="beast-active-desc">{activeBeast?.desc ?? '当前未上阵异兽。'}</p>
              <div className="beast-skill-panel">
                <div className="beast-skill-card">
                  <span className="beast-skill-title">主动技能</span>
                  <span className="beast-skill-name">{activeBeast?.activeSkill?.name ?? '待添加'}</span>
                  <p className="beast-skill-desc">{activeBeast?.activeSkill?.effect ?? '技能效果待添加。'}</p>
                </div>
                <div className="beast-skill-card">
                  <span className="beast-skill-title">被动技能</span>
                  <span className="beast-skill-name">{activeBeast?.passiveSkill?.name ?? '待添加'}</span>
                  <p className="beast-skill-desc">{activeBeast?.passiveSkill?.effect ?? '技能效果待添加。'}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="beast-garden-panel gu-panel">
            <h4>异兽背包</h4>
            <div className="beast-bag-grid">
              {Array.from({ length: 24 }, (_, index) => {
                const beast = beastInventory[index]
                return (
                  <button
                    key={`${beast?.id ?? 'beast'}-${index}`}
                    type="button"
                    className={`beast-slot beast-bag-slot ${beast ? 'filled' : ''}`}
                    onClick={() => beast && setSelectedBeast(beast)}
                    disabled={!beast}
                  >
                    {beast ? `${beast.name}\n${beast.realmName}` : `空格 ${index + 1}`}
                  </button>
                )
              })}
            </div>
            {beastInventory.length === 0 && (
              <div className="beast-empty">当前尚未捕获异兽。</div>
            )}
          </section>
        </div>
      </div>

      {selectedBeast && (
        <div className="beast-confirm-overlay" onClick={() => setSelectedBeast(null)}>
          <div className="beast-confirm-modal gu-panel" onClick={(e) => e.stopPropagation()}>
            <p className="beast-confirm-text">确定让 {selectedBeast.name} 上阵吗？</p>
            <p className="beast-confirm-text">{selectedBeast.realmName}</p>
            <div className="beast-confirm-actions">
              <button type="button" className="btn-beast-back" onClick={() => setSelectedBeast(null)}>取消</button>
              <button
                type="button"
                className="btn-beast-release"
                onClick={() => {
                  onReleaseBeast?.(selectedBeast)
                  setSelectedBeast(null)
                }}
              >
                放生
              </button>
              <button
                type="button"
                className="btn-beast-confirm"
                onClick={() => {
                  onDeployBeast?.(selectedBeast)
                  setSelectedBeast(null)
                }}
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
