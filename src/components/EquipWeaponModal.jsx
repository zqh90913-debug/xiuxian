/**
 * 装备法宝确认弹窗
 */
import { getPillGradeColor } from '../data/items'
import './EquipWeaponModal.css'

export default function EquipWeaponModal({ show, item, onClose, onConfirm }) {
  if (!show || !item) return null

  return (
    <div className="equip-weapon-overlay" onClick={onClose}>
      <div className="equip-weapon-modal" onClick={(e) => e.stopPropagation()}>
        <h3>装备法宝</h3>
        <p
          className="weapon-name"
          style={{ color: getPillGradeColor(item.grade) }}
        >
          {item.name}
        </p>
        <p className="weapon-effect">攻击 +{item.attackBonus}</p>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>取消</button>
          <button className="btn-confirm" onClick={onConfirm}>确定装备</button>
        </div>
      </div>
    </div>
  )
}
