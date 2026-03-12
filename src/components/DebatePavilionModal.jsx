/**
 * 论道阁：全屏界面，与道友在幻境中论道切磋；可选模式（兵演等）
 */
import { useState } from 'react'
import './DebatePavilionModal.css'

const MODES = [
  { id: 'bingyan', name: '兵演', desc: '道心争锋：每回合与对方各出一张牌，按品级与三才（天克地、地克人、人克天）结算道心伤害，道心归零即败。' },
]

export default function DebatePavilionModal({ show, onClose, onEnterBingyan }) {
  const [selectedModeId, setSelectedModeId] = useState(null)

  if (!show) return null

  return (
    <div className="debate-overlay">
      <div className="debate-modal">
        <div className="debate-header">
          <button type="button" className="btn-debate-back" onClick={onClose}>
            返回
          </button>
          <h3>论道阁</h3>
        </div>

        <div className="debate-desc gu-panel">
          <p className="debate-desc-text">
            在此可与诸天道友于幻境之中论道切磋，不伤本体、不损修为，仅以神识相争，印证所学。
          </p>
        </div>

        <div className="debate-modes gu-panel">
          <h4 className="debate-modes-title">选择模式</h4>
          <div className="debate-mode-list">
            {MODES.map((m) => (
              <div key={m.id} className="debate-mode-wrap">
                <button
                  type="button"
                  className={`debate-mode-card ${selectedModeId === m.id ? 'selected' : ''}`}
                  onClick={() => setSelectedModeId(m.id)}
                >
                  <span className="debate-mode-name">{m.name}</span>
                  <span className="debate-mode-desc">{m.desc}</span>
                </button>
                {selectedModeId === m.id && m.id === 'bingyan' && (
                  <button
                    type="button"
                    className="debate-mode-confirm"
                    onClick={() => onEnterBingyan?.()}
                  >
                    确定
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
