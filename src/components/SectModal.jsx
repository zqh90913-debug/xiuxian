/**
 * 宗门信息界面：显示已加入宗门的等级与介绍
 */
import './SectModal.css'

export default function SectModal({ show, onClose, sect, onLeaveSect }) {
  if (!show || !sect) return null

  return (
    <div className="sect-overlay" onClick={onClose}>
      <div className="sect-modal" onClick={(e) => e.stopPropagation()}>
        <div className="sect-header">
          <button type="button" className="btn-world-back" onClick={onClose}>
            返回
          </button>
          <h3>宗门</h3>
        </div>
        <div className="sect-content gu-panel">
          <h4 className="sect-name">
            {sect.name}
            <span className="sect-level">（{sect.levelLabel}）</span>
          </h4>
          <p className="sect-desc">{sect.desc}</p>
          <div className="sect-actions">
            <button
              type="button"
              className="btn-world-back"
              onClick={onLeaveSect}
            >
              退出宗门
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

