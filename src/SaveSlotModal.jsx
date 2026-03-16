import { useState } from 'react'
import './SaveSlotModal.css'

export default function SaveSlotModal({ show, onClose, slotCount, getSlotInfo, onSaveToSlot, onDeleteSlot }) {
  const [selectedIndex, setSelectedIndex] = useState(null)
  if (!show) return null
  const selectedInfo = selectedIndex != null ? getSlotInfo(selectedIndex) : null
  const selectedHasData = !!selectedInfo?.savedAt

  const handleSave = () => {
    if (selectedIndex != null) {
      onSaveToSlot(selectedIndex)
      setSelectedIndex(null)
      onClose()
    }
  }

  const handleDelete = () => {
    if (selectedIndex == null || !selectedHasData) return
    if (!window.confirm(`确定删除存档${selectedIndex + 1}吗？`)) return
    onDeleteSlot(selectedIndex)
    setSelectedIndex(null)
  }

  return (
    <div className="slot-modal-overlay" onClick={onClose}>
      <div className="slot-modal gu-panel" onClick={(e) => e.stopPropagation()}>
        <div className="slot-modal-header">
          <span className="panel-title">选择存档位</span>
          <button type="button" className="slot-modal-close" onClick={onClose}>×</button>
        </div>
        <div className="slot-modal-body">
          {Array.from({ length: slotCount }, (_, i) => {
            const info = getSlotInfo(i)
            return (
              <button
                key={i}
                type="button"
                className={`slot-block ${selectedIndex === i ? 'slot-block-selected' : ''}`}
                onClick={() => setSelectedIndex(i)}
              >
                <span className="slot-label">存档{i + 1}</span>
                {info?.savedAt
                  ? <span className="slot-time">{new Date(info.savedAt).toLocaleString('zh-CN')}</span>
                  : <span className="slot-empty">空</span>}
              </button>
            )
          })}
        </div>
        <div className="slot-modal-footer">
          <button
            type="button"
            className="slot-confirm-btn"
            onClick={handleSave}
            disabled={selectedIndex == null}
          >
            确定
          </button>
          <button
            type="button"
            className="slot-delete-btn"
            onClick={handleDelete}
            disabled={selectedIndex == null || !selectedHasData}
          >
            删除
          </button>
        </div>
      </div>
    </div>
  )
}
