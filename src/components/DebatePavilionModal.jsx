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

const DEBATE_SHOP_ITEMS = [
  { id: 'chi_mo_tie', name: '赤魔铁', cost: 120, count: 2, category: '中级材料' },
  { id: 'zi_xuan_shi', name: '紫玄石', cost: 120, count: 2, category: '中级材料' },
  { id: 'an_jing_tie', name: '暗精铁', cost: 140, count: 2, category: '中级材料' },
  { id: 'yang_hun_hua', name: '养魂花', cost: 160, count: 2, category: '中级材料' },
  { id: 'xuan_yin_chi_gui_jin', name: '玄阴赤鬼金', cost: 480, count: 1, category: '高级材料' },
  { id: 'qi_sha_gu_ma_nao', name: '七杀古玛瑙', cost: 520, count: 1, category: '高级材料' },
  { id: 'yun_yu_bi_zhen_mu', name: '陨玉碧真木', cost: 560, count: 1, category: '高级材料' },
  { id: 'qi_qiao_wu_mi_shui_jing', name: '七巧乌秘水晶', cost: 620, count: 1, category: '高级材料' },
]

function calcDebatePointReward(score) {
  if (!score || score <= 0) return 0
  return Math.min(500, Math.max(1, Math.floor(score / 20)))
}

export default function DebatePavilionModal({ show, onClose, onEnterBingyan, debatePoints = 0, onGainDebatePoints, onRedeemShopItem }) {
  const [selectedModeId, setSelectedModeId] = useState(null)
  const [selectedShopItemId, setSelectedShopItemId] = useState(null)
  const [gameView, setGameView] = useState(null)

  if (!show) return null

  if (gameView === 'daheguiyi') {
    return (
      <div className="debate-overlay">
        <div className="debate-modal">
          <Game2048
            onBack={() => setGameView(null)}
            getRewardPoints={calcDebatePointReward}
            onSettleScore={(score) => onGainDebatePoints?.(calcDebatePointReward(score))}
          />
        </div>
      </div>
    )
  }
  if (gameView === 'daoguoxianghe') {
    return (
      <div className="debate-overlay">
        <div className="debate-modal">
          <GameDaoGuo
            onBack={() => setGameView(null)}
            getRewardPoints={calcDebatePointReward}
            onSettleScore={(score) => onGainDebatePoints?.(calcDebatePointReward(score))}
          />
        </div>
      </div>
    )
  }

  const selectedShopItem = DEBATE_SHOP_ITEMS.find((item) => item.id === selectedShopItemId) ?? null

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
          <p className="debate-points">论道点：{debatePoints.toLocaleString()}</p>
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

        <div className="debate-shop gu-panel">
          <h4 className="debate-modes-title">论道商场</h4>
          <div className="debate-shop-list">
            {DEBATE_SHOP_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`debate-shop-card ${selectedShopItemId === item.id ? 'selected' : ''}`}
                onClick={() => setSelectedShopItemId(item.id)}
              >
                <div className="debate-shop-copy">
                  <span className="debate-shop-name">{item.name}</span>
                  <span className="debate-shop-desc">{item.category} · 每次兑换 {item.count} 份</span>
                </div>
                <span className="debate-shop-buy">
                  {item.cost} 论道点
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedShopItem && (
        <div className="debate-confirm-overlay" onClick={() => setSelectedShopItemId(null)}>
          <div className="debate-confirm-modal gu-panel" onClick={(e) => e.stopPropagation()}>
            <p className="debate-shop-confirm-text">
              确定兑换 {selectedShopItem.name} ×{selectedShopItem.count} 吗？
            </p>
            <p className="debate-shop-confirm-text">
              需要消耗 {selectedShopItem.cost} 论道点。
            </p>
            <div className="debate-confirm-actions">
              <button
                type="button"
                className="btn-debate-back"
                onClick={() => setSelectedShopItemId(null)}
              >
                取消
              </button>
              <button
                type="button"
                className="debate-mode-confirm"
                disabled={debatePoints < selectedShopItem.cost}
                onClick={() => {
                  onRedeemShopItem?.(selectedShopItem.id, selectedShopItem.cost, selectedShopItem.count)
                  setSelectedShopItemId(null)
                }}
              >
                确定兑换
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
