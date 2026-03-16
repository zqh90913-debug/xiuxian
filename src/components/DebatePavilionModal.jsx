/**
 * 论道阁：全屏界面，与道友在幻境中论道切磋；可选模式（兵演、道合归一等）
 */
import { useState } from 'react'
import Game2048 from './Game2048'
import GameDaoGuo from './GameDaoGuo'
import './DebatePavilionModal.css'

const MODES = [
  { id: 'bingyan', name: '兵演', desc: '道心争锋：每回合与对方各出一张牌，按品级与三才（天克地、地克人、人克天）结算道心伤害，道心归零即败。' },
  { id: 'daheguiyi', name: '道合归一', desc: '气韵推演：以方向挪移格中数字，相同则合一，直至无法再动，以得分论高下。' },
  { id: 'daoguoxianghe', name: '道果相合', desc: '灵物落下，移动控制落点、点击放下。相同灵物相触即合一，逐级合成至道果；堆过红线即败，以得分论高下。' },
]

export default function DebatePavilionModal({ show, onClose, onEnterBingyan }) {
  const [selectedModeId, setSelectedModeId] = useState(null)
  const [gameView, setGameView] = useState(null)

  if (!show) return null

  if (gameView === 'daheguiyi') {
    return (
      <div className="debate-overlay">
        <div className="debate-modal">
          <Game2048 onBack={() => setGameView(null)} />
        </div>
      </div>
    )
  }
  if (gameView === 'daoguoxianghe') {
    return (
      <div className="debate-overlay">
        <div className="debate-modal">
          <GameDaoGuo onBack={() => setGameView(null)} />
        </div>
      </div>
    )
  }

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
                {selectedModeId === m.id && (
                  <button
                    type="button"
                    className="debate-mode-confirm"
                    onClick={() => {
                      if (m.id === 'bingyan') onEnterBingyan?.()
                      else if (m.id === 'daheguiyi') setGameView('daheguiyi')
                      else if (m.id === 'daoguoxianghe') setGameView('daoguoxianghe')
                    }}
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
