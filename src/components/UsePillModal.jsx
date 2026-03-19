/**
 * 使用丹药确认弹窗（突破丹：+5% 成功率；直接使用丹：如养魂丹 +修为）
 */
import { getPillGradeColor } from '../data/items'
import './UsePillModal.css'

export default function UsePillModal({ show, item, onClose, onConfirm }) {
  if (!show || !item) return null

  const isDirectUseGain = item.cultivationGain != null && item.cultivationGain > 0
  const effectText =
    item.id === 'cuiti_dan'
      ? '使用后增加 10 点生命上限（最多使用 50 次）'
      : item.id === 'longli_dan'
        ? '使用后增加 5 点攻击力（最多使用 50 次）'
        : item.id === 'shenxing_dan'
          ? '使用后增加 1 点速度（最多使用 10 次）'
          : item.fillCurrentRealm
            ? '使用后可补齐当前境界所需修为'
            : isDirectUseGain
              ? `使用后直接增加 ${item.cultivationGain.toLocaleString()} 修为`
              : '使用后提升当前大境界突破成功率 +5%'

  return (
    <div className="use-pill-overlay" onClick={onClose}>
      <div className="use-pill-modal" onClick={(e) => e.stopPropagation()}>
        <h3>使用丹药</h3>
        <p
          className="pill-name"
          style={{ color: getPillGradeColor(item.grade) }}
        >
          {item.name}
        </p>
        <p className="pill-effect">{effectText}</p>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>取消</button>
          <button className="btn-confirm" onClick={onConfirm}>确定使用</button>
        </div>
      </div>
    </div>
  )
}
