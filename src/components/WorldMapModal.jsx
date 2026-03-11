/**
 * 大世界：全屏地图界面，点击各域进入
 */
import { useState } from 'react'
import './WorldMapModal.css'

const REGIONS = [
  { id: 'east', name: '东域', desc: '山河连绵，宗门林立。' },
  { id: 'west', name: '西域', desc: '黄沙万里，秘境遍布。' },
  { id: 'south', name: '南域', desc: '蛮荒大泽，凶兽出没。' },
  { id: 'north', name: '北域', desc: '冰原雪域，寒气逼人。' },
  { id: 'center', name: '中域', desc: '万域交汇，道统云集。' },
]

export default function WorldMapModal({ show, onClose, onEnterRegion }) {
  const [activeRegionId, setActiveRegionId] = useState('center')

  if (!show) return null

  const activeRegion = REGIONS.find((r) => r.id === activeRegionId) ?? REGIONS[4]

  return (
    <div className="world-overlay" onClick={onClose}>
      <div className="world-modal" onClick={(e) => e.stopPropagation()}>
        <div className="world-header">
          <button
            type="button"
            className="btn-world-back"
            onClick={onClose}
          >
            返回
          </button>
          <h3>大世界</h3>
        </div>

        <div className="world-content">
          <div className="world-map gu-panel">
            <div className="world-map-inner">
              {REGIONS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  className={`world-region-node ${activeRegionId === r.id ? 'active' : ''} region-${r.id}`}
                  onClick={() => setActiveRegionId(r.id)}
                >
                  <span className="world-region-name">{r.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="world-region-detail gu-panel">
            <h4 className="world-region-title">{activeRegion.name}</h4>
            <p className="world-region-desc">{activeRegion.desc}</p>
            <button
              type="button"
              className="btn-enter-region"
              onClick={() => onEnterRegion?.(activeRegionId)}
            >
              进入此地
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

