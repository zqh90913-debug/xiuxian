/**
 * 状态面板 - 显示境界、修为、突破需求
 */
import './StatusPanel.css'

export default function StatusPanel({
  realm,
  cultivation,
  required,
}) {
  const progress = required != null && required > 0
    ? Math.min(100, (cultivation / required) * 100)
    : 0

  return (
    <div className="status-panel gu-panel">
      <div className="status-row">
        <span className="label">当前境界</span>
        <span className="value realm">{realm}</span>
      </div>
      <div className="status-row">
        <span className="label">当前修为</span>
        <span className="value cultivation">{cultivation.toLocaleString()}</span>
      </div>
      {required != null && (
        <div className="status-row breakthrough-row">
          <span className="label">突破所需</span>
          <span className="value">{required.toLocaleString()}</span>
          <div className="breakthrough-mini-bar">
            <div
              className="breakthrough-mini-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
