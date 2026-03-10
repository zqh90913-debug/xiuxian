/**
 * 装备确认弹窗：法宝显示攻击加成，防具显示血量加成
 */
import { getPillGradeColor, ITEM_TYPES } from '../data/items'
import EquipmentPortrait from './EquipmentPortrait'
import './EquipWeaponModal.css'

export default function EquipWeaponModal({ show, item, onClose, onConfirm }) {
  if (!show || !item) return null

  const isArmor = item.type === ITEM_TYPES.ARMOR
  const title = isArmor ? '装备防具' : '装备法宝'
  const effectText = isArmor
    ? `血量 +${item.hpBonus ?? 0}`
    : `攻击 +${item.attackBonus ?? 0}`

  return (
    <div className="equip-weapon-overlay" onClick={onClose}>
      <div className="equip-weapon-modal" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <div className="equip-modal-portrait">
          {item.type === ITEM_TYPES.WEAPON || item.type === ITEM_TYPES.ARMOR ? (
            <EquipmentPortrait itemId={item.id} />
          ) : null}
        </div>
        <p
          className="weapon-name"
          style={{ color: getPillGradeColor(item.grade) }}
        >
          {item.name}
        </p>
        <p className="weapon-effect">{effectText}</p>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>取消</button>
          <button className="btn-confirm" onClick={onConfirm}>确定装备</button>
        </div>
      </div>
    </div>
  )
}
