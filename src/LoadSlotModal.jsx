import { useState } from 'react'
import './SaveSlotModal.css'

export default function LoadSlotModal({ show, onClose, slotCount, getSlotInfo, onLoad }) {
  const [selectedIndex, setSelectedIndex] = useState(null)
  if (!show) return null
  const handleConfirm = () => {
    if (selectedIndex != null) {
      onLoad(selectedIndex)
      setSelectedIndex(null)
      onClose()
    }
  }
  return (
    <div className="slot-modal-overlay" onClick={onClose}>
      <div className="slot-modal gu-panel" onClick={(e) => e.stopPropagation()}>
        <div className="slot-modal-header">
          <span className="panel-title">选择读档位</span>
          <button type="button" className="slot-modal-close" onClick={onClose}>×</button>
        </div>
        <div className="slot-modal-body">
          {Array.from({ length: slotCount }, (_, i) => {
            const info = getSlotInfo(i)
            const isEmpty = !info?.savedAt
            return (
              <button
                key={i}
                type="button"
                className={`slot-block ${selectedIndex === i ? 'slot-block-selected' : ''} ${isEmpty ? 'slot-block-disabled' : ''}`}
                onClick={() => !isEmpty && setSelectedIndex(i)}
                disabled={isEmpty}
              >
                <span className="slot-main">
                  <span className="slot-label">存档{i + 1}</span>
                  {info?.name && <span className="slot-name">{info.name}</span>}
                </span>
                {info?.savedAt
                  ? (
                    <span className="slot-meta">
                      {info.realmIndex != null && info.layer != null && (
                        <span className="slot-realm">境界 {info.realmIndex + 1}-{info.layer}</span>
                      )}
                      <span className="slot-time">{new Date(info.savedAt).toLocaleString('zh-CN')}</span>
                    </span>
                    )
                  : <span className="slot-empty">空</span>}
              </button>
            )
          })}
        </div>
        <div className="slot-modal-footer">
          <button
            type="button"
            className="slot-confirm-btn"
            onClick={handleConfirm}
            disabled={selectedIndex == null}
          >
            确定读取
          </button>
        </div>
      </div>
    </div>
  )
}
