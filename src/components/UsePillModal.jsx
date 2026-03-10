/**
 * 使用丹药确认弹窗（突破丹：+5% 成功率；直接使用丹：如凝气丹 +修为）
 */
import { getPillGradeColor } from '../data/items'
import './UsePillModal.css'

const REALM_NAMES = ['练气', '筑基', '金丹', '元婴', '化神', '合体', '渡劫', '大乘']

export default function UsePillModal({ show, item, onClose, onConfirm }) {
  if (!show || !item) return null

  const realmName = REALM_NAMES[item.realmIndex] ?? ''
  const isDirectUse = item.cultivationGain != null && item.cultivationGain > 0

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
        <p className="pill-effect">
          {isDirectUse
            ? `使用后直接增加 ${item.cultivationGain.toLocaleString()} 修为`
            : `使用后提升${realmName}突破成功率 +5%`}
        </p>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>取消</button>
          <button className="btn-confirm" onClick={onConfirm}>确定使用</button>
        </div>
      </div>
    </div>
  )
}
